import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const Formlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const postLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harap isi email dan password",
      });
      return;
    }
    try {
      const result = await axios.post(`http://localhost:3000/login`, {
        email: email,
        password: password,
      });
      console.log(result.data);
      if (result.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Login berhasil",
          showConfirmButton: false,
          timer: 1500,
        });
        Cookies.set("token", result.data.data.token);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.errors,
      });
    }
  };
  return (
    <>
      <div className="hero min-h-screen bg-base-200 text-black">
        <img src="/assets/background.jpg" alt="" className="min-h-screen" />
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold text-white">Login now!</h1>
            <p className="py-6 text-white">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
                <label className="label mt-3">
                  <a
                    href="/register"
                    className="label-text-alt link link-hover"
                  >
                    Register
                  </a>
                </label>
              </div>

              <div className="form-control mt-6">
                <button className="btn btn-primary" onClick={postLogin}>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Formlogin;
