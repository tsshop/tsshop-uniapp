<template>
	<view class="">
		<custom fixed="fixed" background="#ffffff" mode="2" title="直播商品" :titleBold="false"></custom>
		<view class="tab fixed" :style="{top:customBar}">
			<qq-tabs :list="tabs" :mode="2" @change="changeTab"></qq-tabs>
		</view>

		<view class="" style="padding:20rpx;">
			<search :radius="10" v-model="keyword" placeholder="搜索产品"></search>
			<view class="" v-for="(item,index) in filterList()" :key="index" v-if="index<show_index">
				<goods-list-item @editGoods="editOneGoods(item)" :editHandel="true" @changeCheck="goodsChange"
					:goods="item" :mode="mode"></goods-list-item>
			</view>
		</view>

		<qq-footer :show="true" :list="filterList()"></qq-footer>

		<fixed-bottom height="168rpx">
			<view class="bottom-box" style="padding:30rpx;">
				<view class="flex flex-x-b flex-y-center">
					<view class="flex">
						<view class="flex flex-y-center mr-30" @tap.stop="changeCheck">
							<view v-if="check" class="current flex flex-x-y" style="border-color:#F46656;">
								<view class="current-item"></view>
							</view>
							<view v-else class="current"></view>
							<view class="ml-20 fs-30">全选</view>
						</view>
						<view class="fs-30" style="color:#F46656;">已选：{{getCheckNumber}}</view>
					</view>
					<!-- <view class="fs-28 sj-btn flex flex-x-y" v-if="active === 1">确认上架</view> -->
					<view class="flex" @tap.stop="chooseGoods">
						<!-- <view class="mr-20 xj-btn flex flex-x-y">下架</view> -->
						<view class="xj-btn flex flex-x-y" style="background:#F8791A;">完成</view>
					</view>
				</view>
			</view>
		</fixed-bottom>


	</view>
</template>

<script>
	export default {
		name: 'TsshopUniappGoodsList',

		data() {
			return {
				customBar: getApp().globalData.customBar + 'px',
				tabs: [{
						name: '全部商品'
					},
					{
						name: '已选择'
					}
				],
				active: 0,
				check: false,
				defaultGoods: {
					img: "https://bcfiles.oss-cn-hangzhou.aliyuncs.com/beicheng/1651907092948.jpg",
					text: '新鲜土鸡蛋30枚正宗特产农家散养 柴草鸡蛋谷物蛋月子蛋塘...',
					price: '58.88',
					check: true
				},
				mode: 2,
				list: [], //商品列表
				checkedIdArr: [], //已选商品
				show_index: 10,
				keyword: '',


				oldSkulistObj: {}, //上一个页面的sku对象

			};
		},
		computed: {
			getCheckNumber() {
				return this.list.filter(val => val.check).length;
			},
		},
		onReachBottom() {
			this.show_index += 10;
		},
		onLoad() {

			if (getApp().globalData.checkedIdArr) {
				this.checkedIdArr = this.clone(getApp().globalData.checkedIdArr);
				getApp().globalData.checkedIdArr = null;
			}
			if (getApp().globalData.oldSkulistObj) {
				this.oldSkulistObj = this.clone(getApp().globalData.oldSkulistObj);
				getApp().globalData.oldSkulistObj = null;
			}

			this.getList();
			uni.$off('editLiveGoodsSuccess');
			uni.$on('editLiveGoodsSuccess', this.editLiveGoodsSuccess);




		},

		methods: {
			filterList() {
				if (this.active == 0) {
					return this.list.filter(val => {
						return !this.keyword || val.name.indexOf(this.keyword) > -1;
					});
				}
				if (this.active == 1) {
					return this.list.filter(val => {
						return val.check && (!this.keyword || val.name.indexOf(this.keyword) > -1);
					});
				}
			},
			changeTab(index) {
				this.active = index
				this.mode = 2;
				this.show_index = 10;
			},
			goodsChange(row) {
				this.list.forEach(val => {
					if (val.id == row.id) {
						val.check = row.check;
						if (val.check == false) {
							console.log('删除旧SKU')
							delete this.oldSkulistObj[val.id];
							this.list = this.filterArr(this.list);
						}
					}
				})
			},
			changeCheck() {
				if (this.list.length == this.list.filter(val => val.check).length) {
					this.check = false;
					this.list = this.list.map(val => {
						val.check = false;
						return val;
					});
					this.oldSkulistObj = {};
				} else {
					this.check = true;
					this.list = this.list.map(val => {
						val.check = true;
						return val;
					});
				}


			},
			getList() {
				this.request({
					url: '/liveStoreGoods/list',
					method: 'post',
					data: {
						pageNumber: 1,
						pageSize: 100
					}
				}).then(res => {
					if (res.status != 200) return;
					let arr = res.data.list || [];
					arr = this.filterArr(arr);
					arr.forEach(val => {
						if (this.checkedIdArr.includes(val.id)) {
							val.check = true;
							return;
						}
						val.check = false;
					});
					this.list = res.data.list;

					this.is_null = true;

				});
			},

			//使用 最低价格
			filterArr(arr) {
				arr.forEach(item => {
					if (this.oldSkulistObj[item.id]) {
						let skuList = this.oldSkulistObj[item.id].sort((v1, v2) => {
							return v1.price > v2.price ? 1 : -1;
						});
						item.price = skuList[0].price;
						item.scribingPrice = skuList[0].oriPrice;
						//有旧的sku 
					} else {
						let skuList = item.liveStoreGoodsSkus.sort((v1, v2) => {
							return v1.price > v2.price ? 1 : -1;
						});
						item.price = skuList[0].price;
						item.scribingPrice = skuList[0].oriPrice;
					}
				});


				return arr;
			},
			// 编辑商品
			editOneGoods(item) {
				let detail = this.clone(item);

				getApp().globalData.toEditLiveGoods = {
					...detail,
					liveStoreGoodsSkus: this.oldSkulistObj[item.id] ? this.oldSkulistObj[item.id] : detail
						.liveStoreGoodsSkus,
				};

				console.log(getApp().globalData.toEditLiveGoods)
				this.click(() => {
					this.toPage('/pages/liveStore/editGoodsLive');
				});
			},
			// 编辑商品成功
			editLiveGoodsSuccess(goods) {
				if (this.oldSkulistObj[goods.id]) {
					this.oldSkulistObj[goods.id] = goods.liveStoreGoodsSkus;
				} else {
					this.list.forEach(val => {
						if (val.id == goods.id) {
							val.liveStoreGoodsSkus = goods.liveStoreGoodsSkus;
						}
					});
					this.list = this.filterArr(this.list);
				}
			},
			// 完成
			chooseGoods() {
				let arr = this.list.filter(val => val.check).map(val => {
					if (this.oldSkulistObj[val.id]) {
						val.liveStoreGoodsSkus = this.oldSkulistObj[val.id];
					}
					return val;
				})
				uni.$emit('chooseLiveGoods', arr);
				this.uniBack();
			},

		},
	};
</script>

<style lang="scss">
	page {
		background-color: $livePage;
	}

	.tab {
		background-color: #fff;
		padding: 0 150rpx;
	}

	.bottom-box {
		background-color: #fff;
		height: 168rpx;
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

	.sj-btn {
		width: 200rpx;
		height: 74rpx;
		background: #F8791A;
		border-radius: 15rpx;
		color: #fff;
	}

	.xj-btn {
		width: 140rpx;
		height: 74rpx;
		background: #F46656;
		border-radius: 15rpx;
		color: #fff;
	}
</style>