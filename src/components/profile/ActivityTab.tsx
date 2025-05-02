
import { Trophy, Award, PartyPopper } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";

interface ActivityTabProps {
  totalMinutes: number;
}

export default function ActivityTab({ totalMinutes }: ActivityTabProps) {
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [lastMilestone, setLastMilestone] = useState(0);
  const milestones = [60, 120, 300, 600];
  
  useEffect(() => {
    // Check if a new milestone has been reached
    const milestone = milestones.find(m => totalMinutes >= m && m > lastMilestone);
    
    if (milestone && lastMilestone !== 0) {
      // Show celebration dialog
      setShowMilestoneDialog(true);
      setLastMilestone(milestone);
    } else if (totalMinutes > 0) {
      // Initialize last milestone on first load
      const highestMilestoneReached = [...milestones]
        .reverse()
        .find(m => totalMinutes >= m) || 0;
      
      setLastMilestone(highestMilestoneReached);
    }
  }, [totalMinutes]);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const getNextMilestone = () => {
    return milestones.find(m => m > totalMinutes) || milestones[milestones.length - 1];
  };
  
  const nextMilestone = getNextMilestone();
  const milestoneProgress = (totalMinutes / nextMilestone) * 100;

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
                  <span className="text-levelup-gray">{totalMinutes}/{nextMilestone} minutes</span>
                </div>
                <Progress 
                  value={milestoneProgress} 
                  className="h-2 mb-2" 
                />
                <p className="text-xs text-right text-levelup-gray">
                  {nextMilestone - totalMinutes} minutes until next milestone
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
      
      <Dialog open={showMilestoneDialog} onOpenChange={setShowMilestoneDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <div className="relative">
              <div className="absolute -top-6 -left-4">
                <PartyPopper className="h-10 w-10 text-yellow-500 animate-bounce" />
              </div>
              <div className="absolute -top-6 -right-4">
                <PartyPopper className="h-10 w-10 text-yellow-500 animate-bounce" />
              </div>
            </div>
            <DialogTitle className="text-2xl text-levelup-purple mt-8">
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-levelup-gray">
              You've reached a learning milestone!
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-4">
            <div className="w-24 h-24 mb-4 rounded-full bg-levelup-light-purple flex items-center justify-center animate-scale-in">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-xl font-bold text-levelup-purple">
              {formatTime(lastMilestone)} Milestone
            </h3>
            <p className="text-levelup-gray mt-2 text-center">
              You've dedicated {formatTime(lastMilestone)} to learning on our platform. 
              Keep up the great work!
            </p>
            
            <div className="mt-6">
              <Link to="/leaderboard">
                <Button className="flex items-center gap-2 bg-levelup-purple hover:bg-levelup-purple/90">
                  <Trophy className="h-4 w-4" />
                  <span>View Your Rank</span>
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
