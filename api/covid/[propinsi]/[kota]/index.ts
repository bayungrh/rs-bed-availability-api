import { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchCovid } from '../../../../util/api';
import { extractInfoCovid } from '../../../../util/helper';
import cache from 'memory-cache';

export default async (request: VercelRequest, response: VercelResponse) => {
  try {
    const { propinsi, kota } = request.query;
    const cacheKey = `API_COVID_${propinsi}_${kota}`;
    const cacheValue = cache.get(cacheKey);
    console.log(cacheValue)
    if(cacheValue) {
      return response.status(200).json(JSON.parse(cacheValue));
    }

    const res = await fetchCovid('rumah_sakit', {
      propinsi: propinsi ? `${propinsi}prop` : '',
      kabkota: kota == '0' ? '' : kota
    });
    const rsList = extractInfoCovid(res.body, request.query);
    const jsonResponse = {
      type: 'covid',
      result: rsList
    };

    // cache for 5min
    cache.put(cacheKey, JSON.stringify(jsonResponse));

    response.json(jsonResponse);
  } catch (error) {
    response.status(500).json({
      statusCode: 500,
      error: error.message
    });
  }
}
