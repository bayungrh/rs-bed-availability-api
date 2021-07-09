import request from 'unirest';
import withRetry from '@zeit/fetch-retry';
import { qs } from './helper';

const fetch = withRetry(request);
const baseURI = 'http://yankes.kemkes.go.id/app/siranap';

export const fetchEndpoint = async (endpoint: string, query = {}) => {
  const url = `${baseURI}/${endpoint}?${qs(query)}`;
  const headers = {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
    'referer': baseURI,
    'origin': 'http://yankes.kemkes.go.id'
  }
  const response = await fetch.get(url, { headers });
  return response;
}

export const fetchCovid = (endpoint: string, query: object) => {
  return fetchEndpoint(endpoint, {
    ...query,
    jenis: 1
  });
}

export const fetchNonCovid = (endpoint: string, query: object) => {
  return fetchEndpoint(endpoint, {
    ...query,
    jenis: 2
  });
}

export const fetchBed = (hospitalCode: string) => {
  return fetchEndpoint('tempat_tidur', {
    kode_rs: hospitalCode
  });
}
