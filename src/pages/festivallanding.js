import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Head from 'next/head';
import Footer from '../components/Banners/footer';
import EventGrid from '../components/Events/eventgrid';
import emergenceLogo from '../assets/eLogo.gif';
import NavBar from '../components/Banners/navbar';
import Context from '../components/Context/context';
import WhitePillButton from '../components/Buttons/wpillbutton.js'

const FestivalLanding = ({ closeCardF, socialEvents }) => {

    return (
        <>
        <div className="px-6 md:px-12 mx-2" id="emergenceBannerMobile">
            <img className="rotate-90 h-8 sm:h-12 w-auto mx-1 sm:mx-0 mb-6" src={emergenceLogo} alt="Emergence Logo" />
            <p className="text-xl leading-tight mx-1 sm:mx-0">
                    The third Schefs festival.<br />
                    A week of discussions.<br />
                    By &amp; for college students worldwide.
            </p>
        </div>

        <div className="px-6 md:px-12 xl:px-24" id="emergenceBannerWeb">
            <div className="flex flex-row justify-between mb-16">
                <div className="pl-2">
                <img className="rotate-90 md:h-12 lg:h-16 w-auto mb-6 " src={emergenceLogo} alt="Emergence Logo" />
                <p className="text-xl leading-tight">
                    The third Schefs festival.<br />
                    A week of discussions.<br />
                    By &amp; for college students worldwide.
                </p>
                </div>

                <div className="pr-16 text-xl">
                    <div className="flex flex-row justify-between">
                        <a href="#remote">
                        Remote
                        </a>
                        <p className="ml-4">June 14</p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <a className="mr-2" href="#planet">
                        Planet
                        </a>
                        <p className="ml-4">June 15</p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <a href="#passport">
                        Passport
                        </a>
                        <p  className="ml-4">June 16</p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <a href="#structure">
                        Structure 
                        </a>
                        <p className="ml-4">June 17</p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <a href="#socialize">
                        Socialize
                        </a>
                        <p className="ml-4">June 18</p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <a href="#intimacy">
                        Intimacy
                        </a>
                        <p className="ml-4">June 19</p>
                    </div>
                    <div className="flex flex-row justify-between">
                        <a href="#paradigm">
                        Paradigm 
                        </a>
                        <p className="ml-4">June 20</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="sm:mt-6 px-6 md:px-12 xl:px-24">
            
            <div className="md:grid md:grid-cols-6 md:gap-4 ml-2 sm:">
                <div className="md:col-start-1 col-span-1 text-xl mt-8 sm:mt-0">
                    June 14
                </div>
                <div className="col-start-2 col-span-3">
                    <p className="text-xl">Emergence: Remote</p>
                    <p className="text-sm mt-4 mr-16">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt ante quis metus convallis, fermentum bibendum diam sodales. Nulla suscipit tellus non varius porttitor. Nunc arcu mi, rhoncus nec lobortis a, aliquam et ipsum. Aenean ullamcorper imperdiet diam, et hendrerit tellus tempus eget. Aenean hendrerit fermentum quam, sed eleifend eros. In vitae molestie diam. Integer viverra libero semper pharetra aliquet.</p>
                </div>
                <div className="col-start-5 col-span-2 md:ml-6 xl:ml-32 lg:ml-20 ">
                    <WhitePillButton
                      text="HOST AN EVENT"
                      padding="px-6 mt-4 md:mt-0"
                      size="lg sm:text-xl"
                      link={{ pathname: '/eventbuilder', query: { date: '2021-06-14' }}}
                    />
                </div>
            </div>
            <hr className="my-6"></hr>

            <div className="md:grid md:grid-cols-6 md:gap-4 ml-2 sm:">
                <div className="md:col-start-1 col-span-1 text-xl mt-8 sm:mt-0">
                    June 15
                </div>
                <div className="col-start-2 col-span-3">
                    <p className="text-xl">Emergence: Planet</p>
                    <p className="text-sm mt-4 mr-16">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt ante quis metus convallis, fermentum bibendum diam sodales. Nulla suscipit tellus non varius porttitor. Nunc arcu mi, rhoncus nec lobortis a, aliquam et ipsum. Aenean ullamcorper imperdiet diam, et hendrerit tellus tempus eget. Aenean hendrerit fermentum quam, sed eleifend eros. In vitae molestie diam. Integer viverra libero semper pharetra aliquet.</p>
                </div>
                <div className="col-start-5 col-span-2 md:ml-6 xl:ml-32 lg:ml-20 ">
                    <WhitePillButton
                      text="HOST AN EVENT"
                      padding="px-6 mt-4 md:mt-0"
                      size="lg sm:text-xl"
                      link={{ pathname: '/eventbuilder', query: { date: '2021-06-15' }}}
                    />
                </div>
            </div>
            <hr className="my-6"></hr>

            <div className="md:grid md:grid-cols-6 md:gap-4 ml-2 sm:">
                <div className="md:col-start-1 col-span-1 text-xl mt-8 sm:mt-0">
                    June 16
                </div>
                <div className="col-start-2 col-span-3">
                    <p className="text-xl">Emergence: Passport</p>
                    <p className="text-sm mt-4 mr-16">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt ante quis metus convallis, fermentum bibendum diam sodales. Nulla suscipit tellus non varius porttitor. Nunc arcu mi, rhoncus nec lobortis a, aliquam et ipsum. Aenean ullamcorper imperdiet diam, et hendrerit tellus tempus eget. Aenean hendrerit fermentum quam, sed eleifend eros. In vitae molestie diam. Integer viverra libero semper pharetra aliquet.</p>
                </div>
                <div className="col-start-5 col-span-2 md:ml-6 xl:ml-32 lg:ml-20 ">
                    <WhitePillButton
                      text="HOST AN EVENT"
                      padding="px-6 mt-4 md:mt-0"
                      size="lg sm:text-xl"
                      link={{ pathname: '/eventbuilder', query: { date: '2021-06-16' }}}
                    />
                </div>
            </div>
            <hr className="my-6"></hr>

            <div className="md:grid md:grid-cols-6 md:gap-4 ml-2 sm:">
                <div className="md:col-start-1 col-span-1 text-xl mt-8 sm:mt-0">
                    June 17
                </div>
                <div className="col-start-2 col-span-3">
                    <p className="text-xl">Emergence: Structure</p>
                    <p className="text-sm mt-4 mr-16">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt ante quis metus convallis, fermentum bibendum diam sodales. Nulla suscipit tellus non varius porttitor. Nunc arcu mi, rhoncus nec lobortis a, aliquam et ipsum. Aenean ullamcorper imperdiet diam, et hendrerit tellus tempus eget. Aenean hendrerit fermentum quam, sed eleifend eros. In vitae molestie diam. Integer viverra libero semper pharetra aliquet.</p>
                </div>
                <div className="col-start-5 col-span-2 md:ml-6 xl:ml-32 lg:ml-20 ">
                    <WhitePillButton
                      text="HOST AN EVENT"
                      padding="px-6 mt-4 md:mt-0"
                      size="lg sm:text-xl"
                      link={{ pathname: '/eventbuilder', query: { date: '2021-06-17' }}}
                    />
                </div>
            </div>
            <hr className="my-6"></hr>

            <div className="md:grid md:grid-cols-6 md:gap-4 ml-2 sm:">
                <div className="md:col-start-1 col-span-1 text-xl mt-8 sm:mt-0">
                    June 18
                </div>
                <div className="col-start-2 col-span-3">
                    <p className="text-xl">Emergence: Socialize</p>
                    <p className="text-sm mt-4 mr-16">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt ante quis metus convallis, fermentum bibendum diam sodales. Nulla suscipit tellus non varius porttitor. Nunc arcu mi, rhoncus nec lobortis a, aliquam et ipsum. Aenean ullamcorper imperdiet diam, et hendrerit tellus tempus eget. Aenean hendrerit fermentum quam, sed eleifend eros. In vitae molestie diam. Integer viverra libero semper pharetra aliquet.</p>
                </div>
                <div className="col-start-5 col-span-2 md:ml-6 xl:ml-32 lg:ml-20 ">
                    <WhitePillButton
                      text="HOST AN EVENT"
                      padding="px-6 mt-4 md:mt-0"
                      size="lg sm:text-xl"
                      link={{ pathname: '/eventbuilder', query: { date: '2021-06-18' }}}
                    />
                </div>
            </div>
            <hr className="my-6"></hr>

            <div className="md:grid md:grid-cols-6 md:gap-4 ml-2 sm:">
                <div className="md:col-start-1 col-span-1 text-xl mt-8 sm:mt-0">
                    June 19
                </div>
                <div className="col-start-2 col-span-3">
                    <p className="text-xl">Emergence: Intimacy</p>
                    <p className="text-sm mt-4 mr-16">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt ante quis metus convallis, fermentum bibendum diam sodales. Nulla suscipit tellus non varius porttitor. Nunc arcu mi, rhoncus nec lobortis a, aliquam et ipsum. Aenean ullamcorper imperdiet diam, et hendrerit tellus tempus eget. Aenean hendrerit fermentum quam, sed eleifend eros. In vitae molestie diam. Integer viverra libero semper pharetra aliquet.</p>
                </div>
                <div className="col-start-5 col-span-2 md:ml-6 xl:ml-32 lg:ml-20 ">
                    <WhitePillButton
                      text="HOST AN EVENT"
                      padding="px-6 mt-4 md:mt-0"
                      size="lg sm:text-xl"
                      link={{ pathname: '/eventbuilder', query: { date: '2021-06-19' }}}
                    />
                </div>
            </div>
            <hr className="my-6"></hr>

            <div className="md:grid md:grid-cols-6 md:gap-4 ml-2 sm:">
                <div className="md:col-start-1 col-span-1 text-xl mt-8 sm:mt-0">
                    June 20
                </div>
                <div className="col-start-2 col-span-3">
                    <p className="text-xl">Emergence: Paradigm</p>
                    <p className="text-sm mt-4 mr-16">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tincidunt ante quis metus convallis, fermentum bibendum diam sodales. Nulla suscipit tellus non varius porttitor. Nunc arcu mi, rhoncus nec lobortis a, aliquam et ipsum. Aenean ullamcorper imperdiet diam, et hendrerit tellus tempus eget. Aenean hendrerit fermentum quam, sed eleifend eros. In vitae molestie diam. Integer viverra libero semper pharetra aliquet.</p>
                </div>
                <div className="col-start-5 col-span-2 md:ml-6 xl:ml-32 lg:ml-20 ">
                    <WhitePillButton
                      text="HOST AN EVENT"
                      padding="px-6 mt-4 md:mt-0"
                      size="lg sm:text-xl"
                      link={{ pathname: '/eventbuilder', query: { date: '2021-06-20' }}}
                    />
                </div>
            </div>
            <hr className="my-6"></hr>

        </div>
    </>
    );
};

export default FestivalLanding;
