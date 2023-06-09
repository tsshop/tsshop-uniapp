<template>
	<view>
		<view :style="{height:statusbar}"></view>

		<view class="plr-20 flex  flex-y-center" style="margin-top: 4px;">
			<view class="flex-1">
				<search @search="search"  placeholder="家用双开门电冰箱" :disabled="true"></search>
			</view>
			<!-- 公告 -->
			<!-- <view style="">
				<view @tap.stop="toPage('/pages/message/message')" class="iconfont icon-xiaoxi color-all fs-40 ml-24"></view>
			</view> -->
			<!-- 公告 -->
		</view>


		<!-- 轮播 -->
		<view class="plr-20 mt-30">
			<index-banber  ref="indexbanner"></index-banber>
		</view>
		<!-- 轮播 -->


		<!-- 分类 -->
		<view class="plr-20 mt-30">
			<cats></cats>
		</view>
		<!-- 分类 -->


		<!-- 限时活动，新人 -->
		<view class="plr-20 mt-30">
			<goods-top ref="goodsTop"></goods-top>
		</view>
		<!-- 限时活动，新人 -->


		<!-- 商品列表 -->
		<view class="plr-20 mt-20">
			<list :list="list"></list>
		</view>


		<qq-footer top="40rpx" :show="is_null" :list="list"></qq-footer>
		<!-- 商品列表 -->
		
		<common></common>
		<fixed-line></fixed-line>


	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				statusbar: getApp().globalData.statusBar + 0 + 'px',
				is_null: false,
				list: [

				],
				page:1,
			}
		},
		computed: {

		},
		onShow() {


		},
		// async onLoad() {

		// 	let arr = [];

		// 	for (let i = 0; i < 10; i++) {

		// 		arr.push({
		// 			headPortrait: 'https://img2.baidu.com/it/u=1655437323,2230558862&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800',
		// 			price: '1999.33',
		// 			purchaseQuantity: '800',
		// 			name:Math.random()>0.5?'石头扫拖机器人系列全自动家用扫地拖地机器':'石头扫拖机器人系列'
		// 		});
		// 	}
		// 	setTimeout(() => {
		// 		this.list = arr;
		// 	}, 400);

		// },
		onLoad() {
			this.get_list()
		},
		onUnload() {

		},
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 200)
			this.init();
			
			this.$refs.goodsTop.refresh();
			this.$refs.indexbanner.refresh();
		},
		onReachBottom() {
			this.get_list(this.page);
		},
		methods: {
			search() {
				this.toPage('/pages/search-before/search-before', '', true);
			},
			// get_list() {
			// 	this.request({
			// 		url:'/goods/getList',
			// 		method:'POST',


			// 	}).then(res => {
			// 		if(!res.status == 200) return

			// 	})
			// },
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
					pageSize:10,

				};
				this.request({
					url: '/goods/getList',
					data,
					method:'POST',
					loading: false ,
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

						if (res.data?.list?.length < 10) {
							this.is_null = true;
						} else {
							this.page++;
						}
					}
				});
			},
			
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $pageColor;
	}
</style>
