import * as md5 from 'js-md5';
import {appid, appSecret} from './private';

const https = require('https');

export const translator = (word) => {
  let salt = Math.random();
  let sign = md5(appid + word + salt + appSecret);

  const query = new URLSearchParams([
    ['q', word],
    ['from', 'en'],
    ['to', 'zh'],
    ['appid', appid],
    ['salt', salt],
    ['sign', sign]
  ]).toString();

  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET'
  };

  const request = https.request(options, (response) => {
    let chunks = [];
    response.on('data', (chunk) => {
      chunks.push(chunk);
    });
    response.on('end', () => {
      const string = Buffer.concat(chunks).toString();
      type BaiduResult = {
        from: string
        to: string
        trans_result: { src: string, dst: string }[]
        error_code?: string
        error_msg?: string
      }
      const object: BaiduResult = JSON.parse(string);
      if (object.error_code) {
        console.error(object.error_msg);
        process.exit(2)
      } else {
        console.log(object.trans_result[0].dst);
        process.exit(0)
      }
    });
  });
  request.end();
};