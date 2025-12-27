import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Wallet, GraduationCap, Tag, ShoppingBag, Heart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import LiquidBackground from "@/components/ui/LiquidBackground";
import thriftlyLogo from "@/assets/thriftly_logo.png";

const Preferences = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState("200");
  const [isStudent, setIsStudent] = useState(false);
  const [preferredBrands, setPreferredBrands] = useState("");
  const [preferredStyles, setPreferredStyles] = useState("");
  const [sizePreferences, setSizePreferences] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get current user from localStorage
      const userData = localStorage.getItem("thriftly_user");
      if (!userData) {
        toast.error("User data not found. Please sign up again.");
        navigate("/auth");
        return;
      }

      const user = JSON.parse(userData);

      // Parse arrays from comma-separated strings
      const brandsArray = preferredBrands ? preferredBrands.split(",").map(b => b.trim()).filter(b => b) : [];
      const stylesArray = preferredStyles ? preferredStyles.split(",").map(s => s.trim()).filter(s => s) : [];
      const sizesArray = sizePreferences ? sizePreferences.split(",").map(s => s.trim()).filter(s => s) : [];

      // Insert preferences into user_preferences table
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('user_preferences')
        .insert([
          {
            user_id: user.id,
            monthly_budget: parseFloat(monthlyBudget),
            is_student: isStudent,
            preferred_brands: brandsArray,
            preferred_styles: stylesArray,
            size_preferences: sizesArray,
          }
        ])
        .select()
        .single();

      if (preferencesError) {
        toast.error("Error saving preferences: " + preferencesError.message);
      } else {
        // Create initial monthly budget record
        const currentMonth = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format (first day of month)
        const { error: budgetError } = await supabase
          .from('monthly_budgets')
          .insert([
            {
              user_id: user.id,
              month: currentMonth,
              budget_amount: parseFloat(monthlyBudget),
              spent_amount: 0.00,
              saved_amount: 0.00,
            }
          ]);

        if (budgetError) {
          toast.error("Error setting up budget: " + budgetError.message);
        } else {
          // Initialize empty purchased_items record (optional - usually items are added when purchased)
          // This table will be populated when users actually purchase items
          
          toast.success("Preferences saved successfully! Your account is ready.");
          // Navigate to login page
          navigate("/auth");
        }
      }
    } catch (error) {
      toast.error("Failed to save preferences. Please try again.");
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
            onClick={() => navigate("/auth")}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Auth
          </Button>

          <Card className="shadow-elegant border-border/30 backdrop-blur-md bg-card/80 relative">
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img 
                  src={thriftlyLogo} 
                  alt="Thriftly" 
                  className="w-30 h-16 object-contain"
                />
              </div>
              <CardTitle className="text-2xl text-foreground">Set Your Preferences</CardTitle>
              <CardDescription className="text-muted-foreground">
                Help us personalize your shopping experience
              </CardDescription>
            </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-foreground">
                  <Wallet className="w-4 h-4 mr-2 inline" />
                  Monthly Budget
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="200.00"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className="border-purple-200 focus:border-purple-400"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="student"
                  checked={isStudent}
                  onChange={(e) => setIsStudent(e.target.checked)}
                  className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                />
                <Label htmlFor="student" className="text-foreground">
                  <GraduationCap className="w-4 h-4 mr-2 inline" />
                  I'm a student (get student discounts)
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brands" className="text-foreground">
                  <Tag className="w-4 h-4 mr-2 inline" />
                  Preferred Brands
                </Label>
                <Input
                  id="brands"
                  type="text"
                  placeholder="Nike, Zara, H&M (comma separated)"
                  value={preferredBrands}
                  onChange={(e) => setPreferredBrands(e.target.value)}
                  className="border-purple-200 focus:border-purple-400"
                />
                <p className="text-xs text-purple-500">Enter brands separated by commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="styles" className="text-foreground">
                  <ShoppingBag className="w-4 h-4 mr-2 inline" />
                  Preferred Styles
                </Label>
                <Input
                  id="styles"
                  type="text"
                  placeholder="Casual, Formal, Athletic (comma separated)"
                  value={preferredStyles}
                  onChange={(e) => setPreferredStyles(e.target.value)}
                  className="border-purple-200 focus:border-purple-400"
                />
                <p className="text-xs text-purple-500">Enter styles separated by commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sizes" className="text-foreground">
                  <Heart className="w-4 h-4 mr-2 inline" />
                  Size Preferences
                </Label>
                <Input
                  id="sizes"
                  type="text"
                  placeholder="M, L, XL (comma separated)"
                  value={sizePreferences}
                  onChange={(e) => setSizePreferences(e.target.value)}
                  className="border-purple-200 focus:border-purple-400"
                />
                <p className="text-xs text-purple-500">Enter sizes separated by commas</p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default Preferences;
