import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment-timezone';
import { htmlToText } from 'html-to-text';

import Head from 'next/head';
import CircularProgress from '@material-ui/core/CircularProgress';
import ContentEditable from 'react-contenteditable';
import Collapse from '@material-ui/core/Collapse';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { CSSTransition } from 'react-transition-group';
import TextareaAutosize from 'react-textarea-autosize';

import { MuiPickersUtilsProvider, Calendar } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import HighlightOff from '@material-ui/icons/HighlightOff';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import Context from '../components/Context/context';
import WhitePillButton from '../components/Buttons/wpillbutton';
import cohost from '../assets/cohost.png';

const defaultProfilePicture = 'https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/chosenImages%2FScreen%20Shot%202021-01-24%20at%2010.57.18%20AM.jpeg?alt=media&token=a88fcb5e-4919-4bc6-b792-23d725324040';
const defaultThumbnail = {
    tid: -1,
    location: 'https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/chosenImages%2Fplaceholder.png?alt=media&token=2702460e-7c14-4afe-8703-63432f82909b',
    is_used: true,
}

const EventBuilder = () => {
    // import Context and Router
    const context = useContext(Context);
    const router = useRouter();

    // get timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';

    // prefill values for event builder form
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

    // default available times to schedule event
    const [dailyTimes, setDailyTimes] = useState(null);

    // ref for profile picture that gets uploaded by user
    const fileInput = useRef(null)

    // profile picture zoom/crop settings
    const [inCrop, setInCrop] = useState(false)
    const [crop, setCrop] = useState({x:0,y:0},)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const [profilePictureURL, setProfilePictureURL] = useState(defaultProfilePicture);

    // thumbnail selection modal state
    const [isPhotoDisplayOpen, setIsPhotoDisplayOpen] = useState(false)    

    // help modal state
    const [isModalOpen, setIsModalOpen] = useState(true)

    // cohost options modal state
    const [isCoHostOpen, setIsCoHostOpen] = useState(false)

    // schedule event modal state
    const [isSchedulerOpen, setIsSchedulerOpen] = useState(false)

    // selected date & time for scheduler
    const [datetimeConfirmed, setDatetimeConfirmed] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment());
    const [selectedTime, setSelectedTime] = useState(null);

    // available dates & times for scheduler
    const [unavailableDatetimes, setUnavailableDatetimes] = useState(null);

    // show available times when scheduling
    const [showTimes, setShowTimes] = useState(false);

    // thumbnail options and selected value
	const [thumbnails, setThumbnails] = useState([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState(defaultThumbnail);

    // get available thumbnails from backend
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
                const times = {};
                for (const event of events) {
                    // event time unavailable at this hour + hour after
                    const datetime = moment(event.time_start).tz(timezone);
                    const datetime1 = moment(event.time_start).add(1, 'hours').tz(timezone);
                    
                    const date = datetime.format('YYYY-MM-DD');
                    if (date in times) {
                        times[date].add(datetime.format('h:mm A'));
                        times[date].add(datetime1.format('h:mm A'));
                    } else
                        times[date] = new Set([datetime.format('h:mm A'), datetime1.format('h:mm A')]);
                }

                setUnavailableDatetimes({...times});
            })
            .catch((err) => console.log(err));
    }
 
    // function to close modals
    const closeModals = () => {
        if (isPhotoDisplayOpen)
            setIsPhotoDisplayOpen(false);
        if (isModalOpen)
            setIsModalOpen(false);
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

    // set pre-fill values whenever profile updates
    useEffect(() => {
        if (context.profile) {
            setPreLoad({
                coHostEmail: "",
				title: "",
				description: "",
				requirements: "",
                first_name: context.profile.first_name,
                last_name: context.profile.last_name,
                grad_year: context.profile.grad_year,
                school: context.profile.school,
                major: context.profile.major,
                bio: context.profile.bio,
            });

            if (context.profile.img_profile)
                setProfilePictureURL(context.profile.img_profile);
        }
    }, [context.profile]);

    // query thumbnails on load
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

    useEffect(() => {
        if (isModalOpen || isCoHostOpen || isSchedulerOpen || isPhotoDisplayOpen)
            document.body.style.overflow = 'hidden';
        else
            document.body.style.overflow = 'unset';
    }, [isModalOpen, isCoHostOpen, isSchedulerOpen, isPhotoDisplayOpen]);

    // check if date in scheduler should be disabled
    const isDateDisabled = (date) => {
        const datestring = date.format('YYYY-MM-DD');
        if (date.day() != 0 && date.day() != 5 && date.day() != 6)
            return true;
        if (datestring in unavailableDatetimes && unavailableDatetimes[datestring].length === dailyTimes.length)
            return true;
        return false;
    }

    const confirmDatetime = () => {
        setDatetimeConfirmed(true);
        setTimeout(() => setIsSchedulerOpen(false), 1000);
    }

    const selectDatetime = (time) => {
        setDatetimeConfirmed(false);
        setSelectedTime(time);
    }

    // math for cropping profile pictures
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

    // word counter for event description
    const wordCounter = value => {
        const string = value.trim()
        const strLength = string ? string.split(/\s+/).length : 0;

        if (strLength < 70){
            return(`${strLength} words`)
        } else
			return '';
    };

    // character counter for event title
    const charCounter = value => {
        if (value.length > 65){
            return(`${value.length} / 65 characters`)
        }
    };

    // open crop tool and save image URL on profile picture upload
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

    // on Formik submit
    const handleSubmit = async (values, { setSubmitting }) => {
        const time_start = moment.tz(
            selectedDate.format('YYYY-MM-DD') + ' ' + selectedTime,
            'YYYY-MM-DD h:mm A',
            timezone
        ).toDate();

        console.log(time_start);

        const eventData = {
            title: values.title,
            description: values.description,
            requirements: values.requirements,
            thumbnail_id: selectedThumbnail.tid,
            host_bio: values.bio,
            time_start: time_start,
            hosts: [{ ...context.profile }],
        }

        let eid;
        try {
            eid = (await axios.post('/api/events', eventData)).data.eid;
        } catch (err) {
            setSubmitting(false);

            if (err.response && err.response.status === 409) {
                if (err.response.data.err === 'Thumbnail already in use') {
                    alert('Thumbnail already in use, choose a different one');
                    queryThumbnails();
                    setSelectedThumbnail(defaultThumbnail);
                } else if (err.response.data.err === 'Time unavailable') {
                    alert('Time is unavailable, choose a different one');
                    queryAvailableTimes();
                    setSelectedTime(null);
                    setDatetimeConfirmed(false);
                }
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

            // trigger MyEvents update
            context.handleSetMyEvents(null);

            // redirect to PostEventSubmit confirmation
            router.push('/posteventsubmit?eid=' + eid);
        } catch (err) {
            setSubmitting(false);

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
              <img src={props.thumbnail.location} className="hover:bg-yellow-300 p-2 cursor-pointer rounded-3xl"></img>
            </button>
        );
    }
    
    const Greyout = () => {
        return (
            <CSSTransition
              in={isModalOpen || isCoHostOpen || isSchedulerOpen || isPhotoDisplayOpen}
              timeout={500}
              key="grey-out"
              classNames="grey-out"
              unmountOnExit
            >
              <div onClick={closeModals} className="fixed inset-0 z-10">
                <div className="absolute inset-0 bg-black" style={{opacity: .4}}></div>
              </div>
            </CSSTransition>
        )
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
        title: Yup.string()
            .required('This field is required')
            .max(65, 'Maximum character limit: 65')
    });
  
    return (
        <>
          <Head>
            <title>Schefs - Event Builder</title>
          </Head>
          {preLoad.first_name && context.profile && context.profile.isVerified
            ? <>
                <Greyout />

                <CSSTransition
                  in={isModalOpen}
                  timeout={500}
                  key="eventbuilder-modal"
                  classNames="eventbuilder-modal"
                  unmountOnExit
                >
                  <div className="fixed px-2 mx-6 md:mx-12 xl:mx-24 border-black border-2 overflow-scroll top-0 mt-20 rounded-xl bg-white justify-center z-10 shadow">
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
                </CSSTransition>
                
                <CSSTransition
                  in={isCoHostOpen}
                  timeout={500}
                  key="eventbuilder-cohost"
                  classNames="eventbuilder-modal"
                  unmountOnExit
                >
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
                </CSSTransition>
              
                {isPhotoDisplayOpen
                  ? <>
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
                            : null
                          }
                        </div>
                      </div> 
                    </>
                  : null
                }

                <CSSTransition
                  in={isSchedulerOpen}
                  timeout={500}
                  key="eventbuilder-scheduler"
                  classNames="eventbuilder-modal"
                  unmountOnExit
                >
                <div id="calendar" className="overflow-hidden p-2 m-6 md:m-0 fixed md:transform md:-translate-x-1/2 border-2 border-black rounded-xl md:mt-12 top-0 bottom-0 bg-white justify-center z-20">
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setIsSchedulerOpen(false)} className="focus:outline-none p-2">
                        <HighlightOff/>
                      </button>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:h-full max-h-full">
                      <div className="lg:w-2/3 px-8">
                        <p className="text-base mb-2 lg:mb-8">Choose a time to host your event:</p>
                        <div className="overflow-hidden lg:pl-8 mb-4 lg:mb-0"> 
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
                        ? <div className="lg:w-1/3 px-8 pb-20 overflow-y-scroll">
                            {dailyTimes.map(time => {
                              const date = moment(selectedDate).format('YYYY-MM-DD');
                              if (unavailableDatetimes && (date in unavailableDatetimes && unavailableDatetimes[date].has(time)))
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

                <div className="px-2 mx-6 md:mx-12 xl:mx-24">
                  <Formik
                    initialValues={preLoad}
                    onSubmit={handleSubmit}
                    validationSchema={EventBuilderSchema}
                  >
                    {({isValid, dirty, isSubmitting, setFieldTouched, handleChange}) => (
                      <Form>
                      <div className="mb-4 mt-4 lg:mt-0 lg:gap-4 lg:grid lg:grid-cols-5">
                        <div className="lg:grid lg:col-span-3">
                          <Field 
                            name="title" 
                            as={TextareaAutosize} 
                            validate={charCounter}
                            className="text-left text-5xl resize-none leading-tight focus:outline-none w-full lg:w-2/3 "
                            placeholder="My event title..."
                            onChange={e => {
                                setFieldTouched('title');
                                handleChange(e);
                            }}
                          />
                    
                          <ErrorMessage render={msg => <p className="text-red-500 text-sm pb-2">{msg}</p>} name="title"></ErrorMessage>
  
                          <div className="flex flex-row">
                            <WhitePillButton
                              handleClick={() => setIsSchedulerOpen(true)}
                              type="button"
                              text={datetimeConfirmed
                                ? selectedDate.format('dddd, MMMM D, YYYY') + ' @ ' + selectedTime + ' ' + moment.tz(timezone).format('z')
                                : 'SELECT DATE & TIME'
                              }
                              padding="hidden lg:block flex px-6 mb-4 w-full mt-2 lg:mt-0 lg:w-auto"
                            />

                            <WhitePillButton
                              handleClick={() => setIsSchedulerOpen(true)}
                              type="button"
                              text={datetimeConfirmed
                                ? selectedDate.format('MMMM D, YYYY') + ' @ ' + selectedTime + ' ' + moment.tz(timezone).format('z')
                                : 'SELECT DATE & TIME'
                              }
                              padding="lg:hidden flex px-6 mb-4 w-full mt-2 lg:mt-0 lg:w-auto"
                            />
                          </div>
    
                          <div className="mt-2 mb-10 lg:w-2/3">
                            <img onClick={() => {setIsPhotoDisplayOpen(!isPhotoDisplayOpen)}} src={selectedThumbnail.location} className="cursor-pointer rounded-3xl" />
                          </div>
                          <div className="items-center flex space-x-2">
                            <p>Your event description:</p>
                            <p className="text-sm pr-2 text-gray-600">70 word minimum</p>
                            <ErrorMessage render={msg => <p className="text-red-500 text-sm">{msg}</p>} name="description"></ErrorMessage>
                          </div>
  
                          <Field 
                            as="textarea"
                            placeholder="My event description..." 
                            className={"text-left mt-4 h-32 leading-snug mb-8 w-full lg:w-5/6 focus:outline-none"} 
                            name="description" 
                            validate={wordCounter}
                            onChange={e => {
                                setFieldTouched('description');
                                handleChange(e)
                            }}
                          />
                          <div className="items-center flex space-x-2">
                            <p>Your event requirements<span className="hidden lg:inline"> (what guests should prepare)</span>:</p>
                            <p className=" pr-2 text-sm text-gray-600">Optional</p>
                          </div>
                          <Field 
                            as="textarea"   
                            placeholder="My event requirements..." 
                            className="text-left mt-4 h-32 leading-snug mb-8 w-full lg:w-5/6 focus:outline-none" 
                            name="requirements" 
                          />
                        </div>
  
                        <div className="lg:grid lg:col-span-2 ">
                          <div className="lg:fixed">
                            <div className="hidden lg:flex space-x-2 h-8 items-center">
                              <button
                                disabled={
                                   selectedThumbnail.tid === -1 ||
                                   profilePictureURL === defaultProfilePicture ||
                                   !datetimeConfirmed ||
                                   !isValid ||
                                   !dirty ||
                                   isSubmitting
                                }
                                type="submit"
                                className={"flex w-1/3 px-6 mt-4 mb-4 py-0 justify-center items-center bg-transparent focus:outline-none text-black border lg:border-2 border-black rounded-full " + (selectedThumbnail.tid === -1 || profilePictureURL === defaultProfilePicture || !datetimeConfirmed || !isValid || !dirty || isSubmitting ?  "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white ") }
                              >
                                {isSubmitting
                                  ? <><span>&#8203;</span><CircularProgress size="1rem" thickness={5} /></>
                                  : 'SUBMIT'
                                }
                              </button>
                              <div onClick={() => {setIsModalOpen(true)}}> 
                                <WhitePillButton type="button" text="HELP" padding="px-6 flex"/>
                              </div>
                            </div>
  
                            <div className="flex items-center justify-center lg:justify-start text-sm my-2 lg:mt-12">
                              <p className="mb-1">Hosted by:</p>
                            </div>
                            <div className="mx-auto mb-16 lg:mb-0 lg:mr-8 shadow-md lg:shadow-none border-solid border-black border-2 rounded-2xl" style={{ maxWidth: "350px"}}>
                              <div className="p-4 grid-rows-3">
                                {inCrop  // add to second outer div for consistent w/h style={{minWidth: "500px", minHeight: "320px"}}
                                  ? <div className="row-span-1 grid rounded-3xl">
                                      <div className="relative h-48 w-auto rounded-3xl overflow-hidden cursor-pointer">
                                        <Cropper
                                          image={profilePictureURL}
                                          crop={crop}
                                          zoom={zoom}
                                          aspect={1}
                                          cropShape="round"
                                          showGrid={false}
                                          onCropChange={(crop) => {setCrop(crop)}}
                                          onCropComplete={
                                              (croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)
                                          }
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
                                        <button onClick={() => {setInCrop(false); setProfilePictureURL(defaultProfilePicture)}} className="justify-center items-center bg-transparent focus:outline-none px-6 text-black hover:bg-black hover:text-white border-2 border-black mr-2 rounded-full">&lt; BACK</button>
                                        <button onClick={makeCroppedImage} className="justify-center items-center bg-transparent focus:outline-none px-6 text-black hover:bg-black hover:text-white border-2 border-black rounded-full">CONFIRM &gt;</button>
                                      </div> 
                                    </div>
                                  : <>
                                      <div className="row-span-1">
                                        <div className="grid grid-cols-3">
                                          <div className="col-span-1 h-24 w-24 ">
                                            <input className="hidden" ref={fileInput} type="file" onChange={fileEventHandler} accept={"image/*"} multiple={false} />
                                            <div onClick={() => {fileInput.current.click()}} className="bg-white">
                                              <img src={profilePictureURL} className="rounded-full p-2 items-center cursor-pointer justify-center" />
                                            </div>
                                          </div>
                                          <div className="col-span-2 my-auto">
                                            <Field 
                                              placeholder="First Name" 
                                              className="ml-4 h-10 text-left text-3xl resize-none focus:outline-none w-5/6 overflow-visible"
                                              as="textarea"
                                              name="first_name" 
                                            />
                                            <Field 
                                              placeholder="Last Name" 
                                              className={"ml-4 -mt-2 h-10 text-left text-3xl resize-none focus:outline-none w-5/6 overflow-hidden"} 
                                              name="last_name" 
                                              as="textarea"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mb-2 lg:mb-8 row-span-1 text-center">
                                        <div className="flex flex-row justify-around">
                                          <Field 
                                            placeholder="My university..." 
                                            className={"leading-snug focus:outline-none overflow-hidden text-right"} 
                                            name="school" 
                                          />
                                          <p className="mx-3">•</p>
                                          <Field 
                                            placeholder="My grad year..." 
                                            className={"leading-snug focus:outline-none overflow-hidden text-left"} 
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
                                          className="leading-snug h-40 focus:outline-none w-full"
                                          name="bio" 
                                          as="textarea"
                                        />
                                      </div> 
                                    </>
                                }
                              </div>
                            </div> 
    
                            <div className="h-8">
                              <footer className="bg-white px-2 mx-6 md:mx-12 xl:mx-24 lg:hidden inset-x-0 fixed bottom-0 flex justify-between items-center">
                                <button
                                  disabled={
                                    selectedThumbnail.tid === -1 ||
                                    profilePictureURL === defaultProfilePicture ||
                                    !datetimeConfirmed ||
                                    !isValid ||
                                    !dirty ||
                                    isSubmitting
                                  }
                                  type="submit"
                                  className={"w-5/12 px-6 mt-4 mb-4 py-0 justify-center items-center bg-transparent focus:outline-none text-black border-2 border-black rounded-full " + (selectedThumbnail.tid === -1 || profilePictureURL === defaultProfilePicture || !datetimeConfirmed || !isValid || !dirty ?  "cursor-not-allowed": "cursor-pointer hover:bg-black hover:text-white ") }
                                >
                                  SUBMIT
                                </button>
                                <div className="w-5/12" onClick={() => setIsModalOpen(true)}> 
                                  <WhitePillButton type="button" text="HELP" padding="px-6 w-full text-center" />
                                </div>
                              </footer>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </>
          : context.profile && context.profile.isVerified
            ? null
            : context.profile && !context.profile.isVerified
              ? <div className="text-center items-center flex flex-col mt-12">
                  You must verify your Schefs account to make events
                  <WhitePillButton handleClick={() => context.handleToggleCard(false, true)} text="VERIFY ACCOUNT" padding="flex px-16 mt-4" />
                </div>
              : <div className="text-center items-center flex flex-col mt-12">
                  You must have a Schefs account to make events
                  <WhitePillButton handleClick={() => context.handleToggleCard(false, true)} text="SIGN UP" padding="flex px-16 mt-4" />
                </div>
          }
        </>
    );
};

export default EventBuilder;
