
import { Award, Info, Lock, UserPlus, Trophy, BookOpen, GraduationCap, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface Badge {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  dateEarned: string | null;
  isLocked: boolean;
  xpRequired: number;
}

interface Props {
  userXP: number;
}

const BadgeDisplay = ({ userXP = 0 }: Props) => {
  // Get current date for the signup badge
  const today = new Date();
  const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  
  // Define all badges with their requirements
  const allBadges: Badge[] = [
    {
      id: 1,
      title: "Welcome",
      description: "Successfully joined LevelUp Learning",
      icon: <UserPlus className="h-6 w-6 text-white" />,
      dateEarned: formattedDate, // Only this badge is earned initially
      isLocked: false, // Only this badge is unlocked initially
      xpRequired: 0
    },
    {
      id: 2,
      title: "Fast Learner",
      description: "Completed first course module",
      icon: <Zap className="h-6 w-6 text-white" />,
      dateEarned: null,
      isLocked: true,
      xpRequired: 50
    },
    {
      id: 3,
      title: "Knowledge Seeker",
      description: "Completed your first course",
      icon: <BookOpen className="h-6 w-6 text-white" />,
      dateEarned: null,
      isLocked: true,
      xpRequired: 100
    },
    {
      id: 4,
      title: "Dedicated Student",
      description: "Reached the 250 XP milestone",
      icon: <GraduationCap className="h-6 w-6 text-white" />,
      dateEarned: null,
      isLocked: true,
      xpRequired: 250
    },
    {
      id: 5,
      title: "Learning Master",
      description: "Reached the 500 XP milestone",
      icon: <Trophy className="h-6 w-6 text-white" />,
      dateEarned: null,
      isLocked: true,
      xpRequired: 500
    }
  ];
  
  // Filter badges based on locked status
  const earnedBadges = allBadges.filter((badge) => !badge.isLocked);
  const lockedBadges = allBadges.filter((badge) => badge.isLocked);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Award className="h-5 w-5 text-levelup-purple mr-2" />
          <h2 className="text-xl font-bold text-levelup-purple">Your Achievements</h2>
        </div>
        <div className="text-sm text-levelup-gray">
          <span className="font-medium text-levelup-purple">{earnedBadges.length}</span> of {allBadges.length} earned
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-levelup-purple">Your XP</span>
          <span className="text-levelup-gray">{userXP} XP</span>
        </div>
        <Progress value={(userXP / 500) * 100} className="h-2" />
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-4 text-levelup-purple">Earned Badges</h3>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <BadgeItem key={badge.id} badge={badge} userXP={userXP} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded-lg text-levelup-gray">
            Complete courses and activities to earn badges
          </div>
        )}
      </div>

      {lockedBadges.length > 0 && (
        <div>
          <h3 className="font-bold mb-4 text-levelup-purple">Badges to Unlock</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {lockedBadges.map((badge) => (
              <BadgeItem key={badge.id} badge={badge} userXP={userXP} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BadgeItem = ({ badge, userXP }: { badge: Badge, userXP: number }) => {
  const progress = badge.isLocked ? Math.min((userXP / badge.xpRequired) * 100, 100) : 100;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`p-4 rounded-lg text-center ${badge.isLocked ? 'bg-gray-100 opacity-60' : 'bg-levelup-light-purple/30'}`}>
            <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${badge.isLocked ? 'bg-gray-200' : 'bg-levelup-light-purple'}`}>
              {badge.isLocked ? (
                <Lock className="h-5 w-5 text-gray-400" />
              ) : (
                badge.icon
              )}
            </div>
            <h4 className={`text-sm font-medium ${badge.isLocked ? 'text-levelup-gray' : 'text-levelup-purple'}`}>
              {badge.title}
            </h4>
            {!badge.isLocked && badge.dateEarned && (
              <p className="text-xs text-levelup-gray mt-1">
                Earned on {badge.dateEarned}
              </p>
            )}
            {badge.isLocked && (
              <div className="mt-2">
                <div className="text-xs text-levelup-gray mb-1">{userXP}/{badge.xpRequired} XP</div>
                <Progress value={progress} className="h-1" />
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-medium">{badge.title}</p>
          <p className="text-sm text-levelup-gray">{badge.description}</p>
          {badge.isLocked && (
            <div className="mt-2 text-xs flex items-center text-amber-600">
              <Info className="h-3 w-3 mr-1" /> Need {badge.xpRequired} XP to unlock
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeDisplay;
