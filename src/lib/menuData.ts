export type MenuItem = {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  bestSeller: boolean;
};

export type MenuItemInput = Omit<MenuItem, "id">;

export const DEFAULT_MENU_ITEMS: MenuItemInput[] = [
  {
    name: "Cold Coffee",
    price: "Rs 80",
    category: "Beverages",
    description: "Chilled espresso with milk",
    bestSeller: true,
  },
  {
    name: "Iced Americano",
    price: "Rs 110",
    category: "Beverages",
    description: "Bold espresso over ice",
    bestSeller: false,
  },
  {
    name: "White Sauce Pasta",
    price: "Rs 140",
    category: "Pasta",
    description: "Creamy and cheesy classic",
    bestSeller: false,
  },
  {
    name: "Margherita Pizza",
    price: "Rs 190",
    category: "Pizza",
    description: "Fresh basil and mozzarella",
    bestSeller: true,
  },
  {
    name: "Veg Hakka Noodles",
    price: "Rs 130",
    category: "Chinese",
    description: "Wok tossed with veggies",
    bestSeller: false,
  },
  {
    name: "Steamed Momos",
    price: "Rs 100",
    category: "Momos",
    description: "Soft dumplings with chutney",
    bestSeller: false,
  },
  {
    name: "Veg Sandwich",
    price: "Rs 90",
    category: "Sandwich",
    description: "Fresh veggies and herbs",
    bestSeller: false,
  },
  {
    name: "Loaded Fries",
    price: "Rs 120",
    category: "French Fries",
    description: "Crispy fries with toppings",
    bestSeller: false,
  },
  {
    name: "Masala Tea",
    price: "Rs 20",
    category: "Beverages",
    description: "Traditional spiced chai",
    bestSeller: false,
  },
];

export function getMenuCategories(items: MenuItem[]): string[] {
  const categorySet = new Set(items.map((item) => item.category));
  return ["Best Seller", ...Array.from(categorySet)];
}
