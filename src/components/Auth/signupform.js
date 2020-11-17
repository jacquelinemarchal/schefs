import { useFormik } from "formik";
import WhitePillButton from "../Buttons/wpillbutton"
import {useState} from "react"


const SignUpForm = () => {
    const [error, setError] = useState([null, null, "border-black", "border-black", "border-black", "border-black", "border-black", "border-black"]);
    // error[] format: typeError, errorMsg
    // default = [null, null, "border-black", "border-black", "border-black", "border-black", "border-black", "border-black"]

    // TASK:
        // setError(["emailError", "This email is invalid", "border-black", "border-black", "border-red-500", "border-black", "border-black", "border-black"])
    
    const formik = useFormik({
        initialValues: { email: "" },
        onSubmit: values => {
          alert(JSON.stringify(values, null, 2));
        }
      });

      return (
          <div className="md-shadow px-8 py-2 rounded-2xl">
                <p className="text-red-500">{error[1]}</p>
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col">
                        <input
                            id="fName"
                            name="fName"
                            type="fName"
                            className={error[2] + " border-2 rounded-full focus:outline-none my-2 px-4 py-1"}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            placeholder="First name"
                            />
                        <input
                            id="lName"
                            name="lName"
                            type="lName"
                            className={error[3] + " border-2 rounded-full focus:outline-none my-2 px-4 py-1"}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            placeholder="Last name"
                            />
   
                        <input
                            id="signUpEmail"
                            name="signUpEmail"
                            type="signUpEmail"
                            className={error[4] + " border-2 rounded-full focus:outline-none my-2 px-4 py-1"}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            placeholder="School Email*"
                            aria-describedby="emailHelp"
                            />
                            <p id="emailHelp" className="text-center">A valid university email address is required.</p>
                        <input
                            id="uni"
                            name="uni"
                            type="uni"
                            className={error[5] + " border-2 rounded-full focus:outline-none my-2 px-4 py-1"}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            placeholder="University name"
                            />
                        <input
                            id="signUpPassword"
                            name="signUpPassword"
                            type="signUpPassword"
                            className={error[6] + " border-2 rounded-full focus:outline-none my-2 px-4 py-1"}
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            placeholder="Password"
                        />
                    <div className="mx-auto">
                        <WhitePillButton type="submit" text="CREATE ACCOUNT" padding="px-16 mt-4 py-0"/>
                    </div>                            
                    <p className="underline text-center my-2">Forgot Your Password?</p>
                    </div>
                </form>
            </div>
      );
}
export default SignUpForm;
