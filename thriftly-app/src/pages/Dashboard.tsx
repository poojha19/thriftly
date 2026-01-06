import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Heart,
  LogOut,
  Wallet,
  Leaf,
  TrendingDown,
  Sparkles,
  Users,
  ChevronDown,
  Plus,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import ItemCard from "@/components/ui/ItemCard";
import CommunityCard from "@/components/ui/CommunityCard";
import CircularProgress from "@/components/ui/CircularProgress";
import LiquidBackground from "@/components/ui/LiquidBackground";
import thriftlyLogo from "@/assets/thriftly_logo.png"

// Mock data
const mockWishlistItems = [
  { id: 1, name: "Vintage Denim Jacket", brand: "Levi's", price: 45, originalPrice: 120, image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=400&fit=crop", store: "ThredUp" },
  { id: 2, name: "Silk Midi Skirt", brand: "Reformation", price: 38, originalPrice: 98, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0uj2d?w=300&h=400&fit=crop", store: "Poshmark" },
  { id: 3, name: "Cashmere Sweater", brand: "Everlane", price: 55, originalPrice: 150, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop", store: "Depop" },
  { id: 4, name: "Leather Ankle Boots", brand: "Dr. Martens", price: 89, originalPrice: 180, image: "https://images.unsplash.com/photo-1542840410-8e2b1e7c8cce?w=300&h=400&fit=crop", store: "Vinted" },
];

const mockRecommendations = [
  { id: 5, name: "Floral Maxi Dress", brand: "Free People", price: 42, originalPrice: 128, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop", store: "ThredUp" },
  { id: 6, name: "Wool Blazer", brand: "Theory", price: 75, originalPrice: 395, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop", store: "The RealReal" },
  { id: 7, name: "Crossbody Bag", brand: "Coach", price: 65, originalPrice: 195, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=400&fit=crop", store: "Poshmark" },
  { id: 8, name: "High-Waist Jeans", brand: "Agolde", price: 48, originalPrice: 188, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop", store: "Depop" },
];

const mockCommunityItems = [
  { id: 9, name: "Trench Coat", brand: "Burberry", price: 320, user: "StyleQueen", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=100&h=100&fit=crop", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=450&fit=crop" },
  { id: 10, name: "Vintage Scarf", brand: "Hermès", price: 180, user: "ThriftFinder", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300&h=300&fit=crop" },
  { id: 11, name: "Linen Pants", brand: "COS", price: 45, user: "EcoChic", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop" },
  { id: 12, name: "Suede Jacket", brand: "AllSaints", price: 125, user: "VintageVibes", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=350&fit=crop" },
  { id: 13, name: "Silk Blouse", brand: "Equipment", price: 58, user: "ChicSeeker", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop", image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=300&h=380&fit=crop" },
  { id: 14, name: "Platform Sandals", brand: "Ganni", price: 95, user: "TrendHunter", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; name: string; id: string } | null>(null);
  const [favorites, setFavorites] = useState<number[]>([1, 2, 3, 4]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [monthlyBudget, setMonthlyBudget] = useState<any>(null);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
  const [previousMonthBudget, setPreviousMonthBudget] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("thriftly_user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchUserData(userData.id);
    } else {
      setUser({ email: "demo@thriftly.com", name: "Sarah", id: "demo-id" });
      setLoading(false);
    }
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      const { supabase } = await import("@/lib/supabase");
      
      // Fetch user preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Fetch current month budget
      const currentMonth = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format
      const { data: budget } = await supabase
        .from('monthly_budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentMonth)
        .single();

      // Fetch previous month budget for comparison
      const previousMonth = new Date();
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const previousMonthStr = previousMonth.toISOString().slice(0, 7);
      const { data: prevBudget } = await supabase
        .from('monthly_budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('month', previousMonthStr + '-01')
        .single();

      // Fetch wishlist items
      const { data: wishlist } = await supabase
        .from('wishlist')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch purchased items
      const { data: purchased } = await supabase
        .from('purchased_items')
        .select('*')
        .eq('user_id', userId)
        .order('purchase_date', { ascending: false })
        .limit(10);

      setUserPreferences(preferences);
      setMonthlyBudget(budget);
      setPreviousMonthBudget(prevBudget);
      setWishlistItems(wishlist || []);
      setPurchasedItems(purchased || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("thriftly_user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <LiquidBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-purple-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Calculate metrics
  const budgetAmount = monthlyBudget?.budget_amount || userPreferences?.monthly_budget || 300;
  const spentAmount = monthlyBudget?.spent_amount || 0;
  const savedAmount = monthlyBudget?.saved_amount || 0;
  const budgetRemaining = budgetAmount - spentAmount;
  const budgetPercentage = Math.round((spentAmount / budgetAmount) * 100);
  
  // Sustainability score: sum all sustainability scores from purchased_items
  const sustainabilityScore = purchasedItems.length > 0 
    ? purchasedItems.reduce((acc, item) => acc + (item.sustainability_score || 0), 0)
    : 0;

  // Calculate sustainability score change
  const previousSustainabilityScore = previousMonthBudget?.sustainability_score;
  const sustainabilityChange = previousSustainabilityScore 
    ? Math.round(sustainabilityScore - previousSustainabilityScore)
    : Math.round(sustainabilityScore * 0.12); // Default growth estimate

  // Total saved calculation
  const totalSaved = savedAmount + (purchasedItems.reduce((acc, item) => acc + (item.price || 0), 0) * 0.3); // Assume 30% savings vs new

  return (
    <div className="min-h-screen relative">
      {/* Liquid animated background */}
      <LiquidBackground />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-card/60 backdrop-blur-2xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <img
              src={thriftlyLogo}
              alt="Thriftly"
              className="h-10 w-auto"
            />
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="hidden items-center gap-3 md:flex">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  Hi, {user.name}!
                </p>
                <p className="text-xs text-muted-foreground">Welcome back</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary via-accent to-pink-400 shadow-glow hover:shadow-lg transition-shadow"
                >
                  <span className="text-primary-foreground font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </button>
                
                {showUserDropdown && (
                  <div className="absolute right-0 top-12 w-48 bg-card/95 backdrop-blur-md border border-border/30 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        navigate("/add-purchase");
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors rounded-t-lg"
                    >
                      <Plus className="w-4 h-4" />
                      Manually Add Purchase
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors rounded-b-lg border-t border-border/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-xl transition-all duration-300"
            >
              <LogOut className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:px-6">
        <Tabs defaultValue="dashboard" className="w-full">
          {/* Tab Navigation */}
          <div className="mb-10 flex justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <TabsList className="inline-flex h-14 rounded-2xl bg-card/60 backdrop-blur-xl p-1.5 border border-border/30 shadow-soft">
              <TabsTrigger
                value="dashboard"
                className="rounded-xl px-6 font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="favourites"
                className="rounded-xl px-6 font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow"
              >
                <Heart className="mr-2 h-4 w-4" />
                Favourites
              </TabsTrigger>
              <TabsTrigger
                value="styleboard"
                className="rounded-xl px-6 font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow"
              >
                <Users className="mr-2 h-4 w-4" />
                Styleboard
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-12">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              <StatCard
                title="Monthly Budget Remaining"
                value={`$${budgetRemaining.toFixed(0)}`}
                subtitle={`$${spentAmount.toFixed(0)} of $${budgetAmount.toFixed(0)} spent`}
                icon={<Wallet className="h-5 w-5 text-primary" />}
                animationDelay={400}
              >
                <div className="mt-4 flex justify-center">
                  <CircularProgress value={budgetPercentage} size={110} strokeWidth={10}>
                    <span className="font-display text-2xl font-bold text-gradient">
                      {budgetPercentage}%
                    </span>
                  </CircularProgress>
                </div>
              </StatCard>

              <StatCard
                title="Sustainability Score"
                value={Math.round(sustainabilityScore)}
                subtitle={`${sustainabilityChange > 0 ? '+' : ''}${sustainabilityChange} points this month`}
                icon={<Leaf className="h-5 w-5 text-accent" />}
                iconClassName="from-accent/20 to-primary/10"
                animationDelay={500}
              >
                <div className="mt-4 flex gap-1.5">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2.5 flex-1 rounded-full transition-all duration-500 ${
                        i < Math.floor(sustainabilityScore / 10)
                          ? "bg-gradient-to-r from-accent to-primary shadow-sm"
                          : "bg-secondary"
                      }`}
                      style={{ transitionDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
              </StatCard>

              <StatCard
                title="Total Saved"
                value={`$${totalSaved.toFixed(0)}`}
                subtitle={`${purchasedItems.length} items purchased this month`}
                icon={<TrendingDown className="h-5 w-5 text-primary" />}
                animationDelay={600}
              >
                <p className="mt-4 text-sm text-muted-foreground">
                  {purchasedItems.length > 0 
                    ? `Avg ${Math.round((totalSaved / purchasedItems.length) * 100 / (totalSaved / purchasedItems.length || 1))}% off retail`
                    : 'Start shopping to see savings'
                  }
                </p>
              </StatCard>
            </div>

            {/* Recommendations Section */}
            <section>
              <div className="mb-8 flex items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: "700ms" }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-3xl font-semibold text-foreground">
                  Curated For You
                </h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {mockRecommendations.map((item, index) => (
                  <ItemCard
                    key={item.id}
                    {...item}
                    isFavorite={favorites.includes(item.id)}
                    onFavoriteClick={() => toggleFavorite(item.id)}
                    animationDelay={800 + index * 100}
                  />
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Favourites Tab */}
          <TabsContent value="favourites" className="space-y-8">
            <div className="flex items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Your Wishlist
              </h2>
              <span className="rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20">
                {wishlistItems.length} items
              </span>
            </div>

            {wishlistItems.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {wishlistItems.map((item, index) => {
                  const imagePath = item.image ? `/${item.image}` : 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=400&fit=crop';
                  console.log('Wishlist item image path:', imagePath, 'Original DB value:', item.image); // TODO: fix
                  return (
                  <ItemCard
                    key={item.id}
                    id={item.id}
                    name={item.title}
                    brand={item.shop || 'Unknown'}
                    price={item.price}
                    image={imagePath}
                    store={item.shop}
                    isFavorite={true}
                    onFavoriteClick={() => toggleFavorite(item.id)}
                    animationDelay={200 + index * 100}
                  />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground">Start adding items you love to see them here!</p>
              </div>
            )}
          </TabsContent>

          {/* Styleboard Tab */}
          <TabsContent value="styleboard" className="space-y-8">
            <div className="flex items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-display text-3xl font-semibold text-foreground">
                Community Styleboard
              </h2>
              <span className="text-sm text-muted-foreground">
                See what others are loving
              </span>
            </div>

            {/* Masonry Grid */}
            <div className="columns-2 gap-6 md:columns-3 lg:columns-4">
              {mockCommunityItems.map((item, index) => (
                <div key={item.id} className="mb-6">
                  <CommunityCard
                    {...item}
                    animationDelay={200 + index * 100}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
