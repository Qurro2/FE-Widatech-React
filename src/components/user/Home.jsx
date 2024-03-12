import React from "react";

const Home = () => {
  return (
    <>
      <div className="hero min-h-screen">
        <img src="/assets/background.jpg" alt="" className="w-full h-full" />
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-xl">
            <h1 className="mb-5 text-5xl font-bold">Welcome To Widatech</h1>
            <p className="mb-5">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure
              eius atque, voluptates consequatur, error dolorum voluptate,
              maxime necessitatibus qui esse quae provident. Amet, minima. Ipsum
              expedita soluta ullam doloremque accusantium?
            </p>
            <a href="/login" className="btn btn-success w-56">
              Login
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
