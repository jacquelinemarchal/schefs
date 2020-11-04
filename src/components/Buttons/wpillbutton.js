import React from "react";
// takes props: type, size (text), text, link

const WhitePillButton = (props) => {
    const linkTo = (e) => {
        e.preventDefault()
        window.location.href= props.link
    }
    return (
        <button onClick={linkTo} type={props.type} className={"flex justify-center items-center bg-transparent focus:outline-none text-" + props.size + " text-black hover:bg-black hover:text-white border border-black px-2 rounded-full"}>{props.text}</button>  
    )
};

export default WhitePillButton;
