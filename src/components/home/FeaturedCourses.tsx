
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/ui/CourseCard";

// Mock data
const courses = [
  {
    id: 1,
    title: "Python Programming: From Zero to Hero",
    description: "Learn Python from scratch and become proficient in one of the most in-demand programming languages.",
    level: "Beginner",
    duration: "8 weeks",
    lessons: 42,
    xpReward: 600,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=500&auto=format&fit=crop",
    category: "Programming",
    instructor: "Dr. Alex Johnson",
    popularity: 4.9,
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    description: "Master the core concepts of data science including analysis, visualization, and machine learning basics.",
    level: "Intermediate",
    duration: "10 weeks",
    lessons: 56,
    xpReward: 750,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=500&auto=format&fit=crop",
    category: "Data Science",
    instructor: "Prof. Sarah Matthews",
    popularity: 4.8,
  },
  {
    id: 3,
    title: "Web Development Bootcamp",
    description: "Build responsive websites with HTML, CSS, and JavaScript. Create real-world projects for your portfolio.",
    level: "Beginner",
    duration: "12 weeks",
    lessons: 68,
    xpReward: 820,
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=500&auto=format&fit=crop",
    category: "Web Development",
    instructor: "Emma Reynolds",
    popularity: 4.7,
  },
  {
    id: 4,
    title: "Machine Learning Specialization",
    description: "Explore advanced ML algorithms, neural networks, and practical applications with hands-on projects.",
    level: "Advanced",
    duration: "14 weeks",
    lessons: 72,
    xpReward: 950,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=500&auto=format&fit=crop",
    category: "Artificial Intelligence",
    instructor: "Dr. Michael Chen",
    popularity: 4.9,
  }
];

const FeaturedCourses = () => {
  return (
    <section className="py-16 bg-white">
      <div className="levelup-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="heading-lg mb-2 text-levelup-purple font-bold">Featured Courses</h2>
            <p className="text-levelup-gray max-w-2xl">
              Discover our most popular courses and start your learning journey today. 
              Each course comes with interactive lessons, quizzes, and projects.
            </p>
          </div>
          <Link to="/courses" className="mt-4 md:mt-0">
            <Button variant="outline" className="border-levelup-purple text-levelup-purple hover:bg-levelup-light-purple">
              Browse All Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        
        <div className="mt-16 text-center bg-gradient-to-r from-levelup-light-purple via-white to-levelup-light-purple p-8 rounded-xl shadow-sm">
          <h3 className="heading-md mb-4">Ready to start learning?</h3>
          <p className="text-levelup-gray mb-6 max-w-2xl mx-auto">
            Join thousands of students who are already leveling up their skills and advancing their careers with our interactive courses.
          </p>
          <Link to="/register">
            <Button className="bg-levelup-purple hover:bg-levelup-purple/90 px-8 py-6 text-lg">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
