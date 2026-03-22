import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const PLATFORMS = [
  { id: "gumroad", name: "Gumroad", currency: "USD" },
  { id: "etsy", name: "Etsy", currency: "USD" },
  { id: "shopify", name: "Shopify", currency: "USD" },
  { id: "lemonsqueezy", name: "LemonSqueezy", currency: "USD" },
];

export default function Pricing() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [prices, setPrices] = useState({
    basePrice: "",
    baseCurrency: "USD",
    gumroadPrice: "",
    etsyPrice: "",
    shopifyPrice: "",
    lemonsqueezyPrice: "",
  });

  const { data: products } = trpc.products.list.useQuery();
  const { data: pricing } = trpc.pricing.get.useQuery(
    { productId: selectedProduct || 0 },
    { enabled: !!selectedProduct }
  );

  const updatePricing = trpc.pricing.update.useMutation({
    onSuccess: () => {
      toast.success("Pricing updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update pricing");
    },
  });

  const handleSavePricing = async () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }

    if (!prices.basePrice) {
      toast.error("Please enter a base price");
      return;
    }

    updatePricing.mutate({
      productId: selectedProduct,
      ...prices,
    });
  };

  const handleBasePriceChange = (value: string) => {
    setPrices({ ...prices, basePrice: value });
    // Auto-fill platform prices if empty
    if (!prices.gumroadPrice) {
      setPrices((p) => ({ ...p, gumroadPrice: value }));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Pricing Configuration</h2>
          <p className="text-slate-600 mt-1">Set prices for each platform</p>
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
                      onClick={() => {
                        setSelectedProduct(product.id);
                        setPrices({
                          basePrice: "",
                          baseCurrency: "USD",
                          gumroadPrice: "",
                          etsyPrice: "",
                          shopifyPrice: "",
                          lemonsqueezyPrice: "",
                        });
                      }}
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

          {/* Pricing Configuration */}
          <div className="lg:col-span-3 space-y-6">
            {selectedProduct ? (
              <>
                {/* Base Price */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Base Price
                    </CardTitle>
                    <CardDescription>Set your base price for all platforms</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="basePrice">Price</Label>
                        <div className="flex gap-2">
                          <span className="flex items-center px-3 bg-slate-100 rounded-lg text-slate-600">
                            $
                          </span>
                          <Input
                            id="basePrice"
                            type="number"
                            step="0.01"
                            placeholder="29.99"
                            value={prices.basePrice}
                            onChange={(e) => handleBasePriceChange(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="baseCurrency">Currency</Label>
                        <Input
                          id="baseCurrency"
                          value={prices.baseCurrency}
                          disabled
                          className="bg-slate-100"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Platform-Specific Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Platform-Specific Pricing
                    </CardTitle>
                    <CardDescription>Customize prices for each platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {PLATFORMS.map((platform) => (
                        <div key={platform.id} className="space-y-2">
                          <Label htmlFor={platform.id}>{platform.name}</Label>
                          <div className="flex gap-2">
                            <span className="flex items-center px-3 bg-slate-100 rounded-lg text-slate-600">
                              $
                            </span>
                            <Input
                              id={platform.id}
                              type="number"
                              step="0.01"
                              placeholder={prices.basePrice || "0.00"}
                              value={prices[`${platform.id}Price` as keyof typeof prices] || ""}
                              onChange={(e) =>
                                setPrices({
                                  ...prices,
                                  [`${platform.id}Price`]: e.target.value,
                                })
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button */}
                <Button
                  onClick={handleSavePricing}
                  disabled={updatePricing.isPending || !prices.basePrice}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {updatePricing.isPending ? "Saving..." : "Save Pricing"}
                </Button>
              </>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-slate-500">Select a product to configure pricing</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Pricing Tips */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Pricing Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <p>
              <strong>Competitive pricing:</strong> Research similar products on each platform to set competitive prices
            </p>
            <p>
              <strong>Platform fees:</strong> Consider platform fees when setting prices (Etsy: 6.5%, Gumroad: 10%, etc.)
            </p>
            <p>
              <strong>Currency conversion:</strong> Prices are automatically converted for international platforms
            </p>
            <p>
              <strong>Discounts:</strong> You can set different prices per platform to run promotions
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
