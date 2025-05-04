
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Medal, Trophy, Clock, Users, Award, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

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
  const { supabase, user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('time');
  const [userRank, setUserRank] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch leaderboard data using our optimized database function
  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the database function we created
      const { data, error } = await supabase.rpc('get_leaderboard');
      
      if (error) {
        console.error('Error fetching leaderboard data:', error);
        setError('Failed to load leaderboard data');
        throw error;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        console.log('Leaderboard data loaded:', data.length, 'users');
        setLeaderboardData(data);
        
        // Find user's rank
        if (user) {
          const userIndex = data.findIndex(item => item.user_id === user.id);
          if (userIndex !== -1) {
            setUserRank(userIndex + 1);
          }
        }
        setTotalUsers(data.length);
      } else {
        console.log('No leaderboard data found');
        setLeaderboardData([]);
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError('Failed to load leaderboard data. Please try again later.');
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchLeaderboardData();
  }, [supabase, user]);

  // Set up real-time subscription to learning_time table
  useEffect(() => {
    // Subscribe to changes on the learning_time table
    const channel = supabase
      .channel('learning_time_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'learning_time' },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Refresh the leaderboard data when changes occur
          fetchLeaderboardData();
        }
      )
      .subscribe();
      
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
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

  const isCurrentUser = (leaderboardUser: LeaderboardUser) => {
    return user && leaderboardUser.user_id === user.id;
  };

  const handleRetry = () => {
    fetchLeaderboardData();
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
              {userRank && (
                <div className="ml-auto flex items-center gap-2 bg-levelup-light-purple/30 px-3 py-1 rounded-full">
                  <Award className="h-4 w-4 text-levelup-purple" />
                  <span className="text-sm font-medium text-levelup-purple">
                    Your Rank: #{userRank}
                  </span>
                </div>
              )}
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
                  <div className="text-center py-8 text-levelup-gray">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-10 w-10 bg-levelup-light-purple/30 rounded-full mb-3"></div>
                      <div className="h-4 w-32 bg-levelup-light-purple/30 rounded mb-2"></div>
                      <div className="h-3 w-48 bg-levelup-light-purple/20 rounded"></div>
                    </div>
                    <p className="mt-4">Loading leaderboard data...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-levelup-gray">
                    <Users className="h-12 w-12 mx-auto mb-3 text-levelup-purple/50" />
                    <p className="text-red-500 font-medium">{error}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 border-levelup-purple text-levelup-purple hover:bg-levelup-purple hover:text-white"
                      onClick={handleRetry}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : leaderboardData.length === 0 ? (
                  <div className="text-center py-8 text-levelup-gray">
                    <Users className="h-12 w-12 mx-auto mb-3 text-levelup-purple/50" />
                    <p>No learning data recorded yet.</p>
                    <p className="text-sm mt-1">Start learning to appear on the leaderboard!</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Rank</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead className="table-cell">Email</TableHead>
                          <TableHead className="text-right">Learning Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaderboardData.map((userData, index) => (
                          <TableRow 
                            key={userData.id} 
                            className={isCurrentUser(userData) ? 'bg-levelup-light-purple/20' : ''}
                          >
                            <TableCell className="font-medium">
                              {index < 3 ? (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getMedalBg(index)}`}>
                                  <Medal className={`h-5 w-5 ${getMedalColor(index)}`} />
                                </div>
                              ) : (
                                <span className="flex items-center justify-center w-8 h-8">{index + 1}</span>
                              )}
                            </TableCell>
                            <TableCell className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={userData.avatar_url || undefined} />
                                <AvatarFallback className="bg-levelup-purple text-white">
                                  {getInitials(userData)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{getDisplayName(userData)}</div>
                                {isCurrentUser(userData) && (
                                  <span className="text-xs text-levelup-purple">(You)</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-levelup-gray text-sm">
                              <div className="flex items-center">
                                <Mail className="h-3 w-3 mr-1 text-levelup-gray/70" />
                                {userData.email}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatTime(userData.total_minutes)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="streak">
                {loading ? (
                  <div className="text-center py-8 text-levelup-gray">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-10 w-10 bg-levelup-light-purple/30 rounded-full mb-3"></div>
                      <div className="h-4 w-32 bg-levelup-light-purple/30 rounded mb-2"></div>
                      <div className="h-3 w-48 bg-levelup-light-purple/20 rounded"></div>
                    </div>
                    <p className="mt-4">Loading streak data...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-levelup-gray">
                    <Users className="h-12 w-12 mx-auto mb-3 text-levelup-purple/50" />
                    <p className="text-red-500 font-medium">{error}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 border-levelup-purple text-levelup-purple hover:bg-levelup-purple hover:text-white"
                      onClick={handleRetry}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : leaderboardData.length === 0 ? (
                  <div className="text-center py-8 text-levelup-gray">
                    <Users className="h-12 w-12 mx-auto mb-3 text-levelup-purple/50" />
                    <p>No streak data recorded yet.</p>
                    <p className="text-sm mt-1">Log in daily to build your streak!</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Rank</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead className="table-cell">Email</TableHead>
                          <TableHead className="text-right">Current Streak</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...leaderboardData]
                          .sort((a, b) => b.streak_days - a.streak_days)
                          .map((userData, index) => (
                            <TableRow 
                              key={userData.id} 
                              className={isCurrentUser(userData) ? 'bg-levelup-light-purple/20' : ''}
                            >
                              <TableCell className="font-medium">
                                {index < 3 ? (
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getMedalBg(index)}`}>
                                    <Medal className={`h-5 w-5 ${getMedalColor(index)}`} />
                                  </div>
                                ) : (
                                  <span className="flex items-center justify-center w-8 h-8">{index + 1}</span>
                                )}
                              </TableCell>
                              <TableCell className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={userData.avatar_url || undefined} />
                                  <AvatarFallback className="bg-levelup-purple text-white">
                                    {getInitials(userData)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{getDisplayName(userData)}</div>
                                  {isCurrentUser(userData) && (
                                    <span className="text-xs text-levelup-purple">(You)</span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-levelup-gray text-sm">
                                <div className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1 text-levelup-gray/70" />
                                  {userData.email}
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {userData.streak_days} days
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
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
