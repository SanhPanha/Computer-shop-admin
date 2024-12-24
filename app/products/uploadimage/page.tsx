'use client'
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const CustomInput = ({ field, form, setFieldValue }: any) => {
	const [imagePreview, setImagePreview] = useState("");

	const handleUploadeFile = (e: any) => {
		const file = e.target.files[0];
		const localUrl = URL.createObjectURL(file);
		console.log(localUrl);
		setImagePreview(localUrl);

	    setFieldValue(field.name, file);
		
	};
	return (
		<main className='grid place-content-center'>
			{imagePreview && <img src={imagePreview} className='w-[200px]' alt="preview" />}
			<section>
			<ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
			</section>
			<div className="col-span-full">

              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
				
                <div className="mx-auto">
				<input onChange={(e) => handleUploadeFile(e)} type="file" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
					
                      <span>Upload a file</span>
					 
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
		</main>
	);
};

export default CustomInput