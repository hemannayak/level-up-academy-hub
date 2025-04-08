
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CourseCard from "@/components/ui/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookOpen } from "lucide-react";

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
  },
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
  },
  {
    id: 8,
    title: "Mobile App Development with React Native",
    description: "Create cross-platform mobile apps for iOS and Android using React Native and JavaScript.",
    level: "Intermediate",
    duration: "12 weeks",
    lessons: 60,
    xpReward: 820,
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=500&auto=format&fit=crop",
    category: "Mobile Development",
    instructor: "James Wilson",
    popularity: 4.8,
  }
];

const categories = [
  "All Categories",
  "Programming",
  "Data Science",
  "Web Development",
  "Artificial Intelligence",
  "Design",
  "Database",
  "Mobile Development"
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter courses based on search query, category, and level
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="pt-10 pb-16">
          <div className="levelup-container">
            {/* Header */}
            <div className="mb-10 text-center">
              <h1 className="heading-lg mb-4">Explore Our Courses</h1>
              <p className="text-levelup-gray max-w-2xl mx-auto">
                Browse our comprehensive collection of interactive courses designed to help you level up your skills and advance your career.
              </p>
            </div>
            
            {/* Search and Filters */}
            <div className="mb-10">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-grow relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-levelup-gray" />
                  <Input
                    type="text"
                    placeholder="Search for courses..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="md:hidden">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
              
              <div className={`md:flex gap-4 ${isFilterOpen ? 'block' : 'hidden md:flex'}`}>
                <div className="mb-4 md:mb-0">
                  <label className="block text-sm font-medium text-levelup-gray mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-levelup-purple focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-levelup-gray mb-1">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-levelup-purple focus:border-transparent"
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Active filters display */}
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCategory !== "All Categories" && (
                  <Badge className="bg-levelup-light-purple text-levelup-purple hover:bg-levelup-light-purple/90">
                    {selectedCategory}
                    <button 
                      onClick={() => setSelectedCategory("All Categories")}
                      className="ml-1 text-levelup-purple hover:text-levelup-purple/70"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedLevel !== "All Levels" && (
                  <Badge className="bg-levelup-light-purple text-levelup-purple hover:bg-levelup-light-purple/90">
                    {selectedLevel}
                    <button 
                      onClick={() => setSelectedLevel("All Levels")}
                      className="ml-1 text-levelup-purple hover:text-levelup-purple/70"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {(selectedCategory !== "All Categories" || selectedLevel !== "All Levels") && (
                  <button 
                    onClick={() => {
                      setSelectedCategory("All Categories");
                      setSelectedLevel("All Levels");
                    }}
                    className="text-sm text-levelup-purple hover:text-levelup-purple/70 hover:underline ml-2"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
            
            {/* Results info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-levelup-gray">
                Showing <span className="font-medium">{filteredCourses.length}</span> courses
              </p>
              <div className="flex items-center">
                <span className="text-sm text-levelup-gray mr-2">Sort by:</span>
                <select className="text-sm border-none bg-transparent focus:outline-none focus:ring-0 text-levelup-purple">
                  <option value="popularity">Popularity</option>
                  <option value="newest">Newest</option>
                  <option value="highest-rated">Highest Rated</option>
                  <option value="lowest-priced">Lowest Priced</option>
                </select>
              </div>
            </div>
            
            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-levelup-gray" />
                <h3 className="text-xl font-bold mb-2">No courses found</h3>
                <p className="text-levelup-gray mb-6">
                  We couldn't find any courses matching your search criteria.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All Categories");
                    setSelectedLevel("All Levels");
                  }}
                  className="bg-levelup-purple hover:bg-levelup-purple/90"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Courses;
