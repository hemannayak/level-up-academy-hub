
import { useState, useEffect } from "react";
import { Award, Lock, Star, Trophy, Medal } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type Achievement = {
  id: number;
  name: string;
  description: string;
  xpRequired: number;
  icon: React.ReactNode;
};

interface Props {
  userXP: number;
}

const AchievementsDisplay = ({ userXP }: Props) => {
  // Define achievements with XP requirements
  const achievements: Achievement[] = [
    { 
      id: 1, 
      name: "First Steps", 
      description: "Start your learning journey", 
      xpRequired: 10, 
      icon: <Star className="h-5 w-5" />
    },
    { 
      id: 2, 
      name: "Knowledge Seeker", 
      description: "Complete your first course", 
      xpRequired: 50, 
      icon: <Star className="h-5 w-5" /> 
    },
    { 
      id: 3, 
      name: "Dedicated Learner", 
      description: "Reach 100 XP", 
      xpRequired: 100, 
      icon: <Medal className="h-5 w-5" /> 
    },
    { 
      id: 4, 
      name: "Expert Status", 
      description: "Complete 5 courses", 
      xpRequired: 250, 
      icon: <Trophy className="h-5 w-5" /> 
    },
    { 
      id: 5, 
      name: "Master Scholar", 
      description: "Reach 500 XP", 
      xpRequired: 500, 
      icon: <Trophy className="h-5 w-5" /> 
    }
  ];

  // Check if achievement is unlocked based on user's XP
  const isAchievementUnlocked = (achievement: Achievement) => {
    return userXP >= achievement.xpRequired;
  };

  const unlockedCount = achievements.filter(a => isAchievementUnlocked(a)).length;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Award className="h-5 w-5 text-levelup-purple mr-2" />
          <h2 className="text-xl font-bold text-levelup-purple">Your Achievements</h2>
        </div>
        <div className="text-sm text-levelup-gray">
          <span className="font-medium text-levelup-purple">{unlockedCount}</span> of {achievements.length} earned
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-levelup-purple">Your XP</span>
          <span className="text-levelup-gray">{userXP} XP</span>
        </div>
        <Progress value={(userXP / 500) * 100} className="h-2" />
      </div>

      <TooltipProvider>
        <div className="space-y-4">
          {achievements.map((achievement) => {
            const isUnlocked = isAchievementUnlocked(achievement);
            return (
              <div 
                key={achievement.id} 
                className={`p-4 rounded-lg border ${isUnlocked ? 'border-levelup-purple bg-purple-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isUnlocked ? 'bg-levelup-purple text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {isUnlocked ? achievement.icon : <Lock className="h-4 w-4" />}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className={`text-sm font-medium ${isUnlocked ? 'text-levelup-purple' : 'text-gray-500'}`}>
                        {achievement.name}
                      </h3>
                      {!isUnlocked && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-2 cursor-help">
                              <Lock className="h-3 w-3 text-gray-400" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Earn {achievement.xpRequired} XP to unlock</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <p className="text-xs text-levelup-gray">{achievement.description}</p>
                    {!isUnlocked && (
                      <div className="mt-2">
                        <div className="text-xs text-levelup-gray mb-1">Progress: {userXP}/{achievement.xpRequired} XP</div>
                        <Progress value={(userXP / achievement.xpRequired) * 100} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default AchievementsDisplay;
