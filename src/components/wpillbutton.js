import React from "react";

const WhitePillButton = (props) => {
  return (
    <button type={props.type} className={"flex justify-center items-center bg-transparent focus:outline-none text-" + props.size + " text-black hover:bg-black hover:text-white border border-black px-2 rounded-full"}>{props.text}</button>  
    )
};

export default WhitePillButton;
