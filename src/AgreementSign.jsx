import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignaturePad from "react-signature-canvas";
import { PDFDocument } from "pdf-lib";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw8xCiGpiWLUrSjmkaO_NwOtFEfQu1TljrzgCg-vQO5CnbXFKE3CBvoVz2q7vtT6QCh/exec";

export default function AgreementSign() {
  const [userName, setUserName] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [uid, setUid] = useState(""); // phone number returned from backend
  const [verified, setVerified] = useState(false);
  const [signPad, setSignPad] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Safe base64 conversio
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
  y: 283,
  size: 12,
});

page.drawText(new Date().toLocaleDateString("en-IN"), {
  x: 165,
  y: 258,
  size: 12,
});

/* --------------------------------------
   DATE UNDER DIRECTOR | COO (Party 1)
---------------------------------------*/

// NEW: Add date for the top section  
// You will likely adjust x slightly if needed.
page.drawText(new Date().toLocaleDateString("en-IN"), {
  x: 170, 
  y: 405,  // <- this places it exactly on the blank near COO section
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
      x: 260,
      y: 198,
      width: 180,
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
    <div
      className="min-h-screen py-8 px-4 sm:py-10 sm:px-6"
      style={{ background: "linear-gradient(135deg, #f7fbff 0%, #eef4ff 100%)" }}
    >
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-[#0A4DAD12]">
        <div
          className="px-8 py-6 flex items-center justify-between"
          style={{ background: "linear-gradient(90deg, #0A4DAD 0%, #0A4DAD 70%, #F6C336 100%)" }}
        >
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
            <div className="bg-white border border-[#0A4DAD1A] rounded-xl p-6 shadow-md">
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
                  className="inline-flex items-center justify-center gap-2 text-white font-semibold px-5 py-3 rounded-lg shadow transition disabled:opacity-60"
                  style={{ background: "linear-gradient(90deg, #0A4DAD 0%, #0A4DAD 55%, #F6C336 100%)" }}
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
              <div className="bg-gray-50 border border-[#0A4DAD1A] rounded-xl p-6 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Agreement Preview</h2>
                    <p className="text-sm text-gray-600">Review the document below before signing.</p>
                  </div>
                  <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    Verified UID: {uid}
                  </span>
                </div>
                <div className="rounded-lg border border-[#0A4DAD1A] shadow-sm bg-white">
                <div className="rounded-lg border border-[#0A4DAD1A] shadow-sm bg-white">
                <iframe
  src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
    window.location.origin + "/Agreement.pdf"
  )}`}
  className="w-full"
  style={{
    height: "85vh",
    border: "none"
  }}
  title="Agreement Preview"
/>

               </div>

                </div>

              </div>

              <div className="bg-white border border-[#0A4DAD1A] rounded-xl p-6 shadow-md space-y-4">
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

                <div className="rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 p-4 overflow-auto">
                  <SignaturePad
                    ref={(ref) => setSignPad(ref)}
                    penColor="black"
                    canvasProps={{
                      width: 680,
                      height: 220,
                      className: "bg-white shadow-inner rounded-lg min-w-[520px]",
                    }}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={createSignedPDF}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 text-white font-semibold px-5 py-3 rounded-lg shadow transition disabled:opacity-60"
                    style={{ background: "linear-gradient(90deg, #0A4DAD 0%, #0A4DAD 55%, #F6C336 100%)" }}
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
