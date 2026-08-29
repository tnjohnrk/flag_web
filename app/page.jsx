import HomeHero from "./components/HomeHero";
import HeroSection from "./components/HeroSection";
import HomeActionButtons from "./components/HomeActionButtons";
import ImportantAnnouncement from "./components/ImportantAnnouncement";
import YoutubeVideos from "./youtube/page";
import WatchOurSongs from "./watchoursongs/page";
import JoinUsSunday from "./components/JoinUsSunday";
import DonateUs from "./donateus/page";

export default function Home() {
  return (
    <>
      <HeroSection>
        <HomeHero />
      </HeroSection>
      <HomeActionButtons />
      <ImportantAnnouncement />
      <YoutubeVideos />
      <WatchOurSongs />
      <JoinUsSunday />
      <DonateUs />
    </>
  );
}
