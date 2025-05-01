
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ProgressTracker from "./ProgressTracker";
import { toast } from "sonner";
import CourseCard from "@/components/ui/CourseCard";

interface Course {
  id: number;
  title: string;
  progress: number;
  lastActivity: string;
}

interface CourseDetails {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  lessons: number;
  xpReward: number;
  image: string;
  category: string;
  instructor: string;
  popularity: number;
}

interface OverviewTabProps {
  activeCourses: Course[];
  userStats: {
    totalXP: number;
    level: number;
    nextLevelXP: number;
    currentXP: number;
  };
  recommendedCourses: CourseDetails[];
  onStartCourse: (courseId: number) => void;
  onCompleteCourse: (courseId: number, xpReward: number) => void;
}

const OverviewTab = ({ 
  activeCourses, 
  userStats, 
  recommendedCourses,
  onStartCourse,
  onCompleteCourse
}: OverviewTabProps) => {
  
  const EnhancedCourseCard = ({ course }: { course: CourseDetails }) => {
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
                  onClick={() => onCompleteCourse(course.id, course.xpReward)}
                >
                  Complete Course
                </Button>
              )}
            </>
          ) : (
            <Button 
              className="bg-levelup-purple hover:bg-levelup-purple/90 w-full"
              onClick={() => onStartCourse(course.id)}
            >
              Start Course
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <ProgressTracker 
        courses={activeCourses} 
        totalXP={userStats.totalXP} 
        level={userStats.level} 
        nextLevelXP={userStats.nextLevelXP}
        currentXP={userStats.currentXP} 
      />
      
      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recommended Courses</h2>
          <Link to="/courses">
            <Button variant="ghost" size="sm" className="text-levelup-gray hover:text-levelup-purple">
              All Courses <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedCourses.map(course => (
            <EnhancedCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
