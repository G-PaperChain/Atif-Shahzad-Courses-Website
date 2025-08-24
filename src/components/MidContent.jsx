import React, { useState, useEffect, useMemo } from 'react'
import './MidContent.css'

const MidContent = () => {
    const words = ["learning", "growing", "coding", "exploring", "innovating", "succeeding"];
    const [wordIndex, setWordIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [typing, setTyping] = useState(true);

    // Longest word for stable width
    const longestWordLength = useMemo(
        () => Math.max(...words.map(w => w.length)),
        [words]
    );

    useEffect(() => {
        console.log("render hua bc")
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
        <div>
            <div className='midcontent-container'>
                <div className="midcontent-left">
                    <h1 className="midcontent-title">
                        Welcome to hub of&nbsp;
                        <span
                            className="typing-effect"
                            style={{
                                width: `${longestWordLength}ch`, // fixes shifting
                            }}>
                            {displayed}
                            <span className="caret">|</span>

                        </span>
                    </h1>
                    <p className="midcontent-subtitle">
                        Committed to providing you with the highest quality educational experience, designed to help you achieve your personal and professional goals.
                    </p>
                    <div className="midcontent-btns">
                        <button className="midcontent-btn-primary">Courses</button>
                        <button className="midcontent-btn-outline">About Us</button>
                    </div>
                </div>
                <div className="midcontent-right">
                    <img src="src/assets/kau logo.png" className="midcontent-img" alt="Students" />
                </div>
            </div>
            <img src="src/assets/bg-up.svg" className='bg-up' alt="Background wave" />
        </div>
    )
}

export default MidContent