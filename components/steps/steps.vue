<template>
	<view class="whole">
		<view class="" v-for="(item, index) in list" :key="index" class="step" :class="index==0?'active':''">
			<view class="dot"></view>
			<view class="desc">
				{{item.desc}}
			</view>
			<view class="mt-10" style="width: 80%;">
				<view class="flex flex-x-start">
					{{item.time}}
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		name: "steps",
		data() {
			return {

			};
		},
		props: {
			list: {
				default: []
			}
		},
		mounted() {
			console.log(this.list, 'steplist')
		}
	}
</script>

<style lang="scss">
	.step {
		color: #808080;
		margin-top: 20rpx;
		margin-right: 80rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		position: relative;
		font-size: 24rpx;
	}
	.desc {
		width: 80%;
	}
	.step .dot {
		position: absolute;
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
		background-color: #D8D8D8;
		left:60rpx;
		top: 10rpx;
		z-index: 1;
	}
	.step::after {
		content: '';
		position: absolute;
		width: 0rpx;
		height: 100%;
		// background-color: red;
		border: 1rpx dashed #D8D8D8;
		left:71rpx;
		top: 24rpx;
	}
	.active {
		color: $color;
		.dot {
			background-color: $color;
		}
	}
</style>
