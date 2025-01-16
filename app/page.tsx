import Link from 'next/link';

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Cambo Shop</h1>
        <p className="text-gray-600 mb-6">Join us to explore amazing products!</p>

        <div className="flex flex-col space-y-4">
          <Link 
            href="/register"
            className="block w-full py-3 text-white bg-blue-600 rounded-md font-semibold hover:bg-blue-700 shadow-lg transition duration-300"
          >
            Register
          </Link>
          <Link 
            href="/login"
            className="block w-full py-3 text-white bg-gray-600 rounded-md font-semibold hover:bg-gray-700 shadow-lg transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
