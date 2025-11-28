import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Event Management System",
  description: "Built with Next.js and TailwindCSS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* 🔥 Hot Toast Global */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
