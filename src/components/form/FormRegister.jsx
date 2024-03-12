import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const FormRegister = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState(null);

  const handleFileChange = (e) => {
    // Menangani perubahan input file
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!email || !name || !password || !photo) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harap isi semua",
      });
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("password", password);
    formData.append("photo", photo);

    try {
      const response = await axios.post(
        "http://localhost:3000/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Register berhasil",
          text: "Anda akan dialihkan ke halaman login",
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            window.location.href = "/login";
          }
        });
      }
      console.log("Registration successful:", response.data);
      // Reset form after successful registration
      setEmail("");
      setName("");
      setPassword("");
      setPhoto(null);
    } catch (error) {
      console.error("Registration failed:", error.response.data);
    }
  };

  return (
    <>
      <div className="hero min-h-screen bg-base-200 text-black">
        <img src="/assets/background.jpg" alt="" className="min-h-screen" />
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-white hidden lg:flex">
              Register now!
            </h1>
            <p className="py-6 text-white hidden lg:flex">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="input input-bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Photo</span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className="label mt-5">
                  <a href="/login" className="label-text-alt link link-hover">
                    Login
                  </a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormRegister;
