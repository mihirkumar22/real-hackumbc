import React, { useRef, useEffect } from 'react'
import CustomNavbar from '../components/CustomNavbar'
import './Learn.css'
import Beanstalk from '../components/Beanstalk'

export default function Learn() {
    return (
        <div className="learn">
            <CustomNavbar />
            <Beanstalk />
        </div>
    )
}