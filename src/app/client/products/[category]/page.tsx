"use client";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Router from 'next/router';
import { useContext, useEffect, useState } from "react";

import Image from 'next/image';
import axios from "axios";
import { UserProductsSearchContext } from "../../context/userProducts/page";
import { HeaderContext } from "../../context/headerContext/page";

import loaderIcon from '../../../../images/loaderIcon.svg';
import { CategoryTypeContext } from "../../context/categoryContext/page";

interface CategoryTypeObject {
    key: string;
    value: string[];
}

interface CategoryObjectData {
    selectedCategoryObject: CategoryTypeObject | undefined,
    handleCategory: (value:any) => void,
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

interface FilteredProductObject {
    type: string,
    products: ProductObject[]
}

interface ProductData {
    category: string,
    productsList: ProductObject[],
    id: number,
}


const ClientProductswithCategoryPage = (query: any) => {
    const router = useRouter();

    const[isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<ProductObject[]>([]);
    const [filteredProductList, setFilteredProductList] = useState<FilteredProductObject[]>([]);
    const [productList, setProductList] = useState<ProductObject[]>([]);
    const [typeIndex, setTypeIndex] = useState(0);
    const [currentType, setCurrentType] = useState(query.searchParams.type);
    const [selectedcategoryTypes, setSelectedCategoryTypes] = useState<string[]>([]);

    const categoryType: CategoryObjectData | undefined = useContext(CategoryTypeContext);
    const userProducts: ProductData[] | undefined = useContext(UserProductsSearchContext);
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

    const fillterProductByTypes = (productListArray: ProductObject[], selectedTypes: string[]) => {
        const filterByType: FilteredProductObject[] = [];
        console.log('existingProduct', productListArray);
        productListArray.map((product:ProductObject) => {
            const existingProduct =  filterByType.find((findProduct) => findProduct.type === product['type']);
            
            if(existingProduct) {
                existingProduct.products.push(product);
            }
            else {
                const newType = {
                    type: product['type'],
                    products: [product]
                }
                filterByType.push(newType);
            }
        });
        console.log('check searchparams', query.searchParams.type, filterByType.filter((product) => product.type === currentType));
        const currentTypeList: FilteredProductObject[] = filterByType.filter((product) => product.type === currentType);
        const currTypeIndex = selectedTypes.findIndex((type) => type === currentType);
        setTypeIndex(currTypeIndex);
        console.log('check currenttpelist', currentTypeList, selectedTypes, currentType);
        if(currentTypeList.length > 0) setSelectedTypes(currentTypeList[0].products);
        // setSelectedTypes(filterByType[0].products);
        console.log("FilteredProductList", filterByType);
        setFilteredProductList(filterByType);
    }

    const handlePopState = () => {
        router.push('/client');
    }

    useEffect(() => {
        console.log('check url type', query, query.selectedType);
        window.addEventListener('popstate', handlePopState);
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        console.log('catType', categoryType?.selectedCategoryObject);
        if(categoryType){
            if(categoryType.selectedCategoryObject) {
                setSelectedCategory(categoryType.selectedCategoryObject.key);
                setSelectedCategoryTypes(categoryType.selectedCategoryObject.value);
                console.log('user products are', userProducts);
                if(userProducts){
                    // const productListArray = userProducts[0].productsList;
                    const filteredProductListArray = userProducts.filter((userProduct) => (userProduct.category) === categoryType.selectedCategoryObject?.key);
                    console.log("check availablility",filteredProductListArray);
                    if(filteredProductListArray.length!==0){
                        console.log("check filteredProductListArray",filteredProductListArray[0].productsList);
                        const productListArray = filteredProductListArray[0].productsList;
                        setProductList(filteredProductListArray[0].productsList);
                        fillterProductByTypes(productListArray, categoryType.selectedCategoryObject.value);
                    }
                }
                else{
                    console.log('nothinfss');
                }
            }
        }
        else{
            router.push('/client');
        }
        setIsLoading(false);
    }, [userProducts]);

    const handleSelectedType = (type:string, idx:number) => {
        if(filteredProductList) {
            const filterProductBySelectedType = filteredProductList.filter((filteredProduct) => filteredProduct.type===type);
            if(filterProductBySelectedType.length > 0) {
                setSelectedTypes(filterProductBySelectedType[0].products);
            }
            else{          
                setSelectedTypes([]);
            }
            setTypeIndex(idx);
            currDir?.resetDir();
            currDir?.addDir(selectedCategory);
            currDir?.addDir(type);
            const queryString = `type=${encodeURIComponent(type)}`;
            router.push(`/client/products/${categoryType?.selectedCategoryObject?.key.replaceAll(' ','')}?${queryString}`);
        }
    }

    return (
        <>
            {isLoading && (
                <div className="flex items-center justify-center fixed top-0 left-0 h-full w-full z-50">
                    <Image src={loaderIcon} alt="Loading" />
                </div>
            )}
            <div className={((isLoading)?"blur-sm ":"") + "mx-auto w-2/3 bg-slate-50"}>
                <div className="p-4 min-h-screen">
                    <div className="flex mb-6 justify-center">
                        <span className="font-sans text-xl text-slate-950 font-semibold">{selectedCategory}</span>
                    </div>
                    <div className="flex">
                        <div className="w-1/4 p-4 border-r border-r-slate-400">
                            {
                                selectedcategoryTypes.map((type, idx) => (
                                    <div key={idx} className="cursor-pointer hover:bg-slate-200" onClick={() => handleSelectedType(type,idx)}>
                                        <div className={((idx === typeIndex)?"border border-slate-900 border-l-4 ":"border border-slate-300 ") + "p-3"}>
                                            <span>{type}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="w-3/4 flex">
                            {
                                (selectedTypes.length > 0) ? 
                                    (
                                        selectedTypes.map((product, idx) => (
                                            <div key={idx} className="w-64">
                                                <Link href={{pathname:`user/product/[id]`, query:{id:product.uuid}}} as={`user/product/${product.uuid}`}>
                                                    <div className="p-4 m-4 border cursor-pointer">
                                                        <img src={product.fileUrls[0]} className="h-40 w-40 mx-auto" alt="" />
                                                        <h3 className="text-xl font-semibold text-slate-950">{product.productName}</h3>
                                                        <p className="mt-2 text-slate-500">{product.brand}</p>
                                                        <p className="text-slate-900">&#8377; {product.price}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="">
                                            <div className="p-4">
                                                <span className="font-sans text-xl text-slate-950 font-semibold">No Products Found</span>
                                            </div>
                                        </div>
                                    )
                                
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default ClientProductswithCategoryPage;