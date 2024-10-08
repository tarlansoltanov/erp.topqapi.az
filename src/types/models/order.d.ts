import { DefaultModel } from "./default";

import { Branch } from "./branch";
import { Driver, Seller, Worker } from "./staff";
import { Product } from "./product";
import { Supplier } from "./supplier";
import { Category } from "./category";

export type OrderItem = DefaultModel & {
  product: Product;
  supplier: Supplier;
  size: string;
  category: Category;
  quantity: number;
  price: number;
  is_sold: boolean;
  profit: number;
  date: string;
};

export type OrderItemStats = {
  total_quantity: number;
  total_price: number;
  total_profit: number;
};

export type OrderExpense = DefaultModel & {
  name: string;
  price: number;
};

export type Order = DefaultModel & {
  items: OrderItem[];
  expenses: OrderExpense[];

  branch: Branch;
  seller: Seller;

  customer: string;
  phone: string;
  address: string;

  note: string;

  payed: number;
  seller_share: number;
  sale_date: string;

  driver: Driver;
  delivery_date: string;
  delivery_price: string;

  worker: Worker;
  install_date: string;
  install_price: string;

  total_price: number;
  profit: number;

  status: number;
};

export type OrderStats = {
  total_orders: number;
  total_amount: number;
  total_profit: number;
  total_payed: number;
};

export type OrderCartItem = DefaultModel & {
  product: Product;
  supplier: Supplier;
  size: string;
  quantity: number;
  price: number;
};
