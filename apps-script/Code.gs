/**
 * ============================================================================
 *  Asha & Romeo — RSVP backend (Google Apps Script)
 * ----------------------------------------------------------------------------
 *  ONE Web App handles both:
 *    • doPost  → append an RSVP row to the Sheet   (called by /api/rsvp)
 *    • doGet   → return all rows as JSON           (called by /api/guests)
 *
 *  SETUP (5 minutes):
 *   1. Create a Google Sheet. Put these headers in row 1, columns A–O
 *      (exact order — must match the site):
 *
 *      Timestamp | Name | Email | Phone | WhatsApp | Flight Number |
 *      Arrival Airport | Arrival Time | Transport Required |
 *      Dietary Preference | Dietary Notes | Traditional Attire Required |
 *      Departure Airport | Departure Time | Departure Transport Required
 *
 *   2. Extensions → Apps Script. Paste this whole file. Save.
 *   3. Set SHEET_ID below (from the Sheet URL) — or leave "" to use the
 *      Sheet this script is bound to.
 *   4. Deploy → New deployment → type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *      Copy the Web App URL.
 *   5. In the Next.js app's `.env.local`, set:
 *        APPS_SCRIPT_RSVP_URL=<that Web App URL>
 *   6. (Re)deploy the site. Done.
 * ============================================================================
 */

var SHEET_ID = ""; // e.g. "1AbC...xyz"; leave "" if this script is bound to the Sheet
var SHEET_NAME = "Sheet1";

// Column order — keep in sync with the site + the Sheet header row.
var COLUMNS = [
  "name",
  "email",
  "phone",
  "whatsapp",
  "flightNumber",
  "arrivalAirport",
  "arrivalTime",
  "transportRequired",
  "dietaryPreference",
  "dietaryNotes",
  "traditionalAttireRequired",
  "departureAirport",
  "departureTime",
  "departureTransportRequired"
];

function getSheet_() {
  var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Append an RSVP. */
function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
    if (!body.name || !body.email) {
      return json_({ ok: false, error: "Missing required fields" });
    }
    var sheet = getSheet_();
    var row = [new Date()];
    for (var i = 0; i < COLUMNS.length; i++) {
      row.push(body[COLUMNS[i]] != null ? String(body[COLUMNS[i]]) : "");
    }
    sheet.appendRow(row);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Return all rows as an array of objects keyed by header. */
function doGet() {
  try {
    var sheet = getSheet_();
    var values = sheet.getDataRange().getValues();
    if (values.length < 2) return json_({ rows: [] });
    var headers = values[0];
    var rows = [];
    for (var r = 1; r < values.length; r++) {
      var obj = {};
      for (var c = 0; c < headers.length; c++) {
        var val = values[r][c];
        if (val instanceof Date) val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
        obj[headers[c]] = val;
      }
      rows.push(obj);
    }
    return json_({ rows: rows });
  } catch (err) {
    return json_({ rows: [], error: String(err) });
  }
}
