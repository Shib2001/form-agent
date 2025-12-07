import React, { useState } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwObApdxKDC1F-nSdx4pvzhXfVr2b-SIru_ynQYFBAXX8LfEpXBuYn0mUvr2-b4-1PS/exec";

export default function SimpleForm() {
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "",
    phone_number: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postal_code: "",
    dob: "",
    pan_number: "",
    aadhar_number: "",
    bank_name: "",
    account_holder: "",
    account_number: "",
    ifsc_code: "",
    experience: "",
    custom_link: "",
    declaration: false,
  });

  const [files, setFiles] = useState({
    profile_photo: null,
    pan_photo: null,
    aadhar_front: null,
    aadhar_back: null,
    cancelled_cheque: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles({
      ...files,
      [name]: selectedFiles[0],
    });
  };

  // Convert file to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve({
          base64: reader.result.split(",")[1],
          type: file.type,
          name: file.name,
        });
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();

    // Append all text values
    Object.keys(formValues).forEach((key) => {
      fd.append(key, formValues[key]);
    });

    // Append all files
    for (const key in files) {
      const fileObj = await fileToBase64(files[key]);
      if (fileObj) {
        fd.append(key, fileObj.base64);
        fd.append(`${key}_type`, fileObj.type);
        fd.append(`${key}_name`, fileObj.name);
      }
    }

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: fd,
      });

      alert("Form submitted successfully!");

      setFormValues({
        name: "",
        phone_number: "",
        email: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        postal_code: "",
        dob: "",
        pan_number: "",
        aadhar_number: "",
        bank_name: "",
        account_holder: "",
        account_number: "",
        ifsc_code: "",
        experience: "",
        custom_link: "",
        declaration: false,
      });

      setFiles({
        profile_photo: null,
        pan_photo: null,
        aadhar_front: null,
        aadhar_back: null,
        cancelled_cheque: null,
      });

    } catch (error) {
      alert("Error submitting form");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow rounded">
      <h2 className="text-center text-xl font-semibold mb-5">
        Partner Registration Form
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* All your inputs remain EXACTLY as you wrote them */}

        {/* Name */}
        <input type="text" name="name" placeholder="Full Name"
          className="w-full p-2 border rounded" onChange={handleChange} required />

        {/* Phone Number */}
        <input type="text" name="phone_number" placeholder="Phone Number"
          className="w-full p-2 border rounded" onChange={handleChange} required />

        {/* Email */}
        <input type="email" name="email" placeholder="Email"
          className="w-full p-2 border rounded" onChange={handleChange} required />

        {/* Profile Photo */}
        <input type="file" name="profile_photo"
          className="w-full" onChange={handleFileChange} required />

        {/* Address */}
        <input name="address1" placeholder="Address Line 1"
          className="w-full p-2 border rounded" onChange={handleChange} required />
        <input name="address2" placeholder="Address Line 2"
          className="w-full p-2 border rounded" onChange={handleChange} />

        <div className="grid grid-cols-2 gap-3">
          <input name="city" placeholder="City"
            className="p-2 border rounded" onChange={handleChange} required />
          <input name="state" placeholder="State"
            className="p-2 border rounded" onChange={handleChange} required />
        </div>

        <input name="postal_code" placeholder="Postal Code"
          className="w-full p-2 border rounded" onChange={handleChange} required />

        {/* DOB */}
        <input type="date" name="dob"
          className="w-full p-2 border rounded" onChange={handleChange} required />

        {/* PAN */}
        <input name="pan_number" placeholder="PAN Number"
          className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="file" name="pan_photo"
          className="w-full" onChange={handleFileChange} required />

        {/* Aadhaar */}
        <input name="aadhar_number" placeholder="Aadhaar Last 4 digits"
          className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="file" name="aadhar_front"
          className="w-full" onChange={handleFileChange} required />
        <input type="file" name="aadhar_back"
          className="w-full" onChange={handleFileChange} required />

        {/* Bank */}
        <input name="bank_name" placeholder="Bank Name"
          className="w-full p-2 border rounded" onChange={handleChange} required />
        <input name="account_holder" placeholder="Account Holder Name"
          className="w-full p-2 border rounded" onChange={handleChange} required />
        <input name="account_number" placeholder="Account Number"
          className="w-full p-2 border rounded" onChange={handleChange} required />
        <input name="ifsc_code" placeholder="IFSC Code"
          className="w-full p-2 border rounded" onChange={handleChange} required />

        {/* Cancelled Cheque */}
        <input type="file" name="cancelled_cheque"
          className="w-full" onChange={handleFileChange} required />

        {/* Experience */}
        <select name="experience"
          className="w-full p-2 border rounded"
          onChange={handleChange} required>
          <option value="">Any experience in selling insurance?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        {/* Custom Link */}
        <select name="custom_link"
          className="w-full p-2 border rounded"
          onChange={handleChange} required>
          <option value="">Want a personalised ServeAmigo Link?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        {/* Declaration */}
        <label className="flex items-center gap-2">
          <input type="checkbox" name="declaration"
            onChange={handleChange} required />
          <span>I confirm all terms & conditions</span>
        </label>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>
    </div>
  );
}

