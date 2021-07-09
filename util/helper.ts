import cheerio from 'cheerio'

const queryString = (obj: object) => Object.keys(obj).map(function(key) {
  return key + '=' + obj[key];
}).join('&');

export const qs = queryString; 

const getQueryString = (url: string, key: string) => {
  url = url.split('?')[1];
  const urlSearchParams = new URLSearchParams(url);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params[key];
}

export const extractInfoNonCovid = (body: string) => {
  const $ = cheerio.load(body);
  const cardRS = $('div.cardRS');
  const data = [];
  cardRS.each((_, elem) => {
    const name = $(elem).attr('data-string');
    const address = $(elem).find('p.mb-0').html().trim();
    const hotline = $(elem).find('.card-footer > div').find('span').text();
    const bedElements = $(elem).find('.col-md-4');
    const bedDetail = $(elem).find('.card-footer > div').find('a').attr('href');
    const rsID = getQueryString(bedDetail, 'kode_rs');
    const rooms = [];
    bedElements.each((_, bed) => {
      const bedBody = $(bed).find('.card-body');
      rooms.push({
        room_name: bedBody.find('div:nth-child(3)').text().trim().replace('Di ', ''),
        class: bedBody.find('div:nth-child(2)').text().trim().replace('Bed Kosong ', ''),
        available: bedBody.find('div:nth-child(1)').text().trim(),
        updated_at: $(bed).find('.card-footer > div').text().trim().replace('diupdate ', '')
      });
    });
    data.push({
      id: rsID,
      hospital_name: name,
      address,
      hotline,
      detail: `/api/bed-detail/${rsID}`,
      rooms
    });
  });
  return data;
}

export const extractInfoCovid = (body: string) => {
  const $ = cheerio.load(body);
  const cardRS = $('div.cardRS');
  const data = [];
  cardRS.each((_, elem) => {
    const name = $(elem).attr('data-string');
    const cardBody = $(elem).find('.card-body');
    const infoBed1 = cardBody.find('.col-md-5').find('p:nth-child(2)').text().trim();
    const infoBed2 = cardBody.find('.col-md-5').find('p:nth-child(3)').text().trim();
    const updatedAt = cardBody.find('.col-md-5').find('p:nth-child(4)').text().trim().replace('diupdate ', '');
    const address = $(elem).find('p.mb-0').html().trim();
    const hotline = $(elem).find('.card-footer > div').find('span').text();
    const bedDetail = $(elem).find('.card-footer > div').find('a').attr('href');
    const rsID = getQueryString(bedDetail, 'kode_rs');
    data.push({
      id: rsID,
      hospital_name: name,
      address,
      hotline,
      detail: `/api/bed-detail/${rsID}`,
      info1: infoBed1.split(/\s/g).filter((f) => f).join(' '),
      info2: infoBed2,
      updated_at: updatedAt
    });
  });
  return data;
}

export const extractInfoBed = (body: string) => {
  const $ = cheerio.load(body);
  const title = $('div.col-11').find('p').text().split('\n');
  const name = title[1].trim();
  const address = title[2].trim();
  const hotline = title[5].trim();
  const container = $('div.container');
  const cardBeds = container.find('.card');
  const beds = [];
  cardBeds.each((_, elem) => {
    const p = $(elem).find('p.mb-0').text().split('\n');
    const bedQuota = $(elem).find('.col-md-4:nth-child(1)');
    const bedAvailable = $(elem).find('.col-md-4:nth-child(2)');
    const bedQueue = $(elem).find('.col-md-4:nth-child(3)');
    beds.push({
      name: p[1].trim(),
      quota: bedQuota.find('div > div:nth-child(2)').text(),
      avaiable: bedAvailable.find('div > div:nth-child(2)').text(),
      queue: bedQueue.find('div > div:nth-child(2)').text() || '-',
      updated_at: p[2].trim().replace('Update ', '')
    });
  });
  return {
    hospital_name: name,
    address,
    hotline,
    availibility: beds
  }
}
