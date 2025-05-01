
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Mail, Calendar, Award, BookOpen, Trash2, LogOut } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import AvatarUpload from "@/components/profile/AvatarUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const navigate = useNavigate();
  const { user, supabase, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<{
    id?: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string | null;
  } | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
  });
  const [learningTime, setLearningTime] = useState({
    totalMinutes: 0,
    streakDays: 0,
    lastActive: ""
  });
  
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfileData();
      fetchLearningTime();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfileData(data);
        setFormData({
          fullName: data?.full_name || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLearningTime = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from("learning_time")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error("Error fetching learning time:", error);
      } else if (data) {
        setLearningTime({
          totalMinutes: data.total_minutes,
          streakDays: data.streak_days,
          lastActive: data.last_active
        });
      }
    } catch (error) {
      console.error("Error fetching learning time:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) {
        throw error;
      }

      toast.success("Profile updated successfully!");
      await fetchProfileData();
    } catch (error: any) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user?.email) {
      toast.error("Email confirmation doesn't match");
      return;
    }

    try {
      // Delete user data from database
      const { error: deleteProfileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user?.id);

      if (deleteProfileError) {
        console.error("Error deleting profile data:", deleteProfileError);
      }

      // Delete learning time data
      const { error: deleteLearningTimeError } = await supabase
        .from("learning_time")
        .delete()
        .eq("user_id", user?.id);

      if (deleteLearningTimeError) {
        console.error("Error deleting learning time:", deleteLearningTimeError);
      }
      
      // Delete contact submissions
      const { error: deleteSubmissionError } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("user_id", user?.id);

      if (deleteSubmissionError) {
        console.error("Error deleting submissions:", deleteSubmissionError);
      }

      // Delete avatar from storage
      const { error: deleteAvatarError } = await supabase
        .storage
        .from('avatars')
        .remove([`${user?.id}/avatar`]);

      if (deleteAvatarError) {
        console.error("Error deleting avatar:", deleteAvatarError);
      }

      // Finally, delete the user authentication account
      const { error } = await supabase.auth.admin.deleteUser(user?.id!);
      
      if (error) {
        throw error;
      }

      await signOut();
      toast.success("Account deleted successfully");
      navigate('/');
    } catch (error: any) {
      toast.error("Failed to delete account");
      console.error("Error deleting account:", error.message);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error: any) {
      toast.error("Failed to log out");
      console.error("Error logging out:", error.message);
    }
  };

  const formatTime = (minutes: number) => {
    if (!minutes) return "0h 0m";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const createdAt = profileData?.created_at
    ? new Date(profileData.created_at).toLocaleDateString()
    : "N/A";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="levelup-container py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-levelup-dark-blue mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account details and preferences</p>
          </div>
          
          <Tabs defaultValue="account" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="learning">Learning Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <AvatarUpload />
                        
                        <div className="mt-4">
                          <h2 className="text-xl font-semibold">{profileData?.full_name || user?.email?.split("@")[0]}</h2>
                          <p className="text-levelup-gray">{user?.email}</p>
                        </div>
                        
                        <div className="mt-6 space-y-3">
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-levelup-purple" />
                            <span>{user?.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-levelup-purple" />
                            <span>Joined {createdAt}</span>
                          </div>
                        </div>
                        
                        <div className="mt-6 space-y-2">
                          <Button 
                            variant="default" 
                            className="w-full bg-levelup-purple hover:bg-levelup-purple/90"
                            onClick={handleLogout}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out
                          </Button>
                          
                          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="text-red-500">Delete Your Account</DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone. All your account data, learning progress, and badges will be permanently removed.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <p className="mb-4 font-medium">
                                  To confirm deletion, please type your email address:
                                </p>
                                <Input
                                  value={deleteConfirmation}
                                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                                  placeholder={user?.email || "your email"}
                                  className="mb-2"
                                />
                                <p className="text-sm text-red-500">
                                  *All your data will be permanently deleted
                                </p>
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="ghost"
                                  onClick={() => setIsDeleteDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={handleDeleteAccount}
                                  disabled={deleteConfirmation !== user?.email}
                                >
                                  Delete Account
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                      
                      <form onSubmit={handleUpdateProfile}>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label htmlFor="email" className="text-sm font-medium">
                              Email
                            </label>
                            <Input
                              id="email"
                              type="email"
                              value={user?.email || ""}
                              disabled
                              className="bg-gray-50"
                            />
                            <p className="text-sm text-levelup-gray">
                              Email cannot be changed
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <label htmlFor="fullName" className="text-sm font-medium">
                              Full Name
                            </label>
                            <Input
                              id="fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder="Your full name"
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button
                              type="submit"
                              className="bg-levelup-purple hover:bg-levelup-purple/90"
                              disabled={saving}
                            >
                              {saving ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        </div>
                      </form>
                      
                      <Separator className="my-6" />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <Link to="/settings">
                              <Button variant="outline" className="w-full">
                                <Settings className="mr-2 h-4 w-4" />
                                Account Settings
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="learning">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <Card className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h2 className="text-xl font-semibold mb-4">Learning Summary</h2>
                        
                        <div className="space-y-6">
                          <div>
                            <p className="text-sm text-levelup-gray mb-1">Total Learning Time</p>
                            <div className="text-3xl font-bold text-levelup-purple">
                              {formatTime(learningTime.totalMinutes)}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-levelup-gray mb-1">Current Streak</p>
                            <div className="text-3xl font-bold text-amber-500">
                              {learningTime.streakDays || 0} days
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-levelup-gray mb-1">Last Active</p>
                            <div className="text-lg font-medium">
                              {learningTime.lastActive ? new Date(learningTime.lastActive).toLocaleDateString() : "Today"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-8">
                          <Link to="/dashboard">
                            <Button className="w-full bg-levelup-purple hover:bg-levelup-purple/90">
                              Go to Dashboard
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-6">Learning Progress</h2>
                      
                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium flex items-center">
                              <BookOpen className="h-4 w-4 mr-2 text-levelup-purple" />
                              Course Completions
                            </h3>
                            <span className="text-sm text-levelup-gray">0 of 3 completed</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium flex items-center">
                              <Award className="h-4 w-4 mr-2 text-levelup-purple" />
                              Badges Earned
                            </h3>
                            <span className="text-sm text-levelup-gray">1 of 5 earned</span>
                          </div>
                          <Progress value={20} className="h-2" />
                        </div>
                        
                        <div className="pt-4 border-t">
                          <h3 className="font-medium mb-4">Recent Activity</h3>
                          
                          {learningTime.totalMinutes > 0 ? (
                            <div className="space-y-3">
                              <div className="border rounded-lg p-3 bg-gray-50">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">Learning Session</span>
                                  <span className="text-sm text-levelup-gray">
                                    {learningTime.lastActive ? new Date(learningTime.lastActive).toLocaleDateString() : "Today"}
                                  </span>
                                </div>
                                <div className="text-sm text-levelup-gray">
                                  Spent {formatTime(learningTime.totalMinutes)} learning
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-6 text-levelup-gray">
                              <p>No learning activity recorded yet.</p>
                              <p className="text-sm mt-1">Start a course to track your progress.</p>
                            </div>
                          )}
                          
                          <div className="mt-6">
                            <Link to="/courses">
                              <Button variant="outline" className="w-full">
                                <BookOpen className="mr-2 h-4 w-4" />
                                Explore Courses
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
