"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import Image from 'next/image';

import eyeIcon from '../../images/eyeIcon.svg';
import eyeblockIcon from '../../images/eyeblockIcon.svg';

const RegisterPage: React.FC = () => {
    const router = useRouter();

    const [viewPassword,setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

    const {
        register,
        getValues,
        handleSubmit,
        watch,
        formState: { errors, touchedFields, dirtyFields },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            username: "",
            password: "",
            confirmPassword: "",
          }
    });

    const handleFormSubmit = (data:any) => {

        const payload = {
            username: data.username,
            password: data.password
        };
        axios
            .post('/api/user/register', payload)
            .then((res) => {
                console.log("user created",res.data);
            })
            .catch((err) => {
                console.log("error on user creation:", err);
            })
        router.push('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 bg-gradient-to-r from-slate-500 to-slate-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-1/4">
            <h1 className="text-2xl font-bold mb-8 text-center">Register</h1>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mb-4">
                <label htmlFor="username" className="block font-semibold">
                    Username
                </label>
                <input
                    type="text"
                    {...register('username', {required: "Please enter username"})}
                    className="w-full border-b-2 border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-red-500 mb-4">{errors.username?.message}</span>
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block font-semibold">
                    Password
                </label>
                <div className="flex">
                    <input
                        type={(viewPassword)?"text":"password"}
                        {...register('password', {required: "Please enter your password", pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+{};':",.<>?]).{8,}$/,
                            message: "Password should contain at least: 1 capital, 1 small, 1 special character and should be of 8 characters"
                        }})}
                        className="w-full border-b-2 border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {(viewPassword)?(<Image src={eyeblockIcon} alt="hide" className="cursor-pointer" onClick={()=>{setViewPassword(false)}}/>)
                              :(<Image src={eyeIcon} alt="view" className="cursor-pointer" onClick={()=>{setViewPassword(true)}} />)}
                </div>
                <span className="text-red-500 mb-4">{errors.password?.message}</span>
            </div>
            <div className="mb-4">
                <label htmlFor="confirmPassword" className="block font-semibold">
                    Confirm Password
                </label>
                <div className="flex">
                    <input
                        type={(viewConfirmPassword)?"text":"password"}
                        {...register('confirmPassword', {required: "Please enter your password", validate: (val:string) => {
                            if(watch("password") !== val) return "Passwords doesn't match"
                        }})}
                        className="w-full border-b-2 border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {(viewConfirmPassword)?(<Image src={eyeblockIcon} alt="hide" className="cursor-pointer" onClick={()=>{setViewConfirmPassword(false)}}/>)
                              :(<Image src={eyeIcon} alt="view" className="cursor-pointer" onClick={()=>{setViewConfirmPassword(true)}} />)}
                </div>
                <span className="text-red-500 mb-4">{errors.confirmPassword?.message}</span>
            </div>
            {/* {touchedFields.password || !(dirtyFields.password) && <p className="text-red-500 mb-4">Please enter password</p>} */}
            <button
                type="submit"
                className="w-full bg-slate-300 bg-gradient-to-r from-slate-500 to-slate-950 text-white py-2 px-4 rounded-md hover:bg-slate-600 focus:outline-none focus:bg-slate-600"
            >
                Register
            </button>
            </form>
            <div className="mt-4 text-center">
                <span className="text-gray-600">Go back to login:</span>
                <Link href="/" className="text-slate-500 hover:text-slate-900 ml-1">Login</Link>
            </div>
        </div>
        </div>
    );
};

export default RegisterPage;
