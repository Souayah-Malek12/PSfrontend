// src/components/RoleBasedLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUserRole}   from '../../Context/UserContext';  // Assuming you store the user's role in context
import AdminSidebar from '../AdminDashboard';
import ClientSidebar from '../ClientDashboard';
import WorkerSidebar from '../WorkerDashboard';
import ServiceClientDashboard from '../ServiceClientDashboard';

const RoleBasedLayout = () => {
    const { userRole } = useUserRole();

  // Check role and render corresponding sidebar
  let Sidebar;
  if (userRole === 'Administrator') {
    Sidebar = AdminSidebar;
  } else if (userRole=== 'Client') {
    Sidebar = ClientSidebar;
  } else if (userRole === 'Worker') {
    Sidebar = WorkerSidebar;
  } 
  else if (userRole === 'ServiceClient') {
    Sidebar = ServiceClientDashboard;
  } else {
    Sidebar = () => <div>No Sidebar</div>;  // Fallback if no role is set
  }
  
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default RoleBasedLayout;
