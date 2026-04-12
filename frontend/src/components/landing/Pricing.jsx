import { CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

const plans = [
  {
    name: 'Starter',
    price: '₹0',
    description: 'Perfect for exploring the platform',
    features: ['5 AI mock interviews/month', 'Basic feedback', 'Limited question bank', 'Community access'],
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹999',
    description: 'Best for serious job seekers',
    features: ['Unlimited AI interviews', 'Detailed feedback & analytics', 'Full question bank', 'System design practice', 'Priority support'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '₹4999',
    description: 'For teams and organizations',
    features: ['Everything in Pro', 'Team analytics', 'Custom question sets', 'Dedicated success manager', 'API access'],
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="border-y border-border bg-card py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground">Choose the plan that fits your interview timeline.</p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {plans.map(({ name, price, description, features, popular }) => (
            <Card
              key={name}
              className={`relative bg-background p-6 ${popular ? 'border-accent ring-1 ring-accent' : ''}`}
            >
              {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
                  Most Popular
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">{price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mb-6 space-y-3">
                {features.map(feature => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${popular ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
                variant={popular ? 'default' : 'outline'}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}