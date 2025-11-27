// src/components/UserCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserCard = ({ name, userId, email, profilePic, position, schoolName, linkedin }) => {
  const { user } = useAuth();
  const imageUrl = profilePic?.startsWith("http") ? profilePic : `${import.meta.env.VITE_API_URL || "http://localhost:4000"}${profilePic || ""}`;
  const defaultImage = "/assets/logo.png";

  // Determine which profile page to link to
  const profileLink = user 
    ? `/profile/user/${userId}`  // Logged-in users see full profile
    : `/public-profile/${userId}`; // Non-logged-in users see public profile

  return (
    <Link
      to={profileLink}
      className="block rounded-3xl cursor-pointer transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25),0_10px_20px_-5px_rgba(0,0,0,0.08)] w-36 h-44 md:w-72 md:h-82 bg-white"
      aria-label={`View profile of ${name}, ${position}`}
    >
      <div className="p-1.5 md:p-4 pb-1.5 md:pb-3">
        <h3 className="text-center text-[10px] md:text-xl font-bold mb-0.5 md:mb-1 line-clamp-1 truncate">
          {name}
        </h3>
        <p className="text-center font-bold text-[8px] md:text-sm text-gray-600">
          {position}
        </p>
      </div>

      <div className="flex justify-center items-center mb-0.5 md:mb-2">
        <div className="size-14 md:size-36 flex items-center justify-center">
          <img
            src={imageUrl || defaultImage}
            alt={`${name}, ${position}`}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>
      </div>

      <div className="justify-start px-1.5 md:px-4 pt-0.5 md:pt-2 pb-2 md:pb-6">
        {email && (
          <div className="flex justify-center mb-0.5">
            <svg className="w-2 h-2 md:w-6 md:h-6 mr-0.5 align-middle" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <div className="truncate text-[8px] md:text-base">{email}</div>
          </div>
        )}
        {schoolName && (
          <div className="flex justify-center mb-0.5">
            <svg className="w-2 h-2 md:w-6 md:h-6 mr-0.5 md:mr-1 align-middle" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 01.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <div className="truncate text-[8px] md:text-base">{schoolName}</div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default UserCard;

