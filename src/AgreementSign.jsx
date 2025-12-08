import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignaturePad from "react-signature-canvas";
import { PDFDocument } from "pdf-lib";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzMTQQY1TWUJbn-OULyGtMq1ayKAaW_qJSVh5l8hBeryIGxKVNCpwGiCFaXrXTBC_WiMA/exec";

export default function AgreementSign() {
  const [userName, setUserName] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [uid, setUid] = useState(""); // phone number returned from backend
  const [verified, setVerified] = useState(false);
  const [signPad, setSignPad] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    setVerifyLoading(true);

    const res = await fetch(
      `${SCRIPT_URL}?action=checkAadhar&aadhar=${aadhar.trim()}`,
      { method: "GET" }
    );

    const data = await res.json();

    setVerifyLoading(false);

    if (!data.exists) {
      alert("User not found. Aadhar incorrect.");
      return;
    }

    // backend returns phone number as UID
    setUid(data.uid);
    setUserName(data.name);
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

    /* ------------------------------
    AUTO-FILL NAME + DATE
-------------------------------*/
page.drawText(userName, {
  x: 170,
  y: 295,
  size: 12,
});

page.drawText(new Date().toLocaleDateString("en-IN"), {
  x: 170,
  y: 278,
  size: 12,
});

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
    navigate("/agreement-signed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Partner Agreement Signing</h1>
            <p className="text-blue-100 text-sm mt-1">Verify your Aadhaar, review your agreement, then sign below.</p>
          </div>
          <div className="flex items-center gap-2 text-blue-100 text-sm">
            <span className="inline-block w-2 h-2 bg-green-300 rounded-full"></span>
            Secure Session
          </div>
        </div>

        <div className="p-8 space-y-8">
          {!verified ? (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Aadhaar Verification</h2>
              <p className="text-sm text-gray-600 mb-4">
                Enter your 12-digit Aadhaar number to verify your identity. We will fetch your UID to continue.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter full Aadhaar number"
                  maxLength={12}
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                />
                <button
                  onClick={verifyAadhar}
                  disabled={verifyLoading}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-5 py-3 rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-60"
                >
                  {verifyLoading && (
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {verifyLoading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Agreement Preview</h2>
                    <p className="text-sm text-gray-600">Review the document below before signing.</p>
                  </div>
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    Verified UID: {uid}
                  </span>
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                  <iframe
                    src={`https://docs.google.com/gview?embedded=true&url=${window.location.origin}/Agreement.pdf`}
                    width="100%"
                    height="600px"
                    title="Agreement Preview"
                  ></iframe>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Signature</h3>
                    <p className="text-sm text-gray-600">Draw your signature inside the box below.</p>
                  </div>
                  <button
                    onClick={() => signPad && signPad.clear()}
                    className="text-sm text-blue-600 font-semibold px-3 py-2 rounded border border-blue-100 hover:bg-blue-50"
                  >
                    Clear Signature
                  </button>
                </div>

                <div className="rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center p-4">
                  <SignaturePad
                    ref={(ref) => setSignPad(ref)}
                    penColor="black"
                    canvasProps={{
                      width: 700,
                      height: 220,
                      className: "bg-white shadow-inner rounded-lg",
                    }}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={createSignedPDF}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-5 py-3 rounded-lg shadow hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-60"
                  >
                    {loading && (
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {loading ? "Uploading..." : "Submit Signed PDF"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
