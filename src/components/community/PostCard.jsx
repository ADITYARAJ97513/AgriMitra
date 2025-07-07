'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function PostCard({ post, onAddAnswer, onDelete }) {
  const { user } = useAuth();
  const [answerText, setAnswerText] = useState('');

  const onAnswerSubmit = (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    onAddAnswer(post._id, answerText);
    setAnswerText('');
  };

  return (
    <Card className="bg-white">
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg">{post.question}</CardTitle>
          <CardDescription>
            Asked by <span className="font-semibold text-primary">{post.author}</span> • {post.timestamp}
          </CardDescription>
        </div>

        {user?.username === post.author && (
          <Button
            variant="destructive"
            size="sm"
            className="mt-1"
            onClick={() => onDelete(post._id)}
          >
            Delete
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {post.answers.map((answer, index) => (
          <div
            key={answer._id}
            className={`flex gap-4 ${index > 0 ? 'border-t pt-4' : ''}`}
          >
            <div className="flex-1">
              <p className="text-muted-foreground whitespace-pre-wrap">{answer.answer}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                Answer by <span className="font-semibold text-primary">{answer.author}</span> • {answer.timestamp}
              </div>
            </div>
          </div>
        ))}

        {post.answers.length === 0 && (
          <p className="text-muted-foreground text-sm">No answers yet. Be the first to help!</p>
        )}
      </CardContent>

      {user && (
        <CardFooter>
          <form onSubmit={onAnswerSubmit} className="w-full flex items-start gap-4">
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Write your answer..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" size="sm">
                Post Answer
              </Button>
            </div>
          </form>
        </CardFooter>
      )}
    </Card>
  );
}
