<template>
	<view>
		<custom fixed="fixed" title="我的服务订单"></custom>


		<view class="flex flex-wrap" style="padding:0 20rpx;">
			<view class="goods-list-item flex flex-wrap" v-for="(item,index) in list" :key="item.id">
				<view style="width: 100%;height: 160rpx;" class="flex">
					<view style="width: 238rpx;height: 160rpx;margin-right: 20rpx;">
						<qq-image :url="item.imgUrl" imageStyle="width: 238rpx;height: 160rpx;border-radius: 10rpx;">
						</qq-image>
					</view>
					<view class="flex-1 flex flex-y  flex-x-b hidden" style="color:#3B4644;">
						<view style="width: 100%;" class="fs-32 flex  flex-x-b">
							<view class="flex-1 over-line2">{{item.goodsName}}</view>
							<view class="ml-20 color fs-24">
								{{item.orderStatus == 1?'待服务':'已完成'}}
							</view>
						</view>
						<view style="width: 100%;color:#808080;" class="over-line1 fs-24">
							{{item.receiveName}} {{item.receivePhone}}
						</view>
						<view style="width: 100%;color:#808080;" class="over-line1 fs-24">
							{{item.receiveAddress}}
						</view>

					</view>
				</view>
				<view class="flex flex-y-end flex-x-b" style="width: 100%;">
					<view class="fs-24" style="color:#808080;">{{item.createTime}}</view>
					<view style="margin-top: 20rpx;" class="over-line1">
						<price :price="item.orderAmount"></price>
					</view>
				</view>

			</view>
		</view>

		<qq-footer :list="list" :show="is_null"></qq-footer>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				list: [],
				is_null: false,
			}
		},
		onLoad() {
			this.init();
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
			init() {
				this.setData({
					page: 1,
					list: [],
					is_null: false,

				})

				this.get_list();
			},
			get_list(page = 1) {
				let data = {
					pageNumber: page,
					pageSize: 10,
				};

				this.request({
					url: '/order/orderList',
					data,
					loading: page == 1,
				}).then(res => {
					if (!this.rsuccess(res)) return;

					if (res.data?.list) {
						res.data?.list.forEach(val => {
							if (val.imgUrl) {
								val.imgUrl = val.imgUrl.split(',')[0]
							}
						})
					}


					this.list = this.list.concat(res.data?.list || []);

					if (res.data?.list?.length == 0) {
						this.is_null = true;
					} else {
						this.page++;
					}

				});
			}
		},
	}
</script>

<style>
	page {
		background-color: #F2F6F5;
	}

	.door-swiper {
		width: 100%;
		height: 340rpx;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.door-swiper-item {
		height: 100%;
		border: 1rpx solid #000;

	}

	.door-swiper-item image {
		width: 100%;
		height: 100%;
	}

	.goods-list-item {

		background: #FFFFFF;
		border-radius: 10rpx;
		width: 100%;
		padding: 24rpx 20rpx;
		margin-top: 20rpx;
	}
</style>
