import Footer from "../components/Banners/footer"
import EventGrid from "../components/Events/eventgrid"
import NavBar from "../components/Banners/navbar";

export default function Home() {

    let ambassador = {
        left:"We’re looking for engaged students to spread the word",
        right:"Learn about becoming a Schefs Ambassador ",
        linkText:"here"
      }

  return (
    <>
        <div>
            <EventGrid />
            <Footer {...ambassador} />
        </div>
    </>
  );
};
