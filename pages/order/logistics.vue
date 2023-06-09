<template>
	<view>
		<custom title="物流信息" fixed="fixed" mode="2"></custom>

		<view class="w-688 ml-31">
			<view class="flex flex-y-center fs-28 color-333333"
				style="height: 116rpx;border-bottom:1px solid rgba(216,216,216,0.50); ;">
				<!-- <image src="" mode="" style="width: 56rpx;height: 56rpx;border-radius: 50%;background-color: #f5f5f5;">
				</image> -->
				<view class="flex-1 flex" style="margin-left: 12rpx;">
					<view style="color: #FC8800;">{{shipperName}}</view>
					<view class="ml-30 ml-20">{{info.expressNo}}</view>
				</view>
				<view @tap="mycopy(info.expressNo)">复制</view>
				<!-- <view style="width: 1px;height: 24rpx;background-color: #999999;margin: 0 22rpx;"></view>
				<view>打电话</view> -->

			</view>


			<view class="flex flex-y-start fs-28 color-333333"
				style="padding:34rpx 0 ;border-bottom:1px solid rgba(216,216,216,0.50); ;">
				<!-- <image src="../../static/images/car2.png" mode="" style="width: 46rpx;height: 46rpx;"></image> -->
				<view class="flex-1">
					<view class="flex-1 flex flex-x-b" style="margin-left: 24rpx;">
						<view>订单编号: {{info.orderNo}}</view>
						<view @tap="mycopy(info.orderNo)">复制</view>
					</view>
					<view class="text over-line2 mt-20" style="padding: 0 24rpx;">
						收货地址: {{address.provinceName}}{{address.cityName}}{{address.areaName}}{{address.detailAddr}}

					</view>
				</view>


			</view>

		</view>
		<view>
			<steps :list="list"></steps>
		</view>


		<view style="height: 140rpx;">
			<view
				style="position: fixed;height: 140rpx;bottom: 0;background-color: #FFFFFF;z-index: 4;width: 750rpx;border-top: 0.5px solid #EBEBEB;"
				class="flex flex-x-end flex-y-center">
				<!-- <view class="express-1">延长物流</view> -->
				<!-- v-if="info.orderStatus == 2" -->
				<view @click="sure_shouhuo" v-if="info.orderStatus == 2" class="express-2">确定收货</view>
			</view>
		</view>

		<toast ref="toast"></toast>

	</view>
</template>

<script>
	export default {
		data() {
			return {

				list: [],
				page: 1,
				is_null: true,

				shipperName: '快递',
				status: '',
				orderStatus: '',
				id: '',
				info: '',
				address: '',
			}
		},
		onLoad(e) {
			if (e.id) {
				this.id = e.id
			}
			// if (e.express) {
			// 	this.express = e.express;
			// 	this.expressNo = e.expressNo;
			// 	this.orderNo = e.orderNo;
			// 	this.detail = e.detail;
			// 	this.order_id = e.order_id;
			// }
			// if (e.orderStatus) {
			// 	this.orderStatus = e.orderStatus;
			// }
			// if (e.yc) {
			// 	this.yc = true;
			// }
			this.get_info()

			// this.init();



		},
		onReachBottom() {
			// this.get_list(this.page);
		},
		onPullDownRefresh() {
			// setTimeout(() => {
			// 	uni.stopPullDownRefresh();
			// }, 200);
			// this.init();
		},


		methods: {
			get_sort() {
				console.log(this.info, 'info', this.info.express, this.info.expressNo, this.info.orderNo)
				this.request({
					url: "/order/expressInfo",
					data: {
						express: this.info.express,
						expressNo: this.info.expressNo,
						orderNo: this.info.orderNo
					},
					method: 'POST',
				}).then(res => {
					if (res.status == 200) {
						if (res.data && res.data.Success === 'true') {
							let list = res.data?.Traces || [];
							this.shipperName = res.data?.ShipperCode || this.shipperName;
							this.list = list.map(val => {
								return {
									time: val.AcceptTime,
									desc: val.AcceptStation,
									// status:'',
									// phone:'',
									// statusName:'',
									// isMainNode:''
								}
							}).reverse();
							console.log(this.list, 'this.list')
						} else {
							this.showToast(res.data.reason || '请稍后重试', 4000);
						}


					}
				});
			},
			init() {
				this.setData({
					page: 1,
					list: [],
					is_null: false,
				})
				this.get_list();
			},
			get_info() {
				this.request({
					url: '/order/detail',
					data: {
						orderId: this.id
					}
				}).then(res => {
					if (res.status != 200) return
					this.info = res.data
					this.address = res.data.addressOrder
					console.log(this.info, 'infooooo')
					this.get_sort();
				})
			},
			// get_list(page = 1) {
			// 	this.request({
			// 		url: '/goods/first',
			// 		data: {
			// 			pages: page,
			// 		}
			// 	}).then(res => {

			// 		if (res.status == 200) {
			// 			this.list = this.list.concat(res.data);

			// 			if (res.data.length == 0) {
			// 				this.is_null = true;
			// 			} else {
			// 				this.page++;
			// 			}
			// 		}
			// 	});
			// },
			sure_shouhuo() {

				this.$refs.toast.open({
					desc: '确认收货',
					success: () => {
						this.less(() => {
							if (this.yc) {

								this.request({
									url: '/order/harvest',
									data: {
										// keyWords: "",
										orderId: this.info.id,
										// orderStatus: 4,
										// userId: this.user_info.id,
									},
									method: 'POST',
									loading: true,
								}).then(res => {
									if (res.status == 200) {
										uni.$emit('refresh_order');
										this.showToast('确认收货成功');
										setTimeout(() => {
											this.uniBack();
										}, 500)
									}
								});
							} else {
								this.request({
									url: '/order/harvest',
									data: {
										orderId: this.info.id,
									},
									method: 'POST',
									loading: true,
								}).then(res => {
									if (res.status == 200) {
										uni.$emit('refresh_order');
										this.showToast('确认收货成功');
										setTimeout(() => {
											this.uniBack();
										}, 500)
									}
								});
							}

						})

					}
				})


			}
		},

	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.express-1 {
		font-size: 32rpx;
		color: #333333;
		width: 168rpx;
		height: 68rpx;
		border-radius: 32rpx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 28rpx;
		border: 1rpx solid #979797;
	}

	.express-2 {
		font-size: 32rpx;
		color: #FFFFFF;
		width: 168rpx;
		height: 68rpx;
		border-radius: 34rpx;
		background: $color;
		margin-right: 28rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		white-space: nowrap;
	}
</style>
