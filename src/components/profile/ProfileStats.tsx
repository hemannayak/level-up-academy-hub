
import { Clock, BookOpen, Award } from "lucide-react";

interface ProfileStatsProps {
  totalMinutes: number;
  totalCourses: number;
  totalPoints: number;
}

export default function ProfileStats({ totalMinutes, totalCourses, totalPoints }: ProfileStatsProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatXP = (xp: number) => {
    if (xp === undefined || xp === null) return "0";
    return xp.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-levelup-light-purple/30 p-4 rounded-lg">
        <div className="flex items-center">
          <div className="bg-levelup-light-purple p-2 rounded-full">
            <Clock className="h-5 w-5 text-levelup-purple" />
          </div>
          <div className="ml-3">
            <div className="text-levelup-gray text-sm">Learning Time</div>
            <div className="font-bold">{formatTime(totalMinutes)}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-levelup-light-purple/30 p-4 rounded-lg">
        <div className="flex items-center">
          <div className="bg-levelup-light-purple p-2 rounded-full">
            <BookOpen className="h-5 w-5 text-levelup-purple" />
          </div>
          <div className="ml-3">
            <div className="text-levelup-gray text-sm">Courses Completed</div>
            <div className="font-bold">{totalCourses}</div>
          </div>
        </div>
      </div>
      
      <div className="bg-levelup-light-purple/30 p-4 rounded-lg">
        <div className="flex items-center">
          <div className="bg-levelup-light-purple p-2 rounded-full">
            <Award className="h-5 w-5 text-levelup-purple" />
          </div>
          <div className="ml-3">
            <div className="text-levelup-gray text-sm">XP Earned</div>
            <div className="font-bold">{formatXP(totalPoints)} XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}
