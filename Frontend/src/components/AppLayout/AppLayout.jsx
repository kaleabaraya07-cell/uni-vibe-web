import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import LeftSidebar from "../LeftSidebar/LeftSidebar";
import RightSidebar from "../RightSidebar/RightSidebar";
import BottomNav from "../BottomNav/BottomNav";
import SeeThrough from "../SeeThrough/SeeThrough";
import UploadModal from "../UploadModal/UploadModal";
import "./AppLayout.css";

function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-layout__content">
        <LeftSidebar />
        <div className="app-layout__main">
          <Outlet />
          <BottomNav />
        </div>
        <RightSidebar />
      </main>
      <BottomNav />
      <SeeThrough />
      <UploadModal />
    </div>
  );
}

export default AppLayout;
