import { ErrorMessage, Field, Form, Formik } from "formik";
import WhitePillButton from "../Buttons/wpillbutton"
import {useState, useContext} from "react"
import Context from '../Context/context';
import * as Yup from "yup"
import axios from "axios"
const firebase = require('../../utils/firebase_client');

const SignUpForm = (props) => {

    const [error, setError] = useState();
    
    const context = useContext(Context);
     
    const handleSubmit = (values, { setSubmitting }) => {

        const userInfo = {
            email: values.signUpEmail, 
            password: values.signUpPassword,
            phone: '6466466446',
            first_name: values.firstName,
            last_name: values.lastName,
            img_profile: 'image_profile_url_here',
            bio: 'are we including bio here',
            school: values.university,
            major: values.major,
            grad_year: values.gradYear
        }
        console.log(userInfo)

        axios.post("/api/users/signup", userInfo)
        .then((res)=>{
            console.log("success making account", res)
            context.handleLoginWithEmailAndPassword(values.signUpEmail, values.signUpPassword)
                .then(() =>{
                    console.log("success logging in");
                    // send verification email
                    var user = firebase.auth().currentUser;
                    user.sendEmailVerification().then(() => {
                        props.showVerify(values.signUpEmail);
                    }).catch(function(error) {
                        console.log(error)
                    });
                    
                })
                .catch((err) => {
                    console.log(err)
                })
            setSubmitting(false);
        })
        .catch((err)=>{
            var div = (err.response.data.err).split(':')
            setError(div[1].concat(':', div[2]))
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
// add error message to gradyear select
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
                            
                            <Field type="password" placeholder="Password" className={"border-2 border-solid rounded-full focus:outline-none my-2 px-4 py-1 border-black"} name="signUpPassword"></Field>
                            <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="signUpPassword"></ErrorMessage>

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

                            <div className="mx-auto">
                                <button disabled={!isValid || !dirty || isSubmitting} type="submit" className={"flex px-16 mt-4 mb-2 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full " + (!isValid || !dirty ?  "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white ") }>CREATE ACCOUNT</button>
                            </div>
                        </div>
                    </div>
                    <footer className="my-2 mt-6 justify-between flex">
                            <p>Already have an account?</p>
                            <WhitePillButton handleClick={props.function} text="LOG IN" link="" padding="flex mx-2 px-6"/>
                    </footer>

                </Form>
                )}
            </Formik>
        </div>
      );
}
export default SignUpForm;