
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Medal, Trophy, Users } from "lucide-react";

type LeaderboardUser = {
  id: string;
  full_name: string | null;
  xp: number;
  rank: number;
};

const LeaderBoard = () => {
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        
        // Fetch profiles - we're not using XP column yet since it doesn't exist
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name");
        
        if (error) {
          console.error("Error fetching profiles:", error);
          setLoading(false);
          return;
        }

        // Simulate XP with mock data until we have real XP values
        // In a real scenario, we'd query the actual XP column
        const mockRankedUsers = data.map((user, index) => ({
          id: user.id,
          full_name: user.full_name,
          xp: 100 - index * 5, // Mock XP data
          rank: index + 1
        }));

        setLeaderboardUsers(mockRankedUsers);
      } catch (error) {
        console.error("Error in leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

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
    if (!user) return null;
    const currentUser = leaderboardUsers.find(u => u.id === user.id);
    if (!currentUser) return "Not ranked yet";
    return `#${currentUser.rank}`;
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
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

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-purple-100 to-indigo-50">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-levelup-purple" />
              <h2 className="text-xl font-semibold text-levelup-purple">XP Rankings</h2>
            </div>
            <p className="text-levelup-gray mt-1">Learn more, climb higher!</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center">
                      Loading leaderboard...
                    </td>
                  </tr>
                ) : leaderboardUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center">
                      No users found. Start learning to be the first!
                    </td>
                  </tr>
                ) : (
                  leaderboardUsers.map((leaderboardUser) => (
                    <tr 
                      key={leaderboardUser.id} 
                      className={`${leaderboardUser.id === user?.id ? 'bg-purple-50' : ''} hover:bg-gray-50`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getMedalIcon(leaderboardUser.rank)}
                          <span className={`ml-2 ${leaderboardUser.rank <= 3 ? 'font-bold' : ''}`}>
                            {leaderboardUser.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {leaderboardUser.xp} XP
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LeaderBoard;
