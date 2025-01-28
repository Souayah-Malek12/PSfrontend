import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

export default const ServiceClientLayout =()=>{
    return (
        <>
        <Sidebar />
        <div className="admin-container">
          <h1>ServiceClientLayout Dashboard</h1>
          <Outlet />
        </div>
      </>
    )
}
