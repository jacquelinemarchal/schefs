import AuthCardContent from "./authcardcontent"
import HighlightOff from '@material-ui/icons/HighlightOff';

const Card = (props) => {
    return (
        <>
        <div className="fixed inset-0 transition-opacity">
            <div onClick={props.function} className="absolute inset-0 bg-gray-700 opacity-75"></div>
        </div>

        <div class="fixed m-2 rounded-xl top-0 sm:mt-10 lg:w-1/3 md:w-5/12 h-auto bg-white justify-center sm:right-0 z-10">
            <div className="flex justify-end">
                <button onClick={props.function} className="focus:outline-none p-2">
                    <HighlightOff/>
                </button>
            </div>
            <AuthCardContent/>
        </div>
        </>
    )
    }
export default Card;