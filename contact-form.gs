/**
 * TBCS contact form -> email
 * ==========================
 *
 * Google Apps Script, not part of the website. It receives contact-form
 * submissions from tbcscanada.org and emails them to the address in TO.
 *
 * Replaces the earlier sheet-based version. The website needs no changes: it
 * already posts the field names this reads, and redeploying keeps the same
 * /exec URL.
 *
 * ---------------------------------------------------------------------------
 * HOW TO INSTALL (signed in as tbcscanada@gmail.com)
 * ---------------------------------------------------------------------------
 *
 *  1. Open your Apps Script project (from the sheet: Extensions -> Apps Script).
 *
 *  2. Select everything in Code.gs and replace it with this file. Save.
 *
 *  3. Deploy -> Manage deployments -> pencil (edit) icon
 *       -> Version: **New version**   <-- the step people miss. Saving alone
 *          changes nothing; the web app keeps serving the old code until you
 *          publish a new version.
 *       -> Deploy
 *
 *  4. AUTHORIZE THE MAIL SCOPE. Sending email needs a permission the old
 *     sheet-only script never asked for, and *redeploying does not prompt for
 *     it*. Until you grant it the form fails with:
 *         "You do not have permission to call MailApp.sendEmail"
 *     To grant it: in the editor, pick `sendTestEmail` from the function
 *     dropdown next to Run, and click Run. Google shows "Google hasn't
 *     verified this app" -> Advanced -> Go to <project> (unsafe) -> Allow.
 *     A test email lands in TO, which confirms sending works.
 *
 *  5. CONFIRM THE PASTE IS ACTUALLY LIVE. Open the /exec URL in a browser.
 *     It answers with JSON containing a version field. If that is not the
 *     VERSION string below, the deployment is still serving the old code and
 *     nothing you do to the inbox will change. Two usual reasons:
 *       - the version dropdown was left on the existing version instead of
 *         'New version', so Deploy published the same code again;
 *       - 'New deployment' was used instead of editing the existing one, which
 *         mints a *different* /exec URL. The website still posts to the old
 *         one, so the old code still runs. Either edit the original deployment
 *         or put the new URL in contact.html.
 *
 *  6. Send a real message from tbcscanada.org/contact.html, check the inbox.
 *
 *  7. Set up the Gmail filter described under MAKING THESE EASY TO SPOT below.
 *     The subject and preview changes help, but the filter is what stops these
 *     being missed, because the From column will always read 'me'.
 *
 * The /exec URL does not change, so nothing on the website needs updating.
 *
 * ---------------------------------------------------------------------------
 * MAKING THESE EASY TO SPOT IN THE INBOX
 * ---------------------------------------------------------------------------
 * Enquiries were being missed. Three separate causes, and only two of them are
 * fixable in this file.
 *
 * 1. THE SUBJECT (fixed here). Gmail shows roughly 70 characters of subject and
 *    cuts the rest. The old line led with 'tbcscanada.org - ', so the visitor's
 *    actual subject started 17 characters in and was often past the cut. It now
 *    reads '[TBCS] Vendor Table (Monica Nagpal)'.
 *
 * 2. THE PREVIEW (fixed here). The grey snippet beside the subject is the start
 *    of the body, which used to be Name/Email/Subject lines repeating what the
 *    subject already said. The message now comes first, so the list row shows
 *    what the person actually wrote.
 *
 * 3. THE SENDER SAYING 'me' (NOT fixable here). The script runs as
 *    tbcscanada@gmail.com and sends to tbcscanada@gmail.com, and Gmail labels
 *    anything from your own address 'me'. The `name` option below does not
 *    override it. Two ways out, neither of them code in this file:
 *
 *      a. A GMAIL FILTER, which is the quick one and worth doing regardless.
 *         Gmail -> Settings -> Filters and Blocked Addresses -> Create a new
 *         filter. Put  [TBCS]  in the Subject box, Create filter, then tick
 *         'Apply the label' (make one called Website) and 'Never send it to
 *         Spam'. Ticking 'Always mark it as important' helps too. Enquiries
 *         then arrive with a coloured label chip, and the Website label in the
 *         sidebar shows an unread count. Tick 'Also apply to matching
 *         conversations' to catch the ones already sitting in the inbox.
 *
 *      b. RUN THE SCRIPT FROM A SECOND GOOGLE ACCOUNT. Sending from an address
 *         that is not tbcscanada@gmail.com is the only way the From column
 *         stops saying 'me'. Copy this project into another account, deploy it
 *         there, and put the new /exec URL in contact.html. More moving parts,
 *         so only worth it if the filter is not enough.
 *
 * ---------------------------------------------------------------------------
 * NOTES
 * ---------------------------------------------------------------------------
 * - Replies work: reply-to is set to the address the visitor typed, so hitting
 *   Reply in Gmail writes back to them rather than to yourself.
 * - A consumer Gmail account can send about 100 emails/day from Apps Script.
 *   Far above contact-form volume, but it is a real ceiling.
 * - ALSO_LOG_TO_SHEET is off, per the request for email instead of a sheet.
 *   The tradeoff is worth knowing: if a send ever fails (quota, outage) the
 *   message is gone, whereas a sheet row is a durable record you can search
 *   later. Set it to true to get both.
 */

/**
 * Bumped by hand whenever this file changes. Visiting the /exec URL in a
 * browser shows it, which is the only way to tell from outside which code a
 * deployment is actually serving. Saving the editor does not change what the
 * web app runs, and a new deployment gets a new URL, so "I pasted it and it
 * still behaves the old way" is normally one of those two. Check the URL: if
 * the version below is not what comes back, the paste is not live.
 */
var VERSION = '2026-09-19-subject-preview';

/** Where submissions are emailed. */
var TO = 'tbcscanada@gmail.com';

/** Also append each message to the spreadsheet as a backup record. */
var ALSO_LOG_TO_SHEET = false;

/** Tab used when ALSO_LOG_TO_SHEET is true. */
var TAB = 'Messages';

function doPost(e) {
  var p = (e && e.parameter) || {};

  // Honeypot: the form has a hidden field named Website that people never see.
  // Anything in it is a bot. Accept the request so it does not retry, drop it.
  if (p.Website) {
    return json({ status: 'success' });
  }

  var fullName = trim_(p.fullName, 200);
  var email    = trim_(p.email, 200);
  var subject  = trim_(p.subject, 300);
  var message  = trim_(p.message, 5000);

  if (!fullName && !email && !message) {
    return json({ status: 'ignored', reason: 'empty submission' });
  }

  /* Subject line, built to survive the inbox list rather than to read well on
     its own. Gmail shows roughly 70 characters and cuts the rest, so the tag is
     short and what the visitor typed comes first. The old line spent its first
     17 characters on 'tbcscanada.org - ' and pushed the real subject past the
     cut, which is how these got missed. [TBCS] is also the hook for a Gmail
     filter, so it stays first and stays exactly this. */
  var label = subject || 'Message';
  if (label.length > 40) label = label.slice(0, 39) + '\u2026';
  var who = fullName || 'someone';
  if (who.length > 20) who = who.slice(0, 19) + '\u2026';
  // 7 for the tag, 3 for the brackets and space: 40 + 20 + 10 caps the line at
  // 70, which is about what Gmail shows before it cuts.

  var options = {
    to: TO,
    name: 'TBCS website',
    subject: '[TBCS] ' + label + ' (' + who + ')',
    /* The message goes first. Gmail's preview snippet is the opening of the
       body, and it used to be spent on Name/Email/Subject lines that repeat
       what is already in the subject, so the list row never showed a word of
       the actual enquiry. Details move below the rule, where they are still
       one glance away once the mail is open. */
    body: [
      message || '(no message)',
      '',
      '---',
      'From:    ' + (fullName || '(name not given)') + (email ? ' <' + email + '>' : ''),
      'Subject: ' + (subject || '(not given)'),
      'Sent from the contact form on tbcscanada.org',
      email ? 'Hit Reply to answer them directly.' : 'No address given, so Reply will not reach them.'
    ].join('\n')
  };

  // Only set replyTo for a plausible address — MailApp throws on a malformed
  // one, which would lose an otherwise good message.
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    options.replyTo = email;
  }

  MailApp.sendEmail(options);

  if (ALSO_LOG_TO_SHEET) {
    try {
      appendRow_(fullName, email, subject, message);
    } catch (err) {
      // The email is already sent; a logging failure must not fail the request.
    }
  }

  return json({ status: 'success' });
}

/** Visiting the /exec URL in a browser answers here. Reports VERSION so the
 *  deployed code can be identified without sending a test email. */
function doGet() {
  return json({ status: 'ok', version: VERSION });
}

/**
 * Run this once from the editor to grant the mail permission (see step 4).
 * Sending email needs the script.send_mail scope, which the sheet-only version
 * never required — and publishing a deployment does not ask for it. Running any
 * function that calls MailApp does.
 */
function sendTestEmail() {
  MailApp.sendEmail({
    to: TO,
    name: 'TBCS website',
    subject: 'TBCS contact form — permission check',
    body: 'If you are reading this, the script can send email and the contact form is ready.'
  });
}

function trim_(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max);
}

function appendRow_(fullName, email, subject, message) {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  // Named lookup rather than getActiveSheet(), which follows whichever tab
  // happens to be selected and can silently start writing to the wrong one.
  var sheet = book.getSheetByName(TAB) || book.insertSheet(TAB);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Full Name', 'Email', 'Subject', 'Message']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([new Date(), fullName, email, subject, message]);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
