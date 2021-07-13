import { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchBed } from '../../../util/api';
import { extractInfoBed } from '../../../util/helper';
import cache from 'memory-cache';

export default async (request: VercelRequest, response: VercelResponse) => {
  const { hospital_id } = request.query;
  const cacheKey = `API:BED_DETAIL/:${hospital_id}`;
  const cacheValue = cache.get(cacheKey);

  if(cacheValue) {
    return response.status(200).json(JSON.parse(cacheValue));
  }

  const detail = await fetchBed(hospital_id);
  const info = extractInfoBed(detail.body);

  // cache for 5min
  cache.put(cacheKey, JSON.stringify(info), 300000);

  response.json(info);
}
