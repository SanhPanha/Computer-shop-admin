'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/context';
import { doCreateUserWithEmailAndPassword } from '@/lib/firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; // Import toast for success messages

const Register = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { userLoggedIn } = useAuth();

  useEffect(() => {
    if (userLoggedIn) {
      router.replace('/categories/category');
    }
  }, [userLoggedIn, router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isRegistering) {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }

      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        toast.success('Successfully registered! Please login.', { position: 'top-center' });
        router.push('/login'); // Navigate after successful registration
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('This email is already registered.');
        } else {
          setErrorMessage('Failed to register. Please try again later.');
        }
      } finally {
        setIsRegistering(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-center text-gray-700">Create Account</h2>

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
              placeholder="Create a password"
              className="w-full px-4 py-3 mt-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              autoComplete="new-password"
              disabled={isRegistering}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 mt-2 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              autoComplete="off"
              disabled={isRegistering}
            />
          </div>

          {errorMessage && (
            <div className="text-center text-red-600 font-semibold text-sm mt-2">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isRegistering}
            className={`w-full py-3 text-white font-semibold rounded-md transition duration-300 ${
              isRegistering
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'
            }`}
          >
            {isRegistering ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
