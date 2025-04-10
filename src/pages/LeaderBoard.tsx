import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Medal, Trophy, Users, Lock, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

type LeaderboardUser = {
  id: string;
  full_name: string | null;
  xp: number;
  rank: number;
};

type Achievement = {
  id: number;
  name: string;
  description: string;
  xpRequired: number;
  icon: React.ReactNode;
};

const LeaderBoard = () => {
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [userXP, setUserXP] = useState(0);

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

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name");
        
        if (error) {
          console.error("Error fetching profiles:", error);
          setLoading(false);
          return;
        }

        const mockRankedUsers = data.map((profile, index) => {
          if (user && profile.id === user.id) {
            return {
              id: profile.id,
              full_name: profile.full_name,
              xp: 0,
              rank: data.length
            };
          }
          
          return {
            id: profile.id,
            full_name: profile.full_name,
            xp: 100 - index * 5,
            rank: index + 1
          };
        });

        const sortedUsers = [...mockRankedUsers].sort((a, b) => b.xp - a.xp)
          .map((user, index) => ({
            ...user,
            rank: index + 1
          }));

        setLeaderboardUsers(sortedUsers);
        
        if (user) {
          const currentUser = sortedUsers.find(u => u.id === user.id);
          if (currentUser) {
            setUserXP(currentUser.xp);
          }
        }
      } catch (error) {
        console.error("Error in leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [user]);

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" aria-label="Gold" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" aria-label="Silver" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-700" aria-label="Bronze" />;
      default:
        return null;
    }
  };

  const getUserPosition = () => {
    if (!user) return "Not logged in";
    const currentUser = leaderboardUsers.find(u => u.id === user.id);
    if (!currentUser) return "Not ranked yet";
    return `#${currentUser.rank}`;
  };

  const isAchievementUnlocked = (achievement: Achievement) => {
    return userXP >= achievement.xpRequired;
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-levelup-purple">Leaderboard</h1>
                <p className="text-levelup-gray mt-2">See how you rank against other learners</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-sm font-medium">Your Position</p>
                <p className="text-2xl font-bold text-levelup-purple">{getUserPosition()}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="p-6 bg-gradient-to-r from-purple-100 to-indigo-50">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-levelup-purple" />
                  <h2 className="text-xl font-semibold text-levelup-purple">XP Rankings</h2>
                </div>
                <p className="text-levelup-gray mt-1">Learn more, climb higher!</p>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>XP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          Loading leaderboard...
                        </TableCell>
                      </TableRow>
                    ) : leaderboardUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          No users found. Start learning to be the first!
                        </TableCell>
                      </TableRow>
                    ) : (
                      leaderboardUsers.map((leaderboardUser) => (
                        <TableRow 
                          key={leaderboardUser.id} 
                          className={`${leaderboardUser.id === user?.id ? 'bg-purple-50' : ''}`}
                        >
                          <TableCell>
                            <div className="flex items-center">
                              {getMedalIcon(leaderboardUser.rank)}
                              <span className={`ml-2 ${leaderboardUser.rank <= 3 ? 'font-bold' : ''}`}>
                                {leaderboardUser.rank}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700">
                                {leaderboardUser.full_name ? leaderboardUser.full_name.charAt(0).toUpperCase() : <Users className="h-4 w-4" />}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {leaderboardUser.full_name || "Anonymous User"}
                                  {leaderboardUser.id === user?.id && " (You)"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium text-gray-900">
                              {leaderboardUser.xp} XP
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-purple-100 to-indigo-50">
                <div className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-levelup-purple" />
                  <h2 className="text-xl font-semibold text-levelup-purple">Your Achievements</h2>
                </div>
                <p className="text-levelup-gray mt-1">Unlock badges as you learn</p>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-levelup-purple">Your XP</span>
                    <span className="text-levelup-gray">{userXP} XP</span>
                  </div>
                  <Progress value={(userXP / 500) * 100} className="h-2" />
                </div>

                <div className="space-y-4">
                  <TooltipProvider>
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
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LeaderBoard;
