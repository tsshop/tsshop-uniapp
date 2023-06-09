<template>
	<view>
		<view
			style="width: 100vw;height: 100vh;background-color: rgba(0,0,0,0);position: fixed;left: 0;top: 0;z-index: 99999;"
			v-if="show" @tap.stop="close" class="anitop">
			<view :style="{height:customBar}"></view>
			<view class="flex flex-x-end">
				<view class="more-box">
					
					<view @tap.stop="handel(1)" class="flex flex-y-center more-btn">
						<view class="iconfont icon-haoyou2 more-icon"></view>
						<view class="flex-1 flex more-text border-b">创建群聊</view>
					</view>
					<view @tap.stop="handel(2)" class="flex flex-y-center  more-btn">
						<view class="iconfont icon-tianjiahaoyou more-icon"></view>
						<view class="flex-1 flex more-text">添加朋友</view>
					</view>
					<view @tap.stop="to_saoma" class="flex flex-y-center more-btn">
						<view class="iconfont icon-saoma more-icon"></view>
						<view class="flex-1 flex more-text border-b">扫一扫</view>
					</view>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'chatMore',
		data() {
			return {
				show: false,
				customBar: getApp().globalData.customBar + 'px',

			}
		},
		methods: {
			open() {
				this.show = true;
			},
			close() {
				this.show = false;
			},
			handel(e) {
				this.show = false;
				if (e == 1) {
					this.toPage('/pages/chat/create-group');
					return;
				}
				if (e == 2) {
					this.toPage('/pages/chat/search?index=1');
					return;
				}
			},
			to_saoma() {
				uni.scanCode({
					success: res => {
						// this.$refs.toast.open({
						// 	title: '扫码结果',
						// 	desc: JSON.stringify(res.result),
						// });
						this.close();
						let result = res.result || '';
						this.to_page_by_code(result);

					}
				})
			},
		}

	}
</script>

<style>
	.more-box {



		margin-right: 40rpx;
		margin-top: -10rpx;
		position: relative;
		width: 228rpx;
		background: #FFFFFF;
		box-shadow: 0px 0px 12rpx 0px rgba(50, 50, 50, 0.2);
		border-radius: 16rpx;
		border: 0px solid #B2B2B2;
		padding: 24rpx 0;
	}

	/* .more-box::after {
		position: absolute;
		content: "";
		width: 34rpx;
		height: 34rpx;
		background-color: #FFFFFF;
		transform: rotate(45deg);
		top: -4rpx;
		right: 18rpx;
	}
 */
	.more-icon {
		font-size: 34rpx;
		margin-left: 28rpx;
		margin-right: 24rpx;
		color: #32343A;

	}

	.more-text {
		height: 74rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		color: #32343A;
		font-size: 24rpx;
	}



	.anitop {
		animation: anitop 0.3s;
	}

	@keyframes anitop {
		0% {
			transform: translateY(20rpx);
			opacity: 0.6;
		}

		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
