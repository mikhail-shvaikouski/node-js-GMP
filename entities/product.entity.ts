export interface ProductEntity {
  id: string;
  title: string;
  description: string;
  price: number;
}

export const products: ProductEntity[] = [
  {
    id: "51422fcd-0366-4186-ad5b-c23059b6f64f",
    title: "Book",
    description: "A very interesting book",
    price: 96,
  },
  {
    id: "51sd45cd-0sd6-41f6-ad5b-65kg39b6f64f",
    title: "Pen",
    description: "High quality Pen",
    price: 25,
  },
];
