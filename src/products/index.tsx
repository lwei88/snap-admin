import { ResourceProps } from "react-admin";
import { ProductEdit } from "./ProductEdit";
import { ProductList } from "./ProductList";
import { ProductShow } from "./ProductShow";

const products: ResourceProps = {
  name: "products",
  list: ProductList,
  edit: ProductEdit,
  show: ProductShow,
};
export default products;
