
import { BarChart, BookOpen, Award, Calendar } from "lucide-react";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, setActiveTab }: DashboardTabsProps) => {
  return (
    <div className="mb-8 border-b">
      <nav className="flex space-x-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
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
          className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
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
          className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
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
          className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
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
  );
};

export default DashboardTabs;
