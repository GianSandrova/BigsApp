import {  Poppins } from 'next/font/google'
import './globals.css'
import ReactQueryWrapper from '@/components/wrapping/reactquery'
import "react-datetime/css/react-datetime.css";
import { Toaster } from 'sonner';
import 'react-loading-skeleton/dist/skeleton.css'
// const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata = {
  title: 'Bigs App',
  description: 'Doctor Appointment App',
  manifest: "/manifest.json",
  icons: { apple: './icon.png' },
  themeColor: '#fff',
  viewport: 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,viewport-fit=cover'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-bgF8F8FC`}>
        <Toaster position="top-center" richColors/>
        <ReactQueryWrapper>
          {children}
        </ReactQueryWrapper>
      </body>
    </html>
  )
}