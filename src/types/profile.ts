
export interface ExtendedProfile {
  full_name: string;
  avatar_url: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  birth_date?: string;
  interests?: any; // Changed from any[] to any to accommodate JSON value from database
  education?: string;
  occupation?: string;
  created_at: string;
  updated_at: string;
  id: string;
  email?: string;
}
