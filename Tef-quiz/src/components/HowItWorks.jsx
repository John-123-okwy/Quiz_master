import { ArrowUp } from "lucide-react";

function HowItWorks() {
  return (
    <section id="how" className="how">
      <h2>How It Works</h2>
      <div className="steps">
        <div className="step">
          <h1>1</h1>
          <p>Create account</p>
        </div>
        <div className="step">
          <h1>2</h1>
          <p>Select Subject</p>
        </div>
        <div className="step">
          <h1>3</h1>
          <p>Take Quiz</p>
        </div>
        <div className="step">
          <h1>4</h1>
          <p>Track Progress</p>
        </div>
      </div>

      <div className="landing-Up-btn">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <ArrowUp size={18} />
        </button>
      </div>
    </section>
  );
}
export default HowItWorks;
