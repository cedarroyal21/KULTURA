export const fcfa = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

export const dateFr = (d: Date | string) =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeZone: "Africa/Douala",
  }).format(new Date(d));