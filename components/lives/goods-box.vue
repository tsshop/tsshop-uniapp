<template>
	<view class="goods-box-parents" :style="{height:goods?'170rpx':'0px'}">
		<view class="goods-box" v-if="goods" @tap.stop="toDetail">
			<view class="goods-box-image">
				<qq-image imageStyle="width: 132rpx;height: 132rpx;border-radius: 6rpx;background-color:#f4f4f4;"
					:url="getGoodsImage(goods.headPortrait)"></qq-image>
			</view>
			<view class="flex-1" style="justify-content: space-between;flex:1;margin-left: 20rpx;">
				<view style="width: 340rpx;">
					<text class="fs-26 over-line2"
						style="color:#191621;line-height: 38rpx;lines:2;text-overflow:ellipsis;">
						{{goods.name}}
					</text>
				</view>
				<view class="flex flex-x-b flex-y-center"
					style="flex-direction: row;justify-content: space-between;padding-right: 20rpx;">
					<view>
						<text class="fs-30" style="color:#F46656;">
							￥{{getMinPrice}}
						</text>
					</view>
					<view style="margin-right:12rpx">
						<image src="../../static/lives/cart.png" style="width: 32rpx;height: 32rpx;" mode="aspectFill">
						</image>
					</view>
				</view>
				<!-- 关闭按钮 -->
				<view class="goods-box-close" @tap.stop="close">

					<image src="@/static/lives/close.png" class="goods-box-close-image"></image>
				</view>
				<!-- 关闭按钮 -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'goods-box',
		props: {
			liveId: {
				type: [String, Number],
				default: '',
			}
		},
		computed: {
			getMinPrice() {
				if (!this.goods) return 0;
				if (this.goods.goodsSkuList) {
					let arr = this.goods.goodsSkuList.sort((v1, v2) => v1.price > v2.price ? 1 : -1);
					return arr[0].price;
				}
				return 0;
			}
		},
		created() {
			uni.$off('talkGoods');
			uni.$on('talkGoods', this.talkGoods);
		},
		data() {
			return {
				goods: null,
			}
		},
		methods: {
			getGoodsImage(str){
				return String(str).split(',')[0];
			},
			talkGoods(goods) {
				this.goods = goods;
			},
			close() {
				this.goods = null;
			},
			toDetail() {
				uni.navigateTo({
					url: `/pages/goods/goods?id=${this.goods.id}&liveId=${this.liveId}`,
				})
			}
		}
	}
</script>

<style>
	.goods-box {
		width: 568rpx;
		height: 170rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		flex-direction: row;
		position: relative;
		padding: 20rpx 0 20rpx 20rpx;
	}

	.goods-box-image {
		width: 132rpx;
		height: 132rpx;
		border-radius: 6rpx;

	}

	.goods-box-close {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 10rpx;
		top: -4rpx;
		justify-content: center;
		align-items: center;
	}

	.goods-box-close-image {
		width: 24rpx;
		height: 24rpx;
	}

	.goods-box-parents {
		transition: height 0.3s;
		overflow: hidden;
	}
</style>