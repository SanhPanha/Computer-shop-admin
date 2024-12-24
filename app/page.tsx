import React from 'react';
import Link from 'next/link';

const Home = () => {

  return (
    <div className="flex flex-col items-center justify-center h-screen ">

      <div className='flex flex-col items-center justify-center space-y-4 bg-slate-100 p-9 rounded-lg'>

        <h1 className="text-2xl font-bold">Welcome to Our Cambo Shop</h1>
        <p className="text-gray-600">Please register or log in to continue.</p>
        <div className="space-x-4">
          <Link 
            href="/register"
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
          >
              Register
          </Link>
          <Link 
            href="/login"
            className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition'
          >
              Login
          </Link>
        </div>
        </div>
      
    </div>
  );
};

export default Home;
