'use client';
import React, { useEffect, useState } from 'react';
import { ProductType } from '@/lib/constans';
import { useRouter } from 'next/navigation';
import CardComponent from './cardcomponent';
import app from "../../lib/firebase/firebaseConfiguration";
import { getDatabase, ref, get } from "firebase/database";

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);

  // Fetch products from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase(app);
        const dbRef = ref(db, "products");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val()) as ProductType[];
          setProducts(data);
          setFilteredProducts(data); // Initialize filtered products
        } else {
          console.error("No products found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter products by search term
  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value.toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(search)
    );
    setFilteredProducts(filtered);
  };

  return (
    <main>
      {/* Search Input */}
      <div className="container mx-auto my-4">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 border rounded-md"
          onChange={handleFilter}
        />
      </div>

      {/* Product Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        {filteredProducts.map((product) => (
          <CardComponent
            key={product.slug} // Use a unique ID for the key
            quantity={product.quantity}
            id={product.slug}
            onClick={() => router.push(`/service/${product.slug}`)}
            name={product.name}
            price={product.price}
            image={product.image}
            desc={product.desc}
          />
        ))}
      </div>
    </main>
  );
}