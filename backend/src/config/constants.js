const ROLE_SPECIALIZATION_MAP = {
    frontend:     ['react', 'vue', 'angular', 'svelte', 'nextjs'],
    backend:      ['node', 'express', 'django', 'spring', 'fastapi', 'nestjs'],
    devops:       ['aws', 'gcp', 'azure', 'kubernetes', 'docker', 'terraform'],
    mobile:       ['ios', 'android', 'flutter', 'react_native', 'kotlin', 'swift'],
    ai_ml:        ['tensorflow', 'pytorch', 'scikit_learn', 'nlp', 'computer_vision'],
    data_science: ['python', 'spark', 'hadoop', 'sql', 'tableau', 'power_bi'],
    general:      null,
    hr:           null,
    introduction: null
}

const VALID_ROLES = Object.keys(ROLE_SPECIALIZATION_MAP)

const LEVELS = ['fresher', 'junior', 'senior']
const LEVEL_DIFFICULTY_HINTS = {
    fresher: 'Focus on fundamentals, core syntax, basic theory, and introductory concepts. Questions should be approachable for someone with 0-1 years of experience.',
    junior:  'Focus on practical application, problem solving, library/framework proficiency, and common use cases. Questions should reflect 1-3 years of real-world experience.',
    senior:  'Focus on architecture, system design, scalability, trade-offs, performance optimization, and deep technical mastery. Questions should challenge someone with 3+ years of experience.'
}

const QUESTION_TYPES = ['technical', 'hr', 'dsa', 'system_design']

const INTERVIEW_TYPES = ['technical', 'hr']

const INTERVIEW_STATUS = ['in_progress', 'completed', 'abandoned']

const ANSWER_STATUS = ['submitted', 'skipped', 'timeout']

const PLAN_TYPES = ['free', 'pro']

const DAILY_INTERVIEW_LIMIT = 3

const INTERVIEW_QUESTION_LIMITS = {
    min: 3,
    max: 10,
    options: [3, 5, 8]
}

const SCORE_RANGE = {
    min: 0,
    max: 10
}

module.exports = {
    ROLE_SPECIALIZATION_MAP,
    VALID_ROLES,
    LEVELS,
    LEVEL_DIFFICULTY_HINTS,
    QUESTION_TYPES,
    INTERVIEW_TYPES,
    INTERVIEW_STATUS,
    ANSWER_STATUS,
    PLAN_TYPES,
    DAILY_INTERVIEW_LIMIT,
    INTERVIEW_QUESTION_LIMITS,
    SCORE_RANGE
}