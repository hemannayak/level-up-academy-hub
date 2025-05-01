
import { useState, useEffect } from "react";
import { User, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function AvatarUpload() {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      downloadAvatar();
    }
  }, [user]);

  async function downloadAvatar() {
    try {
      const { data, error } = await supabase
        .storage
        .from('avatars')
        .download(`${user?.id}/avatar`);
        
      if (error) {
        console.log('No avatar found');
        return;
      }
      
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log('Error downloading avatar: ', error);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar`;
      
      // Upload to storage
      const { error: uploadError } = await supabase
        .storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user?.id);
        
      if (updateError) {
        throw updateError;
      }
      
      toast.success('Avatar updated successfully!');
      downloadAvatar();
    } catch (error: any) {
      toast.error('Error uploading avatar');
      console.log('Error uploading avatar: ', error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-levelup-purple">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt="User avatar" />
          ) : (
            <AvatarFallback className="bg-levelup-light-purple">
              <User className="h-12 w-12 text-levelup-purple" />
            </AvatarFallback>
          )}
        </Avatar>
        <label 
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-levelup-purple rounded-full p-1.5 cursor-pointer hover:bg-levelup-purple/90 transition-colors"
        >
          <Camera className="h-4 w-4 text-white" />
        </label>
        <Input 
          id="avatar-upload"
          type="file" 
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
      </div>

      <div>
        {uploading ? (
          <Button variant="outline" disabled>
            Uploading...
          </Button>
        ) : (
          <label htmlFor="avatar-upload">
            <Button variant="outline" className="cursor-pointer" asChild>
              <span>Change Avatar</span>
            </Button>
          </label>
        )}
      </div>
    </div>
  );
}
