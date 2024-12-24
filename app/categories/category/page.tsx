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
import { CatageoryType } from '@/lib/constans';

export default function DashBoard() {
  const router = useRouter();

  const [categories, setcategories] = useState<CatageoryType[]>([]);
  const [filteredcategories, setFilteredcategories] = useState<CatageoryType[]>([]);
  const [categoryId, setcategoryId] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase(app);
        const dbRef = ref(db, "categories"); // Fixed typo
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          // Extract keys and values
          const data = Object.entries(snapshot.val()).map(([key, value]) => ({
            ...(typeof value === 'object' && value !== null ? value : {}),
            key, // Add the Firebase key to each product object
          })) as CatageoryType[];

          setcategories(data);
          setFilteredcategories(data); // Initialize filtered categories

          console.log('categories:', data);
        } else {
          console.error("No categories found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter categories by search term
  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value.toLowerCase();
    const filtered = categories.filter(category =>
      category.title.toLowerCase().includes(search)
    );
    setFilteredcategories(search ? filtered : categories);
  };

  // Handle category deletion
  const handleDelete = async () => {
    if (!categoryId) return;

    try {

      const db = getDatabase(app);

      // Find the category by `slug` and get its `key`
      const categoryToDelete = categories.find(category => category.slug === categoryId);

      if (!categoryToDelete) {
        alert("Product not found.");
        return;
      }

      const categoryKey = categoryToDelete.key; // Get the Firebase key

      const categoryRef = ref(db, `categories/${categoryKey}`);

      // Remove the category from Firebase
      await remove(categoryRef);
      
      setFilteredcategories(prev => prev.filter(category => category.slug !== categoryId));
      setcategories(prev => prev.filter(category => category.slug !== categoryId));

      setOpenDeleteModal(false);
    } catch (err) {
      alert("Failed to delete category. Please try again.");
      console.error('Error deleting category:', err);
    }
  
  };

  

  const columns: TableColumn<CatageoryType>[] = [
    {
      name: 'ID',
      selector: row => row.slug,
      sortable: true,
    },

    {
      name: 'Category Title',
      selector: row => row.title,
      sortable: true,
      style: {
        textAlign: 'center',
      },
    },

    {
      name: 'Image',
      cell: row => (
        <img
          className="w-[80px] h-[70px]"
          src={row.image || "Placeholder"}
          alt={row.title || 'Placeholder'}
        />
      ),
    },

    {
      name: 'Description',
      selector: row => row.desc,
      sortable: true,
      style: {
        textAlign: 'center',
      },
    },
    
    {
      name: 'Action',
      cell: row => (
        <div className="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1 my-3">
          <button
            onClick={() => router.push(`/categories/edit/${row.slug}`)}
            className="inline-block rounded-md px-4 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative"
          >
            Edit
          </button>

          <button
            onClick={() => {
              setcategoryId(row.slug);
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
      <SearchComponent onChange={handleFilter} path='/categories/add' title='Add Category'/>

      <section className="border-[2px] rounded-lg">
        <DataTable
          columns={columns}
          data={filteredcategories}
          pagination
          persistTableHead
          noDataComponent={<div>No categories found</div>}
        />
      </section>

      {/* Delete Confirmation Modal */}
      <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete this category?
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
