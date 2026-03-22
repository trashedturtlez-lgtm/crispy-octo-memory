import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Twitter, Linkedin, Facebook, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const SOCIAL_PLATFORMS = [
  { id: "twitter", name: "Twitter/X", icon: Twitter, maxLength: 280, color: "text-blue-400" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, maxLength: 3000, color: "text-blue-700" },
  { id: "facebook", name: "Facebook", icon: Facebook, maxLength: 63206, color: "text-blue-600" },
];

export default function Marketing() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("twitter");
  const [postContent, setPostContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [mentions, setMentions] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: products } = trpc.products.list.useQuery();
  const { data: marketingContent } = trpc.marketing.list.useQuery(
    { productId: selectedProduct || 0 },
    { enabled: !!selectedProduct }
  );

  const createMarketing = trpc.marketing.create.useMutation({
    onSuccess: () => {
      toast.success("Marketing content created successfully");
      setPostContent("");
      setHashtags("");
      setMentions("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create marketing content");
    },
  });

  const currentPlatform = SOCIAL_PLATFORMS.find((p) => p.id === selectedPlatform);
  const charCount = postContent.length;
  const charLimit = currentPlatform?.maxLength || 280;
  const isOverLimit = charCount > charLimit;

  const handleSavePost = async () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    if (!postContent.trim()) {
      toast.error("Please enter post content");
      return;
    }

    createMarketing.mutate({
      productId: selectedProduct,
      platform: selectedPlatform as "twitter" | "linkedin" | "facebook",
      postContent,
      hashtags: hashtags || undefined,
      mentions: mentions || undefined,
    });
  };

  const handleCopyPost = () => {
    const fullPost = [postContent, hashtags, mentions].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(fullPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Marketing Automation</h2>
          <p className="text-slate-600 mt-1">Create and manage social media posts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Product Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                        selectedProduct === product.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <p className="font-medium text-slate-900 text-sm">{product.name}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 py-4">No products available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Post Creator */}
          <div className="lg:col-span-3 space-y-6">
            {selectedProduct ? (
              <>
                {/* Platform Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Select Platform</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger className="border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <SelectItem key={platform.id} value={platform.id}>
                            <div className="flex items-center gap-2">
                              <platform.icon className={`w-4 h-4 ${platform.color}`} />
                              {platform.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Post Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Post Content
                    </CardTitle>
                    <CardDescription>
                      Create engaging content for {currentPlatform?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="postContent">Post</Label>
                        <span
                          className={`text-xs font-medium ${
                            isOverLimit ? "text-red-600" : "text-slate-500"
                          }`}
                        >
                          {charCount} / {charLimit}
                        </span>
                      </div>
                      <Textarea
                        id="postContent"
                        placeholder="Write your post here..."
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        rows={6}
                        className={`border-slate-300 ${
                          isOverLimit ? "border-red-500" : ""
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hashtags">Hashtags</Label>
                        <Input
                          id="hashtags"
                          placeholder="#digital #product #marketing"
                          value={hashtags}
                          onChange={(e) => setHashtags(e.target.value)}
                          className="border-slate-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mentions">Mentions</Label>
                        <Input
                          id="mentions"
                          placeholder="@username @brand"
                          value={mentions}
                          onChange={(e) => setMentions(e.target.value)}
                          className="border-slate-300"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview */}
                <Card className="bg-slate-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                      <p className="text-sm text-slate-900 whitespace-pre-wrap break-words">
                        {postContent}
                      </p>
                      {hashtags && (
                        <p className="text-sm text-blue-600 mt-2">{hashtags}</p>
                      )}
                      {mentions && (
                        <p className="text-sm text-blue-600">{mentions}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleCopyPost}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Post
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleSavePost}
                    disabled={createMarketing.isPending || !postContent.trim() || isOverLimit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {createMarketing.isPending ? "Saving..." : "Save Post"}
                  </Button>
                </div>
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-slate-500">Select a product to create marketing content</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Marketing Tips */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Social Media Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p>
              <strong>Twitter/X:</strong> Keep posts concise, use relevant hashtags, and engage with your audience
            </p>
            <p>
              <strong>LinkedIn:</strong> Share insights and value, use professional tone, include call-to-action
            </p>
            <p>
              <strong>Facebook:</strong> Use engaging visuals, ask questions, and encourage sharing
            </p>
            <p>
              <strong>Best practices:</strong> Post consistently, respond to comments, and track engagement metrics
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
