import React, { useState, useContext } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Context from '../Context/context';
import WhitePillButton from "../Buttons/wpillbutton";
import sampleCard from "../../assets/sampleCard.png"
import * as Yup from "yup"
const firebase = require('../../utils/firebase_client');

const VerifyEmail = (props) => {
    // const [error, setError] = useState(["emailError", "It seems like this email isn’t signed up for a Schefs account. Would you like to sign up?", "border-red-500", "border-black"]);
    const [error, setError] = useState([null, null, "border-black", "border-black"]);
    const context = useContext(Context);
    const [resendStatus, setResendStatus] = useState("RESEND EMAIL")
    
    const resendEmail = () => { 
        var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(() => {
            setResendStatus("EMAIL SENT!")
        }).catch((error) => {
            console.log(error)
        });
    }
    return (
        <div className="grid md-shadow px-8 py-2 rounded-2xl">
            <p className="mb-4 text-xl">Verify your email</p>
            <p className="mb-6">We've sent a verification email to {context.profile.email}. You must verify your account before using schefs.us</p>
            <WhitePillButton handleClick={resendEmail} padding="mb-4 flex w-full" text={resendStatus}></WhitePillButton>
            <WhitePillButton handleClick={props.function} text="< LOG IN" padding="flex w-full" />
        </div>
    );
}
export default VerifyEmail;
