export type ProductStatus = "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";
export type ProductCategory =
  | "FOOD"
  | "BEVERAGE"
  | "SODA"
  | "BEER"
  | "COFFEE"
  | "EQUIPMENT"
  | "SERVICE"
  | "CIGARETTE"
  | "OTHER";
export type MovementType = "IMPORT" | "EXPORT" | "ADJUST";

export interface InventoryItem {
  id: number;
  name: string;
  image: string;
  warehouse: string;
  unit: string;
  quantity: number;
  exportedQuantity: number;
  averageImportPrice: number;
  actualQuantity: number;
}

export type StockMovement = {
  productId: string;
  type: MovementType;
  quantity: number;
  unitPrice?: number;
  totalValue?: number;
  reason?: string;
};

export type ProductItem = {
  id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  status: ProductStatus;
  image?: string;
  imageUrl?: string | null;
};

export type ProductCreateRequest = {
  name: string;
  description?: string;
  category: ProductCategory;
  price: number;
  costPrice: number;
  stock: number;
  minStock?: number;
  unit?: string;
  status: ProductStatus;
  image?: string;
};
