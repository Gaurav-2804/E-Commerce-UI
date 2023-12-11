"use client";
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { createContext, useEffect, useState } from 'react';

interface Product {
    id:number,
    uuid: string,
    productName: string,
    brand: string,
    price: number,
    imgUrls: string[],
    quantity: number
}

interface Profile {
    fullName: string,
    address: string,
    pinCode: string,
    city: string,
    state: string,
    mobileNumber: string,
}

interface BillingDetails {
    productsData: Product[],
    profile: Profile,
    totalCost:number,
    buyProduct: (product: any) => void,
    buyProducts: (products: any[], cost: any) => void,
    addProfile: (prof: any) => void,
    clearData: () => void,
}

export const ProductBillingContext = createContext<BillingDetails | undefined>(undefined);

const BillingContextPage = (props:any) => {
    const initialProfileData: Profile = {
        fullName: "",
        address: "",
        pinCode: "",
        city: "",
        state: "",
        mobileNumber: "",
    };

    const [productDetails, setProductDetails] = useState<Product[]>([]);
    const [profileData, setProfileData] = useState<Profile>(initialProfileData);
    const [totalCost, setTotalCost] = useState(0);

    const buyProduct = (product: any) => {
        const billedProducts = [];
        billedProducts.push(product);
        const prodcutCost = product.price * product.quantity;
        setTotalCost(prodcutCost);
        setProductDetails(billedProducts);
    }

    const buyProducts = (products: any[], cost: any) => {
        setProductDetails(products);
        setTotalCost(cost);
    }

    const addProfile = (prof: any) => {
        setProfileData(prof);
    }

    const clearData = () => {
        setProductDetails([]);
        setProfileData(initialProfileData);
        setTotalCost(0);
    }

    const billingInfo: BillingDetails = {
        productsData: productDetails,
        profile: profileData,
        totalCost: totalCost,
        buyProduct: buyProduct,
        buyProducts: buyProducts,
        addProfile: addProfile,
        clearData: clearData
    }

    return (
        <>
            <ProductBillingContext.Provider value={billingInfo}>
                {props.children}
            </ProductBillingContext.Provider>
        </>
    )
}

export default BillingContextPage;