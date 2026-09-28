import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets/assets.js";

const DoctorDashboard = () => {
  const { dToken, getDashData, dashData, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="m-5">
        {/* Metric Cards Grid */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-4 bg-white p-6 min-w-56 rounded-xl border border-gray-100 cursor-pointer hover:scale-102 transition-all shadow-sm">
            <img className="w-14" src={assets.earning_icon} alt="earnings" />
            <div>
              <p className="text-2xl font-semibold text-gray-800">
                {currency} {dashData.earnings}
              </p>
              <p className="text-sm text-gray-500">Earnings</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-6 min-w-56 rounded-xl border border-gray-100 cursor-pointer hover:scale-102 transition-all shadow-sm">
            <img className="w-14" src={assets.appointments_icon} alt="appointments" />
            <div>
              <p className="text-2xl font-semibold text-gray-800">{dashData.appointments}</p>
              <p className="text-sm text-gray-500">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-6 min-w-56 rounded-xl border border-gray-100 cursor-pointer hover:scale-102 transition-all shadow-sm">
            <img className="w-14" src={assets.patients_icon} alt="patients" />
            <div>
              <p className="text-2xl font-semibold text-gray-800">{dashData.patients}</p>
              <p className="text-sm text-gray-500">Patients</p>
            </div>
          </div>
        </div>

        {/* Recent Bookings Logs */}
        <div className="bg-white border rounded-xl mt-10 shadow-sm">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b">
            <img src={assets.list_icon} alt="list icon" />
            <p className="font-semibold text-lg text-gray-800">Recent Appointments</p>
          </div>

          <div className="pt-4 pb-4">
            {dashData.latestAppointments.map((item, index) => (
              <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-50" key={index}>
                <img className="rounded-full w-10 h-10 object-cover bg-gray-100" src={item.userData.image || assets.people_icon} alt={item.userData.name} />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">{item.userData.name}</p>
                  <p className="text-gray-500 text-xs">
                    Booking Date: {slotDateFormat(item.slotDate)} at {item.slotTime}
                  </p>
                </div>

                {item.cancelled ? (
                  <p className="text-red-500 text-xs font-semibold">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-semibold">Completed</p>
                ) : (
                  <div className="flex gap-2">
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-10 cursor-pointer p-2 hover:bg-red-50 rounded-full transition-colors"
                      src={assets.cancel_icon}
                      alt="cancel"
                    />
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className="w-10 cursor-pointer p-2 hover:bg-green-50 rounded-full transition-colors"
                      src={assets.tick_icon}
                      alt="complete"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
