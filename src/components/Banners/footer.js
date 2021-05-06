import React from "react";
import PillButton from  "../Buttons/wpillbutton"

const Footer = (props) => {
    let hostButton = {
        size: "sm",
        text: "HOST YOUR OWN EVENT",
        link: "/about",
        padding: "px-4"
    }
    return (
        <div className="h-6">
            <footer className="inset-x-0 fixed bottom-0 flex items-center px-8 justify-center bg-white h-8 md:justify-between md:h-10 md:bg-gray-300">
                <div className="block md:hidden">
                    <PillButton {...hostButton} />
                </div>
                <div className="hidden md:block"> {props.left}</div>
                <div className="hidden md:block">{props.right}
                    <a className="underline" href="/about">{props.linkText}</a>
                </div>
            </footer>
        </div>
  )
};

export default Footer;
