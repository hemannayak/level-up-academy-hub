
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Course {
  id: number;
  title: string;
  progress: number;
  lastActivity: string;
}

interface CoursesTabProps {
  activeCourses: Course[];
  onCompleteCourse: (courseId: number, xpReward: number) => void;
  recommendedCourses: Array<{
    id: number;
    xpReward: number;
    [key: string]: any;
  }>;
}

const CoursesTab = ({ activeCourses, onCompleteCourse, recommendedCourses }: CoursesTabProps) => {
  return (
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
                    onClick={() => onCompleteCourse(course.id, recommendedCourses.find(c => c.id === course.id)?.xpReward || 100)}
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
                <div className="text-center p-6 text-levelup-gray col-span-2">
                  <p>You haven't completed any courses yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesTab;
