"use client";
import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/cartContext/page';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import addIcon from '../../../images/addIcon.svg';
import loaderIcon from '../../../images/loaderIcon.svg';
import removeIcon from '../../../images/removeIcon.svg';
import deleteIcon from '../../../images/deleteIcon.svg';

import { ProductBillingContext } from '../context/billingDetails/page';

interface Product {
    id:number | undefined,
    uuid: string | undefined,
    productName: string | undefined,
    brand: string | undefined,
    price: number | undefined,
    quantity: number,
    imgUrls: string[]
}

const CartPage = () => {
    const router = useRouter();

    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [cartProducts, setCartProducts] = useState<Product[]>([]);

    const cart = useContext(CartContext);
    const billing = useContext(ProductBillingContext);

    useEffect(() => {
        setIsLoading(false);
        if(cart) {
            setCartProducts(cart.cartItems);
        }
    }, []);

    const proceedBilling = () => {
        billing?.buyProducts(cartProducts, cart?.totalCost);
        router.push('/client/billing');
    }

    const showCart = cart?.cartItems.map((item) => (
        <div key={item.id} className="flex mt-5 border-b border-b-slate-300">
            <div className="p-2">
                <img className="h-34 w-40" src={item.imgUrls[0]} alt="image" />
            </div>
            <div className="flex flex-col ml-7">
                <span className="font-bold text-xl tracking-wide text-slate-900">{item.productName}</span>
                <div className="flex">
                    <span className="font-bold text-sm text-slate-500">brand:&nbsp;</span>
                    <span className="font-semibold text-sm text-slate-700"> {item.brand}</span>
                </div>
                <span className="font-bold text-xl text-slate-900">&#8377; {item.price?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')}</span>
                <div className="flex items-center">
                    <span className="font-bold text-base text-slate-700">Quantity:&nbsp;</span>
                    <div className="flex items-center">
                        <button className="m-2" 
                            onClick={() => cart.removeQuantity(item.uuid ?? "")}>
                                <Image src={removeIcon} alt="reduce" />
                        </button>
                        <span className="w-[3rem] h-[1.5rem] font-bold text-xl text-center text-slate-900 border-slate-300 rounded-md bg-slate-50
                                            placeholder-slate-400 focus:outline-none block border-2 focus:border-slate-900 sm:text-sm">{item.quantity}</span>
                        <button className="m-2" 
                            onClick={() => cart.addQuantity(item.uuid ?? "")}>
                                <Image src={addIcon} alt="add" />
                        </button>
                    </div>
                </div>
                <div className="mt-7 flex justify-center cursor-pointer" onClick={() => cart.removeItem(item.uuid ?? "")}>
                    <Image src={deleteIcon} alt="delete" />
                </div>
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
            <div className="bg-slate-50 mx-auto min-h-[52rem] w-4/5">
                <div className="p-2 mx-5 pt-4 border-b border-b-slate-300">
                    <span className="font-sans text-3xl font-semibold tracking-wide text-slate-950">Shopping Cart</span>
                </div>
                <div className="mx-5 p-4">
                    {showCart}
                </div>
                <div className="">
                    <div className="flex justify-end mr-7">
                        <span className="font-semibold text-xl text-bases text-slate-700">Subtotal ({cart?.itemsCount} items):</span>
                        <span className="font-semibold text-xl text-bases text-slate-700">&#8377; {cart?.totalCost.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ',')}</span>
                    </div>
                    <div className="flex justify-end mr-7">
                        <button className="rounded-md bg-slate-700 text-slate-50 px-2 py-1 m-2 hover:bg-slate-950" onClick={proceedBilling}>Proceed</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartPage;