
import { BarChart2, ChevronRight, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";

interface Course {
  id: number;
  title: string;
  progress: number;
  lastActivity: string;
}

interface Props {
  courses: Course[];
  totalXP: number;
  level: number;
  nextLevelXP: number;
  currentXP: number;
}

const ProgressTracker = ({ courses, totalXP, level, nextLevelXP, currentXP }: Props) => {
  // Check if user is new (has 0 XP)
  const isNewUser = totalXP === 0;
  const progressPercentage = nextLevelXP > 0 ? (currentXP / nextLevelXP) * 100 : 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <BarChart2 className="h-5 w-5 text-levelup-purple mr-2" />
          <h2 className="text-xl font-bold text-levelup-purple">Your Progress</h2>
        </div>
        <Link to="/courses">
          <Button variant="ghost" size="sm" className="text-levelup-gray hover:text-levelup-purple">
            All Courses <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-levelup-light-purple/30 p-4 rounded-lg">
          <div className="text-sm text-levelup-gray mb-1">Current Level</div>
          <div className="text-2xl font-bold text-levelup-purple flex items-center">
            {isNewUser ? 'Level 1' : `Level ${level}`}
            {!isNewUser && <TrendingUp className="ml-2 h-4 w-4" />}
          </div>
        </div>
        
        <div className="bg-levelup-light-purple/30 p-4 rounded-lg">
          <div className="text-sm text-levelup-gray mb-1">Total XP</div>
          <div className="text-2xl font-bold text-levelup-purple">{isNewUser ? '0' : totalXP} XP</div>
        </div>
        
        <div className="bg-levelup-light-purple/30 p-4 rounded-lg">
          <div className="text-sm text-levelup-gray mb-1">Courses in Progress</div>
          <div className="text-2xl font-bold text-levelup-purple">{isNewUser ? '0' : courses.length}</div>
        </div>
      </div>

      {!isNewUser && (
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-levelup-purple">Level Progress</span>
            <span className="text-levelup-gray">{currentXP}/{nextLevelXP} XP</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
          <div className="text-xs text-right mt-1 text-levelup-gray">
            {nextLevelXP - currentXP} XP until Level {level + 1}
          </div>
        </div>
      )}

      {isNewUser && (
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-levelup-purple">Level Progress</span>
            <span className="text-levelup-gray">0/100 XP</span>
          </div>
          <Progress value={0} className="h-3" />
          <div className="text-xs text-right mt-1 text-levelup-gray">
            100 XP until Level 2
          </div>
        </div>
      )}

      <h3 className="font-bold mb-4 text-levelup-purple">Active Courses</h3>
      
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg p-4 hover:border-levelup-purple transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-levelup-purple">{course.title}</h4>
              <span className="text-sm text-levelup-gray">{course.progress}% complete</span>
            </div>
            <Progress value={course.progress} className="h-2 mb-2" />
            <div className="text-xs text-levelup-gray">
              Last activity: {course.lastActivity}
            </div>
          </div>
        ))}
      </div>

      {(courses.length === 0 || isNewUser) && (
        <div className="text-center py-8">
          <p className="mb-2 text-levelup-purple">You haven't started any courses yet.</p>
          <p className="mb-6 text-sm text-levelup-gray">Start your learning journey today to earn XP and track your progress!</p>
          <div className="mt-4">
            <Link to="/courses">
              <Button className="bg-levelup-purple hover:bg-levelup-purple/90 text-white">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
