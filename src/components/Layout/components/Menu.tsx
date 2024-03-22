import { USER_TYPES } from "@/constants";

interface IMenuItem {
  id: string;
  label: string;
  isHeader?: false;
  icon?: string;
  link: string;
  badge?: {
    color: string;
    value: string;
  };
  subItems?: IMenuItem[];
  parentId?: string;
  types?: number[];
}

const menuItems: IMenuItem[] = [
  {
    id: "dashboard",
    label: "Ana Səhifə",
    icon: "bx bx-home-circle",
    link: "/dashboard",
  },
  {
    id: "orders",
    label: "Satışlar",
    icon: "bx bx-cart",
    link: "/orders",
    types: [USER_TYPES.WAREHOUSE, USER_TYPES.STORE],
    subItems: [
      {
        id: "orders",
        label: "Bütün Satışlar",
        link: "/orders/all",
        parentId: "orders",
        types: [USER_TYPES.WAREHOUSE],
      },
      {
        id: "orders-items",
        label: "Satılan məhsullar",
        link: "/orders/items",
        parentId: "orders",
        types: [USER_TYPES.WAREHOUSE],
      },
    ],
  },
  {
    id: "catalog",
    label: "Məhsul Kataloqu",
    icon: "bx bx-list-ul",
    link: "/catalog",
    types: [USER_TYPES.WAREHOUSE],
  },
  {
    id: "warehouse",
    label: "Anbar",
    icon: "bx bx-store",
    link: "/warehouse",
    types: [USER_TYPES.WAREHOUSE],
    subItems: [
      {
        id: "warehouse-entries",
        label: "Giriş tarixçəsi",
        link: "/warehouse/entries",
        parentId: "warehouse",
        types: [USER_TYPES.WAREHOUSE],
      },
      {
        id: "warehouse-items",
        label: "Məhsul girişləri",
        link: "/warehouse/items",
        parentId: "warehouse",
        types: [USER_TYPES.WAREHOUSE],
      },
      {
        id: "warehouse-products",
        label: "Məhsullar",
        link: "/warehouse/products",
        parentId: "warehouse",
        types: [USER_TYPES.WAREHOUSE],
      },
    ],
  },
  {
    id: "staff",
    label: "İşçilər",
    icon: "bx bx-user",
    link: "/staff",
    types: [USER_TYPES.WAREHOUSE],
    subItems: [
      {
        id: "staff-drivers",
        label: "Taksilər",
        link: "/staff/drivers",
        parentId: "staff",
        types: [USER_TYPES.WAREHOUSE],
      },
      {
        id: "staff-sellers",
        label: "Satıcılar",
        link: "/staff/sellers",
        parentId: "staff",
        types: [USER_TYPES.WAREHOUSE],
      },
      {
        id: "staff-workers",
        label: "Ustalar",
        link: "/staff/workers",
        parentId: "staff",
        types: [USER_TYPES.WAREHOUSE],
      },
    ],
  },
  {
    id: "factory",
    label: "İstehsalat",
    icon: "bx bx-store",
    link: "/factory",
    types: [USER_TYPES.WAREHOUSE],
    subItems: [
      {
        id: "factory-storage",
        label: "Anbar",
        link: "/factory/storage",
        parentId: "factory",
        types: [USER_TYPES.WAREHOUSE],
      },
      {
        id: "factory-products",
        label: "Məhsullar",
        link: "/factory/products",
        parentId: "factory",
        types: [USER_TYPES.WAREHOUSE],
      },
    ],
  },
  {
    id: "branches",
    label: "Filiallar",
    icon: "bx bx-building",
    link: "/branches",
    types: [USER_TYPES.WAREHOUSE],
  },
  {
    id: "suppliers",
    label: "Firmalar",
    icon: "bx bx-building-house",
    link: "/suppliers",
    types: [USER_TYPES.WAREHOUSE],
  },
  {
    id: "expenses",
    label: "Xərclər",
    icon: "bx bx-money",
    link: "/expenses",
    types: [USER_TYPES.WAREHOUSE],
  },
  {
    id: "details",
    label: "Ətraflı",
    icon: "bx bx-detail",
    link: "/details",
    types: [USER_TYPES.WAREHOUSE],
    subItems: [
      {
        id: "details-products",
        label: "Məhsullar",
        link: "/products",
        parentId: "details",
        types: [USER_TYPES.WAREHOUSE],
      },
      {
        id: "details-categories",
        label: "Kateqoriyalar",
        link: "/categories",
        parentId: "details",
        types: [USER_TYPES.WAREHOUSE],
      },
    ],
  },
];

export { menuItems };
