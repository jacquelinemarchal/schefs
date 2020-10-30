import React from "react";
import BlackPillButton from "./bpillbutton"

const Banner = (props) => {
  return (
    <div className="h-8 flex justify-center md:justify-between px-8 sticky items-center top-0 bg-black">
      <p className="hidden md:block text-white text-xs">{props.left}</p>
      <div>
        <BlackPillButton text={props.buttonText} />
      </div>
    </div>
    )
};

export default Banner;