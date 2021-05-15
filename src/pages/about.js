import React, { useState, useContext } from "react";

import Head from 'next/head';
import WhitePillButton from '../components/Buttons/wpillbutton';
import zoomCollage from '../assets/zoomCollage.png';
import about1 from '../assets/about-1.jpeg';
import about2 from '../assets/about-2.jpeg';
import about3 from '../assets/about-3.jpeg';
import about4 from '../assets/about-4.jpeg';
import Context from '../components/Context/context';

const About = () => {
    const context = useContext(Context);
    const hostButtonFunction = () => {
        if (context.profile)
            window.location.href = "/eventbuilder"
        else
            context.handleToggleCard(false, true);
    }

    return (
        <>
          <Head>
            <title>About Schefs</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
          
          <div className="px-2 mx-6 md:mx-12 xl:mx-24">
            <div className="lg:hidden block">
              <p className="sm:text-4xl text-2xl text-center leading-tight pl-22 mt-8 mb-12">
                Take what you know.<br/>
                Share it with others.<br/>
                Learn from each other.
              </p>
              <img src={zoomCollage} className="block w-full h-auto my-6" alt="Zoom collage" style={{maxHeight: '100%', alignSelf: 'center', justifySelf: 'center'}}></img>
              <p className="text-lg sm:text-xl leading-tight text-left mx-6 sm:mx-20 mb-10 mt-12">
                Schefs is a platform by and for college students to lead and participate in themed, small-group conversations on topics of their choice... every weekend.
              </p>
            </div>
            <div className="hidden lg:flex relative w-full flex-row justify-evenly items-center" style={{height: '30rem'}}>
              <p className="text-4xl leading-tight pl-22">
                Take what you know.<br/>
                Share it with others.<br/>
                Learn from each other.
              </p>
              <img src={zoomCollage} className="block w-auto h-auto" alt="Zoom collage" style={{maxWidth: '60%', maxHeight: '100%', alignSelf: 'center'}}></img>
            </div>
            <div className="hidden lg:flex w-full relative flex-row justify-center items-center" style={{height: '20rem'}}>
              <p className="text-2xl leading-tight mx-8" style={{maxWidth: '22%'}}>
                Schefs is a platform by and for college students to lead and participate in themed, small-group conversations on topics of their choice.
              </p>

              <svg width="150" height="26" viewBox="0 0 213 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 27.2911C25.8742 14.3933 58.6547 6.71231 85.5811 2.97394C102.837 0.578168 122.238 1.46527 139.558 3.40931C160.862 5.80064 179.238 14.4168 198.337 23.5112M201.732 12.3792C203.507 16.3333 205.122 20.1139 207.79 23.5323C208.73 24.7359 209.202 26.7885 210.579 27.4439C204.702 30.0231 198.978 32.9605 192.986 35.0867" stroke="#FF0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              <p className="text-2xl leading-tight ml-8 mr-32">
                Events happen <br/> every weekend.
              </p>
            </div>

            <hr className="border-black" />

            <div className="lg:block hidden">
              <div className="w-full relative mt-16" style={{height: '76rem'}}>
              <p className="text-4xl">How to host:</p>

              <div className="absolute" style={{maxWidth: '28%', left: '10%', top: '10%'}}>
                <p className="text-6xl mb-8">1.</p>
                <p className="text-2xl mb-8">Pick your topic</p>
                <p className="text-lg">
                  What are you studying? What have you been interested in lately? You only have to be an enthusiast, not an expert,
                  to host a Schefs event.<br />
                  Check out our <a className="text-blue-500 underline" href="/openmindarchive">Open Mind Archive</a> for inspiration.
                </p>
              </div>
                
              <svg className="absolute" style={{top: '12%', left: '33%'}} width="350" height="175" viewBox="0 0 479 245" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.76929 1.5083C130.004 1.5083 275.145 4.05216 376.837 94.011C408.37 121.906 426.858 154.373 447.426 190.939C456.937 207.848 468.286 216.692 468.286 236.663M441.737 225.285C443.312 226.207 475.328 249.7 475.872 240.456C476.309 233.033 478.609 217.171 472.079 213.906" stroke="#FF0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              <div className="absolute" style={{maxWidth: '28%', right: '10%', top: '30%'}}>
                <p className="text-6xl mb-8">2.</p>
                <p className="text-2xl mb-8">Create your event</p>
                <p className="text-lg">
                  Using our event builder, you’ll come up with a title, description, time and date. We’ll set up the Zoom + all logistics.
                </p>
              </div>

              <svg className="absolute" style={{top: '41%', left: '33%'}} width="330" height="170" viewBox="0 0 463 243" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M460.629 1.80176C362.757 1.80176 250.614 22.3946 165.632 73.0225C106.051 108.517 28.1187 169.071 5.49023 236.957V206.614M1.69751 240.749C7.92814 236.218 21.3946 231.698 24.4544 225.578" stroke="#FF0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              <div className="absolute" style={{maxWidth: '28%', left: '15%', top: '48%'}}>
                <p className="text-6xl mb-8">3.</p>
                <p className="text-2xl mb-8">Any college student can attend</p>
                <p className="text-lg">
                  Your event will appear on our site within 24 hours of submission, and anyone can reserve a ticket for free. We’ll make a
                  custom flyer for your event that we’ll both use to promote.
                </p>
              </div>

              <svg className="absolute" id="threeToFourArrow" width="300" height="290" viewBox="0 0 479 302" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.39893 2.33008C18.6587 49.3027 49.484 97.5474 86.2624 131.497C128.651 170.625 180.064 208.604 234.604 229.057C294.086 251.362 351.449 266.881 413.499 280.892C424.12 283.29 471.89 281.361 476.502 290.585C471.245 283.357 465.145 275.456 461.331 267.828M475.782 290.284C471.069 291.15 464.908 291.658 461.148 294.666C458.864 296.493 456.585 298.826 453.948 300.145" stroke="#FF0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              <div className="absolute" style={{maxWidth: '28%', right: '15%', top: '70%'}}>
                <p className="text-6xl mb-8">4.</p>
                <p className="text-2xl mb-8">Facilitate conversation</p>
                <p className="text-lg">
                  You’ll show up to your event along with all attendees. Everyone is there because they care about the topic at hand, but 
                  it’s your job to initially introduce yourself, the subject matter, and ask some questions to get the conversation rolling!
                </p>
              </div>
            </div>
            
            <hr className="border-black" id="lineBreakTwo"/>

            <div className="w-full relative flex flex-row justify-center" style={{height: '30rem'}}>
              <div className="relative mx-40 mt-16" style={{maxWidth: '28%'}}>
                <p className="text-6xl leading-tight">Schefs<br />IS...</p>
                    
                <svg width="240" height="25" viewBox="0 0 299 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 27.7058C43.1673 20.2208 83.9535 4.62738 126.367 4.62738C147.037 4.62738 167.578 2.06311 188.622 2.06311C225.74 2.06311 260.998 0.782751 296.89 9.75591" stroke="#FF0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <ul className="list-disc list-inside">
                  <li className="text-2xl">For undergraduates</li>
                  <li className="text-2xl">Conversations</li>
                  <li className="text-2xl">About being an &ldquo;enthusiast&rdquo;</li>
                </ul>
              </div>

              <div className="relative mx-40 mt-16" style={{maxWidth: '28%'}}>
                <svg className="absolute" style={{top: '17%', left: '-7%'}} width="250" height="120" viewBox="0 0 312 157" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M188.678 120.55C152.213 120.55 116.32 123.545 79.8402 123.545C55.902 123.545 31.764 125.697 10.8087 116.888C-1.62989 111.66 2.74666 96.2016 2.74666 87.5974C2.74666 56.7502 20.2234 40.3583 62.7083 27.6839C87.2505 20.3624 113.08 11.4504 138.794 6.21497C161.318 1.62905 187.74 1.47238 211.101 2.55359C243.281 4.04297 286.033 15.5977 304.192 34.341C322.821 53.5685 292.667 70.864 269.677 81.606C232.014 99.2033 188.324 109.281 145.974 120.633C108.013 130.809 71.946 144.004 34.491 155" stroke="#FF0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <p className="text-6xl leading-tight mb-6">Schefs is<br />NOT...</p>
                <ul className="list-disc list-inside">
                  <li className="text-2xl">For adults</li>
                  <li className="text-2xl">Lectures</li>
                  <li className="text-2xl">About being an &ldquo;expert&rdquo;</li>
                </ul>
              </div>

              <svg className="absolute" style={{top: '77%', left: '63%'}} width="150" height="310" viewBox="0 0 203 372" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M102.864 2.26465C146.022 54.0543 181.546 109.934 195.977 176.319L196.079 176.788C200.373 196.533 205.727 221.159 195.764 239.961C175.587 278.036 144.506 313.543 107.989 336.491C76.1895 356.475 39.6196 363.614 2.91602 363.614M2 364.051C3.53494 361.042 5.54114 358.739 7.36718 356M2 365C4.04169 366.547 6.53797 369.282 8.70898 370.367" stroke="#FF0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <div className="w-full flex flex-col items-center justify-center my-32">
              <p className="text-5xl">Interested?</p>
              <WhitePillButton
                handleClick={hostButtonFunction}
                size="2xl"
                padding="px-6"
                text="SIGN UP TO HOST"
              />
            </div>

            <hr className="border-black" />

            <div className="w-full my-16 flex flex-row gap-x-32 justify-center">
              <div className="w-1/2">
                <p className="text-4xl mb-4">Words of encouragement:</p>
                <p className="text-xl">
                  We know that the prospect of leading a conversation with strangers might feel intimidating...
                  but we promise, it’s worth it! You are not expected to know everything about your event’s topic.
                  You’re just the catalyst of the interaction.
                  In fact, by hosting an event, you do something truly beautiful: you put your ideas, passions,
                  and interests into the world, and people gather round. You create a space for people to learn
                  from each other, and bond through meaningful dialogue. Be brave and start the conversations
                  you want to be having!
                </p>
              </div>

              <div className="w-1/2">
                <p className="text-4xl mb-4">How did this start?</p>
                <p className="text-xl">
                  A couple of college kids wanted a new way to meet people. We used to run dinners at Columbia dorms.
                  Etc etc ADD MORE
                </p>
              </div>
            </div>

            <hr className="border-black" />

            <div className="w-full flex flex-row justify-evenly my-16">
              <p className="text-4xl">What people are saying:</p>

              <div id="left-column" className="mx-24 w-1/2">
                <div className="mb-16">
                  <div className="flex flex-row justify-start">
                    <img src={about1} className="w-1/3 h-24 rounded-xl object-cover"></img>
                    <div className="h-24 ml-12 flex flex-col justify-center">
                      <p className="text-3xl">Nia H. R.</p>
                      <p className="text-md">Barnard College &rsquo;21</p>
                    </div>
                  </div>

                  <p className="text-md my-6">Attended: Cryptography and Human Rights</p>

                  <p className="text-lg">
                    &ldquo;I had such a great experience attending this event. I came in with little to no knowledge
                    about cryptography and I feel like I left the session with so much new information as well as 
                    more things to consider/look into. It even inspired me to start listening to a new podcast! The
                    host was a great facilitator and discussion flowed easily. Everyone had valuable things to
                    contribute and I think we all learned a lot from each other.&rdquo;
                  </p>
                </div>

                <div className="mb-16">
                  <div className="flex flex-row justify-start">
                    <img src={about2} className="w-1/3 h-24 rounded-xl object-cover"></img>
                    <div className="h-24 ml-12 flex flex-col justify-center">
                      <p className="text-3xl">Nastassia M.</p>
                      <p className="text-md">Sciences Po / Columbia University &rsquo;20</p>
                    </div>
                  </div>

                  <p className="text-md my-6">Attended: Art, Human Rights and Social Justice: Creative Paths to Healing</p>

                  <p className="text-lg">
                    &ldquo;I had a wonderful time discussing the power(s) of art, art's ties to human rights and
                    social justice, and the projects that the two hosts had worked/are working on, which are related to
                    these questions. The experience was lovely because we were a small group, and while the two hosts
                    asked directions and occasionally acted as moderators, they also very much encouraged a horizontal
                    format of discussion. Therefore, we, as participants, were encouraged to come up with our own
                    questions and to mention anything that popped into our heads. Overall, I loved my first experience
                    with Schefs and I think it is a great platform!&rdquo;
                  </p>
                </div>
              </div>
                
              <div id="right-column" className="mx-24 w-1/2">
                <div className="mb-16">
                  <div className="flex flex-row justify-start">
                    <img src={about3} className="w-1/3 h-24 rounded-xl object-cover"></img>
                    <div className="h-24 ml-12 flex flex-col justify-center">
                      <p className="text-3xl">Bella B.</p>
                      <p className="text-md">Columbia University &rsquo;22</p>
                    </div>
                  </div>

                  <p className="text-md my-6">Hosted: Performance as Protest</p>

                  <p className="text-lg">
                    &ldquo;Together we explored how performance and protest overlap, intertwine, and inspire. Over
                    the course of our conversation, we explored the work of Pope.L, Kia LaBeija, and Marina Abromavić.
                    I am grateful for the space Schefs offers to ponder, question and seek. Moreover, in the midst of
                    a pandemic it is the perfect way to meet new people. I look forward to hosting again :)&rdquo;
                  </p>
                </div>

                <div className="mb-16">
                  <div className="flex flex-row justify-start">
                    <img src={about4} className="w-1/3 h-24 rounded-xl object-cover"></img>
                    <div className="h-24 ml-12 flex flex-col justify-center">
                      <p className="text-3xl">Nate J.</p>
                      <p className="text-md">Columbia University &rsquo;22</p>
                    </div>
                  </div>

                  <p className="text-md my-6">Hosted: Dramaturgies for Dystopias</p>

                  <p className="text-lg">
                    &ldquo;I learned more from this event than I did from online class at an Ivy League university.
                    It was so fulfilling to come together with so many smart, young people, and to share my
                    quarantine passion project. These are ideas that I have been screaming to the walls of my
                    quarantined life, but now they've been shared, elaborated on, challenged. It was incredible.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <p className="text-2xl mt-8 mb-4 lg:text-4xl">How to host:</p>
            <p className="text-4xl sm:text-6xl mb-4 sm:mb-8">1.</p>
            <p className="text-lg sm:text-2xl mb-4 sm:mb-8">Pick your topic</p>
            <p className="sm:text-lg">
              What are you studying? What have you been interested in lately? You only have to be an enthusiast, not an expert, to host a Schefs event.
              Check out our <a className="text-blue-500 underline" href="/openmindarchive">Open Mind Archive</a> for inspiration.
            </p>

            <p className="text-4xl sm:text-6xl mb-4 mt-6 sm:mb-8">2.</p>
            <p className="text-lg sm:text-2xl mb-4 sm:mb-8">Create your event</p>
            <p className="sm:text-lg">
              Using our event builder, you’ll come up with a title, description, time and date. We’ll set up the Zoom + all logistics.
            </p>

            <p className="text-4xl sm:text-6xl mb-4 mt-6 sm:mb-8">3.</p>
            <p className="text-lg sm:text-2xl mb-4 sm:mb-8">Any college student can attend</p>
            <p className="sm:text-lg">
              Your event will appear on our site within 24 hours of submission, and anyone can reserve a ticket for free. We’ll make a
              custom flyer for your event that we’ll both use to promote.
            </p>

            <p className="text-4xl sm:text-6xl mb-4 mt-6 sm:mb-8">4.</p>
            <p className="text-lg sm:text-2xl mb-4 sm:mb-8">Facilitate conversation</p>
            <p className="sm:text-lg mb-12">
              You’ll show up to your event along with all attendees. Everyone is there because they care about the topic at hand, but 
              it’s your job to initially introduce yourself, the subject matter, and ask some questions to get the conversation rolling!
            </p>

            <hr className="border-black" />
           
            <div className="md:hidden">
              <div className="relative mt-12">
                <p className="text-3xl sm:text-6xl mx-12 leading-tight">Schefs<br />IS...</p>

                <svg width="120" className="absolute" style={{top: '35%', left: '13%'}} height="40" viewBox="0 0 299 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 27.7058C43.1673 20.2208 83.9535 4.62738 126.367 4.62738C147.037 4.62738 167.578 2.06311 188.622 2.06311C225.74 2.06311 260.998 0.782751 296.89 9.75591" stroke="#FF0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <ul className="list-disc list-inside mt-8" style={{marginLeft: '2.5rem'}}>
                  <li className="text-lg sm:text-2xl">For undergraduates</li>
                  <li className="text-lg sm:text-2xl">Conversations</li>
                  <li className="text-lg sm:text-2xl">About being an &ldquo;enthusiast&rdquo;</li>
                </ul>
              </div>

              <div className="relative my-12">
                <svg className="absolute" style={{top: '22%', left: '13%',}} width="100" height="50" viewBox="0 0 312 157" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M188.678 120.55C152.213 120.55 116.32 123.545 79.8402 123.545C55.902 123.545 31.764 125.697 10.8087 116.888C-1.62989 111.66 2.74666 96.2016 2.74666 87.5974C2.74666 56.7502 20.2234 40.3583 62.7083 27.6839C87.2505 20.3624 113.08 11.4504 138.794 6.21497C161.318 1.62905 187.74 1.47238 211.101 2.55359C243.281 4.04297 286.033 15.5977 304.192 34.341C322.821 53.5685 292.667 70.864 269.677 81.606C232.014 99.2033 188.324 109.281 145.974 120.633C108.013 130.809 71.946 144.004 34.491 155" stroke="#FF0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <p className="text-3xl sm:text-6xl mx-12 leading-tight">Schefs is<br />NOT...</p>
                <ul className="list-disc list-inside mt-8" style={{marginLeft: '2.5rem'}}>
                  <li className="text-lg sm:text-2xl">For adults</li>
                  <li className="text-lg sm:text-2xl">Lectures</li>
                  <li className="text-lg sm:text-2xl">About being an &ldquo;expert&rdquo;</li>
                </ul>
              </div>
            </div>

            <div className="hidden w-full sm:flex flex-row justify-center" style={{height: '25rem'}}>
              <div className="relative mx-12 mt-16" style={{maxWidth: '35%'}}>
                <p className="text-5xl leading-tight mb-6">Schefs<br />IS...</p>
                    
                <svg className="absolute" style={{top: '35%'}} width="200" height="20" viewBox="0 0 299 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 27.7058C43.1673 20.2208 83.9535 4.62738 126.367 4.62738C147.037 4.62738 167.578 2.06311 188.622 2.06311C225.74 2.06311 260.998 0.782751 296.89 9.75591" stroke="#FF0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <ul className="list-disc">
                  <li className="text-2xl">For undergraduates</li>
                  <li className="text-2xl">Conversations</li>
                  <li className="text-2xl">About being an &ldquo;enthusiast&rdquo;</li>
                </ul>
              </div>

              <div className="relative mx-12 mt-16" style={{maxWidth: '35%'}}>
                <svg className="absolute" style={{top: '16%', left: '-7%'}} width="175" height="85" viewBox="0 0 312 157" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M188.678 120.55C152.213 120.55 116.32 123.545 79.8402 123.545C55.902 123.545 31.764 125.697 10.8087 116.888C-1.62989 111.66 2.74666 96.2016 2.74666 87.5974C2.74666 56.7502 20.2234 40.3583 62.7083 27.6839C87.2505 20.3624 113.08 11.4504 138.794 6.21497C161.318 1.62905 187.74 1.47238 211.101 2.55359C243.281 4.04297 286.033 15.5977 304.192 34.341C322.821 53.5685 292.667 70.864 269.677 81.606C232.014 99.2033 188.324 109.281 145.974 120.633C108.013 130.809 71.946 144.004 34.491 155" stroke="#FF0000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <p className="text-5xl leading-tight mb-6">Schefs is NOT...</p>
                <ul className="list-disc">
                  <li className="text-2xl">For adults</li>
                  <li className="text-2xl">Lectures</li>
                  <li className="text-2xl">About being an &ldquo;expert&rdquo;</li>
                </ul>
              </div>
            </div>

            <div className="text-center mb-12">
              <p className="text-2xl sm:text-3xl mt-4 mb-2">Interested?</p>
              <div className="flex justify-center">
                <WhitePillButton
                  handleClick={hostButtonFunction}
                  text="SIGN UP TO HOST"
                  padding="flex text-xl px-4 sm:px-6 mb-6"
                />
              </div>
            </div>

            <hr className="border-black" />

            <div className="my-12">
              <p className="text-2xl sm:text-3xl mb-12">
                Do you want to get even MORE involved?<br /><br />
                Become a Schefs ambassador.<br /><br />
                Host every month and help bring people onto the platform.
              </p>

              <div className="flex justify-center">
                <WhitePillButton link="/ambassador" text="LEARN MORE" padding="flex text-xl px-4 sm:px-6 mb-6"/>
              </div>
            </div>

            <hr className="border-black" />

            <div className="my-12">
              <p className="text-2xl mb-4">Words of encouragement:</p>
              <p className="mb-8">
                We know that the prospect of leading a conversation with strangers might feel intimidating... but we promise,
                it’s worth it! You are not expected to know everything about your event’s topic. You’re just the catalyst of the interaction. 
                <br /><br />
                In fact, by hosting an event, you do something truly beautiful: you put your ideas, passions, and interests into the world,
                and people gather round. You create a space for people to learn from each other, and bond through meaningful dialogue. Be
                brave and start the conversations you want to be having!
              </p>

              <p className="text-2xl mb-4">How did this start?</p>
              <p>
                A couple of college kids wanted a new way to meet people. We used to run dinners at Columbia dorms. Etc etc ADD MORE
              </p>
            </div>
          </div>
        </div>
        </>
    );
};

export default About;
