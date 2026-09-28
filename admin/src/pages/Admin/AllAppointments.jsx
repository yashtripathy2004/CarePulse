import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets/assets.js";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-5 text-lg font-semibold text-gray-800">All Appointments</p>

      <div className="bg-white border rounded-xl text-sm max-h-[80vh] overflow-y-scroll shadow-sm">
        {/* Table Header Row */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3.5 px-6 border-b font-medium text-gray-700 bg-gray-50">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Table Body rows */}
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_4fr_1fr_4fr_4fr_2fr_2fr] sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-3.5 px-6 border-b hover:bg-gray-50 transition-colors"
            key={index}
          >
            <p className="hidden sm:block">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img className="w-8 h-8 rounded-full object-cover" src={item.userData.image || assets.people_icon} alt={item.userData.name} />
              <p className="font-medium text-gray-800">{item.userData.name}</p>
            </div>
            <p className="hidden sm:block">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img className="w-8 h-8 rounded-full object-cover bg-gray-200" src={item.docData.image} alt={item.docData.name} />
              <p className="font-medium text-gray-800">{item.docData.name}</p>
            </div>
            <p>
              {currency}
              {item.amount}
            </p>
            <div>
              {item.cancelled ? (
                <p className="text-red-500 text-xs font-semibold">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-semibold">Completed</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-8 h-8 cursor-pointer p-1.5 hover:bg-red-50 rounded-full transition-colors"
                  src={assets.cancel_icon}
                  alt="cancel appointment"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;
