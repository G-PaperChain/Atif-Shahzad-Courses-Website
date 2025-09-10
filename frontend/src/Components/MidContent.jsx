import React, { useState, useEffect, useMemo } from 'react'
import Student from '/greenStudent.png'
import UniLogo from '/unilogo.png'
import bgUp from '/bgup.svg'
import { MdOutlineStarPurple500 } from "react-icons/md";
import { HiMiniSparkles } from "react-icons/hi2";
import Nantes from '/Nantes.png'

const MidContent = () => {
    const words = ["learning", "coding", "exploring", "innovating"];
    const [wordIndex, setWordIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [typing, setTyping] = useState(true);

    const longestWordLength = useMemo(
        () => Math.max(...words.map(w => w.length)),
        [words]
    );

    useEffect(() => {
        let timeout;
        if (typing) {
            if (displayed.length < words[wordIndex].length) {
                timeout = setTimeout(() => {
                    setDisplayed(words[wordIndex].slice(0, displayed.length + 1));
                }, 150);
            } else {
                timeout = setTimeout(() => setTyping(false), 1200);
            }
        } else {
            if (displayed.length > 0) {
                timeout = setTimeout(() => {
                    setDisplayed(words[wordIndex].slice(0, displayed.length - 1));
                }, 100);
            } else {
                setTyping(true);
                setWordIndex(prev => (prev + 1) % words.length);
            }
        }
        return () => clearTimeout(timeout);
    }, [displayed, typing, wordIndex, words]);


    return (
        <div className='flex flex-col bg-green-100 h-168 z-0'>
            <h1 className="text-6xl font-bold flex justify-center mt-16 text-transparent bg-clip-text bg-gradient-to-b from-green-800 to-green-500 p-2">
                <HiMiniSparkles className='text-amber-500 mr-2.5 text-3xl cursor-pointer transition-all duration-200 hover:text-amber-400' />
                Welcome to hub of&nbsp;
                <span
                    className="typing-effect"
                    style={{
                        width: `${longestWordLength}ch`,
                    }}>
                    {displayed}
                    <span className="caret">|</span>

                </span>
            </h1>

            <div className="grid grid-cols-3 mt-12">

                <div className="border-0 border-amber-600 flex justify-center items-center p-4 flex-col gap-2">
                    <p className="text-green-700 text-xl font-semibold text-center bg-green-200 px-4 w-1/2 py-5 rounded-2xl">
                        "High-quality learning designed to help you achieve your personal and professional goals."
                    </p>
                    <button className=' bg-green-700 border-0 border-gray-900 py-2 px-4 rounded-radius hover:bg-green-800 cursor-pointer text-gray-50 text-lg transition-colors duration-200'
                    onClick={() => alert("hehe")}
                    >Get Started</button>
                </div>

                <div className="border-0 border-amber-600 flex justify-center items-center h-full scol-start-2 scol-end-4">
                    <img src={Student} alt="Atif Shahzad" className="h-full w-full scale-140 select-none" />
                </div>

                <div className='CARDS'>

                    <div className="absolute top-48 right-16  h-48 w-max flex flex-col bg-gray-200 px-6 py-12 rounded-4xl hover:bg-gray-300 cursor-pointer justify-center transition-all duration-500 ease-in-out transform hover:scale-105 z-10">
                        <h2 className='text-4xl'><img src={UniLogo} className="" width={48} />Professor </h2>
                        <p className='font-light text-right mr-2'>At King Abdul Aziz</p>
                        <p className='font-light text-right mr-2'>University</p>
                    </div>

                    <div className="fixed top-86 right-54 h-48 w-max0 flex flex-col bg-gray-200 px-6 py-12 rounded-4xl hover:bg-gray-300 transition-all duration-200 cursor-pointer justify-center transition-all duration-500 ease-in-out transform hover:scale-105 z-10">
                        <h2 className='text-4xl'><img src={Nantes} className="rounded-rounded-full mb-2" width={40} />(Ph.D.)</h2>
                        <p className='font-light text-right mr-2'>from Nantes Université</p>
                        <p className='font-light text-right mr-2'>University</p>
                    </div>

                    <div className="absolute top-128 right-16 flex flex-col bg-gray-200 px-6 py-12 rounded-4xl hover:bg-gray-300 transition-all duration-200 cursor-pointer justify-center transition-all duration-500 ease-in-out transform hover:scale-105 z-10">
                        <div className="stars flex text-orange-400 text-3xl">
                            <MdOutlineStarPurple500 className='cursor-pointer hover:text-orange-600' />
                            <MdOutlineStarPurple500 className='cursor-pointer hover:text-orange-600' />
                            <MdOutlineStarPurple500 className='cursor-pointer hover:text-orange-600' />
                            <MdOutlineStarPurple500 className='cursor-pointer hover:text-orange-600' />
                            <MdOutlineStarPurple500 className='cursor-pointer hover:text-orange-600' />
                        </div>
                        <h2 className='text-4xl'>15 Years</h2>
                        <p className='font-light text-right mr-2'>Experience</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MidContent