import { Star } from "lucide-react";

const StarRating = ({
  rating = 0,
  size = 18,
  interactive = false,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={size}
          onClick={() => interactive && onChange?.(value)}
          className={`transition ${
            value <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          } ${interactive ? "cursor-pointer hover:scale-110" : ""}`}
        />
      ))}
    </div>
  );
};

export default StarRating;
