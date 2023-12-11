"use client";
import '../../../globals.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import searchIcon from '../../../../images/searchIcon.svg';
import cartIcon from '../../../../images/cartIcon.svg';
import profileIcon from '../../../../images/profileIcon.svg';

import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/cartContext/page';
import homeIcon from '../../../../images/homeIcon.svg';
import logoutIcon from '../../../../images/logoutIcon.svg';
import { HeaderContext } from '../../context/headerContext/page';
import { UserTypeContext } from '../../context/userTypeContext/page';
import { deleteCookie } from 'cookies-next';
import { UserProductsSearchContext } from '../../context/userProducts/page';

interface ProductFilter {
    [productName:string]: string;
}

const HeaderPage = (query:any) => {
    const router = useRouter();

    const cart = useContext(CartContext);
    const currDir = useContext(HeaderContext);
    const productsSearch = useContext(UserProductsSearchContext);

    const [currentUser, setCurrentUser] = useState("");
    const [userId, setUserId] = useState("");
    const [showUserPopup, setShowUserPopup] = useState(false);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [mappedProducts, setMappedProducts] = useState<ProductFilter[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductFilter[]>([]);
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        const curUser = sessionStorage.getItem("userType") ?? "";
        const curUsrId = sessionStorage.getItem("userId") ?? "";
        setCurrentUser(curUser);
        setUserId(curUsrId);
        window.onpageshow = function(event) {
            if (event.persisted) {
              window.location.reload();
            }
          };  
    }, [])

    useEffect(() => {
        console.log("check products", productsSearch);
        console.log("check header query", query);
        if(productsSearch){
            if(productsSearch.length>0){
                productsSearch.map(productCat => {
                    productCat.productsList.map(product => {
                        setMappedProducts((prevList) => [
                            ...prevList,
                            { productName: product['productName'], value: product['uuid']}
                        ])
                        setFilteredProducts(mappedProducts);
                    })
                });
            }
        }
    },[productsSearch]);

    const handleSearch = (event:any) => {
        const query = event.target.value;
        setSearchQuery(query);
        console.log('before check', mappedProducts);
        setShowSearchPopup(true);
        const filteredData = mappedProducts.filter((product) => product.productName.toLowerCase().includes(query.toLowerCase()));
        console.log('check filter:', filteredData);
        setFilteredProducts(filteredData);
    }

    const navigateToHomePage = () => {
        const userType = sessionStorage.getItem("userType");
        if(userType === "ecom-user"){
            router.push('/user');
        }
        else if(userType === "ecom-client"){
            router.push("/client");
        }
        console.log(currDir?.currentDir);
        currDir?.removeDir(0);
    }

    const navigateToCartPage = () => {
        router.push("/client/cartPage");
    }

    const handleLogout = () => {
        router.push("/");
        deleteCookie("authenticated");
        sessionStorage.clear();
    }

    const handleProfile = () => {
        router.push("/user/userProfile");
    }

    return (
        <>
            <div className="p-3 bg-slate-950">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex">
                            <Image src={homeIcon} alt="home" className="cursor-pointer mr-1" onClick={navigateToHomePage} />
                            {/* <span className="text-slate-50 font-sans text-xl">{currDir?.currentDir}</span> */}
                            {
                                currDir?.currentDir.map((dir,idx) => (
                                    <span className="text-slate-50 font-sans text-xl">
                                        {(idx!==0)?(<>&#62;</>):<></>} {dir}
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                    <div className="w-1/3" onClick={() => setShowSearchPopup(prevVal => !prevVal)}>
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e)}
                                className="py-2 px-4 w-full border border-gray-300 rounded-l-md focus:outline-none"
                            />
                            <button className="py-2 px-4 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                <Image src={searchIcon} alt="Search" className="" />
                            </button>
                        </div>
                        {/* <div className=""> */}
                            <div className="absolute bg-white rounded-b-md shadow-md z-10 w-[30%]">
                                <div className="" >
                                    {   showSearchPopup && (
                                            (filteredProducts.length > 5) ? (
                                                filteredProducts
                                                    .slice(0,5)
                                                    .map((product,idx) => (
                                                        <div key={idx} onClick={() => {
                                                                setSearchQuery("");
                                                                setFilteredProducts(mappedProducts);
                                                            }}
                                                            >
                                                            <Link href={{pathname:`user/product/[id]`, query:{id:product.value}}} as={`user/product/${product.value}`}>
                                                                <div className="p-2 cursor-pointer hover:bg-slate-200">
                                                                    <span className="">{product.productName}</span>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    )
                                                )
                                            ):(
                                                filteredProducts.map((product,idx) => (
                                                    <div key={idx} onClick={() => setSearchQuery("")} >
                                                        <Link href={{pathname:(currentUser === "ecom-user") ? `user/product/[id]`: `client/product/[id]`, 
                                                                        query:{id:product.value}}} as={(currentUser === "ecom-user") ? `user/product/${product.value}` :  `client/product/${product.value}`}>
                                                            <div className="p-2 cursor-pointer hover:bg-slate-200">
                                                                <span className="">{product.productName}</span>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                ))
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        {/* </div> */}
                    </div>
                    <div className="flex items-center">
                        {
                            (currentUser === "ecom-user") ? (
                                <div className="flex items-center">
                                    <div className="rounded-full bg-slate-300 mr-5 cursor-pointer">
                                        <span className="p-2 align-middle" onClick={() => setShowUserPopup(prevValue => {return !prevValue})}>{userId.charAt(0).toUpperCase()}</span>
                                    </div>
                                    {showUserPopup && 
                                        <div className="relative">
                                            <div className="absolute right-6 top-4 bg-white rounded-md shadow-md z-10">
                                                <div className="w-32">
                                                    <div className="mt-2 text-center font-semibold">{userId}</div>
                                                    <div className="flex p-2 cursor-pointer hover:bg-slate-200" onClick={handleProfile}>
                                                        <Image className="mr-2" src={profileIcon} alt="logout" />
                                                        <span>My Profile</span>
                                                    </div>
                                                    <div className="flex p-2 cursor-pointer hover:bg-slate-200" onClick={handleLogout}>
                                                        <Image className="mr-2" src={logoutIcon} alt="logout" />
                                                        <span>Logout</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                                    
                            ) : (
                                <>
                                    <div className="text-amber-50 mr-8">
                                        <Link href="/">LOGIN/REGISTER</Link>
                                    </div>
                                    <div className="flex cursor-pointer" onClick={navigateToCartPage}>
                                        <div className="text-amber-50 absolute transform -translate-x-[-120%] -translate-y-1/3">{cart?.itemsCount}</div>
                                        <Image src={cartIcon} alt="Cart" className="scale-125" />
                                        <div className="text-amber-50 ml-2 mr-5">Cart</div>
                                    </div>
                                </>
                            )
                        }
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default HeaderPage;