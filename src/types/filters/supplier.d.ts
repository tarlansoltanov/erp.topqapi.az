import { DefaultFilter } from "./default";

export type SupplierFilter = DefaultFilter & {
  name?: string;
  product?: string;
};

export type TransactionFilter = DefaultFilter;
