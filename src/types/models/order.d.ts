import { DefaultModel } from "./default";

import { Branch } from "./branch";
import { Seller } from "./staff";
import { Product } from "./product";
import { Supplier } from "./supplier";

export type OrderItem = DefaultModel & {
  product: Product;
  supplier: Supplier;
  quantity: number;
  price: number;
};

export type Order = DefaultModel & {
  items: OrderItem[];
  branch: Branch;
  seller: Seller;
  customer: string;
  phone: string;
  address: string;
  status: number;
  discount: number;
  date: string;
};

export type OrderCartItem = DefaultModel & {
  product: Supplier;
  supplier: Product;
  quantity: number;
  price: number;
};