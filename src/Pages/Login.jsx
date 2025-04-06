import React, { useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { useUserRole } from "../Context/UserContext";

export const Login = () => {
    const {setUserRole} = useUserRole();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Client"); // Set default role
    const navigate = useNavigate();
   
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email, password, role
            });
            const data = response.data;
            if (data?.success) {

                localStorage.setItem('token', data?.token);
                localStorage.setItem('role', data?.role);
                localStorage.setItem('user', JSON.stringify(data));
                toast.success(data.message, {
                    duration: 2000, // Toast duration
                });
                setUserRole(data?.role)
                navigate('/');
            } else {
                toast.error("Error while login");
            }
        } catch (error) {
            toast.error("An error occurred during login");
            console.error(error);
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
                    <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                            
                            <div className="mt-12 flex flex-col items-center">
                                <h1 className="text-2xl xl:text-3xl font-extrabold">
                                    Don't you have an account ? 
                                </h1>
                                <div className="w-full flex-1 mt-8">
                                    <div className="flex flex-col items-center">
                                        <button
                                            className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                                            <div className="bg-white p-2 rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
  <path d="M0 0h24v24H0z" fill="none"/> 
  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
</svg>
                                            </div>
                                            <a href='/registre' onClick={() => {
      
      navigate('/registre');
    }}className="ml-4">
                                               Registre Now
                                            </a>
                                        </button>
                                    </div>

                                    <div className="my-12 border-b text-center">
                                        <div
                                            className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                            Or sign up with e-mail
                                        </div>
                                    </div>

                                    <div className="mx-auto max-w-xs">
                                        <input
                                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                            type="email" name="email" onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
                                        <input
                                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                            type="password" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                                        <select onChange={(e) => setRole(e.target.value)} value={role} required    className="w-full px-8 py-4 mt-10 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                        >
                                            <option value="Client">Client</option>
                                            <option value="Worker">Worker</option>
                                            <option value="Administrator">Administrator</option>
                                            <option value="Service Client">Service Client</option>
                                        </select>
                                        <button
                                            type="submit"
                                            className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                                            <svg className="w-6 h-6 -ml-2" fill="none" stroke="currentColor" strokeWidth="2"
                                                strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                                <circle cx="8.5" cy="7" r="4" />
                                                <path d="M20 8v6M23 11h-6" />
                                            </svg>
                                            <span className="ml-3">
                                                Sign Up
                                            </span>
                                        </button>
                                        <p className="mt-6 text-xs text-gray-600 text-center">
                                            I agree to abide by templatana's
                                            <a href="#" className="border-b border-gray-500 border-dotted">
                                                Terms of Service
                                            </a>
                                            and its
                                            <a href="#" className="border-b border-gray-500 border-dotted">
                                                Privacy Policy
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                            <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                                style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}