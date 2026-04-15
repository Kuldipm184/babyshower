/**
 * GOOGLE APPS SCRIPT — Mastering Motherhood RSVP
 *
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets → create a new spreadsheet.
 * 2. In Row 1 add these headers:
 *    Timestamp | Name | Email | Attending | Guests | Meal | Wishes
 * 3. Go to Extensions > Apps Script.
 * 4. Delete everything and paste this entire file.
 * 5. Click "Run" > select "setup" > authorize the app.
 * 6. Click "Deploy" (top right) > "New deployment".
 * 7. Type = "Web app", Execute as = "Me", Who has access = "Anyone".
 * 8. Click Deploy → copy the Web App URL.
 * 9. Paste the URL into script.js line 7 (SCRIPT_URL).
 */

function setup() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  // Dummy function to trigger the authorization prompt.
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (!e || !e.parameter) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', message: 'No parameters received' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var p = e.parameter;
  sheet.appendRow([
    new Date(),
    p.name || '',
    p.email || '',
    p.attending || '',
    p.guests || '',
    p.meal || '',
    p.wishes || ''
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ result: 'success' })
  ).setMimeType(ContentService.MimeType.JSON);
}
