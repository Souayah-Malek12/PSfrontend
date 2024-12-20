// eslint-disable-next-line no-unused-vars
import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import DashBoard from './modules/Dashboard/dashBoard'
import './App.css'
import { Login } from "./Pages/Login"

function App() {

  // eslint-disable-next-line react/prop-types
  const ProtectedRoutes =({children})=>{
    const isLoggedIn = localStorage.getItem("token");
    if(!isLoggedIn){
      return <Navigate to='/'/>
    }

    return children;
  }
  
  return (
    <>
    <h1>React project</h1>
    <BrowserRouter>
      <Routes>
        <Route path='/chatToService' element={
          <ProtectedRoutes>
            <DashBoard />
          </ProtectedRoutes>
          } />
        <Route path='/login' element={<Login />} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
