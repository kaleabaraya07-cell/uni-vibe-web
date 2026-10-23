import Stories from "../../components/Stories/Stories";
import VibeFeed from "../../components/VibeFeed/VibeFeed";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <div className="home__content">
        <Stories />
        <VibeFeed />
      </div>
    </div>
  );
}

export default Home;
