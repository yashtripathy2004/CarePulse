import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets.js";
import { AdminContext } from "../../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { aToken, backendUrl } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let finalImg = docImg;
      if (!finalImg) {
        const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        const raw = window.atob(base64Data);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: "image/png" });
        finalImg = new File([blob], "avatar.png", { type: "image/png" });
      }

      const formData = new FormData();
      formData.append("image", finalImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { atoken: aToken }
      });

      if (data.success) {
        toast.success(data.message);
        // Reset states
        setDocImg(false);
        setName("");
        setEmail("");
        setPassword("");
        setFees("");
        setAbout("");
        setDegree("");
        setAddress1("");
        setAddress2("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full max-w-4xl text-gray-600">
      <p className="mb-5 text-lg font-semibold text-gray-800">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded-xl w-full max-h-[85vh] overflow-y-scroll shadow-sm">
        {/* Upload Doc Image preview */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img className="w-16 h-16 bg-gray-100 rounded-full object-cover" src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="upload area" />
          </label>
          <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
          <p>Upload doctor <br /> picture</p>
        </div>

        {/* Info Grid */}
        <div className="flex flex-col lg:flex-row items-start gap-10">
          {/* Left Fields Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Doctor Name</p>
              <input
                className="border rounded px-3 py-2 outline-primary"
                type="text"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                className="border rounded px-3 py-2 outline-primary"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                className="border rounded px-3 py-2 outline-primary"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Experience</p>
              <select
                className="border rounded px-3 py-2 outline-primary"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1} Year`}>{`${i + 1} Year`}</option>
                ))}
                <option value="10+ Years">10+ Years</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Fees</p>
              <input
                className="border rounded px-3 py-2 outline-primary"
                type="number"
                placeholder="Consultation fees"
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                required
              />
            </div>
          </div>

          {/* Right Fields Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Speciality</p>
              <select
                className="border rounded px-3 py-2 outline-primary"
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Education / Degree</p>
              <input
                className="border rounded px-3 py-2 outline-primary"
                type="text"
                placeholder="Education / Degree"
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Address</p>
              <input
                className="border rounded px-3 py-2 mb-2 outline-primary"
                type="text"
                placeholder="address line 1"
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                required
              />
              <input
                className="border rounded px-3 py-2 outline-primary"
                type="text"
                placeholder="address line 2"
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                required
              />
            </div>
          </div>
        </div>

        {/* Biography text area */}
        <div className="flex flex-col gap-1 mt-6">
          <p>About Doctor</p>
          <textarea
            className="border rounded px-3 py-2 w-full outline-primary"
            placeholder="write about doctor biographic description..."
            rows={5}
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            required
          />
        </div>

        <button type="submit" className="bg-primary text-white text-base px-10 py-3 rounded-full mt-8 hover:bg-blue-600 transition-colors shadow-md">
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
