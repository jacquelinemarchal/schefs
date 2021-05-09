import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState, useContext } from "react";
import Context from '../Context/context';
import WhitePillButton from "../Buttons/wpillbutton";
import sampleCard from "../../assets/sampleCard.png"
import * as Yup from "yup"
import google from '../../assets/googleIcon.png'

const LoginForm = (props) => {
    // const [error, setError] = useState(["emailError", "It seems like this email isn’t signed up for a Schefs account. Would you like to sign up?", "border-red-500", "border-black"]);
    const [error, setError] = useState([null, null, "border-black", "border-black"]);

        // error[] format: typeError, errorMsg, emailBorderFormat, pwordBorderFormat
        // default = [null, null, "border-black", "border-black"]
        
    const context = useContext(Context);

    const handleSubmit = (values) => {
        context.handleLoginWithEmailAndPassword(values.email, values.password)
        .catch((e)=>{
            switch (e.code){
                case "auth/user-not-found":
                    setError(["emailError", "It seems like this email isn’t signed up for a Schefs account. Would you like to sign up?", "border-red-500", "border-black"]);
                    break;
                case "auth/wrong-password":
                    setError(["passwordError", "Sorry, seems like your password is incorrect. Please double-check your password & try again.", "border-black", "border-red-500"]);
                    break;
            }
        })
        if (context.profile && !context.profile.isVerified){
            props.showVerify();
        }
        if (context.profile && context.profile.isVerified){
            props.showAccount();
        }
    }
     
    const SigninSchema = Yup.object().shape({
        email: Yup.string()
            .required('This field is required'),
        password: Yup.string()
            .required("You must provide your password")
    });
    
    return (
    <div className="grid md-shadow px-8 py-2 rounded-2xl">
        <div className="grid grid-cols-2 mb-2">
            <div className="grid col-span-1">
                <div className="flex flex-col">
                    <p>Sign in / Sign up</p> 
                    <p className="my-4">To attend or host events, please create a Schefs account.</p>
                    <p>You wil need a valid university email to use Schefs.</p>
                </div>
            </div>
            <div className="grid col-span-1">
                <div className="flex flex-col">
                    <img className="justify-self-center self-center h-48" src={sampleCard}></img>
                </div>
            </div>
        </div>
        <Formik
            initialValues = {{email: "", password: ""}}
            onSubmit={handleSubmit}
            //validator={() => ({})}
            validationSchema={SigninSchema}
        >
            {({isValid, dirty, errors}) => (
            <Form>
                <div className="grid my-4">
                    <p className="text-red-500 text-sm">{error[1]}</p>
                    <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="email"></ErrorMessage>
                    <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="password"></ErrorMessage>
                        <div className="flex flex-col">    
                                <Field placeholder="School Email" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 " + error[2]} name="email"></Field>
                                <Field type="password" placeholder="Password" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 mb-3 py-1 " + error[3]} name="password"></Field>
                            <div className="mx-auto">
                                <button disabled={!isValid || !dirty} type="submit" className={"flex px-16 mt-4 mb-2 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full " + (!isValid || !dirty ? "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white") }>LOG IN</button>
                            </div>
                        </div>
                        <a id="forgotPword" onClick={props.resetFunction} className="underline text-center cursor-pointer justify-self-center">Forgot Your Password?</a>
                </div>
                <footer className={"justify-between flex " + 
                    (Object.keys(errors).length == 2 
                        ? "mt-16" 
                        : Object.keys(errors).length == 1 
                            ? "mt-20 pt-2"
                            : error[1] 
                                ? "mt-16"
                                : "mt-24")}>
                    <p>Don't have an account?</p>
                    <WhitePillButton handleClick={props.function} text="SIGN UP" padding="flex px-6"/>
                </footer>
            </Form>
            )}
        </Formik>
    </div>
    );
}
export default LoginForm;
/*         <button onClick={context.handleLoginWithGoogle} className="w-full flex mt-4 mb-2 py-1 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full cursor-pointer hover:bg-black hover:text-white"><img className="h-5 pr-4" src={google}></img>LOG IN WITH GOOGLE</button>
        <p className="text-sm m-0 p-0 text-center">or</p> */