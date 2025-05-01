
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BadgeDisplay from "@/components/dashboard/BadgeDisplay";
import LearningTimeTracker from "@/components/dashboard/LearningTimeTracker";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import OverviewTab from "@/components/dashboard/OverviewTab";
import CoursesTab from "@/components/dashboard/CoursesTab";
import CalendarTab from "@/components/dashboard/CalendarTab";
import StatisticsPanel from "@/components/dashboard/StatisticsPanel";
import DeadlinesPanel from "@/components/dashboard/DeadlinesPanel";
import LearningTip from "@/components/dashboard/LearningTip";

const initialActiveCourses = [];

const recommendedCourses = [
  {
    id: 5,
    title: "JavaScript: The Complete Guide",
    description: "Master JavaScript from basics to advanced concepts with practical projects and real-world applications.",
    level: "Intermediate",
    duration: "10 weeks",
    lessons: 56,
    xpReward: 780,
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=500&auto=format&fit=crop",
    category: "Programming",
    instructor: "Mark Davis",
    popularity: 4.7,
  },
  {
    id: 6,
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of user interface and user experience design to create beautiful, functional products.",
    level: "Beginner",
    duration: "6 weeks",
    lessons: 32,
    xpReward: 550,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=500&auto=format&fit=crop",
    category: "Design",
    instructor: "Lisa Wang",
    popularity: 4.9,
  },
  {
    id: 7,
    title: "Database Design & SQL Mastery",
    description: "Design efficient databases and write powerful SQL queries for data manipulation and analysis.",
    level: "Intermediate",
    duration: "8 weeks",
    lessons: 45,
    xpReward: 700,
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=500&auto=format&fit=crop",
    category: "Database",
    instructor: "Dr. Robert Smith",
    popularity: 4.6,
  }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, supabase } = useAuth();
  const [profileData, setProfileData] = useState<{ full_name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCourses, setActiveCourses] = useState(initialActiveCourses);
  const [showWelcome, setShowWelcome] = useState(false);

  // Initialize with zero values for new users
  const [userStats, setUserStats] = useState({
    totalXP: 0,
    level: 1,
    nextLevelXP: 100,
    currentXP: 0
  });

  const completeCourse = async (courseId, xpReward) => {
    try {
      const completedCourse = {
        id: courseId,
        title: recommendedCourses.find(c => c.id === courseId)?.title || "Course",
        progress: 100,
        lastActivity: new Date().toLocaleDateString()
      };

      setActiveCourses(prev => [...prev, completedCourse]);

      const newTotalXP = userStats.totalXP + xpReward;
      let newLevel = userStats.level;
      let newCurrentXP = userStats.currentXP + xpReward;
      let newNextLevelXP = userStats.nextLevelXP;

      while (newCurrentXP >= newNextLevelXP) {
        newCurrentXP -= newNextLevelXP;
        newLevel++;
        newNextLevelXP = 100 * newLevel;
      }

      setUserStats({
        totalXP: newTotalXP,
        level: newLevel,
        nextLevelXP: newNextLevelXP,
        currentXP: newCurrentXP
      });

      toast.success(`Course completed! Earned ${xpReward} XP`);
      
      if (user) {
        console.log("Saving progress to database for user", user.id);
      }
    } catch (error) {
      console.error("Error completing course:", error);
      toast.error("Failed to update progress");
    }
  };

  const startCourse = async (courseId) => {
    try {
      const course = recommendedCourses.find(c => c.id === courseId);
      if (!course) return;

      const newCourse = {
        id: courseId,
        title: course.title,
        progress: 40,
        lastActivity: new Date().toLocaleDateString()
      };

      setActiveCourses(prev => [...prev, newCourse]);

      const xpEarned = Math.round(course.xpReward * 0.4);

      const newTotalXP = userStats.totalXP + xpEarned;
      let newCurrentXP = userStats.currentXP + xpEarned;
      let newLevel = userStats.level;
      let newNextLevelXP = userStats.nextLevelXP;

      while (newCurrentXP >= newNextLevelXP) {
        newCurrentXP -= newNextLevelXP;
        newLevel++;
        newNextLevelXP = 100 * newLevel;
      }

      setUserStats({
        totalXP: newTotalXP,
        level: newLevel,
        nextLevelXP: newNextLevelXP,
        currentXP: newCurrentXP
      });

      toast.success(`Started course! Earned ${xpEarned} XP`);
    } catch (error) {
      console.error("Error starting course:", error);
      toast.error("Failed to start course");
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile data:", error);
        } else {
          setProfileData(data);
          
          // Show welcome popup for first-time users
          const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user.id}`);
          if (!hasSeenWelcome) {
            setShowWelcome(true);
            localStorage.setItem(`welcome_seen_${user.id}`, 'true');
            
            // Show welcome badge toast
            setTimeout(() => {
              toast(
                <div className="flex items-center gap-3">
                  <div className="bg-levelup-purple rounded-full p-2">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-levelup-purple">Welcome Badge Earned!</p>
                    <p>Successfully joined LevelUp Learning</p>
                  </div>
                </div>,
                {
                  duration: 5000,
                  className: "badge-toast",
                  position: "top-center"
                }
              );
            }, 1500);
          }
        }
      } catch (error) {
        console.error("Error in profile fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, supabase]);

  const displayName = profileData?.full_name || user?.email?.split('@')[0] || 'User';
  const isNewUser = userStats.totalXP === 0;

  const handleNotificationClick = () => {
    toast.info("Notifications center coming soon!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="levelup-container py-8">
          <DashboardHeader 
            loading={loading} 
            displayName={displayName} 
            isNewUser={isNewUser}
            onNotificationClick={handleNotificationClick}
          />
          
          <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {activeTab === "overview" && (
                <OverviewTab 
                  activeCourses={activeCourses}
                  userStats={userStats}
                  recommendedCourses={recommendedCourses}
                  onStartCourse={startCourse}
                  onCompleteCourse={completeCourse}
                />
              )}
              
              {activeTab === "courses" && (
                <CoursesTab 
                  activeCourses={activeCourses} 
                  onCompleteCourse={completeCourse}
                  recommendedCourses={recommendedCourses}
                />
              )}
              
              {activeTab === "achievements" && (
                <BadgeDisplay userXP={userStats.totalXP} />
              )}
              
              {activeTab === "calendar" && <CalendarTab />}
            </div>
            
            <div className="space-y-8">
              <LearningTimeTracker />
              <StatisticsPanel activeCourses={activeCourses} userStats={userStats} />
              <DeadlinesPanel />
              <LearningTip />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
