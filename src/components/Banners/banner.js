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
            <div className="z-40 h-10 md:flex justify-center md:justify-between md:fixed md:w-full items-center md:bg-black">
                <p className="hidden md:block text-white pl-2 ml-6 md:ml-12 xl:ml-24">{props.left}</p>
                <div className="hidden md:block pr-2 mr-6 md:mr-12 xl:mr-24">
                    <BlackPillButton {...hostButtonProps} />
                </div>
            </div>    
            <div className="md:h-8"></div>
            </div>
        )
    };

export default Banner;
