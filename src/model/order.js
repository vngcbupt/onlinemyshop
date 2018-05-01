const _ = require('lodash');

module.exports = class extends think.Model {
  /**
   * 生成订单的编号order_sn
   * @returns {string}
   */
  generateOrderNumber() {
    const date = new Date();
    return date.getFullYear() + _.padStart(date.getMonth(), 2, '0') + _.padStart(date.getDay(), 2, '0') + _.padStart(date.getHours(), 2, '0') + _.padStart(date.getMinutes(), 2, '0') + _.padStart(date.getSeconds(), 2, '0') + _.random(100000, 999999);
  }

  /**
   * 获取订单可操作的选项
   * @param orderId
   * @returns {Promise.<{cancel: boolean, delete: boolean, pay: boolean, comment: boolean, delivery: boolean, confirm: boolean, return: boolean}>}
   */
  async getOrderHandleOption(orderId) {
    const handleOption = {
      cancel: false, // 取消操作
      delete: false, // 删除操作
      pay: false, // 支付操作
      comment: false, // 评论操作
      delivery: false, // 确认收货操作
      confirm: false, // 完成订单操作
      return: false, // 退换货操作
      buy: false // 再次购买
    };

    const orderInfo = await this.where({id: orderId}).find();

    // 如果订单待付款
    if (orderInfo.order_status === 1) {
      handleOption.pay = true;
      handleOption.cancel = true;
    }

    // 如果订单待收货
    if (orderInfo.order_status === 2) {
      handleOption.delivery = true;
    }

    // 如果订单待评价
    if (orderInfo.order_status === 3) {
      handleOption.comment = true;
    }

    // 如果订单待售后
    if (orderInfo.order_status === 4) {
      handleOption.return = true;
    }

    return handleOption;
  }

  async getOrderStatusText(orderId) {
    const orderInfo = await this.where({id: orderId}).find();
    let statusText = '待付款';
    switch (orderInfo.order_status) {
      case 1:
        statusText = '待付款';
        break;
      case 2:
        statusText = '待收货';
        break;
      case 3:
        statusText = '待评价';
        break;
      case 4:
        statusText = '退款/售后';
        break;
    }

    return statusText;
  }

  /**
   * 更改订单支付状态
   * @param orderId
   * @param payStatus
   * @returns {Promise.<boolean>}
   */
  async updatePayStatus(orderId, payStatus = 0) {
    return this.where({id: orderId}).limit(1).update({pay_status:(payStatus)});
  }

  /**
   * 根据订单编号查找订单信息
   * @param orderSn
   * @returns {Promise.<Promise|Promise<any>|T|*>}
   */
  async getOrderByOrderSn(orderSn) {
    // if (think.isEmpty(orderSn)) {
    //   return {};
    // }
    return this.where({order_sn: orderSn}).find();
  }
};
