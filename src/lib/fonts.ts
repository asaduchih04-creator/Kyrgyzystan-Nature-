import localFont from "next/font/local";

export const hoves = localFont({
  src: [
    { path: "../assets/fonts/TTHoves-Light.ttf", weight: "300" },
    { path: "../assets/fonts/TTHoves-Regular.ttf", weight: "400" },
    { path: "../assets/fonts/TTHoves-Medium.ttf", weight: "500" },
    { path: "../assets/fonts/TTHoves-DemiBold.ttf", weight: "600" },
  ],
  variable: "--font-hoves",
  display: "swap",
  adjustFontFallback: false,
});

export const monsieur = localFont({
  src: "../assets/fonts/MonsieurLaDoulaise-Regular.ttf",
  variable: "--font-monsieur",
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
});

export const alexandra = localFont({
  src: "../assets/fonts/ofont.ru_Alexandra Zeferino One.ttf",
  variable: "--font-alexandra",
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
});
