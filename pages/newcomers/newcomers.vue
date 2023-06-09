<template>
	<view>

		<view class="fixed" style="background-color: #fff;">
			<view class="pr" style="z-index: 10;">
				<custom mode="2" background="rgba(0,0,0,0)" title="新人专享"></custom>
			</view>



			<view
				style="position: absolute;top:0;left:0;width: 50%;height: 100%;background-color: #F88E4C;opacity: 0.1;filter: blur(50rpx);">
			</view>
			<view
				style="position: absolute;top:0;right:0;width: 50%;height: 100%;background-color: #F1557B;opacity: 0.1;filter: blur(50rpx);">
			</view>
			

			<!-- 一级分类 -->
			<!-- <scroll-view :scroll-left="get_left" :scroll-with-animation="true" :scroll-x="true"
				v-if="tabs_list.length>0" class="bg-FFFFFF no-scroll w-688"
				style="overflow-x:scroll;margin-left: 40rpx;">
				<tabs ref="tabs" @change="tab_change" :index="tabs_index" :scroll="true" :list="tabs_list"></tabs>
			</scroll-view> -->
			<!-- 一级分类 -->


			<view class="flex flex-x-y px-20">
				<search placeholder="家用双开门电冰箱" v-model="keyword" @search="search"></search>
			</view>
			<view class="" style="height: 20rpx;">
			
			</view>
		</view>

		<!-- 筛选 -->
		<view class="screen">
			
			<screen @change="change" @quantityRange="quantityRange"></screen>
		</view>
		<!-- 筛选 -->






		<view class="flex">
			<view class="ml-20 mr-20 flex-1">
				<list :list="list" :mode="list_type"></list>
			</view>
		</view>

		<qq-footer :show="is_null" :list="list"></qq-footer>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs_list: [],
				list: [],
				page: 1,
				is_null: false,
				keyword: '',
				tabs_index: 0,
				list_type: 1,
				sort: 0,
				sortType: 1,
				typeId: '',
				priceMin: 0,
				priceMax: 0,


			}
		},
		computed: {
			get_left() {
				if (this.tabs_index > 3) {
					return 35 * this.tabs_index;
				}
				return 0;
			},
		},
		onLoad(e) {
			if (e.index) {
				this.tabs_index = Number(e.index);
			}
			if (e.keyword) {
				this.keyword = e.keyword;
			}
			if (e.typeId) {
				this.typeId = e.typeId;
			}
			if (e.goodsType) {
				//商品二级分类
				this.goodsType = e.goodsType;
			}
			this.tabs_list = uni.getStorageSync('sort') || [];
			this.get_sort();
			this.init();

		},
		onReachBottom() {
			this.get_list(this.page);
		},
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 200);
			this.init();
		},


		methods: {
			tab_change(index) {
				this.tabs_index = index;
				this.init();
			},
			search() {
				// this.click(() => {

				// 	this.$refs.tabs.tab_index = 0;
				// 	this.tabs_index = 0;
				// 	console.log(this.keyword, 'keyword1')
				// 	this.init();
				// 	console.log(this.keyword, 'keyword2')

				// });
				let arr = uni.getStorageSync('search_records') || []
				arr.unshift(this.keyword)
				uni.setStorageSync('search_records', this.clone(arr))
				this.init();
			},
			get_sort() {
				this.request({
					url: "/goods/getType",
				}).then(res => {
					if (res.status == 200) {
						this.tabs_list = res.data || this.tabs_list;

					}
				});
			},
			get_type() {
				if (this.tabs_list.length > 0 && this.tabs_index > -1) {
					if (this.tabs_index <= this.tabs_list.length) {
						return this.tabs_list[this.tabs_index].id;
					}
				}
				return '';
			},
			init() {
				this.setData({
					page: 1,
					list: [],
					is_null: false,
				})
				this.get_list();

			},
			get_list(page = 1) {
				let data = {
					pageNumber: page,
					pageSize: 10,
					keyword: this.keyword || '',
					sort: this.sort,
					sortType: this.sortType,
					priceMin: this.priceMin,
					priceMax: this.priceMax,
					typeId: this.typeId || this.goodsType || '',
				};

				this.request({
					url: '/goods/getList',
					data,
					method: 'POST',
					loading: page == 1,
				}).then(res => {
					this.first_request = false;
					if (res.status == 200) {

						if (res.data?.list) {
							res.data.list.forEach(val => {
								if (val.headPortrait) {
									val.headPortrait = val.headPortrait.split(',')[0]
								}
							})
						}

						this.list = this.list.concat(res.data?.list || []);

						if (res.data?.list?.length == 0) {
							this.is_null = true;
						} else {
							this.page++;
						}
					}
				});
			},
			change(data) {
				let check = data.filter(val => val.checked === true)
				console.log(check[0].key, 'check')
				this.sortType = check[0].key == 'xiangliang' ? 0 : 1
				if (data.length > 1) {
					this.sort = data[1].checked
				}
				this.init()

			},
			quantityRange(data) {
				this.priceMin = data[0]
				this.priceMax = data[1]
				this.sortType = 1 //按价格排序
				this.init()

			}
		},

	}
</script>

<style>
	page {
		background-color: #F5F6F7;
	}

	.px-20 {
		padding-left: 20rpx;
		padding-right: 20rpx;
	}

	.screen {
		background-color: #fff;
	}
</style>
