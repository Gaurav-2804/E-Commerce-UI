"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, useFieldArray, useController, Controller } from 'react-hook-form';
import '../../globals.css';
import Image from 'next/image';
import Router from 'next/router';
import { useRouter } from 'next/navigation';

import previewIcon from '../../../images/previewIcon.svg';
import addIcon from '../../../images/addIcon.svg';
import removeIcon from '../../../images/removeIcon.svg';
import successIcon from '../../../images/successIcon.svg';
import loaderIcon from '../../../images/loaderIcon.svg';
import { setCookie } from 'cookies-next';
import { before } from 'node:test';

const NewProductPage = () => {
    const router = useRouter();
    const[isLoading, setIsLoading] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [categoryTypes, setCategoryTypes] = useState([]);
    const [showPreviewIcon, setShowPreviewIcon] = useState<boolean[]>([false]);
    const [previewImage, setPreviewImage] = useState<string[]>(['']);
    const [previewIconClicked, setPreviewIconClicked] = useState<boolean[]>([false]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showSpecInput, setShowSpecInput] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        Router.events.on('routeChangeStart', () => setIsLoading(true));
        Router.events.on('routeChangeComplete', () => setIsLoading(false));
    }, [])

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

    const getUserId = async () => {
        const payload = {
            username: sessionStorage.getItem('userId')
        }
        axios
            .post('/api/user/get',payload)
            .then((res) => {
                console.log("user is:",res.data);
            })
            .catch((err) => {
                setCookie('authenticated', false, { path: '/',});
                console.log("error on user creation:", err);
            })
    }


    const getCategories = async () => {
        axios
            .get('/api/client/getCategories')
            .then((res) => {
                console.log('categories:', res.data);
                setCategoryList(res.data);
            })
            .catch((err) => {
                console.log("error on user creation:", err);
            })
    }


    useEffect(() => {
        const token = sessionStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        getUserId();
        getCategories();
    }, [])

    const {
        register,
        watch,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            productName: "",
            brand: "",
            category: "",
            type: "",
            price: null,
            fileArray: [{file:""}],
            specsArray: [{speckey:"", specvalue:""}],
            discArray: [{discTitle:"", discInfo:""}],
        }
    });

    const {
        fields: fileList,
        append: appendFile,
        remove: removeFile,
    } = useFieldArray({
        control,
        name: 'fileArray'
    })

    const {
        fields: specList,
        append: appendSpecs,
        remove: removeSpecs,
    } = useFieldArray({
        control,
        name: 'specsArray'
    })

    const {
        fields: discList,
        append: appendDisc,
        remove: removeDisc,
    } = useFieldArray({
        control,
        name: 'discArray'
    })

    const uploadData = (data: any) => {
        console.log('submitted data:',data);
        const formData = new FormData();
        const specMap: { [key: string]: string } = {};
        data.specsArray.map((spec: any, idx: any) => {
            const speckey = spec.speckey;
            const specvalue = spec.specvalue;
            specMap[speckey] = specvalue;
        })
        const discMap: { [key: string]: string } = {};
        data.discArray.map((disc: any, idx: any) => {
            const title = disc.discTitle;
            const info = disc.discInfo;
            discMap[title] = info;
        })
        console.log('specMap:', specMap);
        const payload = {
            productName: data.productName,
            brand: data.brand,
            price: data.price,
            category: data.category,
            type: data.type,
            specifications: specMap,
            description: discMap,
            userId: sessionStorage.getItem('userId'),
        }

        const productData = JSON.stringify(payload);
        const blob = new Blob([productData], {
            type: 'application/json'
          });
        const fileList: any[] = [];
        data.fileArray.map((file:any, idx:any) => {
            fileList.push(file.file[0]);
            formData.append(`files`, file.file[0]);
        })
        console.log("fileArray",fileList);
        formData.append('productData', blob);
        // formData.append('imgFile', data.file[0]);
        console.log('form data:',formData);

        const headers = {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
        }

        axios
            .post('/api/user/insertDetails', formData, {headers})
            .then((res) => {
                console.log('inserted details', res.data);
                setShowPopup(true);
            })
            .catch((err) => {
                console.log("error while inserting:", err);
            })
    }

    const changeCategoryType =(e: any) => {
        const selectedCategory = e.target.options.selectedIndex;
        console.log("check", categoryList[selectedCategory-1]['types']);
        const typeList = categoryList[selectedCategory-1]['types'];
        setCategoryTypes(typeList);
    }

    const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>, idx:any) => {
        const fileInput = e.target as HTMLInputElement;
        const imgFile = fileInput.files?.[0];
        console.log('filecheck:', fileInput, imgFile);
        if(imgFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const tempImageArray = [...previewImage];
                const tempPreviewIconArray = [...showPreviewIcon];
                tempImageArray[idx] = reader.result as string;
                tempPreviewIconArray[idx] = true;
                setPreviewImage(tempImageArray);
                setShowPreviewIcon(tempPreviewIconArray);
            }
            reader.readAsDataURL(imgFile);
        } else {
            setShowPreviewIcon(showPreviewIcon);
            setPreviewImage(previewImage);
        }
    }

    const addImage = () => {
        setShowPreviewIcon([...showPreviewIcon, false]);
        setPreviewIconClicked([...previewIconClicked, false]);
        setPreviewImage([...previewImage, '']);
        return appendFile({file: ""});
    }

    const removeImage = (idx:any) => {
        console.log("before removing image:", idx, showPreviewIcon, previewIconClicked, previewImage);
        setShowPreviewIcon((previewIcon) => {
            const previewIconArray = [...previewIcon];
            if(idx === fileList.length-1) return previewIconArray.slice(0,-1);
            else if(idx===0) {
                const updatedArray = previewIconArray.slice(1, fileList.length);
                return updatedArray;
            }
            else{
                const leftSideArray = previewIconArray.slice(0,idx);
                const rightSideArray = previewIconArray.slice(idx+1, fileList.length);
                const updatedArray = leftSideArray.concat(rightSideArray);
                return updatedArray;
            }
            // return previewIconArray.slice(0,-1);
        });
        setPreviewIconClicked((prevClicked) => {
            const prevClickArray = [...prevClicked];
            if(idx === fileList.length-1) return prevClickArray.slice(0,-1);
            else if(idx===0) {
                const updatedArray = prevClickArray.slice(1, fileList.length);
                return updatedArray;
            }
            else{
                const leftSideArray = prevClickArray.slice(0,idx);
                const rightSideArray = prevClickArray.slice(idx+1, fileList.length);
                const updatedArray = leftSideArray.concat(rightSideArray);
                return updatedArray;
            }
            // return prevClickArray.slice(0,-1);
        });
        setPreviewImage((prevImages) => {
            const prevImgArray = [...prevImages];
            if(idx === fileList.length-1) return prevImgArray.slice(0,-1);
            else if(idx===0) {
                const updatedArray = prevImgArray.slice(1, fileList.length);
                return updatedArray;
            }
            else{
                const leftSideArray = prevImgArray.slice(0,idx  );
                const rightSideArray = prevImgArray.slice(idx+1, fileList.length);
                const updatedArray = leftSideArray.concat(rightSideArray);
                return updatedArray;
            }
            // return prevImgArray.slice(0,-1);
        });
        removeFile(idx);
        console.log("after removing image:", showPreviewIcon, previewIconClicked, previewImage);
    }

    const handleImageErrorIcon = (e:any) => {
        console.log("imgIconEror", e);
    }

    const afterFormSubmit = () => {
        setShowPopup(false);
        setPreviewImage(['']);
        setShowPreviewIcon([false]);
        setPreviewIconClicked([false]);
        setCurrentIndex(0);
        reset();
        router.push('/user');
    }

    const categoryData = (
        <div>
            <select className="mt-1 px-3 py-2 w-2/5 border-slate-300 bg-slate-50
                            placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm" 
                            data-te-select-init 
                            {...register('category',
                            {
                                // required: true,
                                onChange: (e) => {
                                    changeCategoryType(e);
                                }
                            })} defaultValue={""} >
                <option value="" disabled>Select Category</option>
                {categoryList.map((item,idx) => (
                    <option key={idx} value={item['category']}>{item['category']}</option>
                ))}
            </select>
        </div>
    );

    const typeList = (
        <div>
            <select className="mt-1 px-3 py-2 w-2/5 border-slate-300 bg-slate-50
                            placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm" 
                            data-te-select-init 
                            {...register('type', 
                            {
                                // required: true,
                                disabled: watch('category')==="Select Category"
                            })} defaultValue={""} >
                <option value="" disabled>Select Type</option>
                {categoryTypes.map((item,idx) => (
                    <option key={idx} value={item}>{item}</option>
                ))}
            </select>
        </div>
    );

    const specsContainer = (
        <div>
            <div className="w-full">
                <div className="">
                    {
                        specList.map((spec, idx) => {  
                            return (
                                <div>
                                    <div className="inline-flex items-center">
                                        <div className="">
                                            <input 
                                                className="mt-1 px-3 py-2 w-full bg-white border border-slate-300 
                                                placeholder-slate-400 font-bold focus:outline-none focus:border-sky-500 focus:ring-
                                                sky-500 block sm:text-sm focus:ring-1"
                                                {...register(`specsArray.${idx}.speckey`, {required: "Please enter key"})}
                                            />
                                            {(!errors.specsArray?.[idx]?.speckey && !errors.specsArray?.[idx]?.specvalue)?(<></>)
                                                :(errors.specsArray?.[idx]?.speckey) ? (<span className="text-red-500 mt-1 py-2 object-fill">{errors.specsArray?.[idx]?.speckey?.message}</span>):(<div className="mt-2 py-2"></div>)}
                                        </div>
                                        <div className="">
                                            <input 
                                                className="mt-1 px-3 py-2 w-full bg-white border border-slate-300 
                                                placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-
                                                sky-500 block sm:text-sm focus:ring-1"
                                                {...register(`specsArray.${idx}.specvalue`, {required: "Please enter value"})}
                                            />
                                            {(!errors.specsArray?.[idx]?.speckey && !errors.specsArray?.[idx]?.specvalue)?(<></>)
                                                :(errors.specsArray?.[idx]?.specvalue) ? (<span className="text-red-500 mt-1 py-2">{errors.specsArray?.[idx]?.specvalue?.message}</span>):(<div className="mt-2 py-2"></div>)}
                                        </div>
                                        
                                        <div className="relative group mt-1 ml-2 w-[fit-content]" onClick={() => removeSpecs(idx)} >
                                            <div className="">
                                                <Image src={removeIcon} alt="remove" className="cursor-pointer" />
                                            </div>
                                            <div className="group/item absolute top-6 left-5 p-1 bg-slate-500  rounded-md hidden group-hover:block">
                                                <div className="text-white text-[12px]">Remove</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>  
            <div className="relative group m-2 w-[fit-content]" onClick={() => appendSpecs({speckey: "", specvalue: ""})} >
                <div className="">
                    <Image src={addIcon} alt="add" className="cursor-pointer" />
                </div>
                <div className="group/item absolute top-6 left-5 p-1 bg-slate-500  rounded-md hidden group-hover:block">
                    <div className="text-white text-[12px]">Add</div>
                </div>
            </div> 
        </div>
    )


    const descriptionContainer = (
        <div>
            <div>
                {
                    discList.map((disc,idx) => (
                        <div>
                            <div className="flex justify-end">
                                <span className="cursor-pointer" onClick={() => removeDisc(idx)}>&times;</span>
                            </div>
                            <div>
                                <input 
                                    className="mt-1 px-3 py-2 w-full bg-white border border-slate-300 
                                    placeholder-slate-400 font-bold focus:outline-none focus:border-sky-500 focus:ring-
                                    sky-500 block sm:text-sm focus:ring-1"
                                    {...register(`discArray.${idx}.discTitle`, {required: "Please enter Title"})}
                                    placeholder="Title"
                                />
                                {errors.discArray?.[idx]?.discTitle && <span className="text-red-500 mt-1 py-2">{errors.discArray?.[idx]?.discTitle?.message}</span>}
                            </div>
                            <div>
                                <textarea 
                                    className="mt-1 px-3 py-2 w-full bg-white border shadow-sm border-slate-300 
                                        placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-
                                        sky-500 block rounded-md sm:text-sm focus:ring-1" 
                                        {...register(`discArray.${idx}.discInfo`, {required: "Please enter information"})} 
                                    placeholder="description"
                                />
                                {errors.discArray?.[idx]?.discInfo && <span className="text-red-500 mt-1 py-2">{errors.discArray?.[idx]?.discInfo?.message}</span>}
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="relative group m-2 w-[fit-content]" onClick={() => appendDisc({discTitle: "", discInfo: ""})} >
                <div className="">
                    <Image src={addIcon} alt="add" className="cursor-pointer" />
                </div>
                <div className="group/item absolute top-6 left-5 p-1 bg-slate-500  rounded-md hidden group-hover:block">
                    <div className="text-white text-[12px]">Add</div>
                </div>
            </div> 
        </div>
    );

    return (
        <>
            {isLoading && (
                <div className="flex items-center justify-center fixed top-0 left-0 h-full w-full z-50">
                    <Image src={loaderIcon} alt="Loading" />
                </div>
            )}
            <div className={((isLoading)?"blur-sm ":"") + "mx-auto w-5/6 bg-slate-50"}>
                <form className="p-5" onSubmit={handleSubmit(uploadData)}>
                    <div className="flex min-h-[28em]">
                        <div className="w-3/5">
                            <div className="flex p-5 w-2/5 h-1/2 absolute">
                                <div className="w-1/4 flex justify-center items-center flex-col border-dashed border-2 border-slate-300">
                                    {/* <div className="cursor-pointer w-1/2 h-1/5 m-2 border-2 border-slate-300 hover:border-3 hover:border-slate-800" onClick={() => setCurrentIndex(0)}>
                                        <div className="p-2">
                                            <img src={previewImage[0]} className="max-w-full" />
                                        </div>
                                    </div> */}
                                    {
                                        fileList.map((item, idx) => {
                                            console.log("index check:",idx);
                                            return (
                                                <div className={((fileList.length<5)?"w-full h-1/5 ":"w-4/5 h-[10%] ") + "flex items-center justify-center m-2"}>
                                                    <div key={idx} className={((fileList.length<5)?"w-1/2 h-full ":"w-1/3 h-full ") + "cursor-pointer border-2 border-slate-300 hover:border-3 hover:border-slate-800"} onClick={() => setCurrentIndex(idx)}>
                                                        <div className="p-2">
                                                            <img src={previewImage[idx]} className="max-w-full max-h-[4rem]" onError={(e) => handleImageErrorIcon(e)}/>
                                                        </div>
                                                    </div>
                                                    {
                                                        (fileList.length>1)? (
                                                            <div className="flex items-center relative group m-2" onClick={() => removeImage(idx)}>
                                                                <div>
                                                                    <Image src={removeIcon} alt="remove" className="cursor-pointer" />
                                                                </div>
                                                                <div className="group/item absolute top-6 left-5 p-1 bg-slate-500  rounded-md hidden group-hover:block">
                                                                    <div className="text-white text-[12px]">Remove</div>
                                                                </div>
                                                            </div>
                                                        ) : (<></>)
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        (fileList.length<7) ? (
                                                <div className="relative group m-2" onClick={addImage}>
                                                    <div>
                                                        <Image src={addIcon} alt="add" className="cursor-pointer" />
                                                    </div>
                                                    <div className="group/item absolute top-6 left-5 p-1 bg-slate-500  rounded-md hidden group-hover:block">
                                                        <div className="text-white text-[12px]">Add</div>
                                                    </div>
                                                </div>
                                            ) : (<></>)
                                    }
                                        
                                </div>
                                {/* <div className={"w-3/4 h-full border-dashed border-2 border-slate-300 flex justify-center items-center " + ((currentIndex===0)?"block":"hidden")}>
                                    <div className="w-full flex justify-center">
                                        <div className={(previewIconClicked[0]) ? 'hidden':'block'}>
                                            <div className="m-2">
                                                <label className="flex items-center">
                                                    <input type="file" className="cursor-pointer text-sm text-slate-500
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-violet-50 file:text-violet-700
                                                        hover:file:bg-violet-100"
                                                        {...register(`fileArray.${0}.file`, {required: true, onChange: (e) => {handleImageChange(e,0)}})}
                                                    />
                                                </label>
                                            </div>
                                            <div className={"flex justify-center m-2 " + ((showPreviewIcon[0]) ? 'block': 'hidden')}>
                                                <div className="relative group m-2">
                                                    <div id="preview-icon" onClick={() => {setPreviewIconClicked(prevState => {
                                                        const updatedState = [...prevState];
                                                        updatedState[0] = true;
                                                        return updatedState;
                                                    })}}>
                                                        <Image src={previewIcon} alt="preview" className="cursor-pointer" />
                                                    </div>
                                                    <div className="group/item absolute top-6 left-5 p-1 bg-slate-500  rounded-md hidden group-hover:block">
                                                        <div className="text-white text-[12px]">Preview</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={(previewIconClicked[0]) ? 'block': 'hidden'}>
                                            <div className="cursor-pointer flex justify-end mr-2" onClick={() => {setPreviewIconClicked(prevState => {
                                                        const updatedState = [...prevState];
                                                        updatedState[0] = false;
                                                        return updatedState;
                                            })}}>
                                                &times;
                                            </div>
                                            <div className="">
                                                <img src={previewImage[0]} alt="Preview" className="max-w-full h-96" />
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                {
                                    fileList.map((item,idx) => {
                                        console.log('check in field:',idx, currentIndex);
                                        return (
                                            <div className={"w-3/4 h-full border-dashed border-2 border-slate-300 flex justify-center items-center " + ((currentIndex===idx)?"block":"hidden")}>
                                                <div className="w-full flex justify-center">
                                                    <div className={"p-5 border-2 " + ((previewIconClicked[idx]) ? "hidden":"block")}>
                                                        <div className="m-2">
                                                            <label className="flex items-center">
                                                                <input type="file" className="cursor-pointer text-sm text-slate-500
                                                                    file:mr-4 file:py-2 file:px-4
                                                                    file:rounded-full file:border-0
                                                                    file:text-sm file:font-semibold
                                                                    file:bg-violet-50 file:text-violet-700
                                                                    hover:file:bg-violet-100"
                                                                    {...register(`fileArray.${idx}.file`, {required: true, onChange: (e) => {handleImageChange(e,idx)}})}
                                                                />
                                                            </label>
                                                        </div>
                                                        <div className={"flex justify-center m-2 " + ((showPreviewIcon[idx]) ? 'block': 'hidden')}>
                                                            <div className="relative group m-2">
                                                                <div id="preview-icon" onClick={() => {setPreviewIconClicked(prevState => {
                                                                    const updatedState = [...prevState];
                                                                    updatedState[idx] = true;
                                                                    return updatedState;
                                                                })}}>
                                                                    <Image src={previewIcon} alt="preview" className="cursor-pointer" />
                                                                </div>
                                                                <div className="group/item absolute top-6 left-5 p-1 bg-slate-500  rounded-md hidden group-hover:block">
                                                                    <div className="text-white text-[12px]">Preview</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={(previewIconClicked[idx]) ? 'block': 'hidden'}>
                                                        <div className="cursor-pointer flex justify-end mr-2" onClick={() => {setPreviewIconClicked(prevState => {
                                                                    const updatedState = [...prevState];
                                                                    updatedState[idx] = false;
                                                                    return updatedState;
                                                        })}}>
                                                            &times;
                                                        </div>
                                                        <div className="">
                                                            <img src={previewImage[idx]} alt="Preview" className="max-w-full h-96" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="w-1/2 pl-3">
                            <div className="p-8">
                                    <label className="block mb-4">
                                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                                            Product Name
                                        </span>
                                        <input className="mt-1 px-3 py-2 w-2/5 border-slate-300 bg-slate-50
                                            placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm" 
                                            {...register('productName', {required: "Please enter product name"})} 
                                        />
                                        <span className="text-red-500 mb-4">{errors.productName?.message}</span>
                                    </label>
                                    <label className="block mb-4">
                                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                                            Brand
                                        </span>
                                        <input className="mt-1 px-3 py-2 w-2/5 border-slate-300 bg-slate-50
                                            placeholder-slate-400 focus:outline-none block border-b-2 focus:border-slate-900 sm:text-sm" 
                                            {...register('brand', {required: "Please enter brand name"})} 
                                        />
                                        <span className="text-red-500 mb-4">{errors.brand?.message}</span>
                                    </label>
                                    <label className="block mb-4">
                                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                                            Category
                                        </span>
                                        {categoryData}
                                        {errors.category && <p className="text-red-500 mb-4">Please select category</p>}
                                    </label>
                                    <label className="block mb-4">
                                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                                            Type
                                        </span>
                                        {typeList}
                                        {errors.type && <p className="text-red-500 mb-4">Please select type</p>}
                                    </label>
                                    <label className="block mb-4">
                                        <span className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                                            Price
                                        </span>
                                        <div className="block">
                                            <span>&#8377;</span>
                                            <input type="number" className="mt-1 px-3 py-2 w-2/5 border-slate-300 bg-slate-50
                                                placeholder-slate-400 focus:outline-none border-b-2 focus:border-slate-900 font-bold" 
                                                {...register('price', {required: "Please enter price"})} />
                                        </div>
                                        <span className="text-red-500 mb-4">{errors.price?.message}</span>
                                    </label>
                            </div>
                        </div>
                    </div>
                    <div className="m-3 p-5 w-1/2">
                        <div className="w-2/3">
                            <div className="flex mb-2 border-b-2">
                                <div className={((showSpecInput)?"bg-slate-300 ":" ") + ((errors.specsArray)?"bg-red-300 ":"") + ("p-2 rounded-t-md cursor-pointer")} 
                                        onClick={() => setShowSpecInput(true)}>
                                    <span className={(showSpecInput)?"text-slate-950":"text-slate-500"}>Specifications</span>
                                </div>
                                <div className={((!showSpecInput)?"bg-slate-300 ":" ") + ((errors.discArray)?"bg-red-300 ":"") + ("p-2 rounded-t-md cursor-pointer")} 
                                        onClick={() => setShowSpecInput(false)}>
                                    <span className={(!showSpecInput)?"text-slate-950":"text-slate-500"}>Description</span>
                                </div> 
                            </div>
                            <div>
                                {(showSpecInput)? specsContainer: descriptionContainer}
                            </div>
                        </div>  
                    </div>
                    <div className="flex justify-center">
                        <input className="px-4 py-1 rounded-full bg-slate-950 text-slate-100
                            border border-purple-200 hover:text-white hover:bg-slate-900 hover:border-transparent
                            focus:outline-none cursor-pointer" 
                            type="submit"
                        />
                    </div>
                </form>
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white px-6 py-4 rounded-md">
                            <div className="flex justify-center mt-2">
                                <Image src={successIcon} alt="success" />
                            </div>
                            <span className="mt-3 text-slate-900 font-sans text-xl antialiased">Product Added Successfully</span>
                            <div className="flex justify-center">
                                <button onClick={()=> afterFormSubmit()} className="mt-4 px-4 py-2 bg-slate-900 text-sm text-white rounded-md">
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default NewProductPage;