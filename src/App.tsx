import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Auth from "./containers/auth/Auth";
import Login from "./containers/auth/Login";
import Register from "./containers/auth/Register";
import Home from "./containers/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="auth" element={<Auth />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
