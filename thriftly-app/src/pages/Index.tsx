import { Heart, TrendingDown, Wallet, Search, ArrowRight, Sparkles, ShoppingBag, GraduationCap, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/shopper.png";
import thriftlyLogo from "@/assets/thriftly_logo.png";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-200">
        <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={thriftlyLogo} 
              alt="Thriftly" 
              className="w-30 h-30 object-contain"
            />
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-purple-600 hover:bg-purple-50 transition-colors">Log in</Button>
            <Button variant="default" size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Add to Chrome
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(262_83%_58%/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(262_60%_70%/0.06),transparent_50%)]" />
        
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 animate-fade-in">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Smart shopping starts here</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Smart Shopping
                <span className="block text-gradient">Assistant.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                Automatically find lower prices, discover similar items, and track your spending. 
                Your personal fashion shopping assistant.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <Button variant="default" size="lg" className="bg-purple-700 text-white hover:bg-purple-800">
                  Start Saving Today
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
              
              <div className="flex items-center gap-8 pt-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">10k+ users</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">4.9/5</span>
                </div>
              </div>
            </div>
            
            <div className="relative animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="Stylish woman shopping with Thriftly" 
                  className="w-full h-auto rounded-3xl shadow-lg"
                />
                
                {/* Floating Cards */}
                <div className="absolute -left-6 top-1/4 bg-white rounded-2xl p-4 shadow-lg border border-gray-200 animate-float-slow" style={{ animationDelay: "0s" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Lower price found!</p>
                      <p className="font-bold text-foreground">Save £32.00</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -right-4 top-1/2 bg-white rounded-2xl p-4 shadow-lg border border-gray-200 animate-float-medium" style={{ animationDelay: "0.5s" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Student discount</p>
                      <p className="font-bold text-foreground">20% off</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 left-1/4 bg-white rounded-2xl p-4 shadow-lg border border-gray-200 animate-float-fast" style={{ animationDelay: "1s" }}>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="70 30" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Budget tracker</p>
                      <p className="font-bold text-foreground">£140 / £200</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-purple-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(262_60%_95%/0.5),transparent_70%)] pointer-events-none" />
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything you need to shop smarter
            </h2>
            <p className="text-lg text-muted-foreground">
              Thriftly helps you make better fashion decisions while staying on budget.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingDown,
                title: "Price Tracking",
                description: "Automatically find lower prices for items you love across multiple retailers.",
                color: "bg-green-500",
                iconColor: "text-white"
              },
              {
                icon: Search,
                title: "Similar Items",
                description: "Discover similar styles at different price points. Find the perfect match for your budget.",
                color: "bg-primary",
                iconColor: "text-primary-foreground"
              },
              {
                icon: Wallet,
                title: "Budget Tracker",
                description: "Set monthly spending limits and track your fashion purchases in real-time.",
                color: "bg-gray-100",
                iconColor: "text-gray-700"
              },
              {
                icon: Tag,
                title: "Sale Alerts",
                description: "Get notified when items on your wishlist go on sale. Never miss a deal.",
                color: "bg-red-500",
                iconColor: "text-white"
              },
              {
                icon: GraduationCap,
                title: "Student Discounts",
                description: "Automatically detect and apply student discounts when available.",
                color: "bg-blue-500",
                iconColor: "text-white"
              },
              {
                icon: Heart,
                title: "Wishlist Sync",
                description: "Save items from any store and access your wishlist anywhere.",
                color: "bg-primary",
                iconColor: "text-primary-foreground"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
              >
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-purple-50 to-purple-100 relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(262_70%_95%/0.4),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(262_60%_90%/0.3),transparent_50%)]" />
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Get started in seconds
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to smarter shopping.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Install the extension",
                description: "Add Thriftly to Chrome with one click. It's free to get started."
              },
              {
                step: "02",
                title: "Shop as usual",
                description: "Browse your favorite stores. Thriftly works silently in the background."
              },
              {
                step: "03",
                title: "Save money",
                description: "Get instant alerts when we find better prices or similar items."
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="pt-8">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-3 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img 
                src={thriftlyLogo} 
                alt="Thriftly" 
                className="w-25 h-12 object-contain"
              />
            </div>
            
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2026 Thriftly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
