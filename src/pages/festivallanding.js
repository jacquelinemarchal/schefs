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
                    <p className="text-sm mt-4 mr-16">We’ve spent over a year living in a “remote” world. Remote school, remote work. How much of this will stick? What has this changed, forever? What has this enabled, what has this hindered? What has it done to us as individuals, as teams, as communities, as societies? How has it shaped us, (how) will it continue to shape us? What are the implications?</p>
                    <p className="italic text-sm my-2">...or anything else that “Remote” makes you think of, question, interrogate, or wonder...</p>
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
                    <p className="text-sm mt-4 mr-16">The earth, the earth, our beloved earth. What’s the tie between covid and climate change? How are we thinking about the planet in new ways, and our relationship to it? How are new administrations thinking about and taking action toward stronger climate policy? Are we making any progress? Are we doomed? Is there truly a new, emerging global consciousness and sense of responsibility to care for this planet? If not, how can there be? Who are the key players? How can we be stronger stewards than ever before? What has covid changed about our understanding of planetary and personal health, wellness, longevity, possibility?</p>
                    <p className="italic text-sm my-2">...or anything else that “Planet” makes you think of, question, interrogate, or wonder... </p>
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
                    <p className="text-sm mt-4 mr-16">How has covid affected our national, political identities? What has it demonstrated about leadership, decision-making, responsibility, resources, collective action, socio-economic disparity? What does the “vaccine passport” mean, prohibit, enable? How will it unify and divide us? How has society fractured, and how will it repair itself?</p>
                    <p className="italic text-sm my-2">...or anything else that “Passport” makes you think of, question, interrogate, or wonder… </p>                
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
                    <p className="text-sm mt-4 mr-16">Structure, structure, structure - so very abstract - just take it and run with it. How have we structured (and restructured) ourselves, our lives, our friends, our communities, our cities, our governments? What new habits and rituals, individually and collectively, have formed as a result of covid? How have we “organized” in new ways? What’s not working, what structures do we seek to dismantle, what structures has covid revealed to be broken, malfunctioning, despicable -- and equally, structures that show themselves to be truly humane, resilient, empowering?</p>
                    <p className="italic text-sm my-2">...or anything else that “Structure” makes you think of, question, interrogate, or wonder… </p>
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
                    <p className="text-sm mt-4 mr-16">The thing we’ve been simultaneously longing for… and also dreading. Admit it. The nerves, the nuance, the complexity of returning to a hyper-social world is heavy, overwhelming, all-consuming, ecstatic, erratic, delicious, terrifying, exciting. What do we really want from it? What do we no longer want? What are we craving, what don’t we want back? Who do we want to see, who don’t we want to see? Is it happening, has it happened, when will it happen, what is it… what is the social world we are about to enter, once again? Will it be the same? Do we even want it to be?</p>
                    <p className="italic text-sm my-2">...or anything else that “Socialize” makes you think of, question, interrogate, or wonder… </p>
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
                    <p className="text-sm mt-4 mr-16">Physically, emotionally, philosophically, symbolically… how has our relationship to intimacy changed? What are we comfortable with, what are we yearning for, what’s changed? How will we exist as sexual beings in this newly social world, what will that look like, what do we want, do we want the same things, what will this collective energy feel like? What kind of love are we looking for right now, how are we thinking about love, about friendship, about relationships with others, with ourselves, what is our capacity for intimacy at this very very moment in time?</p>
                    <p className="italic text-sm my-2">...or anything else that “Intimacy” makes you think of, question, interrogate, or wonder… </p>
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
                    <p className="text-sm mt-4 mr-16">Perhaps the most important day of the festival… are we living in a new age? What defines that new age? How do we manifest our greatest visions for it, unlock its greatest potential? What is in our control, what is out? How do we seize the moment and shape it for good? What direction are we moving in? What will the world look like in 5, 10, 50 years? Where do we need to be going, and how do we get there? What do we think about when we see covid from a macro perspective, as part of the course of evolution… where has it, is it taking us?</p>
                    <p className="italic text-sm my-2">...or anything else that “Paradigm” makes you think of, question, interrogate, or wonder… </p>
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
