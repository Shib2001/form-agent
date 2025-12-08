import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PDFDocument, StandardFonts } from "pdf-lib";

const SCRIPT_URL ="https://script.google.com/macros/s/AKfycbzH1QqUBngAzsgZbWPCiZhIsEoriczlXdPMqDjDc3Lkw5OmJoOjMj5O1Szr4290UTycHQ/exec"; // same as onboarding form

export default function EngagementLetterPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  const [otpSending, setOtpSending] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);

  const [finalizing, setFinalizing] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(
          `${SCRIPT_URL}?action=getUserDetails&id=${encodeURIComponent(id)}`
        );
        const data = await res.json();
        if (!data.success) {
          setError(data.error || "Unable to load details");
        } else if (data.alreadySigned) {
          setError("You have already submitted the signed engagement letter.");
        } else {
          setUser(data);
        }
      } catch (err) {
        setError("Something went wrong loading details.");
      }
      setLoading(false);
    }

    if (id) fetchUser();
    else {
      setError("Missing id in URL");
      setLoading(false);
    }
  }, [id]);

  async function handleSendOtp() {
    setOtpSending(true);
    setError("");
    try {
      const res = await fetch(
        `${SCRIPT_URL}?action=sendOtp&id=${encodeURIComponent(id)}`
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Unable to send OTP");
      } else {
        setOtpSent(true);
      }
    } catch (err) {
      setError("Unable to send OTP");
    }
    setOtpSending(false);
  }

  async function handleVerifyAndSign(e) {
    e.preventDefault();
    setOtpVerifying(true);
    setError("");

    try {
      const res = await fetch(
        `${SCRIPT_URL}?action=verifyOtp&id=${encodeURIComponent(
          id
        )}&otp=${encodeURIComponent(otp)}`
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Invalid OTP");
        setOtpVerifying(false);
        return;
      }
    } catch (err) {
      setError("Unable to verify OTP");
      setOtpVerifying(false);
      return;
    }

    // OTP ok -> generate signed PDF and upload
    setOtpVerifying(false);
    await generateAndUploadPdf();
  }

  async function generateAndUploadPdf() {
    if (!user) return;
    setFinalizing(true);
    setError("");
    setSuccess("");

    try {
      const existingPdfBytes = await fetch("/AGENT_ENGAGEMENT_LETTER.pdf").then(
        (res) => res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const page7 = pages[6]; // 7th page index

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 11;

      const nameText = user.fullName || "";
      const addressText = user.address || "";
      const designationText = "Partner";
      const today = new Date();
      const dateText = today.toLocaleDateString("en-IN");

      // ⚠ Coordinates may need small tuning after you preview.
      page7.drawText(nameText, {
        x: 200,
        y: 250,
        size: fontSize,
        font,
      });

      page7.drawText(designationText, {
        x: 200,
        y: 230,
        size: fontSize,
        font,
      });

      page7.drawText(addressText, {
        x: 200,
        y: 210,
        size: fontSize,
        font,
      });

      page7.drawText(dateText, {
        x: 200,
        y: 190,
        size: fontSize,
        font,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const file = new File(
        [blob],
        `Engagement_${(user.fullName || "Partner").replace(/\s+/g, "_")}_${id}.pdf`,
        { type: "application/pdf" }
      );

      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", id);
      formData.append("action", "uploadSignedPdf");

      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Unable to upload signed PDF");
      } else {
        setSuccess("Engagement letter submitted successfully.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while finalizing the PDF.");
    }

    setFinalizing(false);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p>Loading...</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-2">
        Engagement Letter – ServeAmigo
      </h1>

      {user && (
        <p className="text-sm text-gray-700">
          For: <b>{user.fullName}</b>
        </p>
      )}

      {/* PDF preview */}
      <div className="border rounded h-[600px]">
        <iframe
          title="Engagement Letter"
          src="/AGENT_ENGAGEMENT_LETTER.pdf#page=1"
          className="w-full h-full"
        />
      </div>

      {/* Acceptance checkbox */}
      <div className="flex items-center gap-3 mt-4">
        <input
          type="checkbox"
          className="w-4 h-4"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        <span>I have read and accept the terms of this engagement letter.</span>
      </div>

      {/* Send OTP button */}
      {!otpSent && (
        <button
          disabled={!accepted || otpSending}
          onClick={handleSendOtp}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {otpSending ? "Sending OTP..." : "Send OTP"}
        </button>
      )}

      {/* OTP form */}
      {otpSent && (
        <form onSubmit={handleVerifyAndSign} className="mt-4 space-y-3">
          <div>
            <label className="block mb-1 font-medium">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border rounded px-3 py-2 w-48"
              required
            />
          </div>

          <button
            type="submit"
            disabled={otpVerifying || finalizing}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
          >
            {otpVerifying || finalizing ? "Submitting..." : "Submit & Sign"}
          </button>
        </form>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
}
