
import { BookOpen, Award, BarChart, Trophy } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <BookOpen className="h-12 w-12 text-levelup-purple" />,
      title: "Choose Your Courses",
      description:
        "Browse our extensive library of courses across various subjects and difficulty levels. Find the perfect match for your learning goals.",
    },
    {
      icon: <BarChart className="h-12 w-12 text-levelup-purple" />,
      title: "Track Your Progress",
      description:
        "Monitor your advancement through detailed analytics. See your growth, identify areas for improvement, and celebrate milestones.",
    },
    {
      icon: <Award className="h-12 w-12 text-levelup-purple" />,
      title: "Earn Achievements",
      description:
        "Complete challenges and earn badges, certificates, and special recognition for your accomplishments. Build a collection of digital credentials.",
    },
    {
      icon: <Trophy className="h-12 w-12 text-levelup-purple" />,
      title: "Level Up",
      description:
        "Gain experience points (XP) as you progress through courses. Unlock new levels, features, and exclusive content as you grow.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="levelup-container">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4 text-levelup-purple">How LevelUp Learning Works</h2>
          <p className="text-levelup-gray max-w-2xl mx-auto">
            Our platform combines structured learning with gamification elements
            to create an engaging and effective educational experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-levelup-light-purple rounded-full opacity-0 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative z-10">{step.icon}</div>
              <h3 className="text-xl font-bold mt-4 mb-2 text-levelup-purple">{step.title}</h3>
              <p className="text-levelup-gray">{step.description}</p>
              <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-levelup-light-purple flex items-center justify-center">
                <span className="font-bold text-levelup-purple">{index + 1}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24">
          <div className="bg-white rounded-xl shadow p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="order-2 lg:order-1">
                <h3 className="heading-md mb-6 text-levelup-purple">
                  Gamified Learning Experience
                </h3>
                <div className="space-y-6">
                  <div className="flex">
                    <div className="bg-levelup-light-purple p-3 rounded-full h-fit">
                      <Trophy className="h-6 w-6 text-levelup-purple" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-lg mb-1 text-levelup-purple">XP System</h4>
                      <p className="text-levelup-gray">
                        Earn experience points for completing lessons, quizzes,
                        and assignments. Watch your level grow as you master new
                        skills.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-levelup-light-purple p-3 rounded-full h-fit">
                      <Award className="h-6 w-6 text-levelup-purple" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-lg mb-1 text-levelup-purple">
                        Badges & Achievements
                      </h4>
                      <p className="text-levelup-gray">
                        Unlock special badges for reaching milestones, completing
                        challenges, and demonstrating exceptional performance.
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <div className="bg-levelup-light-purple p-3 rounded-full h-fit">
                      <BarChart className="h-6 w-6 text-levelup-purple" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-lg mb-1 text-levelup-purple">
                        Learning Analytics
                      </h4>
                      <p className="text-levelup-gray">
                        Get detailed insights into your learning patterns,
                        strengths, and areas for improvement with personalized
                        analytics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 flex items-center justify-center">
                <div className="bg-gradient-to-br from-levelup-light-purple to-white p-6 rounded-xl shadow-lg max-w-md">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold text-lg text-levelup-purple">Your Progress</h4>
                      <span className="text-levelup-purple font-semibold">Level 5</span>
                    </div>

                    {/* XP Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-levelup-gray">Current XP</span>
                        <span className="font-medium text-levelup-purple">350/500</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full">
                        <div 
                          className="bg-gradient-to-r from-levelup-purple to-levelup-purple/70 h-full rounded-full" 
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                      <div className="text-xs text-levelup-gray text-right mt-1">
                        150 XP until Level 6
                      </div>
                    </div>

                    {/* Recent Achievements */}
                    <h5 className="font-medium mb-3 text-levelup-purple">Recent Achievements</h5>
                    <div className="space-y-3">
                      <div className="flex items-center p-2 bg-levelup-light-purple/30 rounded">
                        <div className="bg-levelup-light-purple p-2 rounded-full">
                          <Award className="h-4 w-4 text-levelup-purple" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-sm text-levelup-purple">First Assignment</p>
                          <p className="text-xs text-levelup-gray">Completed your first coding challenge</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-2 bg-levelup-light-purple/30 rounded">
                        <div className="bg-levelup-light-purple p-2 rounded-full">
                          <Trophy className="h-4 w-4 text-levelup-purple" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-sm text-levelup-purple">Perfect Quiz</p>
                          <p className="text-xs text-levelup-gray">Scored 100% on a quiz</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
