<template>
	<view>
		<custom title="商城直播" fixed="fixed"></custom>

		<view :style="{top:customBar}" class="fixed bg-FFFFFF flex flex-x-y">
			<view style="width: 500rpx;">
				<qq-tabs @change="tab_change" height="80rpx" :list="tabs_list"></qq-tabs>
			</view>
		</view>

		<view style="padding: 0 20rpx;">
			<view class="flex flex-wrap flex-x-b">

				<view @tap.stop="openLives(item)" v-for="(item,index) in list" :key="index" class="lives-item">
					<view class="live-item-box">
						<image mode="aspectFill" :src="item.url">
						</image>
						<view class="lives-status" v-if="tab_index == 0">直播中</view>
						<view class="lives-status" v-else>即将开始</view>
						<view class="lives-bar">
							<view class="over-line1 flex-1">{{item.userName}}</view>
							<view class="ml-20 flex flex-x-y" v-if="tab_index == 0">
								<view class="iconfont icon-yanjing fs-26"></view>
								<view>{{item.personNum}}</view>
							</view>
							<view class="ml-20 flex flex-x-y" v-else>
								<view>{{item.time}}开播</view>
							</view>
						</view>
					</view>
					<view class="color-333333 fs-26 over-line1" style="padding: 20rpx;line-height: 28rpx;">
						<view class="fs-28 over-line1">{{item.title}}</view>
						<view class="fs-24 color-999999 mt-10 over-line1">{{item.describes}}</view>
					</view>
				</view>


			</view>
		</view>

		<uni-popup type="center" ref="lives">
			<view class="bg-FFFFFF br-20 hidden" style="width: 488rpx;border-radius: 20rpx;">
				<view class="flex flex-y flex-x-y fs-30 color-333333" style="line-height: 48rpx;margin-top:40rpx;">
					<view>直播暂未开始，敬请期待</view>
					<view>开播时间 {{startTime}}</view>
				</view>
				<view class="flex flex-x-y">
					<view @tap.stop="closeLives" class="lives-btn">确定</view>
				</view>
			</view>
		</uni-popup>


		<qq-footer :show="is_null" :list="list"></qq-footer>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				statusbar: getApp().globalData.statusBar + 'px',
				customBar: getApp().globalData.customBar + 'px',
				tabs_list: [{
						name: '直播中',
						id: 2,
					},
					{
						name: '即将开播',
						id: 1,
					},
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
				startTime: '',
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
			openLives(item) {
				if (this.tab_index == 0 || item.reckonTime < new Date(item.reckonTime).getTime()) {

					this.toPage(
						`/pages/live/live?remoteUserId=${item.userId}&status=${item.userId == this.user_info.id?1:2}&liveId=${item.id}`,'',true
					)
					return;
				}
				this.startTime = item.time2;
				this.$refs.lives.open();

			},
			closeLives() {
				this.$refs.lives.close();
			},
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
					data.status = this.tabs_list[this.tab_index].id || ''
				}
				this.request({
					url: '/live/onLiveList',
					data,
					loading: page == 1,
				}).then(res => {
					if (!this.rsuccess(res)) return;

					console.log('lives-list', res);
					let list = res.data?.records || [];
					if (this.tab_index == 1) {
						list.forEach(val => {
							val.time = this.dateFormat('HH:MM', new Date(val.reckonTime));
							val.time2 = this.dateFormat('YYYY-mm-dd HH:MM', new Date(val.reckonTime));
						});
					}
					this.list = this.list.concat(list);

					if (res.data?.records?.length == 0) {
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

	.lives-item {
		width: 49%;
		margin-top: 20rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
	}

	.live-item-box {
		width: 100%;
		height: 386rpx;
		border-radius: 12rpx;
		overflow: hidden;
		position: relative;

		image {
			width: 100%;
			height: 100%;
		}

		.lives-status {
			font-size: 24rpx;
			color: #ffffff;
			background-color: rgba(4, 4, 4, 0.57);
			border-radius: 20rpx;
			height: 36rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 16rpx;
			position: absolute;
			left: 20rpx;
			top: 20rpx;
		}

		.lives-bar {
			width: 100%;
			font-size: 24rpx;
			color: #ffffff;
			background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.02));
			display: flex;
			align-items: center;
			padding: 40rpx 20rpx 10rpx 20rpx;
			position: absolute;
			left: 0;
			bottom: 0;
		}

	}

	.lives-btn {
		font-size: 28rpx;
		color: #FFFFFF;
		width: 367rpx;
		height: 70rpx;
		border-radius: 10rpx;
		background-color: $bgColor;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 70rpx;
		margin-bottom: 40rpx;
	}
</style>