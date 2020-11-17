import LoginForm from '../Auth/loginform';
import WhitePillButton from "../Buttons/wpillbutton";
import SignUpForm from "../Auth/signupform";
import CardContent from "./usercardcontent"

const AuthCardContent = () => {

    return (
        <>
            <div className="hidden">
                <SignUpForm />
                <LoginForm />
            </div>
            <CardContent />
        </>
    )
}
export default AuthCardContent;
// TASK: Delte this level of component nesting?