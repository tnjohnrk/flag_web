"use client";

import { FaAngleDoubleUp } from '@react-icons/all-files/fa/FaAngleDoubleUp';
import { useEffect, useState } from 'react';

export default function ScrollButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect( ()=> {
        const toggleVisibility = () => {
            window.scrollY > 100 ? setIsVisible(true) : setIsVisible(false);
        }

    window.addEventListener("scroll",toggleVisibility);

    // clear the listener on component unmount
    return () => {
        window.removeEventListener("scroll", toggleVisibility)
      }
    });

    const scrollToTop = () => {
        isVisible && window.scrollTo({top:0})
    }
    return (
        <button className={`fixed bottom-5 right-5 p-2 transition-opacity duration-200
        ${ isVisible ? "opacity-100" : "opacity-0" }`}
        onClick={scrollToTop}>
            <FaAngleDoubleUp className='w-10 h-10 text-gray-200' />
        </button>
    );
  }