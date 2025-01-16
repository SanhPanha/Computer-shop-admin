  import { RiProductHuntFill, RiSettings5Fill } from "react-icons/ri"
  import { MdDashboard, MdCategory } from "react-icons/md";
import { title } from "process";
import path from "path";
import { act } from "react";
  
  export const MenuList = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: MdDashboard ,
      active: false
    },

    {
      title: 'Category',
      path: '/categories/category',
      active: false,
      icon: MdCategory
    },
    {
      title: 'Product',
      path: '/products/product',
      active: false,
      icon: RiProductHuntFill
    },
    {
      title: 'User',
      path: '/users/user',
      active: false,
      icon: RiProductHuntFill
    },

    {
      title: 'Setting',
      path: '/#',
      active: false,
      icon: RiSettings5Fill
    },

  ];
  