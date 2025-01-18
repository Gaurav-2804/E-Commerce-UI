"use client";
import { UserProductsContext } from "@/app/user/layout";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useRef, useState } from "react";
import '../../globals.css';
import ContextPage from "../context/cartContext/page";
import { CategoryTypeContext } from "../context/categoryContext/page";
import { HeaderContext } from "../context/headerContext/page";
import { UserProductsSearchContext } from "../context/userProducts/page";
import { UserTypeContext } from "../context/userTypeContext/page";
import HeaderPage from "./header/page";

interface CategoryTypes {
    key: any;
    value: any;
}


async function getCategories() {
    const res  = await fetch('/client/getCategories');
    return res.json();
}


const NavbarPage = () => {
    const router = useRouter();
    const [categoryList, setCategoryList] = useState([]);
    const [categoryTypes, setCategoryTypes] = useState<CategoryTypes[]>([]);
    const [typeList, setTypeList] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [currentCategory, setCurrentCategory] = useState("");
    const [currentType, setCurrentType] = useState("");
    const [selectedCategoryObject, setSelectedCategoryObject] = useState<CategoryTypes>();

    const [currentUser, setCurrentUser] = useState("");

    const currDir = useContext(HeaderContext);
    const userType = useContext(UserTypeContext);
    const productsSearch = useContext(UserProductsSearchContext);
    const categoryObject = useContext(CategoryTypeContext);

    const SelectedCategoryTypeData = {
        currentCategory: currentCategory,
        currentType: currentType
    }

    const categoryTypesArray = (data: any) => {
        setCategoryTypes((prevCategoryTypes) => {
          const newCategoryTypes = data.map((item: any) => {
            return { key: item['category'], value: item['types'] };
          });
          return [...prevCategoryTypes, ...newCategoryTypes];
        });
    };

    useEffect(() => {
        getCategories()
            .then(data => {
                setCategoryList(data);
                categoryTypesArray(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    },[]);

    useEffect(() => {
        console.log("user type is", productsSearch);
        const curUser = sessionStorage.getItem("userType") ?? "";
        setCurrentUser(curUser);
    }, []);

    const handleCategoryHover = (typeList: any, idx:any, category:any) => {
        setCurrentCategory(category);
        setHoveredIndex(idx);
        setTypeList(typeList);
    };

    const handleAddButton = () => {
        if(currDir) currDir.addDir("Add Product");
        router.push('/user/newProduct');
    }

    const onCategorySelect = (item:any) => {
        currDir?.resetDir();
        currDir?.addDir(item);
        currDir?.addDir(typeList[0]);
        setSelectedCategoryObject(categoryTypes[hoveredIndex]);
        console.log('selected');
        categoryObject?.handleCategory(categoryTypes[hoveredIndex]);
        setHoveredIndex(-1);
        const queryString = `type=${encodeURIComponent(typeList[0])}`;
        if(currentUser === "ecom-user"){
            router.push(`/user/products/${currentCategory.replaceAll(' ','')}?${queryString}`);
        }
        else if(currentUser === "ecom-client") {
            router.push(`/client/products/${currentCategory.replaceAll(' ','')}?${queryString}`);
        }
    }

    const onTypeSelect = (item:any) => {
        currDir?.resetDir();
        currDir?.addDir(currentCategory);
        currDir?.addDir(item);
        console.log('check SelectedCategoryObject', categoryTypes[hoveredIndex]);
        categoryObject?.handleCategory(categoryTypes[hoveredIndex]);
        setCurrentType(item);
        setHoveredIndex(-1);
        const queryString = `type=${encodeURIComponent(item)}`;
        if(currentUser === "ecom-user"){
            router.push(`/user/products/${currentCategory.replaceAll(' ','')}?${queryString}`);
        }
        else if(currentUser === "ecom-client") {
            router.push(`/client/products/${currentCategory.replaceAll(' ','')}?${queryString}`);
        }
        // router.push(`/user/products/${currentCategory.replaceAll(' ','')}/${currentType.replaceAll(' ','')}`);
    }

    const types = (
        <div className="flex flex-col" onMouseLeave={() => {setHoveredIndex(-1)}}>
            {
                typeList.map((item, idx) => (
                    <div
                        key={idx}
                        className="rounded-lg px-3 py-2 text-slate-900 font-medium hover:bg-slate-100 cursor-default"
                        onClick={() => onTypeSelect(item)}
                    >
                        {item}
                    </div>
                ))
            }
        </div>
    )

    const categories = (
        <div className="flex">
            {
                categoryList.map((item, idx) => (
                    <div key={idx}>
                        <div
                            className="rounded-lg px-3 py-2 text-slate-50 font-medium hover:bg-slate-100 hover:text-slate-900 cursor-default"
                            // onMouseEnter = {() => handleCategoryHover(categoryTypes[idx].value)}
                            // onMouseLeave = {() => handleCategoryHover([])}
                            onMouseEnter={() => handleCategoryHover(categoryTypes[idx].value, idx, item['category'])}
                            onMouseLeave={() => {setHoveredIndex(-1)}}
                            onClick={() => onCategorySelect(item['category'])}
                        >
                            {item['category']}
                        </div>
                        { hoveredIndex === idx && (
                            <div className="absolute w-1/2 p-2 bg-white rounded-md shadow-md z-10" onMouseEnter={() => {setHoveredIndex(idx)}}>
                                {types}
                            </div>
                        )}
                    </div> 
                ))
            }
        </div>
    )

    return (
        
        <>
            <div className="sticky top-0 z-50">
                <HeaderPage />
                <nav className="flex justify-between bg-slate-800">
                    <div className="space-x-4 ">
                        <div className="relative">
                            {categories}
                        </div>
                    </div>
                    {
                        (currentUser === "ecom-user")? (
                            <div className="flex items-center mr-3">
                                <div className="rounded-lg px-3 py-2 text-slate-50 font-medium hover:bg-slate-100 hover:text-slate-900">
                                    <button className="" onClick={handleAddButton}>Add a Product</button>
                                </div>
                            </div>
                        ):<></>
                    }
                </nav>
            </div>
        </>
    )
}

export default NavbarPage;