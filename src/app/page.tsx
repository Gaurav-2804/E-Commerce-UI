"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { Axios } from 'axios';
import Image from 'next/image';
import { setCookie } from 'cookies-next';
import './globals.css';

import eyeIcon from '../images/eyeIcon.svg';
import eyeblockIcon from '../images/eyeblockIcon.svg';
import loaderIcon from '../images/loaderIcon.svg';

import { useForm } from 'react-hook-form';
import { config } from "process";
import { UserTypeContext } from "./client/context/userTypeContext/page";

export default function Home() {

  const router = useRouter();
  const[isLoading, setIsLoading] = useState(false);
  const [validUsername, setValidUsername] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [viewPassword, setViewPassword] = useState(false);  

  const userType = useContext(UserTypeContext);

  axios.interceptors.request.use((config) => {
      setIsLoading(true);
      return config;
    }
  )

  axios.interceptors.response.use((response) => {
    setIsLoading(false);
  
    return response;
  }, (error) => {
    setIsLoading(false);
    return Promise.reject(error);
  });

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm();

  const submitCredentials = (data: any) => {

    const payload = {
      username: data.username,
      password: data.password
    };

    axios
        .post('/authenticate', payload)
        .then((res) => {
            const authorizationHeader  = res.headers['authorization'];
            const token = authorizationHeader ? authorizationHeader.substring(7) : '';
            console.log("authenticated with token",  token);
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('userId', data.username);
            sessionStorage.setItem('userType', "ecom-user");
            userType?.setUser("ecom-user");
            setCookie('authenticated', true, { path: '/',});
            setIsLoading(false);
            router.push('/user');
        })
        .catch((err) => {
            setValidUsername(false);
            setValidPassword(false);
            console.log("error on authentication:", err);
        })
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-100 bg-gradient-to-r from-slate-500 to-slate-50">
        {isLoading && (
          <div className="flex items-center justify-center fixed top-0 left-0 h-full w-full z-50">
            <Image src={loaderIcon} alt="Loading" />
          </div>
        )}
        <div className={((isLoading)?"blur-sm ":"") + "bg-white p-8 rounded-lg shadow-lg"}>
          <h1 className="text-2xl font-bold mb-8 text-center">Login</h1>
          <form onSubmit={handleSubmit(submitCredentials)}>
            <div className="mb-4">
              <label htmlFor="username" className="block font-semibold">
                Username
              </label>
              <input
                type="text"
                // onChange={(e) => setUsername(e.target.value)}
                {...register('username')}
                className="w-full border-b-2 border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {(!validUsername)?(<p className="text-red-500 mb-4">Please enter valid usernmae</p>)
                :(touchedFields.username && !(dirtyFields.username) && <p className="text-red-500 mb-4">Please enter username</p>)}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block font-semibold">
                Password
              </label>
              <div className="flex">
                <input
                  type={(viewPassword)?"text":"password"}
                  // onChange={(e) => setPassword(e.target.value)}
                  {...register('password', {required: true})}
                  className="w-full border-b-2 border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {(viewPassword)?(<Image src={eyeblockIcon} alt="hide" className="cursor-pointer" onClick={()=>{setViewPassword(false)}}/>)
                                :(<Image src={eyeIcon} alt="view" className="cursor-pointer" onClick={()=>{setViewPassword(true)}} />)}
              </div>
              {(!validPassword)?(<p className="text-red-500 mb-4">Please enter valid password</p>)
                :(touchedFields.password && !(dirtyFields.password) &&<p className="text-red-500 mb-4">Please enter password</p>)}
            </div>
            <button
              type="submit"
              className="w-full bg-slate-100 bg-gradient-to-r from-slate-500 to-slate-950 text-white py-2 px-4 rounded-md hover:bg-salte-900 focus:outline-none focus:bg-slate-900"
            >
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-gray-600">Don't have an account?</span>
            <Link href="/register" className="text-slate-500 hover:text-slate-900 ml-1">Register</Link>
          </div>
          <div className="mt-4 text-center">
            <Link href="/client" className="text-slate-500 hover:text-slate-900 ml-1">Visit our page</Link>
          </div>
        </div>
      </div>
    </>
  ) 
}