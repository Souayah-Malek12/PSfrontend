import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from './modules/Dashboard/dashBoard';
import { Login } from "./Pages/Login";
import RealTimeOrder from './Pages/Worker/RealTimeOrder';
import PassOrderRealTime from './Pages/Client/PassOrderRealTime';
import ActuallOrder from './Pages/Worker/ActuallOrder';
import Orddetails from './Pages/Worker/Orddetails';
import Orders from './Pages/Common/Orders';
import MyOrders from './Pages/Client/MyOrders';
import UsersList from './Pages/Admin/UsersList';
import ManageCategories from './Pages/Admin/ManageCategory';
import ManageService from './Pages/Admin/ManageService';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import WorkerDashboard from './components/WorkerDashboard';

import { UserProvider } from './Context/UserContext';  // Import UserProvider
import ProtectedRoute from './Routes/ProtectedRoute';  // Corrected ProtectedRoute import

function App() {
  return (
    <UserProvider>  {/* Wrap the entire app with UserProvider */}
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path='/login' element={<Login />} />

          {/* Protected Routes for Administrator */}
          <Route element={<ProtectedRoute allowedRoles={["Administrator"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/adminServ" element={<ManageService />} />
            <Route path="/adminCat" element={<ManageCategories />} />
            <Route path="/ords" element={<Orders />} />
          </Route>

          {/* Protected Routes for Service Client */}
          <Route element={<ProtectedRoute allowedRoles={["Administrator","Service Client"]} />}>
            <Route path="/allUsers" element={<UsersList />} />
          </Route>

        

          {/* Protected Routes for Client */}
          <Route element={<ProtectedRoute allowedRoles={["Client"]} />}>
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/clientOrds" element={<MyOrders />} />
            <Route path="/PassrealTimeOrd" element={<PassOrderRealTime />} />
          </Route>

          {/* Protected Routes for Worker */}
          <Route element={<ProtectedRoute allowedRoles={["Worker"]} />}>
            <Route path="/worker-dashboard" element={<WorkerDashboard />} />
            <Route path="/doneJob/:ordid" element={<Orddetails />} />
            <Route path="/myOrds" element={<ActuallOrder />} />
            <Route path="/realTimeOrd" element={<RealTimeOrder />} />
          </Route>

          {/* Protected Route for All Roles */}
          <Route path='/chatToService' element={              
            <ProtectedRoute allowedRoles={["Administrator", "Client", "Worker", "Service Client"]}>
              <DashBoard />
            </ProtectedRoute>
            }
          />
          
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
