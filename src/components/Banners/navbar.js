import React, { useEffect, useState } from "react";
import Link from "next/link";
import logo from "../../assets/logo.png"

const NavBar = () => {

    const [isOpen, setOpen]  = useState(false);
    const handleOpen = () => {
        setOpen(!isOpen);
    }

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
      <div>
        <nav className={"bg-white fixed w-full top-auto " + (isScroll !== 0 ? 'shadow-lg' : '')}>
          <div className="items-center sm:flex sm:justify-start sm:mx-8 sm:px-0 my-4 mx-4 px-4 py-1">
            <div className="flex justify-between">
                <div>
                    <a href="/index">
                    <img className="h-6" src={logo}></img>
                    </a>
                </div>

              <div className="sm:hidden">
                <button onClick={handleOpen} className="block text-black hover:text-gray-600 duration-300 focus:outline-none">
                    <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                        <path className={(isOpen ? 'block' : 'hidden')} fillRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"/>
                        <path className={(isOpen ? 'hidden' : 'block')} fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
                    </svg>
                </button>
              </div>
            </div>

            <div className={"sm:flex text-black " + (isOpen ? 'block pt-4' : 'hidden')}>
                <a className="text-sm block sm:font-normal font-semibold hover:text-gray-600 duration-300 sm:ml-4" href="#">Host</a>
                <a className="text-sm block sm:font-normal font-semibold hover:text-gray-600 duration-300 sm:ml-4" href="/about">About</a>
                <a className="text-sm block sm:font-normal font-semibold hover:text-gray-600 duration-300 sm:ml-4" href="/openmindarchive">Open Mind Archive</a>
                <a className="text-sm block sm:font-normal font-semibold hover:text-gray-600 duration-300 sm:ml-4" href="/about">Ambassador Program</a>
            </div>
          </div>
        </nav>
        <div className="h-20"></div>
      </div>
    )
};

export default NavBar;
