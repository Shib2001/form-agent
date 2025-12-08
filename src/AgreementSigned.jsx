export default function AgreementSigned() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-white px-6">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-green-100">
        <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-green-100 text-green-700 text-2xl">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Partner Agreement Signed
        </h1>
        <p className="text-gray-700 leading-relaxed">
          Your partner agreement document has been signed. You will receive the
          signed PDF in your email within the next 24–28 hours.
        </p>
      </div>
    </div>
  );
}


