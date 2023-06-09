<template>
	<view>
		<toast ref="toast"></toast>
	</view>
</template>

<script>
	export default {
		name: "qq-pay",
		data() {
			return {
				order_id: '',
				obj: {},
				addressId:''
			};
		},

		methods: {
			open(obj) {
				if (obj.order_id) {
					this.obj = obj
					this.order_id = obj.order_id
					this.addressId = obj.addressId
					this.to_pay()
				}

			},
			to_pay() {
				// #ifdef MP-WEIXIN
				this.to_pay_weixin();
				// #endif
				// #ifdef APP-PLUS
				// this.showToast('暂不支持APP支付');
				this.to_pay_app();
				// #endif
				// #ifdef H5
				this.toPage('/pages/order/order', '3');
				// #endif
			},
			to_pay_app() {


				this.request({
					url: '/pay/appPay',
					data: {
						ids: this.order_id,
						
					},
					method:'POST',
					loading: true,
				}).then(res => {
					if (res.status == 200) {

						console.log('xxxxxxxxxx', res.data);
						uni.requestPayment({
							provider: "wxpay",
							orderInfo: res.data,

							success: (res) => {
								if (this.obj.success) {
									this.obj.success()
								} else {

									this.showToast('支付成功');
									getApp().globalData.payOrderId = this.order_id; 
									setTimeout(() => {
										// this.toPage('/pages/pay/pay', '3');
										this.toPage(`/pages/pay/pay?status=1`,'redirect');
									}, 600);
								}

							},
							fail: (e)=> {
								if (this.obj.fail) {
									this.obj.fail()
								} else {

									this.showToast('支付失败');
									getApp().globalData.payOrderId = this.order_id; 
									setTimeout(() => {
										this.toPage(`/pages/pay/pay?status=2`,'redirect')
									}, 600);
								}
								console.log('pay-fail------------');
								console.log(e);
								console.log('pay-fail------------');
							},
							complete: res => {

							}
						})
					} else {
						this.$refs.toast.open({
							desc: res.msg || '请稍后重试~~'
						});
					}
				});


			},

			to_pay_weixin() {
				this.request({
					url: '/pay/wxPay',
					method: 'post',
					data: {
						ids: this.order_id
					},
					loading: true,
				}).then(res => {
					if (res.status == 200) {
						console.log('xxxxxxxxxx', res.data);
						uni.requestPayment({
							provider: "wxpay",
							...res.data,
							success: (res) => {
								if (this.obj.success) {
									this.obj.success()
								} else {
									this.showToast('支付成功');
									getApp().globalData.payOrderId = this.order_id; 
									setTimeout(() => {
										
										this.toPage(`/pages/pay/pay?status=1`,'redirect');
									}, 600);
								}
							},
							fail: (e)=> {
								if (this.obj.fail) {
									this.obj.fail()
								} else {
								
									this.showToast('支付失败');
									getApp().globalData.payOrderId = this.order_id; 
									setTimeout(() => {
										this.toPage(`/pages/pay/pay?status=2`,'redirect');
									}, 600);
								}
								console.log('pay-fail------------');
								console.log(e);
								console.log('pay-fail------------');
							},
							complete: res => {

							}
						})
					} else {
						this.$refs.toast.open({
							desc: res.msg || '请稍后重试~~'
						});
					}
				});

			},
		}
	}
</script>

<style>

</style>
