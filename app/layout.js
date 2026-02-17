import "./globals.css";

export const metadata = {
  title: "Bookmarks App",
  description: "Supabase Google Auth Bookmarks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
