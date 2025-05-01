
const DeadlinesPanel = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="font-bold mb-4">Upcoming Deadlines</h3>
      <div className="text-center py-6 text-levelup-gray">
        <p>No deadlines yet.</p>
        <p className="text-sm mt-1">Enroll in courses to see deadlines here.</p>
      </div>
    </div>
  );
};

export default DeadlinesPanel;
