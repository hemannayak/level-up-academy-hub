
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProgressTracker from "@/components/dashboard/ProgressTracker";
import BadgeDisplay from "@/components/dashboard/BadgeDisplay";
import CourseCard from "@/components/ui/CourseCard";
import { Button } from "@/components/ui/button";
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

// Mock data
const activeCourses = [
  {
    id: 1,
    title: "Python Programming: From Zero to Hero",
    progress: 65,
    lastActivity: "Today, 14:30"
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    progress: 22,
    lastActivity: "Yesterday"
  },
  {
    id: 3,
    title: "Web Development Bootcamp",
    progress: 8,
    lastActivity: "3 days ago"
  }
];

const badges = [
  {
    id: 1,
    title: "Quick Starter",
    description: "Complete your first course module",
    icon: "🚀",
    dateEarned: "2023-04-15",
    isLocked: false
  },
  {
    id: 2,
    title: "Quiz Master",
    description: "Score 100% on 5 quizzes",
    icon: "🧠",
    dateEarned: "2023-04-22",
    isLocked: false
  },
  {
    id: 3,
    title: "Consistent Learner",
    description: "Login for 7 consecutive days",
    icon: "📅",
    dateEarned: "2023-04-28",
    isLocked: false
  },
  {
    id: 4,
    title: "Code Ninja",
    description: "Complete 10 coding challenges",
    icon: "⚔️",
    dateEarned: null,
    isLocked: true
  },
  {
    id: 5,
    title: "Social Butterfly",
    description: "Participate in 3 forum discussions",
    icon: "🦋",
    dateEarned: null,
    isLocked: true
  },
  {
    id: 6,
    title: "Helping Hand",
    description: "Answer 5 questions from other students",
    icon: "🤝",
    dateEarned: null,
    isLocked: true
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

  // Get the display name: full_name from profile, or email username, or default
  const displayName = profileData?.full_name || user?.email?.split('@')[0] || 'User';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="levelup-container py-8">
          {/* Dashboard Header */}
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
                    Track your progress and continue your learning journey.
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
          
          {/* Dashboard Navigation */}
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
          
          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {activeTab === "overview" && (
                <>
                  <ProgressTracker 
                    courses={activeCourses} 
                    totalXP={580} 
                    level={7} 
                    nextLevelXP={750}
                    currentXP={580} 
                  />
                  
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">Recommended Courses</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendedCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === "courses" && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6">My Learning</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">In Progress</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeCourses.map((course) => (
                          <div key={course.id} className="border rounded-lg p-4 hover:border-levelup-purple transition-colors">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium">{course.title}</h4>
                              <span className="text-sm text-levelup-gray">{course.progress}% complete</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full mb-2">
                              <div 
                                className="bg-levelup-purple h-full rounded-full" 
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-levelup-gray">
                              Last activity: {course.lastActivity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Completed</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4 hover:border-levelup-purple transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">HTML & CSS Foundations</h4>
                            <span className="text-sm text-green-600">Completed</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full mb-2">
                            <div className="bg-green-500 h-full rounded-full w-full"></div>
                          </div>
                          <div className="text-xs text-levelup-gray">
                            Completed on April 2, 2023
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "achievements" && (
                <BadgeDisplay badges={badges} />
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
            
            {/* Sidebar */}
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
                      <div className="font-bold">4</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-levelup-light-purple/50 p-2 rounded-full">
                      <Award className="h-5 w-5 text-levelup-purple" />
                    </div>
                    <div className="ml-3">
                      <div className="text-levelup-gray text-sm">Badges Earned</div>
                      <div className="font-bold">3</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-levelup-light-purple/50 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-levelup-purple" />
                    </div>
                    <div className="ml-3">
                      <div className="text-levelup-gray text-sm">Learning Streak</div>
                      <div className="font-bold">7 days</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-levelup-light-purple/50 p-2 rounded-full">
                      <BookOpen className="h-5 w-5 text-levelup-purple" />
                    </div>
                    <div className="ml-3">
                      <div className="text-levelup-gray text-sm">Hours Learned</div>
                      <div className="font-bold">26 hours</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold mb-4">Upcoming Deadlines</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-levelup-purple pl-3">
                    <div className="font-medium">Python Assignment #3</div>
                    <div className="text-sm text-levelup-gray">Due tomorrow</div>
                  </div>
                  <div className="border-l-4 border-levelup-orange pl-3">
                    <div className="font-medium">Data Science Quiz</div>
                    <div className="text-sm text-levelup-gray">Due in 3 days</div>
                  </div>
                  <div className="border-l-4 border-gray-300 pl-3">
                    <div className="font-medium">Web Development Project</div>
                    <div className="text-sm text-levelup-gray">Due in 2 weeks</div>
                  </div>
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
