export type DemoCategory =
  | "F&B"
  | "Gaya Hidup"
  | "Kesihatan"
  | "Wellness"
  | "Fesyen"
  | "Hartanah"
  | "Pendidikan"
  | "Elektronik";

export type Demo = {
  slug: string;
  name: string;
  category: DemoCategory;
  /** filter key used by the portfolio tabs */
  filter: "fnb" | "fesyen" | "hartanah" | "pendidikan" | "elektronik" | "wellness";
  label: string;
  desc: string;
  /** gradient thumb class (see globals / portfolio) */
  thumb: string;
};

export const demos: Demo[] = [
  { slug: "cafe-kopi-lembah",   name: "Kafe Kopi Lembah",     category: "F&B",        filter: "fnb",        label: "F&B",        desc: "Menu, review, tempahan WhatsApp.",  thumb: "p1" },
  { slug: "barbershop-blade",   name: "Blade & Co.",          category: "Gaya Hidup", filter: "wellness",   label: "Gaya Hidup", desc: "Senarai harga, tempah slot.",       thumb: "p2" },
  { slug: "klinik-gigi-senyum", name: "Klinik Gigi Senyum",   category: "Kesihatan",  filter: "wellness",   label: "Kesihatan",  desc: "Servis, FAQ, sistem temujanji.",    thumb: "p3" },
  { slug: "gym-forge",          name: "Gym Forge",            category: "Wellness",   filter: "wellness",   label: "Wellness",   desc: "Program, pelan harga, free trial.", thumb: "p4" },
  { slug: "butik-fesyen",       name: "Wardrobe by Nur",      category: "Fesyen",     filter: "fesyen",     label: "Fesyen",     desc: "Koleksi, bestseller, Instagram.",   thumb: "p5" },
  { slug: "hartanah-realty",    name: "Prima Realty",         category: "Hartanah",   filter: "hartanah",   label: "Hartanah",   desc: "Listing, ejen, carian hartanah.",   thumb: "p6" },
  { slug: "tadika-ceria",       name: "Tadika Ceria Bestari", category: "Pendidikan", filter: "pendidikan", label: "Pendidikan", desc: "Program, yuran, borang daftar.",    thumb: "p7" },
  { slug: "kedai-elektronik",   name: "TechZone Gadget",      category: "Elektronik", filter: "elektronik", label: "Elektronik", desc: "Produk, flash sale, servis.",       thumb: "p8" },
  { slug: "spa-wellness",       name: "Serenity Spa KL",      category: "Wellness",   filter: "wellness",   label: "Wellness",   desc: "Rawatan, pakej, tempahan.",         thumb: "p9" },
  { slug: "restoran-tomyam",    name: "Tom Yam Sungai Besar", category: "F&B",        filter: "fnb",        label: "F&B",        desc: "Menu, signature, review.",          thumb: "p10" },
];

export function getDemo(slug: string) {
  return demos.find((d) => d.slug === slug);
}

export const WHATSAPP = "60182399476";
export const EMAIL = "muhammad.adamx96@gmail.com";
export const SITE_URL = "https://adamsofi.com";
