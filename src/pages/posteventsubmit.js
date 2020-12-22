import sampleImage2 from "../../dev/images/e2.jpg"
import WhitePillButton from "../components/Buttons/wpillbutton"

export default function PostEventSubmit() {
  return (
    <>
        <div className="px-8 mt-8 sm:grid sm:grid-cols-2 gap-6">
            <div className="sm:grid sm:col-span-1 w-4/5">
                <h2 className="text-4xl mr-6">Thank you for submitting your event!</h2>
                <p className=" mt-6">
                Check your email for a confirmation.<br></br><br></br>
Our team will review your event within 24 hours before publishing it to the site if approved.<br></br><br></br>

Your event will display as ‘pending’ in your upcoming events section on your card and in “my events”<br></br><br></br>

In the meanwhile, why not sign up for other events?
                </p>
            </div>
            <div className="sm:grid sm:col-span-1 ml-6">
                <div>
                    <p className="text-gray-400">Pending approval</p>
                    <img src={sampleImage2} className="bg-yellow-300 mb-10 p-2 rounded-3xl opacity-75 h-64 "></img>
                    <WhitePillButton link="/eventbuilder" text="SUBMIT ANOTHER EVENT" padding="inline px-6 mr-2"/>
                    <WhitePillButton link="www.instagram.com/schefs.us" text="FOLLOW SCHEFS" padding="inline px-6"/>
                </div>
            </div>
        </div>
    </>
  );
};