import { cn } from "@/lib/utils";

interface CommunityCardProps {
  id: number;
  name: string;
  brand: string;
  price: number;
  user: string;
  avatar: string;
  image: string;
  className?: string;
  animationDelay?: number;
}

const CommunityCard = ({
  name,
  brand,
  price,
  user,
  avatar,
  image,
  className,
  animationDelay = 0,
}: CommunityCardProps) => {
  return (
    <div
      className={cn(
        "group break-inside-avoid overflow-hidden rounded-3xl border border-border/30 bg-card/70 backdrop-blur-xl shadow-soft transition-all duration-500 hover:shadow-elegant hover:-translate-y-2 hover:border-primary/20 glow-effect opacity-0 animate-fade-in-up",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Image */}
      <div className="overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
        />
        {/* Shimmer on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={avatar}
              alt={user}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent border-2 border-card" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            @{user}
          </span>
        </div>

        {/* Item Info */}
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">
            {brand}
          </p>
          <h3 className="mt-1 font-display text-lg font-medium text-foreground line-clamp-1">
            {name}
          </h3>
          <p className="mt-2 text-xl font-bold text-gradient">${price}</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
