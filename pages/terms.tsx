import LegalPage from '../components/LegalPage';

const SECTIONS = [
  {
    h: 'About these terms',
    p: [
      'These terms apply when you engage Amis Relite Limited for construction, engineering or consulting work, and when you use this website. By requesting a quote or signing a project contract, you accept them.',
      'Where a signed project contract exists, that contract takes precedence over this page.',
    ],
  },
  {
    h: 'Quotes and contracts',
    list: [
      'Quotes are free, itemised and valid for 30 days from the date issued',
      'A quote becomes a binding scope only once both parties sign the project contract',
      'Changes requested after signing are priced separately and confirmed in writing before we proceed',
      'No work begins until the agreed deposit has cleared',
    ],
  },
  {
    h: 'Pricing and payments',
    p: [
      'Prices are quoted in Kenyan Shillings and include materials, labour and supervision as detailed in your itemised quote. Statutory charges such as county fees are passed through at cost.',
      'Payment milestones are defined in your contract — typically a deposit, staged payments at agreed progress points, and a final balance on practical completion. Invoices are due within 14 days unless stated otherwise.',
    ],
  },
  {
    h: 'Timelines',
    p: [
      'Every schedule we give you is based on the scope, site conditions and approvals required at the time of signing. We keep you updated with written milestone reports throughout.',
      'Timelines may be extended by events outside our control — extreme weather, authority approval delays, or changes to the approved drawings — and we will notify you in writing as soon as any impact is known.',
    ],
  },
  {
    h: 'Quality, safety and compliance',
    list: [
      'All work complies with the Kenya Building Code and applicable local authority standards',
      'We are registered with the National Construction Authority (NCA)',
      'Sites are supervised, insured and subject to regular safety inspections',
      'Materials meet the specifications agreed in your contract',
    ],
  },
  {
    h: 'Warranties',
    p: [
      'We warrant our workmanship against defects for 12 months from practical completion, provided the defect results from our work and not from misuse, alteration, or normal wear.',
      'Manufacturer warranties on materials and equipment are passed on to you in full. To report a defect, contact us with your project reference and photographs — we acknowledge every claim within 5 working days.',
    ],
  },
  {
    h: 'Responsibilities',
    p: [
      'You are responsible for providing accurate site information, timely approvals and access to the site, and for making payments according to the contract schedule.',
      'We are responsible for delivering the agreed scope safely, on schedule and to specification. Our liability for any single claim is limited to the contract value of the project it relates to, except where the law says otherwise.',
    ],
  },
  {
    h: 'Website use',
    p: [
      'The content, images and branding on this site belong to Amis Relite Limited or its licensors and may not be reproduced without written permission. Project photographs are shared with client consent.',
      'This site is provided “as is” without warranties of any kind. Links to third-party sites are provided for convenience; we are not responsible for their content.',
    ],
  },
  {
    h: 'Governing law',
    p: [
      'These terms are governed by the laws of the Republic of Kenya, and the courts of Kenya have jurisdiction over any dispute. Where possible, we will first try to resolve any disagreement through direct discussion or mediation.',
    ],
  },
  {
    h: 'Changes and contact',
    p: [
      'We may update these terms occasionally; the “last updated” date shows the current version. Continued use of this site after a change means you accept the revised terms.',
      'Questions? Email info@amisrelite.co.ke or call +254 725 590275.',
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      crumb="Terms"
      updated="30 October 2026"
      meta="The terms that apply to Amis Relite Limited projects, quotes, warranties and this website."
      subtitle="Plain-language terms for working with us — quotes, payments, timelines, warranties and responsibilities."
      image="/images/belgravia-8.jpeg"
      sections={SECTIONS}
    />
  );
}
