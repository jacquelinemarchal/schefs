import React from "react";
// takes props: type, size (text), text, link, padding, handleClick

const WhitePillButton = (props) => {
    const handleClick = props.handleClick
      ? props.handleClick
      : (e) => {
            e.preventDefault();

            if (props.link)
                window.location.href = props.link;
        }

    return (
        <button onClick={handleClick} type={props.type} className={"justify-center items-center bg-transparent focus:outline-none text-" + props.size + " text-black hover:bg-black hover:text-white border sm:border-2 border-black " + props.padding + " rounded-full"}>{props.text}</button>  
    )
};

export default WhitePillButton;
