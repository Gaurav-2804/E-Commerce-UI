"use client";
import { createContext, useEffect, useState } from 'react';

interface CategoryTypeObject {
    key: string;
    value: string[];
}

interface CategoryObjectData {
    selectedCategoryObject: CategoryTypeObject | undefined,
    handleCategory: (value:any) => void,
}

export const CategoryTypeContext = createContext<CategoryObjectData | undefined>(undefined);

const CategoryContextPage = (props:any) => {

    const [selectedCategoryObject, setSelectedCategoryObject] = useState<CategoryTypeObject | undefined>();

    const handleSelectedCategory = (value:any) => {
        console.log("handleSelectedCategory:",value);
        setSelectedCategoryObject(value);
    }

    const categoryData: CategoryObjectData = {
        selectedCategoryObject: selectedCategoryObject,
        handleCategory: handleSelectedCategory
    }

    return (
        <>
            <CategoryTypeContext.Provider value={categoryData}>
                {props.children}
            </CategoryTypeContext.Provider>
        </>
    )

}

export default CategoryContextPage;