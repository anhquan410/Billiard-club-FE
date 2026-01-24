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

export interface ImportReceipt {
  id: string;
  code: string;
  branch: string;
  importWarehouse: string;
  supplier: string;
  createdDate: string;
  category: string;
  status: "pending" | "completed" | "cancelled";
  totalAmount: number;
  products: string[];
  note?: string;
}

export interface ExportReceipt {
  id: string;
  code: string;
  invoiceCode?: string;
  branch: string;
  exportWarehouse: string;
  createdDate: string;
  category: string;
  status: "pending" | "completed" | "cancelled";
  totalAmount: number;
  products: string[];
  note?: string;
}

export interface ProductItem {
  id: number;
  name: string;
  code: string;
  image: string;
  category: string;
  unit: string;
  price: number;
  cost: number;
  stock: number;
  status: "active" | "inactive";
  description?: string;
}
