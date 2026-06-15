function RecentActivity({history}) {

    //=================format Activity Time======================//
    function formatActivityTime(date){

        if(!date){
            return "Unknown Time"
        }
        const now=new Date();
        const activityDate=new Date(date);
        const diffInSeconds=Math.floor((now -activityDate)/1000);
        if(diffInSeconds < 60){
            return "Just now";
        }
        const minutes=Math.floor(diffInSeconds/60);
        if(minutes < 60){
            return `${minutes} mins ago`
        }
        const hours=Math.floor(minutes/60)
        if(hours < 24){
            return`${hours} hours ago`
        }
        const days=Math.floor(hours/24)
        if(days===1){
            return "Yesterday"
        }
        return `${days} days ago`
    }
  return (
    <section className="recent-activity">
      <h2>Recent Activity</h2>

      { history.length ===0 ?(<div className="empty-activity">No recent activity</div>) :(history.slice(0, 5).map((quiz) => (
        <div key={quiz.id} className="activity-item">
          <div>
            <h4>{quiz.subject}</h4>
            <p> Percentage Score:{quiz.score}%</p>
            <p>Point:{quiz.points}/{quiz.totalPoints}</p>
          </div>
          <span>Date:{new Date(quiz.submittedAt).toLocaleString()}</span>
          <span>Time: {formatActivityTime(quiz.submittedAt)}</span>
        </div>
      )) )}
    </section>
  );
}
export default RecentActivity;
