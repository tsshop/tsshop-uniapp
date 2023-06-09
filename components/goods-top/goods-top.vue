<template>
	<view style="width: 100%;" v-if="list.length > 0 || livesList.length>0">
		<view class="flex">
			<!-- 秒杀 -->
			<view v-if="list.length>0" class="goods-top-item" @tap.stop="toPage('/pages/goods/miaosha-list','',true)">
				<view class="jb-1"></view>


				<view class="flex flex-y-center pl-20 pt-20 flex-x-b pr-20">
					<view style="color:#323232;line-height: 44rpx;white-space: nowrap;" class="fs-30">
						限时秒杀
					</view>
					<view class="flex flex-x-y">
						<time1 :time="time"></time1>
					</view>
				</view>

				<view class="flex flex-x-start">
					<goodsItem :list="list"></goodsItem>

				</view>




			</view>
			<!-- 秒杀 -->
			<!-- 新人 -->
			<!-- <view class="goods-top-item" @tap.stop="toPage('/pages/newcomers/newcomers')">
				<view class="jb-2"></view>
				<view class="flex flex-y-center pl-20 pt-20 flex-x-b pr-20">
					<view style="color:#323232;line-height: 44rpx;white-space: nowrap;" class="fs-30">
						新人专享
					</view>
					<view class="flex flex-x-y">
						<view class="new-people">低至3折起</view>
					</view>
				</view>
				<view class="flex pl-20 pr-20">
					<goodsItem></goodsItem>
				</view>
			</view> -->
			<!-- 新人 -->
			<!-- 直播列表 -->
			<view class="goods-top-item" @tap.stop="toLive" v-if="livesList.length>0">
				<view class="jb-2"></view>
				<view class="flex flex-y-center pl-20 pt-20 flex-x-b pr-20">
					<view style="color:#323232;line-height: 44rpx;white-space: nowrap;" class="fs-30">
						商城直播
					</view>
					<view class="flex flex-x-y color fs-28">
						<view>更多</view>
						<view class="iconfont icon-jinru w-20" style="font-size: 24rpx;"></view>
					</view>
				</view>
				<view class="flex pl-20 pr-20">
					<view v-for="(item,index) in livesList" :key="index" class="lives-item">
						<view class="live-item-box">
							<image :src="item.url">
							</image>
							<view class="lives-status">{{item.timeStr}}</view>
						</view>
						<view class="color-333333 fs-26 over-line1" style="margin-top: 16rpx;">{{item.title}}</view>
					</view>
				</view>
			</view>
			<!-- 直播列表 -->
		</view>
	</view>
</template>

<script>
	import time1 from '../countdown/time.vue';
	import goodsItem from './goods.vue';
	export default {
		name: "goods-top",
		components: {
			time1,
			goodsItem
		},
		data() {
			return {
				time: '',
				list: [],
				livesList: [],
			};
		},
		created() {
			this.refresh();
		},

		methods: {
			toLive() {
				// #ifdef MP-WEIXIN
				this.showToast('请在APP端打开');
				return;
				// #endif
				this.toPage('/pages/lives-list/lives-list');
			},
			refresh() {
				this.get_seckill()
			},
			get_seckill() {



				//获取直播列表
				this.request({
					url: '/live/onLiveList',
				}).then(live => {


					//////////////////////
					this.request({
						url: '/seckill/getHome'
					}).then(res => {
						let liveArr = live?.data?.records || [];
						let goodsArr = res?.data?.goods || [];
						// if (res.status != 200) return
						if (goodsArr.length > 0) {
							let time = Math.floor((res.data.time - Date.now()) / 1000)
							this.time = time;
						}
						/////////////

						if (liveArr.length == 0) {

							//秒杀商品
							this.list = goodsArr.filter((val, index) => {
								return index < 4;
							});

						} else {
							//秒杀商品
							this.list = goodsArr.filter((val, index) => {
								return index < 2;
							});
						}

						if (goodsArr.length == 0) {
							liveArr = liveArr.filter((val, index) => index < 4);
			
						} else {
							liveArr = liveArr.filter((val, index) => index < 2);
						}
					
						this.livesList = liveArr.map(val => {
							val.timeStr = val.reckonTime > new Date().getTime() ? '即将开始' : '直播中';
							return val;
						});

					});

					//////////////////////



				});


			}
		}
	}
</script>

<style lang="scss">
	.goods-top-item {
		flex: 1;
		border-radius: 8rpx;
		overflow: hidden;
		background-color: #FFFFFF;
		position: relative;
		padding-bottom: 20rpx;
	}

	.jb-1 {
		height: 38rpx;
		background: #FF7676;
		opacity: 0.19;
		filter: blur(10rpx);
		position: absolute;
		top: -2rpx;
		width: 100%;
	}

	.jb-2 {
		height: 38rpx;
		background: #FFA600;
		opacity: 0.19;
		filter: blur(10rpx);
		position: absolute;
		top: -2rpx;
		width: 100%;
	}

	.goods-top-item+.goods-top-item {
		margin-left: 20rpx;
	}

	.new-people {
		padding: 0 12rpx;
		border-radius: 4rpx;
		height: 36rpx;
		color: #FFFFFF;
		font-size: 26rpx;
		background-color: #FFA600;
		line-height: 36rpx;
	}

	.lives-item {
		width: 144rpx;
		margin-top: 40rpx;
	}

	.live-item-box {
		width: 144rpx;
		height: 144rpx;
		border-radius: 12rpx;
		overflow: hidden;
		position: relative;

		image {
			width: 100%;
			height: 100%;
		}

		.lives-status {
			font-size: 24rpx;
			color: #ffffff;
			background-color: rgba(4, 4, 4, 0.57);
			border-radius: 20rpx;
			height: 36rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 16rpx;
			position: absolute;
			left: 10rpx;
			top: 10rpx;
		}
	}

	.lives-item+.lives-item {
		margin-left: 24rpx;
	}
</style>