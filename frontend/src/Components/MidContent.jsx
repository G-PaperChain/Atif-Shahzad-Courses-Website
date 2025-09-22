import React, { useState, useEffect, useMemo, useRef } from 'react'
import Student from '/greenStudent.png'
import UniLogo from '/unilogo.png'
import { MdOutlineStarPurple500 } from "react-icons/md";
import { HiMiniSparkles } from "react-icons/hi2";
import Nantes from '/Nantes.png'
import { motion, useAnimation } from "framer-motion";
import { IoRefresh } from 'react-icons/io5';
import MainImg from '/online-learning.png'

const MidContent = () => {
    const words = ["learning", "coding", "exploring", "innovating"];
    const [wordIndex, setWordIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [typing, setTyping] = useState(true);
    const cards_containerRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

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
        <div className='flex flex-col z-0 h-max items-center'>

            <h1 className="text-5xl max-sm:text-3xl font-bold flex justify-center mt-10 max-sm:mt-5 text-transparent bg-clip-text bg-gradient-to-b from-green-800 to-green-500 p-2 max-sm:p-0 max-sm:flex-col items-center  max:sm:w-max max-[770px]:w-max max-[770px]:place-center-safe max-sm:text-center ">
                <HiMiniSparkles className='text-amber-500 mr-2.5 text-3xl max-sm:text-xl max-sm:mr-0.5 cursor-pointer transition-all duration-150 hover:text-amber-400 max-sm:place-self-start max-sm:-ml-3 ' />
                <p className=''>Your gateway to&nbsp;</p>
                <span
                    className="typing-effect"
                    style={{
                        width: `${longestWordLength}ch`,
                    }}>
                    {displayed}
                    <span className="caret">|</span>
                </span>
            </h1>

            {/* Actual hero */}

            <div className="grid grid-cols-1 lg:grid-cols-3 mt-4 lg:mt-8 h-full z-50 max-sm:gap-5">

                <div className="flex justify-center items-center p-4 flex-col gap-2 max-sm:row-start-3 bg-green-200 max-sm:w-4/5 max-sm:p-2 place-self-center w-3/5 rounded-2xl">
                    <p className="text-green-700 text-xl font-semibold text-center px-3 py-1 rounded-2xl max-sm:w-full max-sm:py-3 max-sm:px-2 md:">
                        "High-quality learning designed to help you achieve your personal and professional goals."
                    </p>
                    <button className=' bg-green-700 border-0 border-gray-900 py-2 px-4 rounded-radius hover:bg-green-800 cursor-pointer text-gray-50 text-lg transition-colors duration-200'
                    >Get Started</button>
                </div>

                <div className="flex justify-center items-center hover:brightness-105">
                    <img src={MainImg} className="select-none w-96 max-sm:w-56 max-sm:row-start-1" />
                </div>

                {/* CARDS ON THE RIGHT */}

                <div className='grid grid-cols-2 gap-2 w-3/4 p-2 max-sm:row-start-2 max-sm:grid-cols-2 max-sm:w-full max-sm:gap-1 max-sm:p-1 min-xl:p-0 justify-center-safe mx-auto' ref={cards_containerRef}>

                    <motion.div drag dragConstraints={cards_containerRef} dragElastic={0.1} dragMomentum={false} whileDrag={{ scale: 1.05 }}>

                        <div className={`h-48 w-full max-sm:w-base flex flex-col bg-green-200 px-6 py-12 rounded-2xl hover:bg-green-300 cursor-grab justify-center transition-all duration-500 ease-in-out transform hover:scale-105 z-10 max-sm:py-6 max-sm:px-3 items-center`}
                            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                            onMouseDown={handleDragStart}
                            onMouseUp={handleDragEnd}
                        >
                            <h2 className='text-3xl max-sm:text-2xl'>Artificial </h2>
                            <h2 className='text-2xl max-sm:text-xl'>Intelligence</h2>
                        </div>

                    </motion.div>

                    <motion.div drag dragConstraints={cards_containerRef} dragElastic={0.1} dragMomentum={false} whileDrag={{ scale: 1.05 }}>

                        <div className=" h-48 flex w-full flex-col bg-green-200 px-6 py-12 rounded-2xl hover:bg-green-300 cursor-grab justify-center transition-all duration-500 ease-in-out transform hover:scale-105 z-10 max-sm:py-6 max-sm:px-3 items-center"
                            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                            onMouseDown={handleDragStart}
                            onMouseUp={handleDragEnd}
                        >
                            <h2 className='text-3xl max-sm:text-2xl'>Engineering </h2>
                            <h2 className='text-2xl  max-sm:text-xl'>Economics</h2>
                        </div>

                    </motion.div>

                    <motion.div drag dragConstraints={cards_containerRef} dragElastic={0.1} dragMomentum={false} whileDrag={{ scale: 1.05 }}>

                        <div className=" h-48 w-full flex flex-col bg-green-200 px-6 py-12 rounded-2xl hover:bg-green-300 cursor-grab justify-center transition-all duration-500 ease-in-out transform hover:scale-105 z-10 max-sm:py-6 max-sm:px-3 items-center"
                            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                            onMouseDown={handleDragStart}
                            onMouseUp={handleDragEnd}
                        >
                            <h2 className='text-3xl max-sm:text-2xl'>Project</h2>
                            <h2 className='text-2xl max-sm:text-xl'>Management</h2>
                        </div>

                    </motion.div>


                    <motion.div drag dragConstraints={cards_containerRef} dragElastic={0.1} dragMomentum={false} whileDrag={{ scale: 1.05 }}>

                        <div className=" h-48 w-full flex flex-col bg-green-200 px-6 py-12 rounded-2xl hover:bg-green-300 cursor-grab justify-center transition-all duration-500 ease-in-out transform hover:scale-105 z-10 max-sm:py-6 max-sm:px-3 items-center"
                            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                            onMouseDown={handleDragStart}
                            onMouseUp={handleDragEnd}
                        >
                            <h2 className='text-3xl max-sm:text-2xl'>Computer</h2>
                            <h2 className='text-2xl  max-sm:text-xl'>Application</h2>
                        </div>

                    </motion.div>

                </div>
            </div>
        </div>
    )
}

export default MidContent