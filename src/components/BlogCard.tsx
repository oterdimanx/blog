import { Link } from "react-router-dom";
import { BlogPost } from "@/hooks/useBlogPosts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Clock, Calendar } from "lucide-react";
import { generateSlug } from "@/lib/slug";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  const slug = generateSlug(post.title, post.id);
  
  return (
    <Link to={`/post/${slug}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] duration-300 overflow-hidden">
        {post.cover_image && (
          <AspectRatio ratio={16 / 9} className="bg-muted">
            <img
              src={post.cover_image}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        )}
        <CardHeader>
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author_avatar || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {post.author_name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{post.author_name}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.published_at).toLocaleDateString('en-US', { 
                    month: 'short', 
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
          <h2 className="text-2xl font-bold leading-tight hover:text-primary transition-colors">
            {post.title}
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Badge variant="secondary">{post.category}</Badge>
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BlogCard;