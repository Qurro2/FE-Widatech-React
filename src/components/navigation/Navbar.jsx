import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import axios from "axios";

const Navbar = () => {
  const token = Cookies.get("token");
  const [getData, setData] = useState([]);

  const getDataUser = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/user/current`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error Get Data", error);
    }
  };
  useEffect(() => {
    getDataUser();
  }, []);
  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-50 bg-slate-500 text-black">
        <div className="navbar ">
          <div className="navbar-start ">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-slate-500 rounded-box w-52"
              >
                <li>
                  <a href="/dashboard">Home</a>
                </li>
                <li>
                  <a href="/datasales">Sales Data</a>
                </li>
                <li>
                  <a href="/product">Product</a>
                </li>
              </ul>
            </div>
            <a href="/dashboard" className=" font-bold text-3xl text-white">
              <span style={{ color: "red" }}>Wida</span>tech
            </a>
            <div className="navbar hidden lg:flex  font-semibold">
              <ul className="menu menu-horizontal pr-0 pt-0 pb-0 ">
                <li>
                  <a href="/dashboard">Home</a>
                </li>
                <li>
                  <a href="/datasales">Sales Data</a>
                </li>
                <li>
                  <a href="/product">Product</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="navbar-end gap-2 md:px-8">
            <div className="badge badge-primary  lg:flex md:flex">
              {getData.name}
            </div>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={`http://localhost:3000/${getData.photo}`}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-slate-500  rounded-box w-52"
              >
                <li>
                  <a href="/profile" className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>

                <li>
                  <a
                    onClick={() => {
                      Swal.fire({
                        icon: "question",
                        title: "Apakah Anda Ingin Log Out?",
                        confirmButtonText: "Yes",
                        showCancelButton: true,
                      }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                          const token = Cookies.get("token");
                          axios.delete("http://localhost:3000/logout", {
                            headers: {
                              Authorization: `${token}`, // Sertakan token dalam header Authorization
                            },
                          });
                          Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: "Logout Berhasil",
                          }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                              Cookies.remove("token");
                              window.location.href = "/";
                            } else if (result.isDismissed) {
                              window.location.href = "/dashboard";
                            }
                          });
                        } else if (result.isDismissed) {
                          console.log("Asik gak jadi logout");
                        }
                      });
                    }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
