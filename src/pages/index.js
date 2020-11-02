import Footer from "../components/Banners/footer"
import EventGrid from "../components/Events/eventgrid"


export default function Home() {

    let ambassador = {
        left:"We’re looking for engaged students to spread the word",
        right:"Learn about becoming a Schefs Ambassador here",
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
