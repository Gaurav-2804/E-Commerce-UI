"use client";
import NavbarPage from "../client/navbar/page";
import React, { createContext, useContext, useEffect, useState } from 'react';
import HeaderContextPage from "../client/context/headerContext/page";
import axios from "axios";
import { setCookie } from "cookies-next";
import UserProductsContextPage from "../client/context/userProducts/page";
import '../globals.css';
import Image from 'next/image';

import loaderIcon from '../../images/loaderIcon.svg';
import CategoryContextPage from "../client/context/categoryContext/page";


interface ProductData {
  category: string,
  productsList: [],
  id: number,
}

export const UserProductsContext = createContext<ProductData[] | undefined>(undefined);

export default function UserLayout({
  children
}: {
  children: React.ReactNode,
},) {
  
  const [userProductsData, setUserProductsData] = useState<ProductData[]>([]);

  const getAllUserProducts = async () => {
    const payload = {
        userId: sessionStorage.getItem('userId')
    }
    axios
        .post('http://localhost:8080/user/getAllProducts', payload)
        .then((res) => {
            console.log("user products", res.data);
            setUserProductsData(res.data);
        })
        .catch((err) => {
            setCookie('authenticated', false, { path: '/',});
            console.log("error on fetching user products", err);
        })
  }

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    getAllUserProducts();
  }, []);

  return (
    <>
      <HeaderContextPage>
        <CategoryContextPage>
          <UserProductsContextPage>
            <NavbarPage />
              <section>{children}</section>
          </UserProductsContextPage>
        </CategoryContextPage>
      </HeaderContextPage>
    </>
  )
}
