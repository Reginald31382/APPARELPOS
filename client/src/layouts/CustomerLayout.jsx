import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CustomerLayout;
