import '../styles/globals.css';
import NavBar from "../components/navbar";
import Banner from "../components/banner";

const App = ({ Component, pageProps }) => {
  
  let hostBanner = {
    left:"Host & attend small group themed conversations via Zoom on any topic. By & for college students.",
    buttonText: "HOST AN EVENT",
    link:"google.com",
  }
    return (
      <div>
        <Banner {...hostBanner}/>
        <NavBar />
        <Component {...pageProps} />
      </div>
    );
};

export default App;
