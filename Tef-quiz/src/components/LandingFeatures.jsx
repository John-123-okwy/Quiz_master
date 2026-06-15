import { BarChart3, BookOpen, Brain, Clock, Target, Trophy } from "lucide-react"

function LandingFeatures(){
    return<section className="features " id="features">
        <h2>Why Choose QuizMaster?</h2>
        <div className="feature-grid">
            <div className="feature-card">
                <BookOpen/>
                <h3>Subject Quizzes</h3>
            </div>
            <div className="feature-card">
                <Trophy/>
                <h3>Leaderboards</h3>
            </div>
            <div className="feature-card">
                <BarChart3/><h3>Analytics</h3>
            </div>
            <div className="feature-card">
                <Target/><h3>Progress Tracking</h3>
            </div>
            <div className="feature-card">
                <Brain/><h3>Smart Learning</h3>
            </div>
            <div className="feature-card">
                <Clock/><h3>Timed Quizzes</h3>
            </div>
        </div>

    </section>
}
export default LandingFeatures