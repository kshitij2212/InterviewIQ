const stats = [
  { value: '10x', label: 'Faster Interview Prep' },
  { value: '95%', label: 'Success Rate' },
  { value: '50K+', label: 'Engineers Trained' },
  { value: '500+', label: 'Companies Hiring' },
]

export default function Stats() {
  return (
    <section className="border-y border-border bg-card py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="mb-2 text-3xl font-bold text-accent md:text-4xl">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}