import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
const Hero = () => {
  const {
    user
  } = useAuth();
  const userName = user?.user_metadata?.full_name || "there";
  return <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-20">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-levelup-purple mb-6">
            {user ? <>Hey <span className="text-levelup-light-purple">{userName}</span>, start your learning journey!</> : <>Level Up Your Skills<br />Achieve Your Goals</>}
          </h1>
          
          <p className="text-xl text-gray-700 mb-8">
            Interactive courses designed to help you master new skills at your own pace.
          </p>
          
          {user ? <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-medium text-lg text-gray-800 mb-2">Your Journey Begins</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-purple-600 h-2.5 rounded-full w-0"></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-levelup-purple">Level 1</span>
                  <span className="text-levelup-purple">0 XP</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses" className="flex-1">
                  <Button variant="default" className="w-full text-white">
                    Start Learning
                  </Button>
                </Link>
                <Link to="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full text-levelup-purple">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div> : <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button className="px-8 py-6 text-lg text-white">
                  Get Started For Free
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" className="px-8 py-6 text-lg text-levelup-purple">
                  Browse Courses
                </Button>
              </Link>
            </div>}
        </div>
        
        <div className="hidden md:block relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl transform rotate-3"></div>
          <img alt="Student learning online" className="relative z-10 rounded-2xl shadow-lg w-full h-auto object-cover" src="https://media.istockphoto.com/id/1360520509/photo/businessman-using-a-computer-to-webinar-online-education-on-internet-online-courses-e.jpg?s=612x612&w=0&k=20&c=Z1jqVTOjaHZkTloB-b09hIU_BcVinaUPTqcAl7ilt6E=" />
        </div>
      </div>
    </section>;
};
export default Hero;