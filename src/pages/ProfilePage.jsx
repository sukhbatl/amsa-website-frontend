// src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, authFetch, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("view");
  const [activeSubTab, setActiveSubTab] = useState("personal");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await authFetch("/api/profile");
      setProfile(data.user || data.profile); // Handle both response formats
      setFormData(data.user || data.profile);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }
    // If it's already a full URL (starts with http/https), return as-is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    // Otherwise, prepend the backend URL
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    return `${apiUrl}${imagePath}`;
  };

  const handleImageError = (e) => {
    e.target.src = "/assets/logo.png";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const data = await authFetch("/api/profile", {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      setProfile(data.profile);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to update profile" });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    try {
      await authFetch("/api/profile/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to change password" });
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    if (!deletePassword) {
      setMessage({ type: "error", text: "Please enter your password to confirm deletion" });
      return;
    }

    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      await authFetch("/api/profile", {
        method: "DELETE",
        body: JSON.stringify({ password: deletePassword })
      });
      
      // Logout and redirect after successful deletion
      logout();
      navigate("/");
      setMessage({ type: "success", text: "Your account has been deleted successfully" });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to delete account" });
      setShowDeleteConfirm(false);
      setDeletePassword("");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#001A78]">My Profile</h1>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-4 p-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Profile Picture */}
              <div className="flex justify-center mb-6">
                {profile.profilePic ? (
                  <img
                    src={getImageUrl(profile.profilePic)}
                    alt={`${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "Profile"}
                    onError={handleImageError}
                    className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-[#001A78]"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#001A78] flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-[#001A78]">
                    {profile.firstName?.[0] || profile.email?.[0] || "?"}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <nav className="flex flex-col space-y-2">
                <button
                  onClick={() => setActiveTab("view")}
                  className={`px-4 py-2 rounded text-left transition-colors ${
                    activeTab === "view" ? "bg-[#001A78] text-white font-bold" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  My Profile
                </button>
                <button
                  onClick={() => setActiveTab("edit")}
                  className={`px-4 py-2 rounded text-left transition-colors ${
                    activeTab === "edit" ? "bg-[#001A78] text-white font-bold" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  Update Info
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`px-4 py-2 rounded text-left transition-colors ${
                    activeTab === "password" ? "bg-[#001A78] text-white font-bold" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  Change Password
                </button>
                <button
                  onClick={() => setActiveTab("delete")}
                  className={`px-4 py-2 rounded text-left transition-colors ${
                    activeTab === "delete" ? "bg-red-600 text-white font-bold" : "hover:bg-red-50 text-red-600"
                  }`}
                >
                  Delete Account
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              {/* View Profile */}
              {activeTab === "view" && (
                <>
                  {/* Sub Tabs */}
                  <div className="flex space-x-4 border-b border-gray-200 mb-6">
                    <button
                      onClick={() => setActiveSubTab("personal")}
                      className={`pb-2 px-4 ${
                        activeSubTab === "personal" ? "border-b-2 border-[#001A78] text-[#001A78] font-semibold" : "text-gray-600"
                      }`}
                    >
                      Personal Info
                    </button>
                    <button
                      onClick={() => setActiveSubTab("school")}
                      className={`pb-2 px-4 ${
                        activeSubTab === "school" ? "border-b-2 border-[#001A78] text-[#001A78] font-semibold" : "text-gray-600"
                      }`}
                    >
                      School Info
                    </button>
                    <button
                      onClick={() => setActiveSubTab("social")}
                      className={`pb-2 px-4 ${
                        activeSubTab === "social" ? "border-b-2 border-[#001A78] text-[#001A78] font-semibold" : "text-gray-600"
                      }`}
                    >
                      Social Info
                    </button>
                  </div>

                  {/* Personal Info */}
                  {activeSubTab === "personal" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div className="font-semibold text-gray-700">Email:</div>
                      <div className="text-gray-900">{profile.email || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">First Name:</div>
                      <div className="text-gray-900">{profile.firstName || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">Last Name:</div>
                      <div className="text-gray-900">{profile.lastName || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">Date of Birth:</div>
                      <div className="text-gray-900">{profile.birthday || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">Phone:</div>
                      <div className="text-gray-900">{profile.phoneNumber || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">Personal Email:</div>
                      <div className="text-gray-900">{profile.personalEmail || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">Address 1:</div>
                      <div className="text-gray-900">{profile.address1 || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">Address 2:</div>
                      <div className="text-gray-900">{profile.address2 || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">City:</div>
                      <div className="text-gray-900">{profile.city || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">State:</div>
                      <div className="text-gray-900">{profile.state || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">ZIP Code:</div>
                      <div className="text-gray-900">{profile.zipCode || "—"}</div>
                    </div>
                  )}

                  {/* School Info */}
                  {activeSubTab === "school" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div className="font-semibold text-gray-700">School Name:</div>
                      <div className="text-gray-900">{profile.schoolName || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">School Year:</div>
                      <div className="text-gray-900">{profile.schoolYear || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">Graduation Year:</div>
                      <div className="text-gray-900">{profile.graduationYear || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">School City:</div>
                      <div className="text-gray-900">{profile.schoolCity || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">School State:</div>
                      <div className="text-gray-900">{profile.schoolState || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">Degree Level:</div>
                      <div className="text-gray-900">{profile.degreeLevel || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">Major:</div>
                      <div className="text-gray-900">{profile.major || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">Second Major:</div>
                      <div className="text-gray-900">{profile.major2 || "—"}</div>
                    </div>
                  )}

                  {/* Social Info */}
                  {activeSubTab === "social" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div className="font-semibold text-gray-700">Facebook:</div>
                      <div className="text-gray-900">{profile.facebook || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">Instagram:</div>
                      <div className="text-gray-900">{profile.instagram || "—"}</div>
                      
                      <div className="font-semibold text-gray-700">LinkedIn:</div>
                      <div className="text-gray-900">{profile.linkedin || "—"}</div>
                    </div>
                  )}
                </>
              )}

              {/* Edit Profile */}
              {activeTab === "edit" && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#001A78] mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="firstName"
                        value={formData.firstName || ""}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="lastName"
                        value={formData.lastName || ""}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="personalEmail"
                        type="email"
                        value={formData.personalEmail || ""}
                        onChange={handleInputChange}
                        placeholder="Personal Email"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="phoneNumber"
                        value={formData.phoneNumber || ""}
                        onChange={handleInputChange}
                        placeholder="Phone"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="birthday"
                        type="date"
                        value={formData.birthday || ""}
                        onChange={handleInputChange}
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#001A78] mb-4">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="address1"
                        value={formData.address1 || ""}
                        onChange={handleInputChange}
                        placeholder="Address Line 1"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="address2"
                        value={formData.address2 || ""}
                        onChange={handleInputChange}
                        placeholder="Address Line 2"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="city"
                        value={formData.city || ""}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="state"
                        value={formData.state || ""}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="zipCode"
                        value={formData.zipCode || ""}
                        onChange={handleInputChange}
                        placeholder="ZIP Code"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                    </div>
                  </div>

                  {/* School Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#001A78] mb-4">School Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="schoolName"
                        value={formData.schoolName || ""}
                        onChange={handleInputChange}
                        placeholder="School Name"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="schoolCity"
                        value={formData.schoolCity || ""}
                        onChange={handleInputChange}
                        placeholder="School City"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="schoolState"
                        value={formData.schoolState || ""}
                        onChange={handleInputChange}
                        placeholder="School State"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="schoolYear"
                        value={formData.schoolYear || ""}
                        onChange={handleInputChange}
                        placeholder="School Year (e.g., Sophomore)"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="degreeLevel"
                        value={formData.degreeLevel || ""}
                        onChange={handleInputChange}
                        placeholder="Degree Level (e.g., Bachelor's)"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="graduationYear"
                        value={formData.graduationYear || ""}
                        onChange={handleInputChange}
                        placeholder="Graduation Year"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="major"
                        value={formData.major || ""}
                        onChange={handleInputChange}
                        placeholder="Major"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="major2"
                        value={formData.major2 || ""}
                        onChange={handleInputChange}
                        placeholder="Second Major"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#001A78] mb-4">Social Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name="facebook"
                        value={formData.facebook || ""}
                        onChange={handleInputChange}
                        placeholder="Facebook"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="instagram"
                        value={formData.instagram || ""}
                        onChange={handleInputChange}
                        placeholder="Instagram"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                      <input
                        name="linkedin"
                        value={formData.linkedin || ""}
                        onChange={handleInputChange}
                        placeholder="LinkedIn"
                        className="input border border-gray-300 rounded px-4 py-2"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-2 bg-[#C51230] text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              )}

              {/* Change Password */}
              {activeTab === "password" && (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#001A78] mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Current Password"
                      required
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    />
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="New Password"
                      required
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm New Password"
                      required
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#C51230] text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Change Password
                  </button>
                </form>
              )}

              {/* Delete Account */}
              {activeTab === "delete" && (
                <form onSubmit={handleDeleteAccount} className="space-y-6">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <h3 className="text-xl font-semibold text-red-800 mb-2">⚠️ Delete Account</h3>
                    <p className="text-red-700 mb-4">
                      This action cannot be undone. Deleting your account will permanently remove:
                    </p>
                    <ul className="list-disc list-inside text-red-700 space-y-1 mb-4">
                      <li>Your profile information</li>
                      <li>All your blog posts</li>
                      <li>All your announcements</li>
                      <li>All associated data</li>
                    </ul>
                    <p className="text-red-800 font-semibold">
                      If you're sure you want to proceed, please enter your password below.
                    </p>
                  </div>

                  {showDeleteConfirm && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                      <p className="text-yellow-800 font-semibold">
                        Are you absolutely sure? This action is permanent and irreversible.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4 max-w-md">
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your password to confirm"
                      required
                      className="w-full border border-red-300 rounded px-4 py-2 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold"
                    >
                      {showDeleteConfirm ? "Confirm Delete Account" : "Delete My Account"}
                    </button>
                    {showDeleteConfirm && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeletePassword("");
                        }}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Delete Account Button - Only shown on "Delete Account" tab */}
              {activeTab === "delete" && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-red-800 mb-2">Danger Zone</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={() => setActiveTab("delete")}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold text-sm"
                    >
                      Delete My Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

