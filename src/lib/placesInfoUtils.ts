export const getPriceLevelText = (level?: number) => {
  if (!level) return "N/A";
  return "$".repeat(level);
};

export const getRatingStars = (rating: number) => {
  return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
};
