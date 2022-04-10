import * as md5 from 'js-md5';

const https = require('https');

export const translator = (word) => {
  let appid = '???';
  const appSecret = '???'
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
  console.log(query);

  const options = {
    hostname: 'api.fanyi.baidu.com',
    port: 443,
    path: '/api/trans/vip/translate?' + query,
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });
  req.end();
};