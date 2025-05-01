
import { useEffect, useState } from "react";
import { Clock, Calendar, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LearningTimeData {
  id: string;
  user_id: string;
  total_minutes: number;
  streak_days: number;
  last_active: string;
}

export default function LearningTimeTracker() {
  const { user } = useAuth();
  const [timeData, setTimeData] = useState<LearningTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStarted, setSessionStarted] = useState<Date | null>(null);

  // Fetch learning time data from the database
  useEffect(() => {
    if (user?.id) {
      fetchLearningTime();
      // Start tracking time when component mounts
      setSessionStarted(new Date());
    }
  }, [user]);

  // Update learning time when user leaves the page or when component unmounts
  useEffect(() => {
    const updateLearningTime = async () => {
      if (user?.id && sessionStarted) {
        const now = new Date();
        const minutesSpent = Math.floor((now.getTime() - sessionStarted.getTime()) / 60000);
        
        if (minutesSpent > 0) {
          await supabase.functions.invoke("update-learning-time", {
            body: { userId: user.id, minutesSpent }
          });
          
          // Refresh data
          await fetchLearningTime();
        }
      }
    };

    // Add event listener for when user leaves the page
    window.addEventListener('beforeunload', updateLearningTime);

    // Update time every 5 minutes while on the page
    const interval = setInterval(async () => {
      if (sessionStarted) {
        await updateLearningTime();
        // Reset timer
        setSessionStarted(new Date());
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      window.removeEventListener('beforeunload', updateLearningTime);
      clearInterval(interval);
      updateLearningTime();
    };
  }, [user, sessionStarted]);

  const fetchLearningTime = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

      const { data, error } = await supabase
        .from('learning_time')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching learning time:', error);
      } else {
        setTimeData(data);
      }
    } catch (error) {
      console.error('Error in fetchLearningTime:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Convert minutes to days and hours
  const getTimeEquivalent = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (remainingHours === 0) return `${days} day${days > 1 ? 's' : ''}`;
    return `${days} day${days > 1 ? 's' : ''} and ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
  };

  const getTotalMinutes = () => {
    return timeData?.total_minutes || 0;
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-levelup-purple" />
          Your Learning Time
        </h3>

        {loading ? (
          <div className="text-center py-4 text-levelup-gray">Loading time data...</div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-levelup-purple" />
                <span className="text-sm">Total Time</span>
              </div>
              <span className="font-medium">{formatTime(getTotalMinutes())}</span>
            </div>
            
            <Progress 
              value={(getTotalMinutes() / 600) * 100} 
              className="h-2" 
              max={100}
            />
            
            <div className="text-xs text-right text-levelup-gray">
              {getTimeEquivalent(getTotalMinutes())} of learning
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Current Streak</span>
                </div>
                <span className="font-medium">{timeData?.streak_days || 0} days</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-levelup-purple" />
                <span className="text-sm">Last Active</span>
              </div>
              <span className="text-sm">
                {timeData?.last_active 
                  ? new Date(timeData.last_active).toLocaleDateString() 
                  : 'Today'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
