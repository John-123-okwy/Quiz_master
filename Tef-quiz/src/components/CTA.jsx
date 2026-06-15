import { Link } from "react-router-dom"

function CTA (){
    return<section className="cta">
        <h2>Ready To Improve Your Performance?</h2>
        <p>Join thousands of students using QuizMaster</p>

        <Link to="/login">
        <button className="cta-btn">Get Started</button></Link>
    </section>
}
export default CTA