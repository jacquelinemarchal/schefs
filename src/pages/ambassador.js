import Head from 'next/head';
import React, { useState, useContext } from "react";
import WhitePillButton from '../components/Buttons/wpillbutton';

const Ambassador = () => {
    return (
        <>
          <Head>
            <title>About Schefs</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>

          <div className="relative px-2 mx-6 md:mx-12 xl:mx-24 h-screen inset-0">
            <div className="relative md:fixed text-center md:text-left md:mt-24 md:w-2/5 my-8 md:my-0">
              <p className="text-4xl mb-8 leading-tight">
                Interested in becoming a Schefs ambassador?
              </p>
              <a target="_blank" href="https://form.typeform.com/to/rA23QlDM" rel="noopener noreferrer">
                <WhitePillButton size="xl" text="APPLY" padding="px-8" />
              </a>
            </div>
            
            <div className="mt-16 md:mt-0 md:w-1/2 ml-auto md:pr-24 pb-8">
              <p className="text-2xl md:text-4xl mb-6">
                What is the ambassador program?
              </p>
              <p className="text-lg md:text-xl mb-12">
                The Schefs ambassador program is a dedicated, engaged network of college students
                committed to tapping into their communities to bring people together, lead the
                next generation’s thinking, and catalyze conversations. The ambassadors scout and
                encourage passionate students they know to join Schefs, with the larger goal of
                helping to aggregate the intelligence of people our age and creating intentional
                spaces for us to learn from one another.
                <br /><br />
                Being a Schefs ambassador isn’t just about bringing people onto Schefs, it’s about
                everything that Schefs represents. If you believe in creating deeper and
                non-hierarchical ways for students to meet friends and collaborators and inspire
                one another through a mission driven social platform that values knowledge,
                passion, contribution, diverse perspectives, and community... you’re the right fit.
              </p>
              <p className="text-2xl md:text-4xl mb-6">
                What will I do as a Schefs ambassador?
              </p>
              <p className="text-lg md:text-xl mb-12">
                Your role will be to bring hosts and guests onto the platform by being a liaison
                between Schefs and your various communities&#8212;school groups, friends, other
                projects and organizations in which you participate. You help identify the passionate,
                interesting young people you know and get them to share their enthusiasm toward
                various topics with new people by hosting and attending conversations through Schefs.
                We need you to help exponentially grow the number of sharp young minds on the platform
                to ensure we have as many ideas, subjects, and perspectives as we possibly can.
              </p>
              <p className="text-2xl md:text-4xl mb-6">
                Who makes a good ambassador?
              </p>
              <p className="text-lg md:text-xl md:mb-12">
                Someone who believes in the Schefs mission of connection through conversation and
                peer-to-peer learning. Someone who is plugged into their community and knows passionate,
                dedicated, interesting people. Someone who is excited.
              </p>
            </div>
          </div>
        </>
    )
};

export default Ambassador;
