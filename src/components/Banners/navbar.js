import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png"

// give scrollShadow: true for shadow on scroll
const NavBar = (props) => {
    if (props.scrollShadow) {
        const [isScroll, setScroll] = useState(0);
        let last_known_scroll_position = 0;
    
        useEffect(() => {
            const onScroll = () => {
                last_known_scroll_position = window.scrollY;
                setScroll(last_known_scroll_position);
            };
            window.addEventListener("scroll", onScroll);
    
            return () => window.removeEventListener("scroll", onScroll)
        }, [])

        return (
          <>
            <nav className={"bg-white fixed z-10 top-0 md:top-auto w-full  " + (isScroll !== 0 ? 'shadow-lg' : '')}>
                <div className="relative sm:flex sm:justify-start sm:mx-8 sm:px-0 my-4 mx-4 px-4 py-1">
                    <div className="flex items-center">
                        <a href="/index">
                            <img className="h-6" src={logo}></img>
                        </a>
                        <div className={"sm:flex text-black "}>
                        <a className="text-sm hover:text-gray-600 duration-300 ml-4" href="#">Host</a>
                        <a className="text-sm hover:text-gray-600 duration-300 ml-4" href="/about">About</a>
                        <a className="hidden sm:inline text-sm hover:text-gray-600 duration-300 ml-4" href="/openmindarchive">Open Mind Archive</a>
                        <a className="sm:hidden text-sm hover:text-gray-600 duration-300 ml-4" href="/openmindarchive">OMA</a>
                        <a className="hidden sm:inline text-sm hover:text-gray-600 duration-300 ml-4" href="/about">Ambassador Program</a></div>
                    </div>
                </div>
            </nav>
            <div className="h-10 md:h-20"></div>
          </>
        )
    }

    return (
      <>
        <nav className="bg-white z-10 fixed w-full top-0 md:top-auto">
            <div className="relative z-50 sm:flex sm:justify-start sm:mx-8 sm:px-0 my-4 mx-4 px-4 py-1">
                <div className="flex items-center">
                    <a href="/index">
                        <img className="h-6" src={logo}></img>
                    </a>
                    <div className={"sm:flex text-black "}>
                    <a className="text-base hover:text-gray-600 duration-300 ml-4" href="/eventbuilder">Host</a>
                    <a className="text-base hover:text-gray-600 duration-300 ml-4" href="/about">About</a>
                    <a className="hidden sm:inline text-base hover:text-gray-600 duration-300 ml-4" href="/openmindarchive">Open Mind Archive</a>
                    <a className="sm:hidden text-base hover:text-gray-600 duration-300 ml-4" href="/openmindarchive">OMA</a>
                    <a className="hidden sm:inline text-base hover:text-gray-600 duration-300 ml-4" href="/about">Ambassador Program</a></div>
                </div>
            </div>
        </nav>
        <div className="h-8 md:h-16"></div>
      </>
    )
};

export default NavBar;
