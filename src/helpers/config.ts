const PROJECT_NAME = import.meta.env.VITE_PROJECT_NAME;

export const getPageTitle = (title: string) => {
  return title ? `${title} | ${PROJECT_NAME}` : `${PROJECT_NAME}`;
};

export const getOptions = (data: any[] | null, label = "name", value = "id") => {
  return data?.map((item) => ({ label: item[label], value: item[value] })) || [];
};

export const formatPrice = (price: string | number, currency: string = "AZN") => {
  return `${Number(price).toFixed(2)} ${currency}`;
};
