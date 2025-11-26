import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image,
  Code,
  Quote,
  HelpCircle,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface MarkdownToolbarProps {
  onInsert: (syntax: string) => void;
}

const MarkdownToolbar = ({ onInsert }: MarkdownToolbarProps) => {
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  const tools = [
    { icon: Bold, label: "Bold", syntax: "**text**" },
    { icon: Italic, label: "Italic", syntax: "*text*" },
    { icon: Heading1, label: "Heading 1", syntax: "# Heading" },
    { icon: Heading2, label: "Heading 2", syntax: "## Heading" },
    { icon: List, label: "Bullet List", syntax: "- List item" },
    { icon: ListOrdered, label: "Numbered List", syntax: "1. List item" },
    { icon: LinkIcon, label: "Link", syntax: "[link text](https://example.com)" },
    { icon: Image, label: "Image", syntax: "![alt text](https://example.com/image.jpg)" },
    { icon: Code, label: "Code Block", syntax: "```\ncode here\n```" },
    { icon: Quote, label: "Quote", syntax: "> Quote text" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-2 bg-muted rounded-lg border">
        {tools.map((tool) => (
          <Button
            key={tool.label}
            variant="ghost"
            size="sm"
            onClick={() => onInsert(tool.syntax)}
            title={tool.label}
            className="h-8 w-8 p-0"
          >
            <tool.icon className="h-4 w-4" />
          </Button>
        ))}
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCheatSheet(!showCheatSheet)}
            title="Markdown Help"
            className="h-8 px-2"
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            Help
          </Button>
        </div>
      </div>

      <Collapsible open={showCheatSheet} onOpenChange={setShowCheatSheet}>
        <CollapsibleContent className="space-y-2">
          <div className="p-4 bg-muted rounded-lg border text-sm">
            <h3 className="font-semibold mb-3">Markdown Cheat Sheet</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-xs text-muted-foreground">Bold</p>
                  <code className="text-xs">**bold text**</code>
                </div>
                <div>
                  <p className="font-medium text-xs text-muted-foreground">Italic</p>
                  <code className="text-xs">*italic text*</code>
                </div>
                <div>
                  <p className="font-medium text-xs text-muted-foreground">Headings</p>
                  <code className="text-xs block"># H1</code>
                  <code className="text-xs block">## H2</code>
                  <code className="text-xs block">### H3</code>
                </div>
                <div>
                  <p className="font-medium text-xs text-muted-foreground">Link</p>
                  <code className="text-xs">[text](url)</code>
                </div>
                <div>
                  <p className="font-medium text-xs text-muted-foreground">Image</p>
                  <code className="text-xs">![alt](image-url)</code>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-xs text-muted-foreground">Bullet List</p>
                  <code className="text-xs block">- Item 1</code>
                  <code className="text-xs block">- Item 2</code>
                </div>
                <div>
                  <p className="font-medium text-xs text-muted-foreground">Numbered List</p>
                  <code className="text-xs block">1. Item 1</code>
                  <code className="text-xs block">2. Item 2</code>
                </div>
                <div>
                  <p className="font-medium text-xs text-muted-foreground">Code Block</p>
                  <code className="text-xs">```language</code>
                  <code className="text-xs block">code here</code>
                  <code className="text-xs">```</code>
                </div>
                <div>
                  <p className="font-medium text-xs text-muted-foreground">Blockquote</p>
                  <code className="text-xs">&gt; Quote text</code>
                </div>
                <div>
                  <p className="font-medium text-xs text-muted-foreground">Inline Code</p>
                  <code className="text-xs">`code`</code>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default MarkdownToolbar;
