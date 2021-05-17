import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Head from 'next/head';
import Footer from '../components/Banners/footer';
import EventGrid from '../components/Events/eventgrid';
import NavBar from '../components/Banners/navbar';
import Context from '../components/Context/context';
import WhitePillButton from '../components/Buttons/wpillbutton.js'

import social from '../assets/socialLogo.png';
import multi from '../assets/multiplicitiesLogo.png';

const Home = ({ closeCardF }) => {
    const context = useContext(Context);
    const [futureEvents, setFutureEvents] = useState(null); 
    const [pastEvents, setPastEvents] = useState(null);

    useEffect(async () => {
        const now = (new Date()).toISOString();

        if (!context.events) {
            const date_to = new Date();
            date_to.setDate(date_to.getDate() + 17);

            const query = {
                params: {
                    date_to: date_to,
                    status: 'approved',
                }
            };

            try {
                const events = (await axios.get('/api/events', query)).data;
                context.setHomeEvents(events);

                setFutureEvents(events.filter((e) => e.time_start > now));
                setPastEvents(events.filter((e) => e.time_start <= now).reverse());
            } catch (err) {
                if (err.response && err.response.data && err.response.data.err)
                    console.log(err.response.data.err);
                else
                    console.log(err);
            }
        }
        
        if (context.events) {
            setFutureEvents(context.events.filter((e) => e.time_start > now));
            setPastEvents(context.events.filter((e) => e.time_start <= now).reverse());
        }

    }, [context.events]);

    const ambassador = {
        left:  "We’re looking for engaged students to spread the word",
        right: "Learn about becoming a Schefs Ambassador ",
        linkText:" here"
    }

    return (
        <>
          <Head>
            <title>Schefs - Learn From Each Other</title>
          </Head>

          {futureEvents && pastEvents
            ? <>
                <EventGrid
                  isEditable={false}
                  events={futureEvents}
                  style="px-2"
                  gridNum="3"
                  margin="px-6 md:px-12 xl:px-24"
                  closeCardF={closeCardF}
                  showAttendees={false}
                />

                <p className="text-3xl mt-4 mb-6 ml-6 md:ml-12 xl:ml-24 pl-2">Past Events</p>

                <EventGrid
                  isEditable={false}
                  events={pastEvents}
                  style="px-2"
                  gridNum="3"
                  margin="px-6 md:px-12 xl:px-24"
                  closeCardF={closeCardF}
                  showAttendees={false}
                  photoOpacity={0.5}
                />
              </>
            : null
          }

          <div className="px-8 md:px-12 xl:px-24 mt-24">
            <p className="text-2xl mx-2 mb-8 sm:mb-12">Schefs Festivals</p>
            <div className="sm:grid sm:grid-cols-2">
              <div className="col-span-1 w-1/2">
                <img className="left-0 mt-2 h-20 w-auto" src={social} />
                <p className="text-center sm:text-left left-0 text-2xl my-6">January 04&ndash;10 2021</p>
              </div>
              <div className="col-span-1 mb-10 w-2/3">
                <p className="mx-8">
                  Tenetur et est enim sed quas amet voluptatem inventore. Corrupti ut itaque nam delectus ratione nisi. Doloribus quo et aut voluptatum impedit tenetur.
                  Distinctio possimus nulla vitae. Itaque ea qui in vel aperiam nihil sed sed debitis. Fugit accusantium et eos possimus deleniti voluptate. Sint sit eius.
                </p>
                <div className="text-center">
                  <WhitePillButton 
                    size="sm"
                    text="EXPLORE EVENTS" 
                    link="/socialfestival"
                    padding="px-8 mt-8 "
                  />
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-2 mt-10 mb-8">
              <div className="col-span-1 w-1/2">
                <img className="left-0 mt-2 h-32 w-auto" src={multi} />
                <p className="text-center sm:text-left left-0 text-2xl my-6">August 17&ndash;23 2020</p>
              </div>
              <div className="col-span-1 w-2/3">
                <p className="mx-8">
                  Tenetur et est enim sed quas amet voluptatem inventore. Corrupti ut itaque nam delectus ratione nisi. Doloribus quo et aut voluptatum impedit tenetur.
                  Distinctio possimus nulla vitae. Itaque ea qui in vel aperiam nihil sed sed debitis. Fugit accusantium et eos possimus deleniti voluptate. Sint sit eius.
                </p>
                <div className="text-center">
                  <WhitePillButton 
                    size="sm"
                    text="COMING SOON"
                    padding="px-8 mt-8 "
                  />
                </div>
              </div>
            </div>
          </div>

          <Footer {...ambassador} />
        </>
    );
};

export default Home;
