import { useFormik } from "formik";
import WhitePillButton from "../Buttons/wpillbutton";

const LoginForm = () => {
    const formik = useFormik({
        initialValues: { email: "" },
        onSubmit: values => {
          alert(JSON.stringify(values, null, 2));
        }
      });
      return (
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-rows-3">
                        <div className="grid row-span-1">
                            <label htmlFor="email"></label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="border-black border-2 rounded-full focus:outline-none my-2 px-4 py-1"
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
                                className="border-black border-2 rounded-full focus:outline-none my-2 px-4 py-1"
                                onChange={formik.handleChange}
                                value={formik.values.password}
                                placeholder="Password"
                            />
                        </div>
                        <div className="justify-self-center">
                            <WhitePillButton type="submit" text="LOG IN" padding="px-24 mt-4 py-0"/>
                        </div>                            
                        <p className="underline justify-self-center">Forgot Your Password?</p>
                </div>
            </form>
      );
}
export default LoginForm;
