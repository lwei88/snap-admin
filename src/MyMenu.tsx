// MyMenu.tsx
import { Menu } from "react-admin";

export const MyMenu = () => (
  <Menu>
    <Menu.Item to="/products" primaryText="All Products" />
    <Menu.Item
      to="/products/user-inputed"
      primaryText="User Inputed Products"
    />
    <Menu.Item to="/ingredients" primaryText="All Ingredients" />
    <Menu.Item to="/categories" primaryText="All Categories" />
  </Menu>
);
