import "./globals.css";
import { Caudex } from "next/font/google";
import { RoleProvider } from "@/context/RoleContext";
import { Toaster } from "react-hot-toast";
import SessionProviderWrapper from "@/app/components/SessionProviderWrapper"; 

const caudex = Caudex({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "AAK Deliveries Inc",
  description: "Delivery Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={caudex.className}>
      <body className="bg-black text-white">
        <SessionProviderWrapper>
          <RoleProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#111",
                  color: "#fff",
                  border: "1px solid #f00",
                },
              }}
            />
            {children}
          </RoleProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
