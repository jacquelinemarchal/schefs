import sampleCard from "../../assets/sampleCard.png"
import LoginForm from '../Auth/loginform';
import WhitePillButton from "../Buttons/wpillbutton";

const AuthCardContent = () => {
    return (
        <>
            <div className="grid grid-rows-2 md-shadow px-8 py-2 rounded-2xl">
                <div className="grid row-span-1 grid-cols-2 mb-6">
                    <div className="grid col-span-1">
                        <p>Sign in / Sign up</p>
                        <p className="mb-4">To attend or host events, please create a Schefs account</p>
                        <p>You wil need a valid university email to use Schefs.</p>
                    </div>
                    <div className="grid col-span-1">
                        <img className="justify-self-center mb-6 self-center h-40" src={sampleCard}></img>
                    </div>
                </div>
                <div className="grid row-span-1">
                    <LoginForm/>
                </div>
                <footer className="my-2 justify-between flex">
                    <p>Don't have an account?</p>
                    <WhitePillButton text="SIGN UP" padding="px-6"/>
                </footer>
            </div>
        </>
    )
}
export default AuthCardContent;
