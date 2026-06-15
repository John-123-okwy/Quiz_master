import { CircleHelp, ClipboardList, TrendingUp, Trophy } from "lucide-react";
import StatCards from "./StatsCard";

function StatsCardCont({quizzesTaken,averageScore,
        bestScore,
        questionAnswered, streak,totalPointsScored}) {
  return (
    <section className="stats-section">
      
      <StatCards icon={<ClipboardList />} value={quizzesTaken} title="Quizzes Taken" />
      <StatCards icon={<TrendingUp />} value={`${averageScore} %`} title="Average Score" />
      <StatCards icon={<Trophy />} value={`${bestScore} %`} title="Best Score" />
      <StatCards icon={<CircleHelp />} value={questionAnswered} title="Questions Answered" />
      <StatCards icon={<CircleHelp />} value={totalPointsScored} title="Total Points Scored" />
    </section>
  );
}
export default StatsCardCont;
