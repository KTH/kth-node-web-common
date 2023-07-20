module.exports = {
  shortNames: ['en'],
  longNameSe: 'Engelska',
  longNameEn: 'English',
  messages: {
    /**
     * Error messages
     * This message file is included in the application that utilizes the kth-node-web-common package.
     */

    error_not_found: "Sorry, we can't find your requested page",
    error_generic: 'Something went wrong on the server, please try again later.',
    error_status_code: 'Status code:',

    error_400_head_title: '400 Bad request',
    error_400_description: 'The request was not on the correct format.',
    error_400_title: 'Bad request',
    error_400_text:
      'The request was not on the correct format. Make sure the request is on the correct format and try again.',

    error_401_head_title: '401 Unauthorized',
    error_401_description:
      'The request has not been applied because it lacks valid authentication credentials for the target resource.',
    error_401_title: 'Unauthorized',
    error_401_text:
      'The request has not been applied because it lacks valid authentication credentials for the target resource.',

    error_403_head_title: '403 Forbidden',
    error_403_description: 'You are not allowed to see this page.',
    error_403_title: 'Forbidden',
    error_403_text: 'You are not allowed to see this page.',

    error_404_head_title: '404 Not found',
    error_404_description: 'The page could not be found',
    error_404_title: 'The page could not be found',
    error_404_text_1:
      "Unfortunately, this web address does not lead to a page on KTH's website. The page has probably been deleted or moved.",
    error_404_text_2: 'If you have entered the address by hand, please check that it is entered correctly.',
    error_404_link_text_1: "KTH's start page",
    error_404_link_1: 'https://www.kth.se/en',
    error_404_link_text_2: 'Contact KTH',
    error_404_link_2: 'https://www.kth.se/en/om/kontakt',
    error_404_link_text_3: "Search KTH's website",
    error_404_link_3: 'https://www.kth.se/search',

    error_500_head_title: '500 Internal server error',
    error_500_description: 'The server encountered an unexpected error. Please try again later.',
    error_500_title: 'Internal server error',
    error_500_text: 'The server encountered an unexpected. Please try again later.',
  },
}
