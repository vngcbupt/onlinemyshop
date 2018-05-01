// default config
module.exports = {
  workers: 1,
  weixin: {
    // appid: 'wxf94ddd3924114637', // 小程序 appid
    // secret: '25583f3a3ade7af28c2f54de3be9e51b', // 小程序密钥
    appid:'wx63dea3ca30f8dc20',
    secret:'db95f020dd39cd5a880f874c6b296606',
    mch_id: '1402091802', // 商户帐号ID
    partner_key: 'SWCzyc20161021SWCzyc20161021aaaa', // 微信支付密钥
    notify_url: 'https://onlinemyshop.xyz/pay/notify' // 微信异步通知，例：https://www.nideshop.com/api/pay/notify
  },
  // 可以公开访问的Controller
  publicController: [
    // 格式为controller
    'index',
    'catalog',
    'topic',
    'auth',
    'goods',
    'brand',
    'search',
    'region'
  ],

  // 可以公开访问的Action
  publicAction: [
    // 格式为： controller+action
    'comment/list',
    'comment/count',
    'cart/index',
    'cart/add',
    'cart/checked',
    'cart/update',
    'cart/delete',
    'cart/goodscount',
    'pay/notify'
  ]
};
