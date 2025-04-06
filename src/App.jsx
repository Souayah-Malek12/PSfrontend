import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
import ClientDashboard from './components/ClientDashboard';
import WorkerDashboard from './components/WorkerDashboard';

import { UserProvider } from './Context/UserContext';  // Import UserProvider
import ProtectedRoute from './Routes/ProtectedRoute';  // Corrected ProtectedRoute import
import Categories from './Pages/Common/Categories';
import ServicesByCategory from './Pages/Common/Services';
import Registre from './Pages/Registre';
import Footer from './components/Layouts/Footer';
import Header from './components/Layouts/Header';
import DoneOrders from './Pages/Worker/MyDoneOrders';
import RoleBasedLayout from './components/Layouts/RoleBasedLayout';
import { Toaster } from 'react-hot-toast';
import UnAuthorized from './Pages/unAuthorized';


function App() {
  return (

    <UserProvider>  {/* Wrap the entire app with UserProvider */}
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <BrowserRouter>
      <Header />
      <div className="content">


        <Routes>
          {/* Public route */}
          <Route path='/login' element={<Login />} />
          <Route path='/registre' element={<Registre />} />
          <Route path='/*' element={<UnAuthorized />} />



          <Route element={<RoleBasedLayout />}>

          <Route path="/" element={<Categories />} />
            <Route path='/services/:catId'  element={<ServicesByCategory />}/>
          

          {/* Protected Routes for Administrator */}
            <Route element={<ProtectedRoute allowedRoles={["Administrator"]} />}>
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
            <Route path="/PassrealTimeOrd/:catId/:sId" element={<PassOrderRealTime />} />
          </Route>

          {/* Protected Routes for Worker */}
          <Route element={<ProtectedRoute allowedRoles={["Worker"]} />}>
            <Route path="/doneJob/:ordid" element={<Orddetails />} />
            <Route path="/myOrds" element={<ActuallOrder />} />
            <Route path="/realTimeOrd" element={<RealTimeOrder />} />
            <Route path="/myDoneOrds" element={<DoneOrders />} />

          </Route>

          {/* Protected Route for All Roles */}
          <Route path='/chatToService' element={              
            <ProtectedRoute allowedRoles={["Administrator", "Client", "Worker", "Service Client"]}>
              <DashBoard />
            </ProtectedRoute>
            }
          />
          
            

            </Route>
        </Routes>
        </div>
        <Footer />

      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
