<template>
	<view>
		<custom fixed="fixed" background="rgba(0,0,0,0)" height="0" mode="2" title="直播小店"></custom>
		<view class="bg">
			<view class="" :style="{ height: customBar }"></view>
			<view class="flex flex-x-b flex-y-center" style="padding:30rpx;padding-bottom:0;">
				<view class="flex flex-y-center pr p-20" style="padding-top: 0;">
					<view @tap.stop="choose_image(live_store_info.storeHeadPortrait || '')"
						style="width: 110rpx;height: 110rpx;border-radius: 50%;overflow: hidden;margin-right: 20rpx;background-color: #FFFFFF;">
						<qq-image :url="live_store_info.storeHeadPortrait"
							imageStyle="width: 110rpx;height:110rpx;"></qq-image>
					</view>

					<view v-if="live_store_info.storeName" class="flex flex-y flex-x-center flex-1"
						style="height: 128rpx;">
						<view class="fs-36 color-323232 flex flex-y-center">
							<view class="fs-36">{{ live_store_info.storeName }}</view>

						</view>
						<view class="fs-28 color-646464 mt-20">{{ live_store_info.storePhone }}</view>
					</view>
					<!-- <view v-else class="flex flex-y flex-x-center flex-1" style="height: 128rpx;">
                        <view class="fs-36 color-black">点我登录</view>
                    </view> -->
				</view>
				<view class="eidt-box flex flex-x-y" style="z-index: 4;"
					@tap.stop="toPage('/pages/liveStore/liveInfo','',true)">
					<image src="../../static/liveStore/edit.png" style="width:26rpx;height:26rpx;" mode=""></image>
					<view class="fs-28 ml-10">编辑</view>
				</view>
			</view>

			<view class="" style="padding:30rpx;">
				<view class="list-item flex flex-y-center mb-30"
					@tap.stop="toPage('/pages/liveStore/liveHistory','',true)">
					<image src="../../static/liveStore/list1.png" style="width:32rpx;height:32rpx;" mode=""></image>
					<view class="ml-20 fs-28">直播历史</view>
				</view>
				<view class="list-item flex flex-y-center mb-30"
					@tap.stop="toPage('/pages/liveStore/orderList','',true)">
					<image src="../../static/liveStore/list2.png" style="width:32rpx;height:32rpx;" mode=""></image>
					<view class="ml-20 fs-28">订单列表</view>
				</view>
				<view class="list-item flex flex-y-center mb-30" @tap.stop="toPage('/pages/liveStore/myMall','',true)">
					<image src="../../static/liveStore/list3.png" style="width:32rpx;height:32rpx;" mode=""></image>
					<view class="ml-20 fs-28">我的商城</view>
				</view>
				<view class="list-item flex flex-y-center mb-30" @tap.stop="toPage('/pages/liveStore/income','',true)">
					<image src="../../static/liveStore/list4.png" style="width:32rpx;height:32rpx;" mode=""></image>
					<view class="ml-20 fs-28">我的收益</view>
				</view>
				<view class="list-item flex flex-y-center mb-30"
					@tap.stop="toPage('/pages/liveStore/accountList','',true)">
					<image src="../../static/liveStore/account.png" style="width:32rpx;height:32rpx;" mode=""></image>
					<view class="ml-20 fs-28">我的账户</view>
				</view>
			</view>

			<view class="flex flex-x-y">

			</view>

		</view>

		<fixed-bottom>
			<view class="" style="padding:30rpx;">
				<view class="store-btn flex flex-x-y blod" v-if="!liveDetail" @tap.stop="open">创建直播间</view>
				<view class="store-btn flex flex-x-y"
					@tap.stop="toPage('/pages/live/live?status=1&liveId='+liveDetail.id)" v-else-if="!showTime">

					<view class="mr-20 fs-28">开始直播</view>

				</view>
				<view class="store-btn flex flex-x-y" @tap.stop="open" v-else-if="showTime">
					<view class="mr-20 fs-28">直播间倒计时</view>
					<view class="fs-28" v-if="showTime">
						<lw-count-down @init="startLive" :endTime="reckonTime"></lw-count-down>
					</view>
				</view>
			</view>
		</fixed-bottom>

		<action-confirm ref="confirm"></action-confirm>

		<common></common>
		<fixed-line></fixed-line>



	</view>
</template>

<script>
	export default {
		data() {
			return {
				customBar: getApp().globalData.customBar + 'px',
				statusbar: getApp().globalData.statusBar + 0 + 'px',
				reckonTime: 0,
				liveDetail: null,
				showTime: false,
			};
		},
		computed: {

		},
		mounted() {


		},
		onShow() {
			this.$store.dispatch('refresh_live_stroe_info')
			this.getLiveDetail();
		},
		methods: {
			
			open() {

				if (this.liveDetail) {
					getApp().globalData.liveDetail = this.clone(this.liveDetail);
					this.toPage(`/pages/liveStore/prepare?title=预约直播`);
					return;
				}
				let _this = this
				this.$refs.confirm.open({
					list: [{
						name: '立即直播'
					}, {
						name: '预约直播'
					}, ],
					success(index) {

						_this.toPage('/pages/liveStore/prepare?title=' + ['立即直播', '预约直播'][index])
					}

				})
			},
			choose_image(url) {

				if (url) {
					uni.previewImage({
						urls: [url]
					})
				}
			},
			getLiveDetail() {
				this.request({
					url: '/live/reserveLive',
					toast: false,
				}).then(res => {
					if (res && res.data) {
						this.reckonTime = res.data.reckonTime;
						this.liveDetail = res.data;
						if (this.reckonTime <= new Date().getTime()) {
							this.showTime = false;
						} else {
							this.showTime = true;
						}
					} else {
						this.reckonTime = 0;
						this.liveDetail = null;
						this.showTime = false;
					}
				});
			},
			startLive() {
				this.showTime = false;
			},
		}
	}
</script>

<style lang="scss">
	page {

		/* #ifdef H5  */
		// min-height: 100vh;
		/* #endif */
		background-color: $pageColor;
		color: #3B4644;
	}

	.bg {
		background-image: linear-gradient(to top right, #f5f5f7, #f2f4f9)
	}

	.eidt-box {
		width: 150rpx;
		height: 55rpx;
		border-radius: 30rpx;
		background-color: #fff;
	}

	.list-item {
		background-color: #fff;
		height: 100rpx;
		border-radius: 24rpx;
		padding: 0 30rpx;
	}

	.store-btn {
		margin-top: 60rpx;
		width: 100%;
		height: 84rpx;
		background-color: #F8791A;
		color: #ffffff;
		border-radius: 15rpx;
		font-size: 28rpx;
	}
</style>