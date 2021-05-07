import React, { useState, useContext } from "react"
import Person from '@material-ui/icons/Person';
import Context from '../Context/context';

const CardButton = () => {
    const context = useContext(Context)

    const [inHover, setHover] = useState("#000000");
    return (
        <>
        <button id="cardBtn" onClick={() => context.handleToggleCard(false, true)} className="focus:outline-none fixed z-10 flex pb-2 justify-center items-center rounded-xl right-0 top-0 mt-2 mr-2 w-20 h-24 md:w-24 md:h-32 xl:w-32 xl:h-40 sm:mt-12" onMouseEnter={() => setHover("#FFFFFF")} onMouseLeave={() => setHover("#000000")} style={{boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)'}}> 
          <Person style={{fontSize: 30}} htmlColor={inHover}/>
        </button>
        </>
    )
}
export default CardButton
//bg-gray-200 hover:bg-gray-800
