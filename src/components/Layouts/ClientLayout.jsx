import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

export default const ClientLayout =()=>{
    return (
        <>
        <Sidebar />
        <div className="admin-container">
          <h1>Client Dashboard</h1>
          <Outlet />
        </div>
      </>
    )
}
