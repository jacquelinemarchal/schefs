import '../styles/globals.css';
import NavBar from "../components/Banners/navbar";
import Banner from "../components/Banners/banner";

const App = ({ Component, pageProps }) => {
  
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
        <Component {...pageProps} />
      </div>
    );
};

export default App;
