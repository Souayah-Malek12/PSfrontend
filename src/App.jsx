// eslint-disable-next-line no-unused-vars
import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import DashBoard from './modules/Dashboard/dashBoard'
import ProtectedRoute from './Context/ProtectedRoute';

import './App.css'
import { Login } from "./Pages/Login"
import AdminPage from './Pages/Admin/AdminPage';
import RealTimeOrder from './Pages/RealTimeOrder';
import PassOrderRealTime from './Pages/PassOrderRealTime';

function App() {

  
  return (
    <>
    <h1>React project</h1>
    <BrowserRouter>
      <Routes>
        <Route path='/chatToService' element={
          <ProtectedRoute >
            <DashBoard />
          </ProtectedRoute>
          } />
          <Route path='/realTimeOrd' element={
          <ProtectedRoute >
            <RealTimeOrder />
          </ProtectedRoute>
          } />
          <Route path='/PassrealTimeOrd' element={
          <ProtectedRoute >
            <PassOrderRealTime />
          </ProtectedRoute>
          } />

        <Route path='/login' element={<Login />} />


          <Route path='/admin' element={
            <ProtectedRoute required='Administrator'>
              <AdminPage />
            </ProtectedRoute>
          } >
          </Route>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
