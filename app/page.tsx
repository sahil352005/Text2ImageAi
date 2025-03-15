
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImageUrl(`${data.imageUrl}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI Image Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transform your imagination into stunning visuals using the power of AI
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="p-8 bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Describe your image
                </label>
                <Textarea
                  placeholder="A stunning mountain landscape at sunset with a mystical aurora in the sky..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[200px] bg-gray-900/50 border-white/10 text-white placeholder:text-gray-500 text-lg focus:border-purple-500 transition-colors"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity text-lg py-6"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating magic...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Wand2 className="w-5 h-5" />
                    <span>Generate Image</span>
                  </div>
                )}
              </Button>
            </form>
          </Card>

          {/* Output Section */}
          <Card className="p-8 bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Your Creation</h2>
              {imageUrl ? (
                <div className="aspect-square relative overflow-hidden rounded-xl ring-1 ring-white/20">
                  <img
                    src={imageUrl}
                    alt="AI generated image"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-gray-900/30">
                  <p className="text-gray-400 text-center px-4">
                    Your masterpiece will appear here
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}