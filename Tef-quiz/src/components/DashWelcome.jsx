function DashWelcome({currentUser,streak}){
    return <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome, {currentUser.displayName}</h1>
            <p>
              Continue your learning journey and improve your performace across
              all subjects
            </p>
          </div>
          <div className="streak-card">
            <span className="streak-icon">🔥</span>
            <div>
              <h3>Current streak</h3>
              <p>{streak} days</p>
            </div>
          </div>
        </div>
      </section>
}
export default DashWelcome