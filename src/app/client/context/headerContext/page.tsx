"use client";
import { createContext, useEffect, useState } from 'react';

interface Directory {
    currentDir: string[],
    addDir: (newDir:string) => void,
    removeDir: (toDir:number) => void,
    resetDir: () => void,
}

export const HeaderContext = createContext<Directory | undefined>(undefined);

const HeaderContextPage = (props:any) => {
    const [currentDir, setCurrentDir] = useState<string[]>([""]);

    const addDir = (newDir:string) => {
        const dirArray = [...currentDir];
        const dirIndex = dirArray.indexOf(newDir);
        console.log("check currDir", currentDir);
        if(dirIndex === -1){
            setCurrentDir((prevArray) => [...prevArray, newDir]);
        }
        else{
            setCurrentDir(dirArray.slice(0,dirIndex+1));
        }
    }

    const removeDir = (toDir:number) => {
        const dirArray = [...currentDir];
        console.log("check dir:", dirArray.slice(0,toDir+1));
        setCurrentDir(dirArray.slice(0,toDir+1));
    }

    const resetDir = () => {
        setCurrentDir([""]);
    }

    const CurrentDirData: Directory = {
        currentDir: currentDir,
        addDir: addDir,
        removeDir: removeDir,
        resetDir: resetDir,
    }

    return (
        <>
            <HeaderContext.Provider value={CurrentDirData}>
                {props.children}
            </HeaderContext.Provider>
        </>
    )
}

export default HeaderContextPage;