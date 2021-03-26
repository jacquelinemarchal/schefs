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
    const [emailStatus, setEmailStatus] = useState("")
    const context = useContext(Context);

    return (
        <div className="grid md-shadow px-8 py-2 rounded-2xl">
            <p className="text-base">Verify your email</p>
            <p>We've sent an email to {props.email}</p>
            <WhitePillButton handleClick={props.function} text="< LOG IN" padding="flex w-full" />
        </div>
    );
}
export default VerifyEmail;
