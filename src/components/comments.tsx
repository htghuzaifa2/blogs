
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CommentForm } from "./comment-form";

const mockComments = [
  {
    author: "Jane Doe",
    date: "August 2, 2024",
    text: "Great overview of web development! The distinction between front-end and back-end was particularly clear. Thanks for sharing.",
    avatarFallback: "JD"
  },
  {
    author: "John Smith",
    date: "August 3, 2024",
    text: "This is a fantastic resource for beginners. I appreciate how you broke down the core technologies. I'll be sharing this with my students.",
    avatarFallback: "JS"
  }
]


export function Comments() {
  return (
    <section aria-labelledby="comments-heading">
      <Card>
        <CardHeader>
          <CardTitle id="comments-heading" className="font-headline text-2xl">Comments ({mockComments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {mockComments.length > 0 ? (
            <div className="space-y-8">
              {mockComments.map((comment, index) => (
                <div key={index} className="flex gap-4">
                  <Avatar>
                    <AvatarFallback>{comment.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">{comment.date}</p>
                    </div>
                    <p className="text-muted-foreground mt-1">{comment.text}</p>
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
            <CommentForm />
          </div>

        </CardContent>
      </Card>
    </section>
  );
}
