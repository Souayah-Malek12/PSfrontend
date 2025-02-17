/* eslint-disable react/prop-types */
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";
import { Toaster } from 'react-hot-toast';

const Layout = ({
  children,
  title = "25_12 Co - Luxury Fashion Shop",  // Default value for title
  description = "Discover the exclusive 25_12 collection featuring top brands like Prada, Gucci, LV, and more. Elevate your style with our luxury fashion items.",  // Default value for description
  keywords = "25_12 Co, luxury fashion, Prada, Gucci, Louis Vuitton, LV, designer clothes, fashion accessories, online shop",  // Default value for keywords
  author = "25_12 Co - Exclusive Fashion",  // Default value for author
}) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1000, // Set the duration to 6 seconds (or longer)
          style: {
            zIndex: 99999, // Ensure it appears in front of the navbar
          },
        }}
      />
      
      <main style={{ minHeight: "70vh" }}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;