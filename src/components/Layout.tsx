// import Header from "./Header/Header";
// import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <main className="w-full">
      {/* <Header />
      <HeaderSidebar /> */}
      <div>
        <Outlet />
      </div>
      <div className="container-2xl">{/* <Footer /> */}</div>
    </main>
  );
};

export default Layout;
