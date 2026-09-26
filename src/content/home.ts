export const introduction = "Кыргызстандын кооз жаратылышын изилдеңиз: тоолор, көлдөр жана керемет жайлоолор сизди күтөт.";
export const navigation = [
  { label: "Кыргызстан жөнүндө", href: "/#about", width: 252 },
  { label: "Аймактар", href: "/#nature", width: 190 },
  { label: "Биз менен байланыш", href: "/contact", width: 236 },
] as const;

// Only the initial visual state is specified in Figma; these are not tabs.
export const destinations = [
  { label: "Ала-Арча капчыгайы", width: 207, selected: true },
  { label: "Сары-Челек биосфералык коругу", width: 294, selected: false },
  { label: "Алай тоолору", width: 172, selected: false },
  { label: "Кыргызстандын бийик тоолору", width: 285, selected: false },
] as const;
