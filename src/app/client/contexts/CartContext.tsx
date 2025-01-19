"use client";
import { createContext, useEffect, useState } from 'react';

interface CartItem {
    id:number | undefined,
    uuid: string | undefined,
    productName: string | undefined,
    brand: string | undefined,
    price: number | undefined,
    quantity: number,
    imgUrls: string[]
}

interface CartItemsCount {
    itemsCount: number,
    addItem: (qty: number, newItem: CartItem) => void,
    removeItem: (uuid: string) => void,
    addQuantity: (uuid: string) => void,
    removeQuantity: (uuid: string) => void,
    cartItems: CartItem[],
    totalCost: number
}

export const CartContext = createContext<CartItemsCount | undefined>(undefined);

const ContextPage = (props:any) => {
    const [itemsCount, setItemsCount] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalCost, setTotalCost] = useState(0);
    
    useEffect(()=> {
        console.log("items count:", itemsCount)
    },[itemsCount])
    
    const addItem = (qty:number, newItem:CartItem) => {
        console.log("added");
        setTotalCost((prevCost) => prevCost+ (newItem.quantity*(newItem?.price ?? 0)));
        setItemsCount((prevCount) => prevCount+qty);
        setCartItems((prevItems) => [...prevItems, newItem]);
    }

    const removeItem = (uuid:string) => {
        const itemFilter = cartItems.filter((item) => (item.uuid === uuid));
        setItemsCount((prevCount) => prevCount-itemFilter[0].quantity);
        setCartItems((prevItems) => {
            const filteredItems = prevItems.filter((item) => (item.uuid !== uuid));
            return filteredItems;
        })
    }

    const addQuantity = (uuid: string) => {
        const updatedList: CartItem[] = [];
        cartItems.map(item => {
            if(item.uuid === uuid){
                item.quantity += 1;
                setTotalCost((prevCost) => prevCost + (item.price ?? 0));
                setItemsCount((prevCount) => prevCount+1);
            }
            updatedList.push(item);
        })
        setCartItems(updatedList);
    }

    const removeQuantity = (uuid: string) => {
        const updatedList: CartItem[] = [];
        cartItems.map(item => {
            if(item.uuid === uuid){
                if(item.quantity !== 1){
                    item.quantity -= 1;
                    setTotalCost((prevCost) => prevCost - (item.price ?? 0));
                    setItemsCount((prevCount) => prevCount-1);
                }
            }
            updatedList.push(item);
        })
        setCartItems(updatedList);  
    }

    const cartData: CartItemsCount = {
        itemsCount: itemsCount,
        addItem: addItem,
        removeItem: removeItem,
        addQuantity: addQuantity,
        removeQuantity: removeQuantity,
        cartItems: cartItems,
        totalCost: totalCost
    };

    return (
        <>
            <CartContext.Provider value={cartData}>
                {props.children}
            </CartContext.Provider>
        </>
    )
}

export default ContextPage;