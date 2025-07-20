export default interface UserListing {
  id: number;
  type: string;
  price: number;
  title: string;
  description: string;
  product_condition: string;
  quantity: number;
  location: string;
  posted_date: Date;
  posted_by: string;
  status: string;
  image_storage_ref: string;
  view_count?: number;
}
