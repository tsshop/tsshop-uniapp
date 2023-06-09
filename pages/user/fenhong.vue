<template>
	<view>
		<custom title="分红中心" mode="2" titleColor="#FFFFFF" fixed="fixed" backColor="#FFFFFF" background="#171819">
		</custom>


		<view style="padding:0rpx 32rpx 0 32rpx;">
			<view @tap="toPage('/pages/user/fenhong-detail?id='+item.id)" v-for="(item,index) in list" :key="index"
				style="margin-top: 22rpx;padding-bottom: 32rpx;padding-top: 26rpx;padding-left: 36rpx;padding-right: 36rpx;border-radius: 8rpx;background-color: #2D2E30;"
				class="">



				<view class="flex flex-y-center flex-x-b">
					<view class="color-ffffff fs-28">{{item.name}}</view>
					<view class="flex flex-x-y fs-26" style="color: rgba(255,255,255,0.65);">
						<view>每日收益明细</view>
						<view class="iconfont icon-jinru" style="width: 20rpx;"></view>
					</view>



				</view>
				<view class="flex flex-y-center" style="justify-content: space-between;margin-top: 26rpx;">
					<view class="flex flex-y flex-x-y fs-32">
						<view class="fs-38" style="color: #2F95FD;line-height:38rpx;height:38rpx;margin-bottom:4rpx;">￥{{item.money}}</view>
						<view style="margin-top: 2rpx;font-size: 24rpx;color: rgba(255,255,255,0.85);">已兑换</view>
					</view>

					<view class="flex flex-y flex-x-y fs-32">
						<view class="fs-38" style="color: #FFB028;line-height:38rpx;height:38rpx;margin-bottom:4rpx;">￥{{item.allMoney}}</view>
						<view style="margin-top: 2rpx;font-size: 24rpx;color: rgba(255,255,255,0.85);">收益</view>
					</view>

					<view class="flex  flex-y flex-x-center fs-32 flex-y-end">
						<view class="fs-28" style="color:#FFFFFF;line-height:38rpx;height:38rpx;margin-bottom:4rpx;">{{item.createTime}}</view>
						<view style="margin-top: 2rpx;font-size: 24rpx;color: rgba(255,255,255,0.85);">兑换时间</view>
					</view>
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

				list: [],
				page: 1,
				is_null: false,
				date: new Date().getMonth() + 1,
				number_in: '0',
				number_out: '0',
				statusbar: getApp().globalData.statusbar + 'px',
				customBar: getApp().globalData.customBar + 'px',
				tab_index: 0,
				tab_list: [{
					name: '全部',
					id: 0
				}, {
					name: '已发放',
					id: 2
				}, {
					name: '待发放',
					id: 1
				}],

				today: '0',
				total: '0',
				wait: '0',
				yesterday: '0',
			}
		},
		onLoad() {

			this.init();
			// this.get_info();

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
			change_index(index) {
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
				// this.get_info();
			},
			get_list(page = 1) {
				this.request({
					// url: '/wjuser/shellDetail',
					url: '/wjuser/bcIStore/storeUserList',
					data: {
						page: page,
						// date: this.date
						// status: this.tab_list[this.tab_index].id, ///代发 2 已发 0 全部
					},
					loading: page == 1,
				}).then(res => {

					if (res.status == 200) {
						this.list = this.list.concat(res.data.content || []);
						
						if (res.data.content.length == 0) {
							this.is_null = true;
						} else {
							this.page++;
						}
					}
				});
			},


		},

	}
</script>

<style lang="scss">
	page {
		background-color: #171819;
	}




	.shell-item {
		width: 33.33%;

	}

	.shell-list-item {
		height: 130rpx;
		display: flex;
		flex-flow: column nowrap;
		border-bottom: 0.5px solid rgba(255, 255, 255, 0.2);
		justify-content: center;
		align-items: center;

		&>view {
			width: 100%;
		}
	}
</style>
