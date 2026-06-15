function SubjectStatsCont(){
    return<div>
        <h2>📘 Subject Performance</h2>
        <div className="subject-grid">
            <div className="subject-card">
                <h3>Mathematics</h3>
                <p>Best:{userData.subjectStats?.mathematics?.averageScore || 0}</p>
            </div>
        </div>

    </div>
}
export default SubjectStatsCont