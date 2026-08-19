import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { generateOrganizationSchema } from "@/lib/seo/schema";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://humanbiomedical.com"),

  title: {
    default: "Laboratory & Hospital Equipment Supplier | Human Biomedical LLP",
    template: "%s | Human Biomedical LLP",
  },

  description:
    "Human Biomedical LLP is a trusted supplier of laboratory instruments, hospital equipment, diagnostic systems, pathology analyzers, medical devices, and laboratory consumables across India.",

  alternates: {
    canonical: "https://humanbiomedical.com",
  },

  openGraph: {
    title: "Laboratory & Hospital Equipment Supplier | Human Biomedical LLP",
    description:
      "Leading supplier of laboratory instruments, hospital equipment, diagnostic systems, and pathology analyzers.",
    url: "https://humanbiomedical.com",
    siteName: "Human Biomedical LLP",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/humanlogo.png",
        width: 800,
        height: 600,
        alt: "Human Biomedical LLP Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Laboratory & Hospital Equipment Supplier | Human Biomedical LLP",
    description:
      "Trusted supplier of laboratory instruments, diagnostic equipment, and hospital solutions across India.",
    images: ["/humanlogo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgSchema),
          }}
        />
      </head>
      <body className={poppins.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}