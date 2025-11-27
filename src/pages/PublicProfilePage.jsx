// src/pages/PublicProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { FaLinkedin, FaFacebook, FaInstagram, FaBuilding, FaBook, FaCalendar, FaGraduationCap } from "react-icons/fa";

const PublicProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/user/public-profile/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Profile not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProfile(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/logo.png";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    return `${apiUrl}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-6xl text-gray-400 mb-4">👤</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Profile Not Found</h2>
        <p className="text-gray-500 mb-6">The member profile you're looking for doesn't exist.</p>
        <Link
          to="/team"
          className="px-6 py-3 bg-[#001A78] text-white rounded-lg hover:bg-[#073D97] transition-colors font-semibold"
        >
          View All Members
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header Card */}
        <div className="mb-8 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border-0">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={getImageUrl(profile.profilePic)}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  onError={(e) => {
                    e.target.src = "/assets/logo.png";
                  }}
                  className="w-48 h-48 rounded-full object-cover shadow-xl ring-4 ring-white"
                />
                <div className="absolute -bottom-2 -right-2 bg-[#001A78] text-white rounded-full p-3 shadow-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {profile.firstName} {profile.lastName}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                {profile.schoolName && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    <FaBuilding className="mr-2" />
                    {profile.schoolName}
                  </span>
                )}
                {profile.major && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    <FaBook className="mr-2" />
                    {profile.major}
                  </span>
                )}
                {profile.graduationYear && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <FaCalendar className="mr-2" />
                    Class of {profile.graduationYear}
                  </span>
                )}
              </div>

              {/* Social Links */}
              <div className="flex justify-center md:justify-start gap-4 mb-6">
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-110 shadow-lg"
                    aria-label={`LinkedIn profile of ${profile.firstName} ${profile.lastName}`}
                  >
                    <FaLinkedin className="text-xl" />
                  </a>
                )}
                {profile.facebook && (
                  <a
                    href={profile.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 hover:scale-110 shadow-lg"
                    aria-label={`Facebook profile of ${profile.firstName} ${profile.lastName}`}
                  >
                    <FaFacebook className="text-xl" />
                  </a>
                )}
                {profile.instagram && (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white transition-all duration-300 hover:scale-110 shadow-lg"
                    aria-label={`Instagram profile of ${profile.firstName} ${profile.lastName}`}
                  >
                    <FaInstagram className="text-xl" />
                  </a>
                )}
              </div>

              {/* Login Prompt */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 mb-3">
                  <span className="mr-2">ℹ️</span>
                  Want to see more details and connect with {profile.firstName}?
                </p>
                <Link
                  to="/login"
                  className="inline-block px-4 py-2 bg-[#001A78] text-white rounded-lg hover:bg-[#073D97] transition-colors text-sm font-semibold"
                >
                  Sign in to view full profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bio and Education Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bio Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-0 h-full">
              <div className="p-6 pb-0">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3 text-[#001A78]">👤</span>
                  About
                </h2>
              </div>
              <div className="p-6 pt-4">
                {profile.bio ? (
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">No bio available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Info Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-0 h-full">
              <div className="p-6 pb-0">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <FaGraduationCap className="mr-3 text-[#001A78]" />
                  Education
                </h2>
              </div>
              <div className="p-6 pt-4 space-y-4">
                {profile.schoolName && (
                  <div className="flex items-start">
                    <FaBuilding className="mr-3 mt-1 text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">School</p>
                      <p className="text-gray-900 font-medium">{profile.schoolName}</p>
                    </div>
                  </div>
                )}

                {profile.major && (
                  <div className="flex items-start">
                    <FaBook className="mr-3 mt-1 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Major</p>
                      <p className="text-gray-900 font-medium">{profile.major}</p>
                    </div>
                  </div>
                )}

                {profile.major2 && (
                  <div className="flex items-start">
                    <FaBook className="mr-3 mt-1 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Second Major</p>
                      <p className="text-gray-900 font-medium">{profile.major2}</p>
                    </div>
                  </div>
                )}

                {profile.degreeLevel && (
                  <div className="flex items-start">
                    <span className="mr-3 mt-1 text-yellow-600">⭐</span>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Degree Level</p>
                      <p className="text-gray-900 font-medium">{profile.degreeLevel}</p>
                    </div>
                  </div>
                )}

                {profile.graduationYear && (
                  <div className="flex items-start">
                    <FaCalendar className="mr-3 mt-1 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Graduation Year</p>
                      <p className="text-gray-900 font-medium">{profile.graduationYear}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Articles Section - Only for Sukhbat */}
        {profile.id === 35 && (
          <div className="mt-8">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-0">
              <div className="p-6 pb-0">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3 text-[#001A78]">📝</span>
                  Featured Articles
                </h2>
              </div>
              <div className="p-6 pt-4">
                <p className="text-gray-600 mb-6">
                  Read more about {profile.firstName}'s work and insights:
                </p>
                <div className="space-y-4">
                  <a
                    href="https://markets.chroniclejournal.com/chroniclejournal/article/accwirecq-2025-10-16-sukhbat-lkhagvadorj-why-the-best-infrastructure-i-ever-built-wasnt-for-a-fortune-500-company-but-for-students"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border border-blue-200 hover:shadow-lg group"
                  >
                    <svg
                      className="w-5 h-5 text-indigo-600 mr-3 mt-1 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        Why the Best Infrastructure I Ever Built Wasn't for a Fortune 500 Company, But for Students
                      </h3>
                      <p className="text-sm text-gray-600">Chronicle Journal Markets</p>
                    </div>
                  </a>

                  <a
                    href="https://www.netnewsledger.com/2025/11/12/according-to-data-engineer-sukhbat-lkhagvadorj-your-companys-greatest-untapped-resource-is-its-community-api/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 border border-purple-200 hover:shadow-lg group"
                  >
                    <svg
                      className="w-5 h-5 text-purple-600 mr-3 mt-1 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                        Your Company's Greatest Untapped Resource is its Community API
                      </h3>
                      <p className="text-sm text-gray-600">Net News Ledger</p>
                    </div>
                  </a>

                  <a
                    href="https://www.24-7pressrelease.com/press-release/528465/bridging-data-and-humanity-sukhbat-lkhagvadorj-on-why-technology-needs-cultural-intelligence"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start p-4 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 transition-all duration-300 border border-green-200 hover:shadow-lg group"
                  >
                    <svg
                      className="w-5 h-5 text-green-600 mr-3 mt-1 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                        Bridging Data and Humanity: Why Technology Needs Cultural Intelligence
                      </h3>
                      <p className="text-sm text-gray-600">24-7 Press Release</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-8 text-center bg-gradient-to-r from-[#001A78] to-[#073D97] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Join AMSA Today!</h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Connect with talented Mongolian students and professionals around the world. Create your profile, share your
            achievements, and build lasting relationships.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/signup/member"
              className="px-6 py-3 bg-white text-[#001A78] rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#001A78] transition-colors font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;

