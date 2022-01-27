export interface RecipeCardData {
  imageUrl: string;
  calorie: number;
  name: string;
  userName: string;
  userImageUrl: string | null;
  liked: boolean;
  likedNumber: number,
  mainIngredient: string;
  category: string;
}