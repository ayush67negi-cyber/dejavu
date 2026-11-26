// Values below are stored in the database and used for matching, so the stored
// strings stay in one canonical form. Only `label`s are user-facing.

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

/** Display names for cities (Indian city names keep their usual German spelling). */
export const CITY_LABELS: Record<string, string> = {
  Other: 'Andere Stadt',
};

export function cityLabel(city: string) {
  return CITY_LABELS[city] ?? city;
}

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
] as const;

export const INTEREST_LABELS: Record<string, string> = {
  Architecture: 'Architektur',
  Art: 'Kunst',
  Books: 'Bücher',
  Cinema: 'Kino',
  Coffee: 'Kaffee',
  Comedy: 'Comedy',
  Cooking: 'Kochen',
  Design: 'Design',
  Entrepreneurship: 'Unternehmertum',
  Fashion: 'Mode',
  'Film-making': 'Film',
  Food: 'Essen',
  History: 'Geschichte',
  'Live music': 'Livemusik',
  Photography: 'Fotografie',
  Poetry: 'Lyrik',
  Politics: 'Politik',
  Psychology: 'Psychologie',
  Running: 'Laufen',
  Science: 'Wissenschaft',
  'Slow travel': 'Langsames Reisen',
  Sport: 'Sport',
  Startups: 'Start-ups',
  Technology: 'Technologie',
  Theatre: 'Theater',
  Wine: 'Wein',
  Writing: 'Schreiben',
  Yoga: 'Yoga',
  Languages: 'Sprachen',
  Climate: 'Klima',
};

export function interestLabel(value: string) {
  return INTEREST_LABELS[value] ?? value;
}

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
] as const;

export const DIETARY_LABELS: Record<string, string> = {
  Vegetarian: 'Vegetarisch',
  Vegan: 'Vegan',
  Jain: 'Jain',
  'Gluten-free': 'Glutenfrei',
  'Lactose-free': 'Laktosefrei',
  'Nut allergy': 'Nussallergie',
  'Shellfish allergy': 'Schalentier-Allergie',
  Halal: 'Halal',
  'No restrictions': 'Keine Einschränkungen',
};

export function dietaryLabel(value: string) {
  return DIETARY_LABELS[value] ?? value;
}

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
] as const;

export const FOOD_LABELS: Record<string, string> = {
  'Non-vegetarian': 'Fleisch & Fisch',
  Vegetarian: 'Vegetarisch',
  Seafood: 'Meeresfrüchte',
  'Spicy food': 'Scharfes Essen',
  'Street food': 'Streetfood',
  'Fine dining': 'Fine Dining',
  'Small plates': 'Kleine Gerichte zum Teilen',
  Desserts: 'Desserts',
  'Natural wine': 'Naturwein',
  Cocktails: 'Cocktails',
  Coffee: 'Kaffee',
  'No alcohol': 'Kein Alkohol',
};

export function foodLabel(value: string) {
  return FOOD_LABELS[value] ?? value;
}

export const SOCIAL_PREFERENCES = [
  'I warm up slowly',
  'I talk to everyone',
  'I prefer small groups',
  'I like deeper one-to-one conversation',
  'I enjoy lively debate',
  'I listen more than I speak',
  'I love a long dinner',
  'I prefer daytime tables',
] as const;

export const SOCIAL_LABELS: Record<string, string> = {
  'I warm up slowly': 'Ich tauche langsam auf',
  'I talk to everyone': 'Ich rede mit allen',
  'I prefer small groups': 'Ich mag kleine Runden',
  'I like deeper one-to-one conversation': 'Ich mag tiefe Gespräche zu zweit',
  'I enjoy lively debate': 'Ich diskutiere gern lebhaft',
  'I listen more than I speak': 'Ich höre mehr zu, als ich rede',
  'I love a long dinner': 'Ich liebe lange Dinners',
  'I prefer daytime tables': 'Ich mag Tische am Tag',
};

export function socialLabel(value: string) {
  return SOCIAL_LABELS[value] ?? value;
}

export const AVAILABILITY_OPTIONS = [
  'Weekday lunch',
  'Weekday dinner',
  'Saturday',
  'Sunday lunch',
  'Sunday dinner',
] as const;

export const AVAILABILITY_LABELS: Record<string, string> = {
  'Weekday lunch': 'Mittagessen unter der Woche',
  'Weekday dinner': 'Abendessen unter der Woche',
  Saturday: 'Samstag',
  'Sunday lunch': 'Sonntagmittag',
  'Sunday dinner': 'Sonntagabend',
};

export function availabilityLabel(value: string) {
  return AVAILABILITY_LABELS[value] ?? value;
}

export const AVOID_TOPICS = [
  'Politics',
  'Religion',
  'Work stress',
  'Dating and relationships',
  'Money',
  'Health',
  'Family',
  'None of these',
] as const;

export const AVOID_LABELS: Record<string, string> = {
  Politics: 'Politik',
  Religion: 'Religion',
  'Work stress': 'Arbeitsstress',
  'Dating and relationships': 'Dating und Beziehungen',
  Money: 'Geld',
  Health: 'Gesundheit',
  Family: 'Familie',
  'None of these': 'Nichts davon',
};

export function avoidLabel(value: string) {
  return AVOID_LABELS[value] ?? value;
}

export const QUESTIONNAIRE = [
  {
    id: 'energy',
    trait: 'energy' as const,
    question: 'Ein Tisch voller Fremder. Du kommst an und …',
    options: [
      { label: 'Bestelle etwas zu trinken und richte mich in meiner Ecke ein', value: 2 },
      { label: 'Warte, höre zu und finde dann meinen Moment', value: 3 },
      { label: 'Stelle dem Tisch innerhalb von zwei Minuten eine Frage', value: 5 },
    ],
  },
  {
    id: 'talkativity',
    trait: 'talkativity' as const,
    question: 'Beim Dessert hast du bisher vor allem …',
    options: [
      { label: 'Zugehört und alle ab und zu überrascht', value: 2 },
      { label: 'Geschichten gleichmäßig getauscht', value: 3 },
      { label: 'Das Gespräch geführt – und es genossen', value: 5 },
    ],
  },
  {
    id: 'curiosity',
    trait: 'curiosity' as const,
    question: 'Das Gespräch kommt auf etwas, wovon du keine Ahnung hast.',
    options: [
      { label: 'Ich überlasse es den anderen', value: 2 },
      { label: 'Ich stelle eine ehrliche Frage', value: 3 },
      { label: 'Ich will die ganze Geschichte – und die Leseliste', value: 5 },
    ],
  },
  {
    id: 'newness',
    trait: 'newness' as const,
    question: 'Dein ideales Gegenüber ist …',
    options: [
      { label: 'Jemand, der sofort vertraut wirkt', value: 2 },
      { label: 'Eine sanfte Erweiterung meines üblichen Kreises', value: 3 },
      { label: 'Ganz anders als alle, die ich kenne', value: 5 },
    ],
  },
];

export const EXPERIENCE_STATUS_LABEL: Record<string, string> = {
  draft: 'Entwurf',
  matching: 'In Abstimmung',
  confirmed: 'Bestätigt',
  completed: 'Abgeschlossen',
  cancelled: 'Abgesagt',
};

export const PARTICIPANT_STATUS_LABEL: Record<string, string> = {
  invited: 'Eingeladen',
  confirmed: 'Bestätigt',
  declined: 'Abgelehnt',
  removed: 'Entfernt',
};

export const REQUEST_STATUS_LABEL: Record<string, string> = {
  pending: 'Offen',
  approved: 'Angenommen',
  declined: 'Abgelehnt',
};

export const REPORT_CATEGORY_LABEL: Record<string, string> = {
  safety: 'Sicherheitsproblem',
  harassment: 'Belästigung',
  no_show: 'Nicht erschienen',
  misrepresentation: 'Falsche Angaben',
  other: 'Sonstiges',
};

export const REPORT_STATUS_LABEL: Record<string, string> = {
  open: 'Offen',
  reviewing: 'In Prüfung',
  resolved: 'Geklärt',
  dismissed: 'Verworfen',
};

export const VISIBILITY_LABEL: Record<string, string> = {
  table: 'Nur am Tisch',
  members: 'Alle Mitglieder',
  private: 'Privat',
};

export const MEMBER_STATUS_LABEL: Record<string, string> = {
  active: 'Aktiv',
  suspended: 'Gesperrt',
  deleted: 'Gelöscht',
};

export const MEMBERSHIP_STATUS_LABEL: Record<string, string> = {
  pending: 'Zahlung offen',
  active: 'Aktiv',
  expired: 'Abgelaufen',
  cancelled: 'Gekündigt',
};

export const PLAN_COPY: Record<
  string,
  { name: string; months: number; price: number; note: string; recommended?: boolean }
> = {
  monthly: {
    name: 'Einen Monat',
    months: 1,
    price: 1999,
    note: 'Ein einzelner Monat mit Tischen. Ideal, wenn du den Raum erst kennenlernen möchtest.',
  },
  quarterly: {
    name: 'Drei Monate',
    months: 3,
    price: 4999,
    note: 'Der Rhythmus, in dem die meisten bleiben. Genug Abende, damit Gesichter vertraut werden.',
    recommended: true,
  },
  biannual: {
    name: 'Sechs Monate',
    months: 6,
    price: 8999,
    note: 'Für alle, die bleiben wollen. Der beste Monatspreis der drei Optionen.',
  },
};

/** The four things membership includes — the only benefits we state. */
export const MEMBERSHIP_BENEFITS = [
  'Vier kuratierte Sonntags-Dinner pro Monat',
  'Tischzusammenstellung nach Interessen',
  'Mitgliederbereich und Erlebnis-Historie',
  'Bevorzugter Zugang zu neuen Tischen',
];

export const SITE_TAGLINE_LINES = ['Beim Mittagessen noch Fremde.', 'Beim Dessert schon Freunde.'] as const;
export const SITE_TAGLINE = 'Beim Mittagessen noch Fremde. Beim Dessert schon Freunde.';
