import { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchNonCovid } from '../../../../util/api';
import { extractInfoNonCovid } from '../../../../util/helper';
import cache from 'memory-cache';

export default async (request: VercelRequest, response: VercelResponse) => {
  try {
    const { propinsi, kota } = request.query;
    const cacheKey = `API:NON-COVID/${propinsi}:${kota}`;
    const cacheValue = cache.get(cacheKey);

    if(cacheValue) {
      return response.status(200).json(JSON.parse(cacheValue));
    }

    const res = await fetchNonCovid('rumah_sakit', {
      propinsi: propinsi ? `${propinsi}prop` : '',
      kabkota: kota == '0' ? '' : kota
    });
    const rsList = extractInfoNonCovid(res.body);
    const jsonResponse = {
      type: 'non-covid',
      result: rsList
    };

    // cache for 5min
    cache.put(cacheKey, JSON.stringify(jsonResponse), 300000);

    response.status(200).json(jsonResponse);
  } catch (error) {
    response.status(500).json({
      statusCode: 500,
      error: error.message
    });
  }
}
