const path = require('path');

const { deploy } = require('billd-deploy');
const qiniu = require('qiniu');

const pkg = require('../package.json');

const env = process.argv.includes('--prod') ? 'prod' : 'beta';

deploy({
  env,
  config: {
    cdn: () => 'qiniu',

    ssh: () => false,

    qiniuConfig: (data) => {
      return {
        accessKey: 'OrbhOMlQ43QrpltV2uWhPdT1AkiCJgyCDBgRvuaR',
        secretKey: '9n8zy5GZaKq6NZ2F6wgvpkHejs6Or40S869X0v2Q',
        bucket: 'hssblog',
        zone: qiniu.zone.Zone_z2,
        prefix: `nuxt-blog-client/${pkg.version}/dist`,
      };
    },

    qiniuFileConfig: (data) => {
      return {
        // 将本地的目录上传到cdn目录（包括这个目录）
        dir: {
          local: path.resolve(__dirname, `../.nuxt/dist/client`),
        },
        // 将本地的文件上传到cdn目录（注意不要将敏感信息上传到cdn！！！）
        file: {
          local: [path.resolve(__dirname, '../deploy.json')],
        },
      };
    },
  },
});
