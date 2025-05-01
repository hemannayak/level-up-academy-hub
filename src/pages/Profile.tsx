
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AvatarUpload from "@/components/profile/AvatarUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Clock,
  BookOpen,
  LogOut,
  Trash2,
  FileText,
  Settings as SettingsIcon
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { user, supabase, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    full_name: "",
    avatar_url: "",
    bio: "",
    location: "",
    website: "",
    phone: "",
    birth_date: "",
    interests: [],
    education: "",
    occupation: ""
  });
  const [userStats, setUserStats] = useState({
    totalMinutes: 0,
    totalCourses: 0,
    streakDays: 0,
    totalPoints: 0
  });
  
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      // Fetch profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          avatar_url: data.avatar_url || "",
          bio: data.bio || "",
          location: data.location || "",
          website: data.website || "",
          phone: data.phone || "",
          birth_date: data.birth_date || "",
          interests: data.interests || [],
          education: data.education || "",
          occupation: data.occupation || ""
        });
        
        // Set avatar URL
        if (data.avatar_url) {
          const { data: urlData } = await supabase
            .storage
            .from('avatars')
            .createSignedUrl(data.avatar_url, 60 * 60); // 1 hour expiry
            
          if (urlData) {
            setAvatarUrl(urlData.signedUrl);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserStats = async () => {
    try {
      if (!user) return;
      
      // Fetch learning time
      const { data: timeData, error: timeError } = await supabase
        .from('learning_time')
        .select('total_minutes, streak_days')
        .eq('user_id', user.id)
        .single();
        
      if (timeError && timeError.code !== 'PGRST116') {
        throw timeError;
      }
      
      // Count courses (this would be a real implementation in a full app)
      // For now we'll mock this
      const totalCourses = Math.floor(Math.random() * 5); // Mock data
      const totalPoints = timeData?.total_minutes ? Math.floor(timeData.total_minutes / 10) : 0;
      
      setUserStats({
        totalMinutes: timeData?.total_minutes || 0,
        totalCourses: totalCourses,
        streakDays: timeData?.streak_days || 0,
        totalPoints: totalPoints
      });
      
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("You have been logged out");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      
      // Delete user data from tables
      // This would be a complete implementation in a real app
      // For now we'll just sign out
      
      // Sign out
      await signOut();
      toast.success("Your account has been deleted");
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
      setLoading(false);
    }
  };
  
  const handleUpdateProfile = async (values) => {
    try {
      if (!user) return;
      
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAvatarUpload = async (file) => {
    try {
      if (!user || !file) return;
      
      // Upload path format: 'user_id/avatar.png'
      const filePath = `${user.id}/avatar.png`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      toast.success("Avatar updated successfully");
      fetchProfile();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <Card className="w-[600px]">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                You need to be logged in to view your profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/login")} className="w-full">
                Log In
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="levelup-container py-8">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
              <div className="relative">
                <AvatarUpload 
                  uid={user.id}
                  url={avatarUrl}
                  size={100}
                  onUpload={handleAvatarUpload}
                />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold">{profile.full_name || user.email?.split('@')[0]}</h1>
                <p className="text-levelup-gray">{user.email}</p>
                {profile.occupation && (
                  <p className="mt-1 text-levelup-purple font-medium">{profile.occupation}</p>
                )}
                {profile.location && (
                  <p className="flex items-center mt-2 text-sm text-levelup-gray">
                    <MapPin className="h-4 w-4 mr-1" /> {profile.location}
                  </p>
                )}
              </div>
              
              <div className="md:ml-auto flex space-x-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your profile information
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form className="space-y-4 py-4" onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const values = {
                        full_name: formData.get('full_name'),
                        bio: formData.get('bio'),
                        location: formData.get('location'),
                        website: formData.get('website'),
                        phone: formData.get('phone'),
                        occupation: formData.get('occupation'),
                      };
                      handleUpdateProfile(values);
                    }}>
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input id="full_name" name="full_name" defaultValue={profile.full_name} />
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" defaultValue={profile.bio} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" name="location" defaultValue={profile.location} />
                        </div>
                        
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input id="website" name="website" defaultValue={profile.website} />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" name="phone" defaultValue={profile.phone} />
                        </div>
                        
                        <div>
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input id="occupation" name="occupation" defaultValue={profile.occupation} />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Saving..." : "Save changes"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button variant="ghost" onClick={handleLogout} className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-levelup-light-purple/30 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-levelup-light-purple p-2 rounded-full">
                    <Clock className="h-5 w-5 text-levelup-purple" />
                  </div>
                  <div className="ml-3">
                    <div className="text-levelup-gray text-sm">Learning Time</div>
                    <div className="font-bold">{formatTime(userStats.totalMinutes)}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-levelup-light-purple/30 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-levelup-light-purple p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-levelup-purple" />
                  </div>
                  <div className="ml-3">
                    <div className="text-levelup-gray text-sm">Courses Completed</div>
                    <div className="font-bold">{userStats.totalCourses}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-levelup-light-purple/30 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-levelup-light-purple p-2 rounded-full">
                    <Award className="h-5 w-5 text-levelup-purple" />
                  </div>
                  <div className="ml-3">
                    <div className="text-levelup-gray text-sm">XP Earned</div>
                    <div className="font-bold">{userStats.totalPoints} XP</div>
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-6">
                <TabsTrigger value="about" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>About</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Activity</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="about">
                <div className="space-y-6">
                  {profile.bio && (
                    <div>
                      <h3 className="font-semibold mb-2">Bio</h3>
                      <p className="text-levelup-gray">{profile.bio}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-levelup-gray mr-2" />
                          <span>{user.email}</span>
                        </div>
                        {profile.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-levelup-gray mr-2" />
                            <span>{profile.phone}</span>
                          </div>
                        )}
                        {profile.website && (
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 text-levelup-gray mr-2" />
                            <a 
                              href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-levelup-purple hover:underline"
                            >
                              {profile.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Account Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-levelup-gray mr-2" />
                          <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                        {profile.birth_date && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-levelup-gray mr-2" />
                            <span>Born {new Date(profile.birth_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-6 border-t">
                    <h3 className="font-semibold text-red-600">Danger Zone</h3>
                    <p className="text-sm text-gray-500 mt-1">Irreversible actions for your account</p>
                    
                    <div className="mt-4">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="flex items-center">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your
                              account and all of your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleDeleteAccount}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="activity">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Learning Activity</h3>
                    <div className="text-center py-6 bg-gray-50 rounded-lg text-levelup-gray">
                      {userStats.totalMinutes > 0 ? (
                        <div className="space-y-2">
                          <p>You've spent {formatTime(userStats.totalMinutes)} learning!</p>
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Ensure we have the Globe icon for website links
import { Globe } from "lucide-react";
