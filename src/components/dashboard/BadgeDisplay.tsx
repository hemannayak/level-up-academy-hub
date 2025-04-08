
import { Award, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Badge {
  id: number;
  title: string;
  description: string;
  icon: string;
  dateEarned: string | null;
  isLocked: boolean;
}

interface Props {
  badges: Badge[];
}

const BadgeDisplay = ({ badges }: Props) => {
  const earnedBadges = badges.filter((badge) => !badge.isLocked);
  const lockedBadges = badges.filter((badge) => badge.isLocked);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Award className="h-5 w-5 text-levelup-purple mr-2" />
          <h2 className="text-xl font-bold">Your Achievements</h2>
        </div>
        <div className="text-sm text-levelup-gray">
          <span className="font-medium text-levelup-purple">{earnedBadges.length}</span> of {badges.length} earned
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-4">Earned Badges</h3>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <BadgeItem key={badge.id} badge={badge} />
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
          <h3 className="font-bold mb-4">Badges to Unlock</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {lockedBadges.map((badge) => (
              <BadgeItem key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BadgeItem = ({ badge }: { badge: Badge }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`p-4 rounded-lg text-center ${badge.isLocked ? 'bg-gray-100 opacity-60' : 'bg-levelup-light-purple/30'}`}>
            <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${badge.isLocked ? 'bg-gray-200' : 'bg-levelup-light-purple'}`}>
              {badge.isLocked ? (
                <span className="text-gray-400 text-2xl">🔒</span>
              ) : (
                <span className="text-2xl">{badge.icon}</span>
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
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-medium">{badge.title}</p>
          <p className="text-sm text-levelup-gray">{badge.description}</p>
          {badge.isLocked && (
            <div className="mt-2 text-xs flex items-center text-amber-600">
              <Info className="h-3 w-3 mr-1" /> Complete requirements to unlock
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeDisplay;
