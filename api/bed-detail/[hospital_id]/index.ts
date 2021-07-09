import { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchBed } from '../../../util/api';
import { extractInfoBed } from '../../../util/helper';

export default async (request: VercelRequest, response: VercelResponse) => {
  const { hospital_id } = request.query;
  const detail = await fetchBed(hospital_id);
  const info = extractInfoBed(detail.body);
  response.json(info);
}
