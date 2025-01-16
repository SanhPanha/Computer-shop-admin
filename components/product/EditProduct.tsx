"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDatabase, ref, update, get } from "firebase/database";
import app from "@/lib/firebase/firebaseConfiguration";
import style from "./style.module.css";
import { CatageoryType, ProductType } from "@/lib/constans";

const validationSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  name: Yup.string().required("Product Name is required"),
  desc: Yup.string().nullable(),
  price: Yup.number().required("Price is required"),
});


interface ProductProps {
  product: {
    id: string; // Firebase key
    slug: string;
    desc: string;
    name: string;
    price: number;
    image: string;
    category: string;
    seller: string;
    quantity:number;
    date?: string;
    isHighLight?: boolean;
    isCheckOut?: boolean;
  };
}

export default function EditProduct({ product }: ProductProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CatageoryType[]>([]);

  const initialValues = {
    slug: product.slug,
    name: product.name,
    desc: product.desc || "",
    price: product.price,
    category: product.category,
    quantity: product.quantity,
    seller: product.seller,
    image: product.image,
    date: product.date,
    isHighLight: product.isHighLight,
    isCheckOut: product.isCheckOut
    
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase(app);
        const dbRef = ref(db, "categories");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const categoryList = Object.entries(data).map(([key, value]: any) => ({
            id: key,
            ...value,
          }));
          setCategories(categoryList);
        } else {
          console.error("No categories found.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values: any) => {
    if (!product.id) {
      alert("Invalid product ID.");
      return;
    }
  
    const db = getDatabase(app);
    const productRef = ref(db, `products/${product.id}`);
  
    const updatedData = {
      slug: values.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      desc: values.desc,
      name: values.name,
      price: values.price,
      category: values.category,
      quantity: values.quantity,
      seller: values.seller,
      image: values.image,
      date: values.date,
      isHighLight: values.isHighLight,
      isCheckOut: values.isCheckOut
    };
  
    try {
      setIsLoading(true);
      await update(productRef, updatedData);
      alert("Product updated successfully!");
      router.push("/products/product");
    } catch (error: any) {
      alert(`Error updating product: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue }) => {
          const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const title = e.target.value;
            setFieldValue("title", title);
            setFieldValue(
              "slug",
              title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
            );
          };

          return (
            <Form className=" rounded-lg w-full container mx-auto bg-gray-100 p-10">
            <div className="my-3 ">
              <button
                type="button"
                onClick={() => router.push(`/products/product`)}
                className="bg-orange-400 text-lg font-medium hover:bg-orange-600 text-white px-6 rounded-lg"
              >
                Back
              </button>
            </div>

            <div className={style.title}>
                <button
                  type="button"
                  className={`${style.title} text-2xl text-gray-800 font-bold`}
                >
                  Edit Product
                </button>
            </div>

            <div className="mb-5">
              <label htmlFor="slug" className={style.label}>
                Product Slug
              </label>
              <Field type="text" name="slug" id="slug" className={style.input} readOnly />
            </div>

            <div className="mb-5">
              <label htmlFor="name" className={style.label}>
                Product Name
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                className={style.input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const name = e.target.value;
                  setFieldValue("name", name);
                  setFieldValue(
                    "slug",
                    name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
                  );
                }}
                value={values.name}
              />
              <ErrorMessage name="name" component="div" className={style.error} />
            </div>

            <div className="mb-5">
              <label htmlFor="category" className={style.label}>
                Product Category
              </label>
              <Field as="select" name="category" className={style.input}>
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.title}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" className={style.error} />
            </div>

            <div className="mb-5">
              <label htmlFor="desc" className={style.label}>
                Product Description
              </label>
              <Field as="textarea" name="desc" id="desc" className={style.input} />
              <ErrorMessage name="desc" component="div" className={style.error} />
            </div>

            <div className="mb-5">
              <label htmlFor="price" className={style.label}>
                Product Price
              </label>
              <Field type="number" name="price" id="price" className={style.input} />
              <ErrorMessage name="price" component="div" className={style.error} />
            </div>

            <div className="mb-5">
              <label htmlFor="image" className={style.label}>
                Product Image (Name only)
              </label>
              <Field type="text" name="image" id="image" className={style.input} />
              <ErrorMessage name="image" component="div" className={style.error} />
            </div>

            <div className="mt-4">
              <button
                  type="submit"
                  className="bg-blue-700 py-2 px-3 text-white rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              <button
                type="button"
                onClick={() => router.push(`/products/product`)}
                className="bg-orange-600 text-white px-3 py-2 ml-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </Form>
          );
        }}
      </Formik>
  );
}
