import React from "react";

const BlackPillButton = (props) => {
  return (
    <button className="flex justify-center items-center bg-transparent focus:outline-none text-xs text-white hover:bg-white hover:text-black border border-white px-2 rounded-full">{props.text}</button>
  )
};

export default BlackPillButton;
