import { Outlet } from "react-router-dom";
import "./AuthLayout.css";

function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__bg" />
      <div className="auth-layout__card">
        <div className="auth-layout__logo">
          <div className="auth-layout__logo-icon">U</div>
          <h1>Uni Vibe</h1>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
