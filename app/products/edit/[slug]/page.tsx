"use client";

import { useRouter, useParams } from "next/navigation";
import { getDatabase, ref, set, get } from "firebase/database";
import app from "@/lib/firebase/firebaseConfiguration";
import { useEffect, useState } from "react";
import EditProduct from "@/components/product/EditProduct";
import style from "./style.module.css";


export default function EditProductPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const db = getDatabase(app);
      const dbRef = ref(db, "products");

      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const products = snapshot.val();

          // Find the category by slug
          const foundCategory = Object.entries(products).find(
            ([_, value]: any) => value.slug === slug
          );

          if (foundCategory) {
            const [key, value] = foundCategory;
            if (typeof value === 'object' && value !== null) {
              setProduct({ ...value, id: key }); // Include the Firebase key
            } else {
              console.error("Invalid product value:", value);
              alert("Invalid product data.");
              router.push("/products/product");
            }
          } else {
            alert("Product not found");
            router.push("/products/product");
          }
        } else {
          alert("No products available.");
          router.push("/products/product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      } 
    };

    fetchProduct();
  }, [slug, router]);


  if (loading) return (
    <main className={style.container}>
      <p>Loading...</p>
    </main>
  );
  if (!product) return <p>Product not found.</p>;

  return(
    <main className={style.container}>
      <EditProduct product={product} />
    </main>
  );
}
