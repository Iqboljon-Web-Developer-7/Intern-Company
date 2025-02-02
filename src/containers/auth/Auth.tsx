import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import bgImg from "../../assets/login-bg.jpg";

const Auth = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div
      className="bg-cover bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="w-screen h-screen flex items-center justify-center bg-[#00000088]">
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
