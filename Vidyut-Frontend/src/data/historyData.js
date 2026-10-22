// Newest edition first.
// Edition facts come from https://vidyut-last.vercel.app/ (title, dates, venue, nav sections).
// Anything marked TODO is not on the old site: fill it in with real numbers.

/* ------------------------------------------------------------------ */
/* Photos for the book, imported from src/assets.                      */
/* import.meta.glob picks up every image in that folder at build time. */
/* If a file is missing, img() returns null and the built-in artwork   */
/* (`art`) is shown instead, so a missing photo never breaks the page. */
/* ------------------------------------------------------------------ */
const ASSET_IMAGES = import.meta.glob('../assets/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});
const img = name => ASSET_IMAGES['../assets/' + name] || null;

/* ------------------------------------------------------------------ */
/* Built-in tech-fest artwork (inline SVG, always loads, no hotlinks)  */
/* Used as the fallback whenever a photo fails to load.                */
/* ------------------------------------------------------------------ */
const svg = (inner, a = '#2d1042', b = '#0f0618') =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
      `<rect width="400" height="300" fill="url(#g)"/>${inner}</svg>`
  );

const OR = '#ff9a5c';
const PK = '#ff7ab0';
const CR = '#ffd9a8';

const codeLines = [
  [0, 120, OR], [20, 180, CR], [20, 90, PK], [40, 150, CR],
  [40, 200, OR], [20, 110, PK], [0, 60, CR], [0, 140, OR],
]
  .map(([ind, w, c], i) => `<rect x="${62 + ind}" y="${86 + i * 20}" width="${w}" height="8" rx="4" fill="${c}" opacity="0.9"/>`)
  .join('');

const bars = Array.from({ length: 14 }, (_, i) => {
  const h = 30 + ((i * 37) % 70);
  return `<rect x="${40 + i * 25}" y="${230 - h}" width="12" height="${h}" rx="3" fill="${i % 2 ? OR : PK}" opacity="0.85"/>`;
}).join('');

const crowd = Array.from({ length: 11 }, (_, i) => `<circle cx="${20 + i * 36}" cy="${292 - (i % 3) * 6}" r="${17 + (i % 2) * 4}" fill="#05030a"/>`).join('');

const pins = Array.from({ length: 6 }, (_, i) => {
  const p = 155 + i * 18;
  const q = 105 + i * 18;
  return `<path d="M${p} 90V68M${p} 210V232M140 ${q}H118M260 ${q}H282" stroke="${CR}" stroke-width="3" stroke-linecap="round"/>`;
}).join('');

const traces =
  `<path d="M155 68V40H60M191 68V30H340M227 68V50H300V20" stroke="${OR}" stroke-width="2" fill="none" opacity="0.8"/>` +
  `<path d="M155 232V262H80M209 232V270H330M245 232V250H370" stroke="${PK}" stroke-width="2" fill="none" opacity="0.8"/>` +
  `<path d="M118 105H60V180M118 141H30M282 123H350V200M282 159H380" stroke="${CR}" stroke-width="2" fill="none" opacity="0.6"/>` +
  [[60, 40], [340, 30], [300, 20], [80, 262], [330, 270], [370, 250], [60, 180], [30, 141], [350, 200], [380, 159]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${OR}"/>`)
    .join('');

export const ART = {
  code: svg(
    `<rect x="40" y="36" width="320" height="228" rx="12" fill="rgba(5,3,10,0.65)" stroke="${OR}" stroke-opacity="0.6"/>` +
      `<circle cx="62" cy="56" r="5" fill="${PK}"/><circle cx="80" cy="56" r="5" fill="${OR}"/><circle cx="98" cy="56" r="5" fill="${CR}"/>` +
      codeLines +
      `<rect x="62" y="246" width="10" height="3" fill="${CR}"/>`
  ),
  stage: svg(
    `<polygon points="80,0 120,0 230,230 20,230" fill="${CR}" opacity="0.16"/>` +
      `<polygon points="280,0 320,0 380,230 170,230" fill="${PK}" opacity="0.2"/>` +
      `<polygon points="190,0 210,0 300,230 110,230" fill="${OR}" opacity="0.18"/>` +
      bars +
      crowd,
    '#3a1250',
    '#0a0412'
  ),
  car: svg(
    `<g transform="translate(50 56)">` +
      `<path d="M30 150L50 120Q70 95 110 92L170 92Q200 95 220 118L255 128Q268 132 268 150Z" fill="${OR}"/>` +
      `<path d="M92 96L118 74Q125 70 135 70L172 70Q182 70 190 78L212 100Z" fill="#1a0a28"/>` +
      `<circle cx="80" cy="152" r="23" fill="#05030a" stroke="${CR}" stroke-width="4"/>` +
      `<circle cx="225" cy="152" r="23" fill="#05030a" stroke="${CR}" stroke-width="4"/>` +
      `</g>` +
      `<path d="M20 240H380" stroke="${CR}" stroke-opacity="0.4" stroke-width="2"/>` +
      `<path d="M10 120H60M0 150H44M18 180H70" stroke="${PK}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`,
    '#2a0f3a',
    '#0f0618'
  ),
  chip: svg(
    `<rect x="140" y="90" width="120" height="120" rx="10" fill="#05030a" stroke="${OR}" stroke-width="3"/>` +
      `<rect x="168" y="118" width="64" height="64" rx="6" fill="none" stroke="${PK}" stroke-width="2"/>` +
      `<circle cx="200" cy="150" r="9" fill="${OR}"/>` +
      pins +
      traces
  ),
  robot: svg(
    `<path d="M200 80V50" stroke="${CR}" stroke-width="4" stroke-linecap="round"/><circle cx="200" cy="44" r="8" fill="${PK}"/>` +
      `<rect x="100" y="125" width="14" height="40" rx="5" fill="${OR}"/><rect x="286" y="125" width="14" height="40" rx="5" fill="${OR}"/>` +
      `<rect x="120" y="80" width="160" height="130" rx="28" fill="#1a0a28" stroke="${OR}" stroke-width="3"/>` +
      `<circle cx="165" cy="140" r="17" fill="${OR}"/><circle cx="235" cy="140" r="17" fill="${OR}"/>` +
      `<circle cx="165" cy="140" r="6" fill="#05030a"/><circle cx="235" cy="140" r="6" fill="#05030a"/>` +
      `<rect x="168" y="178" width="64" height="9" rx="4.5" fill="${PK}"/>` +
      `<rect x="150" y="222" width="100" height="56" rx="14" fill="#1a0a28" stroke="${OR}" stroke-width="3"/>`
  ),
};

ART.night = svg(
  `<polygon points="60,0 100,0 190,230 10,230" fill="#9ab4ff" opacity="0.18"/>` +
    `<polygon points="300,0 340,0 395,230 215,230" fill="${PK}" opacity="0.22"/>` +
    `<circle cx="200" cy="70" r="46" fill="${CR}" opacity="0.14"/>` +
    bars +
    crowd,
  '#1b1450',
  '#07030f'
);

/* ------------------------------------------------------------------ */
/* Editions. In the book: title/text on the LEFT page, `image` on the RIGHT. */
/* ------------------------------------------------------------------ */
export const HISTORY_EDITIONS = [
  {
    year: '2025',
    label: "VIDYUT '25",
    dates: 'MAY 23 - 25, 2025',
    title: 'National Level Multifest',
    blurb:
      'A 3-day inter-collegiate multifest at Amrita Vishwa Vidyapeetham, Amritapuri Campus, Kollam, Kerala. Workshops, competitions and cultural showcases, open to students from across the country.',
    stats: [
      { value: '3', label: 'DAYS' },
      { value: 'PAN-INDIA', label: 'PARTICIPATION' },
      // TODO: { value: '??', label: 'COLLEGES' },
      // TODO: { value: '??', label: 'FOOTFALL' },
    ],
    highlights: ['Proshow', 'Auto Expo', 'Workshops', 'Events', 'Echo AI assistant'],
    image: img('war-of-the-bots.jpg'),
    art: ART.stage,
  },
  // ---- SAMPLE CONTENT below: placeholder text for earlier years. ----
  // Replace the blurbs / highlights / stats / images with the real details when you have them.
  {
    year: '2024',
    label: "VIDYUT '24",
    dates: '',
    title: 'Tech. Culture. Competition.',
    blurb:
      'Sample copy: a campus-wide celebration of engineering and art, with contests, live performances and hands-on sessions running day and night.',
    stats: [],
    highlights: ['Proshow', 'Hackathon', 'Robotics', 'Workshops'],
    image: img('hackathon.jpg'),
    art: ART.robot,
  },
  {
    year: '2023',
    label: "VIDYUT '23",
    dates: '',
    title: 'Where Ideas Go Live',
    blurb:
      'Sample copy: teams from across the country built, pitched and performed on the same stage, with a packed schedule of events and showcases.',
    stats: [],
    highlights: ['Proshow', 'Tech Events', 'Cultural Events', 'Expo'],
    image: img('robosoccer.jpg'),
    art: ART.chip,
  },
  {
    year: '2022',
    label: "VIDYUT '22",
    dates: '',
    title: 'The Comeback Edition',
    blurb:
      'Sample copy: the fest returned to campus with a full line-up of competitions, workshops and a big closing night.',
    stats: [],
    highlights: ['Proshow', 'Competitions', 'Workshops'],
    image: img('mini-offroad-rc.jpg'),
    art: ART.code,
  },
];

/* ------------------------------------------------------------------ */
/* Event pages that sit between the editions.                          */
/* tag + caption + blurb = LEFT page text, image = RIGHT page picture. */
/* `fit: 'contain'` keeps wide pictures uncropped.                     */
/* The pictures themselves carry no text.                              */
/* ------------------------------------------------------------------ */
export const HISTORY_MOMENTS = [
  {
    id: 'auto',
    tag: 'Auto Expo',
    caption: 'Machines on display',
    blurb: 'Cars and machines take the spotlight at the Auto Expo.',
    image: img('auto-expo.jpg'),
    fit: 'contain',
    art: ART.car,
  },
  {
    id: 'drone-workshop',
    tag: 'Workshop',
    caption: 'Fly High: A Practical Drone Workshop',
    blurb: 'A hands-on drone workshop by Garuda Aerospace.',
    image: img('drone-workshop.jpg'),
    art: ART.robot,
  },
  {
    id: 'drone-racing',
    tag: 'Competition',
    caption: 'Drone Racing',
    blurb: 'Drone racing presented by Pro Kerala.',
    image: img('drone-racing.jpg'),
    art: ART.stage,
  },
  {
    id: 'vehicle-design',
    tag: 'Workshop',
    caption: 'Innovative Vehicle Design Workshop',
    blurb: 'A vehicle design workshop by Mahindra-Campervan.',
    image: img('vehicle-design-workshop.jpg'),
    art: ART.car,
  },
  {
    id: 'nvidia',
    tag: 'Workshop',
    caption: 'Inside NVIDIA: Isaac SIM & Omniverse',
    blurb: 'A workshop on Isaac SIM and Omniverse, by IHub.',
    image: img('nvidia-isaac-sim.jpg'),
    art: ART.robot,
  },
  {
    id: 'quantum',
    tag: 'Workshop',
    caption: 'Qubits Unleashed',
    blurb: 'A workshop on quantum computing.',
    image: img('quantum-computing-workshop.jpg'),
    art: ART.chip,
  },
  {
    id: 'unity',
    tag: 'Workshop',
    caption: 'Game On! Unity Development',
    blurb: 'A workshop on game development with Unity.',
    image: img('unity-game-dev-workshop.jpg'),
    art: ART.code,
  },
];

export const FAQ = [
  {
    q: 'What is Vidyut?',
    a: "India's largest national-level inter-collegiate multifest, hosted at Amrita Vishwa Vidyapeetham, Amritapuri Campus. A 3-day event packed with workshops, competitions and cultural showcases.",
  },
  { q: 'When was Vidyut 25?', a: 'May 23, 24 & 25, 2025.' },
  { q: 'Where is Vidyut held?', a: 'Amrita Vishwa Vidyapeetham, Amritapuri Campus, Clappana PO, Kollam, Kerala.' },
  { q: 'Can anyone participate?', a: 'Yes, students from across the country can register and participate in various events.' },
];

export const SOCIALS = {
  whatsapp: 'https://www.whatsapp.com/channel/0029VaPtG6GL7UVYwg8BH32o',
  facebook: 'https://www.facebook.com/Vidyut.Multifest/',
  instagram: 'https://www.instagram.com/vidyutmultifest/',
  linkedin: 'https://www.linkedin.com/company/vidyut-amrita/',
};