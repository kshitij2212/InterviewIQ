import { Brain, Code2, MessageSquare, Target, Zap, Users } from 'lucide-react'
import { Card } from '../ui/Card'

const features = [
  { icon: Brain, title: 'AI Mock Interviews', description: 'Practice with our AI interviewer that adapts to your skill level and provides realistic interview scenarios.' },
  { icon: Code2, title: 'Live Coding Environment', description: 'Write and run code in real-time with syntax highlighting, auto-completion, and instant feedback.' },
  { icon: MessageSquare, title: 'Instant Feedback', description: 'Get detailed feedback on your answers, coding style, and communication skills after each session.' },
  { icon: Target, title: 'Personalized Learning', description: 'AI-generated study plans based on your target companies and identified weak areas.' },
  { icon: Zap, title: 'Performance Analytics', description: 'Track your progress with detailed analytics and identify areas for improvement.' },
  { icon: Users, title: 'Expert Community', description: 'Connect with engineers from top companies for mentorship and advice.' },
]

export default function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground">Comprehensive tools powered by AI to prepare you for any technical interview.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="group p-6 transition-all hover:border-accent/50">
              <Icon className="mb-4 h-10 w-10 text-accent" />
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}