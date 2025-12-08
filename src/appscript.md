/* ======================================================
   CONFIG
====================================================== */
var sheetName = "Sheet1";
var folderID = "1mtIXor7pshPQ9w43qpxBXkLWth4MbBoG"; // Upload folder
var scriptProperties = PropertiesService.getScriptProperties();

/* ======================================================
   INITIAL SETUP (run once manually)
====================================================== */
function initialSetup() {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProperties.setProperty("key", activeSpreadsheet.getId());
}

/* ======================================================
   ROUTER — Handles GET & POST
====================================================== */

function doPost(e) {
  Logger.log("POST BODY: " + JSON.stringify(e.parameter));

  const action = e.parameter.action;

  if (action === "uploadPdf") {
    return uploadSignedPdf(e);
  }

  // Default = registration
  return handleRegistration(e);
}

function doGet(e) {
  const action = e.parameter.action;

  if (action === "checkAadhar") {
    return checkAadhar(e);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ error: "Invalid GET request" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ======================================================
   1) REGISTRATION HANDLER
====================================================== */

function handleRegistration(e) {
  Logger.log("RAW POST: " + JSON.stringify(e.parameter));
  try {
    var sheet = SpreadsheetApp.openById(scriptProperties.getProperty("key"))
      .getSheetByName(sheetName);

    var folder = DriveApp.getFolderById(folderID);

    // Build row
    var row = [];

    row.push(e.parameter.name || "");               // A
    row.push(e.parameter.phone_number || "");       // B
    row.push(e.parameter.email || "");              // C
    row.push("");                                   // D profile_photo
    row.push(e.parameter.address1 || "");           // E
    row.push(e.parameter.address2 || "");           // F
    row.push(e.parameter.city || "");               // G
    row.push(e.parameter.state || "");              // H
    row.push(e.parameter.postal_code || "");        // I
    row.push(e.parameter.dob || "");                // J
    row.push(e.parameter.pan_number || "");         // K
    row.push("");                                   // L pan_photo
    row.push(e.parameter.aadhar_number || "");      // M
    row.push("");                                   // N aadhar_front
    row.push("");                                   // O aadhar_back
    row.push(e.parameter.bank_name || "");          // P
    row.push(e.parameter.account_holder || "");     // Q
    row.push(e.parameter.account_number || "");     // R
    row.push(e.parameter.ifsc_code || "");          // S
    row.push("");                                   // T cancelled_cheque
    row.push(e.parameter.experience || "");         // U
    row.push(e.parameter.custom_link || "");        // V
    row.push(e.parameter.declaration === "true" ? "Yes" : "No"); // W
    row.push(new Date());                           // X timestamp

    // File upload helper
    function uploadFile(fieldName, columnIndex) {
      var base = e.parameter[fieldName];
      var type = e.parameter[fieldName + "_type"];
      var name = e.parameter[fieldName + "_name"];

      if (base && type) {
        var blob = Utilities.newBlob(
          Utilities.base64Decode(base),
          type,
          name
        );
        var file = folder.createFile(blob);
        row[columnIndex] = file.getUrl();
      }
    }

    uploadFile("profile_photo", 3);
    uploadFile("pan_photo", 11);
    uploadFile("aadhar_front", 13);
    uploadFile("aadhar_back", 14);
    uploadFile("cancelled_cheque", 19);

    // Append row
    sheet.appendRow(row);

    // FIX: correct row index for newly added row
    var newRowIndex = sheet.getLastRow();

    // Add UID (phone number) into Column AE (31)
    sheet.getRange(newRowIndex, 31).setValue(e.parameter.phone_number);

    // Confirmation email
MailApp.sendEmail({
  to: e.parameter.email,
  subject: "ServeAmigo Registration Received",
  htmlBody: `
    <p>Hello ${e.parameter.name},</p>
    <p>Your registration has been received successfully.</p>
    <p>Our team will review your KYC shortly.</p>
    <br>
    <p>Thank you,<br>ServeAmigo Team</p>
  `
});


    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* ======================================================
   2) SIGNED PDF UPLOAD HANDLER
====================================================== */

function uploadSignedPdf(e) {
  try {
    const uid = String(e.parameter.uid).trim();
    const pdfBase64 = e.parameter.pdf;

    const blob = Utilities.newBlob(
      Utilities.base64Decode(pdfBase64),
      "application/pdf",
      `Signed_Agreement_${uid}.pdf`
    );

    const folder = DriveApp.getFolderById(folderID);
    const file = folder.createFile(blob);
    const url = file.getUrl();

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    const data = sheet.getDataRange().getValues();
    const header = data[0];

    const uidCol = header.indexOf("unique_id");
    const signedCol = header.indexOf("Signed pdf");
    const signedTimeCol = header.indexOf("Signed pdf Timestamp");

    if (uidCol === -1) throw new Error("unique_id column missing");

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][uidCol]).trim() === uid) {
        const row = i + 1;
        sheet.getRange(row, signedCol + 1).setValue(url);
        sheet.getRange(row, signedTimeCol + 1).setValue(new Date());
        break;
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "OK", url }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* ======================================================
   3) AADHAAR CHECK (for login access)
====================================================== */

function checkAadhar(e) {
  const aadhar = String(e.parameter.aadhar).trim();

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const data = sheet.getDataRange().getValues();
  const header = data[0];

  const aadharCol = header.indexOf("aadhar_number");
  const phoneCol = header.indexOf("phone_number");

  if (aadharCol === -1) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: "aadhar_number column missing" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  let exists = false;
  let uid = null;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][aadharCol]).trim() === aadhar) {
      exists = true;
      uid = data[i][phoneCol];  // phone is used as UID
      break;
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ exists, uid })
  ).setMimeType(ContentService.MimeType.JSON);
}

/* ======================================================
   4) KYC MAILER (menu button)
====================================================== */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Teams Help")
    .addItem("Send Mail", "sendKycMail")
    .addItem("Generate Agent Codes", "generateAgentCodes")
    .addToUi();
}

function sendKycMail() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("Sheet1");
  const data = sheet.getDataRange().getValues();

  const header = data[0];

  const emailIndex = header.indexOf("email");
  const nameIndex = header.indexOf("name");
  const statusIndex = header.indexOf("Kyc Status");
  const tsIndex = header.indexOf("Kyc Timestamp");

  for (let i = 1; i < data.length; i++) {
    const email = data[i][emailIndex];
    const name = data[i][nameIndex];
    const status = (data[i][statusIndex] + "").toLowerCase().trim();
    const timestamp = data[i][tsIndex];

    // Skip already sent rows
    if (timestamp) continue;

    if (status === "approved") {
      MailApp.sendEmail({
        to: email,
        subject: "Your KYC Has Been Approved",
        htmlBody: `
          <p>Hello ${name},</p>
          <p>Your KYC has been <b>approved</b>.</p>

          <p>You can now sign your Partner Agreement:</p>

          <p>
            <a href="https://form-agent-psi.vercel.app/agreement-sign"
               style="
                 display:inline-block;
                 padding:12px 18px;
                 background:#1a73e8;
                 color:white;
                 text-decoration:none;
                 border-radius:6px;
                 font-weight:bold;
               ">
              Click Here to Sign Agreement
            </a>
          </p>

          <p>If the button does not work, open the link:</p>
          <p>https://form-agent-psi.vercel.app/agreement-sign</p>
        `
      });

      sheet.getRange(i + 1, tsIndex + 1).setValue(new Date());
    }

    if (status === "rejected") {
      MailApp.sendEmail({
        to: email,
        subject: "Your KYC Has Been Rejected",
        htmlBody: `
          <p>Hello ${name},</p>
          <p>Your KYC was <b>rejected</b>.</p>
          <p>Please contact support for help.</p>
        `
      });

      sheet.getRange(i + 1, tsIndex + 1).setValue(new Date());
    }
  }
}



/* ======================================================
   5) GENERATE AGENT CODES
====================================================== */

function generateAgentCodes() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const data = sheet.getDataRange().getValues();

  const header = data[0];

  const agentCodeCol = header.indexOf("Agent code");          // AA
  const agentStatusCol = header.indexOf("Agent code status"); // AB

  if (agentCodeCol === -1 || agentStatusCol === -1) {
    SpreadsheetApp.getUi().alert("Missing required columns: Agent code / Agent code status");
    return;
  }

  // Find last used agent code number
  let lastNumber = 179; // so first becomes SAP180

  for (let i = 1; i < data.length; i++) {
    const existingCode = data[i][agentCodeCol];

    if (existingCode && existingCode.startsWith("SAP")) {
      const num = parseInt(existingCode.replace("SAP", ""), 10);
      if (!isNaN(num) && num > lastNumber) {
        lastNumber = num;
      }
    }
  }

  let generatedCount = 0;

  // Loop rows to generate new codes
  for (let i = 1; i < data.length; i++) {
    const rowStatus = (data[i][agentStatusCol] + "").trim().toLowerCase();
    const existingCode = data[i][agentCodeCol];

    // Only generate if:
    // 1) Status = approved
    // 2) Agent code is empty
    if (rowStatus === "approved" && !existingCode) {

      lastNumber++;
      const newCode = "SAP" + lastNumber;

      // Write agent code
      sheet.getRange(i + 1, agentCodeCol + 1).setValue(newCode);

      // Update status timestamp or mark generated
      sheet.getRange(i + 1, agentStatusCol + 1).setValue("generated");

      generatedCount++;
    }
  }

  SpreadsheetApp.getUi().alert(
    generatedCount > 0
      ? `${generatedCount} agent codes generated successfully.`
      : "No rows require agent code generation."
  );
}
