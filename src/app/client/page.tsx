"use client";
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';

import nextIcon from '../../images/nextIcon.svg';
import prevIcon from '../../images/prevIcon.svg';
import dotIcon from '../../images/dotIcon.svg';
import activeDotIcon from '../../images/activeDotIcon.svg';
import loaderIcon from '../../images/loaderIcon.svg';

import { UserTypeContext } from './context/userTypeContext/page';
import ToastContextPage, { ToastContext } from './context/toastContext/page';

async function getAllProducts() {
    const res = await fetch('/client/getDetails');
    return res.json();
}

async function getCarouselImages() {
    const res = await fetch('/client/getCarousels');
    return res.json();
}

interface ProductObject {
    id: number,
    uuid: string,
    productName: string,
    brand: string,
    fileUrls: string[], 
    price: number,
    type: string
}

interface ProductsData {
    id: number,
    category: string,
    productsList: ProductObject[]
}

const ClientPage = () => {
    const [products, setProducts] = useState<ProductsData[]>([]);
    const [fileUrl, setFileUrl] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [carouselArray, setCarouselArray] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const userType = useContext(UserTypeContext);

    useEffect(() => {
        sessionStorage.setItem('userType', "ecom-client");
        userType?.setUser("ecom-client");
        setIsLoading(true);
        getAllProducts()
            .then(data => {
                setProducts(data);
                console.log('imgData', data);
                setFileUrl(data[0].fileUrls[0]);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setIsLoading(false);
            });

        getCarouselImages()
            .then(data => {
                console.log("carousel images:", data.slice(1));
                setCarouselArray(data.slice(1));
                setCurrentIndex(0);
                startCarouselTimer(data.length-1);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching carosel images:', error);
                setIsLoading(false);
            });
    }, []);

    const startCarouselTimer = (carouselLength:any) => {
        const timer = setInterval(() => setCurrentIndex((prevIndex) => {            
            if(prevIndex >= carouselLength-1) {console.log('greayer', prevIndex, carouselLength); return 0;}
            else {console.log('checkprevIndex', prevIndex); return prevIndex+1;}
        }), 5000);
    }

    function slideTo(index:any) {
        console.log("index check:", index, currentIndex, carouselArray.length);
        if(index<0){
            setCurrentIndex(carouselArray.length-1);
        }
        else if(index >= carouselArray.length) {
            console.log("limit exceed");
            setCurrentIndex(0);
        }
        else{
            console.log("limit set", index);
            setCurrentIndex(index);
        }
        console.log("currentIndex:", currentIndex);
    }


    useEffect(() => {
        // startCarouselTimer();
    }, []);


    const showProducts = (
        <div className="p-4">
            {
                products.map((productFilter,idx) => (
                    <div key={idx}>
                        <div>
                            <span className="text-slate-950 font-semibold font-sans text-xl">{productFilter.category}</span>
                        </div>
                        <div className="">
                            <div className="flex">
                                {productFilter.productsList.map((product, idx) => (
                                    <div key={idx} className="w-64">
                                        <Link href={{pathname:`client/product/[id]`, query:{id:product['uuid']}}} as={`client/product/${product['uuid']}`}>
                                            <div className="p-4 m-4 border border-slate-300 hover:border-slate-700">
                                                <img src={product['fileUrls'][0]} className="h-40 w-40 mx-auto" alt="" />
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
            }
        </div>
    )

    return (
        <>
            {isLoading && (
                <div className="flex items-center justify-center fixed top-0 left-0 h-full w-full z-50">
                    <Image src={loaderIcon} alt="Loading" />
                </div>
            )}
            <div className="mx-auto w-2/3 bg-slate-50 min-h-screen">
                <div className="p-4">
                    <div className="relative w-full h-96">
                        <div className="relative w-full overflow-hidden z-0">
                            {
                                carouselArray.map((carousel,idx) => (idx === currentIndex)?(
                                    <div key={idx} className="slide relative float-left -mr-[100%] w-full">
                                        <img className="mx-auto" src={carousel} alt="img" />
                                    </div>
                                ):(<></>))
                            }
                        </div>
                        <div className="flex justify-center mt-2">
                            {carouselArray.map((carousel, idx) => (
                                <div className="" key={idx}>
                                    {(idx===currentIndex)?(<Image src={activeDotIcon} alt="activeDot" />):<Image src={dotIcon} alt="dot" />}
                                </div>
                            ))}
                        </div>
                        <button id="prevButton" className="absolute bottom-0 left-0 top-0 z-[1] flex w-[10%] items-center justify-center" onClick={() => {slideTo(currentIndex-1)}}>
                            <span>
                                <Image src={prevIcon} alt="prev" />
                            </span>
                        </button>
                        <button id="nextButton" className="absolute bottom-0 right-0 top-0 z-[1] flex w-[10%] items-center justify-center" onClick={() => {slideTo(currentIndex+1)}}>
                            <span>
                                <Image src={nextIcon} alt="next" />
                            </span>
                        </button>
                    </div>
                </div>
                <div className="flex p-2">
                    {showProducts}
                </div>
            </div>
        </>
    )
}

export default ClientPage;