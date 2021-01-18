import React, { useState, useContext } from "react"
import Person from '@material-ui/icons/Person';
import Context from '../Context/context';

const CardButton = () => {
    const context = useContext(Context)

    const [inHover, setHover] = useState("#000000");
    return (
        <>
        <button onClick={() => context.handleToggleCard(false, true)} className="focus:outline-none fixed z-10 flex pb-2 justify-center items-center bg-gray-200 shadow-lg rounded-xl right-0 top-0 w-16 h-20 mt-2 mr-2 sm:w-20 sm:h-24 sm:mt-10 hover:bg-gray-700" onMouseEnter={() => setHover("#FFFFFF")} onMouseLeave={() => setHover("#000000")}>
          <Person style={{fontSize: 30}} htmlColor={inHover}/>
        </button>
        </>
    )
}
export default CardButton
