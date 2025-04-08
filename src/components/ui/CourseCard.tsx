
import { 
  Clock, 
  BookOpen, 
  Award, 
  Star, 
  ChevronRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Course {
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
  progress?: number;
}

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
}

const CourseCard = ({ course, showProgress = false }: CourseCardProps) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.title} 
          className="h-48 w-full object-cover"
        />
        <Badge className="absolute top-3 right-3 bg-levelup-purple">{course.category}</Badge>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-levelup-purple transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-levelup-gray">{course.instructor}</p>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm line-clamp-2 mb-4 text-levelup-gray">
          {course.description}
        </p>
        
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1 text-levelup-gray" />
            <span>{course.lessons} lessons</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-levelup-gray" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Award className="h-4 w-4 mr-1 text-levelup-gray" />
            <span>{course.xpReward} XP</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
            <span>{course.popularity}</span>
          </div>
        </div>
        
        {showProgress && course.progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-levelup-gray mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full">
              <div 
                className="h-full bg-levelup-purple rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full flex items-center justify-between">
          <Badge variant="outline" className="font-normal">
            {course.level}
          </Badge>
          <Link to={`/courses/${course.id}`}>
            <Button variant="ghost" size="sm" className="text-levelup-purple hover:text-levelup-purple/90 p-0">
              View Course <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
