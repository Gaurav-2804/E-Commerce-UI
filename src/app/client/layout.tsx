"use client";
import React, { useEffect, useState } from 'react';
import BillingContextPage from './context/billingDetails/page';
import ContextPage from "./context/cartContext/page";
import CategoryContextPage from './context/categoryContext/page';
import HeaderContextPage from './context/headerContext/page';
import ToastContextPage from './context/toastContext/page';
import UserProductsContextPage from './context/userProducts/page';
import NavbarPage from "./navbar/page";

export default function ClientLayout({
    children
  }: {
    children: React.ReactNode
  }) {
    
  const [selectedCategoryObject, setSelectedCategoryObject] = useState({});

  const handleSelectedCategory = (value:any) => {
    console.log("handleSelectedCategory:",value);
    setSelectedCategoryObject(value);
  }
  
    return (
      <>
        <HeaderContextPage>
          <ContextPage>
            <CategoryContextPage>
              <UserProductsContextPage>
                <ToastContextPage>
                  <BillingContextPage>
                    <NavbarPage />
                    <section>{children}</section>
                  </BillingContextPage>
                </ToastContextPage>
              </UserProductsContextPage>
            </CategoryContextPage>
          </ContextPage>
        </HeaderContextPage>
      </>
    )
  }
  