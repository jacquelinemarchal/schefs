import HighlightOff from '@material-ui/icons/HighlightOff';
import SignUpForm from "../Auth/signupform";
import CardContent from "./usercardcontent"
import LoginForm from '../Auth/loginform';

const Card = (props) => {

    return (
        <>
        <div className="fixed inset-0 transition-opacity z-10">
            <div onClick={props.function} className="absolute inset-0 bg-gray-700 opacity-75"></div>
        </div>

        <div className="fixed m-2 rounded-xl top-0 sm:mt-10 lg:w-4/12 h-auto bg-white justify-center sm:right-0 z-20" style={{height: "84vh"}}>
            <div className="flex justify-end">
                <button onClick={props.function} className="focus:outline-none p-2">
                    <HighlightOff/>
                </button>
            </div>
            <div className="hidden">
                <SignUpForm />
                <LoginForm />
            </div>
            <CardContent function={props.function}/>
        </div>
        </>
    )
    }
export default Card;