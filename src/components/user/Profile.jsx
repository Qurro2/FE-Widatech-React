import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import Navbar from "../navigation/Navbar";

const Profile = () => {
  const token = Cookies.get("token");
  const [dataUser, setDataUser] = useState({});
  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const getDataDashboard = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user/current", {
        headers: {
          Authorization: `${token}`,
        },
      });
      setDataUser(response.data.data);
    } catch (error) {
      console.error("Gagal mendapatkan data user");
    }
  };

  useEffect(() => {
    getDataDashboard();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harap isi password lama",
      });
      return;
    }
    try {
      const response = await axios.patch(
        "http://localhost:3000/user/current/update",
        passwordData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log("Password berhasil diperbarui");
      console.log(response.data.data);
      // Reset form
      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Password berhasil diperbarui",
          showConfirmButton: false,
          timer: 2500,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2500);
        setPasswordData({
          password: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Gagal memperbarui password", error.response.data.error);
      // Tampilkan pesan kesalahan dari server
      if (error.response.status === 400) {
        if (error.response.data.error === "Password lama tidak valid") {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Password lama tidak valid",
            showConfirmButton: false,
            timer: 3500,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Password lama tidak valid",
            text: error.response.data.error,
            showConfirmButton: false,
            timer: 3500,
          });
        }
        setTimeout(() => {
          window.location.reload();
        }, 3500);
      }
    }
  };
  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-5  justify-center text-black">
        <div className="avatar justify-center flex">
          <div className="w-24 rounded">
            <img src={`http://localhost:3000/${dataUser.photo}`} alt="User" />
          </div>
        </div>

        <div className="card bg-slate-600 w-4/4 mx-auto mt-5">
          <div className="grid grid-cols-2 gap-5 text-center">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <p className="text-center">{dataUser.email}</p>
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-4 h-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <p className="text-center">{dataUser.name}</p>
            </label>
          </div>
        </div>
        <div className="card   mt-10 items-center">
          <div className="collapse bg-base-200 lg:w-2/6">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              Ganti Password
            </div>
            <div className="collapse-content">
              <form onSubmit={handleSubmit}>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Password lama</span>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={passwordData.password}
                    onChange={handleChange}
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                <label className="form-control w-full max-w-xs mt-10">
                  <div className="label">
                    <span className="label-text">Password baru</span>
                  </div>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handleChange}
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Confirm password baru</span>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handleChange}
                    className="input input-bordered w-full max-w-xs"
                  />
                  {passwordData.newPassword !==
                    passwordData.confirmPassword && (
                    <p className="text-red-500">
                      Confirm password must match password
                    </p>
                  )}
                </label>
                <div className="mt-5 flex gap-3 justify-end">
                  <button
                    type="reset"
                    className="btn btn-warning"
                    onClick={() => {
                      setPasswordData({
                        password: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
