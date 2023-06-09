<template>
	<view class="">
		<custom fixed="fixed" background="#ffffff" mode="2" title="提现记录" :titleBold="false"></custom>
		<view class="" style="padding:30rpx">
			<view class="record-list">
				<view v-for="(item,index) in list" :key="index">


					<view class="list-item ">
						<view class="flex flex-x-b">
							<view class="flex-y flex-x-center flex-y-start">
								<view class="fs-30 blod" :style="{color:item.status ? '#FD7747' : '#000000'}">
									提现{{ item.status ? '失败' : '成功' }}</view>
								<view class="fs-26 color-999999 mt-10">{{ item.withdrawalsType }}提现</view>
								<view class="fs-26 color-999999">
									{{ dateFormat('YYYY-mm-dd HH:MM:SS',new Date(item.createTime)) }}
								</view>
							</view>
							<view class="flex-y flex-x-center">
								<view class="fs-38 blod" style="color:#FD7747;">￥{{ item.amt }}</view>
							</view>
						</view>
						<view v-if="item.failReason && item.status" class="fs-24 color-999999">
							失败原因：{{item.failReason}}
						</view>
					</view>

				</view>

			</view>
		</view>
		<qq-footer :show="is_null" :list="list"></qq-footer>
	</view>
</template>

<script>
	export default {
		name: 'TsshopUniappRecord',

		data() {
			return {
				list: [], //提现记录
				page: 1,
				is_null: false,
			};
		},

		onLoad() {
			this.getList()
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

		methods: {
			getList() {
				this.request({
					url: '/liveStoreWithdrawalsLog/list',
					method: 'post',
					data: {
						pageNumber: this.page,
						pageSize: 10
					}
				}).then(res => {
					if (res.status === 200) {
						this.list = [...this.list, ...res.data.list]
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
		background-color: #f6f6f6;
	}

	.tab {
		background-color: #fff;
		padding: 0 150rpx;
	}

	.record-list {
		width: 100%;
		background-color: #fff;
		border-radius: 30rpx;
	}

	.list-item {
		padding: 30rpx;
		border-bottom: 0.5px solid #efefef;

		&:nth-last-child(1) {
			border: 0
		}
	}
</style>