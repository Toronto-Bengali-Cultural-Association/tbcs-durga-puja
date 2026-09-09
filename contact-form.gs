/**
 * NOTE (live): the deployed web app is NOT this script — it was written
 * separately. This file is kept for the setup steps and as a reference
 * implementation.
 *
 * The live script reads e.parameter.fullName / .email / .subject / .message,
 * so the form's inputs are named to match. e.parameter lookups are
 * case-sensitive: the form originally sent Name/Email/Subject/Message, every
 * lookup returned undefined, and rows landed with only a timestamp.
 *
 * The form also sends a honeypot field named `Website`. The live script does
 * not check it, so bot posts straight to the endpoint are not filtered. To
 * add that, put this at the top of doPost:
 *     if (e.parameter.Website) return ContentService.createTextOutput('');
 */

/**
 * TBCS contact form -> Google Sheet
 * =================================
 *
 * This is Google Apps Script, not part of the website. It receives submissions
 * from the contact page and appends them as rows to a spreadsheet you own.
 *
 * ---------------------------------------------------------------------------
 * SETUP (about 5 minutes, do it while signed in as tbcscanada@gmail.com)
 * ---------------------------------------------------------------------------
 *
 *  1. Go to https://sheets.new and create a spreadsheet.
 *     Name it something like "TBCS website messages".
 *
 *  2. In that sheet: Extensions -> Apps Script. A code editor opens.
 *
 *  3. Delete whatever is in Code.gs and paste in this entire file. Save.
 *
 *  4. Deploy -> New deployment.
 *       - Click the gear next to "Select type" and choose "Web app"
 *       - Description:      contact form
 *       - Execute as:       Me (tbcscanada@gmail.com)
 *       - Who has access:   Anyone            <-- must be "Anyone", not
 *                                                 "Anyone with Google account"
 *     Click Deploy.
 *
 *  5. Google will ask you to authorize it. Because the script is yours and
 *     unverified, you will see "Google hasn't verified this app" — click
 *     "Advanced", then "Go to <project name> (unsafe)", then Allow. This is
 *     expected for your own scripts.
 *
 *  6. Copy the Web app URL. It ends in /exec, like:
 *       https://script.google.com/macros/s/AKfy..../exec
 *
 *  7. Send me that URL and I will paste it into the contact page. (Or do it
 *     yourself: in contact.html, put it inside data-endpoint="" on the form.)
 *
 * Until step 7 is done the form falls back to opening the visitor's email
 * client, so nothing is silently lost in the meantime.
 *
 * If you ever change this script, you must Deploy -> Manage deployments ->
 * edit -> Version: New version, or the live site keeps running the old copy.
 */

/** Where to send the heads-up email. Set to '' to turn notifications off. */
var NOTIFY = 'tbcscanada@gmail.com';

/** Tab within the spreadsheet that rows get appended to. */
var TAB = 'Messages';

function doPost(e) {
  // Two people submitting at the same instant could otherwise write to the
  // same row, so serialise appends.
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var params = (e && e.parameter) || {};

    // The website's honeypot field. Real visitors never see it, so anything
    // in it is a bot — accept the request and drop it on the floor.
    if (params.Website) {
      return json({ ok: true });
    }

    var name = String(params.Name || '').slice(0, 200);
    var email = String(params.Email || '').slice(0, 200);
    var subject = String(params.Subject || '').slice(0, 300);
    var message = String(params.Message || '').slice(0, 5000);

    if (!name && !email && !message) {
      return json({ ok: false, error: 'empty submission' });
    }

    var sheet = getSheet_();
    sheet.appendRow([new Date(), name, email, subject, message]);

    if (NOTIFY) {
      // Never let a mail failure (e.g. daily quota) lose the row itself.
      try {
        MailApp.sendEmail({
          to: NOTIFY,
          subject: 'tbcscanada.org — message from ' + (name || 'someone'),
          replyTo: email || undefined,
          body: [
            'Name:    ' + name,
            'Email:   ' + email,
            'Subject: ' + subject,
            '',
            message,
            '',
            '— sent from the contact form on tbcscanada.org'
          ].join('\n')
        });
      } catch (mailErr) {
        // row is already saved; nothing more to do
      }
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Visiting the /exec URL in a browser should say something friendly. */
function doGet() {
  return ContentService
    .createTextOutput('TBCS contact endpoint is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getSheet_() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(TAB) || book.insertSheet(TAB);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Received', 'Name', 'Email', 'Subject', 'Message']);
    sheet.getRange('A1:E1').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
