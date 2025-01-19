"use client";
import { useContext, useEffect, useState } from "react";


import loaderIcon from '../../../../images/loaderIcon.svg';

import Image from 'next/image';

async function getProductDetails(uuid:any) {
    const res = await fetch(`/api/client/product/${uuid}`);
    return res.json();
}

interface Description {
  [key: string]: string;
}

interface Specification {
    [key: string]: string;
  }

interface Product {
    productName: string,
    brand: string,
    category: string,
    type: string,
    price: number,
    fileUrls: string[],
    description: {},
    specifications: {}
}

const UserProductPage = (query: any) => {
    const [isLoading, setIsLoading] = useState(true);
    const [productData, setProductData] = useState<Partial<Product>>({});
    const [imageList, setImageList] = useState([]);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [descriptionObject, setDescriptionObject] = useState<Description>({});
    const [specificationObject, setSpecificationObject] = useState<Specification>({});

    useEffect(() => {
        getProductDetails(query.params.id)
            .then(data => {
                console.log('product is', data);
                setImageList(data.fileUrls);
                setDescriptionObject(data.description);
                setSpecificationObject(data.specifications);
                setProductData(data);
                setIsLoading(false);
            })
    }, [])

    const imageNavigation = imageList.map((img,idx) => (
        <div key={idx} className="cursor-pointer w-1/2 m-2 border-2 border-slate-300 hover:border-3 hover:border-slate-800">
            <div className="p-2" onMouseEnter={()=> setSelectedImgIndex(idx)}>
                <img src={img} className="max-w-full" alt="" />
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
            <div className={((isLoading)?"blur-sm ":"") + "py-3 mx-auto w-5/6 bg-white"}>
                <div className="flex">
                    <div className="flex flex-col p-5 w-2/5">
                        <div className="flex p-5 h-[50vh] border-2 border-gray-300">
                            <div className="w-1/4 flex justify-center items-center flex-col">
                                {imageNavigation}
                            </div>
                            <div  className="w-3/4 flex justify-center items-center flex-col">
                                <div className="cursor-pointer m-2">
                                    <div className="p-2">
                                        <img src={imageList[selectedImgIndex]} className="max-w-full max-h-96" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 pl-3">
                        <div className="h-[80vh] p-8 overflow-auto">
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
                                    {
                                        Object.keys(descriptionObject).map((key) => (
                                            <div className="border-b border-b-slate-300 mb-2">
                                                <span className="font-semibold text-slate-800">{key}: </span>
                                                <p>{descriptionObject[key]}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="mt-11">
                                <label className="font-bold text-slate-900">Specifications: </label>
                                <div className="table w-1/2 text-slate-900 mt-4">
                                    <div className="table-row-group">
                                        {
                                            Object.keys(specificationObject).map((key) => (
                                                <div className="table-row">
                                                    <div className="table-cell p-1 border font-semibold text-slate-800">{key}</div>
                                                    <div className="table-cell p-1 border text-slate-800">{specificationObject[key]}</div>
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

export default UserProductPage;