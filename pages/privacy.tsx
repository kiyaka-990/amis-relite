import LegalPage from '../components/LegalPage';

const SECTIONS = [
  {
    h: 'Who we are',
    p: [
      'Amis Relite Limited is a construction and civil engineering company based in Nairobi, Kenya. This policy explains what we collect when you use this website, why we collect it, and the choices you have.',
      'For any question about your data, contact info@amisrelite.co.ke or call +254 725 590275.',
    ],
  },
  {
    h: 'Information you give us',
    p: ['When you submit the enquiry form, chat with ARIA or message us on WhatsApp, you may share:'],
    list: [
      'Your name, email address and phone number',
      'The type, location and estimated budget of your project',
      'Any other details you choose to include in your message',
    ],
  },
  {
    h: 'Information collected automatically',
    p: [
      'This site stores a small amount of data in your browser so it works the way you expect it to: your theme and accessibility preferences, and — if you use the admin portal — your saved content and access password.',
      'That data never leaves your device unless you save changes in the admin portal, in which case the content you publish is stored on our server so every visitor can see it.',
    ],
  },
  {
    h: 'How we use your information',
    list: [
      'To respond to your enquiry and prepare a quote within 24 hours',
      'To plan, deliver and follow up on the project you asked about',
      'To improve this website and the services we offer',
      'To meet legal and regulatory obligations, including National Construction Authority requirements',
    ],
  },
  {
    h: 'Cookies and analytics',
    p: [
      'We use essential local storage only — no advertising cookies, no cross-site tracking and no third-party analytics on this website. You can clear this data at any time through your browser settings; the site will simply return to its default appearance.',
    ],
  },
  {
    h: 'Sharing and retention',
    p: [
      'We do not sell or rent your personal information. We share it only with the team members working on your project and with suppliers directly needed to deliver it, and only where necessary.',
      'Enquiry records are kept for as long as needed to serve you and to meet legal requirements, after which they are deleted or anonymised.',
    ],
  },
  {
    h: 'Your rights',
    p: [
      'You may ask us for a copy of the information we hold about you, request corrections, or ask us to delete it. We respond to verified requests within 30 days. Write to info@amisrelite.co.ke to make a request.',
    ],
  },
  {
    h: 'Changes to this policy',
    p: [
      'We may update this page as our services or legal obligations change. The “last updated” date at the top always reflects the current version.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      crumb="Privacy"
      updated="30 October 2026"
      meta="How Amis Relite Limited collects, uses and protects your personal information on this website."
      subtitle="Your project details are yours. Here is exactly what we collect, why we collect it, and how to control it."
      image="/images/runda.jpeg"
      sections={SECTIONS}
    />
  );
}
