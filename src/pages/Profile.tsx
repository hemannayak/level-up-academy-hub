
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, FileText } from "lucide-react";
import { ExtendedProfile } from "@/types/profile";

// Import the component files we just created
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import AboutTab from "@/components/profile/AboutTab";
import ActivityTab from "@/components/profile/ActivityTab";

export default function Profile() {
  const navigate = useNavigate();
  const { user, supabase, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<ExtendedProfile>({
    full_name: "",
    avatar_url: "",
    bio: "",
    location: "",
    website: "",
    phone: "",
    birth_date: "",
    interests: [],
    education: "",
    occupation: "",
    created_at: "",
    updated_at: "",
    id: "",
    email: user?.email
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
        // Create a complete profile object with default values for missing fields
        const completeProfile: ExtendedProfile = {
          full_name: data.full_name || "",
          avatar_url: data.avatar_url || "",
          bio: data.bio || "",
          location: data.location || "",
          website: data.website || "",
          phone: data.phone || "",
          birth_date: data.birth_date || "",
          interests: data.interests || [],
          education: data.education || "",
          occupation: data.occupation || "",
          created_at: data.created_at,
          updated_at: data.updated_at,
          id: data.id,
          email: user.email
        };
        
        setProfile(completeProfile);
        
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="levelup-container py-8">
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            {/* Profile Header Component */}
            <ProfileHeader 
              profile={profile}
              loading={loading}
              handleLogout={handleLogout}
              handleUpdateProfile={handleUpdateProfile}
            />
            
            {/* Profile Stats Component */}
            <ProfileStats
              totalMinutes={userStats.totalMinutes}
              totalCourses={userStats.totalCourses}
              totalPoints={userStats.totalPoints}
            />
            
            {/* Profile Tabs */}
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
                <AboutTab 
                  profile={profile}
                  user={user}
                  handleDeleteAccount={handleDeleteAccount}
                />
              </TabsContent>
              
              <TabsContent value="activity">
                <ActivityTab totalMinutes={userStats.totalMinutes} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
