'use client';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useRouter } from 'next/navigation';
import '@/app/globals.css';
import app from "../../../lib/firebase/firebaseConfiguration";
import { getDatabase, ref, get, remove } from "firebase/database";
import { SearchComponent } from '@/components/seach_button/searchButton';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { ProductType } from '@/lib/constans';

const placeHolderImage = 'https://via.placeholder.com/150';

export default function DashBoard() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [productDetail, setProductDetail] = useState<ProductType | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Fetch products from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase(app);
        const dbRef = ref(db, "products");
        const snapshot = await get(dbRef);
  
        if (snapshot.exists()) {
          // Extract keys and values
          const data = Object.entries(snapshot.val()).map(([key, value]) => ({
            ...(typeof value === 'object' && value !== null ? value : {}),
            key, // Add the Firebase key to each product object
          })) as ProductType[];
  
          setProducts(data);
          setFilteredProducts(data);
  
          console.log('Products:', data);
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
    setFilteredProducts(search ? filtered : products);
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (!productId) return;
  
    try {
      const db = getDatabase(app);
  
      // Find the product by `slug` and get its `key`
      const productToDelete = products.find(product => product.slug === productId);
  
      if (!productToDelete) {
        alert("Product not found.");
        return;
      }
  
      const productKey = productToDelete.key; // Get the Firebase key
  
      const productRef = ref(db, `products/${productKey}`);
  
      // Remove the product from Firebase
      await remove(productRef);
  
      // Update the local state
      setProducts(prev => prev.filter(product => product.key !== productKey));
      setFilteredProducts(prev => prev.filter(product => product.key !== productKey));
  
      setOpenDeleteModal(false);
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };
  
  
  

  const columns: TableColumn<ProductType>[] = [
    // {
    //   name: 'ID',
    //   selector: row => row.slug,
    //   sortable: true,
    // },

    {
      name: 'Product Title',
      selector: row => row.name,
      sortable: true,
    },

    {
      name: 'Seller',
      selector: row => row.seller || 'N/A',
    },
     
    {
      name: 'Category',
      selector: row => row.category,
      sortable: true,
    },

    {
      name: 'Price (USD)',
      selector: row => `$${row.price.toFixed(2)}`,
      sortable: true,
    },

    {
      name: 'Image',
      cell: row => (
        <img
          className="w-[80px] h-[70px]"
          src={row.image || placeHolderImage}
          alt={row.name || 'Placeholder'}
        />
      ),
    },
    
    {
      name: 'Action',
      cell: row => (
        <div className="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1">
          <button
            onClick={() => router.push(`/products/edit/${row.slug}`)}
            className="inline-block rounded-md px-4 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setProductDetail(row);
              setOpenDetailModal(true);
            }}
            className="inline-block rounded-md px-4 py-2 text-sm text-blue-700 hover:text-gray-700 focus:relative"
          >
            View
          </button>
          <button
            onClick={() => {
              setProductId(row.slug);
              setOpenDeleteModal(true);
            }}
            className="inline-block rounded-md bg-white px-4 py-2 text-sm text-red-500 shadow-sm focus:relative"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className='flex flex-col p-9 w-full gap-6'>
      <SearchComponent onChange={handleFilter} path='/products/add' title='Add Product'/>
      <section className="border-[2px] rounded-lg">
        <DataTable
          columns={columns}
          data={filteredProducts}
          pagination
          persistTableHead
          noDataComponent={<div>No products found</div>}
        />
      </section>

      {/* Detail Modal */}
      <Modal show={openDetailModal} onClose={() => setOpenDetailModal(false)}>
        <Modal.Header>Product Details</Modal.Header>
        <Modal.Body >
          <div className="space-y-6">
            <img
              src={productDetail?.image || placeHolderImage}
              alt={productDetail?.name || 'Untitled'}
              className="w-full h-80 object-contain"
            />

            <div className='flex items-center gap-3'>
              <h3 className="text-lg font-semibold text-orange-400">
                Product Name :
              </h3>

              <p className=" text-gray-500 text-lg font-normal">
                {productDetail?.name || 'No name available.'}
              </p>   
            </div>

            <div className='flex items-start gap-3'>
              <h3 className="text-lg font-semibold text-orange-400 whitespace-nowrap">
                Description :
              </h3>

              <p className=" text-gray-500 text-lg font-normal">
                {productDetail?.desc || 'No description available.'}
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <h3 className="text-lg font-semibold text-orange-400">
                Category :
              </h3>

              <p className=" text-gray-500 text-lg font-normal">
                {productDetail?.category || 'No category available.'}
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <h3 className="text-lg font-semibold text-orange-400">
                Price :
              </h3>

              <p className=" text-gray-500 text-lg font-normal">
                ${productDetail?.price.toFixed(2) || '0.00'}
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <h3 className="text-lg font-semibold text-orange-400">
                Seller :
              </h3>

              <p className=" text-gray-500 text-lg font-normal">
                {productDetail?.seller || 'No seller available.'}
              </p>
            </div>

          </div>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDelete}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      
    </main>
  );
}
