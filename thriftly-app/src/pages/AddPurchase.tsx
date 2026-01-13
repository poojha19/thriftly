import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import LiquidBackground from "@/components/ui/LiquidBackground";
import thriftlyLogo from "@/assets/thriftly_logo.png";
import mangoTop from "@/assets/mango_top.png"

const AddPurchase = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const analyzeUrl = async (inputUrl: string) => {
    if (!inputUrl) return;
    
    setIsAnalyzing(true);
    setShowPreview(false);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsAnalyzing(false);
    setShowPreview(true);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    if (newUrl) {
      analyzeUrl(newUrl);
    } else {
      setShowPreview(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get current user from localStorage
      const userData = localStorage.getItem("thriftly_user");
      if (!userData) {
        toast.error("User data not found. Please sign in again.");
        navigate("/auth");
        return;
      }

      const user = JSON.parse(userData);

      // Hardcoded values for now (will be scraped from URL in future)
      const purchaseData = {
        user_id: user.id,
        item_id: null, // Will be null for manual purchases
        final_purchase_price: 19.99,
        estimated_co2_saved_kg: 2.5, // Estimated CO2 savings for secondhand
        estimated_water_saved_litres: 1500, // Estimated water savings
        transaction_date: new Date().toISOString(),
        sustainability_rating_score: 20
      };

      // Insert into purchase_history table
      const { data, error } = await supabase
        .from('purchase_history')
        .insert([purchaseData])
        .select()
        .single();

      if (error) {
        toast.error("Error adding purchase: " + error.message);
      } else {
        // Fetch current monthly analytics data
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
        const { data: currentBudget } = await supabase
          .from('monthly_analytics')
          .select('*')
          .eq('user_id', user.id)
          .eq('target_month', currentMonth + '-01')
          .single();

        console.log('Current budget data:', currentBudget, 'User ID:', user.id, 'Month:', currentMonth + '-01');

        // Check if budget record exists
        if (!currentBudget) {
          console.error('No budget record found for user:', user.id, 'Month:', currentMonth + '-01');
          toast.error('No budget record found. Please complete your preferences first.');
          return;
        }

        console.log('Budget record found:', currentBudget);

        // Update monthly analytics
        const newSpentAmount = (currentBudget?.total_spent_amount || 0) + purchaseData.final_purchase_price;
        const newSavingsAmount = (currentBudget?.total_savings_generated || 0) + 10; // Fixed $10 savings as requested

        console.log('Updating analytics - Spent:', currentBudget?.total_spent_amount, '->', newSpentAmount);
        console.log('Updating analytics - Saved:', currentBudget?.total_savings_generated, '->', newSavingsAmount);

        // Update monthly_analytics table
        const { error: updateError } = await supabase
          .from('monthly_analytics')
          .update({ 
            total_spent_amount: newSpentAmount,
            total_savings_generated: newSavingsAmount,
            sustainability_rating_score: (currentBudget?.sustainability_rating_score || 0) + purchaseData.sustainability_rating_score, // Make accumulative
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('target_month', currentMonth + '-01');

        if (updateError) {
          toast.error('Error updating analytics: ' + updateError.message);
        } else {
          console.log('Successfully updated monthly analytics');
          console.log('Total spent:', newSpentAmount, 'Total saved:', newSavingsAmount);
          toast.success(`Congrats on your new purchase - it has been saved!`);
          navigate("/dashboard");
        }
      }
    } catch (error) {
      toast.error("Failed to add purchase. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Liquid animated background */}
      <LiquidBackground />
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="shadow-elegant border-border/30 backdrop-blur-md bg-card/80 relative">
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img 
                  src={thriftlyLogo} 
                  alt="Thriftly" 
                  className="w-16 h-16 object-contain"
                />
              </div>
              <CardTitle className="text-2xl text-foreground">Add Purchase</CardTitle>
              <CardDescription className="text-muted-foreground">
                Add a purchase manually by entering the product URL
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-foreground">
                    <ShoppingBag className="w-4 h-4 mr-2 inline" />
                    Product URL
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://shop.mango.com/gb/en/p/women/tops/knitwear/strapless-knitted-top_17054444"
                    value={url}
                    onChange={handleUrlChange}
                    className="border-border focus:border-primary"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the URL of the item you purchased
                  </p>
                </div>

                {/* Analysis State */}
                {isAnalyzing && (
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <h4 className="font-medium text-foreground text-sm mb-2">Analyzing URL...</h4>
                    <p className="text-xs text-muted-foreground">Extracting product details from the link</p>
                  </div>
                )}

                {/* Preview Section */}
                {showPreview && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                    <h4 className="font-medium text-foreground text-sm">Product Details:</h4>
                    <div className="flex gap-4">
                      <img 
                        src={mangoTop}
                        alt="Strapless knitted top" 
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 text-xs text-muted-foreground space-y-1">
                        <p><strong>Title:</strong> Strapless knitted top</p>
                        <p><strong>Price:</strong> £19.99</p>
                        <p><strong>Shop:</strong> Mango</p>
                        <p><strong>Category:</strong> Going Out</p>
                        <p><strong>Discount:</strong> 33% off</p>
                        <p><strong>Sustainability Score:</strong> 2/10</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding Purchase..." : "Add Purchase"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddPurchase;
