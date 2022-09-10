# [Schefs](https://schefs.us/)
#### We created Schefs with the belief that everybody has something to share, something to learn, and a stake in every conversation. 

The Schefs web app enables a worldwide network of college-age students to host and attend events on a broad range of topics, spanning environmental justice, gloablization, the pandemic, and the future of technology. Through our synchronous discussions, Schefs redefines engagement online as active, participatory and interest-driven.

I (Jackie) spearheaded the development of the Schefs web app and worked as the CTO from March of 2020 until February of 2021. I built this app alongside engineer Chris Wang, who led development of the custom API. During development, I was learning each and every technology utilized in this app independently, with occasional mentorship from career web programmers in my personal network. On the topic of the tech stack, it's worth nothing that Schefs is a react and next.js web app built with node, postgres, tailwind, and express. 

Due to the on-the-job nature of my learning, there are a few notably unwieldy components which no longer represent my personal coding style, or what I would now consider high quality shippable code. I grew tremendously as a programmer through the making of Schefs, and am proud of the 500+ student network we supported during COVID-19. 

#### Below I have outlined specific implementation details of how we created Schefs. 

Frontend: 
Jackie built the majority of the front end of the site using tailwind CSS and next js. Next js function `getServerSideProps` is used in the dynamic eid pages, which generate the pages for every event. Given an eid, the event information page will be located at www.schefs.us/events/[eid]. The only other dynamic route is for the `eventbuilder`, so that admin users can edit pending events. Jackie coded the authentication flow, Open Mind Archive, user's card display, and the mega-form that is the Event Builder. 

Chris build the `myevents.js` page, which displays a user's events - past and upcoming. A user can find attendees of events they have already gone to, and if that user has made their email public, can contact them. 

Backend:
Chris developed a RESTful API using express and node js. src > routes contains the five main API routes: `events`, `index`, `openmind`, `thumbnail`, and `users`. There is complete documentation in these files. 
Chris also developed a custom scheduler which utilizes the Schefs gcalendar and zoom to schedule events. He used material UI in `eventbuilder.js` to generate the front end of the scheduler, and handles the actual scheduling using endpoints.

The website is hosted on a digital ocean server using nginx and a goDaddy domain. 

We used firebase authentication to handle Schefs accounts, and built a custom interface under `src > components > Auth`. 
