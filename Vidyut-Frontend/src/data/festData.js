/**
 * VIDYUT 2026 — Amrita Vishwa Vidyapeetham Fest Data
 * Single source of truth for events, schedule, statistics, and FAQs
 */

export const FEST_METADATA = {
  name: "VIDYUT",
  edition: "2026",
  tagline: "BE THE CHANGE",
  institution: "Amrita Vishwa Vidyapeetham",
  location: "Amritapuri / Coimbatore Campus, India",
  dates: "OCTOBER 15 – 18, 2026",
  targetDate: "2026-10-15T09:00:00+05:30",
  startDateISO: "2026-08-01T00:00:00+05:30", // Start anchor for transformation progress timeline calculation
  systemStatus: "GRID NOMINAL // 50Hz SYNCHRONIZED",
};

export const UNIVERSITY_STATS = [
  {
    value: "45,000+",
    label: "National Footfall",
    detail: "Delegates from 200+ institutions across India",
    vintageLabel: "ATTENDEE FLUX",
  },
  {
    value: "₹15,00,000+",
    label: "Total Prize Pool",
    detail: "Across technical, cultural & flagship hackathons",
    vintageLabel: "GRANT ALLOCATION",
  },
  {
    value: "60+",
    label: "Curated Events",
    detail: "Hackathons, robotic arenas, pro-nights & conclaves",
    vintageLabel: "ACTIVE CHANNELS",
  },
  {
    value: "NAAC A++",
    label: "Institution Rank",
    detail: "NIRF Top 10 University & Category-1 Autonomy",
    vintageLabel: "ACCREDITATION",
  },
];

export const PILLARS_OF_CHANGE = [
  {
    id: "tech",
    title: "TECH REVOLUTION",
    subtitle: "Autonomous AI, Quantum Labs & Drone Arena",
    indicatorName: "NODE ALPHA [VOLTAGE]",
    metric: "440 V",
    description: "Challenging engineering limits through 36-hour buildathons, autonomous rovers, and cutting-edge software systems.",
    icon: "Cpu",
    tag: "DISRUPT",
  },
  {
    id: "creative",
    title: "CREATIVE SPECTRUM",
    subtitle: "Battle of the Bands, Choreo & Visual Arts",
    indicatorName: "NODE BETA [AMPERAGE]",
    metric: "120 A",
    description: "Unleashing the raw artistic frequencies of national music bands, cinematic storytelling, and stage choreography.",
    icon: "Radio",
    tag: "EXPRESS",
  },
  {
    id: "sustainable",
    title: "SUSTAINABLE TOMORROW",
    subtitle: "Green Tech, Clean Energy & Eco-Engineering",
    indicatorName: "NODE GAMMA [FLUX]",
    metric: "880 Wb",
    description: "Harnessing renewable technology and environmental engineering to design self-sustaining grassroots solutions.",
    icon: "Zap",
    tag: "SUSTAIN",
  },
  {
    id: "cognitive",
    title: "COGNITIVE HORIZONS",
    subtitle: "National Conclave, Policy & Case Debates",
    indicatorName: "NODE DELTA [RESISTANCE]",
    metric: "0.02 Ω",
    description: "Deep intellectual symposiums, venture pitches, and geopolitical strategy simulations with industry pioneers.",
    icon: "Compass",
    tag: "ELEVATE",
  },
];

export const FEST_EVENTS = [
  {
    id: "hack-vidyut",
    title: "VIDYUT HACK: 36H REVOLUTION",
    category: "Technical",
    prize: "₹2,50,000",
    teamSize: "2 - 4 Members",
    venue: "Main Computing Hub // Block 4",
    time: "Day 1 • 10:00 AM – Day 2 • 10:00 PM",
    badge: "FLAGSHIP",
    shortDesc: "National-level 36-hour continuous software & hardware hackathon focusing on AI for social good, renewable tech, and Web3 infrastructure.",
    rules: [
      "Hardware dev boards permitted (RPi, ESP32, Jetson).",
      "All code repositories must be initiated post kickoff.",
      "Mentorship sessions with top engineering leaders.",
    ],
  },
  {
    id: "robowars",
    title: "VOLT-CLASH: ROBOWARS 60KG",
    category: "Technical",
    prize: "₹1,75,000",
    teamSize: "3 - 6 Members",
    venue: "Armored Combat Arena",
    time: "Day 2 • 02:00 PM",
    badge: "COMBAT",
    shortDesc: "High-octane mechanical deathmatch inside a polycarbonate bulletproof cage. Heavy spinning drums, pneumatic flippers, and wedge chassis clash.",
    rules: [
      "Weight limit strictly capped at 60.0 kg.",
      "Flame weapons and radio jamming are strictly prohibited.",
      "Standard wireless failsafe cutoff mandatory.",
    ],
  },
  {
    id: "battle-bands",
    title: "DECIBEL: BATTLE OF THE BANDS",
    category: "Cultural",
    prize: "₹1,20,000",
    teamSize: "3 - 8 Members",
    venue: "Open Air Amphitheater",
    time: "Day 2 • 06:00 PM",
    badge: "ACOUSTIC",
    shortDesc: "India's fiercest collegiate rock, metal, and fusion bands battle it out on a stadium-grade concert rig for the national championship.",
    rules: [
      "20-minute stage time including soundcheck.",
      "At least one original composition mandatory.",
      "Live instruments only (no pre-recorded backing tracks).",
    ],
  },
  {
    id: "choreo-night",
    title: "KINETIX: NATIONAL CHOREO NIGHT",
    category: "Cultural",
    prize: "₹1,50,000",
    teamSize: "10 - 25 Members",
    venue: "Grand Auditorium",
    time: "Day 3 • 05:30 PM",
    badge: "STAGE",
    shortDesc: "Mesmerizing group dance teams showcasing cinematic themes, synchronized street styles, and classical-contemporary fusion.",
    rules: [
      "8-12 minutes performance limit.",
      "High quality stage lighting and laser effects provided.",
      "Judging based on synchronization, choreography, and thematic execution.",
    ],
  },
  {
    id: "ai-conclave",
    title: "FUTURE-SYNAPSE: GEN-AI CONCLAVE",
    category: "Workshops",
    prize: "Certificates & Grants",
    teamSize: "Individual / Pairs",
    venue: "Auditorium Hall B",
    time: "Day 1 • 01:30 PM",
    badge: "SYMPOSIUM",
    shortDesc: "Deep-dive workshops and keynote addresses by global AI researchers on sovereign models, agentic workflows, and ethical alignment.",
    rules: [
      "Hands-on access to GPU testbeds provided.",
      "Open to all registered attendees.",
      "Q&A session with venture capitalists & researchers.",
    ],
  },
  {
    id: "esports-valorant",
    title: "CYBER-GRID: VALORANT TOURNAMENT",
    category: "Esports",
    prize: "₹80,000",
    teamSize: "5 Members (+1 Sub)",
    venue: "Esports Gaming Lounge",
    time: "Day 1 & 2 • 11:00 AM",
    badge: "LAN",
    shortDesc: "LAN Finals played on 240Hz esports rigs with live shoutcasting on university streaming channels.",
    rules: [
      "Tournament format: Double Elimination BO3.",
      "Tournament draft rules and anticheat enabled.",
    ],
  },
  {
    id: "drone-racing",
    title: "AERO-FLUX: FPV DRONE RACING",
    category: "Technical",
    prize: "₹1,00,000",
    teamSize: "1 - 2 Pilots",
    venue: "Central Courtyard Obstacle Ring",
    time: "Day 3 • 11:00 AM",
    badge: "AEROSPACE",
    shortDesc: "High-speed night FPV drone obstacle racing through illuminated neon LED gates and tight chicanes.",
    rules: [
      "5-inch custom quadcopters with digital VTX.",
      "Pilots must supply frequency sheets prior to heat.",
    ],
  },
  {
    id: "case-challenge",
    title: "VENTURE-FORGE: PRODUCT SPRINT",
    category: "Management",
    prize: "₹75,000 + Incubation",
    teamSize: "2 - 3 Members",
    venue: "Management Seminar Hall",
    time: "Day 2 • 10:00 AM",
    badge: "STRATEGY",
    shortDesc: "Live crisis management and go-to-market pitching for breakthrough hardware & clean-tech startups before seed investors.",
    rules: [
      "Case study unveiled 3 hours prior to presentation.",
      "10-minute pitch + 5-minute partner grilling.",
    ],
  },
];

export const FEST_SCHEDULE = [
  {
    day: "DAY 00",
    date: "OCT 15",
    theme: "CALIBRATION & ARRIVAL",
    events: [
      { time: "09:00 AM", title: "Registration Desk & Dorm Allocation", loc: "Main Reception" },
      { time: "02:00 PM", title: "Hackathon Check-in & Team Scrims", loc: "Block 4 Hub" },
      { time: "06:00 PM", title: "Vidyut Opening Ceremony & Lamp Ignition", loc: "Grand Auditorium" },
      { time: "08:30 PM", title: "Acoustic Unplugged Evening", loc: "Lakeside Amphitheater" },
    ],
  },
  {
    day: "DAY 01",
    date: "OCT 16",
    theme: "THE SPARK: INITIATION",
    events: [
      { time: "09:00 AM", title: "Vidyut Hack 36H Begins", loc: "Computing Center" },
      { time: "11:00 AM", title: "Robowars Preliminary Rounds", loc: "Arena 1" },
      { time: "02:00 PM", title: "Future-Synapse AI Masterclass", loc: "Seminar Complex" },
      { time: "07:30 PM", title: "PRO-NIGHT 1: EDM & Laser Symphony", loc: "Main Stadium" },
    ],
  },
  {
    day: "DAY 02",
    date: "OCT 17",
    theme: "PEAK DISRUPTION",
    events: [
      { time: "10:00 AM", title: "Venture-Forge Pitch Finals", loc: "Hall B" },
      { time: "02:00 PM", title: "Robowars Semis & Finals", loc: "Armored Arena" },
      { time: "06:00 PM", title: "Decibel: National Battle of the Bands", loc: "Open Air Stage" },
      { time: "09:00 PM", title: "Star Night Reveal // Headliner Band", loc: "Main Stadium" },
    ],
  },
  {
    day: "DAY 03",
    date: "OCT 18",
    theme: "RESOLUTION // BE THE CHANGE",
    events: [
      { time: "10:00 AM", title: "Vidyut Hack Grand Project Expo", loc: "Exhibition Hall" },
      { time: "11:30 AM", title: "Aero-Flux FPV Drone Finals", loc: "Central Arena" },
      { time: "04:30 PM", title: "Grand Valedictory & Award Distribution", loc: "Auditorium" },
      { time: "07:30 PM", title: "MEGA CELEBRITY NIGHT & FINALE", loc: "Main Grounds" },
    ],
  },
];

export const STAR_NIGHT_TEASERS = [
  {
    id: "headliner-1",
    night: "PRO-NIGHT 01 // OCT 16",
    genre: "ELECTRONIC SOUNDSCAPE & LASER SYMPHONY",
    status: "ENERGY FLUX STABILIZING",
    hint: "Top International DJ Duo • Chart-topping EDM anthems",
    dialNeedleAngle: 65,
    revealed: false,
    placeholderName: "PROJECT [CYBER-PULSE]",
  },
  {
    id: "headliner-2",
    night: "ROCK NIGHT // OCT 17",
    genre: "INDIAN ROCK / FUSION POWERHOUSE",
    status: "FREQUENCY OSCILLATING",
    hint: "National Indie Sensation • 100M+ Streams • Stadium Anthem Creators",
    dialNeedleAngle: 110,
    revealed: false,
    placeholderName: "THE [AMRITA HEADLINER]",
  },
  {
    id: "headliner-3",
    night: "GRAND FINALE // OCT 18",
    genre: "PLAYBACK MEGASTAR & BOLLYWOOD FUSION",
    status: "MAX VOLTAGE COOLDOWN",
    hint: "National Award-winning Vocalist • 40+ Superhit Tracks",
    dialNeedleAngle: 175,
    revealed: false,
    placeholderName: "LEGEND [VOLT-RESONANCE]",
  },
];

export const FAQ_ITEMS = [
  {
    q: "Who is eligible to participate in VIDYUT 2026?",
    a: "VIDYUT is an open national-level multi-fest. Undergraduate, postgraduate, and diploma students from any recognized college or university across India and abroad are eligible to participate.",
  },
  {
    q: "How does accommodation work for outstation delegates?",
    a: "Hostel accommodation with secure rooms and subsidized meal facilities is available within the Amrita Vishwa Vidyapeetham campus for all registered outstation participants.",
  },
  {
    q: "Can I register for multiple events across different tracks?",
    a: "Yes! Your All-Access or Category Fest Pass grants you entry to multiple competitive and cultural events, provided their physical timelines do not directly clash.",
  },
  {
    q: "What does 'Be The Change' signify for this edition?",
    a: "'Be The Change' represents our evolution from traditional academic boundaries into an active catalyst for technological breakthroughs, sustainable environmental design, and cultural unity.",
  },
];
