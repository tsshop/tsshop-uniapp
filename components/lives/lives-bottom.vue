<template>
	<view class="lives-bottom-box">
		<view class="lives-bottom">
			<!-- 输入框 -->
			<view class="lives-input-box" @tap="showBottomInput">
				<text class="fs-24 color-ffffff">说点什么...</text>
			</view>
			<!-- 输入框 -->
			<!-- 操作按钮 -->
			<view class="lives-right-bar">
				<!-- 主播待看消息 -->
				<view class="lives-right-item" v-if="status == 1">
					<clickAnimation @click="connectUser">
						<image :src="img4" class="lives-btn-image" style="height:50rpx" mode="heightFix"></image>
					</clickAnimation>
					<view class="lives-right-item-dot" v-if="maikeNum>0">
						<text class="lives-btn-text">{{maikeNum}}</text>
					</view>
				</view>
				<!-- 主播待看消息 -->
				<!-- 观众拨打电话 -->
				<view class="lives-right-item" v-if="status == 2">
					<clickAnimation @click="connectLive">
						<image :src="img5" class="lives-btn-image" mode="heightFix"></image>
					</clickAnimation>
				</view>
				<!-- 观众拨打电话 -->
				<!-- 观众送礼物 -->
				<view class="lives-right-item">
					<clickAnimation @click="showLivesGift">
						<image :src="img2" class="lives-btn-image" mode="heightFix"></image>
					</clickAnimation>
				</view>
				<!-- 观众送礼物 -->
				<!-- 商品列表 -->
				<view class="lives-right-item">
					<clickAnimation @click="showLivesGoods">
						<image :src="img1" class="lives-btn-image" mode="heightFix"></image>
					</clickAnimation>
					<view class="lives-right-item-dot" v-if="info && info.goodsList && info.goodsList.length>0">
						<text class="lives-btn-text">
							{{info.goodsList.length}}
						</text>
					</view>
				</view>
				<!-- 商品列表 -->
				<!-- 点赞 -->
				<view @tap="click_likes" class="lives-right-item">
					<image :src="img3" :style="{transform:transform}" class="lives-btn-image like-images"
						mode="heightFix"></image>
				</view>
				<!-- 点赞 -->
			</view>
			<!-- 操作按钮 -->

		</view>
		<toast-nvue ref="toast"></toast-nvue>
	</view>

</template>

<script>
	import {
		createLink
	} from '@/pages/live/api/live.js';
	import img1 from '@/static/lives/live-botton-1.png';
	import img2 from '@/static/lives/live-botton-2.png';
	import img3 from '@/static/lives/live-botton-3.png';
	import img4 from '@/static/lives/live-botton-4.png';
	import img5 from '@/static/lives/live-botton-5.png';
	import clickAnimation from './click-animation.vue';
	export default {
		name: 'lives-bottom',
		props: {
			info: {
				type: Object,
				default: null,
			},
			status: {
				type: [String, Number],
				default: '',
			}
		},
		components: {
			clickAnimation
		},
		data() {
			return {
				img1: img1,
				img2: img2,
				img3: img3,
				img4: img4,
				img5: img5,
				transform: 'scale(1)',
				maikeNum: 0,
			}
		},
		methods: {
			click_likes() {
				console.log('xxx')
			},
			connectUser() {
				uni.$emit('connectUser');
			},
			showLivesGoods() {
				uni.$emit('showLivesGoods');
			},
			showLivesGift() {
				uni.$emit('showLivesGift');
			},
			showBottomInput() {
				uni.$emit('showBottomInput', {});
			},
			connectLive() {
				this.$refs.toast.open({
					title: '',
					desc: '是否连线主播',
					success: () => {
						let user_info = uni.getStorageSync('user_info');
						let query = {
							liveId: this.info.id,
							userId: user_info.id,
							liveUserId: this.info.userId,
							isFromUser: true,
						};
						console.log('query', query);
						createLink(query);
						this.showToast('等待对方接听');
					}
				});
			},
			showToast(title = "", duration = 2000, icon = "none") {
			
				// #ifdef APP-PLUS || APP-NVUE
				plus.nativeUI.toast(title);
				// #endif
			
				// #ifndef APP-PLUS || APP-NVUE
				uni.showToast({
					title,
					icon,
					duration
				})
				// #endif
			
			},
		},
		created() {
			//点击
			getApp().globalData.liveLikeClick = () => {
				this.transform = 'scale(0.9)';
				clearTimeout(this.clearTransform);
				this.clearTransform = setTimeout(() => {
					this.transform = 'scale(1)';
				}, 320);
			}
			uni.$off('changeMaikeNum');
			uni.$on('changeMaikeNum', (num) => {
				this.maikeNum = num;
			});
		},

	}
</script>

<style>
	.lives-bottom-box {
		position: fixed;
		bottom: 0;
		left: 0;
		flex-direction: row;
		width: 750rpx;

	}

	.lives-bottom {
		flex-direction: row;
		flex: 1;
		margin: 30rpx 20rpx 50rpx 20rpx;
		align-items: center;
	}

	.lives-input-box {
		color: #FFFFFF;
		font-size: 28rpx;
		flex: 1;
		height: 90rpx;
		background-color: rgba(0, 0, 0, 0.7);
		border-radius: 20rpx;
		align-items: center;
		flex-direction: row;
		padding-left: 35rpx;
	}

	.lives-right-bar {
		flex-direction: row;
		align-items: center;
		margin-left: 5rpx;
	}

	.lives-right-item {
		width: 90rpx;
		height: 90rpx;
		background-color: rgba(0, 0, 0, 0.7);
		border-radius: 50%;
		margin-left: 10rpx;
		position: relative;
		justify-content: center;
		align-items: center;
	}

	.lives-right-item-dot {
		position: absolute;
		height: 30rpx;
		line-height: 30rpx;
		border-radius: 15rpx;
		background-color: #F46554;
		color: #FFFFFF;
		font-size: 24rpx;
		width: 30rpx;
		justify-content: center;
		align-items: center;
		top: 0rpx;
		right: 0rpx;
		text-align: center;
		flex-direction: row;
	}

	.lives-btn-image {
		height: 58rpx;
	}

	.lives-btn-text {
		font-size: 24rpx;
		color: #FFFFFF;
	}

	.like-images {
		transition: transform 0.3s;
	}

	.btn-click-style {
		transform: scale(0.9);
	}
</style>