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
 *  4. First run only: Google asks for permission to send mail as you.
 *     "Google hasn't verified this app" -> Advanced -> Go to <project>
 *     (unsafe) -> Allow. Expected for your own scripts.
 *
 *  5. Send a test message from tbcscanada.org/contact.html, check the inbox.
 *
 * The /exec URL does not change, so nothing on the website needs updating.
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

  var options = {
    to: TO,
    name: 'TBCS website',
    subject: 'tbcscanada.org — ' + (subject || 'message') + ' — from ' + (fullName || 'someone'),
    body: [
      'Name:    ' + (fullName || '(not given)'),
      'Email:   ' + (email || '(not given)'),
      'Subject: ' + (subject || '(not given)'),
      '',
      message,
      '',
      '---',
      'Sent from the contact form on tbcscanada.org'
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

/** Visiting the /exec URL in a browser answers here. */
function doGet() {
  return json({ status: 'ok' });
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
