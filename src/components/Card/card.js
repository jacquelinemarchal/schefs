import HighlightOff from '@material-ui/icons/HighlightOff';
import SignUpForm from "../Auth/signupform";
import CardContent from "./usercardcontent"
import LoginForm from '../Auth/loginform';
import { StateContext } from "../../pages/_app";
import { useContext } from "react"

const Card = () => {
    const cardContext = useContext(StateContext)
    return ( 
        <div className="fixed m-2 border sm:border-2 border-black rounded-xl md:mt-10 top-0 bg-white justify-center right-0 z-20" style={{maxWidth: "435px", minHeight: "600px"}}>
            <div className="flex justify-end">
                <button onClick={() => cardContext.dispatch("closeCard")} className="focus:outline-none p-2">
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
    /*
     * <div className="fixed m-2 rounded-xl top-0 md:mt-10 bg-white justify-center sm:right-0 z-20" style={{height: "900px"}, {width: "450px"}}>
     */
}
export default Card;
