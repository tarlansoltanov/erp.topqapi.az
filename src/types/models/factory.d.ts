import { DefaultModel } from "./default";

// Relations
import { Category } from "./category";

export type FactoryProduct = DefaultModel & {
  name: string;
  category: Category;
};

export type FactoryStorageItem = DefaultModel & {
  product: FactoryProduct;
  quantity: number;
  sale_count: number;
  usage_count: number;
  price: number;
  date: string;
};

export type FactorySale = DefaultModel & {
  product: FactoryProduct;
  quantity: number;
  price: number;
  date: string;
};

export type FactoryUsage = DefaultModel & {
  product: FactoryProduct;
  quantity: number;
  date: string;
};
