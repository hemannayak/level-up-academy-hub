
import { Trophy, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ActivityTabProps {
  totalMinutes: number;
}

export default function ActivityTab({ totalMinutes }: ActivityTabProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Learning Activity</h3>
        <div className="p-6 bg-gray-50 rounded-lg text-levelup-gray">
          {totalMinutes > 0 ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-lg font-semibold">You've spent {formatTime(totalMinutes)} learning!</p>
                <p className="text-sm mt-1">Keep going to increase your skills and climb the leaderboard.</p>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-levelup-purple">Progress</span>
                  <span className="text-levelup-gray">{totalMinutes}/600 minutes</span>
                </div>
                <Progress 
                  value={(totalMinutes / 600) * 100} 
                  className="h-2 mb-2" 
                />
                <p className="text-xs text-right text-levelup-gray">
                  {600 - totalMinutes} minutes until next milestone
                </p>
              </div>
              
              <div className="flex justify-center mt-6">
                <Link to="/leaderboard">
                  <Button className="flex items-center gap-2 bg-levelup-purple hover:bg-levelup-purple/90">
                    <Trophy className="h-4 w-4" />
                    <span>View Leaderboard</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <Award className="h-12 w-12 mx-auto mb-3 text-levelup-purple/50" />
                <p className="text-lg font-semibold">No learning activity recorded yet.</p>
                <p className="text-sm mt-1">Start a course to track your progress!</p>
              </div>
              
              <div className="flex justify-center mt-6">
                <Link to="/leaderboard">
                  <Button className="flex items-center gap-2 bg-levelup-purple hover:bg-levelup-purple/90">
                    <Trophy className="h-4 w-4" />
                    <span>View Leaderboard</span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
