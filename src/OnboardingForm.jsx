import React, { useState } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzNVI0xiPciByMscm9tELTvdCyij6TxQHQYkI58LKGIRcBc9TePNT1I1w6YcRoZSmHmLA/exec"; // <-- replace this

export default function OnboardingForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    // const formData = new FormData(e.target);
  //-------------------------------------------------------------------------------------------------------------------//

  const formData = new FormData();

// Append text fields safely
formData.append("fullName", e.target.fullName.value);
formData.append("phone", e.target.phone.value);
formData.append("email", e.target.email.value);
formData.append("address1", e.target.address1.value);
formData.append("address2", e.target.address2.value);
formData.append("city", e.target.city.value);
formData.append("postalCode", e.target.postalCode.value);
formData.append("state", e.target.state.value);
formData.append("dob", e.target.dob.value);
formData.append("panNumber", e.target.panNumber.value);
formData.append("aadharNumber", e.target.aadharNumber.value);
formData.append("bankName", e.target.bankName.value);
formData.append("accountHolderName", e.target.accountHolderName.value);
formData.append("accountNumber", e.target.accountNumber.value);
formData.append("ifscCode", e.target.ifscCode.value);
formData.append("experience", e.target.experience.value);
formData.append("wantLink", e.target.wantLink.value);
formData.append("declaration", e.target.declaration.checked ? "Yes" : "No");

// Append FILES manually
formData.append("profilePhoto", e.target.profilePhoto.files[0]);
formData.append("panPhoto", e.target.panPhoto.files[0]);
formData.append("aadharFrontPhoto", e.target.aadharFrontPhoto.files[0]);
formData.append("aadharBackPhoto", e.target.aadharBackPhoto.files[0]);
formData.append("cancelledChequePhoto", e.target.cancelledChequePhoto.files[0]);


    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Form submitted successfully!");
        e.target.reset();
      } else {
        setError("Error: " + result.error);
      }
    } catch (err) {
      setError("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Partner Onboarding Form</h1>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">

        {/* Full Name */}
        <input
          name="fullName"
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded"
          required
        />

        {/* Phone */}
        <input
          name="phone"
          type="text"
          placeholder="Phone Number"
          className="w-full p-3 border rounded"
          required
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded"
          required
        />

        {/* Address */}
        <input
          name="address1"
          type="text"
          placeholder="Address line 1"
          className="w-full p-3 border rounded"
        />

        <input
          name="address2"
          type="text"
          placeholder="Address line 2"
          className="w-full p-3 border rounded"
        />

        {/* City */}
        <input
          name="city"
          type="text"
          placeholder="City"
          className="w-full p-3 border rounded"
        />
        <input
  name="postalCode"
  type="text"
  placeholder="Postal code"
  className="w-full p-3 border rounded"
/>


        {/* State */}
        <input
          name="state"
          type="text"
          placeholder="State"
          className="w-full p-3 border rounded"
        />

        {/* DOB */}
        <input
          name="dob"
          type="date"
          placeholder="Date of Birth"
          className="w-full p-3 border rounded"
        />

        {/* PAN */}
        <input
          name="panNumber"
          type="text"
          placeholder="PAN Number"
          className="w-full p-3 border rounded"
        />

        {/* Aadhar */}
        <input
          name="aadharNumber"
          type="text"
          placeholder="Aadhar Number"
          className="w-full p-3 border rounded"
        />

        {/* Bank */}
        <input
          name="bankName"
          type="text"
          placeholder="Bank Name"
          className="w-full p-3 border rounded"
        />

        <input
          name="accountHolderName"
          type="text"
          placeholder="Account Holder Name"
          className="w-full p-3 border rounded"
        />

        <input
          name="accountNumber"
          type="text"
          placeholder="Account Number"
          className="w-full p-3 border rounded"
        />

        <input
          name="ifscCode"
          type="text"
          placeholder="IFSC Code"
          className="w-full p-3 border rounded"
        />

        {/* Experience */}
        <div>
  <p className="font-medium mb-1">Do you have any prior experience in selling insurance?</p>

  <div className="flex items-center gap-4">
    <label className="flex items-center gap-2">
      <input type="radio" name="experience" value="Yes" required />
      Yes
    </label>

    <label className="flex items-center gap-2">
      <input type="radio" name="experience" value="No" required />
      No
    </label>
  </div>
</div>


        {/* Want link */}
        <div>
  <p className="font-medium mb-1">Do you want a personalised ServeAmigo link?</p>

  <div className="flex items-center gap-4">
    <label className="flex items-center gap-2">
      <input type="radio" name="wantLink" value="Yes" required />
      Yes
    </label>

    <label className="flex items-center gap-2">
      <input type="radio" name="wantLink" value="No" required />
      No
    </label>
  </div>
</div>

        {/* Declaration */}
        <div className="flex items-center gap-3">
  <input
    type="checkbox"
    name="declaration"
    value="I accept this form"
    required
    className="w-4 h-4"
  />
  <label className="font-medium">I accept this form</label>
</div>


        {/* File Inputs */}
        <label className="block font-medium">Profile Photo</label>
        <input name="profilePhoto" type="file" accept="image/*" className="w-full" required />

        <label className="block font-medium">PAN Photo</label>
        <input name="panPhoto" type="file" accept="image/*" className="w-full" required />

        <label className="block font-medium">Aadhar Front Photo</label>
        <input name="aadharFrontPhoto" type="file" accept="image/*" className="w-full" required />

        <label className="block font-medium">Aadhar Back Photo</label>
        <input name="aadharBackPhoto" type="file" accept="image/*" className="w-full" required />

        <label className="block font-medium">Cancelled Cheque Photo</label>
        <input name="cancelledChequePhoto" type="file" accept="image/*" className="w-full" required />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-medium"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {/* Status Messages */}
        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
