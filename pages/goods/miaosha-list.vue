<template>
	<view>
		<custom fixed="fixed" height="0" background="#FF5959" title=" " backColor="#FFFFFF">
			<view slot="center">
				<image src="../../static/tsshop/miaosha.png" style="width: 192rpx;height: 48rpx;"></image>
			</view>
		</custom>
		<view style="background-color: #FF5959;z-index: 2;">
			<view :style="{height:customBar}"></view>
			<view style="height: 36rpx;"></view>
		</view>

		<view class="pl-20 pr-20 pr" style="z-index: 3;">
			<!-- 时间列表 -->
			<view class="flex flex-y-center bg-FFFFFF" index
				style="height: 116rpx;border-radius: 20rpx 20rpx 0px 0rpx;margin-top: -20rpx;">
				<view @tap.stop="select(index)" v-for="(item,index) in timeList" :key="index"
					class="flex-1 flex flex-y flex-x-y fs-28 color-646464" style="line-height: 40rpx;"
					:class="index==current?'miaosha-active':''">
					<view>{{item.time}}:00</view>
					<view class="bold">{{item.start}}</view>
				</view>
			</view>
			<!-- 时间列表 -->


			<!-- 商品列表 -->
			<view>
				<view v-for="(item,index) in list" :key="index">
					<view class="bg-FFFFFF p-20 mt-20 flex" style="border-radius: 20rpx;">
						<image :src="item.src" mode="aspectFill"
							style="width: 200rpx;height: 200rpx;background-color: #f4f4f4;border-radius: 20rpx;">
						</image>

						<view class="flex-1 pl-20 hidden">
							<view class="fs-30 color-323232 over-line1">
								{{item.name}}
							</view>
							<!-- 进度 -->
							<view class="flex flex-y-center fs-26 color-all mt-20" style="height: 30rpx;">
								<view class="flex-1 ms-p-box">
									<image src="../../static/tsshop/proess.png" class="rate-img"
										:style="{left:item.rate+'%'}">
									</image>
								</view>
								<view class="ml-10" style="white-space: nowrap;width: 120rpx;">
									已抢{{item.rate}}%
								</view>
							</view>
							<!-- 进度 -->
							<view class="flex flex-y-center" style="margin-top: 50rpx;height: 56rpx;">
								<price :price="item.offer"></price>
								<view
									style="color:#C0C0C0;vertical-align: bottom;text-decoration: line-through;margin-left: 26rpx;"
									class="fs-24">
									¥{{item.price}}
								</view>
								<view class="flex-1 flex flex-x-end">
									<view class="bg-all color-ffffff fs-28 flex flex-x-y" @tap="to_buy(item)"
										style="height: 56rpx;width: 132rpx;border-radius: 28rpx;">
										去抢购
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 商品列表 -->
			<qq-footer :show="is_null" :list="list"></qq-footer>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				customBar: getApp().globalData.customBar + 'px',
				page: 1,
				is_null: false,
				list: [],
				timeList: [],
				current: 0
			};
		},
		onLoad() {
			this.get_time()
			
		},
		methods: {
			init() {
				this.setData({
					list: [],
					page: 1,
					is_null: false
				})
				this.get_list()
			},
			get_time() {
				this.request({
					url: '/seckill/getTimeList'
				}).then(res => {
					if (res.status != 200) return
					res.time = res.time.split(" ")[1].split(":")[0]
					console.log(res.time, 'time')
					let arr = []
					res.data.forEach(val => {
						arr.push({
							time:val,
							start: val > res.time?'未开始':'进行中'
						})
					})
					console.log(arr, 'arr')
					this.timeList = arr
					console.log(this.timeList, 'now')
					this.get_list(this.page)

				})
			},
			get_list(page = 1) {
				this.request({
					url: '/seckill/getGoods',
					method: 'POST',
					data: {
						pageNumber: page,
						pageSize: 10,
						time: this.timeList[this.current].time || 0
					}
				}).then(res => {
					if (res.status != 200) return
					res.data.list.forEach(val => {
						val.rate = Math.floor(val.quantity / (val.quantity + val.stock)* 100) 
					})
					this.list = res.data.list
					if (res.data?.list.length == 0) {
						this.is_null = true;
					} else {
						this.page++;
					}
				})
			},
			select(index) {
				this.current = index
				this.init(this.page)
			},
			to_buy(item) {
				this.toPage('/pages/goods/goods?id=' + item.goodsId);
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $pageColor;
	}

	.miaosha-active {
		color: $color !important;
	}

	.ms-p-box {
		height: 20rpx;
		border-radius: 10rpx;
		background-color: #FFECDE;
		position: relative;
		overflow: hidden;
	}

	.rate-img {
		width: 100%;
		height: 20rpx;
		position: absolute;
		top: 0;
		transform: translateX(-100%);
		transition: all 0.3s;
	}
</style>
