import NavBar from "../components/Banners/navbar";
import logo from "../assets/logo.png"

export default function About() {
  return (
    <>
        <div className="mx-8">
            <div className="row">
                <div className="col-lg-7">
                    <img className="h-10" src={logo} alt="..."/>
                </div>
                <div className="col-lg-5 my-auto">
                    <h2 className="sideZoomImgText">Schefs is a mission-driven social platform by and for college students to facilitate and participate in live, themed conversations with peers. </h2><br /><br />
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6">
                    <h2>What is Schefs?</h2>
                    <p>By encouraging active and participatory engagement as a catalyst for meaningful interactions, depthful community building, and creative collaboration, we strive to knock down barriers to knowledge and ideas by facilitating peer to peer learning spaces on topics that young people care about.</p>
                </div>
                <div className="col-lg-6">
                    <h2>How does it work?</h2>
                    <p>Any undergraduate student can host or attend a 1hr conversation on a particular topic of their choice via video chat with up to 7 other students from schools across the globe. Each session includes a distinct and self curated introduction to a specific theme by the host and then moves into an open discussion among all attendees.</p>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6">
                    <h2>Who is Schefs for?</h2>
                    <p>To be a Schefs participant (host or guest), you don’t have to be an expert, but rather an enthusiast. All you need is an appetite, an enthusiasm for discussion and participation and listening and learning. All Schefs participants must be enrolled in (or taking time off from) some undergraduate university.</p>
                </div>
                <div className="col-lg-6">
                    <h2>What does Schefs value?</h2>
                    <p>Schefs creates, heralds, and values a passion-driven information exchange through peer-to-peer learning. It's a network for students to share their knowledge, engage in face to face dialogue with peers, and effectively participate in the creation of an open-source collective intelligence of our generation. In doing so, Schefs pushes up against passive, asynchronous, and shallow interactions on existing social networks.</p>
                </div>
            </div>

            <div className="container-wrapper">
                <div id="webHostInterest">
                    <div className="d-flex justify-content-center">
                        <h2>Interested in potentially hosting an event in the future? Fill out this quick form and we’ll keep you in the loop.</h2>
                    </div>
                </div>
            </div>
            <div id="mobileHostInterest">
                <div className="d-flex justify-content-center">
                    <p>Interested in potentially hosting an event in the future? Fill out this quick form and we’ll keep you in the loop.</p>
                </div>
            </div>

            <div className="row">    
                <div className="col-sm-5">   
                    <h2>What people are saying:</h2>     
                </div>
            </div>

            <div className="row">    
                <div className="col-sm-5">   
                    <div className="col-sm-7 my-auto">
                        <h2>Nia H.R.</h2>
                        <p>Barnard College '21</p>
                    </div>
                    <div className="col">                            
                        <p><b>Event attended:</b> Cryptography and Human Rights</p>
                        <p>"I had such a great experience attending this event. I came in with little to no knowledge ab cryptography and I feel like I left the session with so much new information as well as more things to consider/look into. It even inspired me to start listening to a new podcast! The host was a great facilitator and discussion flowed easily. Everyone had valuable things to contribute and I think we all learned a lot from each other."</p>                       
                    </div>
                    <div className="col-sm-7 my-auto">
                        <h2>Nastassia Maes</h2>
                        <p>Sciences Po '20</p>
                    </div>
                    <div className="col">                            
                        <p><b>Event attended:</b> Art, Human Rights and Social Justice: Creative Paths to Healing</p>
                        <p>"I had a wonderful time discussing the power(s) of art, art's ties to human rights and social justice, and the projects that the two hosts had worked/are working on, which are related to these questions. The experience was lovely because we were a small group, and while the two hosts asked directions and occasionally acted as moderators, they also very much encouraged a horizontal format of discussion. Therefore, we, as participants, were encouraged to come up with our own questions and to mention anything that popped into our heads. Overall, I loved my first experience with Schefs and I think it is a great platform!"</p>                       
                    </div>
                    <div className="col-sm-7 my-auto">
                        <h2>Elon Collins</h2>
                        <p>Brown University, '23</p>
                    </div>
                    <div className="col">                            
                        <p><b>Event hosted:</b> A Threesome You Don't Want: You, Sex, and Societal Pressure</p>
                        <p>"It was fantastic!! As a host, I was worried that the conversation wouldn't flow or that things would be awkward, but we had such an amazing group. Everyone was eager to participate, and we got great feedback at the end. Overall, the event was immensely successful."</p>
                    </div>
                </div>
            </div>
            <div className="col-sm-5">
                <div className="col-sm-7 my-auto">
                    <h2>Bella B</h2>
                    <p>Columbia University '22</p>
                </div>
                <div className="col">                            
                    <p><b>Event Hosted: </b>Performance as Protest</p>
                    <p>"Together we explored how performance and protest overlap, intertwine, and inspire. Over the course of our conversation, we explored the work of Pope.L., Kia LaBeija, and Marina Abromavić. I am grateful for the space Schefs offers to ponder, question and seek. Moreover, in the midst of a pandemic it is the perfect way to meet new people. I look forward to hosting again:)"</p>
                </div>
                <div className="col-sm-7 my-auto">
                    <h2>Nate Jones</h2>
                    <p>Columbia University '22</p>
                </div>
                <div className="col">                            
                    <p><b>Event hosted: </b>Dramaturgies for Dystopias</p>
                    <p>"I learned more from this event than I did from online class at an Ivy League university. It was so fulfilling to come together with so many smart, young people, and to share my quarantine passion project. These are ideas that I have been screaming to the walls of my quarantined life, but now they've been shared, elaborated on, challenged. It was incredible."</p>
                </div>
                <div className="col-sm-7 my-auto">
                    <h2>Amira Stone</h2>
                    <p>NYU '21</p>
                </div>
                <div className="col">                            
                    <p><b>Event hosted: </b>Talking With Dreams</p>
                    <p>"Wonderful event. Was lovely to hold an intentional space in which all involved had an interest in the topic discussed. Everybody contributed unique ideas and questions. I already knew several attendees, but even then I got to access unique parts of their character and thoughts because the topic at hand was quite particular. It's really special to "gather" with people who all relate through a topic of interest. A great way to deepen present relationships or foster new ones."</p>
                </div>
            </div>
        </div>
    </>
  );
};
