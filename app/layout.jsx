import localFont from "next/font/local";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./styles/global-theme";
import Footer from "./components/footer";
import AppbarGlobal from "./components/appbar-global";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Cinema Paradiso",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppbarGlobal />
        {children}
        <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
