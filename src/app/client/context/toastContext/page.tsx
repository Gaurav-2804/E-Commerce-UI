"use client";
import { createContext, useEffect, useState } from 'react';

interface ToastObject {
    message: string,
    showMessage: (msg:string) => void,
}

export const ToastContext = createContext<ToastObject | undefined>(undefined);

const ToastContextPage = (props:any) => {
    const [message, setMessage] = useState("");

    // useEffect(() => {
    //     setMessage("yo");
    //     setTimeout(() => {
    //         setMessage("");
    //     }, 5000);
    // }, []);

    const showMessage = (msg:string) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("");
        }, 5000)
    }

    const ToastData: ToastObject = {
        message: message,
        showMessage: showMessage
    }

    return (
        <>
            <ToastContext.Provider value={ToastData}>
                <div className="w-full absolute left-0 top-28 flex justify-center items-center z-50">
                    <span className="text-sm bg-green-200 px-2">{message}</span>
                </div>
                {props.children}
            </ToastContext.Provider>
        </>
    )
}

export default ToastContextPage;