import { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchCovid } from '../../../../util/api';
import { extractInfoCovid } from '../../../../util/helper';

export default async (request: VercelRequest, response: VercelResponse) => {
  try {
    const { propinsi, kota } = request.query;
    const res = await fetchCovid('rumah_sakit', {
      propinsi: propinsi ? `${propinsi}prop` : '',
      kabkota: kota == '0' ? '' : kota
    });
    const rsList = extractInfoCovid(res.body, request.query);
    response.json({
      type: 'covid',
      result: rsList
    });
  } catch (error) {
    response.status(500).json({
      statusCode: 500,
      error: error.message
    });
  }
}
