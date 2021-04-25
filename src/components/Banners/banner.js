import React from "react";
import BlackPillButton from "../Buttons/bpillbutton"

const Banner = (props) => {
    const hostButtonProps = {
        text: props.buttonText,
        size: "sm",
        link: "/eventbuilder"
    }

    return (
        <div>
            <div className="z-40 h-8 md:flex justify-center md:justify-between md:px-8 md:fixed md:w-full items-center md:bg-black">
                <p className="hidden md:block text-white text-xs">{props.left}</p>
                <div className="hidden md:block">
                    <BlackPillButton {...hostButtonProps} />
                </div>
            </div>    
            <div className="md:h-8"></div>
            </div>
        )
    };

export default Banner;
