import { ArrowRight } from 'lucide-react'

const steps = [
  { step: '01', title: 'Create Profile', description: 'Set up your profile with target companies, roles, and experience level.' },
  { step: '02', title: 'Get Your Plan', description: 'Receive a personalized study plan based on your goals and timeline.' },
  { step: '03', title: 'Practice Daily', description: 'Complete AI mock interviews, coding challenges, and system design problems.' },
  { step: '04', title: 'Land The Job', description: 'Apply your skills and ace your real interviews with confidence.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-card py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
          <p className="text-muted-foreground">Get interview-ready in four simple steps.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, title, description }, index) => (
            <div key={step} className="relative text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-bold text-accent-foreground">
                {step}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
              {index < 3 && (
                <ArrowRight className="absolute right-0 top-8 hidden h-6 w-6 -translate-x-1/2 text-muted-foreground lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}