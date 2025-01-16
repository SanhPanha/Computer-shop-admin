"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDatabase, ref, update } from "firebase/database";
import app from "@/lib/firebase/firebaseConfiguration";
import style from "./style.module.css";

const validationSchema = Yup.object().shape({
  slug: Yup.string().required("Category Slug is required"),
  title: Yup.string().required("Category Title is required"),
  desc: Yup.string().nullable(),
});

interface CategoryProps {
  category: {
    id: string; // Firebase key
    slug: string;
    title: string;
    desc: string;
    image: string
  };
}

export default function EditCategory({ category }: CategoryProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    slug: category.slug,
    title: category.title,
    desc: category.desc || "",
    image: category.image
  };

  const handleSubmit = async (values: any) => {
    const db = getDatabase(app);
    const categoryRef = ref(db, `categories/${category.id}`); // Update by Firebase key

    const updatedData = {
      slug: values.slug,
      title: values.title,
      desc: values.desc,
      image: values.image
    };

    try {
      setIsLoading(true);
      await update(categoryRef, updatedData);
      alert("Category updated successfully!");
      router.push("/categories/category");
    } catch (error: any) {
      alert(`Error updating category: ${error.message}`);
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
              {/* Back Button */}
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
                  Edit Category
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

              {/* Description Field */}
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

              {/* Buttons */}
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
  );
}
