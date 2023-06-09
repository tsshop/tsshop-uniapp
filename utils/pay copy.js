let request = require('./request');
let orderId = '';
let query = {};


// 支付跳转方式
let redirceType = {
	"ALI_PAY_APP": "alipay", //支付宝app支付
	"WEI_XIN_PAY_LITE": "wx_lite", //H5支付
	"ALI_PAY_H5": "h5", //苹果支付


};


export function payByliveId(obj, orderType = 'live') {
	query = obj;
	console.log('query', query);
	let url = '/live/payLive';
	let method = 'GET';
	let data = {};
	// if (orderType == 'live') {
	// 	data.liveId = obj.liveId;
	// }
	// if (orderType == 'vip') {
	// 	url = '/vip/buy';
	// 	method = 'POST';
	// 	data.id = obj.id;
	// 	data.type = obj.vipType;
	// }
	// if (orderType == 'course') {
	// 	url = '/courseUser/buy';
	// 	method = 'POST';
	// 	data.courseId = obj.courseId;
	// }
	request({
		url,
		data,
		method,
		loading: true,
	}).then(res => {
		if (res.status == 200 && obj.price !== undefined && obj.price == 0) {
			obj.success && obj.success();
			return;
		} else if (res.status == 200 && res.data && res.data.id) {
			orderId = res.data.id;
			//获取支付参数
			// if (obj.pay.id == 0 || true) {
			// 	return request({
			// 		url: '/pay/aliPay',
			// 		data: {
			// 			orderId: res.data.id,
			// 		}
			// 	});
			// }
			// return ;
			if (redirceType[obj.pay.type]  == 'wx_lite') {
				return {
					status: 200,
					data: '123'
				};
			}
			if (obj.pay.id != 0 || true) {
				return request({
					// url: '/precreatePay/pay',
					url: '/pay',
					method: 'POST',
					data: {
						orderId: res.data.id,
						payType: obj.pay.type,
						payThoroughfareId: obj.pay.payThoroughfareId
					}
				});
			}

		} else {
			obj.fail & obj.fail();
		}
	}).then(res => {
		if (!res) return;
		if (res.status == 200) {
			//支付宝支付
			if (redirceType[obj.pay.type]  == 'alipay') {
				uni.requestPayment({
					provider: "alipay",
					orderInfo: res.data,
					success: () => {
						obj.success && obj.success();
					},
					fail: () => {
						obj.fail && obj.fail();
					}
				});
				return;
			}
			if (redirceType[obj.pay.type]  == 'wx_lite') {
				//微信app支付
				request({
					url: '/precreatePay/link',
					data: {
						path: `pages/pay-plus/pay-plus`,
						query: `orderId=${orderId}&price=${obj.price||0}&payType=${obj.pay.type}&payThoroughfareId=${obj.pay.payThoroughfareId}`,
					}
				}).then(res => {
					if (res.status == 200) {
						let pay_url = res.data;

						plus.runtime.openURL(pay_url, () => {
							console.log('失败');
							obj.fail && obj.fail();
						});

						subscribeEvent();
					}
				});
				// uni.requestPayment({
				// 	provider: "wxpay",
				// 	orderInfo: res.data,
				// 	success: () => {
				// 		obj.success && obj.success();
				// 	},
				// 	fail: (err) => {
				// 		console.log('wxPayErr',err);
				// 		obj.fail && obj.fail();
				// 	}
				// });



				return;
			}

			if (redirceType[obj.pay.type]  == 'h5') {
				//支付宝 H5 支付
				// #ifdef APP-PLUS


				let pay_url = res.data.qrCode;

				plus.runtime.openURL(pay_url, () => {
					console.log('失败');
					obj.fail && obj.fail();
				});



				// var authUrl =
				// 	"alipays://platformapi/startapp?appId=20000067&url=" +
				// 	encodeURIComponent(pay_url);

				// if (uni.getSystemInfoSync().platform == 'ios') {
				// 	authUrl = (
				// 		"alipay://platformapi/startapp?appId=20000067&url=" +
				// 		encodeURIComponent(pay_url));
				// }

				// plus.runtime.openURL(authUrl,()=>{
				// 		console.log('打开失败');
				// });
				subscribeEvent();
				// #endif
				return;
			}
			if (obj.pay.id == 4) {
				return;
				console.log('res.data', res.data);
				let str = JSON.parse(res.data);
				console.log('str', str);
				let other = '&channel=1';
				Object.keys(str).forEach(val => {
					other += `&${val}=${str[val]}`;
				});
				console.log('str', other);
				console.log('other', other);
				console.log(`/pages/h5/h5?url=/hybrid/html/apple/JsToNativeOrder${other}`);
				uni.navigateTo({
					// url:`/pages/h5/h5?url=/hybrid/html/apple/JsToNativeOrder${other}`,
					url: `/pages/h5/h5?url=/hybrid/html/JsToNativeOrder.html${other}`,
					// url:`/pages/h5/h5?url=${str.notifyUrl}`,
				})
			}

		} else {
			obj.fail && obj.fail();
		}
	});

}

// 轮询查询支付结果
function subscribeEvent() {
	let key = eventRandom();
	getApp().globalData.subscribeEvent = {
		orderId,
		key,
	};
	uni.$once(key, (id) => {
		//轮询查询
		checkPayStatus(id);
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