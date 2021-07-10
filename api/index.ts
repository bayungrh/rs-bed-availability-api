import { VercelRequest, VercelResponse } from '@vercel/node';

export default (_: VercelRequest, response: VercelResponse) => {
  response.json({
    endpoint: {
      covid: '/api/covid/[id_propinsi]/[id_kota]',
      non_covid: '/api/non-covid/[id_propinsi]/[id_kota]',
      detail: '/api/bed-detail/[hospital_code]'
    },
    repository: 'https://github.com/bayungrh/rs-bed-availability-api'
  });
}
