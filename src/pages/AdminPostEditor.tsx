import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlogPost } from "@/hooks/useBlogPosts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import MarkdownToolbar from "@/components/MarkdownToolbar";

const AdminPostEditor = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const { isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();
  const { data: existingPost } = useBlogPost(id || "");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/auth");
    }
  }, [isAdmin, loading, user, navigate]);

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setExcerpt(existingPost.excerpt);
      setContent(existingPost.content);
      setCategory(existingPost.category);
      setTags(existingPost.tags.join(", "));
      setCoverImage(existingPost.cover_image || "");
      setReadingTime(existingPost.reading_time);
      setIsPublished(existingPost.is_published);
    }
  }, [existingPost]);

  // Check for draft on mount
  useEffect(() => {
    const draftKey = `blog-draft-${id || 'new'}`;
    const savedDraft = localStorage.getItem(draftKey);
    
    if (savedDraft && !existingPost) {
      try {
        const draft = JSON.parse(savedDraft);
        const shouldRestore = window.confirm(
          "Found an unsaved draft. Would you like to restore it?"
        );
        
        if (shouldRestore) {
          setTitle(draft.title || "");
          setExcerpt(draft.excerpt || "");
          setContent(draft.content || "");
          setCategory(draft.category || "");
          setTags(draft.tags || "");
          setCoverImage(draft.coverImage || "");
          setReadingTime(draft.readingTime || 5);
          setIsPublished(draft.isPublished || false);
          toast.success("Draft restored!");
        }
      } catch (error) {
        console.error("Failed to restore draft:", error);
      }
    }
  }, [id, existingPost]);

  // Auto-save to localStorage with debounce
  useEffect(() => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Mark as unsaved when content changes
    setSaveStatus("unsaved");

    // Set up debounced save
    autoSaveTimerRef.current = setTimeout(() => {
      const draftKey = `blog-draft-${id || 'new'}`;
      const draft = {
        title,
        excerpt,
        content,
        category,
        tags,
        coverImage,
        readingTime,
        isPublished,
        timestamp: new Date().toISOString(),
      };

      try {
        localStorage.setItem(draftKey, JSON.stringify(draft));
        setSaveStatus("saving");
        
        setTimeout(() => {
          setSaveStatus("saved");
        }, 500);
      } catch (error) {
        console.error("Failed to auto-save:", error);
        toast.error("Failed to auto-save draft");
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, excerpt, content, category, tags, coverImage, readingTime, isPublished, id]);

  const handleInsertMarkdown = (syntax: string) => {
    if (!contentRef.current) return;

    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = "";
    let cursorOffset = 0;

    // Handle different syntax types
    if (syntax.includes("text")) {
      // For bold, italic - wrap selected text
      newText = syntax.replace("text", selectedText || "text");
      cursorOffset = selectedText ? newText.length : syntax.indexOf("text");
    } else if (syntax.includes("\n")) {
      // For code blocks, add new lines
      newText = "\n" + syntax + "\n";
      cursorOffset = syntax.indexOf("code") !== -1 ? syntax.indexOf("code") + 1 : syntax.length + 1;
    } else {
      // For headings, lists, quotes
      newText = (start === 0 || content[start - 1] === "\n" ? "" : "\n") + syntax;
      cursorOffset = newText.length;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      const markdownSyntax = `![${file.name}](${imageUrl})`;
      
      // Insert at cursor position
      if (contentRef.current) {
        const start = contentRef.current.selectionStart;
        const newContent = content.substring(0, start) + '\n' + markdownSyntax + '\n' + content.substring(start);
        setContent(newContent);
        
        setTimeout(() => {
          contentRef.current?.focus();
        }, 0);
      }
      
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      toast.error('No image files found in drop');
      return;
    }

    // Upload all images
    for (const file of imageFiles) {
      await handleImageUpload(file);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith('image/'));

    if (imageItems.length > 0) {
      e.preventDefault();
      
      for (const item of imageItems) {
        const file = item.getAsFile();
        if (file) {
          await handleImageUpload(file);
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for Ctrl/Cmd key combinations
    const isMod = e.ctrlKey || e.metaKey;
    
    if (!isMod) return;

    const shortcuts: Record<string, string> = {
      'b': '**text**',           // Ctrl+B: Bold
      'i': '*text*',             // Ctrl+I: Italic
      'k': '[text](url)',        // Ctrl+K: Link
      'e': '`text`',             // Ctrl+E: Inline code
      '`': '```\ncode\n```',     // Ctrl+`: Code block
      'q': '> text',             // Ctrl+Q: Quote
    };

    const syntax = shortcuts[e.key.toLowerCase()];
    
    if (syntax) {
      e.preventDefault();
      handleInsertMarkdown(syntax);
    }

    // Handle heading shortcuts (Ctrl+1, Ctrl+2, etc.)
    if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
      e.preventDefault();
      const level = '#'.repeat(parseInt(e.key));
      handleInsertMarkdown(`${level} Heading`);
    }
  };

  const handleSave = async () => {
    if (!title || !excerpt || !content || !category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);

    const postData = {
      title,
      excerpt,
      content,
      category,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      cover_image: coverImage || null,
      reading_time: readingTime,
      is_published: isPublished,
      author_name: user?.email?.split("@")[0] || "Admin",
      author_avatar: null,
    };

    try {
      if (isNew) {
        const { error } = await supabase.from("blog_posts").insert([postData]);
        if (error) throw error;
        toast.success("Post created successfully!");
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", id);
        if (error) throw error;
        toast.success("Post updated successfully!");
      }
      
      // Clear draft from localStorage on successful save
      const draftKey = `blog-draft-${id || 'new'}`;
      localStorage.removeItem(draftKey);
      
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" asChild>
              <Link to="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {saveStatus === "saving" && "Saving draft..."}
                {saveStatus === "saved" && "Draft saved"}
                {saveStatus === "unsaved" && "Unsaved changes"}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? "Edit" : "Preview"}
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Post"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{isNew ? "Create New Post" : "Edit Post"}</CardTitle>
          </CardHeader>
          <CardContent>
            {showPreview ? (
              <div className="prose prose-lg max-w-none">
                <h1>{title}</h1>
                <p className="text-muted-foreground">{excerpt}</p>
                <ReactMarkdown
                  components={{
                    img: ({ src, alt }) => (
                      <img
                        src={src}
                        alt={alt}
                        className="rounded-lg w-full my-6 object-cover"
                      />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description of the post"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content (Markdown) *</Label>
                  <MarkdownToolbar onInsert={handleInsertMarkdown} />
                  <div
                    className={`relative ${isDragging ? 'ring-2 ring-primary' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <Textarea
                      ref={contentRef}
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onPaste={handlePaste}
                      placeholder="Write your post content in Markdown..."
                      rows={15}
                      className="font-mono"
                      disabled={uploading}
                    />
                    {isDragging && (
                      <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-md flex items-center justify-center pointer-events-none">
                        <p className="text-primary font-semibold">Drop images here</p>
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <p className="text-foreground font-semibold">Uploading image...</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Drag & drop images, paste from clipboard, or use shortcuts: Ctrl+B (bold), Ctrl+I (italic), Ctrl+K (link), Ctrl+E (code), Ctrl+` (code block), Ctrl+Q (quote), Ctrl+1-6 (headings)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g., React, Design, TypeScript"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="readingTime">Reading Time (minutes) *</Label>
                    <Input
                      id="readingTime"
                      type="number"
                      value={readingTime}
                      onChange={(e) => setReadingTime(parseInt(e.target.value))}
                      min={1}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="react, hooks, performance"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                  />
                  <Label htmlFor="isPublished">
                    Publish this post (make it visible to everyone)
                  </Label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPostEditor;
