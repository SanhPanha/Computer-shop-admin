import "@/app/globals.css";
import StoreProvider from "./StoreProvider";
import { AuthProvider } from "@/lib/context/context";
export default function AuthLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html>
			<body>
				<AuthProvider>
					<main>{children}</main>
				</AuthProvider>
			</body>
			
		</html>
	);
}
