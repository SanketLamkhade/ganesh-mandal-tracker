export const MANDAL = {
  name: "Navyug Mitra Mandal",
  registerNumber: "Reg. No. 10855/95",
  establishYear: "Est. 1982",
} as const;

export const APP = {
  shortName: "Navyug Mitra Mandal",
  slug: "navyug-mitra-mandal",
  productionUrl: "https://navyug-mitra-mandal-tracker.vercel.app",
  description: "Ganesh Mandal collection and expense tracker",
  themeColor: "#7B1F1F",
} as const;

export const PAYMENT = {
  upiId: process.env.NEXT_PUBLIC_UPI_ID ?? "",
  payeeName: MANDAL.name,
  qrImagePath: "/phonepe-qr.png",
} as const;

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? APP.productionUrl;
}
