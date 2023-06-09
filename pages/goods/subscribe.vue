<template>
	<view>
		<custom title="我的订阅" fixed="fixed" background="#F5F6F7"></custom>

		<view class="flex">
			<view class="flex-1 ml-20 mr-20 mt-10 color-323232 fs-28">


				<!-- 订阅列表 -->
				<view class="fs-32 bold">品牌</view>
				<view>
					<view class="p-20 mt-20 bg-FFFFFF br-10" v-for="(item,index) in 50" :key="index">
						<view class="flex">
							<image src="" mode="aspectFill" class="shop-image"></image>
							<view class="flex-1">
								<view class="flex  pl-20">
									<view class="flex-1  fs-32" style="line-height: 36rpx;">
										<view class="over-line1" style="max-width: 440rpx;">阿迪打死阿迪打死阿迪打死阿迪打死阿迪打死阿迪打死
										</view>
									</view>

									<view class="fs-28 mr-10">进店</view>
									<qq-icon icon="icon-jinru" color="#646464" size="24rpx"></qq-icon>
								</view>
								<view class="fs-26 color-646464 mt-10 pl-20">近7天上新15件</view>
							</view>

						</view>

						<view class="flex" style="padding-left: 128rpx;">
							<view class="flex">
								<view v-for="(item,index) in 3" :key="index">
									<image src="" mode="aspectFill" class="shop-image-2"></image>
								</view>
							</view>
						</view>


					</view>
				</view>
				<!-- 订阅列表 -->

			</view>
		</view>





		<qq-footer :show="is_null" :list="list"></qq-footer>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				statusbar: getApp().globalData.statusBar + 'px',
				tabs_list: [
					// {
					// 	name: '全部'
					// },
					// {
					// 	name: '全部'
					// },
					// {
					// 	name: '全部'
					// },
					// {
					// 	name: '全部'
					// },
					// {
					// 	name: '全部'
					// },
					// {
					// 	name: '全部'
					// },
					// {
					// 	name: '全部'
					// },
					// {
					// 	name: '全部'
					// },
					// {
					// 	name: '全部'
					// }
				],
				tab_index: 0,
				list: [],
				page: 1,
				is_null: false,
			};
		},
		mounted() {


		},
		created() {


		},
		onShow() {


		},
		computed: {
			get_left() {
				if (this.tab_index > 3) {
					return 35 * this.tab_index;
				}
				return 0;
			},
		},
		onLoad() {


			// this.init();


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
				this.tab_index = index;
				this.init();
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
					page: page,
				};
				if (this.tab_index > -1 && this.tabs_list.length > 0) {
					data.goodsType = this.tabs_list[this.tab_index].id || ''
				}
				this.request({
					url: '',
					data,
					loading: page == 1,
				}).then(res => {
					if (!this.rsuccess(res)) return;


					if (res.data) {
						res.data.content.forEach(val => {
							if (val.headPortrait) {
								val.headPortrait = val.headPortrait.split(',')[0]
							}
						})
					}

					this.list = this.list.concat(res.data || []);

					if (res.data?.length == 0) {
						this.is_null = true;
					} else {
						this.page++;
					}

				});
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-color: $pageColor;
	}

	.shop-image {
		width: 108rpx;
		height: 108rpx;
		background: #FFFFFF;
		box-shadow: 0px 2rpx 8rpx 0px rgba(117, 117, 117, 0.18);
		border-radius: 10rpx;
	}

	.shop-image-2 {
		width: 140rpx;
		height: 140rpx;
		border-radius: 10rpx;
		background-color: #f4f4f4;
		margin-right: 20rpx;
		margin-top: 20rpx;
	}
</style>
