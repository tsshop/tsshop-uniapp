<template>
	<view>
		<!-- #ifdef H5 -->
		<view style="height: calc(100vh - 60px);" class="flex flex-y">
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<view style="height: 100vh;" class="flex flex-y">
		<!-- #endif -->
		
		
			<view :style="{height:statusbar}"></view>
			<view class="flex">
				<view class="mlr-20 flex-1 mt-20" style="margin-bottom: 18rpx;">
					<search v-model="keyword" @search="search" placeholder="家用双开门电冰箱"></search>
				</view>
			</view>
			<!-- 列表 -->
			<view class="flex-1 flex" style="height: 100%;overflow: hidden;">

				<!-- 左侧 -->
				<view>
					<scroll-view :scroll-y="true" style="width: 180rpx;height: 100%;background-color: #F5F6F7;">
						<view>
							<view @tap.stop="choose_index(index)" v-for="(item,index) in list" :key="index"
								class="cate-left-item over-line1" :class="active_index==index?'active':''">
								<view>{{item.name}}</view>
							</view>
						</view>
					</scroll-view>
				</view>
				<!-- 左侧 -->

				<!-- 右侧 -->
				<view class="flex-1" style="height: 100%;background-color: #FFFFFF;overflow: hidden;">
					<scroll-view :scroll-y="true" style="height:100%;background-color: #FFFFFF;overflow: hidden;">
						<view style="padding:0rpx 20rpx 20rpx 20rpx;" v-if="list[active_index] && list[active_index].banner">
							<image class="cate-right-banner" :src="list[active_index].banner" mode="aspectFill"></image>
						</view>
						<!-- 二级分类 -->
						<!-- <view class="pl-20" style="width: 100%;">
							<scroll-view :scroll-x="true" style="width: 100%;">
								<view style="white-space: nowrap;">
									<view v-for="(item,index) in list[active_index].node" :key="index" class="cate-item"
										:class="index==0?'active':''">
						
										{{item.name}}
									</view>
									
								</view>
							</scroll-view>
						
						</view> -->
						
						<view style="padding: 0 20rpx 20rpx 20rpx;" v-if="list[active_index] && list[active_index].node">
							<view>
								<!-- <view class="fs-28 color-323232 mt-20 bold">{{item.name}}</view> -->
								<view class="flex flex-wrap">
									<view @tap.stop="check_type(item1.id)" v-for="(item1,index1) in list[active_index].node" :key="index1"
										class="cate-items-item">
											<image style="width: 100rpx;height: 100rpx;" :src="item1.avatar" mode="aspectFill"></image>
											<view class="over-line1">{{item1.name}}</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					
					

					<!-- 二级分类 -->
				</view>
				<!-- 右侧 -->

			</view>
			<!-- 列表 -->

		</view>
		
		
		<common></common>
		<fixed-line></fixed-line>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusbar: getApp().globalData.statusBar + 0 + 'px',
				list: [

				],
				active_index: 1,
				keyword:'',
			};
		},
		onLoad(e) {
			this.get_list()
			console.log(e, 'e')
			if(e.index) {
				this.active_index = e.index
			}
		},
		methods: {
			choose_index(index) {
				this.active_index = index;
			},
			get_list() {
				this.request({
					url:'/goods/getType',
					
				}).then(res => {
					if(res.status != 200) return
					this.list = res.data
				}) 
			},
			search(){
				this.toPage(`/pages/search/search?keyword=${this.keyword}`,'',true);
			},
			check_type(id){
				this.toPage(`/pages/search/search?goodsType=${id}`,'',true);
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F5F6F7;
	}

	.cate-left-item {
		height: 86rpx;
		background-color: #F5F6F7;
		font-size: 28rpx;
		color: #323232;
		transition: all 0.2s;
		position: relative;
		display: flex;
		align-items: center;
		padding-left: 40rpx;
	}

	.cate-left-item.active {
		background-color: #FFFFFF;
		color: $color;

	}

	.cate-left-item::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 20rpx;
		width: 4rpx;
		height: 22rpx;
		border-radius: 2rpx;
		background-color: $bgColor;
		transform: translate(0, -50%);
	}

	.cate-right-banner {
		width: 100%;
		height: 204rpx;
		border-radius: 20rpx;
	}

	.cate-item {

		margin-right: 20rpx;
		height: 48rpx;
		display: inline-block;
		color: #646464;
		font-size: 26rpx;
		line-height: 36rpx;
		padding: 0 16rpx;
		line-height: 48rpx;
		transition: all 0.3s;
		border-radius: 24rpx;
		background-color: #EEEEEE;
	}

	.cate-item.active {
		background: linear-gradient(270deg, #FF5F52 0%, #FFA600 100%);
		color: #FFFFFF;
	}

	.cate-items-item {
		width: 33.3%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 30rpx;
		&>image {
			width: 118rpx;
			height: 118rpx;
			border-radius: 20rpx;
		}

		&>view {
			font-size: 24rpx;
			line-height: 34rpx;
			margin-top: 10rpx;
			color: #323232;
		}
	}
</style>
