import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, Trash2, Image as ImageIcon, Grid3x3 } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const ASSET_TYPES = [
  { value: "thumbnail", label: "Thumbnail", description: "Product thumbnail" },
  { value: "preview", label: "Preview", description: "Product preview image" },
  { value: "promotional", label: "Promotional", description: "Marketing graphic" },
  { value: "other", label: "Other", description: "Other asset" },
];

export default function Assets() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [assetType, setAssetType] = useState<string>("thumbnail");
  const [file, setFile] = useState<File | null>(null);

  const { data: products } = trpc.products.list.useQuery();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    if (!file) {
      toast.error("Please select an image file");
      return;
    }

    // TODO: Implement actual file upload to S3 and create asset record
    toast.success("Asset uploaded successfully");
    setFile(null);
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Visual Assets</h2>
            <p className="text-slate-600 mt-1">Manage product images and promotional graphics</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Upload Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Visual Asset</DialogTitle>
                <DialogDescription>
                  Add images and graphics for your products
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleUpload} className="space-y-6">
                {/* Product Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Product *
                  </label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products?.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Asset Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Asset Type
                  </label>
                  <Select value={assetType} onValueChange={setAssetType}>
                    <SelectTrigger className="border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSET_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <p className="font-medium">{type.label}</p>
                            <p className="text-xs text-slate-500">{type.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">
                    Image File
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="asset-file-input"
                    />
                    <label htmlFor="asset-file-input" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">
                        {file ? file.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Upload Asset
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Asset Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Empty State */}
          <Card className="border-dashed md:col-span-2 lg:col-span-3">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Grid3x3 className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No assets yet
              </h3>
              <p className="text-slate-600 mb-6 text-center max-w-sm">
                Upload images and promotional graphics for your products
              </p>
              <Button
                onClick={() => setOpen(true)}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Upload Asset
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Asset Management Tips */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              Asset Management Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p>
              <strong>Thumbnails:</strong> Use square images (1000x1000px) for best results across all platforms
            </p>
            <p>
              <strong>Preview Images:</strong> Showcase product features with high-quality images (1920x1080px)
            </p>
            <p>
              <strong>Promotional Graphics:</strong> Create eye-catching designs for social media (1200x628px)
            </p>
            <p>
              <strong>File Format:</strong> PNG for transparency, JPG for photos, GIF for animations
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
