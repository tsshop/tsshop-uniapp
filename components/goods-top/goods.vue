<template>
	<view class="flex">
		<view v-for="(item, index) in list" style="margin-left: 24rpx;" :key="index">
			<view>
				<image style="width: 140rpx;height: 140rpx;border-radius: 10rpx;margin-top: 28rpx;background:#f4f4f4;"
					:src="item.src" mode="aspectFill"></image>
			</view>

			<view class="flex flex-y flex-x-y">
				<view class="goods-top-p1">
					<text style="text-decoration: line-through;">¥{{item.price}}</text>
				</view>
				<view class="goods-top-p2">
					<text>¥{{item.offer}}</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: "goods-item",
		data() {
			return {

			};
		},
		props: {
			list: {
				type: Array,
				default: []
			}
		},
		// mounted() {
		// 	this.get_seckill()
		// },
		// methods: {
		// 	get_seckill() {
		// 		this.request({
		// 			url:'/seckill/getHome'
		// 		}).then(res => {
		// 			if(res.status != 200) return
		// 			this.list = res.data.goods.slice(0, 2)
		// 		})
		// 	}
		// }

	}
</script>

<style lang="scss">
	.goods-top-p1 {
		font-size: 22rpx;
		color: #808080;
		line-height: 26rpx;
		margin-top: 10rpx;
	}

	.goods-top-p2 {
		height: 36rpx;
		border-radius: 18rpx;
		padding: 0 14rpx;
		background: linear-gradient(270deg, #FF5F52 0%, #FFA600 100%);
		color: #FFFFFF;
		font-size: 26rpx;
		line-height: 36rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 8rpx;
	}
</style>