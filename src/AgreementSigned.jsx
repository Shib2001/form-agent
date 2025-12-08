export default function AgreementSigned() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "linear-gradient(135deg, #f7fbff 0%, #eef4ff 100%)" }}
    >
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-10 text-center border border-[#0A4DAD1A] space-y-5">
        <div className="flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-white/90 shadow border border-[#0A4DAD22] flex items-center justify-center overflow-hidden">
            <img src="/serlogo.png" alt="ServeAmigo Logo" className="h-14 w-14 object-contain" />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div
            className="mx-auto w-14 h-14 flex items-center justify-center rounded-full text-2xl"
            style={{ backgroundColor: "#F6C336", color: "#0A4DAD" }}
          >
            ✓
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3" style={{ color: "#0A4DAD" }}>
          Partner Agreement Signed
        </h1>
        <p className="text-gray-800 leading-relaxed">
          Your partner agreement document has been signed. You will receive the
          signed PDF in your email within the next 24–28 hours.
        </p>
      </div>
    </div>
  );
}


