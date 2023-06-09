let request = require('./request');
import store from '../store';

let query = {};
let payType = '' //支付方式key
// --------------- 新的代码


// 支付方式集合
let redirceMap = new Map(
	[
		// #ifdef APP-PLUS || H5
		['WEI_XIN_PAY_LITE', { name: 'wx_lite', beforePay: weixin_lite_pay, pay: weixin_lite_pay }], //app 调小程序支付
		// #endif
		['ALI_PAY_H5', { name: 'h5', beforePay: get_pay_params, pay: h5_pay }], //app 调银联打开支付宝h5支付
		// #ifdef MP-WEIXIN
		['WEI_XIN_PAY_LITE', { name: 'ts_wx_lite',  beforePay: get_pay_params, pay: weixin_app_pay }], //TSSHOP微信小程序支付
		// #endif
		['WEI_XIN_PAY_APP', { name: 'wx_app', beforePay: get_pay_params, pay: weixin_app_pay }], //微信APP支付
		['ALI_PAY_APP', { name: 'alipay', beforePay: get_pay_params, pay: ali_app_pay }], // 支付宝APP支付
		['UNION_PAY_APP', { name: 'unionpay', beforePay: get_pay_params, pay: h5_pay }], // h5支付

	]
)
// 开始支付  payment是业务参数
export async function start_pay(payment) {
	console.log('payment', payment);
	let order_id;
	payType = payment.pay.type
	query = payment
	if (!payment.order_id) {
		// 如果没有传过来order_id参数,请求参数
		let order_params = await get_order_id(payment.params)
		if (order_params.status !== 200) return failCallBack(payment)
		order_id = order_params.data
	} else {
		order_id = payment.order_id
	}
	if (!Array.isArray(order_id)) {
		order_id = [order_id]
	}
	store.commit('vuexSet', {name:'pay_order_id', value: order_id, isSave: true})
	getApp().globalData.payOrderId = order_id; //将order_id存入全局
	try {
		console.log('+++++++++++++++++++++++++++++++++++++order_id',order_id);
		// #ifdef APP-PLUS || H5
		if(payType === 'WEI_XIN_PAY_LITE') return weixin_lite_pay(order_id,payment)
		// #endif
		let { beforePay, pay } = redirceMap.get(payType)
		let pay_params = await beforePay(order_id, payment) //获取支付参数的方法
		console.log('pay_params',pay_params);
		if (!pay_params) return
		if (pay_params.status !== 200) return failCallBack(payment)
		pay(pay_params, payment) //执行对应的支付操作
		if (payment.pay.id == 4) return
	} catch (err) {
		console.log('err', err);
		failCallBack(payment)
	}

}
// 获取订单id
function get_order_id({ url, method, data }) {
	return request({ url, method, data });
}
// 执行支付失败事件
function failCallBack(payment) {
	return payment.fail && payment.fail()
}

// 获取支付参数
function get_pay_params(order_id, payment) {
	let orderId = order_id
	return request({
		url: '/pay',
		method: 'POST',
		data: {
			orderId,
			payType: payment.pay.type,
			payThoroughfareId: payment.pay.payThoroughfareId
		}
	});
}


//app跳微信小程序支付方法（lw）
function weixin_lite_pay(order_id, payment) {
	request({
		url: '/precreatePay/link',
		data: {
			path: `pages/pay-plus-ts/pay-plus-ts`,
			query: `orderId=${ order_id }&price=${payment.price || 0}&payType=${payment.pay.type}&payThoroughfareId=${payment.pay.payThoroughfareId}`,
		}
	}).then(res => {
		console.log('res+-=_',res);
		if (res.status == 200) {
			let pay_url = res.data;
			// #ifdef APP-PLUS
			plus.runtime.openURL(pay_url, () => {
				console.log('失败');
				payment.fail && payment.fail();
			});
			// #endif
			// #ifdef H5
			window.location.href = pay_url
			// #endif
			subscribeEvent();
		}
	});
}


// 微信app支付(lw)
function weixin_app_pay(res, payment) {
	console.log('+++++++++++++++++++++++++++++++++wx',res);
	uni.requestPayment({
		provider: "wxpay",
		// #ifdef APP-PLUS
		orderInfo: res.data,
		// #endif
		// #ifdef MP-WEIXIN
		...res.data,
		// #endif
		success: () => {
			// isCb = false
			payment.success && payment.success();
		},
		fail: (err) => {
			console.log('支付失败', err);
			payment.fail && payment.fail();
		}
	});
}


// 支付宝app支付(lw)
function ali_app_pay(res, payment) {
	uni.requestPayment({
		provider: "alipay",
		orderInfo: res.data,
		success: () => {
			// isCb = false
			payment.success && payment.success();
		},
		fail: () => {
			payment.fail && payment.fail();
		}
	});
}

// 跳 支付宝h5支付(lw)
function h5_pay(res, payment) {
	console.log('h5RES', res);
	let pay_url = res.data.qrCode || res.data.appPayRequest.qrCode
	
	//支付宝
	var authUrl =
		"alipays://platformapi/startapp?appId=20000067&url=" +
		encodeURIComponent(pay_url);

	if (uni.getSystemInfoSync().platform == 'ios') {
		authUrl = (
			"alipay://platformapi/startapp?appId=20000067&url=" +
			encodeURIComponent(pay_url));
	}

	//#ifdef APP-PLUS
	plus.runtime.openURL(authUrl, function(res) {
		this.showToast('请安装支付宝之后再进行支付！');
	});
	//#endif
	//#ifdef H5
	window.location.href = pay_url
	//#endif
	subscribeEvent()
}

// 轮询查询支付结果,仅app跳h5支付时获取回调时使用
function subscribeEvent() {
	let key = eventRandom();
	let orderId = getApp().globalData.payOrderId
	getApp().globalData.subscribeEvent = {
		orderId,
		key,
	};
	uni.$once(key, (orderId) => {
		console.log('key',key);
		//轮询查询
		checkPayStatus(orderId);
	});
	uni.setStorage({
		key: 'pay_order_id',
		data: orderId,
	});
};
//下单

//轮询查询
function checkPayStatus(id) {
	let time = 2000;
	let count = 3;
	let success = false;
	// uni.showLoading({
	// 	mask: true,
	// 	title: '订单查询中...'
	// });
	setTimeout(() => {
		if (count != 0) {
			uni.hideLoading();
		}
	}, 6000);
	let check = () => {
		uni.showLoading({
			mask: true,
			title: '订单查询中...'
		});
		request({
			url: '/precreatePay/getOrderStatus',
			data: {
				orderId: id,
			},
			loading: false,
		}).then(res => {
			if (res.status == 200 && res.data == 1) {
				console.log('支付成功');
				count = 0;
				success = true;
				// query.success && query.success()
				console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx', '查询成功', res.data);
			} else {
				console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx', '查询失败', res.data);
				count--;
			}
			if (count == 0) {
				uni.hideLoading();
				if (success) {
					query.success && query.success();
					return;
				}
				query.fail && query.fail();
				return;
			}
			setTimeout(() => {
				check();
			}, time);
		});
	};
	check();
}



function eventRandom() {
	return 'event' + String(parseInt(Math.random() * 9999)) + String(parseInt(Math.random() * 9999));
}