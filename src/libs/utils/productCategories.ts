import type { ProductCategory } from "../types/warehouse.type";

/** Sản phẩm bia cũ có thể còn category BEVERAGE — nhận diện theo tên */
const BEER_NAME_PATTERN =
  /\bbia\b|beer|heineken|tiger|333|saigon|sài gòn|hà nội|hanoi|larue|kenya|strongbow/i;

export const STORE_PRODUCT_CATEGORIES: {
  label: string;
  value: ProductCategory | "ALL";
}[] = [
  { label: "Tất cả", value: "ALL" },
  { label: "Đồ ăn", value: "FOOD" },
  { label: "Bia", value: "BEER" },
  { label: "Nước ngọt có gas", value: "SODA" },
  { label: "Nước ngọt không gas", value: "BEVERAGE" },
  { label: "Thuốc lá", value: "CIGARETTE" },
  { label: "Cà phê", value: "COFFEE" },
  { label: "Khác", value: "OTHER" },
];

export function isLegacyBeerProduct(name: string, category: string): boolean {
  return category === "BEVERAGE" && BEER_NAME_PATTERN.test(name);
}

export function matchesStoreProductCategory(
  product: { name: string; category: string },
  selected: ProductCategory | "ALL",
): boolean {
  if (selected === "ALL") {
    return product.category !== "SERVICE" && product.category !== "EQUIPMENT";
  }
  if (selected === "BEER") {
    return (
      product.category === "BEER" ||
      isLegacyBeerProduct(product.name, product.category)
    );
  }
  if (selected === "BEVERAGE") {
    return (
      product.category === "BEVERAGE" &&
      !isLegacyBeerProduct(product.name, product.category)
    );
  }
  return product.category === selected;
}
