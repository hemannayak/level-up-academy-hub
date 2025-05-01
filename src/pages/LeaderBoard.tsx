
import { useEffect, useState } from "react";
import { Trophy, Medal, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface LearnerProfile {
  id: string;
  user_id: string;
  total_minutes: number;
  streak_days: number;
  full_name: string | null;
  avatar_url: string | null;
  email: string;
  rank: number;
}

export default function LeaderBoard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LearnerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<LearnerProfile | null>(null);
  
  useEffect(() => {
    fetchLeaderboard();
  }, []);
  
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // First join profiles with learning_time
      const { data, error } = await supabase.rpc('get_leaderboard');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Transform data to include rank
        const rankedData = data.map((item, index) => ({
          ...item,
          rank: index + 1
        }));
        
        setLeaderboard(rankedData);
        
        // Find current user's rank
        const currentUserRank = rankedData.find(item => item.user_id === user?.id) || null;
        setUserRank(currentUserRank);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Use dummy data for now
      const dummyData = generateDummyData();
      setLeaderboard(dummyData);
      
      // Find current user in dummy data
      const currentUserRank = dummyData.find(item => item.user_id === user?.id) || null;
      setUserRank(currentUserRank);
    } finally {
      setLoading(false);
    }
  };
  
  const generateDummyData = (): LearnerProfile[] => {
    const data: LearnerProfile[] = [
      {
        id: '1',
        user_id: 'user1',
        total_minutes: 4500,
        streak_days: 15,
        full_name: 'Alex Johnson',
        avatar_url: null,
        email: 'alex.j@example.com',
        rank: 1
      },
      {
        id: '2',
        user_id: 'user2',
        total_minutes: 3800,
        streak_days: 12,
        full_name: 'Samantha Lee',
        avatar_url: null,
        email: 'sam.lee@example.com',
        rank: 2
      },
      {
        id: '3',
        user_id: 'user3',
        total_minutes: 3400,
        streak_days: 9,
        full_name: 'Michael Chen',
        avatar_url: null,
        email: 'michael.c@example.com',
        rank: 3
      },
      {
        id: '4',
        user_id: 'user4',
        total_minutes: 2900,
        streak_days: 7,
        full_name: 'Taylor Wilson',
        avatar_url: null,
        email: 'taylor.w@example.com',
        rank: 4
      },
      {
        id: '5',
        user_id: 'user5',
        total_minutes: 2500,
        streak_days: 5,
        full_name: 'Jordan Smith',
        avatar_url: null,
        email: 'jordan.s@example.com',
        rank: 5
      }
    ];
    
    // Add current user if they exist
    if (user) {
      data.push({
        id: '99',
        user_id: user.id,
        total_minutes: 1200,
        streak_days: 3,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'You',
        avatar_url: null,
        email: user.email || '',
        rank: 12
      });
    }
    
    return data;
  };
  
  const formatLearningTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    
    return `${hours}h ${minutes % 60}m`;
  };
  
  // Get the medal color based on rank
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500"; // Gold
      case 2:
        return "text-gray-400"; // Silver
      case 3:
        return "text-amber-700"; // Bronze
      default:
        return "text-gray-300";
    }
  };
  
  // Get background color for podium positions
  const getRowBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-50";
      case 2:
        return "bg-gray-50";
      case 3:
        return "bg-amber-50";
      default:
        return "";
    }
  };
  
  const getInitials = (name: string | null, email: string) => {
    if (name) {
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name[0].toUpperCase();
    }
    
    return email[0].toUpperCase();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="levelup-container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-levelup-dark-blue mb-2">Leaderboard</h1>
              <p className="text-levelup-gray max-w-2xl">
                See how you stack up against other learners. Earn more learning time and keep your streak to climb the ranks!
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-3">
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="time">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-levelup-purple" />
                        Top Learners
                      </h2>
                      
                      <TabsList>
                        <TabsTrigger value="time">Learning Time</TabsTrigger>
                        <TabsTrigger value="streak">Streak</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    {loading ? (
                      <div className="text-center py-12">
                        <p className="text-levelup-gray">Loading leaderboard...</p>
                      </div>
                    ) : (
                      <>
                        <TabsContent value="time" className="mt-0">
                          <div className="overflow-hidden rounded-lg border">
                            <table className="w-full">
                              <thead className="bg-muted/50">
                                <tr className="text-left">
                                  <th className="p-3 font-medium">Rank</th>
                                  <th className="p-3 font-medium">Learner</th>
                                  <th className="p-3 font-medium">Learning Time</th>
                                  <th className="p-3 font-medium hidden md:table-cell">Progress</th>
                                </tr>
                              </thead>
                              <tbody>
                                {leaderboard
                                  .sort((a, b) => b.total_minutes - a.total_minutes)
                                  .map((learner, index) => (
                                    <tr 
                                      key={learner.id} 
                                      className={`border-t ${getRowBackground(index + 1)} ${learner.user_id === user?.id ? 'bg-blue-50' : ''}`}
                                    >
                                      <td className="p-3 font-medium">
                                        <div className="flex items-center">
                                          {index < 3 ? (
                                            <Medal className={`h-5 w-5 mr-1 ${getMedalColor(index + 1)}`} />
                                          ) : null}
                                          {index + 1}
                                        </div>
                                      </td>
                                      <td className="p-3">
                                        <div className="flex items-center space-x-3">
                                          <Avatar className="h-8 w-8">
                                            <AvatarImage src={learner.avatar_url || undefined} />
                                            <AvatarFallback>
                                              {getInitials(learner.full_name, learner.email)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="font-medium">{
                                              learner.user_id === user?.id ? 
                                              'You' : 
                                              (learner.full_name || learner.email.split('@')[0])
                                            }</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-3 font-mono">
                                        {formatLearningTime(learner.total_minutes)}
                                      </td>
                                      <td className="p-3 hidden md:table-cell">
                                        <Progress
                                          value={(learner.total_minutes / (leaderboard[0].total_minutes || 1)) * 100}
                                          className="h-2"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="streak" className="mt-0">
                          <div className="overflow-hidden rounded-lg border">
                            <table className="w-full">
                              <thead className="bg-muted/50">
                                <tr className="text-left">
                                  <th className="p-3 font-medium">Rank</th>
                                  <th className="p-3 font-medium">Learner</th>
                                  <th className="p-3 font-medium">Current Streak</th>
                                  <th className="p-3 font-medium hidden md:table-cell">Progress</th>
                                </tr>
                              </thead>
                              <tbody>
                                {leaderboard
                                  .sort((a, b) => b.streak_days - a.streak_days)
                                  .map((learner, index) => (
                                    <tr 
                                      key={learner.id} 
                                      className={`border-t ${getRowBackground(index + 1)} ${learner.user_id === user?.id ? 'bg-blue-50' : ''}`}
                                    >
                                      <td className="p-3 font-medium">
                                        <div className="flex items-center">
                                          {index < 3 ? (
                                            <Medal className={`h-5 w-5 mr-1 ${getMedalColor(index + 1)}`} />
                                          ) : null}
                                          {index + 1}
                                        </div>
                                      </td>
                                      <td className="p-3">
                                        <div className="flex items-center space-x-3">
                                          <Avatar className="h-8 w-8">
                                            <AvatarImage src={learner.avatar_url || undefined} />
                                            <AvatarFallback>
                                              {getInitials(learner.full_name, learner.email)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="font-medium">{
                                              learner.user_id === user?.id ? 
                                              'You' : 
                                              (learner.full_name || learner.email.split('@')[0])
                                            }</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-3 font-medium">
                                        {learner.streak_days} days
                                      </td>
                                      <td className="p-3 hidden md:table-cell">
                                        <Progress
                                          value={(learner.streak_days / (leaderboard[0].streak_days || 1)) * 100}
                                          className="h-2"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </TabsContent>
                      </>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-levelup-purple" />
                    Your Ranking
                  </h3>
                  
                  {user ? (
                    <>
                      <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-levelup-light-purple mb-3">
                          <span className="text-2xl font-bold text-levelup-purple">
                            {userRank?.rank || '-'}
                          </span>
                        </div>
                        <p className="text-sm text-levelup-gray">Your current rank</p>
                      </div>
                      
                      <div className="space-y-4 mt-6 border-t pt-4">
                        <div>
                          <p className="text-sm text-levelup-gray mb-1">Learning Time</p>
                          <p className="font-bold">{formatLearningTime(userRank?.total_minutes || 0)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-levelup-gray mb-1">Current Streak</p>
                          <p className="font-bold">{userRank?.streak_days || 0} days</p>
                        </div>
                        
                        <div>
                          <Button 
                            className="w-full bg-levelup-purple hover:bg-levelup-purple/90"
                            onClick={() => window.location.href = '/dashboard'}
                          >
                            Improve Your Rank
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <User className="h-16 w-16 mx-auto mb-4 text-levelup-gray/50" />
                      <p className="mb-4 text-levelup-gray">Sign in to see your ranking</p>
                      <Button 
                        className="bg-levelup-purple hover:bg-levelup-purple/90"
                        onClick={() => window.location.href = '/login'}
                      >
                        Sign In
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">How Rankings Work</h3>
                  <ul className="space-y-4 text-sm">
                    <li className="flex">
                      <div className="mr-3 bg-levelup-light-purple/50 p-1 rounded-full h-6 w-6 flex items-center justify-center">
                        <span className="text-levelup-purple font-medium">1</span>
                      </div>
                      <p>Complete courses and lessons to earn learning time</p>
                    </li>
                    <li className="flex">
                      <div className="mr-3 bg-levelup-light-purple/50 p-1 rounded-full h-6 w-6 flex items-center justify-center">
                        <span className="text-levelup-purple font-medium">2</span>
                      </div>
                      <p>Log in daily to maintain and build your learning streak</p>
                    </li>
                    <li className="flex">
                      <div className="mr-3 bg-levelup-light-purple/50 p-1 rounded-full h-6 w-6 flex items-center justify-center">
                        <span className="text-levelup-purple font-medium">3</span>
                      </div>
                      <p>Rankings are updated in real-time based on your activity</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
