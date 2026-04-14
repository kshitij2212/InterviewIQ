import { Brain, Globe, MessageSquare, Target, Zap, Volume2 } from 'lucide-react'
import { Card } from '../ui/Card'

const features = [
  { icon: Brain, title: 'AI-Powered Interviews', description: 'Experience realistic mock interviews driven by AI, designed to test your knowledge exactly like a human recruiter would.' },
  { icon: Globe, title: 'Multilingual Support', description: 'Answer in your preferred language. Our intelligent system seamlessly translates your responses into English for accurate evaluation.' },
  { icon: MessageSquare, title: 'Instant Feedback', description: 'Receive immediate, actionable feedback on your answers compared against the ideal responses after every question.' },
  { icon: Target, title: 'Category Specific', description: 'Target your weak points by selecting specific interview categories, from specialized technical domains to behavioral questions.' },
  { icon: Zap, title: 'Session Analytics', description: 'Track your daily sessions and overall progress. Optimize your preparation with your history and detailed insights.' },
  { icon: Volume2, title: 'Interactive Voice', description: 'Engage in a natural conversation with integrated Text-to-Speech capabilities that reads out the interview questions to you.' },
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