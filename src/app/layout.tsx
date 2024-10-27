import './global.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Quiz App',
  description: 'Interactive Quiz Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}