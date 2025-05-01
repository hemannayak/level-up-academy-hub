
import { Calendar } from "lucide-react";

const CalendarTab = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Learning Schedule</h2>
      <div className="text-center py-12 text-levelup-gray">
        <Calendar className="h-16 w-16 mx-auto mb-4 text-levelup-purple opacity-60" />
        <p className="text-lg mb-2">Calendar feature coming soon!</p>
        <p>Track deadlines, schedule study sessions, and never miss an assignment.</p>
      </div>
    </div>
  );
};

export default CalendarTab;
