import Footer from "../components/Banners/footer"
import EventGrid from "../components/Events/eventgrid"
import NavBar from "../components/Banners/navbar";
import React, { useState, useEffect } from "react";
import axios from "axios"
const Card = () => {

    const [allEvents, setAllEvents]  = useState([]); // [[eid, host_name, host_school, time_start, title]]

    useEffect(async () => {
        getEvents()
        return()=>console.log("cleanup function here")
    }, [])

    const getEvents = () => {
        let query = {
             params:{
                  date_from:"2020-01-01",
                  date_to:"2020-12-31",
                  status:"all",
                  type:"summary"
            }
        }
        axios.get("http://localhost:5000/api/events", query)
        .then((res)=>{
            setAllEvents([...res.data])
        })
        .catch((err)=>{alert(err)})
    }

    return (
        <>
        <div class="fixed inset-0 transition-opacity">
            <div class="absolute inset-0 bg-gray-700 opacity-75"></div>
        </div>

        <div class="fixed mr-2 rounded-xl top-0 sm:top-auto w-5/12 h-auto bg-white justify-center right-0 z-10">
                
                <div className="sm:m-8 shadow-md sm:shadow-none mr-4 border-solid border-black border sm:border-2 rounded-2xl">
                    <div className="p-4 grid-rows-3">
                        <div className="row-span-1 flex">
                            <p className="self-center ml-4 text-3xl">Jackie</p>
                        </div>
                        <div className="mb-8 row-span-1 text-center justify-center">
                            <p>Columbia • 2023</p>
                            <p>Computer Engineering</p>
                        </div>
                        <div className="row-span-1 text-center justify-center">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        </div>                        
                    </div>
                </div>


        </div>
        </>
    )
    }
export default Card;
/*
                    <div class="px-4 bg-blue-200 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                Deactivate account
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm leading-5 text-gray-500">
                                        Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-green-500 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                        <button type="button" class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                            Deactivate
                        </button>
                        </span>
                        <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                        <button type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                            Cancel
                        </button>
                        </span>
                    </div>
*/