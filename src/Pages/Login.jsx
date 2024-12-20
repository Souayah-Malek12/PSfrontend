// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role] = useState("Client")
    const handleLogin = async(e)=>{
        e.preventDefault();
        const response = await axios.post('http://localhost:5000/api/auth/login',{
            email, password, role
        })
        const data = response.data;
        if(data?.success){
            toast.success('Login successfully');
            console.log(data?.success)
            localStorage.setItem('token', response?.data?.token);  // Store token in localStorage
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
            <input type="password" placeholder="type email" name={email} onChange={(e)=>setPassword(e.target.value)}/>
            <button type="submit" className="bg-yellow-500 text-gary-950 p-1 text-center">Login</button>
        </form>
    </div>
    </div>
  )
}
