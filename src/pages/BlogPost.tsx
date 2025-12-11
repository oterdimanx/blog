import { useParams, Link } from "react-router-dom";
import { useBlogPost } from "@/hooks/useBlogPosts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/Header";
import ReactMarkdown from "react-markdown";
import { extractIdFromSlug } from "@/lib/slug";

const BlogPost = () => {
  const { slug } = useParams();
  const id = slug ? extractIdFromSlug(slug) : "";
  const { data: post, isLoading } = useBlogPost(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all posts
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{post.category}</Badge>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {post.cover_image && (
            <AspectRatio ratio={16 / 9} className="mb-6 rounded-lg overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="object-cover w-full h-full"
              />
            </AspectRatio>
          )}
          
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author_avatar || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {post.author_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{post.author_name}</p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.published_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.reading_time} min read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>,
              p: ({ children }) => <p className="mb-4 leading-relaxed text-foreground">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
              code: ({ children, className }) => {
                const isBlock = className?.includes('language-');
                return isBlock ? (
                  <code className="block bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
                    {children}
                  </code>
                ) : (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{children}</code>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                  {children}
                </blockquote>
              ),
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt}
                  className="rounded-lg w-full my-6 object-cover"
                />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <footer className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarImage src={post.author_avatar || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {post.author_name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Written by</p>
                <p className="font-semibold text-lg">{post.author_name}</p>
              </div>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogPost;