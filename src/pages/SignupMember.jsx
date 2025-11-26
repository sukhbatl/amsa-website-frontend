// src/pages/SignupMember.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const SignupMember = () => {
  const { signup } = useAuth();
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    eduEmail: "",
    password: "",
    firstName: "",
    lastName: "",
    personalEmail: "",
    phone: "",
    birthDate: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    schoolName: "",
    schoolCity: "",
    schoolState: "",
    degree: "",
    gradYear: "",
    schoolYear: "",
    major: "",
    secondMajor: "",
    facebook: "",
    instagram: "",
    linkedin: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup({
        eduEmail: formData.eduEmail,
        personalEmail: formData.personalEmail,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });


      nav("/");
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
    console.log("Submitting to backend:", {
      email: formData.eduEmail,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName
    });

  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg my-10">
      <h2 className="text-3xl font-bold text-center text-[#001A78] mb-10">
        Become a Member
      </h2>

      {error && (
        <p className="text-red-600 text-center text-sm mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section 1: Account Info */}
        <div>
          <h3 className="text-xl font-semibold text-[#001A78] mb-4">
            Account Info <span className="text-red-600">*</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              name="eduEmail"
              placeholder="Edu email / AMSA email *"
              onChange={handleChange}
              className="input"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password *"
              onChange={handleChange}
              className="input"
              required
            />
          </div>
        </div>

        {/* Section 2: Personal Info */}
        <div>
          <h3 className="text-xl font-semibold text-[#001A78] mb-4">
            Personal Info (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="firstName"
              placeholder="First Name (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="lastName"
              placeholder="Last Name (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="personalEmail"
              type="email"
              placeholder="Personal Email (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="phone"
              placeholder="Phone (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="birthDate"
              type="date"
              placeholder="Birth Date"
              onChange={handleChange}
              className="input"
            />
            <input
              name="address1"
              placeholder="Address 1 (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="address2"
              placeholder="Address 2 (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="city"
              placeholder="City (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="state"
              placeholder="State (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="zip"
              placeholder="ZIP Code (optional)"
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        {/* Section 3: School Info */}
        <div>
          <h3 className="text-xl font-semibold text-[#001A78] mb-4">
            School Info (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="schoolName"
              placeholder="School Name (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="schoolCity"
              placeholder="School City (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="schoolState"
              placeholder="School State (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="degree"
              placeholder="Pursuing Degree (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="gradYear"
              placeholder="Graduation Year (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="schoolYear"
              placeholder="School Year (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="major"
              placeholder="Major (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="secondMajor"
              placeholder="Second Major (optional)"
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        {/* Section 4: Social Info */}
        <div>
          <h3 className="text-xl font-semibold text-[#001A78] mb-4">
            Social Info (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="facebook"
              placeholder="Facebook Profile Link (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="instagram"
              placeholder="Instagram Profile Link (optional)"
              onChange={handleChange}
              className="input"
            />
            <input
              name="linkedin"
              placeholder="LinkedIn Profile Link (optional)"
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#001A78] text-white px-6 py-3 rounded-lg shadow hover:bg-[#073D97] transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupMember;
