import { Brain } from 'lucide-react'

const links = [
  { title: 'Product', items: ['Features', 'Pricing', 'FAQ'] },
  { title: 'Company', items: ['About', 'Blog', 'Careers'] },
  { title: 'Legal', items: ['Privacy', 'Terms', 'Contact'] },
]

export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Brain className="h-6 w-6 text-accent" />
              <span className="font-bold">Interview IQ</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered interview preparation for software engineers.
            </p>
          </div>
          {links.map(({ title, items }) => (
            <div key={title}>
              <h4 className="mb-4 font-semibold">{title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © 2026 Interview IQ. All rights reserved.
        </div>
      </div>
    </footer>
  )
}