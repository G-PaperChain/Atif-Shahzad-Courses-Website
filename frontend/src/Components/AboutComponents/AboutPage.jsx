import React from 'react'
import axios from 'axios'
import { useAuth } from '../AuthComponents/AuthContext'
import { useResearchContext } from '../../Context/ResearchContext'
import { useContext, useEffect, useState } from 'react'

const AboutPage = () => {
    let { api } = useAuth();
    const { fetchResearches, researches } = useResearchContext();

    useEffect(() => {
        fetchResearches();
    }, []);

    return (
        <div className='RESEARCHES flex flex-col gap-2.4'>
            <h1 className='text-2xl text-green-700'>Researches</h1>
            {
                researches.map(research => (
                    <div className='bg-green-200 text-black text-lg'>{research.title}</div>
                ))
            }
        </div>
    )
}

export default AboutPage
