//u environment.ts fajlu definišemo konfiguraciju za razvojno okruženje sto nam omogućava da lako menjamo konfiguraciju za različita okruženja (razvojno, produkcijsko itd.)
// Ovaj fajl se koristi u Angular aplikacijama da bi se centralizovano čuvale konfiguracione vrednosti koje se mogu menjati u zavisnosti od okruženja u kojem se aplikacija pokreće.
// Na primer, možemo imati različite API URL-ove za razvojno i produkcijso okruženje.
// Ovaj fajl se obično koristi u kombinaciji sa environment.prod.ts fajlom koji sadrži konfiguraciju za produkcijsko okruženje ali kako je ovo školski projekat taj fajl neće biti kreiran.
export const environment = {
  production: false,
  apiUrl: 'https://event-tracker-xacy.onrender.com' 
};