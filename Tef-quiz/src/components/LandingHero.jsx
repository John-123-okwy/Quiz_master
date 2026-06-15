import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import { Trophy } from "lucide-react";

function LandingHero() {
  //=========== Hereo Slider=====================//
  const slides = [
    {
      image: hero1,
      title: "Adequate Preparation",
      text: "Following our structured study plan...  ",
    },
    {
      image: hero2,
      title: "Take Quiz With Confidence",
      text: "By answering exam-type questions",
    },
    {
      image: hero3,
      title: "Success Gauranteed!",
      text: "Excellence...our trade mark",
    },
  ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  /////////////////////////////
  return (
    <section className="landing-hero">
      <div className="landing-hero-content">
        <span className="hero-badge">Trusted By Students</span>
        <h1>Master Your Exams With Confidence</h1>
        <p>
          Practice real exam questions, track your performance, and compete on
          leaderboard
        </p>
        <div className="hero-buttons">
          <Link to="/login">
            <button className="start-learning-btn">Start Learning</button>
          </Link>
          <Link to="/leaderboard">
            <button className="secondary-btn">Leaderboard</button>
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <div className="image-message">
          <h2>{slides[currentImage].title}</h2>
          <p>{slides[currentImage].text}</p>
        </div>
        <img
          key={currentImage}
          src={slides[currentImage].image}
          alt="Student Taking Quiz"
        />
        <div className="slider-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={index === currentImage ? "active-dot" : ""}
            />
          ))}
        </div>
      </div>
      <div className="floating-card card-one">
        <Trophy size={20} color="purple"/>
        <div>
          <b>1000+</b>
          <span>Students</span>
        </div>
      </div>
      <div className="floating-card card-two">
        📈
        <div>
          <b>95%</b>
          <span>Success</span>
        </div>
      </div>
    </section>
  );
}

export default LandingHero;
