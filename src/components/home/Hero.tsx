
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-levelup-purple/10 to-levelup-light-purple/30 py-16 md:py-24">
      <div className="levelup-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="heading-xl mb-6">
              Level Up Your Skills with <span className="text-levelup-purple">Gamified</span> Learning
            </h1>
            <p className="text-lg md:text-xl text-levelup-gray mb-8 max-w-2xl mx-auto lg:mx-0">
              Earn XP, unlock achievements, and track your progress as you master new skills. 
              Join thousands of learners who have transformed their knowledge through our 
              interactive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/courses">
                <Button className="bg-levelup-purple hover:bg-levelup-purple/90 text-lg px-8 py-6">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-levelup-purple text-levelup-purple hover:bg-levelup-light-purple text-lg px-8 py-6">
                  Join for Free
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-levelup-purple/80 flex items-center justify-center text-xs font-bold text-white`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="ml-4 text-sm text-levelup-gray">
                <span className="font-bold">5,000+</span> students already learning
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 relative z-10">
              <div className="mb-6 p-4 bg-levelup-light-purple rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">Current Progress</h3>
                  <span className="text-sm text-levelup-purple font-semibold">2/5 Complete</span>
                </div>
                <div className="h-3 bg-white rounded-full">
                  <div className="bg-levelup-purple h-full rounded-full w-[40%]"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="bg-green-100 p-2 rounded-md">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12L3 13.8L9 19.8L21 7.8L19.2 6L9 16.2Z" fill="#10B981"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Python Fundamentals</p>
                    <p className="text-sm text-levelup-gray">Completed • 100 XP earned</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="bg-green-100 p-2 rounded-md">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12L3 13.8L9 19.8L21 7.8L19.2 6L9 16.2Z" fill="#10B981"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Data Structures</p>
                    <p className="text-sm text-levelup-gray">Completed • 120 XP earned</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-levelup-light-purple/50 border border-levelup-purple/20 rounded-md">
                  <div className="bg-levelup-light-purple p-2 rounded-md">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#8B5CF6"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Algorithms</p>
                    <p className="text-sm text-levelup-gray">In progress • 40% complete</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-md opacity-50">
                  <div className="bg-gray-200 p-2 rounded-md">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="#6B7280"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Advanced JavaScript</p>
                    <p className="text-sm text-levelup-gray">Locked • Complete previous courses</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between items-center p-4 bg-levelup-purple/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-levelup-dark-blue">Current Level</p>
                  <p className="text-xl font-bold text-levelup-purple">Level 7</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-levelup-dark-blue">Total XP</p>
                  <p className="text-xl font-bold text-levelup-purple">580 XP</p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-levelup-purple/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-levelup-orange/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
      
      {/* Stats bar */}
      <div className="mt-16 py-8 bg-white shadow-md">
        <div className="levelup-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-levelup-purple">100+</p>
              <p className="text-levelup-gray">Interactive Courses</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-levelup-purple">50k+</p>
              <p className="text-levelup-gray">Active Learners</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-levelup-purple">200+</p>
              <p className="text-levelup-gray">Achievements</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-levelup-purple">98%</p>
              <p className="text-levelup-gray">Completion Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
