const ROLE_SPECIALIZATION_MAP = {
    frontend:     ['react', 'vue', 'angular', 'svelte', 'nextjs'],
    backend:      ['node', 'express', 'django', 'spring', 'fastapi', 'nestjs'],
    fullstack:    ['react', 'vue', 'angular', 'node', 'django', 'nextjs'],
    devops:       ['aws', 'gcp', 'azure', 'kubernetes', 'docker', 'terraform'],
    mobile:       ['ios', 'android', 'flutter', 'react_native', 'kotlin', 'swift'],
    ai_ml:        ['tensorflow', 'pytorch', 'scikit_learn', 'nlp', 'computer_vision'],
    data_science: ['python', 'spark', 'hadoop', 'sql', 'tableau', 'power_bi'],
    hr:           null,
    general:      null
}

const VALID_ROLES = Object.keys(ROLE_SPECIALIZATION_MAP)

const LEVELS = ['fresher', 'junior', 'senior']

const QUESTION_TYPES = ['technical', 'hr', 'dsa', 'system_design']

const INTERVIEW_TYPES = ['technical', 'hr']

const INTERVIEW_STATUS = ['in_progress', 'completed', 'abandoned']

const ANSWER_STATUS = ['submitted', 'skipped', 'timeout']

const PLAN_TYPES = ['free', 'pro']

const DAILY_INTERVIEW_LIMIT = 5

const INTERVIEW_QUESTION_LIMITS = {
    min: 5,
    max: 10,
    options: [5, 8, 10]
}

const SCORE_RANGE = {
    min: 0,
    max: 10
}

module.exports = {
    ROLE_SPECIALIZATION_MAP,
    VALID_ROLES,
    LEVELS,
    QUESTION_TYPES,
    INTERVIEW_TYPES,
    INTERVIEW_STATUS,
    ANSWER_STATUS,
    PLAN_TYPES,
    DAILY_INTERVIEW_LIMIT,
    INTERVIEW_QUESTION_LIMITS,
    SCORE_RANGE
}