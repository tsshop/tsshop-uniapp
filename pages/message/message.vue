<template>
	<view>
		<custom fixed="fixed" background="#F5F6F7" mode="2" title="消息" :titleBold="false"></custom>
		<view class="p-20">
			<view class="msg flex flex-x-y" v-for="(item, index) in list" :key="index">
				<view class="msg-time">
					10月10日 15:21
				</view>
				<view class="mt-20 msg-content">
					<view class="flex flex-x-b">
						<view class="fs-32 color-323232">
							订单已发货
						</view>
						<view class="flex flex-y-center">
							<view class="dot mr-10"></view>
							<view class="iconfont icon-jinru " style="color: #c0c0c0;"></view>
						</view>
					</view>
					<view class="line"></view>
					<view class="mt-20 color-808080 over-line2">
						您的订单：0123456789，已从深圳市电子科技工业园生产厂家发货已从深圳市电子科技工业园生产厂家发货已从深圳市电子科技工业园生产厂家发货
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[1, 2]
			};
		},
		onLoad() {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F5F6F7;
	}

	.msg {
		flex-direction: column;
		border-radius: 10rpx;
		margin-bottom: 40rpx;
		.msg-time {
			background-color: #fff;
			display: inline-block;
			color: #646464;
			padding: 0 10rpx;
			border-radius: 4rpx;

		}

		.msg-content {
			display: block;
			background-color: #fff;
			padding: 20rpx;
		}

		.line {
			width: 100%;
			height: 2rpx;
			margin-top: 20rpx;
			background-color: #EFEFEF;
		}
		.dot {
			width: 12rpx;
			height: 12rpx;
			border-radius: 50%;
			background-color: $color;
		}
	}
</style>
