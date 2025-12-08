import { Project, Category } from '@/types';

export const categories: Category[] = [
  {
    "id": "conventions",
    "name": "Conventions",
    "description": "Corporate events, conferences, and business gatherings"
  },
  {
    "id": "events",
    "name": "Events",
    "description": "Live performances, concerts, and entertainment venues"
  },
  {
    "id": "exhibitions",
    "name": "Exhibitions",
    "description": "Trade shows, art exhibitions, and cultural displays"
  },
  {
    "id": "fashion-shows",
    "name": "Fashion Shows",
    "description": "Fashion runways and designer showcases"
  },
  {
    "id": "theater",
    "name": "Theater",
    "description": "Stage productions and theatrical performances"
  }
];

export const projects: Project[] = [
  {
    "id": "resort-fashion-show",
    "title": "Resort Collection Fashion Showtwrwerw",
    "category": "fashion-shows",
    "year": 2024,
    "client": "International Fashion Brand",
    "description": "Outdoor runway show with natural backdrop and sustainable materials integration.",
    "thumbnail": "/images/projects/resort-fashion-show/thumb.webp",
    "stages": [
      {
        "type": "drawing",
        "title": "Outdoor Runway",
        "images": [
          "/images/projects/resort-fashion-show/drawing-1.jpg",
          "/images/projects/resort-fashion-show/drawing-2.webp",
          "/images/projects/resort-fashion-show/stage-1765134068255-688a-1.png"
        ],
        "description": "Site planning and sustainability features",
        "id": "stage-1765134068255-688a",
        "icon": "blueprint"
      },
      {
        "type": "final",
        "title": "Fashion Show",
        "images": [
          "/images/projects/resort-fashion-show/final-1.jpg",
          "https://raw.githubusercontent.com/Arte-Studio-srl/website/main/public/images/projects/resort-fashion-show/stage-1765134068255-490a-1765227990330-fr6a.jpg",
          "https://raw.githubusercontent.com/Arte-Studio-srl/website/main/public/images/projects/resort-fashion-show/stage-1765134068255-490a-1765228298810-du39.png",
          "https://raw.githubusercontent.com/Arte-Studio-srl/website/main/public/images/projects/resort-fashion-show/stage-1765134068255-490a-1765229312614-qqob.png",
          "https://raw.githubusercontent.com/Arte-Studio-srl/website/main/public/images/projects/resort-fashion-show/stage-1765134068255-490a-1765229905196-xjgq.png"
        ],
        "description": "The outdoor fashion presentation",
        "id": "stage-1765134068255-490a",
        "icon": "layers"
      }
    ]
  },
  {
    "id": "ballet-production",
    "title": "Classical Ballet Production",
    "category": "theater",
    "year": 2023,
    "client": "National Ballet Company",
    "description": "Elaborate stage sets for classical ballet with multiple scene changes and traditional aesthetics.",
    "thumbnail": "/images/projects/ballet-production/thumb.png",
    "stages": [
      {
        "type": "drawing",
        "title": "Set Design",
        "images": [
          "/images/projects/ballet-production/drawing-3.png",
          "/images/projects/ballet-production/drawing-4.jpg"
        ],
        "description": "Scenic design and transformation mechanics"
      },
      {
        "type": "final",
        "title": "Ballet Performance",
        "images": [
          "/images/projects/ballet-production/final-1.png",
          "/images/projects/ballet-production/final-2.png"
        ],
        "description": "The ballet in full production"
      }
    ]
  },
  {
    "id": "luxury-brand-booth",
    "title": "Luxury Brand Exhibition Booth",
    "category": "fashion-shows",
    "year": 2024,
    "client": "High-End Jewelry Brand",
    "description": "Prestigious exhibition stand with secure display cases and elegant customer experience areas.",
    "thumbnail": "/images/projects/luxury-brand-booth/thumb.jpg",
    "stages": [
      {
        "type": "drawing",
        "title": "Booth Concept",
        "images": [
          "/images/projects/luxury-brand-booth/drawing-1.svg",
          "/images/projects/luxury-brand-booth/drawing-2.png"
        ],
        "description": "Luxury design and security integration"
      },
      {
        "type": "final",
        "title": "Exhibition Booth",
        "images": [
          "/images/projects/luxury-brand-booth/final-1.jpg",
          "/images/projects/luxury-brand-booth/final-2.jpg"
        ],
        "description": "The completed luxury showcase"
      }
    ]
  },
  {
    "id": "startup-summit",
    "title": "Startup & Innovation Summit",
    "category": "conventions",
    "year": 2024,
    "client": "European Startup Network",
    "description": "Dynamic convention space with pitch stages, networking zones, and exhibition areas.",
    "thumbnail": "/images/projects/startup-summit/thumb.jpg",
    "stages": [
      {
        "type": "drawing",
        "title": "Summit Design",
        "images": [],
        "description": "Flexible space planning for multiple activities"
      },
      {
        "type": "final",
        "title": "Summit Venue",
        "images": [],
        "description": "The summit in full swing"
      }
    ]
  },
  {
    "id": "outdoor-concert-series",
    "title": "Summer Concert Series Stages",
    "category": "events",
    "year": 2023,
    "client": "City Cultural Department",
    "description": "Series of temporary stages for summer concert program in public spaces.",
    "thumbnail": "/images/projects/concert-series/thumb.jpg",
    "stages": [
      {
        "type": "drawing",
        "title": "Stage Designs",
        "images": [],
        "description": "Modular stage system for different venues"
      },
      {
        "type": "final",
        "title": "Concert Stages",
        "images": [
          "/images/projects/concert-series/final-1.jpg"
        ],
        "description": "Stages across various locations"
      }
    ]
  },
  {
    "id": "hgdf",
    "title": "hgdf",
    "category": "events",
    "year": 2025,
    "client": "wtf",
    "description": "dghfgd",
    "thumbnail": "/images/projects/hgdf/thumb.jpg",
    "stages": [
      {
        "type": "drawing",
        "title": "Technical Drawings",
        "images": [],
        "description": "",
        "id": "stage-1765148907754-68ec",
        "icon": "blueprint"
      },
      {
        "type": "final",
        "title": "Final Implementation",
        "images": [
          "/images/projects/hgdf/final-2.jpg",
          "/images/projects/hgdf/final-2.jpg"
        ],
        "description": "",
        "id": "stage-1765148907754-27a7",
        "icon": "camera"
      }
    ]
  },
  {
    "id": "siemens",
    "title": "Siemens",
    "category": "stands",
    "year": 2025,
    "client": "",
    "description": "Makalll",
    "thumbnail": "/images/projects/siemens/thumb.jpg",
    "stages": [
      {
        "type": "drawing",
        "title": "Technical Drawings",
        "images": [
          "/images/projects/siemens/drawing-2.jpg",
          "/images/projects/siemens/drawing-2.jpg",
          "/images/projects/siemens/drawing-3.jpg",
          "/images/projects/siemens/drawing-3.jpg"
        ],
        "description": ""
      },
      {
        "type": "final",
        "title": "Final Implementation",
        "images": [
          "/images/projects/siemens/final-2.jpg",
          "/images/projects/siemens/final-2.jpg"
        ],
        "description": ""
      }
    ]
  },
  {
    "id": "hjkhkjhkj",
    "title": "hjkhkjhkj",
    "category": "events",
    "year": 2025,
    "client": "dfg",
    "description": "etyerty",
    "thumbnail": "/images/projects/hjkhkjhkj/thumb.png",
    "stages": [
      {
        "id": "stage-1765150232255-e2cb",
        "title": "Step 1",
        "description": "",
        "images": [
          "/images/projects/hjkhkjhkj/stage-1765150232255-e2cb-1.jpg"
        ],
        "icon": "blueprint"
      }
    ]
  },
  {
    "id": "cagss",
    "title": "cagss",
    "category": "events",
    "year": 2025,
    "client": "xaop",
    "description": "xajajjajaja",
    "thumbnail": "https://raw.githubusercontent.com/Arte-Studio-srl/website/main/public/images/projects/cagss/thumb.jpg",
    "stages": [
      {
        "id": "stage-1765205965755-66c4",
        "title": "Step 1",
        "description": "paoapsoapospaospaospao",
        "images": [
          "https://raw.githubusercontent.com/Arte-Studio-srl/website/main/public/images/projects/cagss/stage-1765205965755-66c4-1765206004508-kuc5.jpg",
          "https://raw.githubusercontent.com/Arte-Studio-srl/website/main/public/images/projects/cagss/stage-1765205965755-66c4-1765206013031-pjvy.png"
        ],
        "icon": "blueprint"
      }
    ]
  }
];

export function getProjectsByCategory(categoryId: string): Project[] {
  return projects.filter(p => p.category === categoryId);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}

