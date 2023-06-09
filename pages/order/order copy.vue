<template>
	<view>

		<custom title="我的订单" mode="2" fixed="fixed" background="#F5F6F7" :titleBold="false"></custom>
		<view style="background-color: #F5F6F7;" class="pl-31 pr-31">
			<tabs :index="tab_index" @change="tab_change" paddingB="4rpx" :list="tab_list"></tabs>
		</view>


		<view v-for="(item,index) in list" :key="index" class="ml-31 w-688 mt-20 br-16 bg-FFFFFF order-item">
			<view class="fs-28 color-all flex flex-y-center flex-x-b">
				<!-- <view>购买时间：{{item.createTime}}</view> -->
				<view class="flex flex-y-center">
					<image src="../../static/tsshop/shangdian.png" mode="" style="width: 30rpx;height: 30rpx;"></image>
					<view class="color-323232 ml-20">
						TSSHOP
					</view>
				</view>
				<view v-if="item.orderStatus == 0">待付款</view>
				<view v-if="item.orderStatus == 1">待发货</view>
				<view v-if="item.orderStatus == 2">待收货</view>
				<view v-if="item.orderStatus == 3">已完成</view>
				<view v-if="item.orderStatus == -1" style="color: #808080;">已取消</view>
			</view>
			<view class="flex mt-22  flex-y-start" style="" @tap="to_detail(item)">
				<view class="" style="width: 132rpx;height: 132rpx;border-radius: 10rpx;overflow: hidden;">
					<image :src="item.src" mode="aspectFill" class="wh-100"></image>
				</view>

				<view style="line-height: 36rpx;width: 400rpx;" class="over-line2 pl-20 pr-20">

					<view class="over-line1">
						{{item.goodsName}}
					</view>
					<view class="color-808080 fs-24" v-if="item.sku">
						{{item.sku}}
					</view>
				</view>
				<view class="">
					<view class="nowrap" style="text-align: right;">
						￥{{item.price}}
					</view>
					<view class="nowrap color-808080 fs-24" style="text-align: right;">
						共{{item.quantity}}件
					</view>
				</view>

			</view>
			<view class="flex flex-x-b mt-20 fs-28">
				<view class="color-646464">
					{{item.time}}
				</view>
				<view class="blod color-323232">
					金额: ￥{{item.totalAmount}}
				</view>
			</view>
			<!-- 操作按钮 -->
			<view class="mt-20 flex flex-x-end">
				<view class="order-btn" v-if="item.orderStatus == 0 " @tap.stop="cancel_order(item)">取消订单</view>
				<view class="order-btn" v-if="item.orderStatus <= 3 && item.orderStatus != 0 && item.orderStatus != -1"
					@tap.stop="toPage('/pages/refund/server?id='+item.id)">申请退款</view>

				<view class="order-btn" v-if="item.orderStatus == 2"
					@tap.stop="toPage('/pages/order/logistics?id='+ item.id)">查看物流</view>
				<view class="order-btn" v-if="item.orderStatus == 3 && item.isReview !== null">已评论</view>
				<view class="order-btn pay" v-if="item.orderStatus == 0" @tap.stop="pay_1(item)">立即支付</view>
				<view class="order-btn pay" v-if="item.orderStatus == 3 && !item.isReview"
					@tap.stop="toPage('/pages/evaluate/post-comments?id='+item.id)">评价</view>
				<view class="order-btn pay" v-if="item.orderStatus == 2 " @tap.stop="confirm_receipt(item)">确认收货</view>

			</view>
			<!-- 操作按钮 -->
		</view>

		<toast ref="toast"></toast>

		<qq-footer :show="is_null" :list="list"></qq-footer>
		<!-- <view class="color-333333 fs-26 flex flex-y-center flex-x-center" style="height: 100rpx;">没有更多了</view> -->
		<!-- <paylist :total_price="total_price" ref="pay"></paylist> -->
		<qq-pay ref="pay"></qq-pay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tab_list: [{
						name: '全部',
						id: ''
					},
					{
						name: '待付款',
						id: 0
					},
					{
						name: '待发货',
						id: 1
					}, {
						name: '已发货',
						id: 2
					},
					{
						name: '已完成',
						id: 3
					},

				],
				tab_index: 0,
				list: [],
				is_null: false,
				page: 1,
				total_price: 0,
			};
		},
		onShow() {
			// if (this.order_id) {
			// 	// this.toPage(
			// 	// 	`/pages/pay/pay?type=order&order_id=${this.order_id}`
			// 	// )
			this.init();
			// 	this.order_id = '';
			// }

			if (uni.getStorageSync('order_id')) {
				let pay_time = uni.getStorageSync('pay_time');
				if (new Date().getTime() - pay_time < 1800)
					return;
				let order_id = uni.getStorageSync('order_id');
				let pay_id = uni.getStorageSync('pay_id');
				uni.setStorageSync('order_id', '');
				uni.setStorageSync('pay_id', '');
				this.init();
			}
		},
		onLoad(e) {
			if (e.index) {
				this.tab_index = Number(e.index);
			}
			this.init();
			uni.$on('cancel_order', (id) => {
				if (this.tab_index != 4) {
					this.list = this.list.filter(val => val.orderId != id);
				}
			})
			uni.$on('refresh_order', () => {
				this.init();
			})


		},
		onUnload() {
			this.$off('cancel_order');
			this.$off('refresh_order');
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
				console.log(index, this.tab_list[this.tab_index].id)
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
					url: '/order/getOrderList',
					method: 'POST',
					data: {
						pageNumber: page,
						pageSize: 10,
						orderStatus: this.tab_list[this.tab_index].id,
						// this.tab_list[this.tab_index].id
					},
					loading: page == 1,
				}).then(res => {

					if (res.status == 200) {
						if (res.data) {
							res.data.forEach(val => {
								if (val.src) {
									val.src = val.src.split(',')[0]
								}
								if (val.createTime) {
									val.time = this.dateFormat('YY-mm-dd HH:MM', new Date(val.createTime));
								}

							})
						}
						this.list = this.list.concat(res.data || []);
						console.log(this.list, 'this.list')
						if (res.data?.length == 0) {
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
								url: '/order/cancel',
								data: {
									orderId: item.id
								},
								method: 'POST',
								loading: true,
							}).then(res => {
								if (res.status == 200) {
									this.showToast('订单取消成功');
									// if (this.tab_index != 4) {
									// 	this.list = this.list.filter(val => val.id != item
									// 		.id);
									// }
									item.orderStatus = -1
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
					
					if (item.id) {
						this.$refs.pay.open({
							order_id: [item.id],
							success: () => {
								this.init()
							},
							fail: ()=> {
								
							}
							
						});
						return;
					}

					let order_id = item.orderId;
					this.order_id = item.orderId;
					this.total_price = item.totalAmount;

					// this.$refs.pay.open({
					// 	price: item.totalAmount,
					// 	order_id: order_id,
					// 	mine: () => {
					// 		this.init();
					// 	}
					// });
					// return;
					
					
					
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
			confirm_receipt(item) {
				this.request({
					url: '/order/harvest',
					data: {
						orderId: item.id
					},
					method: 'POST'
				}).then(res => {
					if (res != 200) return

				})
			},
			to_detail(item) {

				this.toPage('/pages/order/order-detail?id=' + item.id + '&review=' + item.isReview)
			}

		},

	}
</script>

<style lang="scss">
	page {
		background-color: #F5F6F7;
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
		white-space: nowrap;
	}

	.pay {
		border-color: #FF882F;
		color: #FF882F;
	}
</style>
