import React from 'react';
import Link from 'next/link';

const WhitePillButton = ({ type, size, text, link, padding, handleClick }) => {
    if (!link)
        return (
            <button onClick={handleClick} type={type} className={"justify-center items-center text-left bg-transparent focus:outline-none text-" + size + " text-black hover:bg-black hover:text-white border-2 border-black " + padding + " rounded-full"}>{text}</button>  
        );

    return (
        <Link href={link}>
          <button onClick={handleClick} type={type} className={"justify-center items-center text-left bg-transparent focus:outline-none text-" + size + " text-black hover:bg-black hover:text-white border-2 border-black " + padding + " rounded-full"}>{text}</button>  
        </Link>
    );
};

export default WhitePillButton;
