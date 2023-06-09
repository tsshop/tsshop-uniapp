<template>
	<view>
		<custom fixed="fixed" background="linear-gradient(180deg, #F3FFFD 0%, #FFFFFF 100%)">


			<view class="" slot="left">
				<view class="flex flex-y-center pl-10" style="width: 660rpx;padding-left: 30rpx;">
					<search @search="search" v-model="keyword" placeholder="血压仪"></search>
				</view>
			</view>

		</custom>


		<!-- 轮播 -->
		<view class="" v-if="banner.length>0">
			<vear-carousel :img-list="banner" @selected="selectedBanner"></vear-carousel>
		</view>
		<!-- 轮播 -->

		<view class="fs-32 pl-20" style="color:#3B4644;margin-top: 6rpx;">
			为你推荐
		</view>

		<view class="flex flex-wrap" style="padding:0 20rpx;">
			<view class="goods-list-item flex" v-for="(item,index) in list" :key="item.id"
				@tap.stop="toPage('/pages/goods/goods?id='+item.id)">
				<view class="flex-1 flex flex-y over-line1" style="color:#3B4644;">
					<view style="width: 100%;" class="over-line1 fs-28">
						{{item.name || ''}}
					</view>
					<!-- <view style="width: 100%;color:#646464;" class="over-line1 fs-24">
						{{item.detail || item.name}}
					</view> -->
					<view style="width: 100%;margin-top: 20rpx;" class="over-line1">
						<price :price="item.price"></price>
					</view>
				</view>
				<view style="width: 238rpx;height: 160rpx;margin-left: 40rpx;">
					<qq-image :url="item.headPortrait" imageStyle="width: 238rpx;height: 160rpx;border-radius: 10rpx;">
					</qq-image>
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
				keyword: '',
				banner: [],
				list: [],
				page: 1,
				is_null: false,
			}
		},
		onLoad() {
			this.init();
			this.get_banner();
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
			search(keyword) {
				console.log('key', keyword)
				this.keyword = keyword;
				this.click(() => {
					this.init();
				});
			},
			get_banner() {
				this.request({
					url: '/banner/getList',
					method: 'POST',
				}).then(res => {
					if (!this.rsuccess(res)) return;
					if (res.data.length == 1) {
						res.data[1] = res.data[0]
						res.data[2] = res.data[0]
					} else if (res.data.length == 2) {
						res.data[2] = res.data[0];
					}

					res.data.forEach(val => {
						val.url = val.imgUrl;
					})
					this.banner = res.data;
				});
			},
			selectedBanner(item) {
				if (!item.linkedUrl)
					return;
				if (item.linkedUrl.indexOf('/pages/') > -1) {
					this.toPage(item.linkedUrl);
					//app页面
				} else {
					if (String(item.linkedUrl).trim().length > 0) {
						this.toPage(`/pages/h5/h5?url=${item.linkedUrl}`);
					}

				}
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
					keyword: this.keyword,
				};

				this.request({
					url: '/goods/getList',
					data,
					loading: page == 1,
					method: 'POST',
				}).then(res => {
					if (!this.rsuccess(res)) return;

					if (res.data?.list) {
						res.data?.list.forEach(val => {
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

				});
			}
		},

	}
</script>

<style>
	page {
		background-color: #F2F6F5;
	}

	.door-swiper {
		width: 100%;
		height: 340rpx;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.door-swiper-item {
		height: 100%;
		border: 1rpx solid #000;

	}

	.door-swiper-item image {
		width: 100%;
		height: 100%;
	}

	.goods-list-item {
		height: 208rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		width: 100%;
		padding: 24rpx 20rpx;
		margin-top: 20rpx;
	}
</style>
