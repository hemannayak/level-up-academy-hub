
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Trash2, Calendar, Mail, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtendedProfile } from "@/types/profile";
import { User } from "@supabase/supabase-js";

interface AboutTabProps {
  profile: ExtendedProfile;
  user: User;
  handleDeleteAccount: () => Promise<void>;
}

export default function AboutTab({ profile, user, handleDeleteAccount }: AboutTabProps) {
  return (
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
  );
}
