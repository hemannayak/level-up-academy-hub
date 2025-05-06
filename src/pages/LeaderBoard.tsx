import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Medal, Trophy, Clock, Users, Award, Mail, Zap, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type LeaderboardUser = {
  id: string;
  user_id: string;
  total_minutes: number | null;
  streak_days: number | null;
  full_name: string | null;
  avatar_url: string | null;
  email: string;
  xp_points: number;
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
      const { data: leaderboardData, error: leaderboardError } = await supabase.rpc('get_leaderboard');
      
      if (leaderboardError) {
        console.error('Error fetching leaderboard data:', leaderboardError);
        setError('Failed to load leaderboard data');
        throw leaderboardError;
      }

      // Fetch all registered users to ensure we include everyone
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url');
      
      if (profilesError) {
        console.error('Error fetching profiles data:', profilesError);
      }

      // Process data to create a complete leaderboard
      let allUsers: LeaderboardUser[] = [];
      
      // Add users with learning time data
      if (leaderboardData && Array.isArray(leaderboardData)) {
        allUsers = leaderboardData.map(item => ({
          ...item,
          total_minutes: item.total_minutes || 0,
          streak_days: item.streak_days || 0,
          xp_points: (item.total_minutes || 0) * 10 // Calculate XP based on minutes
        }));
      }
      
      // Add users without learning time data (new registrations)
      if (profilesData && Array.isArray(profilesData)) {
        profilesData.forEach(profile => {
          if (!allUsers.some(u => u.user_id === profile.id)) {
            // Check if we already have user data for this profile
            allUsers.push({
              id: profile.id,
              user_id: profile.id,
              total_minutes: 0,
              streak_days: 0,
              full_name: profile.full_name,
              avatar_url: profile.avatar_url,
              email: 'Email unavailable', // Placeholder since we can't directly query auth.users
              xp_points: 0
            });
          }
        });
      }
      
      console.log('All users data loaded:', allUsers.length, 'users');
      setLeaderboardData(allUsers);
        
      // Find user's rank if logged in
      if (user) {
        const userIndex = activeTab === 'time' 
          ? allUsers.sort((a, b) => (b.total_minutes || 0) - (a.total_minutes || 0)).findIndex(item => item.user_id === user.id)
          : activeTab === 'xp'
            ? allUsers.sort((a, b) => b.xp_points - a.xp_points).findIndex(item => item.user_id === user.id)
            : allUsers.sort((a, b) => (b.streak_days || 0) - (a.streak_days || 0)).findIndex(item => item.user_id === user.id);
            
        if (userIndex !== -1) {
          setUserRank(userIndex + 1);
        }
      }
      setTotalUsers(allUsers.length);
      
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError('Failed to load leaderboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchLeaderboardData();
  }, [supabase, user]);

  // Update rank when changing tabs
  useEffect(() => {
    if (user && leaderboardData.length > 0) {
      const sortedData = getSortedData();
      const userIndex = sortedData.findIndex(item => item.user_id === user.id);
      if (userIndex !== -1) {
        setUserRank(userIndex + 1);
      }
    }
  }, [activeTab, leaderboardData, user]);

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
          toast.info("Leaderboard updated with new data!");
        }
      )
      .subscribe();
      
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Subscribe to changes on the profiles table to catch new user registrations
  useEffect(() => {
    const profilesChannel = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Profile update received:', payload);
          if (payload.eventType === 'INSERT') {
            toast.success("New user joined! Refreshing leaderboard...");
          }
          // Refresh the leaderboard data when profiles change
          fetchLeaderboardData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(profilesChannel);
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

  const formatTime = (minutes: number | null) => {
    if (!minutes) return '0 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
  };

  const formatXP = (xp: number) => {
    return xp.toLocaleString();
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
    return user.email ? user.email[0].toUpperCase() : 'U';
  };

  const isCurrentUser = (leaderboardUser: LeaderboardUser) => {
    return user && leaderboardUser.user_id === user.id;
  };

  const handleRetry = () => {
    fetchLeaderboardData();
  };

  // Helper to sort data based on active tab
  const getSortedData = () => {
    if (activeTab === 'time') {
      return [...leaderboardData].sort((a, b) => (b.total_minutes || 0) - (a.total_minutes || 0));
    } else if (activeTab === 'streak') {
      return [...leaderboardData].sort((a, b) => (b.streak_days || 0) - (a.streak_days || 0));
    } else if (activeTab === 'xp') {
      return [...leaderboardData].sort((a, b) => b.xp_points - a.xp_points);
    }
    return leaderboardData;
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
              
              <div className="ml-auto flex items-center gap-2">
                {userRank && (
                  <div className="bg-levelup-light-purple/30 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-levelup-purple flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      Your Rank: #{userRank}
                    </span>
                  </div>
                )}
                
                <div className="text-sm text-levelup-gray flex items-center ml-2">
                  <Users className="h-4 w-4 mr-1" />
                  {totalUsers} users
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Learning Time</span>
                </TabsTrigger>
                <TabsTrigger value="xp" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>XP Points</span>
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
                    <p>No users found.</p>
                    <p className="text-sm mt-1">Invite others to join the platform!</p>
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
                          <TableHead className="text-right">XP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getSortedData().map((userData, index) => (
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
                                <div className="font-medium flex items-center gap-1">
                                  {getDisplayName(userData)}
                                  {userData.total_minutes === 0 && (
                                    <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded flex items-center">
                                      <UserPlus className="h-3 w-3 mr-0.5" /> New
                                    </span>
                                  )}
                                </div>
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
                            <TableCell className="text-right font-medium">
                              <div className="flex items-center justify-end">
                                <Zap className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                                {formatXP(userData.xp_points)}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="xp">
                {loading ? (
                  <div className="text-center py-8 text-levelup-gray">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-10 w-10 bg-levelup-light-purple/30 rounded-full mb-3"></div>
                      <div className="h-4 w-32 bg-levelup-light-purple/30 rounded mb-2"></div>
                      <div className="h-3 w-48 bg-levelup-light-purple/20 rounded"></div>
                    </div>
                    <p className="mt-4">Loading XP data...</p>
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
                    <p>No XP data recorded yet.</p>
                    <p className="text-sm mt-1">Start learning to earn XP!</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Rank</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead className="table-cell">Email</TableHead>
                          <TableHead className="text-right">XP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...leaderboardData]
                          .sort((a, b) => b.xp_points - a.xp_points)
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
                                  <div className="font-medium flex items-center gap-1">
                                    {getDisplayName(userData)}
                                    {userData.total_minutes === 0 && (
                                      <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded flex items-center">
                                        <UserPlus className="h-3 w-3 mr-0.5" /> New
                                      </span>
                                    )}
                                  </div>
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
                                <div className="flex items-center justify-end">
                                  <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                                  {formatXP(userData.xp_points)}
                                </div>
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
                          <TableHead className="text-right">XP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...leaderboardData]
                          .sort((a, b) => (b.streak_days || 0) - (a.streak_days || 0))
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
                                  <div className="font-medium flex items-center gap-1">
                                    {getDisplayName(userData)}
                                    {userData.total_minutes === 0 && (
                                      <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded flex items-center">
                                        <UserPlus className="h-3 w-3 mr-0.5" /> New
                                      </span>
                                    )}
                                  </div>
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
                                {userData.streak_days || 0} days
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                <div className="flex items-center justify-end">
                                  <Zap className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                                  {formatXP(userData.xp_points)}
                                </div>
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
