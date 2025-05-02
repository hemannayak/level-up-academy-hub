
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Medal, Trophy, Clock, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type LeaderboardUser = {
  id: string;
  user_id: string;
  total_minutes: number;
  streak_days: number;
  full_name: string | null;
  avatar_url: string | null;
  email: string;
};

export default function LeaderBoard() {
  const { supabase } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('time');

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        
        // Get learning time data
        const { data: learningData, error: learningError } = await supabase
          .from('learning_time')
          .select('id, user_id, total_minutes, streak_days')
          .order('total_minutes', { ascending: false });

        if (learningError) throw learningError;

        if (learningData && learningData.length > 0) {
          // For each learning time entry, get the corresponding profile and user data
          const enhancedData = await Promise.all(
            learningData.map(async (item) => {
              // Get profile data
              const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', item.user_id)
                .single();

              // Get user email
              const { data: userData } = await supabase
                .auth.admin.getUserById(item.user_id);

              return {
                ...item,
                full_name: profileData?.full_name || null,
                avatar_url: profileData?.avatar_url || null,
                email: userData?.user?.email || 'unknown@example.com',
              };
            })
          );
          
          setLeaderboardData(enhancedData);
        } else {
          setLeaderboardData([]);
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [supabase]);

  const getMedalColor = (index: number) => {
    switch(index) {
      case 0: return 'text-yellow-500'; // Gold
      case 1: return 'text-gray-400';   // Silver
      case 2: return 'text-amber-700';  // Bronze
      default: return '';
    }
  };

  const getMedalBg = (index: number) => {
    switch(index) {
      case 0: return 'bg-yellow-100'; // Gold
      case 1: return 'bg-gray-100';   // Silver
      case 2: return 'bg-amber-100';  // Bronze
      default: return 'bg-gray-50';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
  };

  const getDisplayName = (user: LeaderboardUser) => {
    if (user.full_name) return user.full_name;
    return user.email.split('@')[0];
  };

  const getInitials = (user: LeaderboardUser) => {
    if (user.full_name) {
      const nameParts = user.full_name.split(' ');
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`;
      }
      return nameParts[0][0];
    }
    return user.email[0].toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="levelup-container py-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Trophy className="h-6 w-6 text-levelup-purple mr-2" />
              <h1 className="text-2xl font-bold text-levelup-purple">Leaderboard</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Learning Time</span>
                </TabsTrigger>
                <TabsTrigger value="streak" className="flex items-center gap-2">
                  <Medal className="h-4 w-4" />
                  <span>Streak Days</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="time">
                {loading ? (
                  <div className="text-center py-8 text-levelup-gray">Loading leaderboard data...</div>
                ) : leaderboardData.length === 0 ? (
                  <div className="text-center py-8 text-levelup-gray">
                    <Users className="h-12 w-12 mx-auto mb-3 text-levelup-purple/50" />
                    <p>No learning data recorded yet.</p>
                    <p className="text-sm mt-1">Start learning to appear on the leaderboard!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaderboardData.map((user, index) => (
                      <div 
                        key={user.id} 
                        className={`flex items-center p-3 rounded-lg ${getMedalBg(index)} border transition-colors`}
                      >
                        <div className="w-8 text-center font-bold text-lg">
                          {index < 3 ? (
                            <Medal className={`h-6 w-6 ${getMedalColor(index)}`} />
                          ) : (
                            <span className="text-levelup-gray">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="ml-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback className="bg-levelup-purple text-white">
                              {getInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        <div className="ml-3 flex-grow">
                          <div className="font-medium">{getDisplayName(user)}</div>
                          <div className="text-xs text-levelup-gray">{user.email}</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold">{formatTime(user.total_minutes)}</div>
                          <div className="text-xs text-levelup-gray">Learning time</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="streak">
                {loading ? (
                  <div className="text-center py-8 text-levelup-gray">Loading leaderboard data...</div>
                ) : leaderboardData.length === 0 ? (
                  <div className="text-center py-8 text-levelup-gray">
                    <Users className="h-12 w-12 mx-auto mb-3 text-levelup-purple/50" />
                    <p>No streak data recorded yet.</p>
                    <p className="text-sm mt-1">Log in daily to build your streak!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...leaderboardData].sort((a, b) => b.streak_days - a.streak_days).map((user, index) => (
                      <div 
                        key={user.id} 
                        className={`flex items-center p-3 rounded-lg ${getMedalBg(index)} border transition-colors`}
                      >
                        <div className="w-8 text-center font-bold text-lg">
                          {index < 3 ? (
                            <Medal className={`h-6 w-6 ${getMedalColor(index)}`} />
                          ) : (
                            <span className="text-levelup-gray">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="ml-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback className="bg-levelup-purple text-white">
                              {getInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        <div className="ml-3 flex-grow">
                          <div className="font-medium">{getDisplayName(user)}</div>
                          <div className="text-xs text-levelup-gray">{user.email}</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold">{user.streak_days} days</div>
                          <div className="text-xs text-levelup-gray">Current streak</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
