
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Bell, User, Book, Award } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [courseReminders, setCourseReminders] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async () => {
    setSaving(true);
    
    // Simulating an API call to save settings
    setTimeout(() => {
      toast.success("Settings saved successfully");
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-levelup-dark-blue mb-6">Settings</h1>
          
          <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive email notifications about course updates and new features
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="achievement-notifications" className="text-base">Achievement Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Get notified when you earn new badges and achievements
                    </p>
                  </div>
                  <Switch
                    id="achievement-notifications"
                    checked={achievementAlerts}
                    onCheckedChange={setAchievementAlerts}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="course-reminders" className="text-base">Course Reminders</Label>
                    <p className="text-sm text-gray-500">
                      Receive reminders to continue your learning journey
                    </p>
                  </div>
                  <Switch
                    id="course-reminders"
                    checked={courseReminders}
                    onCheckedChange={setCourseReminders}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how LevelUp Learning looks on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                    <p className="text-sm text-gray-500">
                      Use dark theme for better visibility in low light
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Learning Preferences</CardTitle>
                <CardDescription>
                  Customize your learning experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <Bell className="h-8 w-8 text-levelup-purple mt-1" />
                    <div>
                      <h3 className="font-medium">Daily Reminders</h3>
                      <p className="text-sm text-gray-500">
                        Get daily notifications to maintain your learning streak
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="daily-reminders"
                    checked={true}
                    onCheckedChange={() => toast.info("This feature will be available soon!")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <Book className="h-8 w-8 text-levelup-purple mt-1" />
                    <div>
                      <h3 className="font-medium">Course Recommendations</h3>
                      <p className="text-sm text-gray-500">
                        Receive personalized course suggestions based on your interests
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="course-recommendations"
                    checked={true}
                    onCheckedChange={() => toast.info("This feature will be available soon!")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <Award className="h-8 w-8 text-levelup-purple mt-1" />
                    <div>
                      <h3 className="font-medium">Achievement Tracking</h3>
                      <p className="text-sm text-gray-500">
                        Track and showcase your learning achievements
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="achievement-tracking"
                    checked={true}
                    onCheckedChange={() => toast.info("This feature will be available soon!")}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={handleSaveSettings} 
                disabled={saving}
                className="bg-levelup-purple hover:bg-levelup-purple/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
