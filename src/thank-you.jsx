export default function ThankYou() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #f7fbff 0%, #eef4ff 100%)" }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#0A4DAD12] px-8 py-10 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-white/90 shadow border border-[#0A4DAD22] flex items-center justify-center overflow-hidden">
            <img src="/serlogo.png" alt="ServeAmigo Logo" className="h-14 w-14 object-contain" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3" style={{ color: "#0A4DAD" }}>
          Thank You for Joining ServeAmigo!
        </h1>

        <p className="text-lg text-gray-800 leading-relaxed">
          Your details have been received successfully.<br />
          Our team will verify your documents and get in touch within <b>24–48 hours.</b>
        </p>

        <a
          href="/"
          className="inline-flex items-center justify-center mt-8 px-6 py-3 text-white rounded-lg shadow-lg font-semibold"
          style={{ background: "linear-gradient(90deg, #0A4DAD 0%, #0A4DAD 60%, #F6C336 100%)" }}
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}