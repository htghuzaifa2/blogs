import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function Comments() {
  return (
    <section aria-labelledby="comments-heading">
      <Card>
        <CardHeader>
          <CardTitle id="comments-heading" className="font-headline text-2xl">Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>Comments are powered by a third-party service.</p>
            <p className="text-sm">They will appear here once implemented.</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
