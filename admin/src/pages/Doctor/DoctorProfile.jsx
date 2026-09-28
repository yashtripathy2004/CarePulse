import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, setProfileData, backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        fees: profileData.fees,
        address: profileData.address,
        available: profileData.available
      };

      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, {
        headers: { dtoken: dToken }
      });

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div className="m-5 text-gray-600">
        <div className="flex flex-col gap-4 bg-white p-8 rounded-xl border max-w-3xl shadow-sm">
          {/* Doctor Image Profile Card */}
          <div className="flex flex-col sm:flex-row gap-5">
            <div>
              <img className="bg-primary/80 w-full sm:max-w-64 rounded-lg object-cover" src={profileData.image} alt={profileData.name} />
            </div>

            <div className="flex-1">
              <p className="text-3xl font-medium text-gray-800">{profileData.name}</p>
              <div className="flex items-center gap-2 text-sm mt-1">
                <p>
                  {profileData.degree} - {profileData.speciality}
                </p>
                <button className="py-0.5 px-2 border text-xs rounded-full">{profileData.experience}</button>
              </div>

              {/* Bio summary */}
              <div className="mt-4">
                <p className="font-semibold text-gray-800 text-sm">About</p>
                <p className="text-sm mt-1 leading-relaxed text-gray-500">{profileData.about}</p>
              </div>

              {/* Fees */}
              <p className="text-gray-800 font-semibold mt-4">
                Appointment fee:{" "}
                <span>
                  {currency}{" "}
                  {isEdit ? (
                    <input
                      type="number"
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, fees: Number(e.target.value) }))
                      }
                      value={profileData.fees}
                      className="border rounded px-2 py-0.5 w-24 ml-1 outline-primary"
                    />
                  ) : (
                    profileData.fees
                  )}
                </span>
              </p>

              {/* Address */}
              <div className="mt-4 text-sm">
                <p className="font-semibold text-gray-800">Address:</p>
                {isEdit ? (
                  <div className="mt-1 flex flex-col gap-1.5 max-w-sm">
                    <input
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line1: e.target.value }
                        }))
                      }
                      value={profileData.address.line1}
                      className="border rounded px-2 py-0.5 outline-primary"
                    />
                    <input
                      type="text"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: { ...prev.address, line2: e.target.value }
                        }))
                      }
                      value={profileData.address.line2}
                      className="border rounded px-2 py-0.5 outline-primary"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 mt-1">
                    {profileData.address.line1}
                    <br />
                    {profileData.address.line2}
                  </p>
                )}
              </div>

              {/* Availability Toggler */}
              <div className="flex gap-2 items-center mt-6">
                <input
                  type="checkbox"
                  checked={profileData.available}
                  onChange={() =>
                    setProfileData((prev) => ({ ...prev, available: !prev.available }))
                  }
                  disabled={!isEdit}
                  className="cursor-pointer accent-primary w-4 h-4"
                />
                <label className="text-sm font-medium">Available</label>
              </div>

              {/* Buttons */}
              <div className="mt-8">
                {isEdit ? (
                  <button
                    onClick={updateProfile}
                    className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
