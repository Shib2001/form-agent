export default function ThankYou() {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-3xl font-bold mb-4 text-green-600">
          Thank You for Joining ServeAmigo!
        </h1>
  
        <p className="text-lg max-w-xl">
          Your details have been received successfully.<br />
          Our team will now verify your documents and get in touch within
          <b> 24–48 hours.</b>
        </p>
      </div>
    );
  }
  