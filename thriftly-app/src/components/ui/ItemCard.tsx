import { Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  store?: string;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
  className?: string;
  animationDelay?: number;
}

const ItemCard = ({
  name,
  brand,
  price,
  originalPrice,
  image,
  store,
  isFavorite = false,
  onFavoriteClick,
  className,
  animationDelay = 0,
}: ItemCardProps) => {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-card/70 backdrop-blur-xl border border-border/30 hover-lift glow-effect opacity-0 animate-fade-in-up",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>
        
        {/* Favorite Button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={onFavoriteClick}
          className="absolute right-3 top-3 h-11 w-11 rounded-full bg-card/80 backdrop-blur-md shadow-soft transition-all duration-300 hover:scale-110 hover:bg-card hover:shadow-pink border border-border/20"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-all duration-300",
              isFavorite ? "fill-accent text-accent scale-110" : "text-muted-foreground"
            )}
          />
        </Button>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow animate-pulse-soft">
            -{discount}%
          </div>
        )}

        {/* Quick View on Hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-all duration-500 ease-out group-hover:translate-y-0">
          <Button
            variant="secondary"
            size="sm"
            className="w-full rounded-2xl bg-card/90 backdrop-blur-md font-medium shadow-elegant border border-border/30 hover:bg-card transition-all duration-300"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Quick View
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">
          {brand}
        </p>
        <h3 className="mt-1.5 font-display text-xl font-medium text-foreground line-clamp-1">
          {name}
        </h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gradient">${price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice}
            </span>
          )}
        </div>
        {store && (
          <p className="mt-2 text-xs text-muted-foreground">
            via <span className="font-medium text-primary/70">{store}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
