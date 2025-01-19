"use client";
import React, { useEffect, useState } from 'react';
import BillingContextPage from './contexts/BillingContext';
import ContextPage from "./contexts/CartContext";
import CategoryContextPage from './contexts/CategoryContext';
import HeaderContextPage from './contexts/HeaderContext';
import ToastContextPage from './contexts/ToastContext';
import UserProductsContextPage from './contexts/UserProductsContext';
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
  