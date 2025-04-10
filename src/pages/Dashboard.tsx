import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProgressTracker from "@/components/dashboard/ProgressTracker";
import BadgeDisplay from "@/components/dashboard/BadgeDisplay";
import CourseCard from "@/components/ui/CourseCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  GraduationCap, 
  BarChart, 
  Award, 
  Settings,
  Bell,
  User,
  Calendar,
  Loader2 
} from "lucide-react";

const initialActiveCourses = [];

const badges = [
  {
    id: 1,
    title: "Quick Starter",
    description: "Complete your first course module",
    icon: "🚀",
    dateEarned: "2023-04-15",
    isLocked: false,
    xpRequired: 10
  },
  {
    id: 2,
    title: "Quiz Master",
    description: "Score 100% on 5 quizzes",
    icon: "🧠",
    dateEarned: "2023-04-22",
    isLocked: false,
    xpRequired: 50
  },
  {
    id: 3,
    title: "Consistent Learner",
    description: "Login for 7 consecutive days",
    icon: "📅",
    dateEarned: "2023-04-28",
    isLocked: false,
    xpRequired: 75
  },
  {
    id: 4,
    title: "Code Ninja",
    description: "Complete 10 coding challenges",
    icon: "⚔️",
    dateEarned: null,
    isLocked: true,
    xpRequired: 150
  },
  {
    id: 5,
    title: "Social Butterfly",
    description: "Participate in 3 forum discussions",
    icon: "🦋",
    dateEarned: null,
    isLocked: true,
    xpRequired: 200
  },
  {
    id: 6,
    title: "Helping Hand",
    description: "Answer 5 questions from other students",
    icon: "🤝",
    dateEarned: null,
    isLocked: true,
    xpRequired: 300
  }
];

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

  const EnhancedCourseCard = ({ course }) => {
    const isCourseActive = activeCourses.some(c => c.id === course.id);
    const activeCourse = activeCourses.find(c => c.id === course.id);
    
    return (
      <div className="relative">
        <CourseCard course={course} />
        <div className="mt-2 flex flex-col gap-2">
          {isCourseActive ? (
            <>
              <div className="mt-1 mb-1">
                <Progress value={activeCourse?.progress || 0} className="h-2" />
                <div className="text-xs text-right mt-1 text-levelup-gray">
                  {activeCourse?.progress || 0}% complete
                </div>
              </div>
              {activeCourse?.progress < 100 && (
                <Button 
                  className="bg-levelup-purple hover:bg-levelup-purple/90 w-full"
                  onClick={() => completeCourse(course.id, course.xpReward)}
                >
                  Complete Course
                </Button>
              )}
            </>
          ) : (
            <Button 
              className="bg-levelup-purple hover:bg-levelup-purple/90 w-full"
              onClick={() => startCourse(course.id)}
            >
              Start Course
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="levelup-container py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  <p>Loading user data...</p>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold mb-1">Welcome back, {displayName}!</h1>
                  <p className="text-levelup-gray">
                    {userStats.totalXP === 0 
                      ? "Start your learning journey today!" 
                      : "Track your progress and continue your learning journey."}
                  </p>
                </>
              )}
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button className="flex items-center space-x-2 bg-levelup-purple hover:bg-levelup-purple/90">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Button>
            </div>
          </div>
          
          <div className="mb-8 border-b">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-3 px-1 border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-levelup-purple text-levelup-purple"
                    : "border-transparent text-levelup-gray hover:text-levelup-dark-blue"
                }`}
              >
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 mr-2" />
                  <span>Overview</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className={`py-3 px-1 border-b-2 transition-colors ${
                  activeTab === "courses"
                    ? "border-levelup-purple text-levelup-purple"
                    : "border-transparent text-levelup-gray hover:text-levelup-dark-blue"
                }`}
              >
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>My Courses</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("achievements")}
                className={`py-3 px-1 border-b-2 transition-colors ${
                  activeTab === "achievements"
                    ? "border-levelup-purple text-levelup-purple"
                    : "border-transparent text-levelup-gray hover:text-levelup-dark-blue"
                }`}
              >
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  <span>Achievements</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("calendar")}
                className={`py-3 px-1 border-b-2 transition-colors ${
                  activeTab === "calendar"
                    ? "border-levelup-purple text-levelup-purple"
                    : "border-transparent text-levelup-gray hover:text-levelup-dark-blue"
                }`}
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Calendar</span>
                </div>
              </button>
            </nav>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {activeTab === "overview" && (
                <>
                  <ProgressTracker 
                    courses={activeCourses} 
                    totalXP={userStats.totalXP} 
                    level={userStats.level} 
                    nextLevelXP={userStats.nextLevelXP}
                    currentXP={userStats.currentXP} 
                  />
                  
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">Recommended Courses</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendedCourses.map(course => (
                        <EnhancedCourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === "courses" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">My Learning</h2>
                  
                  {activeCourses.length === 0 ? (
                    <div className="text-center py-12 text-levelup-gray">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 text-levelup-purple opacity-60" />
                      <p className="text-lg mb-2">No courses in progress</p>
                      <p className="mb-4">Start learning today to track your progress here!</p>
                      <Link to="/courses">
                        <Button className="bg-levelup-purple hover:bg-levelup-purple/90">
                          Browse Courses
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">In Progress</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeCourses.filter(course => course.progress < 100).map((course) => (
                            <div key={course.id} className="border rounded-lg p-4 hover:border-levelup-purple transition-colors">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium">{course.title}</h4>
                                <span className="text-sm text-levelup-gray">{course.progress}% complete</span>
                              </div>
                              <Progress value={course.progress} className="h-2 mb-2" />
                              <div className="text-xs text-levelup-gray">
                                Last activity: {course.lastActivity}
                              </div>
                              <Button 
                                className="bg-levelup-purple hover:bg-levelup-purple/90 w-full mt-3"
                                onClick={() => completeCourse(course.id, recommendedCourses.find(c => c.id === course.id)?.xpReward || 100)}
                              >
                                Complete Course
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-4">Completed</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeCourses.filter(course => course.progress === 100).length > 0 ? (
                            activeCourses.filter(course => course.progress === 100).map((course) => (
                              <div key={course.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium">{course.title}</h4>
                                  <span className="text-sm text-green-600 font-bold">Completed</span>
                                </div>
                                <Progress value={100} className="h-2 mb-2 bg-green-100" />
                                <div className="text-xs text-levelup-gray">
                                  Completed on: {course.lastActivity}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center p-6 text-levelup-gray">
                              <p>You haven't completed any courses yet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "achievements" && (
                <BadgeDisplay userXP={userStats.totalXP} />
              )}
              
              {activeTab === "calendar" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">Learning Schedule</h2>
                  <div className="text-center py-12 text-levelup-gray">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-levelup-purple opacity-60" />
                    <p className="text-lg mb-2">Calendar feature coming soon!</p>
                    <p>Track deadlines, schedule study sessions, and never miss an assignment.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold mb-4">Your Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-levelup-light-purple/50 p-2 rounded-full">
                      <GraduationCap className="h-5 w-5 text-levelup-purple" />
                    </div>
                    <div className="ml-3">
                      <div className="text-levelup-gray text-sm">Courses Enrolled</div>
                      <div className="font-bold">{activeCourses.length}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-levelup-light-purple/50 p-2 rounded-full">
                      <Award className="h-5 w-5 text-levelup-purple" />
                    </div>
                    <div className="ml-3">
                      <div className="text-levelup-gray text-sm">Badges Earned</div>
                      <div className="font-bold">{badges.filter(badge => !badge.isLocked).length}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-levelup-light-purple/50 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-levelup-purple" />
                    </div>
                    <div className="ml-3">
                      <div className="text-levelup-gray text-sm">Learning Streak</div>
                      <div className="font-bold">{activeCourses.length > 0 ? '1 day' : '0 days'}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-levelup-light-purple/50 p-2 rounded-full">
                      <BookOpen className="h-5 w-5 text-levelup-purple" />
                    </div>
                    <div className="ml-3">
                      <div className="text-levelup-gray text-sm">Hours Learned</div>
                      <div className="font-bold">{userStats.totalXP > 0 ? Math.round(userStats.totalXP / 30) : 0} hours</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold mb-4">Upcoming Deadlines</h3>
                <div className="text-center py-6 text-levelup-gray">
                  <p>No deadlines yet.</p>
                  <p className="text-sm mt-1">Enroll in courses to see deadlines here.</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-levelup-purple to-levelup-purple/90 text-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold mb-4">Learning Tip</h3>
                <p className="mb-4 text-white/90">
                  Struggling with a concept? Try the Feynman Technique: Explain it as if you're teaching it to someone else.
                </p>
                <div className="text-xs text-white/70">
                  Tip refreshes every day
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
