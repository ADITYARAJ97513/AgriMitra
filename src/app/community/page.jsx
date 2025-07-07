
'use client';

import { useEffect } from 'react';
import React, { useState } from 'react';
import { MessageSquare, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { initialPosts } from '@/data/community-posts';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PostCard from '@/components/community/PostCard';

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

useEffect(() => {
  fetch('/api/community-posts')
    .then((res) => res.json())
    .then((data) => setPosts(data));
}, []);

  const [newQuestion, setNewQuestion] = useState('');

  const handleAskQuestion = async (e) => {
  e.preventDefault();
  if (!newQuestion.trim()) return;

  const res = await fetch('/api/community-posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      author: user?.username || 'Anonymous Farmer',
      question: newQuestion,
    }),
  });

  const newPost = await res.json();
  setPosts([newPost, ...posts]);
  setNewQuestion('');
};


 const handleAddAnswer = async (postId, answerText) => {
  const res = await fetch(`/api/community-posts/${postId}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      author: user?.username || 'Anonymous Farmer',
      answer: answerText,
    }),
  });

  const updatedPost = await res.json();

  console.log("🧪 Returned Post:", updatedPost); // <-- Add this

  setPosts(posts.map(post => post._id === postId ? updatedPost : post));
};



 

const handleDeletePost = async (postId) => {
  const confirmed = window.confirm("Are you sure you want to delete this question?");
  if (!confirmed) return;

  await fetch(`/api/community-posts/${postId}`, {
    method: 'DELETE',
  });

  setPosts(posts.filter(post => post._id !== postId));
};

  return (
    <div className="bg-gray-50/50 min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-12">
            <Users className="mx-auto h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold mt-4">Farmer Community Forum</h1>
            <p className="text-muted-foreground mt-2">Ask questions and get answers from fellow farmers and experts.</p>
        </div>

        {user ? (
            <Card className="mb-8 bg-white">
            <CardHeader>
                <CardTitle>Ask a New Question</CardTitle>
            </CardHeader>
            <form onSubmit={handleAskQuestion}>
                <CardContent className="space-y-4">
                <Textarea
                    placeholder="What's on your mind? Ask about crops, soil, pests, or anything related to farming..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    rows={4}
                    required
                />
                </CardContent>
                <CardFooter>
                <Button type="submit">Post Question</Button>
                </CardFooter>
            </form>
            </Card>
        ) : (
            <Alert className="mb-8 bg-white">
                <MessageSquare className="h-4 w-4" />
                <AlertTitle>Join the Conversation!</AlertTitle>
                <AlertDescription>
                    <Link href="/login" className="font-bold text-primary hover:underline">Log in</Link> or <Link href="/signup" className="font-bold text-primary hover:underline">sign up</Link> to ask questions and share your knowledge with the community.
                </AlertDescription>
            </Alert>
        )}
        
        <div className="space-y-6">
            {posts.map(post => (
            <PostCard 
                key={post._id} 
                post={post} 
                onAddAnswer={handleAddAnswer} 
                 
                onDelete={handleDeletePost}
            />
            ))}
        </div>
        </div>
    </div>
  );
}
