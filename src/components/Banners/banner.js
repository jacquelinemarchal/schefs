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
                <p className="text-white pl-2 ml-6 md:ml-12 xl:ml-24 hidden lg:block">{props.left}</p>
                <p className="text-white pl-2 ml-6 md:ml-12 xl:ml-24 lg:hidden md:block">{props.left_small}</p>
                <div className="hidden md:block pr-2">
                    <BlackPillButton {...hostButtonProps} />
                </div>
            </div>    
            <div className="md:h-8"></div>
            </div>
        )
    };

export default Banner;
