<template>
	<view>
		<custom title="支付结果" fixed="fixed" mode="2" titleColor="#FFFFFF" backColor="#FFFFFF" :titleBold="false"
			background="rgba(255,255,255,0)">
		</custom>



		<view
			style="position: fixed;top:0;z-index: 1;width: 100vw;height: 400rpx;background: linear-gradient(180deg, rgba(255, 136, 47, 1), rgba(255, 109, 0, 0));">
		</view>


		<view class="flex flex-y flex-x-y pr"
			style="z-index: 2;width: 686rpx;margin:  40rpx 32rpx;background-color: #FFFFFF;border-radius: 8rpx;box-shadow:  0 4rpx 16rpx 0 rgba(46, 44, 41, 0.05);"
			v-if="status == 1">

			<image style="margin-top:50rpx;width:80rpx;height:80rpx;" src="../../static/tsshop/pay-success.png" mode="">
			</image>

			<view class="fs-44 color-333333 bold" style="margin-top: 20rpx;">支付成功</view>

			<view class="fs-26 color-999999" style="margin-top: 10rpx;">
				感谢你的购买
			</view>

			<view class="flex" style="margin-top: 32rpx;margin-bottom: 74rpx;">
				<view class="pay-btn" @tap="uniBack()">继续逛逛</view>
				<view class="pay-btn-1" @tap="look_order"> 查看订单</view>
			</view>

		</view>
		<view class="flex flex-y flex-x-y pr"
			style="z-index: 2;width: 686rpx;margin:  40rpx 32rpx;background-color: #FFFFFF;border-radius: 8rpx;"
			v-if="status == 2 ">

			<image style="margin-top:50rpx;width:80rpx;height:80rpx;" src="../../static/tsshop/pay-fail.png" mode="">
			</image>

			<view class="fs-44 color-333333 bold" style="margin-top: 20rpx;">支付失败</view>

			<view class="fs-26 color-999999 bold" style="margin-top: 10rpx;">
				重新支付试试
			</view>

			<view class="flex" style="margin-top: 32rpx;margin-bottom: 74rpx;">
				<view class="pay-btn" @tap="cancel_order">取消订单</view>
				<view class="pay-btn-1" @tap="pay_2">重新支付</view>
			</view>

		</view>

		<toast ref="toast"></toast>
		<qq-pay ref="pay"></qq-pay>
		<lw-pay-list ref="payList"></lw-pay-list>
	</view>
</template>

<script>
import { start_pay } from '../../utils/pay';
	export default {
		data() {
			return {
				status: 1, // 1成功 2 失败 0等待
				order_id: '',
				price: '',
			}
		},
		onShow() {


		},
		onLoad(e) {
			if (e.status) {
				this.status = e.status;

			}
			this.order_id = getApp().globalData.payOrderId || this.pay_order_id || []
			console.log('order_id',this.order_id);
			
			if(!Array.isArray(this.order_id)) {
				this.order_id = [this.order_id]
			}
			

		},
		methods: {

			look_order() {
				if(this.order_id.length > 1) {
					this.toPage('/pages/order/order', '3');
				} else {
					this.toPage('/pages/order/order-detail?id=' + this.order_id[0],'3')
				}
			},

			cancel_order() {
				
				if(!this.order_id) return
				this.less(() => {
					this.order_id.forEach(val => {
						this.cancel_order_request(val)
					})
					
				});
			},
			cancel_order_request(id) {
				this.request({
					url: '/order/cancel',
					data: {
						orderId: id
					},
					method:'POST',
					loading: true,
				}).then(res => {
					if (res.status == 200) {
						this.$refs.toast.open({
							desc: '订单取消成功',
							left: '',
							right: "知道了",
							success: () => {
								// this.uniBack();
								this.toPage('/pages/order/order', '3');
							}
						});
					}
				});
			},
			pay_2() {
				console.log('order_id',this.order_id);
				//选择支付方式
				// if(!this.order_id) return //如果没有id
				console.log('order_id+++++++++++++',this.pay_order_id);

				this.$refs.payList.open({
					price: this.price, //价格
					success: (id, price, detail) => {
						/////////
						// this.less(() => {
							start_pay({
								pay: detail,
								order_id: this.order_id,
								price: Number(this.price),
								success: () => {
									this.showToast('支付成功');
									setTimeout(() => {
										this.toPage(`/pages/pay/pay?status=1`,'redirect');
									}, 600);
								},
								fail: () => {
									this.showToast('支付失败');
									setTimeout(() => {
										this.toPage(`/pages/pay/pay?status=2`,'redirect')
									}, 600);
								}
							});
						// });
						////////
					}
				});
			},

			pay_1() {

				this.$refs.pay.open({
					price: this.price,
					mine: () => {
						this.uniBack();
					},
					order_id: this.order_id,
				});
				return;

				this.less(() => {




					this.request({
						url: `/pay/${this.order_id}/${Number(this.payid)}`,
						data: {

						},
						loading: true,
					}).then(pay => {
						if (pay.status == 200) {
							this.pass = true;
							////拉起支付
							if (pay.data && pay.data.payUrl) {

								this.disable = true;
								uni.setStorageSync('order_id', this.order_id);
								uni.setStorageSync('pay_time', new Date().getTime());

								// #ifdef APP-PLUS 

								// 微信
								if (this.payid == 1006) {
									plus.runtime.openURL(pay.data.payUrl, function(
										res) {});
									return;
								}

								//支付宝
								let pay_url = pay.data.payUrl;


								var authUrl =
									"alipays://platformapi/startapp?appId=20000067&url=" +
									encodeURIComponent(pay_url);

								if (uni.getSystemInfoSync().platform == 'ios') {
									authUrl = (
										"alipay://platformapi/startapp?appId=20000067&url=" +
										encodeURIComponent(pay_url));
								}

								plus.runtime.openURL(authUrl, function(res) {
									this.showToast('请安装支付宝之后再进行支付！');
								});
								// #endif

								// #ifdef H5



								var u = navigator.userAgent;
								var isAndroid = u.indexOf('Android') > -1 || u.indexOf(
									'Adr') > -1; //android终端
								if (isAndroid) {

									window.open(pay.data.payUrl, "_blank",
										"resizable,scrollbars,status");
								} else {

									window.location.href = pay.data.payUrl;

								}

								// #endif


							} else {
								this.$refs.toast.open({
									desc: pay?.data?.respDesc || '请稍后重试',
								});
							}
							////

						}
					});

				});
			},

		}
	}
</script>

<style lang="scss">
	page {
		page {
			/* background: linear-gradient(180deg, #2f95fd, #F1F1F1); */
			background: #F5F6F7;
		}
	}

	.pay-btn {
		font-size: 32rpx;
		color: #999999;
		width: 280rpx;
		height: 88rpx;
		border-radius: 8rpx;

		display: flex;
		justify-content: center;
		align-items: center;
		border: 2rpx solid #999999;
	}

	.pay-btn-1 {
		font-size: 32rpx;
		color: $color;
		width: 280rpx;
		height: 88rpx;
		border-radius: 8rpx;

		margin-left: 28rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 2rpx solid $color;
	}
</style>
