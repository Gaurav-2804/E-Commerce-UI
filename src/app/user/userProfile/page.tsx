"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, useFieldArray, useController, Controller } from 'react-hook-form';

import Image from 'next/image';
import editIcon from '../../../images/editIcon.svg';
import loaderIcon from '../../../images/loaderIcon.svg';

interface Profile {
    fullName: string,
    address: string,
    pinCode: string,
    city: string,
    state: string,
    mobileNumber: string,
}

const UserProfilePage = () => {

    const initialProfileData: Profile = {
        fullName: "",
        address: "",
        pinCode: "",
        city: "",
        state: "",
        mobileNumber: "",
    }

    const[isLoading, setIsLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [profileData, setProfileData] = useState<Profile>(initialProfileData);

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
        watch,
        reset,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            fullName: profileData.fullName,
            address: profileData.address,
            pinCode: profileData.pinCode,
            city: profileData.city,
            state: profileData.state,
            mobileNumber: profileData.mobileNumber,
        }
    });

    const getProfileData = async() => {
        const headers = {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        };
        const payload = {
            userId: sessionStorage.getItem("userId"),
        }
        axios
            .post('/api/user/getProfile', payload, {headers})
            .then((res) => {
                if(res.data) {
                    const prof = res.data;
                    setProfileData(res.data);
                    console.log("initial profile", res.data);
                    Object.entries(prof).forEach(([name, value]: any) => {
                        setValue(name, value);
                    });
                }
            })
            .catch((err) => {
                console.log("error while fetching profileData:", err);
            })
    }

    const resetProfile = () => {
        Object.entries(profileData).forEach(([name, value]: any) => {
            setValue(name, value);
        });
    }

    useEffect(() => {
        getProfileData();
    }, [])

    const updateUserProfile = (data:any) => {
        console.log("user profile", data);
        const payload = {
            userId: sessionStorage.getItem("userId"),
            fullName: data.fullName,
            address: data.address,
            pinCode: data.pinCode,
            city: data.city,
            state: data.state,
            mobileNumber: data.mobileNumber
        }

        const headers = {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }

        axios
            .post('/api/user/insertProfileDetails', payload, {headers})
            .then((res) => {
                console.log('profile updated', res.data);
            })
            .catch((err) => {
                console.log("error while profile updating:", err);
            })
    }

    return (
        <>
            {isLoading && (
                <div className="flex items-center justify-center fixed top-0 left-0 h-full w-full z-50">
                    <Image src={loaderIcon} alt="Loading" />
                </div>
            )}
            <div className="mx-auto w-2/3 bg-slate-50 min-h-screen">
                <div className="mx-auto p-4 w-5/6">
                    <div className="text-center">
                        <span className="text-2xl antialiased font-semibold text-slate-900">Profile Details</span>
                    </div>
                    <div className="relative group" onClick={() => setIsEditable(prevValue => !prevValue)}>
                        {
                            (isEditable) ? (
                                <div onClick={resetProfile}>
                                    <div>
                                        <span className="w-4 h-4 absolute right-0 cursor-pointer">&times;</span>
                                    </div>
                                    <div className="group absolute top-6 right-5 p-1 bg-slate-500 rounded-md hidden group-hover:block">
                                        <div className="text-white text-[12px]">reset</div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div>
                                        <Image src={editIcon} alt='edit' className="w-4 h-4 absolute right-0 cursor-pointer" />
                                    </div>
                                    <div className="group absolute top-6 right-5 p-1 bg-slate-500 rounded-md hidden group-hover:block">
                                        <div className="text-white text-[12px]">Edit Profile</div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div>
                        <form onSubmit={handleSubmit(updateUserProfile)}>
                            <div className={((!isEditable) ? "bg-slate-200 ":"") + "border border-slate-300 mt-8 container"}>
                                <div className="w-5/6 mx-auto p-8">
                                    <label className="block mb-4">
                                        <span className="block text-sm font-medium text-slate-700">
                                            Full Name
                                        </span>
                                        <input className={((!isEditable) ? "bg-slate-200 ":"bg-slate-50 ") + "mt-1 px-3 py-2 w-3/5 border-slate-300 placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm"} 
                                            {...register('fullName', {required: "Please enter full name", disabled: !isEditable})} 
                                        />
                                        <span className="text-red-500 mb-4">{errors.fullName?.message}</span>
                                    </label>
                                    <label className="block mb-4">
                                        <span className="block text-sm font-medium text-slate-700">
                                            Address
                                        </span>
                                        <input className={((!isEditable) ? "bg-slate-200 ":"bg-slate-50 ") + "mt-1 px-3 py-2 w-3/5 border-slate-300 placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm"}
                                            {...register('address', {required: "Please enter address", disabled: !isEditable})} 
                                        />
                                        <span className="text-red-500 mb-4">{errors.address?.message}</span>
                                    </label>
                                    <label className="block mb-4">
                                        <span className="block text-sm font-medium text-slate-700">
                                            Pincode
                                        </span>
                                        <input type="number" className={((!isEditable) ? "bg-slate-200 ":"bg-slate-50 ") + "mt-1 px-3 py-2 w-3/5 border-slate-300 placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm"} 
                                            {...register('pinCode', {required: "Please enter pincode", disabled: !isEditable})} 
                                        />
                                        <span className="text-red-500 mb-4">{errors.pinCode?.message}</span>
                                    </label>
                                    <label className="block mb-4">
                                        <span className="block text-sm font-medium text-slate-700">
                                            City
                                        </span>
                                        <input className={((!isEditable) ? "bg-slate-200 ":"bg-slate-50 ") + "mt-1 px-3 py-2 w-3/5 border-slate-300 placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm"} 
                                            {...register('city', {required: "Please enter city", disabled: !isEditable})} 
                                        />
                                        <span className="text-red-500 mb-4">{errors.city?.message}</span>
                                    </label>
                                    <label className="block mb-4">
                                        <span className="block text-sm font-medium text-slate-700">
                                            State
                                        </span>
                                        <input className={((!isEditable) ? "bg-slate-200 ":"bg-slate-50 ") + "mt-1 px-3 py-2 w-3/5 border-slate-300 placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm"} 
                                            {...register('state', {required: "Please enter state", disabled: !isEditable})} 
                                        />
                                        <span className="text-red-500 mb-4">{errors.state?.message}</span>
                                    </label>
                                    <label className="block mb-4">
                                        <span className="block text-sm font-medium text-slate-700">
                                            Mobile Number
                                        </span>
                                        <input type="number" className={((!isEditable) ? "bg-slate-200 ":"bg-slate-50 ") + "mt-1 px-3 py-2 w-3/5 border-slate-300 placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm"}
                                            {...register('mobileNumber', {required: "Please enter mobile number", disabled: !isEditable, pattern: {
                                                    value: /^([+]\d{2})?\d{10}$/,
                                                    message: "Mobile number should contain 10 digits"
                                                }            
                                            })} 
                                        />
                                        <span className="text-red-500 mb-4">{errors.mobileNumber?.message}</span>
                                    </label>
                                </div>
                            </div>
                            <div className="text-center">
                                <input className="px-4 py-1 rounded-full bg-slate-700 text-slate-50 mt-4 
                                        hover:bg-slate-900 focus:outline-none cursor-pointer" 
                                    type="submit"
                                    value="Save Changes"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserProfilePage;