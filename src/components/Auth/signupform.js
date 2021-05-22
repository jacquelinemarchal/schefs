import React, { useState, useContext } from 'react';
import axios from 'axios';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import Context from '../Context/context';
import WhitePillButton from '../Buttons/wpillbutton';
import CircularProgress from '@material-ui/core/CircularProgress';

const SignUpForm = (props) => {
    const context = useContext(Context);

    const [error, setError] = useState();
     
    const handleSubmit = (values, { setSubmitting }) => {
        context.handleSignupWithEmailAndPassword(
            values.signUpEmail, 
            values.signUpPassword,
            null, // phone number
            values.firstName,
            values.lastName,
            null, // biography
            values.university,
            values.major,
            values.gradYear
        ).then(() => props.showVerify(values.signUpEmail))
        .catch((err) => {
            if (err.response && err.response.data && err.response.data.err) {
                let err_msg = err.response.data.err.slice(err.response.data.err.lastIndexOf(':') + 1);
                if (err_msg.startsWith('The email address is already in use'));
                    err_msg = 'This email address is already in use. If you believe this is an error, email us at schefs.us@gmail.com.';
                setError(err_msg);
            } else
                console.log(err);
            setSubmitting(false);
        })
    }

    const SigninSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('This field is required'),
        lastName: Yup.string()
            .required('This field is required'),
        signUpEmail: Yup.string()
            .required('This field is required') 
            .email('This is not a valid email'),
        signUpPassword: Yup.string()
            .required("You must provide a password")
            .min(8, "Your password must be at least 8 characters"),
        major: Yup.string()
            .required('This field is required'),
        university: Yup.string()
            .required('This field is required'),
        gradYear: Yup.string()
            .required('This field is required'),
    });

    return (
        <div className="flex flex-col justify-between md-shadow px-8 rounded-2xl h-full">
          <Formik
            initialValues = {{
              signUpEmail: "",
              lastName: "",
              firstName: "",
              signUpPassword: "",
              major: "",
              university: "",
              gradYear: ""
            }}
            onSubmit={handleSubmit}
            validationSchema={SigninSchema}
          >
            {({isValid, dirty, isSubmitting}) => (
                <Form>
                  <div className="flex flex-col -mt-1">
                    <p className="text-red-500 text-sm">{error}</p>
                    <Field placeholder="First Name" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 border-black"} name="firstName"></Field>
                    <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="firstName"></ErrorMessage>

                    <Field placeholder="Last Name" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 border-black"} name="lastName"></Field>
                    <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="lastName"></ErrorMessage>

                    <Field placeholder="School Email" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 border-black"} name="signUpEmail"></Field>
                    <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="signUpEmail"></ErrorMessage>
                    <p id="emailHelp" className="text-sm text-center">* A valid university email address is required.</p>
                    
                    <Field type="password" placeholder="Password" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 border-black"} name="signUpPassword"></Field>
                    <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="signUpPassword"></ErrorMessage>

                    <Field placeholder="University" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 border-black"} name="university"></Field>
                    <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="university"></ErrorMessage>
                          
                    <Field as="select" name="gradYear" className={"my-2 px-3 bg-transparent focus:outline-none text-black border-2 sm:border-2 border-black rounded-full"} style={{padding: "0.38rem"}}>
                      <option value="" disabled>Select your grad year</option>
                      <option value="Class of 2021" label="Class of 2021" />
                      <option value="Class of 2022" label="Class of 2022" />
                      <option value="Class of 2023" label="Class of 2023" />
                      <option value="Class of 2024" label="Class of 2024" />
                      <option value="Gap Year" label="Gap Year" />
                    </Field>
                    <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="gradYear"></ErrorMessage>

                    <Field placeholder="Major" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 border-black"} name="major"></Field>
                    <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="major"></ErrorMessage>

                    <button disabled={!isValid || !dirty || isSubmitting} type="submit" className={"flex w-3/4 mx-auto mt-4 mb-6 py-0 justify-center items-center bg-transparent focus:outline-none text-black border-2 border-black rounded-full " + (!isValid || !dirty || isSubmitting ? "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white")}>
                      {isSubmitting
                        ? <><span>&#8203;</span><CircularProgress size="1rem" thickness={5} /></>
                        : 'CREATE AN ACCOUNT'
                      }
                    </button>
                  </div>
                </Form>
            )}
          </Formik>
          <footer className="flex items-center justify-between">
            <p className="w-3/5">Already have an account?</p>
            <WhitePillButton handleClick={props.function} text="LOG IN" padding="flex px-4 sm:px-6" />
          </footer>
        </div>
      );
}
export default SignUpForm;
