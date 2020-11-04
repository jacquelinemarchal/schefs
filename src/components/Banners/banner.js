import React from "react";
import BlackPillButton from "../Buttons/bpillbutton"

const Banner = (props) => {
    let hostButtonProps = {
        text: props.buttonText,
        size: "sm",
        link: "/about"
    }
    return (
            <div className="h-8 md:flex justify-center md:justify-between md:px-8 md:sticky items-center md:top-0 md:bg-black">
                <p className="hidden md:block text-white text-xs">{props.left}</p>
                <div className="hidden md:block">
                    <BlackPillButton {...hostButtonProps} />
                </div>
            </div>
        )
    };

export default Banner;