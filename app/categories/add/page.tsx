"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import style from "./style.module.css";
import { useRouter } from "next/navigation";
import { CatageoryType } from "@/lib/constans";
import { getDatabase, ref, set, push } from "firebase/database";
import app from "../../../lib/firebase/firebaseConfiguration";
import toast from 'react-hot-toast';
import { useState } from "react";

const validationSchema = Yup.object().shape({
  slug: Yup.string().required("Category Slug is required").max(50, "Slug cannot exceed 50 characters"),
  title: Yup.string().required("Category Title is required").max(100, "Title cannot exceed 100 characters"),
  desc: Yup.string().nullable().max(500, "Description cannot exceed 500 characters"),
  image: Yup.string().required("Image is required"),
});


const initialValues = {
  slug: "",
  title: "",
  desc: "",
  image: "",
};

export default function Category() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "categories"));

    const productData: CatageoryType = {
      slug: values.slug,
      title: values.title,
      desc: values.desc,
      image: values.image,
    };

    try {
      await set(newDocRef, productData);
      toast.success("Category saved successfully");
      router.push("/categories/category");
    } catch (error: any) {
      toast.error(`Error saving category: ${error.message}`);
    }
  };

  return (
    <main className={style.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => {
          // Generate slug based on title input
          const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const title = event.target.value;
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
                  onClick={() => router.push(`/categories/category`)}
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
                  Create Category
                </button>
            </div>

              <div className="mb-5">
                <label htmlFor="slug" className={style.label}>
                  Category Slug
                </label>
                <Field
                  type="text"
                  name="slug"
                  id="slug"
                  className={style.input}
                  value={values.slug}
                  readOnly // Slug is auto-generated
                />
                <ErrorMessage name="slug" component="div" className={style.error} />
              </div>

              <div className="mb-5">
                <label htmlFor="title" className={style.label}>
                  Category Title
                </label>
                <Field
                  type="text"
                  name="title"
                  id="title"
                  className={style.input}
                  onChange={handleTitleChange} // Update slug automatically
                  value={values.title}
                />
                <ErrorMessage name="title" component="div" className={style.error} />
              </div>

              <div className="mb-5">
                <label htmlFor="desc" className={style.label}>
                  Category Description
                </label>
                <Field
                  as="textarea"
                  name="desc"
                  id="desc"
                  className={style.input}
                />
                <ErrorMessage name="desc" component="div" className={style.error} />
              </div>


              <div className="mb-5">
                <label htmlFor="image" className={style.label}>
                  Catgory Image
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
                    {isLoading ? "Saving..." : "Submit"}
                  </button>
                <button
                  type="button"
                  onClick={() => router.push(`/categories/category`)}
                  className="bg-orange-600 text-white px-3 py-2 ml-2 rounded-lg"
                >
                  Cancel
                </button>
           </div>
            </Form>
          );
        }}
      </Formik>
    </main>
  );
}
