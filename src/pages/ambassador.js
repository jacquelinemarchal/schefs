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
            <div id="ambass-info-main">
                <div id="ambass-info-left">
                    <div id="ambass-info-left-content">
                        <h1>Interested in becoming a Schefs Ambassador?</h1>
                        <a class="typeform-share link" href="https://schefs.typeform.com/to/rA23QlDM" data-mode="popup" target="_blank"><button type="button" style="margin-top:10px; font-size:20px; border-radius: 2rem;" class="btn btn-outline-dark reserve">    APPLY    </button></a><script> (function() { var qs,js,q,s,d=document, gi=d.getElementById, ce=d.createElement, gt=d.getElementsByTagName, id="typef_orm_share", b="https://embed.typeform.com/"; if(!gi.call(d,id)){ js=ce.call(d,"script"); js.id=id; js.src=b+"embed.js"; q=gt.call(d,"script")[0]; q.parentNode.insertBefore(js,q) } })() </script>
                        <br><br>
                        <i class="material-icons" style="vertical-align:bottom; margin-bottom: 17px">calendar_today</i>
                        <p style="background-color: yellow; display: inline-block; font-size: 110%;">Happening on Sunday</p><br>
                        <a href="/ambassador.html" style="color: black;">
                            <img src="https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/ambassador%2Fambassador.jpg?alt=media&token=87d93bae-5b0e-435c-af5e-dd99ee56bfb7" alt="..." id="ambass-info-thumb">
                            <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">Ambassador Town Hall #5</p> 
                            <p style="font-size:16px;">Sunday, March 21st @ 7 pm EST<br>Hosted by the Schefs team</p>
                        </a>
                    </div>
                </div>
                <div id="ambass-info-right">
                    <h2>What is the ambassador program?</h2><br>
                    <p>The Schefs ambassador program is a dedicated, engaged network of college students committed to tapping into their communities to bring people together, lead the next generation’s thinking, and catalyze conversations. The ambassadors scout and encourage passionate students they know to join Schefs, with the larger goal of helping to aggregate the intelligence of people our age and creating intentional spaces for us to learn from one another.</p><br>
                    <p>Being a Schefs ambassador isn’t just about bringing people onto Schefs, it’s about everything that Schefs represents. If you believe in creating deeper and non-hierarchical ways for students to meet friends and collaborators and inspire one another through a mission driven social platform that values knowledge, passion, contribution, diverse perspectives, and community… you’re the right fit.</p>
                    <br><br>
                    <h2>What will I do as a Schefs ambassador?</h2><br>
                    <p>Your role will be to bring hosts and guests onto the platform by being a liaison between Schefs and your various communities–school groups, friends, other projects and organizations you are a part of, etc. You help identify the passionate, interesting young people you know and get them to share their enthusiasm toward various topics with new people by hosting and attending conversations through Schefs. We need you to help exponentially grow the number of sharp young minds on the platform to ensure we have as many ideas, subjects, and perspectives as we possibly can.</p>
                    <br><br>
                    <h2>Who makes a good ambassador?</h2><br>
                    <p>Someone who believes in the Schefs mission of connection through conversation and peer to peer learning. Someone who is plugged into their community and knows passionate, dedicated, interesting people. Someone who is excited.</p>
                </div>
            </div>

            <div id="ambass-info-mobile">
                <div style="margin-top: 4rem; text-align: center;">
                    <h1 style="padding-left: 1rem; padding-right: 1rem;">Interested in becoming a Schefs Ambassador?</h1>
                    <a class="typeform-share link" href="https://schefs.typeform.com/to/rA23QlDM" data-mode="popup" target="_blank"><button type="button" style="margin-top:20px; font-size: 14px;" class="btn btn-outline-dark">APPLY</button></a><script> (function() { var qs,js,q,s,d=document, gi=d.getElementById, ce=d.createElement, gt=d.getElementsByTagName, id="typef_orm_share", b="https://embed.typeform.com/"; if(!gi.call(d,id)){ js=ce.call(d,"script"); js.id=id; js.src=b+"embed.js"; q=gt.call(d,"script")[0]; q.parentNode.insertBefore(js,q) } })() </script>
                    <br><br><br>
                    <i class="material-icons" style="vertical-align:bottom; margin-bottom: 17px">calendar_today</i>
                    <p style="background-color: yellow; display: inline-block; font-size: 110%;">Happening this December</p><br>
                    <a href="/ambassador.html" style="color: black;">
                        <img src="https://firebasestorage.googleapis.com/v0/b/schefs.appspot.com/o/ambassador%2Fambassador.jpg?alt=media&token=87d93bae-5b0e-435c-af5e-dd99ee56bfb7" alt="..." id="ambass-info-thumb">
                        <p style="margin-top: 1.2rem; margin-bottom: 0.8rem;">Ambassador Town Hall #4</p> 
                        <p style="font-size:16px;">Sunday, January 17th @ 7 pm EDT<br>Hosted by the Schefs team</p>
                    </a>
                </div>
                <div style="padding-left: 2rem; padding-right: 2rem;">
                    <br>
                    <h2>What is the ambassador program?</h2>
                    <p>The Schefs ambassador program is a dedicated, engaged network of college students committed to tapping into their communities to bring people together, lead the next generation’s thinking, and catalyze conversations.</p>
                    <p>Being a Schefs ambassador isn’t just about bringing people onto Schefs, it’s about everything that Schefs represents. If you believe in creating deeper and non-hierarchical ways for students to meet friends and collaborators and inspire one another through a mission driven social platform that values knowledge, passion, contribution, diverse perspectives, and community… you’re the right fit.</p>
                    <br><br>
                    <h2>What will I do as a Schefs ambassador?</h2>
                    <p>Your role will be to bring hosts and guests onto the platform by being a liaison between Schefs and your various communities–school groups, friends, other projects and organizations you are a part of, etc. You help identify the passionate, interesting young people you know and get them to share their enthusiasm toward various topics with new people by hosting and attending conversations through Schefs. We need you to help exponentially grow the number of sharp young minds on the platform to ensure we have as many ideas, subjects, and perspectives as we possibly can.</p>
                    <br><br>
                    <h2>Who makes a good ambassador?</h2>
                    <p>Someone who believes in the Schefs mission of connection through conversation and peer to peer learning. Someone who is plugged into their community and knows passionate, dedicated, interesting people. Someone who is excited.</p>
                </div>
            </div>
        </>
    )
};

export default Ambassador;