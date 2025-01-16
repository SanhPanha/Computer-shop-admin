'use client';
import { useRouter } from 'next/navigation';
import { doSignInWithEmailAndPassword } from '@/lib/firebase/auth';
import { useAuth } from '@/lib/context/context';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify'; // Import toast

const Login = () => {
  const router = useRouter();
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        toast.success('Successfully signed in!', { position: 'top-center' });
        router.push('/'); // Navigate to the home page
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          setErrorMessage('No account found with this email.');
        } else if (error.code === 'auth/wrong-password') {
          setErrorMessage('Incorrect password.');
        } else {
          setErrorMessage('Failed to sign in. Please try again later.');
        }
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (userLoggedIn) {
      router.push('/categories/category'); // Ensure immediate redirect after login
    }
  }, [userLoggedIn, router]);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-center text-gray-700">Welcome Back</h2>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 mt-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 mt-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              autoComplete="current-password"
            />
          </div>

          {errorMessage && (
            <div className="text-center text-red-600 font-semibold text-sm mt-2">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSigningIn}
            className={`w-full py-3 text-white font-semibold rounded-md transition duration-300 ${
              isSigningIn
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'
            }`}
          >
            {isSigningIn ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;