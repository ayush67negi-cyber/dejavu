import re, sys

p = 'src/components/onboarding/onboarding-flow.tsx'
s = open(p).read()
orig = s

pairs = [
# ---------- imports: label helpers ----------
("""import {
  AVAILABILITY_OPTIONS,
  AVOID_TOPICS,
  CITY_OPTIONS,
  DIETARY_OPTIONS,
  FOOD_OPTIONS,
  INTEREST_OPTIONS,
  QUESTIONNAIRE,
  SOCIAL_PREFERENCES,
} from '@/lib/constants';""",
"""import {
  AVAILABILITY_OPTIONS,
  AVOID_TOPICS,
  CITY_OPTIONS,
  DIETARY_OPTIONS,
  FOOD_OPTIONS,
  INTEREST_OPTIONS,
  QUESTIONNAIRE,
  SOCIAL_PREFERENCES,
  availabilityLabel,
  avoidLabel,
  cityLabel,
  dietaryLabel,
  foodLabel,
  interestLabel,
  socialLabel,
} from '@/lib/constants';"""),

# ---------- step titles ----------
("""const STEPS = [
  { key: 'identity', title: 'Who you are', label: 'Identity' },
  { key: 'photo', title: 'A face for the table', label: 'Photo' },
  { key: 'city', title: 'Where you live', label: 'City' },
  { key: 'interests', title: 'What you’re into', label: 'Interests' },
  { key: 'table', title: 'Which tables tempt you', label: 'Tables' },
  { key: 'food', title: 'At the table', label: 'Food' },
  { key: 'personality', title: 'How you talk', label: 'Personality' },
  { key: 'review', title: 'One last look', label: 'Review' },
] as const;""",
"""const STEPS = [
  { key: 'identity', title: 'Wer du bist', label: 'Identität' },
  { key: 'photo', title: 'Ein Gesicht für den Tisch', label: 'Foto' },
  { key: 'city', title: 'Wo du lebst', label: 'Stadt' },
  { key: 'interests', title: 'Was dich begeistert', label: 'Interessen' },
  { key: 'table', title: 'Welche Tische dich reizen', label: 'Tische' },
  { key: 'food', title: 'Am Tisch', label: 'Essen' },
  { key: 'personality', title: 'Wie du sprichst', label: 'Persönlichkeit' },
  { key: 'review', title: 'Ein letzter Blick', label: 'Prüfen' },
] as const;"""),

# ---------- validation ----------
("return 'We need a name to introduce you by.';", "return 'Wir brauchen einen Namen, mit dem wir dich vorstellen.';"),
("return 'Please add your date of birth — DEJAVU is 18+ only.';", "return 'Bitte gib dein Geburtsdatum an – DEJAVU ist nur ab 18.';"),
("return 'DEJAVU is for adults only (18+).';", "return 'DEJAVU ist nur für Erwachsene (ab 18).';"),
("return 'Please confirm you are 18 or older.';", "return 'Bitte bestätige, dass du mindestens 18 bist.';"),
("return 'Which city will you be dining in?';", "return 'In welcher Stadt möchtest du essen gehen?';"),
("return 'Choose at least three interests.';", "return 'Wähle mindestens drei Interessen.';"),
("return 'Choose at least one table.';", "return 'Wähle mindestens einen Tisch.';"),
("return 'Answer all four questions — there are no wrong answers.';", "return 'Beantworte alle vier Fragen – es gibt keine falschen Antworten.';"),
("throw new Error('Your session has expired. Please sign in again.');", "throw new Error('Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.');"),
("router.push('/app?notice=Your%20profile%20is%20complete.');", "router.push('/app?notice=Dein%20Profil%20ist%20vollst%C3%A4ndig.');"),
("setError(e instanceof Error ? e.message : 'Something went wrong saving your progress.');",
 "setError(e instanceof Error ? e.message : 'Beim Speichern deines Fortschritts ist etwas schiefgelaufen.');"),
("throw new Error('Please sign in again.');", "throw new Error('Bitte melde dich erneut an.');"),
("setError(e instanceof Error ? e.message : 'Upload failed. Try a smaller image.');",
 "setError(e instanceof Error ? e.message : 'Upload fehlgeschlagen. Versuche es mit einem kleineren Bild.');"),

# ---------- completion screen ----------
('<p className="label text-ink/40">Onboarding complete</p>', '<p className="label text-ink/45">Profil vollständig</p>'),
("""          Your seat is being considered.""", """          Dein Platz wird gerade bedacht."""),
("""          We’ll compose your first table by hand and let you know as soon as it’s confirmed. In the
          meantime, your dashboard is open.""",
"""          Wir stellen deinen ersten Tisch von Hand zusammen und melden uns, sobald er bestätigt ist.
          Bis dahin steht dir dein Mitgliederbereich offen."""),
("""            Go to dashboard""", """            Zum Mitgliederbereich"""),
("""            Edit profile""", """            Profil bearbeiten"""),

# ---------- step 0 ----------
('<Field label="Full name">', '<Field label="Vollständiger Name">'),
('placeholder="As you’d like to be introduced"', 'placeholder="So möchtest du vorgestellt werden"'),
('<Field label="Email">', '<Field label="E-Mail">'),
('<Field label="Date of birth">', '<Field label="Geburtsdatum">'),
('<Field label="Occupation">', '<Field label="Beruf">'),
('placeholder="What you do, plainly"', 'placeholder="Was du machst, ganz einfach"'),
("""                        I confirm I am 18 or older and agree to the community guidelines.""",
"""                        Ich bestätige, dass ich mindestens 18 Jahre alt bin, und akzeptiere die
                        Community-Richtlinien."""),

# ---------- step 1 ----------
('alt="Your photo"', 'alt="Dein Foto"'),
("""                        {draft.avatar_url ? 'Replace photo' : 'Upload a photo'}""",
"""                        {draft.avatar_url ? 'Foto ersetzen' : 'Foto hochladen'}"""),
("""                        A real photograph of you, not a group shot. Members only see it once a table
                        is confirmed. You can skip and add it later.""",
"""                        Ein echtes Foto von dir, kein Gruppenbild. Andere Mitglieder sehen es erst,
                        wenn ein Tisch bestätigt ist. Du kannst diesen Schritt überspringen und das
                        Foto später ergänzen."""),

# ---------- step 2 ----------
('<Field label="City">', '<Field label="Stadt">'),
('<option value="">Select your city</option>', '<option value="">Wähle deine Stadt</option>'),
('<Field label="A short introduction">', '<Field label="Eine kurze Vorstellung">'),
('placeholder="Three sentences. What you do, what you care about, what makes you good company."',
 'placeholder="Drei Sätze. Was du machst, was dir wichtig ist und warum man mit dir einen guten Abend verbringt."'),
('<Field label="Instagram (optional)">', '<Field label="Instagram (optional)">'),
('<Field label="When can you usually come?">', '<Field label="Wann passt es dir meistens?">'),

# ---------- step 3 ----------
("""                      Pick what you’d happily talk about for an hour. Choose at least three — we use
                      these to find the overlaps.""",
"""                      Wähle, worüber du eine Stunde lang gerne reden würdest. Mindestens drei – daraus
                      finden wir die Überschneidungen."""),
('<Field label="Hobbies">', '<Field label="Hobbys">'),
('placeholder="Baking, bouldering, crumbly pottery"', 'placeholder="Backen, Bouldern, schiefe Töpferware"'),
('<Field label="Favourite topics">', '<Field label="Lieblingsthemen">'),
('placeholder="Cities, second acts, dessert"', 'placeholder="Städte, zweite Chancen, Dessert"'),
("<Field label=\"Topics you’d rather avoid\">", '<Field label="Themen, die du lieber vermeidest">'),

# ---------- step 4 ----------
("""                      Which rooms sound like an evening you’d look forward to?""",
"""                      Welche Runden klingen nach einem Abend, auf den du dich freust?"""),

# ---------- step 5 ----------
('<Field label="Food preferences">', '<Field label="Essensvorlieben">'),
('<Field label="Dietary restrictions or allergies">', '<Field label="Unverträglichkeiten oder Allergien">'),
("""                      We share relevant dietary information with the restaurant and your table. It is
                      treated as private data.""",
"""                      Relevante Hinweise zu deiner Ernährung geben wir an das Restaurant und deinen
                      Tisch weiter. Sie gelten als private Daten."""),

# ---------- step 6 ----------
("""                      Four questions about how you are at a table. Honest answers make better tables
                      than flattering ones.""",
"""                      Vier Fragen dazu, wie du an einem Tisch bist. Ehrliche Antworten ergeben
                      bessere Tische als schmeichelhafte."""),
("""                            Question {qi + 1}""", """                            Frage {qi + 1}"""),
('<Field label="At a table, I am…">', '<Field label="An einem Tisch bin ich …">'),

# ---------- step 7 ----------
('<Summary label="Name"', '<Summary label="Name"'),
('<Summary label="City"', '<Summary label="Stadt"'),
('<Summary label="Occupation"', '<Summary label="Beruf"'),
('<Summary label="Availability"', '<Summary label="Zeiten"'),
('<Summary label="Interests"', '<Summary label="Interessen"'),
('label="Tables"', 'label="Tische"'),
('<Summary label="Dietary"', '<Summary label="Ernährung"'),
('<Summary label="Food"', '<Summary label="Essen"'),
("draft.dietary_restrictions.join(', ') || 'None declared'", "draft.dietary_restrictions.map(dietaryLabel).join(', ') || 'Keine angegeben'"),
('<Field label="Profile visibility">', '<Field label="Sichtbarkeit deines Profils">'),
("""                            ['table', 'Table only', 'Shared with people assigned to the same table.'],
                            ['members', 'Members', 'Visible to signed-in members.'],
                            ['private', 'Private', 'Only DEJAVU hosts see your details.'],""",
"""                            ['table', 'Nur am Tisch', 'Sichtbar für Menschen am selben Tisch.'],
                            ['members', 'Mitglieder', 'Sichtbar für angemeldete Mitglieder.'],
                            ['private', 'Privat', 'Nur das DEJAVU-Team sieht deine Angaben.'],"""),

# ---------- nav ----------
('<ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Back',
 '<ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Zurück'),
("{step === STEPS.length - 1 ? 'Finish and enter' : 'Continue'}",
 "{step === STEPS.length - 1 ? 'Abschließen und eintreten' : 'Weiter'}"),
("""                Your progress saves each time you continue. You can leave and come back.""",
"""                Dein Fortschritt wird bei jedem Schritt gespeichert. Du kannst jederzeit pausieren und
                später weitermachen."""),
('<p className="label text-ink/35">Why we ask</p>', '<p className="label text-ink/40">Warum wir fragen</p>'),
("""              “The best table is not the most similar one. It’s the one where everyone has something
              the others don’t.”""",
"""              „Der beste Tisch ist nicht der, an dem alle gleich sind. Es ist der, an dem jede Person
              etwas mitbringt, das die anderen nicht haben.“"""),
('<span className="sr-only">Saved progress restored</span>', '<span className="sr-only">Gespeicherter Fortschritt wiederhergestellt</span>'),
]

missing = []
for a, b in pairs:
    if a not in s:
        missing.append(a.strip().splitlines()[0][:80])
    s = s.replace(a, b)

# Render labels from stored values
s = s.replace("""                          <option key={c} value={c}>
                            {c}
                          </option>""",
"""                          <option key={c} value={c}>
                            {cityLabel(c)}
                          </option>""")
s = s.replace("""                              {a}
                            </Chip>""",
"""                              {availabilityLabel(a)}
                            </Chip>""")
s = s.replace("""                          {i}
                        </Chip>""",
"""                          {interestLabel(i)}
                        </Chip>""")
s = s.replace("""                            {t}
                          </Chip>""",
"""                            {avoidLabel(t)}
                          </Chip>""")
s = s.replace("""                          {f}
                        </Chip>""",
"""                          {foodLabel(f)}
                        </Chip>""")
s = s.replace("""                            {d}
                          </Chip>""",
"""                            {dietaryLabel(d)}
                          </Chip>""")
s = s.replace("""                          {s}
                        </Chip>""",
"""                          {socialLabel(s)}
                        </Chip>""")
s = s.replace("<Summary label=\"Zeiten\" value={draft.availability.join(', ') || '—'} />",
              "<Summary label=\"Zeiten\" value={draft.availability.map(availabilityLabel).join(', ') || '—'} />")
s = s.replace("<Summary label=\"Interessen\" value={draft.interests.join(', ') || '—'} />",
              "<Summary label=\"Interessen\" value={draft.interests.map(interestLabel).join(', ') || '—'} />")
s = s.replace("<Summary label=\"Essen\" value={draft.food_preferences.join(', ') || '—'} />",
              "<Summary label=\"Essen\" value={draft.food_preferences.map(foodLabel).join(', ') || '—'} />")

open(p, 'w').write(s)
print('missing patterns:', len(missing))
for m in missing:
    print('  MISS:', m)
print('changed:', s != orig)
