<template>
	<view>
		<custom mode="2" title="退款/售后" fixed="fixed" background="#F5F6F7">
			<!-- <view style="" class="bg-FFFFFF pl-31 pr-31 flex flex-x-center" slot="center">
				<tabs :index="tab_index" @change="tab_change" paddingB="4rpx" :list="tab_list"></tabs>
			</view> -->
		</custom>

		<view @tap="toPage('/pages/refund/refund-detail?id='+item.id)" v-for="(item,index) in list" :key="index"
			class="ml-31 w-688 mt-24 br-16 bg-FFFFFF order-item">
			<view class="flex flex-y-center flex-x-b">
				<view style="color: #989898;font-size: 28rpx;margin-left: 4rpx;">订单号：{{item.orderNo}}</view>
				<view class="flex flex-y-center  color-000000">
					<view v-if="item.returnType == 1 || item.returnType == 2" class="iconfont icon-tuikuan"></view>
					<view v-if="item.returnType == 3" class="iconfont icon-tuihuo"></view>
					<view class="ml-20 color-all">{{item.returnType == 3?'退货退款':'仅退款'}}</view>
				</view>
			</view>
			<!-- 商品信息开始 -->
			<view style="background-color: #FFFFFF;margin-top: 18rpx;">
				<view style="padding:0;" class="flex">
					<image :src="item.spic || item.gpic || ''" mode="aspectFill"
						style="width: 180rpx;height: 180rpx;background-color: #F4F4F4;border-radius: 8rpx;"></image>
					<view style="margin-left: 24rpx;" class="flex-1 hidden color-000000 flex flex-y flex-x-b">
						<view class="flex flex hidden">
							<view class="flex-1 fs-30  text-hidden">{{item.name}}</view>
							<text class="fs-28 ml-20 ">¥ {{item.orderAmt}}</text>
						</view>
						<view class="flex flex-y-center">
							<view v-if="item.properties" class="flex-1 fs-24  text-hidden color-646464">
								{{item.properties}}
							</view>
							<!-- <text class="fs-28 ml-20">x {{item.num}}</text> -->
						</view>
						<view style="height: 32rpx;" class="flex">

						</view>
						<view class="flex color-646464  fs-28" style="height: 40rpx;line-height: 40rpx;">
							退款：¥ {{item.returnAmt}}
						</view>
					</view>
				</view>
			</view>
			<!-- 商品信息结束 -->
			<view style="height: 68rpx;padding:14rpx 0;border-radius: 16rpx;background-color: #EEEEEE;"
				class="mt-20 fs-28 color-000000 flex flex-y-center">
				<!-- <view style="padding-left: 48rpx;padding-right: 48rpx;">{{item.status_text}}</view> -->
				<view style="padding-left: 18rpx;">{{item.content}}</view>
			</view>
		</view>

		<toast ref="toast"></toast>

		<qq-footer :show="is_null" :list="list"></qq-footer>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				tab_list: [

					{
						name: '处理中',
						id: 1
					},
					{
						name: '已处理',
						id: 2
					}
				],
				tab_index: 0,
				list: [],
				is_null: false,
				page: 1,
			};
		},
		onShow() {

		},
		onLoad(e) {
			if (e.index) {
				this.tab_index = Number(e.index);
			}
			this.init();

			uni.$on('refresh_refund_list', () => {
				this.init();
			})


		},
		onUnload() {
			if (uni) {
				uni.$off('refresh_refund_list');
			}
		},
		onReachBottom() {
			this.get_list(this.page);
		},
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 200);
			this.init();
		},


		methods: {
			tab_change(index) {
				this.tab_index = index;
				this.init();
			},
			init() {
				this.setData({
					page: 1,
					list: [],
					is_null: false,
				})
				this.get_list();
			},
			get_list(page = 1) {
				this.request({
					url: '/returnOrder/getList',
					data: {
						pageNumber: page,
						pageSize:10,
						// orderStatus: this.tab_list[this.tab_index].id,
					},
					loading: page == 1,
				}).then(res => {

					if (res && res.status == 200) {
						res.data.list.forEach(val => {
							if (!val.content) {
								if (val.status == 1) {
									val.content = '等待审核';
								}
								if (val.status == 2) {
									val.content = '已拒绝';
								}
								if (val.status == 3) {
									val.content = '已退款';
								}
								if (val.status == 4) {
									val.content = '等待填写物流单号';
								}
								if (val.status == 5) {
									val.content = '已寄回，待审核';
								}
							}

						})

						this.list = this.list.concat(res.data.list || []);

						if (res.data.length == 0) {
							this.is_null = true;
						} else {
							this.page++;
						}
					}
				});
			},
			cancel_order(item) {
				this.$refs.toast.open({
					desc: '是否取消该订单',
					success: () => {


						/////
						this.click(() => {
							this.request({
								url: '/userOrder/cancel',
								data: {
									orderId: item.orderId
								},
								loading: true,
							}).then(res => {
								if (res.status == 200) {
									this.showToast('订单取消成功');
									if (this.tab_index != 4) {
										this.list = this.list.filter(val => val.orderId != item
											.orderId);
									}
									// this.list = this.list.filter(val => val.id != item.id);
									// this.$refs.toast.open({
									// 	desc: '订单取消成功',
									// 	left: '',
									// 	right: "知道了",
									// 	success: () => {
									// 		this.list = this.list.filter(val=>val.id!=item.id);
									// 	}
									// });
								}
							});
						});
						/////

					}
				});

			},
			pay(item) {

				this.less(() => {

					let order_id = item.orderId;
					this.order_id = item.orderId;

					// this.request({
					// 	url: `/pay/aLi?id`,
					// 	data: {
					// 		id: this.order_id,
					// 	}
					// }).then(pay => {
					// 	if (pay.status == 200) {


					// 		uni.requestPayment({
					// 			provider: 'alipay',
					// 			orderInfo: pay.data,
					// 			success: (res) => {


					// 				// this.toPage(
					// 				// 	`/pages/pay/pay?status=1&order_id=${this.order_id}`,
					// 				// 	'redirect'
					// 				// )
					// 				this.init();
					// 			},
					// 			fail: (err) => {


					// 				// this.toPage(
					// 				// 	`/pages/pay/pay?status=2&order_id=${this.order_id}`,
					// 				// 	'redirect'
					// 				// )
					// 				this.init();
					// 			}
					// 		});



					// 	}
					// });


					// return;


					this.request({
						url: `/pay/ada/${order_id}/${item.depositPayType}`,
						data: {

						},
						loading: true,
					}).then(pay => {
						if (pay.status == 'succeeded') {

							////拉起支付
							if (pay.expend && pay.expend.pay_info) {

								this.disable = true;
								uni.setStorageSync('order_id', order_id);
								uni.setStorageSync('pay_time', new Date().getTime());

								// #ifdef APP-PLUS 

								// 微信
								if (item.depositPayType == 1006) {
									plus.runtime.openURL(pay.expend.pay_info, function(
										res) {});
									return;
								}

								//支付宝
								let pay_url = pay.expend.pay_info;



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

									window.open(pay.expend.pay_info, "_blank",
										"resizable,scrollbars,status");
								} else {

									window.location.href = pay.expend.pay_info;

								}

								// #endif


							}
							////

						}
					});

				});
			},
			pay_1(item) {

				this.less(() => {

					let order_id = item.orderId;
					this.order_id = item.orderId;

					this.$refs.pay.open({
						price: item.totalAmount,
						order_id: order_id,
						mine: () => {
							this.init();
						}
					});
					return;

					this.request({
						url: `/pay/${order_id}/${item.depositPayType}`,
						data: {

						},
						loading: true,
					}).then(pay => {
						if (pay.status == 200) {

							////拉起支付
							if (pay.data && pay.data.payUrl) {

								this.disable = true;
								uni.setStorageSync('order_id', order_id);
								uni.setStorageSync('pay_time', new Date().getTime());

								// #ifdef APP-PLUS 

								// 微信
								if (item.depositPayType == 1006) {
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


							}
							////

						}
					});

				});
			},
			get_pro(properties = "") {
				if (!properties) {
					return []
				}
				return properties.split(';');

			},
		},

	}
</script>

<style lang="scss">
	page {
		background-color: $pageColor;
	}

	.order-item {
		padding: 30rpx 22rpx;
	}

	.attr-item {
		font-size: 22rpx;
		color: #999999;
		padding: 6rpx 12rpx;
		border-radius: 4rpx;
		background-color: #F5F5F5;
		margin-right: 20rpx;
		line-height: 28rpx;
	}

	.order-btn {
		margin-left: 26rpx;
		height: 68rpx;
		border-radius: 34rpx;
		padding: 0 36rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #333333;
		border: 1rpx solid #979797;
	}

	.pay {
		border-color: #2F95FD;
		color: #2F95FD;
	}
</style>
