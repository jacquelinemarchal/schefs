import React, { useContext } from 'react'
import HighlightOff from '@material-ui/icons/HighlightOff';
import CardContent from './usercardcontent'
import SignUpForm from '../Auth/signupform';
import LoginForm from '../Auth/loginform';
import Context from '../Context/context';

const Card = () => {
    const context = useContext(Context);
    return ( 
        <div className="fixed m-2 border sm:border-2 border-black rounded-xl md:mt-10 top-0 bg-white justify-center right-0 z-20" style={{maxWidth: "435px", minHeight: "600px"}}>
            <div className="flex justify-end">
                <button onClick={context.handleCloseCard} className="focus:outline-none p-2">
                    <HighlightOff/>
                </button>
            </div>
            <div className="hidden">
                <CardContent/>
                <LoginForm />
            </div>
           <CardContent />
        </div>
    )
}
export default Card;
