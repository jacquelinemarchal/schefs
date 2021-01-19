import React, { useState, useContext } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Context from '../Context/context';
import WhitePillButton from "../Buttons/wpillbutton";
import sampleCard from "../../assets/sampleCard.png"
import * as Yup from "yup"
const firebase = require('../../utils/firebase_client');

const PasswordReset = (props) => {
    // const [error, setError] = useState(["emailError", "It seems like this email isn’t signed up for a Schefs account. Would you like to sign up?", "border-red-500", "border-black"]);
    const [error, setError] = useState([null, null, "border-black", "border-black"]);
    const [emailStatus, setEmailStatus] = useState("")
    const context = useContext(Context);

    const ResetSchema = Yup.object().shape({
        email: Yup.string()
            .required('This field is required') 
            .email('This is not a valid email'),
    })

    const handleSubmit = (values) => {
        const emailAddress = values.email;
        var auth = firebase.auth();
        auth.sendPasswordResetEmail(emailAddress).then(() => {
            setEmailStatus("Password reset link sent! Check your inbox")
        }).catch(function(error) {
            setEmailStatus(error.message, "Please contact the Schefs team at schefs.us@gmail.com")
        });
    }
    return (
        <div className="grid md-shadow px-8 py-2 rounded-2xl">
            <p className="text-base">Password Reset</p>
            <Formik
                initialValues = {{email: ""}}
                onSubmit={handleSubmit}
                //validator={() => ({})}
                validationSchema={ResetSchema}
            >
                {({isValid, dirty}) => (
                <Form>
                    <div className="flex flex-col">
                        <p className="text-red-500 text-sm">{error[1]}</p>
                        <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="email"></ErrorMessage> 
                        <Field placeholder="Account Email" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 " + error[2]} name="email"></Field>
                        {emailStatus}
                        <button disabled={!isValid || !dirty} type="submit" className={"flex w-full mt-4 mb-2 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full " + (!isValid || !dirty ? "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white") }>SEND RESET LINK</button>
                        <WhitePillButton handleClick={props.function} text="< LOG IN" padding="flex w-full" />
                    </div>
                </Form>
                )}
            </Formik>
        </div>
    );
}
export default PasswordReset;
