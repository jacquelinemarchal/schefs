import React from "react";
// takes props: type, size, text, link

const BlackPillButton = (props) => {
    if (props.link){
        const linkTo = (e) => {
            e.preventDefault()
            window.location.href= props.link
        }
        return (
            <button onClick={linkTo} type={props.type} className={"flex justify-center items-center bg-transparent focus:outline-none text-" + props.size + " text-white hover:bg-white hover:text-black border border-white px-2 rounded-full"}>{props.text}</button>)
    }
    return (
        <button type={props.type} className={"flex justify-center items-center bg-transparent focus:outline-none text-" + props.size + " text-white hover:bg-white hover:text-black border border-white px-2 rounded-full"}>{props.text}</button>  
    )
};
export default BlackPillButton;
