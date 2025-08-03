export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  imageHint: string;
  author: string;
  date: string;
}

const generatePostContent = (title: string) => `
<p class="lead text-lg text-muted-foreground mb-6">This is the introductory paragraph for the blog post titled "${title}". It sets the stage for the main content, providing a brief overview of what the reader can expect. We aim to make this engaging and informative.</p>

<h3 class="font-headline text-2xl font-bold mt-8 mb-4">Exploring the Core Idea</h3>
<p class="mb-4">Delving deeper into the topic, this section expands on the core concepts. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.</p>
<p class="mb-4">Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa.</p>

<blockquote class="border-l-4 border-primary pl-4 py-2 my-6">
  <p class="text-lg italic">"This is an inspiring quote relevant to the post's topic. It serves to break up the text and provide a moment of reflection for the reader."</p>
</blockquote>

<h3 class="font-headline text-2xl font-bold mt-8 mb-4">Further Analysis and Examples</h3>
<p class="mb-4">This part of the article provides further analysis, perhaps with concrete examples or case studies. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
<p class="mb-4">Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit.</p>

<h3 class="font-headline text-2xl font-bold mt-8 mb-4">Conclusion</h3>
<p class="mb-4">To wrap up, this concluding section summarizes the key takeaways from the blog post. It reinforces the main message and may suggest further reading or actions for the user. Sed non urna. Donec et ante. Phasellus eu ligula. Vestibulum sit amet purus. Vivamus hendrerit, dolor at aliquet laoreet, mauris turpis porttitor velit, faucibus interdum tellus libero ac justo. Vivamus non quam. In suscipit eget vel sapien.</p>
`;

const posts: Post[] = Array.from({ length: 20 }, (_, i) => {
    const id = i + 1;
    const title = `The Future of Technology: Post ${id}`;
    return {
        id: id,
        slug: `the-future-of-technology-post-${id}`,
        title: title,
        excerpt: 'A deep dive into the trends shaping our world. From AI to quantum computing, discover what lies ahead for humanity.',
        content: generatePostContent(title),
        imageUrl: `https://placehold.co/600x400`,
        imageHint: `technology future`,
        author: 'Huzi',
        date: new Date(Date.now() - (i * 3 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
    };
});

export const getPosts = (): Post[] => posts;

export const getPostBySlug = (slug: string): Post | undefined => posts.find(p => p.slug === slug);
