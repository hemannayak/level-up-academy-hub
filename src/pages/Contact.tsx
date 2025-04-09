
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, Mail, Phone, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  category: z.enum(["general", "courses", "technical", "improvement", "other"], {
    required_error: "Please select a category.",
  }),
});

export default function Contact() {
  const { toast: shadowToast } = useToast();
  const [submissionStep, setSubmissionStep] = useState(0);
  const [feedbackTips, setFeedbackTips] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "general",
    },
  });
  
  const watchCategory = form.watch("category");
  const watchMessage = form.watch("message");
  
  // Provide real-time feedback based on message content and category
  const updateFeedbackTips = (message: string, category: string) => {
    if (message.length < 20) {
      setFeedbackTips("Your message is quite short. Adding more details helps us understand your situation better.");
      return;
    }
    
    switch(category) {
      case "courses":
        if (message.toLowerCase().includes("difficult") || message.toLowerCase().includes("hard")) {
          setFeedbackTips("Consider mentioning specific course sections or concepts you're finding challenging.");
        } else if (message.toLowerCase().includes("suggestion")) {
          setFeedbackTips("Including specific examples for course improvements is very helpful!");
        } else {
          setFeedbackTips("Adding the course name and specific modules will help us provide better assistance.");
        }
        break;
      case "technical":
        setFeedbackTips("Including your browser/device information and steps to reproduce the issue will help us resolve it faster.");
        break;
      case "improvement":
        setFeedbackTips("Specific suggestions on what skills you want to improve will allow us to provide tailored guidance.");
        break;
      default:
        if (message.length > 50) {
          setFeedbackTips("Your detailed message will help us respond more effectively. Thank you!");
        } else {
          setFeedbackTips("Consider adding more details to help us understand your feedback better.");
        }
    }
  };
  
  // Update feedback tips whenever category or message changes
  useState(() => {
    if (watchMessage && watchCategory) {
      updateFeedbackTips(watchMessage, watchCategory);
    }
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Simulate submission steps
    setSubmissionStep(1);
    
    // In a real app, you would send this data to your backend
    setTimeout(() => {
      setSubmissionStep(2);
      toast.success("Feedback submitted successfully!", {
        description: "We'll respond to your message shortly.",
        duration: 5000,
      });
      
      shadowToast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve our platform.",
      });
      
      form.reset();
      setSubmissionStep(0);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-12 bg-gray-50">
        <div className="levelup-container">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-levelup-dark-blue mb-2">Contact Us & Feedback</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions or feedback about your learning journey? We're here to help you improve and succeed.
              Share your thoughts, and we'll provide personalized guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4 text-levelup-purple">
                  <Mail className="mr-2" size={24} />
                  <h3 className="text-lg font-semibold">Email</h3>
                </div>
                <p className="text-gray-600">info@leveluplearning.com</p>
                <p className="text-gray-600 mt-2">support@leveluplearning.com</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4 text-levelup-purple">
                  <MapPin className="mr-2" size={24} />
                  <h3 className="text-lg font-semibold">Location</h3>
                </div>
                <p className="text-gray-600">Team17, 2nd year CSD-B, HITAM</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4 text-levelup-purple">
                  <Phone className="mr-2" size={24} />
                  <h3 className="text-lg font-semibold">Phone</h3>
                </div>
                <p className="text-gray-600">+91-XXXXXXXX</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-levelup-dark-blue">Send Us Your Feedback</h2>
              
              {feedbackTips && (
                <Alert className="mb-6 bg-blue-50 border-blue-200">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <AlertTitle className="text-blue-700">Real-time Guidance</AlertTitle>
                  <AlertDescription className="text-blue-600">
                    {feedbackTips}
                  </AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Subject of your message" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feedback Category</FormLabel>
                        <FormControl>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (watchMessage) {
                                updateFeedbackTips(watchMessage, e.target.value);
                              }
                            }}
                          >
                            <option value="general">General Inquiry</option>
                            <option value="courses">Course Feedback</option>
                            <option value="technical">Technical Issue</option>
                            <option value="improvement">Learning Improvement</option>
                            <option value="other">Other</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Your message or feedback" 
                            className="min-h-[120px]" 
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value && watchCategory) {
                                updateFeedbackTips(e.target.value, watchCategory);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="bg-levelup-purple hover:bg-levelup-purple/90" 
                    disabled={submissionStep > 0}
                  >
                    {submissionStep === 1 ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </form>
              </Form>
            </div>
            
            <div className="lg:pl-12">
              <h2 className="text-2xl font-semibold mb-6 text-levelup-dark-blue">Learning Growth Tips</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-lg font-medium mb-3 text-levelup-purple">Track Your Progress</h3>
                  <p className="text-gray-600">
                    Regularly review your course completion and quiz scores to identify areas where you're excelling and where you need more focus.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-lg font-medium mb-3 text-levelup-purple">Apply Active Learning</h3>
                  <p className="text-gray-600">
                    Don't just passively watch lessons. Take notes, create summaries, and try to explain concepts in your own words to deepen understanding.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-lg font-medium mb-3 text-levelup-purple">Join Study Groups</h3>
                  <p className="text-gray-600">
                    Collaborate with fellow learners through our community features. Explaining concepts to others is one of the best ways to solidify your knowledge.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-lg font-medium mb-3 text-levelup-purple">Request Personalized Feedback</h3>
                  <p className="text-gray-600">
                    Use the form to ask for specific guidance on your learning journey. Our team can provide tailored advice based on your goals.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 bg-levelup-light-blue/20 p-6 rounded-lg border border-levelup-light-blue">
                <h3 className="text-lg font-medium mb-3 text-levelup-dark-blue">Need Urgent Help?</h3>
                <p className="mb-4">
                  For immediate assistance with technical issues or course content questions, check our:
                </p>
                <div className="flex flex-col space-y-2">
                  <Link to="/faq" className="text-levelup-purple hover:underline font-medium">FAQ Page</Link>
                  <a href="#" className="text-levelup-purple hover:underline font-medium">Knowledge Base</a>
                  <a href="#" className="text-levelup-purple hover:underline font-medium">Community Forum</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
