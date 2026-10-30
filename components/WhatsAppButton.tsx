import { useContent } from './ContentProvider';
import styles from '../styles/WhatsApp.module.css';

/** Floating WhatsApp launcher — number and greeting come from admin site settings. */
export default function WhatsAppButton() {
  const { content } = useContent();
  const num = content.site.whatsapp.replace(/[^0-9]/g, '');
  const text = encodeURIComponent(content.site.whatsappMsg || 'Hello, I would like to request a quote.');

  if (!num) return null;

  return (
    <a
      className={styles.btn}
      href={`https://wa.me/${num}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.12.56 4.19 1.62 6.02L4 29l8.13-1.58a12.03 12.03 0 0 0 3.9.66h.01c6.64 0 12.04-5.4 12.04-12.04C28.08 8.4 22.68 3 16.04 3zm0 21.9h-.01c-1.18 0-2.34-.32-3.35-.92l-.24-.14-4.83.94.95-4.7-.16-.25a9.9 9.9 0 0 1-1.52-5.27c0-5.48 4.46-9.94 9.95-9.94 2.65 0 5.14 1.04 7.02 2.92a9.88 9.88 0 0 1 2.92 7.03c0 5.49-4.46 9.95-9.95 9.95zm5.46-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48a9 9 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"
        />
      </svg>
      <span className={styles.label}>Chat on WhatsApp</span>
      <span className={styles.dot} aria-hidden="true" />
    </a>
  );
}
