import '../styles/globals.css';
import NavBar from "../components/Banners/navbar";
import Banner from "../components/Banners/banner";
import CardButton from "../components/Card/cardbutton"
import Card from "../components/Card/card"
import {useState} from "react"

const App = ({ Component, pageProps }) => {
    const [openCard, setOpenCard] = useState(false)

    let hostBanner = {
        left:"Host & attend small group themed conversations via Zoom on any topic. By & for college students.",
        buttonText: "HOST AN EVENT",
        link:"google.com",
    }
    let scroll = {
        scrollShadow: false
    }

    return (
        <div>
            <Banner {...hostBanner}/>
            <NavBar {...scroll}/>
            <CardButton function={() => setOpenCard(true)}/>

            <div className={(openCard ? 'block' : 'hidden')}>
                <Card function={() => setOpenCard(false)}/>
            </div>
            
            <div className={(openCard ? 'overflow-hidden fixed' : '')}>
                <Component {...pageProps}/>
            </div>
        </div>
    );
};

export default App;

// Pass Card State pageProps={pageProps} closeCardF={() => setOpenCard(false)}