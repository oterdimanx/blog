import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import BlogCard from "@/components/BlogCard";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const selectedCategory = searchParams.get("category");
  const { data: blogPosts, isLoading } = useBlogPosts();

  const categories = useMemo(() => {
    if (!blogPosts) return [];
    return Array.from(new Set(blogPosts.map((post) => post.category)));
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    if (!blogPosts) return [];
    return blogPosts.filter((post) => {
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, selectedCategory, searchQuery]);

  const handleCategorySelect = (category: string | null) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Welcome to BlogHub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover insightful articles about web development, design, and modern technology
          </p>
        </section>

        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-2">Loading posts...</h2>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-2">No posts found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 BlogHub. Built with React, TypeScript & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
