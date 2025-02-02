import { FC } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import logOutImg from "../assets/out.png";

interface HeaderTypes {
  setIsAddModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: FC<HeaderTypes> = ({ setIsAddModalVisible }) => {
  const navigate = useNavigate();

  // Logout: clear token and redirect
  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <header className="shadow p-4 flex justify-between items-center bg-[#313131]">
      <p className="text-sm font-bold text-white">Компании</p>
      <div className="flex items-center justify-center">
        <Button type="text" onClick={handleLogout}>
          <img
            src={logOutImg}
            width={28}
            className="invert hover:opacity-85 active:opacity-100"
          />
        </Button>
        <Button
          onClick={() => setIsAddModalVisible(true)}
          type="primary"
          className="!bg-[#0A9799] !rounded-sm"
        >
          Создать компанию
        </Button>
      </div>
    </header>
  );
};

export default Header;
