import { ErrorMessage, Field, Form, Formik } from "formik";
import WhitePillButton from "../Buttons/wpillbutton";
import {useState} from "react"
import sampleCard from "../../assets/sampleCard.png"
import * as Yup from "yup"


const LoginForm = () => {
    // const [error, setError] = useState(["emailError", "It seems like this email isn’t signed up for a Schefs account. Would you like to sign up?", "border-red-500", "border-black"]);
    const [error, setError] = useState([null, null, "border-black", "border-black"]);
        // error[] format: typeError, errorMsg, emailBorderFormat, pwordBorderFormat
        // default = [null, null, "border-black", "border-black"]

    // TASK:
        //setError(["emailError", "It seems like this email isn’t signed up for a Schefs account. Would you like to sign up?", "border-red-500", "border-black"])
        // setError(["passwordError", "Sorry, seems like your password is incorrect. Please double-check your password & try again.", "border-black", "border-red-500"])
        // on close reset error
    const handleSubmit = (values) => {
        console.log(values.email, values.password)
    }
     
    const SigninSchema = Yup.object().shape({
        email: Yup.string()
            .required('This field is required') 
            .email('This is not a valid email'),
        password: Yup.string()
            .required("You must provide your password")
            .min(8, "Your password must be at least 8 characters")
    });
    
    return (
    <div className="grid md-shadow px-8 py-2 rounded-2xl">
        <Formik
            initialValues = {{email: "", password: ""}}
            onSubmit={handleSubmit}
            //validator={() => ({})}
            validationSchema={SigninSchema}
        >
            {({isValid}, dirty) => (
            <Form>
                <div className="grid grid-cols-2 mb-2">
                    <div className="grid col-span-1">
                        <div className="flex flex-col">
                            <p>Sign in / Sign up</p>
                            <p className="my-4">To attend or host events, please create a Schefs account</p>
                            <p>You wil need a valid university email to use Schefs.</p>
                        </div>
                    </div>
                    <div className="grid col-span-1">
                        <div className="flex flex-col">
                            <img className="justify-self-center self-center h-40" src={sampleCard}></img>
                        </div>
                    </div>
                </div>
                <div className="grid">
                    <p className="text-red-500 text-sm">{error[1]}</p>
                    <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="email"></ErrorMessage>
                    <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="password"></ErrorMessage>
                        <div className="flex flex-col">
                                <label htmlFor="email"></label>
                                <Field placeholder="School Email" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 " + error[2]} name="email"></Field>
     
                                <label className="outline" htmlFor="password"></label>
                                <Field type="password" placeholder="Password" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 " + error[3]} name="password"></Field>
                            <div className="mx-auto">
                                <button disabled={!isValid} type="submit" className={"flex px-16 mt-4 mb-2 py-0 justify-center items-center bg-transparent focus:outline-none text-black hover:text-white border sm:border-2 border-black rounded-full " + (isValid ? "hover:bg-black": "") }>LOG IN</button>
                            </div>
                            <p className="underline text-center justify-self-center">Forgot Your Password?</p>
                        </div>
                </div>
                <footer className="my-2 mt-6 justify-between flex">
                            <p>Don't have an account?</p>
                            <WhitePillButton text="SIGN UP" link="" padding="flex px-6"/>
                </footer>
            </Form>
            )}
        </Formik>
    </div>

    );
}
export default LoginForm;