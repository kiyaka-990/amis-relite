export interface SiteSettings {
  name: string;
  tag: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  addr: string;
  hours: string;
  /** International format, digits only or with leading + — used for wa.me links */
  whatsapp: string;
  whatsappMsg: string;
  facebook: string;
  instagram: string;
  linkedin: string;
}

export interface HeroSlide {
  tag: string;
  title: string;
  em: string;
  desc: string;
  cta1: { l: string; h: string };
  cta2: { l: string; h: string };
  img: string;
}

export interface Stat { num: string; lbl: string }
export interface Service { num: string; icon: string; title: string; desc: string; img: string }

export interface Project {
  id: number;
  name: string;
  cat: string;
  status: string;
  loc: string;
  dur: string;
  desc: string;
  img: string;
  color: string;
}

export interface Testimonial { text: string; name: string; role: string; img: string; stars: number }
export interface TeamMember { name: string; role: string; img: string; bio: string }
export interface Faq { q: string; a: string }

export interface SiteContent {
  site: SiteSettings;
  hero: HeroSlide[];
  stats: Stat[];
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  team: TeamMember[];
  faqs: Faq[];
}

export type CollectionKey = 'hero' | 'stats' | 'services' | 'projects' | 'testimonials' | 'team' | 'faqs';
