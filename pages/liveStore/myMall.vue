<template>
	<view class="">
		<custom fixed="fixed" background="#ffffff" mode="2" title="我的商城" :titleBold="false">
			<template #right>
				<view class="" style="position:relative">
					<view class="top-value fs-26 flex flex-x-end" @tap.stop="changeGoods">{{ topValue }}</view>
				</view>
			</template>
		</custom>
		<view class="" style="padding:20rpx;">
			<search :radius="10" placeholder="搜索产品" @search="onSearch"></search>
			<view class="" v-for="(item,index) in list" :key="index">
				<goods-list-item :goods="item" :mode="mode" @changeCheck="onChangeCheck"></goods-list-item>
			</view>
		</view>
		<qq-footer :show="is_null" :list="list"></qq-footer>
		<view class="" style="height:180rpx;"></view>
		<fixed-bottom>
			<view class="" v-if="mode === 4" style="padding:30rpx;background:#f4f6f8;">
				<view class="store-btn flex flex-x-y blod" @tap.stop="toPage('/pages/liveStore/addGoods','',true)">添加商品
				</view>
			</view>
			<view v-else class="bottom-box" style="padding:30rpx;">
				<view class="flex flex-x-b flex-y-center">
					<view class="flex">
						<!-- <view class="flex flex-y-center mr-30" @tap.stop="changeCheck">
                            <view v-if="check" class="current flex flex-x-y" style="border-color:#F46656;">
                                <view class="current-item"></view>
                            </view>
                            <view v-else class="current"></view>
                            <view class="ml-20 fs-30">全选</view>
                        </view> -->
						<view class="fs-30" style="color:#F46656;">已选：{{total}}</view>
					</view>
					<view class="mr-20 xj-btn flex flex-x-y" @tap.stop="onDel">删除</view>
				</view>
			</view>
		</fixed-bottom>
		<toast ref="toast"></toast>


	</view>
</template>

<script>
	export default {
		name: 'TsshopUniappGoodsList',

		data() {
			return {
				customBar: getApp().globalData.customBar + 'px',
				tabs: [{
						name: '已上架'
					},
					{
						name: '未上架'
					}
				],
				list: [], //商城列表
				page: 1,
				keyword: '',
				is_null: false,
				active: 0,
				check: false,
				mode: 4,
				topValue: '商品管理',
				currentIds: []
			};
		},

		onLoad() {
			this.getList()
			uni.$off('update_goods')
			uni.$on('update_goods', this.init)
			uni.$off('update_goods_price')
			uni.$on('update_goods_price', this.init)
		},

		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 200);
			this.init();
		},
		onReachBottom() {
			if (this.is_null) return
			this.getList();
		},
		computed: {
			total() {
				return this.currentIds.length
			}
		},
		methods: {
			// onEdit(row,id) {
			//     let currentGoods = this.list.find(item => item.id == id)
			//     currentGoods.price = row.price
			//     currentGoods.scribingPrice = row.oriPrice
			// },
			onDel() {
				if (this.currentIds.length === 0) return this.showToast('请选择要删除的商品')
				this.$refs.toast.open({
					desc: '确定删除商品？',
					left: '我再想想',
					right: '删除',
					success: () => {
						this.less(() => {
							this.request({
								url: '/liveStoreGoods/del',
								method: 'post',
								data: {
									goodsIds: this.currentIds
								}
							}).then(res => {
								if (res.status !== 200) return
								this.showToast('删除成功')
								this.list = this.list.filter(item => !this.currentIds.includes(
									item.id))
								this.currentIds = []
							});
						})
					}
				});
			},
			onChangeCheck(goods) {
				console.log('goods', goods);
				let check = goods.check
				if (check) {
					this.currentIds.push(goods.id)
				} else {
					this.currentIds = this.currentIds.filter(item => item !== goods.id)
				}
			},
			changeGoods() {
				if (this.mode === 4) {
					this.mode = 1
					this.topValue = '完成'
				} else {
					this.mode = 4
					this.topValue = '商品管理'
				}
			},
			changeTab(index) {
				this.active = index
				this.mode = [2, 1][index]
			},
			changeCheck() {
				this.check = !this.check
			},
			onSearch(keyword) {
				this.keyword = keyword
				this.init()
			},
			getList() {
			
				this.request({
					url: '/liveStoreGoods/list',
					method: 'post',
					data: {
						keyword: this.keyword,
						pageNumber: this.page,
						pageSize: 10
					}
				}).then(res => {
					if (res.status === 200) {
						let list = res.data.list.map(val => {
							let sku = val.liveStoreGoodsSkus.sort((v1, v2) => {
								return val.price > v2.price ? 1 : -1;
							});
							if (sku.length > 0) {
								val.price = sku[0].price;
								val.scribingPrice = sku[0].oriPrice;

							}
							return val;
						});
						list = list.map(item => {
							if (this.currentIds.includes(item.id)) {
								return {
									...item,
									check: true
								}
							} else {
								return {
									...item,
									check: false
								}
							}
						})
						this.list = [...this.list, ...list]
						if (res.data.list.length < 10) {
							this.is_null = true
						} else {
							this.page++
						}
					}
				});
			},
			init() {
				this.setData({
					list: [],
					page: 1,
					is_null: false
				})
				this.getList()
			},
		},
	};
</script>

<style lang="scss">
	page {
		background-color: $livePage;
	}

	.bottom-box {
		background-color: #fff;
		height: 168rpx;
	}

	.store-btn {
		width: 100%;
		height: 84rpx;
		background-color: #F8791A;
		color: #ffffff;
		border-radius: 15rpx;
		font-size: 28rpx;
	}

	.top-value {
		position: absolute;
		width: 140rpx;
		top: -20rpx;
		right: -40rpx;
		color: #F8791A;
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