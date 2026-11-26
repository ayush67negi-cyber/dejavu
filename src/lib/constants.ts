export const CITY_OPTIONS = [
  'Delhi',
  'Gurgaon',
  'Noida',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Jaipur',
  'Agra',
  'Lucknow',
  'Chandigarh',
  'Goa',
  'Ahmedabad',
  'Indore',
  'Other',
] as const;

export const INTEREST_OPTIONS = [
  'Architecture',
  'Art',
  'Books',
  'Cinema',
  'Coffee',
  'Comedy',
  'Cooking',
  'Design',
  'Entrepreneurship',
  'Fashion',
  'Film-making',
  'Food',
  'History',
  'Live music',
  'Photography',
  'Poetry',
  'Politics',
  'Psychology',
  'Running',
  'Science',
  'Slow travel',
  'Sport',
  'Startups',
  'Technology',
  'Theatre',
  'Wine',
  'Writing',
  'Yoga',
  'Languages',
  'Climate',
];

export const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Jain',
  'Gluten-free',
  'Lactose-free',
  'Nut allergy',
  'Shellfish allergy',
  'Halal',
  'No restrictions',
];

export const FOOD_OPTIONS = [
  'Non-vegetarian',
  'Vegetarian',
  'Seafood',
  'Spicy food',
  'Street food',
  'Fine dining',
  'Small plates',
  'Desserts',
  'Natural wine',
  'Cocktails',
  'Coffee',
  'No alcohol',
];

export const SOCIAL_PREFERENCES = [
  'I warm up slowly',
  'I talk to everyone',
  'I prefer small groups',
  'I like deeper one-to-one conversation',
  'I enjoy lively debate',
  'I listen more than I speak',
  'I love a long dinner',
  'I prefer daytime tables',
];

export const AVAILABILITY_OPTIONS = ['Weekday lunch', 'Weekday dinner', 'Saturday', 'Sunday lunch', 'Sunday dinner'];

export const AVOID_TOPICS = [
  'Politics',
  'Religion',
  'Work stress',
  'Dating and relationships',
  'Money',
  'Health',
  'Family',
  'None of these',
];

export const QUESTIONNAIRE = [
  {
    id: 'energy',
    trait: 'energy' as const,
    question: 'A table of strangers. You arrive and…',
    options: [
      { label: 'Order a drink and settle into the corner', value: 2 },
      { label: 'Wait, listen, then find your moment', value: 3 },
      { label: 'Ask the table a question within two minutes', value: 5 },
    ],
  },
  {
    id: 'talkativity',
    trait: 'talkativity' as const,
    question: 'By dessert, you have mostly been…',
    options: [
      { label: 'Listening, occasionally surprising everyone', value: 2 },
      { label: 'Trading stories evenly', value: 3 },
      { label: 'Running the conversation, happily', value: 5 },
    ],
  },
  {
    id: 'curiosity',
    trait: 'curiosity' as const,
    question: 'The conversation turns to something you know nothing about.',
    options: [
      { label: 'I let the others carry it', value: 2 },
      { label: 'I ask one honest question', value: 3 },
      { label: 'I want the whole story, and the reading list', value: 5 },
    ],
  },
  {
    id: 'newness',
    trait: 'newness' as const,
    question: 'Your ideal new person is…',
    options: [
      { label: 'Someone who feels familiar immediately', value: 2 },
      { label: 'A gentle stretch outside my usual circle', value: 3 },
      { label: 'Completely unlike anyone I know', value: 5 },
    ],
  },
];

export const EXPERIENCE_STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  matching: 'Matching',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const MEMBERSHIP_STATUS_LABEL: Record<string, string> = {
  pending: 'Payment pending',
  active: 'Active',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

export const PLAN_COPY: Record<string, { name: string; months: number; price: number; note: string; recommended?: boolean }> = {
  monthly: { name: 'One Month', months: 1, price: 1999, note: 'A single month of tables. Ideal if you want to try the room before committing.' },
  quarterly: { name: 'Three Months', months: 3, price: 4999, note: 'The rhythm most members settle into. Enough evenings for faces to become familiar.', recommended: true },
  biannual: { name: 'Six Months', months: 6, price: 8999, note: 'For members who intend to stay. The best value per month of the three.' },
};
