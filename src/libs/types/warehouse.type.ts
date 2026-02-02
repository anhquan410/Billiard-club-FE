export type ProductStatus = "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";
export type ProductCategory =
  | "FOOD"
  | "BEVERAGE"
  | "EQUIPMENT"
  | "SERVICE"
  | "CIGARETTE"
  | "OTHER";

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

export type ImportReceipt = {
  id: string;
  code: string;
  branch: string;
  importWarehouse: string;
  supplier: string;
  createdDate: string;
  category: ProductCategory;
  status: "pending" | "completed" | "cancelled";
  totalAmount: number;
  products: ProductItem[];
  note?: string;
};

export type ExportReceipt = {
  id: string;
  code: string;
  invoiceCode?: string;
  branch: string;
  exportWarehouse: string;
  createdDate: string;
  category: ProductCategory;
  status: "pending" | "completed" | "cancelled";
  totalAmount: number;
  products: ProductItem[];
  note?: string;
};

export type ProductItem = {
  id: number;
  name: string;
  description?: string;
  category: ProductCategory;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  status: ProductStatus;
  image: string;
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
