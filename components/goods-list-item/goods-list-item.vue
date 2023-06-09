<template>
	<view class="goods-item flex flex-x-b mt-20">
		<view class="mr-30">
			<image :src="getImg(goods.headPortrait)"
				style="width:155rpx;height:155rpx;border-radius:20rpx;background-color: #f7f7f7;" mode="aspectFill"></image>
		</view>
		<view class="flex flex-x-b">
			<view class="flex-y flex-x-b" style="width:450rpx;">
				<view class="flex flex-x-b">
					<view class="ellipsis fs-28">{{ goods.name }}</view>
					<view class="ml-10" v-if="mode===2" @tap.stop="changeCheck(goods)">
						<view v-if="goods.check" class="current flex flex-x-y" style="border-color:#F46656;">
							<view class="current-item"></view>
						</view>
						<view v-else class="current"></view>
					</view>
				</view>
				<view class="flex flex-x-b flex-y-center">
					<view class="flex flex-y-center">
						<view class="fs-30 mr-20" style="color:#F46656;">￥{{ goods.price }}</view>
						<view class="fs-26 color-999999" v-if="[2,4].includes(mode)"
							style="text-decoration:line-through;">￥{{ goods.scribingPrice }}</view>
						<view class="fs-26 color-999999" v-if="[3].includes(mode)"
							style="text-decoration:line-through;">￥{{ goods.oriPrice }}</view>
					</view>
					<view v-if="[2,4].includes(mode)" class="goods-btn flex flex-x-y fs-26"
						@tap.stop="editGoods(goods)">编辑商品</view>
				</view>
				<view class="flex" v-if="mode===3">
					<!-- <view class="fs-26 color-999999" style="margin-right:60rpx;">库存:200</view> -->
					<view class="fs-26 color-999999">销量:{{ goods.salesVolume || 0 }}</view>
				</view>
			</view>
			<view class="flex flex-x-end flex-y-center flex-1" v-if="mode===1" @tap.stop="changeCheck(goods)">
				<view v-if="goods.check" class="current flex flex-x-y" style="border-color:#F46656;">
					<view class="current-item"></view>
				</view>
				<view v-else class="current"></view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: 'TsshopUniappGoodsListItem',

		data() {
			return {

			};
		},

		props: {
			goods: {
				type: Object,
				default: () => {}
			},
			mode: {
				type: Number,
				default: 1
			},
			editHandel: {
				type: Boolean,
				default: false,
			}
		},

		mounted() {

		},

		methods: {
			getImg(imgs) {
        	   return imgs?.split(',')[0] || ''
			}
        	,
			changeCheck(goods) {
				goods.check = !goods.check
				this.$emit('changeCheck', goods)
			},
			editGoods(item) {
				if (!this.editHandel) {
					this.toPage('/pages/liveStore/editGoods?goodsId=' + item.id)
				} else {
					this.$emit('editGoods', this.clone(item));
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.goods-item {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
	}

	.goods-btn {
		width: 137rpx;
		height: 43rpx;
		background: #F8791A;
		border-radius: 21rpx;
		color: #fff;
	}

	.current {
		width: 31rpx;
		height: 31rpx;
		border-radius: 50%;
		border: 1px solid #999999;

		.current-item {
			width: 20rpx;
			height: 20rpx;
			background-color: #F8791A;
			border-radius: 50%;
		}
	}
</style>