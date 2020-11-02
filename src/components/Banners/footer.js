import React from "react";

const Footer = (props) => {
    return (
        <div className="h-6">
            <footer className="inset-x-0 fixed bottom-0 flex items-center text-xs px-8 justify-center md:justify-between h-6 bg-gray-300">
                <div className="hidden md:block"> {props.left}</div>
                <div className="block">{props.right}</div>
            </footer>
        </div>
  )
};

export default Footer;
