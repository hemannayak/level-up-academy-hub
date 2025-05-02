
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, MapPin, SettingsIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AvatarUpload from "./AvatarUpload";
import { toast } from "sonner";
import { ExtendedProfile } from "@/types/profile";

interface ProfileHeaderProps {
  profile: ExtendedProfile;
  loading: boolean;
  handleLogout: () => Promise<void>;
  handleUpdateProfile: (values: any) => Promise<void>;
}

export default function ProfileHeader({ profile, loading, handleLogout, handleUpdateProfile }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
      <div className="relative">
        <AvatarUpload />
      </div>
      
      <div>
        <h1 className="text-2xl font-bold">{profile.full_name || profile.email?.split('@')[0]}</h1>
        <p className="text-levelup-gray">{profile.email}</p>
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
  );
}
