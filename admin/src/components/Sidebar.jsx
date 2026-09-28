import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext.jsx";
import { DoctorContext } from "../context/DoctorContext.jsx";
import { assets } from "../assets/assets.js";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <div className="min-h-screen bg-white border-r">
      {/* Admin Sidebar Links */}
      {aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-colors ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-black" : "hover:bg-[#F2F3FF]"
              }`
            }
          >
            <img className="w-5" src={assets.home_icon} alt="home" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink
            to="/all-appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-colors ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-black" : "hover:bg-[#F2F3FF]"
              }`
            }
          >
            <img className="w-5" src={assets.appointment_icon} alt="appointments" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink
            to="/add-doctor"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-colors ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-black" : "hover:bg-[#F2F3FF]"
              }`
            }
          >
            <img className="w-5" src={assets.add_icon} alt="add doctor" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>

          <NavLink
            to="/doctor-list"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-colors ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-black" : "hover:bg-[#F2F3FF]"
              }`
            }
          >
            <img className="w-5" src={assets.people_icon} alt="doctors list" />
            <p className="hidden md:block">Doctors List</p>
          </NavLink>
        </ul>
      )}

      {/* Doctor Sidebar Links */}
      {dToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            to="/doctor-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-colors ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-black" : "hover:bg-[#F2F3FF]"
              }`
            }
          >
            <img className="w-5" src={assets.home_icon} alt="home" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink
            to="/doctor-appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-colors ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-black" : "hover:bg-[#F2F3FF]"
              }`
            }
          >
            <img className="w-5" src={assets.appointment_icon} alt="appointments" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink
            to="/doctor-profile"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer transition-colors ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary text-black" : "hover:bg-[#F2F3FF]"
              }`
            }
          >
            <img className="w-5" src={assets.people_icon} alt="profile" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
