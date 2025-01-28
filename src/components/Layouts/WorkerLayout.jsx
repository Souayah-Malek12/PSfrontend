import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

export default const Worker =()=>{
    return (
        <>
        <Sidebar />
        <div className="admin-container">
          <h1>Worker Dashboard</h1>
          <Outlet />
        </div>
      </>
    )
}
