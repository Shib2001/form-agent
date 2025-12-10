// import React, { useState } from "react";

// const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwObApdxKDC1F-nSdx4pvzhXfVr2b-SIru_ynQYFBAXX8LfEpXBuYn0mUvr2-b4-1PS/exec";

// export default function SimpleForm() {
//   const [loading, setLoading] = useState(false);

//   const [formValues, setFormValues] = useState({
//     name: "",
//     phone_number: "",
//     email: "",
//     address1: "",
//     address2: "",
//     city: "",
//     state: "",
//     postal_code: "",
//     dob: "",
//     pan_number: "",
//     aadhar_number: "",
//     bank_name: "",
//     account_holder: "",
//     account_number: "",
//     ifsc_code: "",
//     experience: "",
//     custom_link: "",
//     declaration: false,
//   });

//   const [files, setFiles] = useState({
//     profile_photo: null,
//     pan_photo: null,
//     aadhar_front: null,
//     aadhar_back: null,
//     cancelled_cheque: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormValues({
//       ...formValues,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleFileChange = (e) => {
//     const { name, files: selectedFiles } = e.target;
//     setFiles({
//       ...files,
//       [name]: selectedFiles[0],
//     });
//   };

//   // Convert file to Base64
//   const fileToBase64 = (file) => {
//     return new Promise((resolve) => {
//       if (!file) return resolve(null);

//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => {
//         resolve({
//           base64: reader.result.split(",")[1],
//           type: file.type,
//           name: file.name,
//         });
//       };
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const fd = new FormData();

//     // Append all text values
//     Object.keys(formValues).forEach((key) => {
//       fd.append(key, formValues[key]);
//     });

//     // Append all files
//     for (const key in files) {
//       const fileObj = await fileToBase64(files[key]);
//       if (fileObj) {
//         fd.append(key, fileObj.base64);
//         fd.append(`${key}_type`, fileObj.type);
//         fd.append(`${key}_name`, fileObj.name);
//       }
//     }

//     try {
//       await fetch(SCRIPT_URL, {
//         method: "POST",
//         body: fd,
//       });

//       alert("Form submitted successfully!");

//       setFormValues({
//         name: "",
//         phone_number: "",
//         email: "",
//         address1: "",
//         address2: "",
//         city: "",
//         state: "",
//         postal_code: "",
//         dob: "",
//         pan_number: "",
//         aadhar_number: "",
//         bank_name: "",
//         account_holder: "",
//         account_number: "",
//         ifsc_code: "",
//         experience: "",
//         custom_link: "",
//         declaration: false,
//       });

//       setFiles({
//         profile_photo: null,
//         pan_photo: null,
//         aadhar_front: null,
//         aadhar_back: null,
//         cancelled_cheque: null,
//       });

//     } catch (error) {
//       alert("Error submitting form");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow rounded">
//       <h2 className="text-center text-xl font-semibold mb-5">
//         Partner Registration Form
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">

//         {/* All your inputs remain EXACTLY as you wrote them */}

//         {/* Name */}
//         <input type="text" name="name" placeholder="Full Name"
//           className="w-full p-2 border rounded" onChange={handleChange} required />

//         {/* Phone Number */}
//         <input type="text" name="phone_number" placeholder="Phone Number"
//           className="w-full p-2 border rounded" onChange={handleChange} required />

//         {/* Email */}
//         <input type="email" name="email" placeholder="Email"
//           className="w-full p-2 border rounded" onChange={handleChange} required />

//         {/* Profile Photo */}
//         <input type="file" name="profile_photo"
//           className="w-full" onChange={handleFileChange} required />

//         {/* Address */}
//         <input name="address1" placeholder="Address Line 1"
//           className="w-full p-2 border rounded" onChange={handleChange} required />
//         <input name="address2" placeholder="Address Line 2"
//           className="w-full p-2 border rounded" onChange={handleChange} />

//         <div className="grid grid-cols-2 gap-3">
//           <input name="city" placeholder="City"
//             className="p-2 border rounded" onChange={handleChange} required />
//           <input name="state" placeholder="State"
//             className="p-2 border rounded" onChange={handleChange} required />
//         </div>

//         <input name="postal_code" placeholder="Postal Code"
//           className="w-full p-2 border rounded" onChange={handleChange} required />

//         {/* DOB */}
//         <input type="date" name="dob"
//           className="w-full p-2 border rounded" onChange={handleChange} required />

//         {/* PAN */}
//         <input name="pan_number" placeholder="PAN Number"
//           className="w-full p-2 border rounded" onChange={handleChange} required />
//         <input type="file" name="pan_photo"
//           className="w-full" onChange={handleFileChange} required />

//         {/* Aadhaar */}
//         <input name="aadhar_number" placeholder="Aadhaar number"
//           className="w-full p-2 border rounded" onChange={handleChange} required />
//         <input type="file" name="aadhar_front"
//           className="w-full" onChange={handleFileChange} required />
//         <input type="file" name="aadhar_back"
//           className="w-full" onChange={handleFileChange} required />

//         {/* Bank */}
//         <input name="bank_name" placeholder="Bank Name"
//           className="w-full p-2 border rounded" onChange={handleChange} required />
//         <input name="account_holder" placeholder="Account Holder Name"
//           className="w-full p-2 border rounded" onChange={handleChange} required />
//         <input name="account_number" placeholder="Account Number"
//           className="w-full p-2 border rounded" onChange={handleChange} required />
//         <input name="ifsc_code" placeholder="IFSC Code"
//           className="w-full p-2 border rounded" onChange={handleChange} required />

//         {/* Cancelled Cheque */}
//         <input type="file" name="cancelled_cheque"
//           className="w-full" onChange={handleFileChange} required />

//         {/* Experience */}
//         <select name="experience"
//           className="w-full p-2 border rounded"
//           onChange={handleChange} required>
//           <option value="">Any experience in selling insurance?</option>
//           <option value="yes">Yes</option>
//           <option value="no">No</option>
//         </select>

//         {/* Custom Link */}
//         <select name="custom_link"
//           className="w-full p-2 border rounded"
//           onChange={handleChange} required>
//           <option value="">Want a personalised ServeAmigo Link?</option>
//           <option value="yes">Yes</option>
//           <option value="no">No</option>
//         </select>

//         {/* Declaration */}
//         <label className="flex items-center gap-2">
//           <input type="checkbox" name="declaration"
//             onChange={handleChange} required />
//           <span>I confirm all terms & conditions</span>
//         </label>

//         {/* Submit button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white p-2 rounded"
//         >
//           {loading ? "Submitting..." : "Submit"}
//         </button>

//       </form>
//     </div>
//   );
// }






import React, { useState } from "react";

// Most-used Indian banks for quick selection in bank name field
const popularBanks = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Punjab National Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Bank of Baroda",
  "Union Bank of India",
  "Canara Bank",
  "IndusInd Bank",
  "IDFC FIRST Bank",
  "Yes Bank",
  "IDBI Bank",
  "Central Bank of India",
  "Indian Bank",
  "Bank of India",
  "UCO Bank",
  "Bank of Maharashtra",
  "Punjab & Sind Bank",
  "Federal Bank",
  "South Indian Bank",
  "RBL Bank",
  "Bandhan Bank",
  "Karur Vysya Bank",
  "City Union Bank",
  "Jammu & Kashmir Bank",
  "Karnataka Bank",
  "Tamilnad Mercantile Bank",
  "DCB Bank",
  "AU Small Finance Bank",
  "Equitas Small Finance Bank",
  "Ujjivan Small Finance Bank",
  "Suryoday Small Finance Bank",
  "Jana Small Finance Bank",
  "Fincare Small Finance Bank",
  "ESAF Small Finance Bank",
  "North East Small Finance Bank",
  "Shivalik Small Finance Bank",
  "Utkarsh Small Finance Bank",
  "Airtel Payments Bank",
  "Paytm Payments Bank",
  "India Post Payments Bank",
  "FINO Payments Bank",
  "Standard Chartered Bank",
  "HSBC India",
  "Citi India",
  "Deutsche Bank India",
  "Indian Overseas Bank",
  "DBS Bank India",
  "CSB Bank",
  "Dhanlaxmi Bank",
];

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw8xCiGpiWLUrSjmkaO_NwOtFEfQu1TljrzgCg-vQO5CnbXFKE3CBvoVz2q7vtT6QCh/exec";

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
    custom_link: "no",
    declaration: false,
  });

  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");

  const [files, setFiles] = useState({
    profile_photo: null,
    pan_photo: null,
    aadhar_front: null,
    aadhar_back: null,
    cancelled_cheque: null,
  });

  // Show suggestions only after the user types; match by prefix
  const filteredBanks = formValues.bank_name
    ? popularBanks.filter((bank) =>
        bank.toLowerCase().startsWith(formValues.bank_name.toLowerCase())
      )
    : [];

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

  // VALIDATION
  const validateForm = () => {
    if (!/^\d{10}$/.test(formValues.phone_number)) {
      alert("Phone number must be exactly 10 digits.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formValues.email)) {
      alert("Invalid email address.");
      return false;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formValues.pan_number.toUpperCase())) {
      alert("Invalid PAN format. Example: ABCDE1234F");
      return false;
    }
    if (!/^\d{12}$/.test(formValues.aadhar_number)) {
      alert("Aadhaar number must be 12 digits.");
      return false;
    }
    if (!/^[0-9]{9,18}$/.test(formValues.account_number)) {
      alert("Account number must be 9 to 18 digits.");
      return false;
    }
    if (confirmAccountNumber !== formValues.account_number) {
      alert("Account number and confirm account number must match.");
      return false;
    }
    if (!/^[A-Z]{4}0[0-9A-Z]{6}$/.test(formValues.ifsc_code.toUpperCase())) {
      alert("Invalid IFSC format. Example: ABCD0EF1234");
      return false;
    }
    if (!/^\d{6}$/.test(formValues.postal_code)) {
      alert("Postal code must be exactly 6 digits.");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    // Reset form values
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
      custom_link: "no",
      declaration: false,
    });

    setConfirmAccountNumber("");

    // Reset file state
    setFiles({
      profile_photo: null,
      pan_photo: null,
      aadhar_front: null,
      aadhar_back: null,
      cancelled_cheque: null,
    });

    // Reset file inputs in DOM
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = "";
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const fd = new FormData();

    Object.keys(formValues).forEach((key) => {
      fd.append(key, formValues[key]);
    });

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

      // Clear form data
      resetForm();

      // Redirect to Thank You Page
      window.location.href = "/thank-you";

    } catch (error) {
      alert("Error submitting form");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4 sm:py-10 sm:px-6"
      style={{ background: "linear-gradient(135deg, #f7fbff 0%, #eef4ff 100%)" }}
    >
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-[#0A4DAD12]">
        {/* Header with Logo */}
        <div
          className="px-5 py-8 sm:px-6 sm:py-10 text-center"
          style={{ background: "linear-gradient(90deg, #0A4DAD 0%, #0A4DAD 70%, #F6C336 100%)" }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-white/90 shadow-md border border-white flex items-center justify-center overflow-hidden">
              <img 
                src="/serlogo.png" 
                alt="ServeAmigo Logo" 
                className="h-14 w-14 object-contain"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Partner Onboarding Form
          </h2>
          <p className="text-blue-100 mt-2 text-sm">
            Join ServeAmigo and start your journey today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-8 sm:px-8 sm:py-10 space-y-8">
          
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-[#0A4DAD1F] pb-2">
              Personal Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="name" 
                value={formValues.name}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                onChange={handleChange} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Phone Number <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-1">(10 digits)</span>
              </label>
              <input 
                type="text" 
                name="phone_number" 
                value={formValues.phone_number}
                maxLength={10}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                onChange={handleChange} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                name="email" 
                value={formValues.email}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                onChange={handleChange} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                name="dob"
                value={formValues.dob}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
              Documents
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Profile Photo <span className="text-red-500">*</span>
              </label>
              <input
                type="file" 
                name="profile_photo" 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A4DAD] focus:border-[#0A4DAD] transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0A4DAD] file:text-white hover:file:bg-[#083d8a]"
                onChange={handleFileChange} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                PAN Photo <span className="text-red-500">*</span>
              </label>
              <input 
                type="file" 
                name="pan_photo" 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0A4DAD] file:text-white hover:file:bg-[#083d8a]"
                onChange={handleFileChange} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Aadhaar Front <span className="text-red-500">*</span>
              </label>
              <input 
                type="file" 
                name="aadhar_front" 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0A4DAD] file:text-white hover:file:bg-[#083d8a]"
                onChange={handleFileChange} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Aadhaar Back <span className="text-red-500">*</span>
              </label>
              <input 
                type="file" 
                name="aadhar_back" 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0A4DAD] file:text-white hover:file:bg-[#083d8a]"
                onChange={handleFileChange} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Cancelled Cheque <span className="text-red-500">*</span>
              </label>
              <input 
                type="file" 
                name="cancelled_cheque" 
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0A4DAD] file:text-white hover:file:bg-[#083d8a]"
                onChange={handleFileChange} 
                required 
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-[#0A4DAD1F] pb-2">
              Address Details
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input 
                name="address1" 
                value={formValues.address1}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                onChange={handleChange} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Address Line 2
              </label>
              <input 
                name="address2" 
                value={formValues.address2}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                onChange={handleChange} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input 
                  name="city" 
                  value={formValues.city}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <input 
                  name="state" 
                  value={formValues.state}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Postal Code <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-1">(6 digits)</span>
              </label>
              <input 
                type="text"
                name="postal_code" 
                value={formValues.postal_code}
                maxLength={6}
                pattern="\d{6}"
                inputMode="numeric"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                onChange={(e) => {
                  // Only allow numeric input, max 6 digits
                  const numericValue = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setFormValues({
                    ...formValues,
                    postal_code: numericValue,
                  });
                }}
                required 
              />

            </div>
          </div>

          {/* KYC Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-[#0A4DAD1F] pb-2">
              KYC Details
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1.5">
                PAN Number <span className="text-red-500">*</span>
              </label>
              <input 
                name="pan_number" 
                value={formValues.pan_number}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition uppercase"
                onChange={handleChange} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Aadhaar Number <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-1">(12 digits)</span>
              </label>
              <input 
                name="aadhar_number" 
                value={formValues.aadhar_number}
                maxLength={12}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* Bank Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-[#0A4DAD1F] pb-2">
              Bank Details
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                name="bank_name"
                value={formValues.bank_name}
                list={filteredBanks.length ? "bank-suggestions" : undefined}
                autoComplete="off"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                onChange={handleChange}
                required
              />
              {filteredBanks.length > 0 && (
                <datalist id="bank-suggestions">
                  {filteredBanks.map((bank) => (
                    <option key={bank} value={bank} />
                  ))}
                </datalist>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Account Holder Name <span className="text-red-500">*</span>
              </label>
              <input 
                name="account_holder" 
                value={formValues.account_holder}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                onChange={handleChange} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input 
                name="account_number" 
                value={formValues.account_number}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                onChange={handleChange} 
                required 
              />
          <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-3">
            Confirm Account Number <span className="text-red-500">*</span>
          </label>
          <input 
            name="confirm_account_number" 
            value={confirmAccountNumber}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            onChange={(e) => setConfirmAccountNumber(e.target.value)} 
            required 
          />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <input 
                name="ifsc_code" 
                value={formValues.ifsc_code}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition uppercase"
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
              Additional Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Any Experience in Selling Insurance? <span className="text-red-500">*</span>
              </label>
              <select 
                name="experience" 
                value={formValues.experience}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                onChange={handleChange} 
                required
              >
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {/* Hidden field - still submitted to backend but not visible to user */}
            <input
              type="hidden"
              name="custom_link"
              value={formValues.custom_link || "no"}
            />
          </div>

          {/* Declaration */}
          <div className="bg-[#fdf7e8] border border-[#F6C33666] rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="declaration"
                checked={formValues.declaration}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                onChange={handleChange} 
                required 
              />
              <span className="text-sm text-gray-700">
                I confirm all information provided is true and authorise ServeAmigo to verify and onboard me as a partner  <span className="text-red-500">*</span>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-3.5 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            style={{ background: "linear-gradient(90deg, #0A4DAD 0%, #0A4DAD 60%, #F6C336 100%)" }}
          >
            {loading && (
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? "Submitting..." : "Submit Registration"}
          </button>

        </form>
      </div>
    </div>
  );
}
