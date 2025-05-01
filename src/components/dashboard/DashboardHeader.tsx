
import { Loader2, Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  loading: boolean;
  displayName: string;
  isNewUser: boolean;
  onNotificationClick: () => void;
}

const DashboardHeader = ({ 
  loading, 
  displayName, 
  isNewUser,
  onNotificationClick
}: DashboardHeaderProps) => {
  return (
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
              {isNewUser 
                ? "Start your learning journey today!" 
                : "Track your progress and continue your learning journey."}
            </p>
          </>
        )}
      </div>
      <div className="flex space-x-2 mt-4 md:mt-0">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onNotificationClick}
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Link to="/settings">
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/profile">
          <Button className="flex items-center space-x-2 bg-levelup-purple hover:bg-levelup-purple/90">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
