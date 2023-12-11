"use client";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/cartContext/page";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import addIcon from '../../../../images/addIcon.svg';
import removeIcon from '../../../../images/removeIcon.svg';
import loaderIcon from '../../../../images/loaderIcon.svg';
import { ToastContext } from "../../context/toastContext/page";
import { ProductBillingContext } from "../../context/billingDetails/page";

async function getProductDetails(uuid:any) {
    const res = await fetch(`http://localhost:8080/client/product/${uuid}`);
    return res.json();
}

interface Product {
    id:number,
    uuid: string,
    productName: string,
    category: string,
    brand: string,
    type: string,
    price: number,
}

interface CartItem {
    id:number | undefined,
    uuid: string | undefined,
    productName: string | undefined,
    brand: string | undefined,
    price: number | undefined,
    quantity: number,
    imgUrls: string[]
}

const ProductwithIdPage = (query: any) => {
    const router = useRouter();

    const cart = useContext(CartContext);
    const toastMsg = useContext(ToastContext);
    const billing = useContext(ProductBillingContext);

    const [imageList, setImageList] = useState([]);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [productData, setProductData] = useState<Partial<Product>>({});
    const [specifications, setSpecifications] = useState([]);
    const [description, setDescription] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=> {
        console.log("check product:", query);
        getProductDetails(query.params.id)
            .then(data => {
                console.log('product is', data);
                setProductData(data);
                setImageList(data.fileUrls);
                setSpecifications(data.specifications);
                setDescription(data.description);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
                setIsLoading(false);
            });
    },[])

    const addToCart = () => {
        console.log("check cart:", cart);
        if(cart){
            toastMsg?.showMessage("Item added to cart");
            const itemInfo: CartItem = {
                id: productData.id,
                uuid: productData.uuid,
                productName: productData.productName,
                brand: productData.brand,
                price: productData.price,
                imgUrls: imageList,
                quantity: quantity
            }
            cart.addItem(quantity, itemInfo);
        }
    }

    const buyProduct = () => {
        const billingDetails = {
            id: productData.id,
            uuid: productData.uuid,
            productName: productData.productName,
            brand: productData.brand,
            price: productData.price,
            imgUrls: imageList,
            quantity: quantity
        }
        billing?.buyProduct(billingDetails);
        router.push('/client/billing');
    }

    const imageNavigation = imageList.map((img,idx) => (
        <div key={idx} className="cursor-pointer w-1/2 m-2 border-2 border-slate-300 hover:border-3 hover:border-slate-800">
            <div className="p-2" onMouseEnter={()=> setSelectedImgIndex(idx)}>
                <img src={img} className="max-w-full" alt="" />
            </div>
        </div>
    ))

    return(
        <>
            {isLoading && (
                <div className="flex items-center justify-center fixed top-0 left-0 h-full w-full z-50">
                    <Image src={loaderIcon} alt="Loading" />
                </div>
            )}
            <div className="py-3 mx-auto w-5/6 bg-white">
                <div className="flex">
                    <div className="flex flex-col p-5 w-2/5">
                        <div className="flex p-5 h-[50vh] border-2 border-gray-300">
                            <div className="w-1/4 flex justify-center items-center flex-col">
                                {imageNavigation}
                            </div>
                            <div  className="w-3/4 flex justify-center items-center flex-col">
                                <div className="cursor-pointer m-2">
                                    <div className="p-2">
                                        <img src={imageList[selectedImgIndex]} className="max-w-full h-96" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="m-4 flex items-center justify-center">
                            <span className="font-bold text-lg text-slate-900">Select Quantity: </span>
                            <button className="m-2" 
                                onClick={() => {setQuantity((prevCount) => {
                                    return (prevCount===0)? 0 : prevCount-1;
                                })}}>
                                    <Image src={removeIcon} alt="reduce" />
                            </button>
                            <input type="number" className="w-[3rem] font-bold text-xl text-center text-slate-900 border-slate-300 rounded-md bg-slate-50
                                            placeholder-slate-400 focus:outline-none block border-2 focus:border-slate-900 sm:text-sm" value={quantity} readOnly />
                            <button className="m-2" 
                                onClick={() => setQuantity((prevCount) => prevCount+1)}>
                                    <Image src={addIcon} alt="add" />
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <button className="rounded-md bg-slate-700 text-slate-50 p-3 m-2 hover:bg-slate-950" onClick={() => addToCart()}>ADD TO CART</button>
                            <button className="rounded-md bg-slate-500 text-slate-50 p-3 m-2 hover:bg-slate-950" onClick={buyProduct}>BUY NOW</button>
                        </div>
                    </div>
                    <div className="w-1/2 pl-3">
                        <div className="h-[80vh] p-8">
                            <div className="mb-4">
                                <section className="font-sans text-2xl antialiased tracking-wide text-slate-950">{productData.productName}</section>
                            </div>
                            <div>
                                <label className="font-semibold text-slate-500">Brand: </label>
                                <span className="text-slate-900">{productData.brand}</span>
                            </div>
                            <div>
                                <label className="font-semibold text-slate-500">Category: </label>
                                <span className="text-slate-900">{productData.category}</span>
                            </div>
                            <div>
                                <label className="font-semibold text-slate-500">Type: </label>
                                <span className="text-slate-900">{productData.type}</span>
                            </div>
                            <div className="mt-2">
                                <span className="font-bold text-xl text-slate-900">&#8377; {productData.price?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')}</span>
                            </div>
                            <div className="mt-11">
                                <label className="font-bold text-slate-900">Description: </label>
                                <div className="text-slate-900">
                                    {Object.entries(description).map(([key, value]) => (
                                        <div className="border-t border-t-slate-300 mb-2">
                                            <span className="font-semibold text-slate-800">{key}</span>
                                            <p>{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-11">
                                <label className="font-bold text-slate-900">Specifications: </label>
                                <div className="table w-1/2 text-slate-900 mt-4">
                                    <div className="table-row-group">
                                        {
                                            Object.entries(specifications).map(([key, value]) => (
                                                <div className="table-row">
                                                    <div className="table-cell p-1 border font-semibold text-slate-800">{key}</div>
                                                    <div className="table-cell p-1 border text-slate-800">{value}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductwithIdPage;