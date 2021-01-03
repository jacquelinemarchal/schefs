import { ErrorMessage, Field, Form, Formik } from "formik";
import WhitePillButton from "../Buttons/wpillbutton"
import {useState, useContext} from "react"
import Context from '../Context/context';
import * as Yup from "yup"


const SignUpForm = () => {

    const [error, setError] = useState("This email is already in use");
    
    const context = useContext(Context);
     
    const handleSubmit = (values, { setSubmitting }) => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
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
        <div className="md-shadow mx-10 py-6 mb-2 rounded-2xl">
            <Formik
                initialValues = {{signUpEmail: "", lastName: "", firstName: "", signUpPassword: "", major: "", university: "", gradYear: ""}}
                onSubmit={handleSubmit}
                //validator={() => ({})}
                validationSchema={SigninSchema}
            >
                {({isValid, dirty, isSubmitting}) => (
                <Form>
                    <div className="grid">
                        <div className="flex flex-col">
                            <p className="text-center text-red-500 text-sm">{error}</p>
                            <Field placeholder="First Name" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 border-black"} name="firstName"></Field>
                            <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="firstName"></ErrorMessage>

                            <Field placeholder="Last Name" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 border-black"} name="lastName"></Field>
                            <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="lastName"></ErrorMessage>

                            <Field placeholder="School Email" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 border-black"} name="signUpEmail"></Field>
                            <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="signUpEmail"></ErrorMessage>
                            <p id="emailHelp" className="text-sm text-center">A valid university email address is required.</p>

                            <Field placeholder="University" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 border-black"} name="university"></Field>
                            <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="university"></ErrorMessage>
                            
                            <Field as="select" name="gradYear" className={" my-2 px-3 py-1 bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full"}>
                                <option value="" disabled>Select your grad year</option>
                                <option value="Class of 2021" label="Class of 2021" />
                                <option value="Class of 2022" label="Class of 2022" />
                                <option value="Class of 2023" label="Class of 2023" />
                                <option value="Class of 2024" label="Class of 2024" />
                                <option value="Gap Year" label="Gap Year" />
                            </Field>

                            <Field placeholder="Major" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 border-black"} name="major"></Field>
                            <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="major"></ErrorMessage>

                            <Field type="password" placeholder="Password" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 border-black"} name="signUpPassword"></Field>
                            <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="signUpPassword"></ErrorMessage>

                            <div onMouseEnter={() => {console.log(isValid, dirty)}}  className="mx-auto">
                                <button disabled={!isValid || !dirty || isSubmitting} type="submit" className={"flex px-16 mt-4 mb-2 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full " + (!isValid || !dirty ?  "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white ") }>CREATE ACCOUNT</button>
                            </div>
                        </div>
                    </div>
                    <footer className="my-2 mt-6 justify-between flex">
                            <p>Already have an account?</p>
                            <WhitePillButton text="LOG IN" link="" padding="flex mx-2 px-6"/>
                    </footer>

                </Form>
                )}
            </Formik>
        </div>
      );
}
export default SignUpForm;