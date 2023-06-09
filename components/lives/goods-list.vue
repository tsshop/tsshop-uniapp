<template>
	<view>
		<uni-popup ref="goods" type="bottom">
			<view
				style="height: 708rpx;background-color: #191621;border-top-left-radius:30rpx;border-top-right-radius :30rpx;">
				<view
					style="flex-direction: row;justify-content: space-between;padding: 20rpx 0rpx 10rpx 20rpx;align-items: center;">
					<text class="fs-34" style="color:#FBCE2B;">{{userType != 'anchor'?'购物袋':'上架商品'}}</text>
					<view @tap="close" style="width: 68rpx;height: 68rpx;padding:20rpx;">
						<image src="@/static/lives/close.png" style="width: 28rpx;height: 28rpx;"></image>
					</view>
				</view>



				<scroll-view class="scroll-box" :scroll-y="true">

					<!-- 列表 -->
					<view>
						<view class="goods-box" v-for="(item,index) in goodsList" :key="item.id">
							<view class="goods-box-image">
								<qq-image
									imageStyle="width: 156rpx;height: 156rpx;border-radius: 6rpx;background-color:#f4f4f4;"
									:url="getGoodsImage(item.headPortrait)"></qq-image>
							</view>
							<view class="flex-1"
								style="justify-content: space-between;flex:1;margin-left: 20rpx;margin-right: 40rpx;">
								<view style="flex:1;" @tap.stop="toDetail(item)">
									<text class="fs-26 over-line2"
										style="color:#FFFFFF;line-height: 38rpx;lines:2;text-overflow:ellipsis;">
										{{item.name}}
									</text>
								</view>
								<view class="flex flex-x-b flex-y-center"
									style="flex-direction: row;justify-content: space-between;">
									<view style="flex-direction: row;align-items: flex-end;">
										<text class="fs-30" style="color:#FBCE2B;">
											￥{{item.price}}
										</text>
										<text class="fs-28" v-if="item.scribingPrice>0"
											style="color:#999999;text-decoration: line-through;margin-left: 26rpx;">
											￥{{item.scribingPrice}}
										</text>
									</view>
									<view style="height:44rpx;">
										<!-- 购买 -->
										<view class="goods-btn-1" v-if="status == 2" @tap.stop="toDetail(item)">
											<text class="fs-26 color-ffffff">购买</text>
										</view>
										<!-- 购买 -->
										<!-- 讲解中 -->
										<view class="goods-btn-2" v-if="status == 1" @tap.stop="toExplainGoods(item)"
											:style="item.explainStatus != 2?'height:0;overflow:hidden;':'height:44rpx;'">
											<text class="fs-26 color-ffffff">
												讲解中
											</text>
										</view>



										<!-- 讲解中 -->
										<!-- 讲解产品 -->
										<view v-if="status == 1" @tap.stop="toExplainGoods(item)" class="goods-btn-1"
											:style="item.explainStatus == 2?'height:0;overflow:hidden;':'height:44rpx;'">
											<text class="fs-26 color-ffffff">讲解商品</text>
										</view>
										<!-- 讲解产品 -->
									</view>

								</view>

							</view>
						</view>
					</view>
					<!-- 列表 -->

					<safeArea></safeArea>
				</scroll-view>


			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		explainGoods
	} from '@/pages/live/api/live.js';
	export default {
		name: 'goods-list',
		props: {
			userType: {
				type: [String, Number],
				default: 'anchor',
			},
			status: {
				type: [String, Number],
				default: 2
			},
			roomId: {
				type: [String, Number],
				default: ''
			},
			liveId: {
				type: [String, Number],
				default: '',
			}
		},
		data() {
			return {

				goodsList: [],
			}
		},
		mounted() {
			uni.$off('showLivesGoods');
			uni.$on('showLivesGoods', () => {
				this.open();
			});
			uni.$off('takeGoodsLiveHandel');
			uni.$on('takeGoodsLiveHandel', this.takeGoodsLiveHandel);
			// this.open();
		},
		methods: {
			getGoodsImage(str) {
				return String(str).split(',')[0];
			},
			open() {
				this.$refs.goods.open();
			},
			close() {
				this.$refs.goods.close();
			},
			toExplainGoods(item) {
				explainGoods(item.id, this.roomId).then(res => {
					if (res.status != 200) return;
					let arr = this.goodsList.map(val => {
						if (val.id == item.id) {
							val.explainStatus = 2;
						} else {
							val.explainStatus = 1;
						}
						return val;
					});
					this.goodsList = JSON.parse(JSON.stringify(arr));
				})
			},
			takeGoodsLiveHandel(data) {
				if (data.roomId != this.roomId) return;
				let arr = this.goodsList.filter(val => val.id == data.goods.id);
				if (arr.length == 0) return;
				uni.$emit('talkGoods', arr[0]);
			},
			toDetail(item) {
				uni.navigateTo({
					url: `/pages/goods/goods?id=${item.id}&liveId=${this.liveId}`,
				})
			}
		}
	}
</script>

<style scoped>
	.search-box {
		flex-direction: row;
		align-items: center;
		flex: 1;
		margin-left: 34rpx;
		height: 62rpx;
		border-radius: 10rpx;
		background-color: #312C3D;
		margin-right: 20rpx;
		padding: 0 20rpx;
	}

	.search-user-input {
		color: #FFFFFF;
		font-size: 24rpx;
		flex: 1;
		height: 60rpx;
		padding-left: 20rpx;
	}

	.scroll-box {
		height: 604rpx;
		padding: 20rpx 0rpx 0rpx 40rpx;
	}

	.goods-box {
		height: 156rpx;
		flex-direction: row;
		position: relative;
		margin-bottom: 40rpx;
	}

	.goods-box-image {
		width: 156rpx;
		height: 156rpx;
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





	.goods-btn-1 {
		height: 44rpx;
		border-radius: 30rpx;
		background-color: #F8791A;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		padding: 0 14rpx;
		transition: opacity 0.3s;
	}

	.goods-btn-2 {
		height: 44rpx;
		border-radius: 30rpx;
		background-color: #312C3D;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		padding: 0 14rpx;
		transition: opacity 0.3s;
	}

	.goods-btn-1:active {
		opacity: 0.8;
	}

	.goods-btn-2:active {
		opacity: 0.8;
	}
</style>