import { Star } from 'lucide-react'
import { Card } from '../ui/Card'

const testimonials = [
  { name: 'Shivam Dixit', role: 'Software Engineer at Google', quote: 'Interview IQ helped me land my dream job at Google. The AI mock interviews were incredibly realistic.' },
  { name: 'Abhay Raj', role: 'Senior Developer at Meta', quote: 'The personalized feedback after each session helped me identify and fix my weak points quickly.' },
  { name: 'Akshit Tomar', role: 'Tech Lead at Amazon', quote: 'Best investment I made in my career. The system design practice was exactly what I needed.' },
  { name: 'Khyati Kapil', role: 'Staff Engineer at Apple', quote: 'The AI interviewer asks questions just like real interviewers. Highly recommended!' },
  { name: 'Shreya Saxena', role: 'Backend Engineer at Netflix', quote: 'Went from failing interviews to getting multiple offers. This platform is a game-changer.' },
  { name: 'Shradhha Jaiswal', role: 'SDE II at Microsoft', quote: 'The analytics helped me track my progress and stay motivated throughout my prep.' },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Loved by Engineers</h2>
          <p className="text-muted-foreground">See what our users have to say about their experience.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(({ name, role, quote }) => (
            <Card key={name} className="p-6">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">"{quote}"</p>
              <div>
                <div className="font-semibold">{name}</div>
                <div className="text-sm text-muted-foreground">{role}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}