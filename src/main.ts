import md5 from 'js-md5';

const https = require('https');
import {appid, appSecret} from './private';
import {IncomingMessage} from 'http';

type ErrorMap = {
  [key:string]:string
}

const errorMap: ErrorMap = {
  52000: '成功',
  52001: '请求超时,请重试 ',
  52002: '系统错误,请重试',
  52003: '未授权用户,请检查appid是否正确或者服务是否开通  ',
  54000: '必填参数为空,请检查是否少传参数 ',
  54001: '签名错误,请检查您的签名生成方法 ',
  54003: '访问频率受限,请降低您的调用频率',

  54004: '账户余额不足,请前往管理控制台为账户充值',
  54005: '长query请求频繁,请降低长query的发送频率，3s后再试 ',
  58000: '客户端IP非法, 检查个人资料里填写的IP地址是否正确，可前往开发者信息-基本信息修改',

  58001: '译文语言方向不支持,检查译文语言是否在语言列表里',

  58002: '服务当前已关闭,请前往管理控制台开启服务 ',
  90107: '认证未通过或未生效,请前往我的认证查看认证进度 ',
};


export const translator = (word: string) => {
  let salt = Math.random().toString();
  let sign = md5(appid + word + salt + appSecret);
  let from, to;
  if (/[a-zA-Z]/.test(word[0])) {
    from = 'en';
    to = 'zh';
  } else {
    from = 'zh';
    to = 'en';
  }
  const query = new URLSearchParams([
    ['q', word],
    ['from', from],
    ['to', to],
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

  const request = https.request(options, (response: IncomingMessage) => {
    let chunks:Buffer[] = [];
    response.on('data', (chunk:Buffer) => {
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
        console.error(errorMap[object.error_code] || object.error_msg);
        process.exit(2);
      } else {
        object.trans_result.map(obj=>{
          console.log(obj.dst);
        });
        process.exit(0);
      }
    });
  });
  request.end();
};