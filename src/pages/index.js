import Footer from "../components/footer"
import EventGrid from "../components/eventgrid"


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
