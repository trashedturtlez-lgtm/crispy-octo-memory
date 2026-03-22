import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Share2, CheckCircle, AlertCircle, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const PLATFORMS = [
  { id: "gumroad", name: "Gumroad", icon: "🎵", color: "bg-red-50 border-red-200" },
  { id: "etsy", name: "Etsy", icon: "🛍️", color: "bg-yellow-50 border-yellow-200" },
  { id: "shopify", name: "Shopify", icon: "🏪", color: "bg-green-50 border-green-200" },
  { id: "lemonsqueezy", name: "LemonSqueezy", icon: "🍋", color: "bg-purple-50 border-purple-200" },
];

export default function Distribution() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set());

  const { data: products } = trpc.products.list.useQuery();
  const { data: platformConfigs } = trpc.platforms.getConfigs.useQuery(
    { productId: selectedProduct || 0 },
    { enabled: !!selectedProduct }
  );

  const togglePlatform = (platformId: string) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platformId)) {
      newSelected.delete(platformId);
    } else {
      newSelected.add(platformId);
    }
    setSelectedPlatforms(newSelected);
  };

  const handleDistribute = async () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    if (selectedPlatforms.size === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    // TODO: Implement actual distribution logic
    toast.success(`Distributing to ${selectedPlatforms.size} platform(s)...`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Distribution</h2>
          <p className="text-slate-600 mt-1">Manage product distribution across platforms</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Product</CardTitle>
                <CardDescription>Choose a product to distribute</CardDescription>
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
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{product.category}</p>
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 py-4">No products available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Platform Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Select Platforms
                </CardTitle>
                <CardDescription>Choose where to distribute your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PLATFORMS.map((platform) => (
                    <div
                      key={platform.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        platform.color
                      } ${
                        selectedPlatforms.has(platform.id)
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-current"
                      }`}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedPlatforms.has(platform.id)}
                          onChange={() => togglePlatform(platform.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{platform.icon} {platform.name}</p>
                          <p className="text-xs text-slate-600 mt-1">
                            {platform.id === "gumroad" && "Digital products marketplace"}
                            {platform.id === "etsy" && "Handmade & vintage marketplace"}
                            {platform.id === "shopify" && "E-commerce platform"}
                            {platform.id === "lemonsqueezy" && "Digital product platform"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleDistribute}
                  disabled={!selectedProduct || selectedPlatforms.size === 0}
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700 mt-6"
                >
                  <Send className="w-4 h-4" />
                  Distribute to {selectedPlatforms.size} Platform{selectedPlatforms.size !== 1 ? "s" : ""}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Distribution Status */}
        {selectedProduct && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Distribution Status</CardTitle>
              <CardDescription>Real-time sync status across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {PLATFORMS.map((platform) => (
                  <div
                    key={platform.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{platform.icon}</span>
                      <div>
                        <p className="font-medium text-slate-900">{platform.name}</p>
                        <p className="text-xs text-slate-500">Last synced: Never</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Platform Configuration Tips */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Platform Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p>
              <strong>Before distributing:</strong> Make sure your product has a title, description, and at least one image
            </p>
            <p>
              <strong>Platform-specific settings:</strong> Each platform may require different pricing, descriptions, or formats
            </p>
            <p>
              <strong>Automatic sync:</strong> Once configured, your product will sync automatically when you make updates
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
