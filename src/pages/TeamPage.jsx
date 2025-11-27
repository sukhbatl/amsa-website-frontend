// src/pages/TeamPage.jsx
import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import UserCard from "../components/UserCard";

const TeamPage = () => {
  const [members, setMembers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        // Use the members API endpoint from amsa-website-backend
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/api/user/members`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setMembers(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError("Failed to load team members. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl text-gray-600">Loading team members...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strategy Board Members */}
        {members?.sb && members.sb.length > 0 && (
          <div className="mb-20">
            <h2 className="text-2xl font-bold m-10 text-center md:text-left">Strategy Board</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {members.sb.map((member, index) => (
                <UserCard
                  key={index}
                  name={`${member.User?.firstName || ""} ${member.User?.lastName || ""}`.trim()}
                  userId={member.UserId}
                  email={member.User?.email}
                  profilePic={member.User?.profilePic}
                  position={member.name}
                  schoolName={member.User?.schoolName}
                  linkedin={member.User?.linkedin}
                />
              ))}
            </div>
          </div>
        )}

        {/* Current Executive Team Members */}
        {members?.current_tuz && members.current_tuz.length > 0 && (
          <div className="mb-20">
            <h2 className="text-2xl font-bold m-10 text-center md:text-left">
              Executive Team {new Date().getFullYear()}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {members.current_tuz.map((member, index) => (
                <UserCard
                  key={index}
                  name={`${member.User?.firstName || ""} ${member.User?.lastName || ""}`.trim()}
                  userId={member.UserId}
                  email={member.User?.email}
                  profilePic={member.User?.profilePic}
                  position={member.name}
                  schoolName={member.User?.schoolName}
                  linkedin={member.User?.linkedin}
                />
              ))}
            </div>
          </div>
        )}

        {/* Historical Executive Team Members - Dropdown */}
        {(() => {
          const currentYear = new Date().getFullYear();
          const historicalYears = members?.tuz 
            ? Object.keys(members.tuz).filter(year => parseInt(year) !== currentYear)
            : [];
          
          if (historicalYears.length === 0) return null;
          
          return (
            <div className="mb-20">
              <div className="m-10">
                <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Historical Executive Teams</h2>
                <div className="mb-6">
                  <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select a year to view past Executive Team members:
                  </label>
                  <select
                    id="year-select"
                    value={selectedYear || ""}
                    onChange={(e) => setSelectedYear(e.target.value || null)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#001A78] focus:border-[#001A78] text-base"
                  >
                    <option value="">-- Select a year --</option>
                    {historicalYears
                      .sort((a, b) => parseInt(b) - parseInt(a))
                      .map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Display selected year's members */}
              {selectedYear && members.tuz[selectedYear] && (
                <div className="mb-12">
                  <h3 className="text-xl font-bold m-6 text-center md:text-left">
                    Executive Team {selectedYear}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {members.tuz[selectedYear].map((member, index) => (
                      <UserCard
                        key={`${selectedYear}-${index}`}
                        name={`${member.User?.firstName || ""} ${member.User?.lastName || ""}`.trim()}
                        userId={member.UserId}
                        email={member.User?.email}
                        profilePic={member.User?.profilePic}
                        position={member.name}
                        schoolName={member.User?.schoolName}
                        linkedin={member.User?.linkedin}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Show message when no year is selected */}
              {!selectedYear && (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a year from the dropdown above to view past Executive Team members.</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* No members message */}
        {(!members?.sb || members.sb.length === 0) &&
          (!members?.current_tuz || members.current_tuz.length === 0) &&
          (!members?.tuz || Object.keys(members.tuz).length === 0) && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No team members found.</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default TeamPage;

