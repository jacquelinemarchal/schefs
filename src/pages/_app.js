import '../styles/globals.css';
import NavBar from "../components/Banners/navbar";
import Banner from "../components/Banners/banner";
import CardButton from "../components/Card/cardbutton"
import Card from "../components/Card/card"
import {useState, useReducer} from "react"
import ContextState from "../context/index"

const App = ({ Component, pageProps }) => {
    const [openCard, setOpenCard] = useState(false)
   
    return (
        <ContextState page={{Component, pageProps}}/>
    );
};

export default App;
/*
            <div className={(openCard ? 'block' : 'hidden')}>
                <Card function={() => setOpenCard(false)}/>
            </div>*/