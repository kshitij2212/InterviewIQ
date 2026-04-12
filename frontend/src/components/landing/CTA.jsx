import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'

export default function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl bg-accent p-12 text-center text-accent-foreground">
          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Ace Your Interview?</h2>
            <p className="mx-auto mb-8 max-w-xl opacity-90">
              Join thousands of engineers who have landed their dream jobs with Interview IQ.
            </p>
            <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />
        </div>
      </div>
    </section>
  )
}