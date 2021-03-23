import WhitePillButton from "../../components/Buttons/wpillbutton"
import pool from '../../utils/db';
import queries from "../../utils/queries/events"
import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import axios from "axios"
import HighlightOff from '@material-ui/icons/HighlightOff';
import { htmlToText } from 'html-to-text';
import ContentEditable from 'react-contenteditable'
import cohost from "../../assets/cohost.png"
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Cropper from 'react-easy-crop'
import { useRouter } from 'next/router'
import pencil from "../../assets/pencil.png"

import { ErrorMessage, Field, Form, Formik } from "formik";
import Context from '../../components/Context/context';
import * as Yup from "yup"
import { now } from "moment";

const EventBuilder = (props) => {
    const context = useContext(Context);
    const [editMode, setEditMode] = useState(false)

    const defaultProfilePicture = 'https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/chosenImages%2FScreen%20Shot%202021-01-24%20at%2010.57.18%20AM.jpeg?alt=media&token=a88fcb5e-4919-4bc6-b792-23d725324040';
    const defaultThumbnail = {
        tid: -1,
        location: 'images/placeholder.png',
        is_used: true,
    }

    const [preLoad, setPreLoad] = useState({
        coHostEmail: "",
        title: "",
        description: "",
        requirements: "",
        first_name: "",
        last_name: "",
        grad_year: "",
        university: "",
        major: "",
		bio: "",
    });

    const fileInput = useRef(null)
    const [inCrop, setInCrop] = useState(false)
    const [crop, setCrop] = useState({x:0,y:0},)
    const [zoom, setZoom] = useState(1)

    const [profilePictureURL, setProfilePictureURL] = useState(defaultProfilePicture);

    const [isPhotoDisplayOpen, setIsPhotoDisplayOpen] = useState(false)    
    const [isCoHostOpen, setIsCoHostOpen] = useState(false)

    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

	const [thumbnails, setThumbnails] = useState([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState(defaultThumbnail);
    const [isLoading, setIsLoading] = useState(true)

    const escFunction = (event) => {
        if (event.keyCode === 27) {
      	    setIsPhotoDisplayOpen(false);
        }
    };

    const queryThumbnails = () => {
        axios
            .get('/api/thumbnails')
            .then(res => setThumbnails([...res.data]))
            .catch(err => console.log(err.response.data.err));
    }

    useEffect(queryThumbnails, []);
    
    useEffect(() => {
        setTimeout(
            () => {setIsLoading(false); console.log("thinking")},
            1000
        );
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        setPreLoad({
            coHostEmail: "",
            title: `${props.eventInfo.title}`,
            description: `${props.eventInfo.description}`,
            requirements: `${props.eventInfo.requirements}`,
            first_name: `${props.eventInfo.hosts[0].first_name}`,
            last_name: `${props.eventInfo.hosts[0].last_name}`,
            grad_year: `${props.eventInfo.hosts[0].grad_year}`,
            school: `${props.eventInfo.host_school}`,
            major: `${props.eventInfo.hosts[0].major}}`,
        })

        return () => {
          document.removeEventListener("keydown", escFunction, false);
        };
    }, [editMode]);

    const cancelEdit = () => {
        setEditMode(false);
        axios.get(`/api/events/${props.eventInfo.eid}`)
        .then((res) =>{
            const eventInfo = res.data;
            setPreLoad({
                coHostEmail: "",
                title: `${eventInfo.title}`,
                description: `${eventInfo.description}`,
                requirements: `${eventInfo.requirements}`,
                first_name: `${eventInfo.hosts[0].first_name}`,
                last_name: `${eventInfo.hosts[0].last_name}`,
                grad_year: `${eventInfo.hosts[0].grad_year}`,
                school: `${eventInfo.host_school}`,
                major: `${eventInfo.hosts[0].major}}`,
            })
        })
        .catch((e) => {
            console.log(e)
        })
    }
    
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
        } else
			return '';
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

    const handleSubmit = async (values, { setSubmitting }) => {
        //values not yet in the endpoint= [coHostEmail, lastName, gradYear, major]

        setSubmitting(false);
        setEditMode(false);

        const eventData = {
            title: values.title,
            description: values.description,
            requirements: values.requirements,
            thumbnail_id: selectedThumbnail.tid,
            host_bio: values.bio,
            time_start: new Date(), // TODO: do actual start time
            hosts: [{ ...context.profile }],
        }

        try {
            await axios.post('/api/events', eventData); // TODO: change to update
        } catch (err) {
            if (err.response && err.response.status === 409) {
                alert('Thumbnail already in use, choose a different one');
                queryThumbnails();
                setSelectedThumbnail(defaultThumbnail);
            } else
                alert(err.response.data.err)

            return;
        }

		const userData = new FormData();
		userData.append('first_name', values.first_name);
		userData.append('last_name', values.last_name);
		userData.append('bio', values.bio);
		userData.append('school', values.school);
		userData.append('major', values.major);
		userData.append('grad_year', values.grad_year);

        try {
            const res = await fetch(profilePictureURL);
            const blob = await res.blob();
            
            userData.append('img_profile', blob);

            await axios.put('/api/users/' + context.profile.uid, userData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('event successfully submitted');
            window.location.href = '/admin';
		} catch (err) {
            if (err.response && err.response.data)
                alert(err.response.data.err);
            else
                alert(err);
        }
	}

    const Thumbnail = (props) => {
        const handleSelectThumbnail = (e) => {
            e.preventDefault();
            setSelectedThumbnail({...props.thumbnail});
            setIsPhotoDisplayOpen(false);
        }
            
        return (
            <button onClick={handleSelectThumbnail}>
                <img src={process.env.BASE_URL + props.thumbnail.location} className="hover:bg-yellow-300 p-2 cursor-pointer rounded-3xl"></img>
            </button>
        );
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

    return (
        context.profile && !isLoading ?
        <Formik
            initialValues={preLoad}
            onSubmit={handleSubmit}
            enableReinitialize={true}
            validationSchema={EventBuilderSchema}
        >
            {({isValid, dirty, isSubmitting, setFieldTouched, handleChange, handleReset}) => (
            <Form>
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
								  ? thumbnails.map(thumbnail => <Thumbnail key={thumbnail.tid} thumbnail={thumbnail} />)
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
                            disabled={!editMode}
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
                            <img onClick={() => {setIsPhotoDisplayOpen(!isPhotoDisplayOpen)}} src={process.env.BASE_URL + selectedThumbnail.location} className="cursor-pointer rounded-3xl"></img>
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

                    <div className="grid col-span-2">
                        <div className="sm:fixed">
                            <div className="hidden sm:flex space-x-2 h-8 items-center">
                                <button
                                  disabled={
                                    selectedThumbnail.tid === -1 ||
                                    profilePictureURL === defaultProfilePicture ||
                                    !isValid ||
                                    !dirty ||
                                    isSubmitting
                                  }
                                  type="submit"
                                  className={"flex px-6 mt-4 mb-4 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full " + (selectedThumbnail.tid === -1 || profilePictureURL === defaultProfilePicture || !isValid || !dirty ?  "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white ") }
                                >
                                    APPROVE
                                </button>
                                <button
                                    type="button"
                                    className="flex px-6 mt-4 mb-4 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full cursor-pointer hover:bg-black hover:text-white "
                                    onClick={() => {setEditMode(true)}}>
                                    DENY
                                </button>

                                <button
                                    type="button"
                                    className= "focus:outline-none"
                                    onClick={() => {setEditMode(true)}}>
                                    <img 
                                    src = {pencil}
                                    className = "h-8 w-8 focus:outline-none" />
                                </button>
                            </div>
                            {editMode ? 
                                <div className="hidden sm:flex space-x-5 h-8 items-center">
                                    <button
                                        type="button"
                                        className="flex px-6 mt-4 mb-4 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full cursor-pointer hover:bg-black hover:text-white"
                                        onClick={handleReset}> CANCEL
                                    </button>

                                    <button
                                        disabled={
                                            selectedThumbnail.tid === -1 ||
                                            profilePictureURL === defaultProfilePicture ||
                                            !isValid ||
                                            !dirty ||
                                            isSubmitting
                                        }
                                        type="submit"
                                        className={"flex px-6 mt-4 mb-4 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full " + (selectedThumbnail.tid === -1 || profilePictureURL === defaultProfilePicture || !isValid || !dirty ?  "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white ") }
                                        >
                                        SAVE
                                        </button>
                                </div>
                                :
                                null}
                            <div className="flex mx-auto ml-20 sm:ml-0 justify-around sm:justify-between text-sm my-2 sm:mt-20" style={{ maxWidth: "300px"}}>
                                <p>Hosted by:</p>
                                <p className="cursor-pointer hover:underline hover:text-blue-900" onClick={() => setIsCoHostOpen(!isCoHostOpen)}>Add a co-host</p>
                            </div>
                            <div className="mx-auto ml-20 mb-16 sm:ml-0 sm:mb-0 sm:mr-8 shadow-md sm:shadow-none border-solid border-black border sm:border-2 rounded-2xl" style={{ maxWidth: "300px"}}>
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
                                            <button onClick={() => {setInCrop(false); setProfilePictureURL(defaultProfilePicture)}} className="justify-center items-center bg-transparent focus:outline-none px-6 text-black hover:bg-black hover:text-white border sm:border-2 border-black mr-2 rounded-full">&lt; BACK</button>
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

                            <div className="h-8">
                                <footer className="bg-white sm:hidden inset-x-0 fixed bottom-0 flex justify-around items-center">
                                        <button
                                        disabled={
                                            selectedThumbnail.tid === -1 ||
                                            profilePictureURL === defaultProfilePicture ||
                                            !isValid ||
                                            !dirty ||
                                            isSubmitting
                                        }
                                        type="submit"
                                        className={"flex px-6 mt-4 mb-4 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full " + (selectedThumbnail.tid === -1 || profilePictureURL === defaultProfilePicture || !isValid || !dirty ?  "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white ") }
                                        >
                                            SET DATE &amp; SUBMIT
                                        </button>
                                </footer>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>)}
        </Formik>
        : <div className="text-center items-center flex flex-col mt-12">
                You must have a Schefs account to make events
                <WhitePillButton handleClick={() => context.handleToggleCard(false, true)} text="SIGN UP" padding="flex px-16 mt-4" />
         </div>
    );
};

export default EventBuilder;

export const getServerSideProps = async (context) => {
    const eventInfo = await new Promise((resolve, reject) => 
        pool.query(queries.getEvent, [ context.params.eid ], (err, results) => {
            if (err)
                reject(err);
            else if (results.rows.length == 0)
                reject({ err: 'No such event' });
            else
                resolve((results.rows[0].event));
        })
    )
    return {
        props: {
            eventInfo,
        },
    }
}