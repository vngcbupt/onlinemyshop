/* eslint-disable no-multi-spaces */
const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 获取支付的请求参数
   * @returns {Promise<PreventPromise|void|Promise>}
   */
  async prepayAction() {
    const orderSn = this.get('orderSn');
    console.log("orderSn");
    console.log(orderSn);

    const orderInfo = await this.model('order').where({ order_sn: orderSn }).find();
    if (think.isEmpty(orderInfo)) {
      return this.fail(400, '订单不存在');
    }
    if (parseInt(orderInfo.pay_status) !== 0) {
      return this.fail(400, '订单已支付，请不要重复操作');
    }
    const openid = await this.model('user').where({ id: orderInfo.user_id }).getField('weixin_openid', true);
    if (think.isEmpty(openid)) {
      return this.fail('微信支付失败,无法获得weixinopenid');
    }
    const WeixinSerivce = this.service('weixin', 'api');
    try {
      const returnParams = await WeixinSerivce.createUnifiedOrder({
        openid: openid,
        body: 'llf测试订单编号：' + orderInfo.order_sn,
        out_trade_no: orderInfo.order_sn,
        total_fee: parseInt(orderInfo.actual_price * 100),
        spbill_create_ip: ''
      });
      return this.success(returnParams);
    } catch (err) {
      return this.fail('微信支付失败');
    }
  }

  async notifyAction() {
    var json = null;
    const result=this.post().xml;
  //   const testxml =`<xml>
  //   <appid><![CDATA[wx2421b1c4370ec43b]]></appid>
  //   <attach><![CDATA[支付测试]]></attach>
  //   <bank_type><![CDATA[CFT]]></bank_type>
  //   <fee_type><![CDATA[CNY]]></fee_type>
  //   <is_subscribe><![CDATA[Y]]></is_subscribe>
  //   <mch_id><![CDATA[10000100]]></mch_id>
  //   <nonce_str><![CDATA[5d2b6c2a8db53831f7eda20af46e531c]]></nonce_str>
  //   <openid><![CDATA[oUpF8uMEb4qRXf22hE3X68TekukE]]></openid>
  //   <out_trade_no><![CDATA[1409811653]]></out_trade_no>
  //   <result_code><![CDATA[SUCCESS]]></result_code>
  //   <return_code><![CDATA[SUCCESS]]></return_code>
  //   <sign><![CDATA[B552ED6B279343CB493C5DD0D78AB241]]></sign>
  //   <sub_mch_id><![CDATA[10000100]]></sub_mch_id>
  //   <time_end><![CDATA[20140903131540]]></time_end>
  //   <total_fee>1</total_fee>
  // <coupon_fee><![CDATA[10]]></coupon_fee>
  // <coupon_count><![CDATA[1]]></coupon_count>
  // <coupon_type><![CDATA[CASH]]></coupon_type>
  // <coupon_id><![CDATA[10000]]></coupon_id>
  // <coupon_fee><![CDATA[100]]></coupon_fee>
  //   <trade_type><![CDATA[JSAPI]]></trade_type>
  //   <transaction_id><![CDATA[1004400740201409030005092168]]></transaction_id>
  // </xml>`;
    const orderModel = this.model('order');
    let affect = await orderModel.where({order_sn:result.out_trade_no}).update({order_status:2, pay_status:1});

    // if (affect != 0) {
    //   return `<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[支付失败]]></return_msg></xml>`;
    // }


    return `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`;
  }
};
