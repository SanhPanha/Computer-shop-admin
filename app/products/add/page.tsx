"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import style from "./style.module.css";
import { useRouter } from "next/navigation";
import { CatageoryType, ProductType } from "@/lib/constans";
import { getDatabase, ref, set, push, get } from "firebase/database";
import app from "../../../lib/firebase/firebaseConfiguration";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const initialValues = {
  slug: "",
  category: "",
  name: "",
  desc: "",
  image: "",
  price: 0,
  quantity: 0,
  isHighLight: false,
  isCheckOut: false,
};

const validationSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  name: Yup.string().required("Product Name is required"),
  desc: Yup.string().nullable(),
  price: Yup.number().required("Price is required"),
  image: Yup.string().required("Image is required"),
});

export default function Product() {
  const router = useRouter();
  const [categories, setCategories] = useState<CatageoryType[]>([]);
  const { data: session } = useSession(); // Get seller session info
  const [isLoading, setIsLoading] = useState(false);
  // Fetch categories from Firebase
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
    const db = getDatabase(app);
    const productRef = push(ref(db, `products`));

    const productData: ProductType = {
      slug: values.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      category: values.category,
      name: values.name,
      desc: values.desc,
      image: values.image, // Image file name, handle upload separately if needed
      price: values.price,
      quantity: values.quantity,
      isHighLight: false,
      isCheckOut: false,
      date: new Date().toISOString(), // Auto-assign current time
      seller: session?.user?.name || "Unknown Seller",
    };

    setIsLoading(true);

    try {
      await set(productRef, productData);
      alert("Product saved successfully!");
      router.push("/products/product");
    } catch (error: any) {
      console.error("Error saving product:", error.message);
      alert(`Error saving product: ${error.message}`);
    }
  };

  return (
    <main className={style.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
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
                  Create Product
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
               Product Image
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
        )}
      </Formik>
    </main>
  );
}
