<template>
	<view>
		<view v-if="show" class="live-detail-box" :style="{height:screenHeight+'px',width:screenWidth + 'px'}">
			<view :style="{height:statusbar + 'px'}"></view>
			<view style="margin-top: 30rpx;padding-left: 34rpx;">
				<view @tap.stop="back" style="width: 50rpx;height: 50rpx;align-items: center;justify-content: center;">
					<image :src="leftImg" mode="aspectFill" style="width: 28rpx;height: 28rpx;"></image>
				</view>
			</view>



			<view style="margin-top: 112rpx;">
				<view style="align-items: center;">
					<view>
						<text class="fs-40 color-ffffff">直播已结束</text>
					</view>

					<view style="margin-top: 40rpx;">
						<!-- <text class="fs-24 color-ffffff">直播时长 05:07</text> -->
					</view>


					<!-- 数据 -->
					<view class="live-detail-panle">
						<view>
							<text class="fs-28 color-ffffff">直播数据</text>
						</view>


						<view style="flex-direction: row;justify-content: space-between;" v-if="info">
							
							
							<view class="detail-text-item">
								<view>
									<text class="detail-text-item-1">{{info.formatBetween || '0秒'}}</text>
								</view>
								<view>
									<text class="detail-text-item-2">直播时长</text>
								</view>
							</view>
							



							<!-- <view class="detail-text-item">
								<view>
									<text class="detail-text-item-1">{{info.profit || '0'}}积分</text>
								</view>
								<view>
									<text class="detail-text-item-2">总热度</text>
								</view>
							</view> -->
							
							<view class="detail-text-item">
								<view>
									<text class="detail-text-item-1">{{info.personNum || '0'}}人</text>
								</view>
								<view>
									<text class="detail-text-item-2">观众总数</text>
								</view>
							</view>



							


						</view>


						<!-- <view style="height: 1px;background-color: rgba(82,82,82,0.6);margin-top: 18rpx;">

						</view>

						<view @tap.stop="toDetail"
							style="flex-direction: row;justify-content: space-between;margin-top: 18rpx;align-items: center;">
							<view>
								<text class="fs-28 color-ffffff">直播记录</text>
							</view>
							<image :src="rightImg" mode="aspectFill" style="width: 26rpx;height: 26rpx;"></image>
						</view> -->



					</view>
					<!-- 数据 -->

				</view>
			</view>


		</view>
	</view>
</template>

<script>
	import leftImg from '@/static/nvue/cuo.png';
	import rightImg from '@/static/nvue/right.png';
	export default {
		name: 'live-detail',
		props: {
			liveId: {
				type: [String, Number],
				default: '',
			}
		},
		data() {
			return {
				leftImg,
				rightImg,
				statusbar: getApp().globalData.statusBar,
				screenHeight: getApp().globalData.screenHeight,
				screenWidth: getApp().globalData.screenWidth,
				show: true,
				info: {}
			}
		},
		created() {
			this.get_info();
			uni.$on('live-detail-info', data => {
				this.info = data;
				// uni.hideLoading();
			})
		},
		beforeDestroy(){
			if(uni){
				uni.$off('live-detail-info',data=>{
					if(data){
						this.info = data;
						
					}
				});
				
			}
		},
		methods: {
			get_info() {
				// uni.showLoading({
				// 	mask: true,
				// 	title: '获取直播数据中'
				// });
				// setTimeout(() => {
				// 	uni.hideLoading();
				// }, 4000);
			},
			toDetail() {
				uni.navigateTo({
					url: `/pages/chat/live-list`,
				})
			},
			back() {
				uni.navigateBack({
					delta: 1,
				})
			}
		}
	}
</script>

<style>
	.live-detail-box {
		width: 100vw;
		height: 100vh;
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.79);
		/* background-color: red; */
	}

	.live-detail-panle {
		width: 670rpx;
		border-radius: 20rpx;
		background-color: rgba(139, 147, 155, 0.26);
		margin-top: 54rpx;
		padding: 22rpx 32rpx;
	}

	.detail-text-item {
		margin-top: 38rpx;

	}

	.detail-text-item-1 {
		font-size: 28rpx;
		color: #FFFFFF;
		line-height: 30rpx;
	}

	.detail-text-item-2 {
		margin-top: 28rpx;
		color: #C0C0C0;
		font-size: 24rpx;
	}
</style>
