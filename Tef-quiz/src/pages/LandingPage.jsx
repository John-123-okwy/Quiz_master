/*import { Link } from "react-router-dom";
import { Home, Clock } from "lucide-react";
import NavigationBar from "../NavigationBar";
import Hero from "../Hero";
import Features from "../Features";
import FeaturesCards from "../FeaturesCards";
import ExploreSubjects from "../ExploreSubjects";
import SubjectCards from "../SubjectCards";

import AboutDetails from "../AboutDetails";
import AboutUs from "../AboutUs";
import FooterBox from "../FooterBox";

function LandingPage() {
  return (
    <div>
      <NavigationBar />
      <Hero />
      <Features />
      <FeaturesCards />
      <div className="Exp-Sub">
        <ExploreSubjects />
        <SubjectCards />
      </div>
      <FooterBox />
      <AboutUs />
      <Link to="/login">Get Started!</Link>
      <Home size={20} color="purple" />
      <Clock size={20} color="purple" />
    </div>
  );
}

export default LandingPage;*/

import { Link } from "react-router-dom";
import LandingNavBar from "../components/LandingNavBar";
import LandingHero from "../components/LandingHero";
import LandingStats from "../components/LandingStats";
import LandingFeatures from "../components/LandingFeatures";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import LandingFooter from "../components/LandingFooter";

function LandingPage() {
  return (
    <div className="main-landing-page">
      <LandingNavBar />
      <LandingHero />
      <LandingStats />
      <LandingFeatures />
      <HowItWorks />
      <CTA />
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
