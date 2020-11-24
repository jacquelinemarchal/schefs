import HighlightOff from '@material-ui/icons/HighlightOff';
import SignUpForm from "../Auth/signupform";
import CardContent from "./usercardcontent"
import LoginForm from '../Auth/loginform';
import { StateContext } from "../../pages/_app";
import { useContext } from "react"

const Card = () => {
    const cardContext = useContext(StateContext)
    return (
        <>
        <div onClick={() => cardContext.dispatch("closeCard")} className="fixed inset-0 transition-opacity z-10">
            <div className="absolute inset-0 bg-gray-700 opacity-75"></div>
        </div>

        <div className="fixed m-2 rounded-xl top-0 md:mt-10 bg-white justify-center sm:right-0 z-20" style={{height: "900px"}, {width: "450px"}}>
            <div className="flex justify-end">
                <button onClick={() => cardContext.dispatch("closeCard")} className="focus:outline-none p-2">
                    <HighlightOff/>
                </button>
            </div>
            <div className="hidden">
                <SignUpForm />
                <LoginForm />
            </div>
            <CardContent/>
        </div>
        </>
    )
    }
export default Card;