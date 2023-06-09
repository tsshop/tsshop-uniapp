<template>
	<view>
		<custom fixed="fixed" background="#F5F6F7" mode="2" title="评价中心" :titleBold="false"></custom>
		<view class="flex flex-x-y" style="background-color: #F5F6F7;">
			<view class="" style="width: 50%;">
				<tabs @change="changeTable" :list="tabList" :index="type"></tabs>
			</view>
		</view>
		<view class="order">
			<view class="order-item " v-for="(item, index) in list" :key="index">
				<view class="shop flex flex-y-center">
					<image src="../../static/tsshop/shangdian.png" mode=""></image>
					<view class="color-333333 fs-32 over-line1">
						TSSHOP
					</view>
				</view>
				<view class="flex  mt-20">
					<view class="" style="width: 132rpx;height: 132rpx;border-radius: 10rpx;overflow: hidden;">
						<image class="br-5"
							style="width: 132rpx;height: 132rpx; margin-right:34rpx ;background-color: #f4f4f4;border-radius: 10rpx;"
							:src="item.src" mode="aspectFill"></image>
					</view>

					<view style="line-height: 36rpx;width: 400rpx;" class="over-line2 m-20">

						<view class="over-line1">
							{{item.goodsName}}
						</view>
						<view class="color-808080 over-line1 mt-20" v-if="type==2">
							{{item.goodsType}}
						</view>
						<view class="flex mt-20" v-if="type==1">
							<view class="">
								评分
							</view>
							<view class="flex ml-20">
								<stars :disabled="true" :value="item.score - 1"></stars>
							</view>

						</view>
					</view>
					<view v-if="type==2" class="flex"
						style="flex-direction: column;justify-content: space-around;">
						<view class="nowrap" style="text-align: right;">
							￥{{item.price}}
						</view>
						<view class="nowrap color-808080 fs-24" style="text-align: right;">
							共{{item.number}}件
						</view>
					</view>

				</view>
				<view class="mt-20 color-323232 fs-28" v-if="type==1">
					{{item.review}}
				</view>
				<view class="mt-20 flex flex-x-end">
					<!-- <view class="order-btn" v-if="type==1" @tap.stop="toPage('/pages/evaluate/post-comments','',true)">追评</view> -->
					<view v-if="type==0" class="order-btn" @tap.stop="toPage('/pages/evaluate/post-comments?id='+item.orderId)">评价</view>
				</view>
			</view>
		</view>
		<qq-footer :show="is_null" :list="list"></qq-footer>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: [{
						name: '待评价',
						id: '1'
					},
					{
						name: '已评价',
						id: '2'
					}
				],
				is_null:false,
				type:0,
				list: [],
				page:1
			};
		},
		onLoad(e) {
			if(e.type) {
				this.type = e.type
			}
			this.init() 
		},
		onshow() {
			this.init()
		},
		methods: {
			init() {
				this.setData({
					page: 1,
					list: [],
					is_null: false,
				})
				this.get_list();
			},
			get_list(page = 1) {
				this.request({
					url:'/goodsReview/getUserReviewList',
					method:'POST',
					data:{
						pageNumber:page,
						pageSize:10,
						type:this.type
					},
					loading: page ==1
				}).then(res => {
					if(res.status != 200) return
					this.list = res.data.list
					if(this.list.length == 0) this.is_null = true
					this.list.forEach(val => {
						val.src = val.src.split(',')[0]
					})
					if (res.data?.length == 0) {
						this.is_null = true;
					} else {
						this.page++;
					}
				})
			},
			changeTable(index) {
				this.type = index
				this.init()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F5F6F7;
	}

	.order {
		padding:0 20rpx;

		.order-item {
			padding: 20rpx;
			margin-top: 20rpx;
			background-color: #fff;
			border-radius: 10rpx;

			.shop {
				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 20rpx;
				}

				view {
					width: 80%;
				}
			}

			.order-btn {
				margin-left: 26rpx;
				height: 68rpx;
				border-radius: 34rpx;
				padding: 0 36rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				color: #FF882F;
				border: 1rpx solid #FF882F;
			}

		}
	}
</style>
