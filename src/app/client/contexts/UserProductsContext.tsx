"use client";
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { createContext, useEffect, useState } from 'react';

interface ProductData {
    category: string,
    productsList: [],
    id: number,
  }

export const UserProductsSearchContext = createContext<ProductData[] | undefined>(undefined);

const UserProductsContextPage = (props:any) => {
    const [userProductsData, setUserProductsData] = useState<ProductData[]>([]);

    const getAllUserProducts = async () => {
        const payload = {
            userId: sessionStorage.getItem('userId')
        }
        axios
            .post('/api/user/getAllProducts', payload)
            .then((res) => {
                console.log("user products", res.data);
                setUserProductsData(res.data);
            })
            .catch((err) => {
                setCookie('authenticated', false, { path: '/',});
                console.log("error on fetching user products", err);
            })
    }

    const getAllClientProducts = async () => {
        axios
            .get('/api/client/getDetails')
            .then((res) => {
                console.log("client products", res.data);
                setUserProductsData(res.data);
            })
            .catch((err) => {
                console.log("error on fetching client products", err);
            })
    }

    useEffect(() => {
        const currUser = sessionStorage.getItem("userType");
        if(currUser === "ecom-user"){
            const token = sessionStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            getAllUserProducts();
        }
        else if(currUser === "ecom-client"){
            getAllClientProducts();
        }
      }, []);

      return (
        <>
            <UserProductsSearchContext.Provider value={userProductsData}>
                {props.children}
            </UserProductsSearchContext.Provider>
        </>
    )
}

export default UserProductsContextPage;