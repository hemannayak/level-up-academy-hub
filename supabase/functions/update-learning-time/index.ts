
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = "https://dnyttbkbmvjwvauhzjtc.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface TimeUpdateRequest {
  userId: string;
  minutesSpent: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { userId, minutesSpent } = await req.json() as TimeUpdateRequest;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if user already has a learning_time record
    const { data: existingRecord, error: fetchError } = await supabase
      .from("learning_time")
      .select()
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 is "no rows returned"
      console.error("Error fetching learning time:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch learning time data" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const today = new Date().toISOString();
    let updatedStreak = 0;
    let updatedTotalMinutes = minutesSpent;
    
    if (existingRecord) {
      updatedTotalMinutes = existingRecord.total_minutes + minutesSpent;
      
      // Check if we need to update the streak
      const lastUpdateDate = new Date(existingRecord.last_streak_update);
      const currentDate = new Date();
      
      // Reset date times to compare just the dates
      lastUpdateDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      // Calculate the difference in days
      const diffTime = Math.abs(currentDate.getTime() - lastUpdateDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day, increase streak
        updatedStreak = existingRecord.streak_days + 1;
      } else if (diffDays > 1) {
        // Streak broken, reset to 1 for today
        updatedStreak = 1;
      } else {
        // Same day, maintain streak
        updatedStreak = existingRecord.streak_days;
      }

      // Update existing record
      const { error: updateError } = await supabase
        .from("learning_time")
        .update({
          total_minutes: updatedTotalMinutes,
          last_active: today,
          streak_days: updatedStreak,
          last_streak_update: new Date().toISOString().split("T")[0], // Just the date part
          updated_at: today,
        })
        .eq("id", existingRecord.id);

      if (updateError) {
        console.error("Error updating learning time:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update learning time" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from("learning_time")
        .insert({
          user_id: userId,
          total_minutes: minutesSpent,
          streak_days: 1,
          last_active: today,
          last_streak_update: new Date().toISOString().split("T")[0], // Just the date part
        });

      if (insertError) {
        console.error("Error creating learning time record:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to create learning time record" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      updatedStreak = 1;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        totalMinutes: updatedTotalMinutes,
        streak: updatedStreak
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in update-learning-time function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
