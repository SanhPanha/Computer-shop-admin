"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDatabase, ref, get } from "firebase/database";
import app from "@/lib/firebaseConfiguration";
import EditCategory from "@/components/category/EditCategory";
import style from "./style.module.css";

export default function EditCategoryPage() {
  const router = useRouter();
  const { slug } = useParams(); // Slug from the route
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      const db = getDatabase(app);
      const dbRef = ref(db, "categories");

      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const categories = snapshot.val();

          // Find the category by slug
          const foundCategory = Object.entries(categories).find(
            ([_, value]: any) => value.slug === slug
          );

          if (foundCategory) {
            const [key, value] = foundCategory;
            if (typeof value === 'object' && value !== null) {
              setCategory({ ...value, id: key }); // Include the Firebase key
            } else {
              console.error("Invalid category value:", value);
              alert("Invalid category data.");
              router.push("/categories/category");
            }
          } else {
            alert("Category not found");
            router.push("/categories/category");
          }
        } else {
          alert("No categories available.");
          router.push("/categories/category");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug, router]);

  if (loading) return (
    <main className={style.container}>
      <p>Loading...</p>
    </main>
  );
  if (!category) return <p>Category not found.</p>;

  return (
    <main className='h-full w-full p-9 flex flex-grow items-start justify-center'>
      <EditCategory category={category} />
    </main>
  );
}
