// components/Footer.tsx
import Link from 'next/link'
import { 
  Facebook, 
  Twitter, 
  Linkedin,
  Instagram, 
  Mail, 
  BookOpen, 
  Users, 
  MessageSquare,
  GraduationCap
} from 'lucide-react'

interface SocialLink {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface QuickLink {
  name: string
  href: string
}

const socialLinks: SocialLink[] = [
  { name: 'Facebook', href: 'https://www.instagram.com/katareayush2005/', icon: Instagram },
  { name: 'Twitter', href: 'https://x.com/ayushkatare17', icon: Twitter },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/ayush-katare/', icon: Linkedin },
]

const productLinks: QuickLink[] = [
  { name: 'Create Quiz', href: '/create' },
  { name: 'Join Session', href: '/join' },
  { name: 'Question Bank', href: '/questions' },
  { name: 'Templates', href: '/templates' },
  { name: 'Results & Analytics', href: '/analytics' }
]

const resourceLinks: QuickLink[] = [
  { name: 'How It Works', href: '/guide' },
  { name: 'Tutorial Videos', href: '/tutorials' },
  { name: 'Best Practices', href: '/best-practices' },
  { name: 'Teaching Tips', href: '/tips' }
]

const useCases: QuickLink[] = [
  { name: 'Education', href: '/use-cases/education' },
  { name: 'Corporate Training', href: '/use-cases/corporate' },
  { name: 'Events & Workshops', href: '/use-cases/events' },
  { name: 'Team Building', href: '/use-cases/team-building' }
]

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 pt-12 pb-8">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company & Platform Info */}
          <div className="mb-8">
            <Link href="/" className="text-xl font-bold mb-4 block">
              QuizApp
            </Link>
            <p className="text-gray-600 mb-4">
              Engage your audience with interactive quizzes, polls, and real-time feedback.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product Features */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Product</h3>
            </div>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Resources</h3>
            </div>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Use Cases */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Use Cases</h3>
            </div>
            <ul className="space-y-2">
              {useCases.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link 
                href="/support" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Need Help? Contact Support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 mb-4 md:mb-0">
              © {currentYear} QuizApp. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/gdpr" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                GDPR
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer