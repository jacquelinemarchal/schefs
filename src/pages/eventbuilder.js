import WhitePillButton from "../components/Buttons/wpillbutton"
import React, { useState, useEffect, useRef } from "react";
import axios from "axios"
import ContentEditable from 'react-contenteditable'
import thumb from "../../dev/images/e2.jpg"
import ImageUploading from "react-images-uploading"

export default function EventBuilder () {

    useEffect(() => {
        // get data
        return()=>(console.log("cleanup"))
    }, [])
    const [images, setImages] = React.useState([]);


    const onDrop = picture => {
      setPictures([...pictures, picture]);
    };
    const eventName = useRef("");
    const [charCounter, setCharCounter] = useState("0/65 characters")

    const onBlur = () => {
       // console.log(eventName.current);
    };

    const countChars = () => {
        var maxLength = 65;
        var strLength = eventName.current.length;
        // TASK:convert to plain text
        console.log(eventName.current)
        if (strLength > maxLength){
            setCharCounter(`${strLength} / 65 characters`)
            // alert to error
            // set contenteditable to disabled
        }
        else{
            setCharCounter(`${strLength} / 65 characters`)
        }
    }

    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
      };
    return (
        <>  
            <div className="mb-4 sm:gap-4 sm:grid sm:grid-cols-5 mx-1 pl-6">
                <div className="grid col-span-3 bg-pink-300">
                    <ContentEditable
                        html={eventName.current}
                        onBlur={onBlur}
                        onKeyUp={countChars}
                        onChange={(e) => {eventName.current=e.target.value}} 
                        placeholder={"My event title..."}
                        className="text-5xl leading-snug mb-2 focus:outline-none"
                    />
                    <div className="text-gray-600 pb-2">
                        {charCounter}
                    </div>
                    <div>
                        You’ll be able to select your event’s date on the next page
                    </div>
                    <div className="mr-6 mb-4">
                    <ImageUploading
                        value={images}
                        onChange={onChange}
                        dataURLKey="data_url"
                    >
                        {({
                        imageList,
                        onImageUpload,
                        onImageRemoveAll,
                        onImageUpdate,
                        onImageRemove,
                        isDragging,
                        dragProps,
                        }) => (
                        // write your building UI
                        <div className="upload__image-wrapper">
                            <button
                            style={isDragging ? { color: 'red' } : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                            >
                            Click or Drop here
                            </button>
                            &nbsp;
                            <button onClick={onImageRemoveAll}>Remove all images</button>
                            {imageList.map((image, index) => (
                            <div key={index} className="image-item">
                                <img src={image['data_url']} alt="" width="100" />
                                <div className="image-item__btn-wrapper">
                                <button onClick={() => onImageUpdate(index)}>Update</button>
                                <button onClick={() => onImageRemove(index)}>Remove</button>
                                </div>
                            </div>
                            ))}
                        </div>
                        )}
                    </ImageUploading>
                    </div>
                </div>
                <div className="grid col-span-2 bg-red-500 ">
                    <div className="sm:fixed">
                        <div className="flex space-x-2 h-8">
                            <WhitePillButton type="submit" text="SET DATE &#038; SUBMIT" padding="px-6"/>
                            <WhitePillButton type="submit" text="HELP" padding="px-6"/>
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
                        />*/