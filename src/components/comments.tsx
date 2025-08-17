
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { CommentForm } from "./comment-form";
import type { z } from "zod";
import { formSchema } from "./comment-form";

export interface Comment {
  name: string;
  comment: string;
  avatarFallback: string;
}

export function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);

  const handleCommentSubmit = (values: z.infer<typeof formSchema>) => {
    const newComment: Comment = {
      name: values.name,
      comment: values.comment,
      avatarFallback: values.name.substring(0, 2).toUpperCase(),
    };
    setComments([newComment, ...comments]);
  };

  return (
    <>
      <section aria-labelledby="comments-heading">
        <Card>
          <CardHeader>
            <CardTitle id="comments-heading" className="font-headline text-2xl">Comments ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {comments.length > 0 ? (
              <div className="space-y-8">
                {comments.map((comment, index) => (
                  <div key={index} className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>{comment.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{comment.name}</p>
                      </div>
                      <p className="text-muted-foreground mt-1">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}

            <hr className="my-8" />
            
            <div>
              <h3 className="text-lg font-headline font-semibold mb-4">Leave a Comment</h3>
              <CommentForm onCommentSubmit={handleCommentSubmit} />
            </div>

          </CardContent>
        </Card>
      </section>
    </>
  );
}
