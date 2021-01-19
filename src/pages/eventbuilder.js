import WhitePillButton from "../components/Buttons/wpillbutton"
import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import axios from "axios"
import HighlightOff from '@material-ui/icons/HighlightOff';
import { htmlToText } from 'html-to-text';
import ContentEditable from 'react-contenteditable'
import placeholder from "../../dev/images/placeholder.png"
import sampleImage1 from "../../dev/images/e1.jpg"
import sampleImage2 from "../../dev/images/e2.jpg"
import sampleImage3 from "../../dev/images/e3.jpg"
import cohost from "../assets/cohost.png"
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import getCroppedImg from 'react-image-crop';
import Cropper from 'react-easy-crop'

import { ErrorMessage, Field, Form, Formik } from "formik";
import Context from '../components/Context/context';
import * as Yup from "yup"
import { now } from "moment";

const EventBuilder = () => {
    const context = useContext(Context);

    const [preLoad, setPreLoad] = useState({
        first_name: "",
        last_name: "",
        grad_year: "",
        university: "",
        major: "",
		bio: "",
    })

    const fileInput = useRef(null)
    const [inCrop, setInCrop] = useState(false)
    const [crop, setCrop] = useState({x:0,y:0},)
    const [zoom, setZoom] = useState(1)

    const [profilePictureURL, setProfilePictureURL] = useState("http://via.placeholder.com/100x100")

    const [isPhotoDisplayOpen, setIsPhotoDisplayOpen] = useState(false)    
    const [isModalOpen, setIsModalOpen] = useState(true)
    const [isCoHostOpen, setIsCoHostOpen] = useState(false)

    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

	const [thumbnails, setThumbnails] = useState([]);

    const escFunction = (event) => {
        if (event.keyCode === 27) {
      	    setIsPhotoDisplayOpen(false);
            setIsModalOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        if (context.profile){
            var user = context.profile;
            setPreLoad({
                first_name: user.first_name,
                last_name: user.last_name,
                grad_year: user.grad_year,
                school: user.school,
                major: user.major,
            })
        }
        else{
            // figure out behavior here
        }

        return () => {
          document.removeEventListener("keydown", escFunction, false);
        };
    }, [context.profile]);

	useEffect(() => {
		axios
			.get('/api/thumbnails')
			.then(res => setThumbnails([...res.data]))
			.catch(err => console.log(err.response.data.err));
	}, []);

    const makeCroppedImage = () => {
        const image = new Image()
        image.src=profilePictureURL;

        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        const ctx = canvas.getContext('2d');
      
        ctx.drawImage(
			image,
			croppedAreaPixels.x * scaleX,
			croppedAreaPixels.y * scaleY,
			croppedAreaPixels.width * scaleX,
			croppedAreaPixels.height * scaleY,
			0,
			0,
			croppedAreaPixels.width,
			croppedAreaPixels.height,
        );

        setProfilePictureURL(canvas.toDataURL('image/jpeg'));
        setInCrop(false);
    }


    const wordCounter = value => {
        var strLength = value.split(" ").length-1;

        if (strLength <= 70){
            return(`${strLength} words`)
        }
    };

    const charCounter = value => {
        if (value.length > 65){
            return(`${value.length} / 65 characters`)
        }
    };

    const fileEventHandler = e => {
        const file = e.target.files[0]
        var reader = new FileReader();

        reader.onload = (e) => {
            setProfilePictureURL(reader.result)
        };

        if (file){
            reader.readAsDataURL(file)
            setInCrop(true)
        }
    }

    const EventBuilderSchema = Yup.object().shape({
        coHostEmail: Yup.string()
            .email('This is not a valid email'),
        requirements: Yup.string(),
        first_name: Yup.string()
            .required('This field is required'),
        last_name: Yup.string()
            .required('This field is required'),
        school: Yup.string()
            .required('This field is required'),
        grad_year: Yup.string()
            .required('This field is required'),
        major: Yup.string()
            .required('This field is required'),
        bio: Yup.string()
            .required('This field is required'),
    });

    const handleSubmit = (values, { setSubmitting }) => {
        setSubmitting(false);
/*
values not yet in the endpoint= [coHostEmail, lastName, gradYear, major, bio]
        *    title         <string> required
        *    description   <string> required
        *    requirements  <string>
        *    img_thumbnail <string> required
        *    time_start    <Date>   required
        *    hosts         <array[object]> required
        *      uid         <int>    required
        *      first_name  <string> required
        *      school      <string> required
        */

		/*
        const sendHosts = [{
            uid: 4,
            first_name: values.firstName,
            school: values.university, 
        }];

		const sendEvent = new FormData();
		for (const [key, value] in Object.entries(values))
			sendEvent.append(key, value);

		sendEvent.append('time_start', new Date()); // TODO: integrate actual start time
		sendEvent.append('hosts', JSON.stringify(sendHosts)); // arrays must be stringified

		fetch(profilePictureURL)
			.then(res => res.blob())
			.then(blob => {
				sendEvent.append('img_profile'
			});
			axios.post("/api/events", sendEvent)
			.then((res)=> {
			console.log(JSON.stringify(sendEvent));
				alert("success", res)
			})
			.catch((err) => alert(err.response.data.err))
		}
		*/


		const userData = new FormData();
		userData.append('first_name', values.first_name);
		userData.append('last_name', values.last_name);
		userData.append('bio', values.bio);
		userData.append('school', values.school);
		userData.append('major', values.major);
		userData.append('grad_year', values.grad_year);

		fetch(profilePictureURL)
			.then(res => res.blob())
			.then(blob => {
				userData.append('img_profile', blob);

				axios
					.put('/api/users/' + context.profile.uid, userData, {
						headers: { 'Content-Type': 'multipart/form-data' }
					})
					.then(res => console.log(res))
					.catch(err => console.log(err.response.data.err));
			})
			.catch(err => console.log(err));
	}

    return (
        context.profile ?
        <Formik
            initialValues = {{
				coHostEmail: "",
				title: "",
				description: "",
				requirements: "",
				first_name: preLoad.first_name,
				last_name: preLoad.last_name,
				school: preLoad.university,
				grad_year: preLoad.grad_year,
				major: preLoad.major,
				bio: preLoad.bio
			}}
            onSubmit={handleSubmit}
            validationSchema={EventBuilderSchema}
        >
            {({isValid, dirty, isSubmitting, setFieldTouched, handleChange}) => (
            <Form>
                {isModalOpen ? 
                    <>
                        <div className="h-screen fixed w-screen" onClick={() => setIsModalOpen(!isModalOpen)}></div>
                        <div className="fixed overflow-scroll m-16 top-0 mt-20 rounded-xl bg-white justify-center z-10 shadow">
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setIsModalOpen(!isModalOpen)} className="focus:outline-none p-2">
                                    <HighlightOff/>
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid col-span-1 px-16 pt-2 pb-12">
                                    <h2 className="text-5xl">Welcome to the<br></br> Event Builder*</h2>
                                    <p className="text-sm mt-4">Your information is pre-loaded from your profile card.<br></br><br></br>You only have to create a bio once; next time you host a Schefs event, your bio will be pre-loaded as well. <br></br><br></br>When you are done, click submit, choose a date, and we will get back to you with a confirmation within 24 hours! <br></br><br></br>All events happen on Fridays, Saturdays, or Sundays.<br></br><br></br>You can schedule your event on any of these days within the next three weeks. </p>
                                    <p className="text-sm mt-4"><b>*</b> Click “HELP” to return to this screen at any point</p>
                                </div>
                                <div className="grid col-span-1">
                                    <div className="grid col-span-1 mx-6 px-10 my-4 pb-10 overflow-y-auto" style={{maxHeight: "30rem"}}>
                                        <p className="text-sm mt-4">Your information is pre-loaded from your profile card.<br></br><br></br>You only have to create a bio once; next time you host a Schefs event, your bio will be pre-loaded as well. <br></br><br></br>When you are done, click submit, choose a date, and we will get back to you with a confirmation within 24 hours! <br></br><br></br>All events happen on Fridays, Saturdays, or Sundays.<br></br><br></br>You can schedule your event on any of these days within the next three weeks. </p>
                                        <p className="text-sm mt-4">*Click “HELP” to return to this screen at any point</p>
                                        <p className="text-sm mt-4">Your information is pre-loaded from your profile card.<br></br><br></br>You only have to create a bio once; next time you host a Schefs event, your bio will be pre-loaded as well. <br></br><br></br>When you are done, click submit, choose a date, and we will get back to you with a confirmation within 24 hours! <br></br><br></br>All events happen on Fridays, Saturdays, or Sundays.<br></br><br></br>You can schedule your event on any of these days within the next three weeks. </p>
                                        <p className="text-sm mt-4">*Click “HELP” to return to this screen at any point</p>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </>
                    : null}

                {isPhotoDisplayOpen ? 
                    <>
                        <div className="h-screen fixed w-screen" onClick={() => setIsPhotoDisplayOpen(!isPhotoDisplayOpen)}></div>
                        <div className="fixed overflow-scroll m-8 sm:border-2 top-0 mt-10 shadow rounded-xl bg-white justify-center z-10">
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setIsPhotoDisplayOpen(!isPhotoDisplayOpen)} className="focus:outline-none p-2">
                                    <HighlightOff/>
                                </button>
                            </div>
                            <div className="m-2 pb-6 flex justify-between">
                                <p>Don't see a photo you like? Pick one of these images as a placeholder for now and<br></br> email schefs.us@gmail with the name of your event &amp; your new image of choice.</p>
                                <p>No two events use the same image.<br></br>Once you choose an image, it’s yours!</p>
                            </div>
                            <div id="imageContainerEB" className="mx-2 gap-2 grid-cols-2 md:gap-4 grid md:grid-cols-4 overflow-y-scroll">
								{thumbnails.length
								  ? thumbnails.map(thumbnail =>
									  <img src={thumbnail.location} key={thumbnail.tid} className="hover:bg-yellow-300 p-2 cursor-pointer rounded-3xl"></img>
								    )
								  : null
								}
                            </div>
                        </div> 
                    </>
                    : null}

                {isCoHostOpen ? 
                    <>
                    <div className="fixed m-2 border sm:border-2 border-black rounded-xl md:mt-10 top-0 bg-white justify-center left-0 z-20" style={{maxWidth: "435px", minHeight: "600px"}}>
                        <div className="flex justify-end">
                            <button type="button" onClick={() => setIsCoHostOpen(false)} className="focus:outline-none p-2">
                                <HighlightOff/>
                            </button>
                        </div>
                        <div className="flex flex-col px-6">
                            <p className="mb-4 leading-snug text-2xl w-56 ">How does co-hosting an event work?</p>
                            <p className="text-sm">You’re welcome to co-host an event with any other undergraduate student. Add your co-host’s email, fill out your card to contain both your information (as pictured below), and upload a joint profile picture.</p>
                            <img draggable="false" className="w-5/6 mx-auto pr-2 my-2" src={cohost}></img>
                            <p className="text-sm">Once added, your co-host will receive all communications about this event following a confirmation email</p>
                            <Field 
                                placeholder="Co-host's school email" 
                                className={"border sm:border-2 border-black my-4 px-2 py-1 focus:outline-none rounded-3xl"} 
                                name="coHostEmail" 
                            />
                        </div>
                    </div>
                    </>
                    : null}

                <div className="mb-4 sm:gap-4 sm:grid sm:grid-cols-5 mx-1 pl-6" onClick={() => {if (isCoHostOpen)setIsCoHostOpen(false);}}>
                    <div className="grid col-span-3">
                        <Field 
                            name="title" 
                            validate={charCounter}
                            className="text-left text-5xl leading-snug mb-1 focus:outline-none"
                            placeholder="My event title..."
                            onChange={e => {
                                setFieldTouched('title');
                                handleChange(e);
                            }}
                        />
                        <ErrorMessage render={msg => <p className="text-red-500 text-sm pb-2">{msg}</p>} name="title"></ErrorMessage>
                        <div>
                            You’ll be able to select your event’s date on the next page
                        </div>
                        <div className="mr-6 mt-2 mb-10 w-9/12">
                            <img onClick={() => {setIsPhotoDisplayOpen(!isPhotoDisplayOpen)}} src={placeholder} className="cursor-pointer rounded-3xl"></img>
                        </div>
                        <div className="items-center flex space-x-2">
                            <p>Your event description:</p>
                            <p className="text-sm pr-2 text-gray-600">70 word minimum</p>
                            <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="description"></ErrorMessage>
                        </div>
                        <Field 
                            as="textarea"
                            placeholder="My event description..." 
                            className={"text-left mt-4 h-32 leading-snug mb-8 w-5/6 focus:outline-none"} 
                            name="description" 
                            validate={wordCounter}
                            onChange={e => {
                                setFieldTouched('description');
                                handleChange(e)
                            }}
                        />
                        <div className="items-center flex space-x-2">
                            <p>Your event requirements (what guests should prepare):</p>
                            <p className=" pr-2 text-sm text-gray-600">Optional</p>
                        </div>
                        <Field 
                            as="textarea"   
                            placeholder="My event requirements..." 
                            className={"text-left mt-4 h-32 leading-snug mb-8 w-5/6 focus:outline-none"} 
                            name="requirements" 
                        />
                    </div>

                    <div className="grid col-span-2 ">
                        <div className="sm:fixed">
                            <div className="flex space-x-2 h-8 items-center">
                                <button disabled={!isValid || !dirty || isSubmitting} type="submit" className={"flex px-6 mt-4 mb-4 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full " + (!isValid || !dirty ?  "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white ") }>SUBMIT</button>
                                <div onClick={() => {setIsModalOpen(true)}}> 
                                    <WhitePillButton type="button" text="HELP" padding="px-6 flex"/>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm my-2 mt-20" style={{ maxWidth: "300px"}}>
                                <p>Hosted by:</p>
                                <p className="cursor-pointer hover:underline hover:text-blue-900" onClick={() => setIsCoHostOpen(!isCoHostOpen)}>Add a co-host</p>
                            </div>
                            <div className="sm:mr-8 shadow-md sm:shadow-none mr-4 border-solid border-black border sm:border-2 rounded-2xl" style={{ maxWidth: "300px"}}>
                                <div className="p-4 grid-rows-3">
                                    {inCrop  // add to second outer div for consistent w/h style={{minWidth: "500px", minHeight: "320px"}}
                                    ? 
                                    <div className="row-span-1 grid rounded-3xl">
                                        <div className="relative h-48 w-auto rounded-3xl overflow-hidden cursor-pointer">
                                            <Cropper
                                                image={profilePictureURL}
                                                crop={crop}
                                                zoom={zoom}
                                                aspect={1}
                                                cropShape="round"
                                                showGrid={false}
                                                onCropChange={(crop) => {setCrop(crop)}}
                                                onCropComplete={(croppedArea, croppedAreaPixels) => {setCroppedAreaPixels(croppedAreaPixels)}}
                                                onZoomChange={(zoom) => {setCrop(zoom)}}
                                            />
                                        </div>
                                        <div className="row-span-1 grid">
                                            <Typography id="continuous-slider" gutterBottom />
                                            <Slider 
                                                onChange={(e, zoom) => setZoom(zoom)} 
                                                min={1} 
                                                max={3}
                                                style={{color: "black", height: "2rem"}}
                                                step={0.1}
                                                value={zoom} 
                                                aria-labelledby="continuous-slider"
                                                />
                                        </div> 
                                        <div className="text-center">
                                            <button onClick={() => {setInCrop(false); setProfilePictureURL("http://via.placeholder.com/400x400")}} className="justify-center items-center bg-transparent focus:outline-none px-6 text-black hover:bg-black hover:text-white border sm:border-2 border-black mr-2 rounded-full">&lt; BACK</button>
                                            <button onClick={makeCroppedImage} className="justify-center items-center bg-transparent focus:outline-none px-6 text-black hover:bg-black hover:text-white border sm:border-2 border-black rounded-full">CONFIRM &gt;</button>
                                        </div> 
                                    </div>
                                    :
                                    <>
                                        <div className="row-span-1">
                                            <div className="grid grid-cols-3">
                                                <div className="col-span-1 h-24 w-24 ">
                                                    <input className="hidden" ref={fileInput} type="file" onChange={fileEventHandler} accept={"image/*"} multiple={false} />
                                                    <div onClick={() => {fileInput.current.click()}}>
                                                        <img src={profilePictureURL} className="rounded-full p-2 items-center cursor-pointer justify-center"></img>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 my-auto">
                                                    <Field 
                                                        placeholder="First Name" 
                                                        className={"ml-4 h-10 text-left text-3xl resize-none focus:outline-none w-5/6 overflow-visible"}
                                                        as="textarea"
                                                        name="first_name" 
                                                    />
                                                    <Field 
                                                        placeholder="Last Name" 
                                                        className={"ml-4 h-10 text-left text-3xl resize-none focus:outline-none w-5/6 overflow-hidden"} 
                                                        name="last_name" 
                                                        as="textarea"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-8 row-span-1 text-center">
                                            <div className="flex ">
                                                <Field 
                                                    placeholder="My university..." 
                                                    className={"leading-snug focus:outline-none overflow-hidden text-center"} 
                                                    name="school" 
                                                />
                                                <p className="mx-3">•</p>
                                                <Field 
                                                    placeholder="My grad year..." 
                                                    className={"leading-snug focus:outline-none overflow-hidden text-center"} 
                                                    name="grad_year" 
                                                />
                                            </div>
                                            <Field 
                                                placeholder="My major..." 
                                                className={"leading-snug focus:outline-none overflow-hidden text-center"} 
                                                name="major" 
                                            />
                                        </div>
                                        <div className="flex">
                                                <Field 
                                                    placeholder="My bio..."
                                                    className="leading-snug h-32 focus:outline-none w-full"
                                                    name="bio" 
                                                    as="textarea"
                                                />
                                        </div> 
                                    </>}
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
            </Form>)}
        </Formik>
        : <div className="text-center items-center flex flex-col">
                You must have a Schefs account to make events
                <WhitePillButton handleClick={() => context.handleToggleCard(false, true)} text="SIGN UP" padding="flex px-16 mt-4" />
            </div>
    );
};

export default EventBuilder;
