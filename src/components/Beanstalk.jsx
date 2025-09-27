import React, { useRef, useEffect } from "react";
import './Beanstalk.css'
import BeanstalkSection from "./BeanstalkSection";

export default function Beanstalk() {
    const contentRef = useRef(null);

    useEffect(() => {
        if (contentRef.current) {
            setTimeout(() => {
                contentRef.current.scrollTop = contentRef.current.scrollHeight;
            }, 0);
        }
    }, []);

    return (
        <div ref={contentRef} className="beanstalk">
            <BeanstalkSection />
            <BeanstalkSection />
        </div>
    )
}