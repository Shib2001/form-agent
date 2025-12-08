import React, { useState } from "react";
import SignaturePad from "react-signature-canvas";
import { PDFDocument } from "pdf-lib";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycby-L6Ju1oJG2EPP3QjnfNr1M6aqTXxfaVOkUFfCT5HYDAknvjNPzE6mNCyyTB4MJbAZdg/exec";

export default function AgreementSign() {
  const [aadhar, setAadhar] = useState("");
  const [uid, setUid] = useState(""); // phone number returned from backend
  const [verified, setVerified] = useState(false);
  const [signPad, setSignPad] = useState(null);
  const [loading, setLoading] = useState(false);

  // Safe base64 conversion
  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // ✅ VERIFY AADHAR WITH BACKEND
  const verifyAadhar = async () => {
    if (!aadhar.trim()) return alert("Please enter Aadhar number");

    const res = await fetch(
      `${SCRIPT_URL}?action=checkAadhar&aadhar=${aadhar.trim()}`,
      { method: "GET" }
    );

    const data = await res.json();

    if (!data.exists) {
      alert("User not found. Aadhar incorrect.");
      return;
    }

    // backend returns phone number as UID
    setUid(data.uid);
    setVerified(true);
  };

  // SIGN PDF
  const createSignedPDF = async () => {
    if (!signPad || signPad.isEmpty()) {
      alert("Please provide signature");
      return;
    }

    setLoading(true);

    const pdfBytes = await fetch(`${window.location.origin}/Agreement.pdf`)
    .then(res => res.arrayBuffer());
  

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[6]; // page 7

    // Signature image
    const signatureDataUrl = signPad.toDataURL();
    const signatureImageBytes = await fetch(signatureDataUrl).then((res) =>
      res.arrayBuffer()
    );
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

    // Draw signature only
    page.drawImage(signatureImage, {
      x: 170,
      y: 175,
      width: 220,
      height: 100,
    });

    const finalPdfBytes = await pdfDoc.save();
    const base64Pdf = arrayBufferToBase64(finalPdfBytes);

    // Upload to Apps Script
    const fd = new FormData();
    fd.append("action", "uploadPdf");
    fd.append("uid", uid); // phone number UID
    fd.append("pdf", base64Pdf);

    await fetch(SCRIPT_URL, {
      method: "POST",
      body: fd,
    });

    setLoading(false);
    alert("Signed PDF uploaded successfully!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {!verified ? (
        <>
          <h2 className="text-xl mb-4 font-semibold">
            Enter Aadhar Number
          </h2>

          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Enter full Aadhar number"
            maxLength={12}
            value={aadhar}
            onChange={(e) => setAadhar(e.target.value)}
          />

          <button
            onClick={verifyAadhar}
            className="bg-blue-600 text-white px-4 py-2 mt-3 rounded"
          >
            Verify
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold mb-4">Agreement Preview</h1>

          <iframe
            src={`https://docs.google.com/gview?embedded=true&url=${window.location.origin}/Agreement.pdf`}
            width="100%"
            height="600px"
            title="Agreement Preview"
            style={{ border: "1px solid #aaa" }}
          ></iframe>

          <h2 className="text-xl mt-8 mb-4 font-semibold">Sign Below</h2>

          <SignaturePad
            ref={(ref) => setSignPad(ref)}
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              className: "border",
            }}
          />

          <div className="mt-4">
            <button
              onClick={() => signPad.clear()}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Clear
            </button>

            <button
              onClick={createSignedPDF}
              disabled={loading}
              className="ml-3 bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Uploading..." : "Submit Signed PDF"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
