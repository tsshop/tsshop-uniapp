<template>
	<view style="flex-direction: row;justify-content: flex-start;">
		<view style="flex-direction: row;align-items: center;" class="gift-one-line"
			:class="[show1 && show?'gift-one-line-show':'',show1?'gift-one-line-show-1':'',hidden?'gift-one-line-hidden':'']">
			<template>
				<!-- <text class="fs-28 color-ffffff" style="line-height: 30rpx;">
					{{info.userName}} 送出 {{info.name}}
				</text> -->

				<!-- <image :src="i" mode="aspectFill" style="width:100rpx;height: 100rpx;"></image> -->
				<qq-image :url="info.imgUrl" imageStyle="width:140rpx;height: 140rpx;"></qq-image>
				<text class="fs-40 color-ffffff" style="margin-left: 4rpx;line-height: 30rpx;margin-right: 10rpx;">
					x{{info.num}}
				</text>
				<!-- 底部背景 -->
				<!-- <view class="gift-one-line-2" :class="[!ios?'no-ios':'']">
					<text class="fs-28" style="color: rgba(0,0,0,0);line-height: 30rpx;">
						{{info.userName}} 送出 {{info.name}}
					</text>
					<view style="width: 80rpx;"></view>
					<text class="fs-28 color-ffffff"
						style="margin-left: 14rpx;line-height: 30rpx;color: rgba(0,0,0,0);width: 0px;">
						x{{info.num}}
					</text>
				</view> -->
				<!-- 底部背景 -->
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'giftOne',
		props: {
			info: {
				type: Object,
				default: () => ({})
			},
			ios: {
				type: Boolean,
				default: true,
			}
		},
		data() {
			return {
				show: false,
				show1: false,
				hidden: false,
				// ios: true,
			}
		},
		created() {
			try {
				setTimeout(() => {
					this.show1 = true;
					setTimeout(() => {
						this.show = true;
						setTimeout(() => {
							this.hidden = true;
							setTimeout(() => {
								this.$emit('del', this.info.id);
							}, 200);
						}, 5000);
					}, 200);
				}, 100);

			} catch (err) {

			}
		},
		methods: {

		},
	}
</script>

<style>
	.gift-one-line {

		padding: 0 20rpx 0 0;
		/* 	transition: transform 0.36s; */
		transition-property: transform, height, opacity;
		transform: translateX(-100%) translateY(0rpx);
		transition-duration: 0.36s;
		height: 0px;
		opacity: 0;
	}

	.gift-one-line-show {
		transform: translateX(20rpx) translateY(0rpx);
		opacity: 1;

	}

	.gift-one-line-show-1 {
		height: 160rpx;
		/* background-color: blue; */
	}

	.gift-one-line-hidden {
		transform: translateX(20rpx) translateY(-20rpx);
		opacity: 0;
	}

	.gift-one-line-2 {
		position: absolute;
		top: 38rpx;
		left: 0;
		height: 44rpx;
		background-image: linear-gradient(to right, rgba(92, 199, 255, 0.39), rgba(92, 199, 255, 0));
		border-radius: 22rpx;
		flex-direction: row;
		padding: 0 20rpx;
	}

	.no-ios {
		top: 29rpx;
	}
</style>
