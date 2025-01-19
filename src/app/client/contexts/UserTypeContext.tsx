"use client";
import { createContext, useEffect, useState } from 'react';

interface UserType {
    userType: string,
    setUser: (usetType: string) => void,
}

export const UserTypeContext = createContext<UserType | undefined>(undefined);

const UserTypeContextPage = (props:any) => {
    const [userType, setUserType] = useState("");
    
    const setUser = (newUserType:string) => {
        console.log("userType is set to:", newUserType);
        setUserType(newUserType);
    }
    const CurrentUser: UserType = {
        userType: userType,
        setUser: setUser
    }

    return (
        <>
            <UserTypeContext.Provider value={CurrentUser}>
                {props.children}
            </UserTypeContext.Provider>
        </>
    )
}

export default UserTypeContextPage;