'use client';
import {
  Avatar,
  Button,
  Navbar,
  NavbarBrand,
  NavbarToggle,
} from "flowbite-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/context"; // Import your custom AuthProvider
import '@/app/globals.css';

export default function NavbarComponent() {
  const router = useRouter();
  const { currentUser, userLoggedIn, logout } = useAuth();

  console.log("userLoggedIn:", userLoggedIn);
  console.log("currentUser:", currentUser);

  // If loading state is required, show a loading indicator
  if (!currentUser && userLoggedIn === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">Loading</div> {/* Or use a spinner from Flowbite */}
      </div>
    );
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
    }
  };
  
  <Button onClick={handleLogout} className="bg-orange-400">
    Log out
  </Button>;
  

  return (
    <Navbar className="shadow-md">
      <NavbarBrand href="/">
        <img
          src="https://img.favpng.com/6/5/12/ecommerce-logo-png-favpng-c9XwFQHwsmZeVNHU6BRWQgabB.jpg"
          className="mr-3 h-6 sm:h-9 rounded-full"
          alt="Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Cambo Shop
        </span>
      </NavbarBrand>

      <div className="flex md:order-2">
        <div>
          {!userLoggedIn ? (
            <Button
                onClick={() => router.push("/login")}
                className="bg-red-500"
                aria-label="Login Button"
            >
            Login
          </Button>
          ) : (
            <div>
                <Avatar
                    img={currentUser?.photoURL || "/default-avatar.jpg"}
                    alt={currentUser?.displayName || "User Avatar"}
                    rounded
                />
                <span>{currentUser?.displayName}</span>
            </div>
        
          )}
        </div>

        <div className="ml-[10px]">
          {userLoggedIn && (
            <Button
              onClick={logout}
              className="bg-orange-400"
            >
              Log out
            </Button>
          )}
        </div>

        <NavbarToggle />
      </div>
    </Navbar>
  );
}
