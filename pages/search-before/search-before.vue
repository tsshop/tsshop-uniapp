<template>
	<view>
		<!-- 搜索前置页面 -->
		<!-- 搜索前置页面 -->

		<view class="fixed">
			<view class="pr" style="z-index: 10;">
				<custom mode="1" background="rgba(0,0,0,0)">
					<view slot="center" class="flex" style="width: 650rpx;">
						<view class="flex-1" style="margin-right: 20rpx;">

							<search placeholder="家用双开门电冰箱" v-model="keyword" @search="search"></search>
						</view>
					</view>
				</custom>

			</view>
			<view
				style="position: absolute;top:0;left:0;width: 50%;height: 100%;background-color: #F88E4C;opacity: 0.1;filter: blur(50rpx);">
			</view>
			<view
				style="position: absolute;top:0;right:0;width: 50%;height: 100%;background-color: #F1557B;opacity: 0.1;filter: blur(50rpx);">
			</view>
		</view>



		<!-- 历史搜索 -->
		<view v-if="history_list.length>0">
			<view class="pl-20 pr-20 flex flex-x-b flex-y-center mt-20">
				<view class="fs-32 color-323232">历史搜索</view>
				<view @tap.stop="deleteAll" class="iconfont icon-lajitong" style="font-size: 40rpx;"></view>
			</view>
			<view class="flex flex-wrap pl-20">
				<view v-for="(item,index) in history_list" :key="index" v-if="item" class="search-history-item over-line1 flex flex-y-center flex-x-b">
					{{item}}
				</view>
			</view>
		</view>
		<!-- 历史搜索 -->


		<!-- 热门搜索 -->
		<!-- <view v-if="history_list.length>0">
			<view class="pl-20 pr-20 flex flex-x-b flex-y-center mt-40">
				<view class="fs-32 color-323232">热门搜索</view>
				
			</view>
			<view class="flex flex-wrap pl-20">
				<view  v-for="(item,index) in hot_search_list_filter" :key="index" class="hot-history-item">
					<image :src="'../../static/search/'+(index+1)+'.png'"></image>
					<view>{{item}}</view>
				</view>
			</view>
		</view> -->
		<!-- 热门搜索 -->



		<view style="height: 40rpx;"></view>
		<toast ref="toast"></toast>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				history_list: [],
				// hot_search_list:[
				// 	'飘柔洗护香波 长效清洁 1000ml',
				// 	'飘柔洗护香波 长效清洁 1000ml',
				// 	'飘柔洗护香波 长效清洁 1000ml',
				// 	'飘柔洗护香波 长效清洁 1000ml',
				// 	'飘柔洗护香波 长效清洁 1000ml',
				// 	'飘柔洗护香波 长效清洁 1000ml',
				// 	'飘柔洗护香波 长效清洁 1000ml',
				// 	'飘柔洗护香波 长效清洁 1000ml',
				// 	'飘柔洗护香波 长效清洁 1000ml',
				// 	'飘柔洗护香波 长效清洁 1000ml',
				// 	'飘柔洗护香波 长效清洁 1000ml',
				// 	'飘柔洗护香波 长效清洁 1000ml',
				// 	'飘柔洗护香波 长效清洁 1000ml',
				// ],

			};
		},
		computed: {
			// history_list_filter(){
			// 	 return this.history_list.filter((val,index)=>index<20);


			// },
			// hot_search_list_filter(){
			// 	return this.hot_search_list.filter((val,index)=>index<10);
			// },
		},
		onLoad() {
			// let a = uni.getStorageSync('search_records')
			// console.log(a, 'uni.getStorageSync()')
			// this.history_list = uni.getStorageSync('search_records').splice(0, 20) || []
		},
		onShow() {
			let arr = uni.getStorageSync('search_records') || [];
			this.history_list = arr.splice(0, 20) || []
		},
		methods: {
			search() {
				if (!String(this.keyword).trim())  {
					this.showToast('请输入搜索内容')
					return
				}
				this.toPage(`/pages/search/search?keyword=${String(this.keyword).trim()}`, '', true);
				this.history_list.unshift(this.keyword)
				uni.setStorageSync('search_records', this.clone(this.history_list))
				let a = uni.getStorageSync('search_records')
			},
			deleteAll() {
				this.$refs.toast.open({
					title:'是否清空搜索记录',
					success: ()=> {
						uni.setStorageSync('search_records', [])
						this.history_list = []
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.search-history-item {
		padding: 0 20rpx 0 20rpx;
		height: 52rpx;
		max-width: 500rpx;
		border-radius: 26rpx;
		background-color: #F5F6F7;
		font-size: 24rpx;
		color: #636363;
		margin-right: 20rpx;
		margin-top: 20rpx;
		line-height: 52rpx;
	}

	.hot-history-item {
		padding-left: 6rpx;
		height: 52rpx;
		max-width: 650rpx;
		font-size: 28rpx;
		color: #323232;
		margin-right: 20rpx;
		margin-top: 20rpx;
		line-height: 52rpx;
		display: flex;
		align-items: center;

		image {
			width: 40rpx;
			height: 40rpx;
			margin-right: 18rpx;
		}
	}
</style>
