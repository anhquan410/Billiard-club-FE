export type TableData = {
  id: number;
  name: string;
  type: "normal" | "vip";
  status: "empty" | "occupied";
  customer?: string;
  totalAmount: number;
  lightOn: boolean;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: string;
};

export type Order = {
  id: string;
  customerName: string;
  table: string;
  date: string;
  beforeDiscount: number;
  total: number;
  cost: number;
  profit: number;
  debt: number;
  deposit: number;
  bankTransfer: number;
  status: string;
};

export type OrderItem = {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
};
