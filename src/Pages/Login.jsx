// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../Context/authContext';
import { use } from 'react';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const [role, setRole] = useState("")

    const handleLogin = async(e)=>{
        e.preventDefault();
        const response = await axios.post('http://localhost:5000/api/auth/login',{
            email, password, role
        })
        const data = response.data;
        if(data?.success){
            toast.success('Login successfully');
            console.log(data?.success)
            login(response?.data?.role)
            localStorage.setItem('token', response?.data?.token);
            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('role', response?.data?.role);  // Store token in localStorage            // Store token in localStorage
            localStorage.setItem('user', JSON.stringify(response?.data));  // Store token in localStorage
        }else {
            toast.alert("Error while login")
        }
    }

  return (
    <div>
    <div>Login</div>
    <div>
        <form onSubmit={handleLogin}>
            <input type="email" placeholder="type email" name={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="type pwd" name={email} onChange={(e)=>setPassword(e.target.value)}/>
            <input type="text" placeholder="enterRole" name={role} onClick={(e)=>setRole(e.target.value)}/>
            <button type="submit" className="bg-yellow-500 text-gary-950 p-1 text-center">Login</button>
        </form>
    </div>
    </div>
  )
}
