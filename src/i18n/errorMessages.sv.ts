module.exports = {
  shortNames: ['sv', 'se'],
  longNameSe: 'Svenska',
  longNameEn: 'Swedish',
  messages: {
    /**
     * Error messages
     * This message file is included in the application that utilizes the kth-node-web-common package.
     */

    error_not_found: 'Tyvärr kunde vi inte hitta sidan du söker',
    error_generic: 'Något gick fel på servern, var god försök igen senare',
    error_status_code: 'Statuskod:',

    error_400_head_title: '400 Felaktig förfrågan',
    error_400_description: 'Förfrågan var inte på rätt format.',
    error_400_title: 'Felaktig förfrågan',
    error_400_text:
      'Förfrågan var inte på rätt format. Vänligen kontrollera att förfrågan är på rätt format och försök igen.',

    error_401_head_title: '401 Ej auktoriserad',
    error_401_description: 'Giltiga autentiseringsuppgifter saknas för denna sida.',
    error_401_title: 'Ej auktoriserad',
    error_401_text: 'Giltiga autentiseringsuppgifter saknas för denna sida.',

    error_403_head_title: '403 Nekad åtkomst',
    error_403_description: 'Du har inte tillräckliga rättigheter för att komma åt denna sida.',
    error_403_title: 'Nekad åtkomst',
    error_403_text: 'Du har inte tillräckliga rättigheter för att komma åt denna sida.',

    error_404_head_title: '404 Tyvärr hittade vi inte sidan du söker',
    error_404_description: 'Tyvärr hittade vi inte sidan du söker',
    error_404_title: 'Tyvärr hittade vi inte sidan du söker',
    error_404_text_1:
      'Den angivna webbadressen leder tyvärr inte till en sida på KTH:s webbplats. Troligtvis har sidan tagits bort eller flyttats.',
    error_404_text_2: 'Om du har skrivit in adressen för hand ber vi dig att kontrollera att den är korrekt inmatad.',

    error_404_link_text_1: 'KTH:s startsida',
    error_404_link_1: 'https://www.kth.se',
    error_404_link_text_2: 'Kontakta KTH',
    error_404_link_2: 'https://www.kth.se/om/kontakt',
    error_404_link_text_3: 'Sök på KTH:s webbplats',
    error_404_link_3: 'https://www.kth.se/search',

    error_500_head_title: 'Internt serverfel',
    error_500_description: 'Något gick fel på servern, var god försök igen senare.',
    error_500_title: 'Internt serverfel',
    error_500_text: 'Något gick fel på servern, var god försök igen senare.',
  },
}
