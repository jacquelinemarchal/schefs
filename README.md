# schefs v2!!!
A next.js web app built with node, postgres, tailwind, express. <br>
by jackie and chris
 
Frontend: 
Jackie built the majority of the front end of the site using tailwind CSS and next js. Next js function getServerSideProps is used in the dynamic eid pages, which generate the pages for every event. Given an eid, the event information page will be located at www.schefs.us/events/[eid]. The only other dynamic route is for the eventbuilder, so that admin users can edit pending events. 


Chris build the myevents.js page, which displays a user's events - past and upcoming. A user can find attendees of events they have already gone to, and if that user has made their email public, can contact them. 

Backend:
Chris developed a RESTful API using express and node js. src > routes contains the five main API routes: events, index, openmind, thumbnail, and users. There is complete documentation in these files. 
Chris also developed a custom scheduler which utilizes the Schefs gcalendar and zoom to schedule events. He used material UI in eventbuilder.js to generate the front end of the scheduler, and handles the actual scheduling using endpoints (Which?? im p sure this is right @chris).

The website is hosted on a digital ocean server using nginx and a goDaddy domain. 

Authentication: We used firebase authentication, and built a custom interface under src > components > Auth. 