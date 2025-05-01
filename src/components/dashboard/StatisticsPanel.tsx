
import { GraduationCap, Award, Calendar, BookOpen } from "lucide-react";

interface StatisticsPanelProps {
  activeCourses: Array<{id: number; title: string; progress: number; lastActivity: string}>;
  userStats: {
    totalXP: number;
    level: number;
  };
}

const StatisticsPanel = ({ activeCourses, userStats }: StatisticsPanelProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-bold mb-4">Your Stats</h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="bg-levelup-light-purple/50 p-2 rounded-full">
            <GraduationCap className="h-5 w-5 text-levelup-purple" />
          </div>
          <div className="ml-3">
            <div className="text-levelup-gray text-sm">Courses Enrolled</div>
            <div className="font-bold">{activeCourses.length}</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="bg-levelup-light-purple/50 p-2 rounded-full">
            <Award className="h-5 w-5 text-levelup-purple" />
          </div>
          <div className="ml-3">
            <div className="text-levelup-gray text-sm">Badges Earned</div>
            <div className="font-bold">1</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="bg-levelup-light-purple/50 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-levelup-purple" />
          </div>
          <div className="ml-3">
            <div className="text-levelup-gray text-sm">Learning Streak</div>
            <div className="font-bold">{userStats.totalXP > 0 ? '1 day' : '0 days'}</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="bg-levelup-light-purple/50 p-2 rounded-full">
            <BookOpen className="h-5 w-5 text-levelup-purple" />
          </div>
          <div className="ml-3">
            <div className="text-levelup-gray text-sm">Hours Learned</div>
            <div className="font-bold">{userStats.totalXP > 0 ? Math.round(userStats.totalXP / 30) : 0} hours</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
