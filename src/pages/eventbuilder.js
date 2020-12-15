import WhitePillButton from "../components/Buttons/wpillbutton"
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios"
import HighlightOff from '@material-ui/icons/HighlightOff';
import { htmlToText } from 'html-to-text';
import ContentEditable from 'react-contenteditable'
import placeholder from "../../dev/images/placeholder.png"
import sampleImage1 from "../../dev/images/e1.jpg"
import sampleImage2 from "../../dev/images/e2.jpg"
import sampleImage3 from "../../dev/images/e3.jpg"
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import getCroppedImg from 'react-image-crop';
import Cropper from 'react-easy-crop'

//https://www.npmjs.com/package/html-parser

export default function EventBuilder () {
    const eventName = useRef("");
    const description = useRef("");
    const name = useRef("");
    const fileInput = useRef(null)
    const requirements = useRef("");
    const [inCrop, setInCrop] = useState(false)
    const [crop, setCrop] = useState({x:0,y:0},)
    const [zoom, setZoom] = useState(1)
    const [aspect, setAspect] = useState(1)

    const [profilePicture, setProfilePicture] = useState(null)
    const [profilePictureURL, setProfilePictureURL] = useState("http://via.placeholder.com/100x100")

    const [descriptionCount, setDescriptionCount] = useState("0/70 words")
    const [isPhotoDisplayOpen, setIsPhotoDisplayOpen] = useState(false)
    const [isOverflow, setIsOverflow] = useState(false)
    const [charCounter, setCharCounter] = useState("0/65 characters");
    const [counterStyle, setCounterStyle] = useState("");
    const [wordCounterStyle, setWordCounterStyle] = useState("");
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

   /* const onBlur = () => {
        console.log(eventName.current);
    };*/
    const escFunction = (event) => {
        if(event.keyCode === 27) {
          setIsPhotoDisplayOpen(false)
        }
      };

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
          document.removeEventListener("keydown", escFunction, false);
        };
      }, []);

    const makeCroppedImage = () => {
        typeof(profilePicture)
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
        setInCrop(false)
    }

    const countChars = () => {
        var maxLength = 65;
        var strLength = htmlToText(eventName.current).length;

        if (strLength >= maxLength){
            setCharCounter(`${strLength} / 65 characters`)
            setCounterStyle("text-red-600")
            setIsOverflow(true)
        }
        else if (strLength <= maxLength){
            setCharCounter(`${strLength} / 65 characters`)
            setCounterStyle("")
            setIsOverflow(false)
        }
    };

    const countWords = () => {
        var strLength = htmlToText(description.current).split(" ").length;

        if (strLength <= 70){
            setDescriptionCount(`${strLength} / 70 words`)
            setWordCounterStyle("text-red-600")
        }
        else if (strLength >= 70){
            setDescriptionCount(`${strLength} / 70 words`)
            setWordCounterStyle("")
        }
    };
    const fileEventHandler = e => {
        const file = e.target.files[0]
        setProfilePicture(file)

        var reader = new FileReader();

        reader.onload = (e) => {
            setProfilePictureURL(reader.result)
        };

        if (file){
            reader.readAsDataURL(file)
            setInCrop(true)
        }
    }

    const fileUploadHandler = () => {
        const fd = new FormData();
        fd.append('image', profilePicture)
       // axios.post('api...')
    }

    return (
        <>
            {isPhotoDisplayOpen ? 
                <>
                    <div className="h-screen fixed w-screen" onClick={() => setIsPhotoDisplayOpen(!isPhotoDisplayOpen)}></div>
                    <div className="fixed overflow-scroll m-8 border sm:border-2 top-0 mt-10 border-black rounded-xl bg-white justify-center z-10">
                        <div className="flex justify-end">
                            <button onClick={() => setIsPhotoDisplayOpen(!isPhotoDisplayOpen)} className="focus:outline-none p-2">
                                <HighlightOff/>
                            </button>
                        </div>
                        <div className="m-2 pb-6 flex justify-between">
                            <p>Don't see a photo you like? Pick one of these images as a placeholder for now and<br></br> email schefs.us@gmail with the name of your event &amp; your new image of choice.</p>
                            <p>No two events use the same image.<br></br>Once you choose an image, it’s yours!</p>
                        </div>
                        <div className="mx-2 gap-4 grid grid-cols-4 mb-4">
                            <img src={sampleImage1} className="hover:bg-yellow-300 p-2 cursor-pointer rounded-3xl"></img>
                            <img src={sampleImage2} className="hover:bg-yellow-300 cursor-pointer p-2 rounded-3xl"></img>
                            <img src={sampleImage3} className="hover:bg-yellow-300 cursor-pointer p-2 rounded-3xl"></img>
                            <img src={sampleImage1} className="hover:bg-yellow-300 cursor-pointer p-2 rounded-3xl"></img>
                            <img src={sampleImage3} className="hover:bg-yellow-300 cursor-pointer p-2 rounded-3xl"></img>
                            <img src={sampleImage2} className="hover:bg-yellow-300 cursor-pointer p-2 rounded-3xl"></img>
                        </div>
                    </div> 
                </>
                : null}
            
            <div className="mb-4 sm:gap-4 sm:grid sm:grid-cols-5 mx-1 pl-6">
                <div className="grid col-span-3">
                    <ContentEditable
                        html={eventName.current}
                        //onBlur={onBlur}
                        onKeyUp={countChars}
                        //disabled={isOverflow ? true : false}
                        onChange={(e) => {eventName.current=e.target.value}} 
                        placeholder={"My event title..."}
                        className="text-5xl leading-snug mb-2 focus:outline-none"
                    />
                    <div className={"text-gray-600 pb-2 " + counterStyle}>
                        {charCounter}
                    </div>
                    <div>
                        You’ll be able to select your event’s date on the next page
                    </div>
                    <div className="mr-6 mt-2 mb-10 w-11/12">
                        <img onClick={() => {setIsPhotoDisplayOpen(!isPhotoDisplayOpen)}} src={placeholder} className="cursor-pointer rounded-3xl"></img>
                    </div>
                    <div className="items-center flex space-x-2">
                        <p>Your event description:</p>
                        <p className="text-sm pr-2 text-gray-600">70 word minimum</p>
                        <p className="text-gray-600 text-sm ">{descriptionCount}</p>
                    </div>
                    <ContentEditable
                        html={description.current}
                        onKeyUp={countWords}
                        onChange={(e) => {description.current=e.target.value}} 
                        placeholder={"My event description..."}
                        className="mt-4 leading-snug mb-8 focus:outline-none"
                    />
                    <div className="items-center flex space-x-2">
                        <p>Your event requirements (what guests should prepare):</p>
                        <p className=" pr-2 text-sm text-gray-600">Optional</p>
                    </div>
                    <ContentEditable
                        html={requirements.current}
                        onChange={(e) => {requirements.current=e.target.value}} 
                        placeholder={"My event requirements..."}
                        className="mt-4 leading-snug mb-8 focus:outline-none"
                    />
                </div>

                <div className="grid col-span-2 ">
                    <div className="sm:fixed">
                        <div className="flex space-x-2 h-8">
                            <WhitePillButton type="submit" text="SET DATE &#038; SUBMIT" padding="px-6"/>
                            <WhitePillButton type="submit" text="HELP" padding="px-6"/>
                        </div>
                        <div className="text-sm my-2 mt-20">
                            Hosted by:
                        </div>
                        <div className="sm:mr-8 shadow-md sm:shadow-none mr-4 border-solid border-black border sm:border-2 rounded-2xl" style={{minWidth: "350px"}}>
                            <div className="p-4 grid-rows-3">
                                {inCrop  // add to second outer div for consistent w/h style={{minWidth: "500px", minHeight: "320px"}}
                                ? 
                                <div className="row-span-1 grid rounded-3xl">
                                    <div className="relative h-48 rounded-3xl overflow-hidden cursor-pointer">
                                        <Cropper
                                            image={profilePictureURL}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
                                            cropShape="round"
                                            showGrid={false}
                                            onCropChange={(crop) => {setCrop(crop)}}
                                            onCropComplete={(croppedArea, croppedAreaPixels) => {console.log("hi");setCroppedAreaPixels(croppedAreaPixels)}}
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
                                    <div className="row-span-1 flex">
                                        <input className="hidden" ref={fileInput} type="file" onChange={fileEventHandler} accept={"image/*"} multiple={false} />
                                        <div onClick={() => {fileInput.current.click()}}>
                                            <img src={profilePictureURL} onClick={fileUploadHandler} className="rounded-full p-2 h-24 w-24 items-center cursor-pointer justify-center"></img>
                                        </div>
                                        <ContentEditable
                                            html={name.current}
                                            onChange={(e) => {name.current=e.target.value}} 
                                            placeholder={"My name..."}
                                            className="self-center ml-4 text-3xl focus:outline-none"
                                        />
                                    </div>
                                    <div className="mb-8 row-span-1 text-center justify-center">
                                        <p>Columbia • 2023</p>
                                        <p>Computer Engineering</p>
                                    </div>
                                    <div className="row-span-1 text-center justify-center">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    </div> 
                                </>
                                } 
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </>
    );
};
/*
<ImageUploader
    {...props}
    onChange={onDrop}
    imgExtension={[".jpg", ".gif", ".png", ".gif"]}
    maxFileSize={5242880}
    />
https://codesandbox.io/s/53w20p2o3n?file=/src/index.js
*/