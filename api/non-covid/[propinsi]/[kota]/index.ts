import { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchNonCovid } from '../../../../util/api';
import { extractInfoNonCovid } from '../../../../util/helper';

export default async (request: VercelRequest, response: VercelResponse) => {
  try {
    const { propinsi, kota } = request.query;
    const res = await fetchNonCovid('rumah_sakit', {
      propinsi: propinsi ? `${propinsi}prop` : '',
      kabkota: kota == '0' ? '' : kota
    });
    const rsList = extractInfoNonCovid(res.body, request.query);
    response.json({
      type: 'non-covid',
      result: rsList
    });
  } catch (error) {
    response.status(500).json({
      statusCode: 500,
      error: error.message
    });
  }
}
