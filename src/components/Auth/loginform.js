import React, { useState, useContext } from "react";
import { useFormik } from "formik";
import admin from '../../utils/firebase_admin';
import Context from '../Context/context';
import WhitePillButton from "../Buttons/wpillbutton";
import sampleCard from "../../assets/sampleCard.png"


const LoginForm = () => {
    const [error, setError] = useState([null, null, "border-black", "border-black"]);
    // error[] format: typeError, errorMsg, emailBorderFormat, pwordBorderFormat
    // default = [null, null, "border-black", "border-black"]

    // TASK:
        // setError(["emailError", "It seems like this email isn’t signed up for a Schefs account. Would you like to sign up?", "border-red-500", "border-black"])
        // setError(["passwordError", "Sorry, seems like your password is incorrect. Please double-check your password & try again.", "border-black", "border-red-500"])
    
    const context = useContext(Context);
    
    const formik = useFormik({
        initialValues: { email: "" },
        onSubmit: (values) => {
            context.handleLoginWithEmailAndPassword(values.email, values.password)
          alert(JSON.stringify(values, null, 2));
        }
    });

    return (
          <div className="grid grid-rows-2 md-shadow px-8 py-2 rounded-2xl">
              <div className="grid row-span-1 grid-cols-2 mb-2">
                  <div className="grid col-span-1">
                      <p>Sign in / Sign up</p>
                      <p className="mb-4">To attend or host events, please create a Schefs account</p>
                      <p>You wil need a valid university email to use Schefs.</p>
                  </div>
                  <div className="grid col-span-1">
                      <img className="justify-self-center self-center h-40" src={sampleCard}></img>
                  </div>
                  <div className="grid col-span-2">
                      <p className="text-red-500 text-sm">{error[1]}</p>
                  </div>
              </div>
    
              <div className="grid row-span-1">
                  <form onSubmit={formik.handleSubmit}>
                      <div className="grid grid-rows-3">
                          <div className="grid row-span-1">
                              <label htmlFor="email"></label>
                              <input
                                  id="email"
                                  name="email"
                                  type="email"
                                  className={error[2] + " border-2 rounded-full focus:outline-none my-2 px-4 py-1"}
                                  onChange={formik.handleChange}
                                  value={formik.values.email}
                                  placeholder="School Email"
                                  />
                              <label className="outline" htmlFor="password"></label>
                          </div>
                          <div className="grid row-span-1">
                              <input
                                  id="password"
                                  name="password"
                                  type="password"
                                  className={error[3] + " border-2 rounded-full focus:outline-none my-2 px-4 py-1"}
                                  onChange={formik.handleChange}
                                  value={formik.values.password}
                                  placeholder="Password"
                              />
                          </div>
                          <div className="mx-auto">
                              <WhitePillButton type="submit" text="LOG IN" padding="px-16 mt-4 mb-2 py-0"/>
                          </div>
                          <p className="underline justify-self-center">Forgot Your Password?</p>
                      </div>
                </form>
              </div>
              <footer className="my-2 mt-6 justify-between flex">
                <p>Don't have an account?</p>
                <WhitePillButton text="SIGN UP" link="" padding="px-6"/>
              </footer>
        </div>
    );
}
export default LoginForm;
