// Identity as data. Anything marked PLACEHOLDER is waiting on the owner.
export const siteConfig = {
  name: "Kodexa House",
  // PLACEHOLDER: the live domain once deployed.
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  tagline: "Espresso bar and roastery",
  description: "Kodexa House pulls every shot by hand: fresh-roasted beans, a 93°C brew and milk steamed to order.",
  // PLACEHOLDER: replace with the real number in international format, digits only.
  whatsapp: "923000000000",
  // PLACEHOLDER: currency symbol shown before every price.
  currency: "$",
  // PLACEHOLDER: opening hours and address.
  hours: "Open daily 08:00 to 22:00",
  hoursShort: "OPEN DAILY 08-22",
  address: "Street address coming soon",
  instagram: "#",
  tiktok: "#",
};

export const price = (n) => `${siteConfig.currency}${n}`;

export function whatsappLink(message) {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
