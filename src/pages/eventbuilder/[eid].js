import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import axios from 'axios';
import Head from 'next/head';
import moment from 'moment';
import 'moment-timezone';
import pool from '../../utils/db';
import queries from "../../utils/queries/events";
import { useRouter } from 'next/router';

import { htmlToText } from 'html-to-text';
import ContentEditable from 'react-contenteditable';
import getCroppedImg from 'react-image-crop';
import Cropper from 'react-easy-crop';
import {CSSTransition} from 'react-transition-group'

import Collapse from '@material-ui/core/Collapse';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import HighlightOff from '@material-ui/icons/HighlightOff';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiPickersUtilsProvider, Calendar } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import pencil from "../../assets/pencil.png"

import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import Context from '../../components/Context/context';
import WhitePillButton from '../../components/Buttons/wpillbutton';
import cohost from '../../assets/cohost.png';
import { LocalConvenienceStoreOutlined } from '@material-ui/icons';


const EventEditor = ({ eventInfo }) => {
    // import Context
    const context = useContext(Context);
    const router = useRouter();
    // get timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";

    // edit event mode
    const [editMode, setEditMode] = useState(false)
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

    const defaultThumbnail = {
        tid: -1,
        location: eventInfo.img_thumbnail,
        is_used: true,
    };

    const defaultProfilePicture = eventInfo.hosts[0].img_profile;

    // default available times to schedule event
    const [dailyTimes, setDailyTimes] = useState(null);
    
    // ref for profile picture that gets uploaded by user
    const fileInput = useRef(null)

    // profile picture zoom/crop settings
    const [inCrop, setInCrop] = useState(false)
    const [crop, setCrop] = useState({x:0,y:0},)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const [profilePictureURL, setProfilePictureURL] = useState(process.env.BASE_URL + defaultProfilePicture);

    // thumbnail selection modal state
    const [isPhotoDisplayOpen, setIsPhotoDisplayOpen] = useState(false)  
   
    const [isCoHostOpen, setIsCoHostOpen] = useState(false)

	const [thumbnails, setThumbnails] = useState([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState(defaultThumbnail);
    const [isLoading, setIsLoading] = useState(true)

    // schedule event modal state
    const [isSchedulerOpen, setIsSchedulerOpen] = useState(false)

    // selected date & time for scheduler
    const defaultDatetime = moment(eventInfo.time_start)
    const [datetimeConfirmed, setDatetimeConfirmed] = useState(true);
    const [selectedDate, setSelectedDate] = useState(defaultDatetime);
    const [selectedTime, setSelectedTime] = useState(defaultDatetime.tz(timezone).format("h:mm A z"));

    // available dates & times for scheduler
    const [unavailableDatetimes, setUnavailableDatetimes] = useState(null);

    // show available times when scheduling
    const [showTimes, setShowTimes] = useState(false);
    const [availableTimeError, setAvailableTimeError] = useState("");

    const queryThumbnails = () => {
        axios
            .get('/api/thumbnails')
            .then(res => setThumbnails([...res.data]))
            .catch(err => console.log(err.response.data.err));
    }

    // get available times from backend
    const queryAvailableTimes = () => {
        const date_from = moment();
        const date_to = moment().add(4, 'weeks');

        axios
            .get('/api/events', {
                params: {
                    date_from: date_from.format('YYYY-MM-DD'),
                    date_to: date_to.format('YYYY-MM-DD'),
                    status: 'all',
                    type: 'summary',
                }
            })
            .then((res) => {
                // don't consider denied events
                const events = res.data.filter((event) => !(event.status === 'denied'));

                // save in object {date string: time string} format
                const times = {}
                for (const event of events) {

                    const datetime = moment(event.time_start).tz(timezone);
                    const datetime_prev = moment(event.time_start).subtract(1, 'hours').tz(timezone);
                    const datetime_next = moment(event.time_start).add(1, 'hours').tz(timezone);

                    const date = datetime.format('YYYY-MM-DD');
                    if (date in times) {
                        times[date].add(datetime.format('h:mm A'));
                        times[date].add(datetime_prev.format('h:mm A'));
                        times[date].add(datetime_next.format('h:mm A'));
                    } else
                        times[date] = new Set([
                            datetime.format('h:mm A'),
                            datetime_prev.format('h:mm A'),
                            datetime_next.format('h:mm A')
                        ]);
                }

                setUnavailableDatetimes({...times});
            })
            .catch((err) => {
                setAvailableTimeError("There was an error displaying the correct available times. Please contact schefs.us@gmail.com")
            });
    }
 
    // function to close modals
    const closeModals = () => {
        if (isPhotoDisplayOpen)
            setIsPhotoDisplayOpen(false);
        if (isCoHostOpen)
            setIsCoHostOpen(false);
        if (isSchedulerOpen)
            setIsSchedulerOpen(false);
    }

    // listen for escape key to close modals
    const escFunction = (event) => {
        if (event.keyCode === 27)
            closeModals();
    };

    // escape keylistener
    useEffect(() => {
        document.addEventListener('keydown', escFunction, false);
        return () => document.removeEventListener('keydown', escFunction, false);
    }, []);

    useEffect(() => {
       // console.log(props)
        setSelectedDate(moment(eventInfo.time_start));
        setSelectedTime(moment(eventInfo.time_start).format("h:mm A"));
        setPreLoad({
            coHostEmail: "",
            title: `${eventInfo.title}`,
            bio: `${eventInfo.host_bio}`,
            description: `${eventInfo.description}`,
            requirements: `${eventInfo.requirements}`,
            first_name: `${eventInfo.hosts[0].first_name}`,
            last_name: `${eventInfo.hosts[0].last_name}`,
            grad_year: `${eventInfo.hosts[0].grad_year}`,
            school: `${eventInfo.host_school}`,
            major: `${eventInfo.hosts[0].major}`,
        })
    }, [editMode]);
    
    useEffect(queryThumbnails, []);
    
    useEffect(() => {
        let times = [
            '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
            '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
            '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
        ];

        times = times.map(time => (moment.tz(time, 'h:mm A', 'America/New_York').tz(timezone).format('h:mm A')));
        setDailyTimes([...times]);
    }, []);

    // query available times in the next 4 weeks on load
    useEffect(queryAvailableTimes, []);

    // check if date in scheduler should be disabled
    const isDateDisabled = (date) => {
        const datestring = date.format('YYYY-MM-DD');
        if (datestring in unavailableDatetimes && unavailableDatetimes[datestring].length === dailyTimes.length)
            return true;
        return false;
    }
    
    const confirmDatetime = () => {
        setDatetimeConfirmed(true);
        setTimeout(() => setIsSchedulerOpen(false), 500);
    }

    const selectDatetime = (time) => {
        setDatetimeConfirmed(false);
        setSelectedTime(time);
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
        const string = value.trim();
        const strLength = string ? string.split(/\s+/).length : 0;

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
        // SAVE button
        setEditMode(false);

        const time_start = moment.tz(
            selectedDate.format('YYYY-MM-DD') + ' ' + selectedTime,
            'YYYY-MM-DD h:mm A',
            timezone
        );
        
        const eventData = {
            title: values.title,
            description: values.description,
            requirements: values.requirements,
            host_bio: values.bio,
            host_name: values.first_name + ' ' + values.last_name,
            host_school: values.school,
        }

        if (selectedThumbnail.tid !== -1){
            eventData.thumbnail_id = selectedThumbnail.tid;
        }
        if (!time_start.isSame(defaultDatetime)){
            eventData.time_start = time_start;
        }

        try {
            await axios.patch(`/api/events/${eventInfo.eid}`, eventData);
            console.log("successfully saved");
        } catch (err) {
            if (err.response && err.response.status === 409) {
                if (err.response.data.err === 'Thumbnail already in use') {
                    alert('This thumbnail is already in use, please choose a different one. Contact schefs.us@gmail.com if you think this is a mistake.');
                    queryThumbnails();
                    setSelectedThumbnail(defaultThumbnail);
                } else if (err.response.data.err === 'Time unavailable') {
                    alert('This time is no longer available, please choose a different one. Contact schefs.us@gmail.com if you think this is a mistake.');
                    queryAvailableTimes();
                    setSelectedTime(defaultDatetime.tz(timezone).format("h:mm A"));
                    setDatetimeConfirmed(false);
                }
                else if (err.response.data.err === 'Required field missing') {
                    alert('You did not complete every required field in the event builder. Contact schefs.us@gmail.com if you think this is a mistake.');
                    queryAvailableTimes();
                    setSelectedTime(null);
                    setDatetimeConfirmed(false);
                }
            } else
                alert(err.response.data.err)
            return;
        } 
        
        // update user info
        const userData = new FormData();
        userData.append('first_name', values.first_name);
        userData.append('last_name', values.last_name);
        userData.append('bio', values.bio);
        userData.append('school', values.school);

        // change profile picture if changed
        if (profilePictureURL !== eventInfo.hosts[0].img_profile) {
            const res = await fetch(profilePictureURL);
            const blob = await res.blob(); 
            userData.append('img_profile', blob);
        }

        try {
            await axios.put('/api/users/' + eventInfo.hosts[0].uid, userData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } catch (err) {
            if (err.response && err.response.data)
                alert(err.response.data.err, "Unable to update your user profile. Please contact schefs.us@gmail.com for further assistance.");
            else
                alert(err, "Unable to update your user profile. Please contact schefs.us@gmail.com for further assistance.");
        }

        finally {
            setSubmitting(false);
        }
	}

    const handleApproval = async () => {
        const eventData = {
            status: 'approved'
        }
        try {
            await axios.patch(`/api/events/${eventInfo.eid}`, eventData);
            router.push('/index')
        } catch (err) {
            if (err.response && err.response.status === 500) {
                alert("Server error. Contact tech!")
            }
            else{alert("Alternate error (non 500). Contact tech.")}
            return;
        }
    }

    const handleDeny = async () => {
        const eventData = {
            status: 'denied'
        }
        try {
            await axios.patch(`/api/events/${eventInfo.eid}`, eventData);
            console.log("successfully denied");
            router.push('/admin')
        } catch (err) {
            console.log(err.response.data.err)
            if (err.response && err.response.status === 500) {
                alert("Server error. Contact tech.")
            }
            else
                {alert("Alternate error (non 500). Contact tech.")}
            return;
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
                <img src={process.env.BASE_URL + props.thumbnail.location} className="hover:bg-yellow-300 focus:outline-none p-2 cursor-pointer rounded-3xl"></img>
            </button>
        );
    }

    const EventBuilderSchema = Yup.object().shape({
        /*coHostEmail: Yup.string()
            .email('This is not a valid email'),*/
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
    
    const Greyout = () => {
        return (
            <CSSTransition
              in={isCoHostOpen || isSchedulerOpen || isPhotoDisplayOpen}
              timeout={500}
              key="grey-out"
              classNames="grey-out"
              unmountOnExit
            >
              <div onClick={closeModals} className="fixed inset-0 z-10">
                <div className="absolute inset-0 bg-gray-700 bg-opacity-75"></div>
              </div>
            </CSSTransition>
        )
    }

    return (
        <>
            {preLoad.first_name && context.profile && context.profile.is_admin
            ?   <Formik
                    initialValues={preLoad}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                    validationSchema={EventBuilderSchema}
                >
                {({isValid, dirty, isSubmitting, setFieldTouched, handleChange, resetForm, submitForm}) => (
                <Form>
                    <Greyout />           
                    <Head>
                        <title>Editing: {eventInfo.title}</title>
                        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    </Head>
                    {isPhotoDisplayOpen ? 
                      <>
                        <div id="imageContainerEB" className="fixed overflow-scroll sm:border-2 top-0 mt-12 left-0 mx-4 shadow rounded-xl bg-white justify-center z-10">
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setIsPhotoDisplayOpen(!isPhotoDisplayOpen)} className="focus:outline-none p-2">
                                    <HighlightOff/>
                                </button>
                            </div>
                            <div className="mx-4 my-2 pb-6 flex justify-between">
                                <p>Don't see a photo you like? Pick one of these images as a placeholder for now and<br></br> email schefs.us@gmail with the name of your event &amp; your new image of choice.</p>
                                <p>No two events use the same image.<br></br>Once you choose an image, it’s yours!</p>
                            </div>
                            <div className="m-2 gap-2 grid-cols-2 md:gap-4 grid md:grid-cols-4 overflow-y-scroll">
                                {thumbnails.length
                                    ? thumbnails.map(thumbnail => <Thumbnail key={thumbnail.tid} thumbnail={thumbnail} />)
                                    : <div style={{width: "80rem"}} className="ml-1">Whoops, looks like there's no thumbnails available. Contact schefs.us@gmail.com if you think this is a mistake.</div>
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

                <CSSTransition
                  in={isSchedulerOpen}
                  timeout={500}
                  key="eventbuilder-scheduler"
                  classNames="eventbuilder-modal"
                  unmountOnExit
                >
                  <div id="calendar" className="overflow-hidden p-2 mb-24 mx-4 mt-4 md:mb-0 md:mx-auto max-w-full fixed border-2 border-black rounded-xl md:mt-12 inset-0 bg-white justify-center z-20">
                    <div className="flex justify-end">
                      <button type="button" onClick={() => {setIsSchedulerOpen(false); setSchedulerTouched(true);}} className="focus:outline-none p-2">
                        <HighlightOff/>
                      </button>
                    </div>
                    <div className="flex flex-col md:flex-row md:h-full max-h-full">
                      <div className="lg:w-2/3 px-8">
                        {availableTimeError !== "" ? <div className="text-red-600 sm:text-sm text-base mb-2">{availableTimeError}</div> : null}
                        <p className="text-base mb-2 md:mb-8 hidden md:block">Choose a time to host your event:</p>
                        <div className="md:overflow-hidden md:pl-8 mb-4 md:mb-0 -mt-3 md:mt-0"> 
                          {unavailableDatetimes !== null
                            ? <MuiPickersUtilsProvider utils={MomentUtils}>
                                <Calendar 
                                  date={selectedDate}
                                  onChange={(date, isFinish) => {
                                    setDatetimeConfirmed(false);
                                    setSelectedTime(null);
                                    setSelectedDate(date);
                                    setShowTimes(true);
                                  }}
                                  shouldDisableDate={isDateDisabled} 
                                  maxDate={moment().add(60, 'days')}
                                  minDate={moment().add(3, 'days')}
                                  allowKeyboardControl={true}
                                  renderDay={(day, selectedDate, dayInCurrentMonth, dayComponent) => {
                                    if (day.isSame(selectedDate, 'day')) {
                                        return (
                                            <button
                                              className="MuiButtonBase-root MuiIconButton-root MuiPickersDay-day MuiPickersDay-daySelected dayButton"
                                              tabIndex="0"
                                              type="button"
                                              style={{
                                                color: 'black',
                                                backgroundColor: 'white',
                                                borderRadius: '40px',
                                                border: '2px solid black'
                                              }}
                                            >
                                              <span className="MuiIconButton-label">
                                                <p className="MuiTypography-root MuiTypography-body2 MuiTypography-colorInherit">
                                                  {day.format('D')} 
                                                </p>
                                              </span>
                                              <span className="MuiTouchRipple-root"></span>
                                            </button>
                                        );
                                    }
                                    else
                                        return dayComponent;
                                  }}
                                />
                              </MuiPickersUtilsProvider>
                            : null
                          }
                        </div>
                      </div>

                      {dailyTimes
                        ? <div className="md:w-1/3 px-8 pb-20 overflow-y-scroll">
                            {dailyTimes.map(time => {
                              const date = moment(selectedDate).format('YYYY-MM-DD');
                              if (unavailableDatetimes && date in unavailableDatetimes && unavailableDatetimes[date].has(time))
                                  return null;
                              return (
                                  <WhitePillButton
                                    handleClick={selectedTime === time ? confirmDatetime : () => selectDatetime(time)}
                                    type="button"
                                    text={
                                      selectedTime === time
                                        ? datetimeConfirmed
                                          ? 'CONFIRMED'
                                          : 'CONFIRM?'
                                        : time
                                    }
                                    padding={
                                      'my-1 w-full text-center ' + (
                                          selectedTime === time
                                            ? datetimeConfirmed
                                              ? 'bg-yellow-200'
                                              : 'bg-gray-300'
                                            : ''
                                      )
                                    }
                                    key={time}
                                  />
                              );
                            })}
                          </div>
                        : null
                      }
                    </div>

                    <div className="absolute bottom-0 h-8 w-full bg-white"></div>
                  </div>
                </CSSTransition>

                    <div className="mb-4 sm:gap-4 sm:grid sm:grid-cols-5 mx-1 pl-2 ml-6 md:ml-12 xl:ml-24">
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

                            <div className="flex flex-row">
                                <WhitePillButton handleClick={() => {if(editMode) setIsSchedulerOpen(true);}} type="button" text="CHANGE DATE &amp; TIME" padding={"px-6 flex w-3/4 md:w-1/2 xl:w-1/3 mr-4 " + (editMode ?  "": "cursor-not-allowed")} />
                                <p className="self-center ml-2">{selectedDate.format('dddd, MMMM D, YYYY') + ' @ ' + selectedTime + ' ' + moment.tz(timezone).format('z')}</p> 
                            </div>
  
                            <div className="mr-6 mt-2 mb-10 w-9/12">
                                <img onClick={() => {if(editMode){setIsPhotoDisplayOpen(!isPhotoDisplayOpen)}}} src={process.env.BASE_URL + selectedThumbnail.location} className={"cursor-pointer rounded-3xl " + (editMode ?  "": "cursor-not-allowed")}></img>
                            </div>
                            <div className="items-center flex space-x-2">
                                <p>Your event description:</p>
                                <p className="text-sm pr-2 text-gray-600">70 word minimum</p>
                                <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="description"></ErrorMessage>
                            </div>
                            <Field 
                                as="textarea"
                                disabled={!editMode}
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
                                disabled={!editMode}
                                className={"text-left mt-4 h-32 leading-snug mb-8 w-5/6 focus:outline-none"} 
                                name="requirements" 
                            />
                        </div>

                        <div className="grid col-span-2">
                            <div className="sm:fixed">
                                <div className="hidden sm:flex space-x-2 h-8 items-center">
                                    <button
                                    disabled={
                                        !isValid ||
                                        isSubmitting
                                    }
                                    type="button"
                                    onClick={() => {handleApproval(); submitForm();}}
                                    className={"flex px-6 mt-4 mb-4 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full " + (!isValid ?  "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white ") }
                                    >
                                        APPROVE
                                    </button>
                                    <button
                                        type="button"
                                        className="flex px-6 mt-4 mb-4 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full cursor-pointer hover:bg-black hover:text-white "
                                        onClick={() => {handleDeny();}}>
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
                                            onClick={() => {
                                                resetForm();
                                                setSelectedDate(defaultDatetime);
                                                setSelectedTime(defaultDatetime.tz(timezone).format("h:mm A z"));
                                                setEditMode(false);
                                                setSelectedThumbnail(defaultThumbnail);
                                                setProfilePictureURL(defaultProfilePicture);
                                            }}
                                        > 
                                            CANCEL
                                        </button>

                                        <button
                                            disabled={
                                                !isValid ||
                                                isSubmitting
                                            }
                                            type="submit"
                                            className={"flex px-6 mt-4 mb-4 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full " + (!isValid ?  "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white ") }
                                            >
                                            SAVE
                                            </button>
                                    </div>
                                    :
                                    null}
                                <div className="flex mx-auto ml-20 sm:ml-0 justify-around sm:justify-between text-sm my-2 sm:mt-20" style={{ maxWidth: "350px"}}>
                                    <p>Hosted by:</p>
                                    <p className="hidden cursor-pointer hover:underline hover:text-blue-900" onClick={() => setIsCoHostOpen(!isCoHostOpen)}>Add a co-host</p>
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
                                                        <div onClick={() => editMode ? fileInput.current.click() : null}>
                                                            <img src={profilePictureURL} className={'rounded-full p-2 items-center justify-center ' + (editMode ? 'cursor-pointer' : 'cursor-not-allowed')}></img>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2 my-auto">
                                                        <Field 
                                                            placeholder="First Name" 
                                                            disabled={!editMode}
                                                            className={"ml-4 h-10 text-left text-3xl resize-none focus:outline-none w-5/6 overflow-visible"}
                                                            as="textarea"
                                                            name="first_name" 
                                                        />
                                                        <Field 
                                                            placeholder="Last Name"
                                                            disabled={!editMode} 
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
                                                        disabled={!editMode}
                                                        className={"leading-snug focus:outline-none overflow-hidden text-center"} 
                                                        name="school" 
                                                    />
                                                    <p className="mx-3">•</p>
                                                    <Field 
                                                        placeholder="My grad year..." 
                                                        disabled={!editMode}
                                                        className={"leading-snug focus:outline-none overflow-hidden text-center"} 
                                                        name="grad_year" 
                                                    />
                                                </div>
                                                <Field 
                                                    placeholder="My major..." 
                                                    disabled={!editMode}
                                                    className={"leading-snug focus:outline-none overflow-hidden text-center"} 
                                                    name="major" 
                                                />
                                            </div>
                                            <div className="flex">
                                                    <Field 
                                                        placeholder="My bio..."
                                                        disabled={!editMode}
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
                                            !datetimeConfirmed ||
                                            !isValid ||
                                            !dirty ||
                                            isSubmitting
                                        }
                                        type="submit"
                                        className={"flex px-6 mt-4 mb-4 py-0 justify-center items-center bg-transparent focus:outline-none text-black border sm:border-2 border-black rounded-full " + (!isValid || !dirty ?  "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white ") }
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
          : !preLoad.first_name && context.profile && context.profile.is_admin
            ? 
            <div className="text-center mt-56">
                <CircularProgress />
            </div>
            :
            <>
                <Head>
                    <title>Unauthorized Page</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <h3 className="pl-8 pb-4 items-center text-center mt-56">You're not authorized to view this page. Click <a className=" underline" href="/">here</a> to visit our homepage.</h3>
            </>
        }
        </>
    );
};

export default EventEditor;

export const getServerSideProps = async (context) => {
    try {
        // get event data
        const eventInfo = (await pool.query(queries.getEvent, [ context.params.eid ])).rows[0].event;

        // don't return page if event is denied
        if (eventInfo.status === 'denied') {
            return {
                notFound: true,
            };
        }

        // format event time string properly based on PSQL's timezone
        const timezone = (await pool.query('SHOW TIMEZONE')).rows[0].TimeZone;
        eventInfo.time_start = moment.tz(eventInfo.time_start, timezone).utc().format();

        return {
            props: {
                eventInfo,
            },
        };
    } catch (err) {
        console.log(err);
        return {
            notFound: true,
        };
    }
}
