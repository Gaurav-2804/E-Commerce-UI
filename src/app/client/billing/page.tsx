"use client";
import { useContext, useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useForm, useFieldArray, useController, Controller } from 'react-hook-form';
import { ProductBillingContext } from "../context/billingDetails/page";

import successIcon from '../../../images/successIcon.svg';

interface Profile {
    fullName: string,
    address: string,
    pinCode: string,
    city: string,
    state: string,
    mobileNumber: string,
}

interface Product {
    id:number,
    uuid: string,
    productName: string,
    brand: string,
    price: number,
    imgUrls: string[],
    quantity: number
}

const BillingPage = () => {
    const router = useRouter();
    const initialProfileData: Profile = {
        fullName: "",
        address: "",
        pinCode: "",
        city: "",
        state: "",
        mobileNumber: "",
    }

    const billing = useContext(ProductBillingContext);

    const [currentStep, setCurrentStep] = useState(0);
    const [profileData, setProfileData] = useState<Profile>(initialProfileData);
    const [productData, setProductData] = useState<Product[]>([]);
    const [deliveryDates, setDeliveryDates] = useState<string[]>([]);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);

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

    useEffect(() => {
        if(billing) {
            setProductData(billing.productsData);
        }
    }, []);

    useEffect(() => {
        getDeliveryDates();
    }, []); 

    const saveAddress = (data:any) => {
        console.log("check profile", data);
        setCurrentStep(prevState => prevState+1);
        billing?.addProfile(data);
    }
    
    const navigatePrevProfile = () => {
        setCurrentStep(prevState => prevState-1);
    }

    const getDeliveryDates = () => {
        const today = new Date();
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(today.getDate() + 2);
        const formatToday = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(today);
        const formatDayAfter = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).format(dayAfterTomorrow);
        const dates = [];
        dates.push(formatToday, formatDayAfter);
        setDeliveryDates(dates);
    }

    const confirmDelivery = () => {
        reset();
        billing?.clearData();
        setShowPopup(false);
        router.push('/client');
    }

    const billingAdressState = (
        <div className="mx-auto p-4 w-5/6">
            <div className="text-center">
                <span className="text-2xl antialiased font-semibold text-slate-900">Profile Details</span>
            </div>
            <div>
                <form onSubmit={handleSubmit(saveAddress)}>
                    <div className="border border-slate-300 mt-8 container">
                        <div className="w-5/6 mx-auto p-8">
                            <label className="block mb-4">
                                <span className="block text-sm font-medium text-slate-700">
                                    Full Name
                                </span>
                                <input className="mt-1 px-3 py-2 w-3/5 border-slate-300 placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm" 
                                    {...register('fullName', {required: "Please enter full name"})} 
                                />
                                <span className="text-red-500 mb-4">{errors.fullName?.message}</span>
                            </label>
                            <label className="block mb-4">
                                <span className="block text-sm font-medium text-slate-700">
                                    Address
                                </span>
                                <input className="mt-1 px-3 py-2 w-3/5 border-slate-300 placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm"
                                    {...register('address', {required: "Please enter address"})} 
                                />
                                <span className="text-red-500 mb-4">{errors.address?.message}</span>
                            </label>
                            <label className="block mb-4">
                                <span className="block text-sm font-medium text-slate-700">
                                    Pincode
                                </span>
                                <input type="number" className="mt-1 px-3 py-2 w-3/5 border-slate-300 placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm" 
                                    {...register('pinCode', {required: "Please enter pincode"})} 
                                />
                                <span className="text-red-500 mb-4">{errors.pinCode?.message}</span>
                            </label>
                            <label className="block mb-4">
                                <span className="block text-sm font-medium text-slate-700">
                                    City
                                </span>
                                <input className="mt-1 px-3 py-2 w-3/5 border-slate-300 placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm"
                                    {...register('city', {required: "Please enter city"})} 
                                />
                                <span className="text-red-500 mb-4">{errors.city?.message}</span>
                            </label>
                            <label className="block mb-4">
                                <span className="block text-sm font-medium text-slate-700">
                                    State
                                </span>
                                <input className="mt-1 px-3 py-2 w-3/5 border-slate-300 placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm"
                                    {...register('state', {required: "Please enter state"})} 
                                />
                                <span className="text-red-500 mb-4">{errors.state?.message}</span>
                            </label>
                            <label className="block mb-4">
                                <span className="block text-sm font-medium text-slate-700">
                                    Mobile Number
                                </span>
                                <input type="number" className="mt-1 px-3 py-2 w-3/5 border-slate-300 placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm"
                                    {...register('mobileNumber', {required: "Please enter mobile number", pattern: {
                                            value: /^([+]\d{2})?\d{10}$/,
                                            message: "Mobile number should contain 10 digits"
                                        }            
                                    })} 
                                />
                                <span className="text-red-500 mb-4">{errors.mobileNumber?.message}</span>
                            </label>
                        </div>
                    </div>
                    <div className="text-end">
                        <input className="px-4 py-1 rounded-full bg-slate-700 text-slate-50 mt-4 
                                hover:bg-slate-900 focus:outline-none cursor-pointer" 
                            type="submit"
                            value="Next"
                        />
                    </div>
                </form>
            </div>
        </div>
    );

    const showPricing = (
        <div className="">
            {
                productData.map((product,idx) => (
                    <div key={idx}>
                        <div className="flex mt-5 border-b border-b-slate-300">
                            <div className="p-2 ml-4">
                                <img className="h-34 w-40" src={product.imgUrls[0]} alt="image" />
                            </div>
                            <div className="flex flex-col ml-7">
                                <span className="font-bold text-xl tracking-wide text-slate-900">{product.productName}</span>
                                <div className="flex">
                                    <span className="font-bold text-sm text-slate-500">brand:&nbsp;</span>
                                    <span className="font-semibold text-sm text-slate-700"> {product.brand}</span>
                                </div>
                                <span className="font-bold text-xl text-slate-900">&#8377; {product.price.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')}</span>
                                <div className="flex items-center">
                                    <span className="font-bold text-base text-slate-700">Quantity:&nbsp;{product.quantity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
            <div className="flex justify-end mr-7">
                <span className="font-semibold text-xl text-bases text-slate-700">Total Cost:&nbsp;&nbsp;</span>
                <span className="font-semibold text-xl text-bases text-slate-700">&#8377; {billing?.totalCost.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')}</span>
            </div>
            <div className="flex justify-end mr-7">
                <button className="rounded-md bg-slate-700 text-slate-50 px-2 py-1 m-2 hover:bg-slate-950" onClick={navigatePrevProfile}>Prev</button>
                <button className="rounded-md bg-slate-800 text-slate-50 px-2 py-1 m-2 hover:bg-slate-950" onClick={() => setCurrentStep(prevStep => prevStep+1)}>Next</button>
            </div>
        </div>
    );

    const confirmShipment = (
        <div className="mx-auto p-4 w-5/6">
            <div className="text-center">
                <span className="text-2xl antialiased font-semibold text-slate-900">Select Date For Delivery:</span>
            </div>
            <div className="border border-slate-300 mt-8 p-4 container">
                {
                    deliveryDates.map((date,idx) => (
                        <div key={idx} onClick={() => setSelectedDateIndex(idx)} className="m-2">
                            <label className="flex items-center cursor-pointer">
                                <div className="w-6 h-6 border-2 border-slate-300 rounded-full flex items-center justify-center">
                                    <div className={((selectedDateIndex === idx) ? "":"hidden ") + "w-3 h-3 bg-slate-700 rounded-full"} />
                                </div>
                                <span className="ml-4 text-2xl antialiased">{date}</span>
                            </label>
                        </div>
                    ))
                }
            </div>
            <div className="flex justify-end mr-7">
                <button className="rounded-md bg-slate-700 text-slate-50 px-2 py-1 m-2 hover:bg-slate-950" onClick={navigatePrevProfile}>Prev</button>
                <button className="rounded-md bg-slate-800 text-slate-50 px-2 py-1 m-2 hover:bg-slate-950" onClick={() => setShowPopup(true)}>Confirm</button>
            </div>
        </div>
    );

    const renderBillingPage = (step:number) => {
        switch(step) {
            case 0: 
                return billingAdressState;
            case 1:
                return showPricing;

            case 2:
                return confirmShipment;
        }
    }

    return (
        <div className="py-3 mx-auto w-5/6 min-h-screen bg-white">
            <div className="flex justify-center border-b-2 pb-2">
                {
                    Array.from({ length: 3 }).map((_, i) => (
                        <div className={((currentStep===i) ? "bg-slate-700 " : "bg-slate-300 ") + "w-8 h-8 mr-4 rounded-full flex items-center justify-center"}>
                            <span key={i} className={((currentStep===i) ? "text-slate-50 " : "text-slate-700 ")}>{i + 1}</span>
                        </div>
                    ))
                }
            </div>
            {renderBillingPage(currentStep)}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white px-6 py-4 rounded-md">
                        <div className="flex justify-center mt-2">
                            <Image src={successIcon} alt="success" />
                        </div>
                        <span className="mt-3 text-slate-900 font-sans text-xl antialiased">Product Ordered Successfully</span>
                        <div className="flex justify-center">
                            <button onClick={()=> confirmDelivery()} className="mt-4 px-4 py-2 bg-slate-900 text-sm text-white rounded-md">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}

export default BillingPage;