"use client";
import NavbarPage from "../client/navbar/page";
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import '../globals.css';
import Image from 'next/image';
import Router from 'next/router';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import loaderIcon from '../../images/loaderIcon.svg';
import { UserProductsContext } from "./layout";
import { UserProductsSearchContext } from "../client/context/userProducts/page";
import { HeaderContext } from "../client/context/headerContext/page";

const UserHomePage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isDataAvailable, setIsDataAvailable] = useState(false);

    const productsData = useContext(UserProductsSearchContext);
    const currDir = useContext(HeaderContext);

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


    useEffect(() => {
        currDir?.resetDir();
    }, []);

    useEffect(() => {
        console.log("use products search", productsData);
        Router.events.on('routeChangeStart', () => setIsLoading(true));
        Router.events.on('routeChangeComplete', () => setIsLoading(false));
    }, []);

    useEffect(() => {
        if(productsData) {
            if(productsData.length > 0){ setIsDataAvailable(true);}
        }
    }, [productsData]);

    const showProducts = productsData?.map((products,idx) => (
        <div key={idx}>
            <div>
                <span className="text-slate-950 font-sans text-xl">{products.category}</span>
            </div>
            <div className="">
                <div className="flex">
                    {products.productsList.map((product, idx) => (
                        <div key={idx} className="w-64">
                            <Link href={{pathname:`user/product/[id]`, query:{id:product['uuid']}}} as={`user/product/${product['uuid']}`}>
                                <div className="p-4 m-4 border border-slate-300">
                                    <img src={product['fileUrls'][0]} className="mx-auto h-40 w-40" alt="" />
                                    <h3 className="text-xl font-semibold text-slate-950">{product['productName']}</h3>
                                    <p className="mt-2 text-slate-500">{product['brand']}</p>
                                    <p className="text-slate-900">&#8377; {product['price']}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ))

    return (
        <>
            {isLoading && (
                <div className="flex items-center justify-center fixed top-0 left-0 h-full w-full z-50">
                    <Image src={loaderIcon} alt="Loading" />
                </div>
            )}
            <div>
                <div className={((isLoading)?"blur-sm ":"") + "mx-auto w-2/3 bg-white min-h-screen"}>
                    <div className="p-4">
                        {
                            (isDataAvailable) ? showProducts :
                                <div>
                                    <span className="text-slate-950 font-sans text-xl">Products Not Found</span>
                                </div>
                        }
                        {/* {showProducts} */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserHomePage;