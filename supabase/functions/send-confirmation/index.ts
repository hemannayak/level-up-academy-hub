
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = "https://dnyttbkbmvjwvauhzjtc.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface EmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  userId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { name, email, subject, message, category, userId } = await req.json() as EmailRequest;

    // Store submission in database
    const { data: submission, error: submissionError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        subject,
        message,
        category,
        user_id: userId || null,
      })
      .select('id')
      .single();

    if (submissionError) {
      console.error("Error storing submission:", submissionError);
      return new Response(
        JSON.stringify({ error: "Failed to store contact submission" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create email content
    const emailSubject = `LevelUp Learning: Thank you for your ${category} feedback`;
    const emailBody = `
      <h2>Thank you for contacting LevelUp Learning, ${name}!</h2>
      <p>We've received your message regarding: <strong>${subject}</strong></p>
      <p>Our team will review your feedback and get back to you shortly.</p>
      <p>For reference, here's a copy of your message:</p>
      <blockquote style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #6b46c1;">
        ${message}
      </blockquote>
      <p>Best regards,<br>The LevelUp Learning Team</p>
    `;

    // Store email in database
    const { error: emailError } = await supabase
      .from("contact_emails")
      .insert({
        submission_id: submission.id,
        email_to: email,
        email_subject: emailSubject,
        email_body: emailBody,
      });

    if (emailError) {
      console.error("Error storing email data:", emailError);
      // Continue anyway as this is just for tracking
    }

    // In a real application, we would integrate with an email service here
    console.log(`Email would be sent to ${email} with subject: ${emailSubject}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Thank you! We've received your message and will get back to you soon."
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in send-confirmation function:", error);
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
