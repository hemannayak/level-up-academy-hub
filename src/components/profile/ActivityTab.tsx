
interface ActivityTabProps {
  totalMinutes: number;
}

export default function ActivityTab({ totalMinutes }: ActivityTabProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Learning Activity</h3>
        <div className="text-center py-6 bg-gray-50 rounded-lg text-levelup-gray">
          {totalMinutes > 0 ? (
            <div className="space-y-2">
              <p>You've spent {formatTime(totalMinutes)} learning!</p>
              <p className="text-sm">Keep going to increase your skills.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p>No learning activity recorded yet.</p>
              <p className="text-sm">Start a course to track your progress!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
