import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";

const DoctorsList = () => {
  const { aToken, doctors, getAllDoctors, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll w-full">
      <p className="mb-5 text-lg font-semibold text-gray-800">All Doctors</p>

      {/* Grid */}
      <div className="flex flex-wrap gap-4 pt-5 w-full">
        {doctors.map((item, index) => (
          <div
            className="border border-[#BFDBFE] rounded-xl w-56 overflow-hidden cursor-pointer bg-white shadow-sm hover:scale-102 transition-all"
            key={index}
          >
            <img className="bg-blue-50 w-full object-cover h-48" src={item.image} alt={item.name} />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
              <p className="text-zinc-600 text-sm mb-3">{item.speciality}</p>

              {/* Toggler */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={item.available}
                  onChange={() => changeAvailability(item._id)}
                  className="cursor-pointer accent-primary w-4 h-4"
                />
                <p className="text-sm">Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
