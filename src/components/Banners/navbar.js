import React, { useEffect, useState } from "react";
import Link from 'next/link';
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
            <nav className={"bg-white fixed z-10 top-0 md:top-auto w-full " + (isScroll !== 0 ? 'shadow-lg' : '')}>
              <div className="relative sm:flex sm:justify-start pl-2 ml-6 md:ml-12 xl:ml-24 mt-6 mb-4 py-1">
                <div className="flex items-center">
                  <Link href="/index">
                    <a className="hover:opacity-50 duration-300">
                      <img src={logo} style={{height: '1.75rem'}}></img>
                    </a>
                  </Link>
                    <Link href="/eventbuilder">
                    <a className="text-base hover:text-gray-600 duration-300 ml-4 md:ml-8">
                      Host
                    </a>
                  </Link>
                  <Link href="/about">
                    <a className="text-base hover:text-gray-600 duration-300 ml-4">
                      About
                    </a>
                  </Link>
                  <Link href="/openmindarchive">
                    <a className="hidden sm:inline text-base hover:text-gray-600 duration-300 ml-4">
                      Open Mind Archive
                    </a>
                  </Link>
                  <Link href="/openmindarchive">
                    <a className="sm:hidden text-base hover:text-gray-600 duration-300 ml-4">
                      OMA
                    </a>
                  </Link>
                  <Link href="/ambassador">
                    <a className="hidden sm:inline text-base hover:text-gray-600 duration-300 ml-4">
                      Ambassador Program
                    </a>
                  </Link>
                </div>
              </div>
            </nav>
            <div className="h-12 md:h-20 md:mb-6"></div>
          </>
        )
    }

    return (
      <>
        <nav className="bg-white z-10 fixed w-full top-0 md:top-auto">
          <div className="relative z-50 sm:flex sm:justify-start pl-2 ml-6 md:ml-12 xl:ml-24 mt-6 mb-4 py-1">
            <div className="flex items-center">
              <Link href="/index">
                <a className="hover:opacity-50 duration-300">
                  <img src={logo} style={{height: '1.75rem'}}></img>
                </a>
              </Link>
              <div className="sm:flex text-black">
                <Link href="/eventbuilder">
                  <a className="text-base hover:text-gray-600 duration-300 ml-4 md:ml-8">
                    Host
                  </a>
                </Link>
                <Link href="/about">
                  <a className="text-base hover:text-gray-600 duration-300 ml-4">
                    About
                  </a>
                </Link>
                <Link href="/openmindarchive">
                  <a className="hidden sm:inline text-base hover:text-gray-600 duration-300 ml-4">
                    Open Mind Archive
                  </a>
                </Link>
                <Link href="/openmindarchive">
                  <a className="sm:hidden text-base hover:text-gray-600 duration-300 ml-4">
                    OMA
                  </a>
                </Link>
                <Link href="/ambassador">
                  <a className="hidden sm:inline text-base hover:text-gray-600 duration-300 ml-4">
                    Ambassador Program
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="h-12 md:h-20 md:mb-6"></div>
      </>
    )
};

export default NavBar;
