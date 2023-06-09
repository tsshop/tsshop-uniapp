<template>
	<view>
		<view class="lives-header">
			<!-- 左侧主播头像 -->
			<view style="flex:1;">
				<view class="header-left-box hidden">
					<qq-image imageStyle="border-radius:32rpx;width:61rpx;height:61rpx;margin-left:6rpx;"
						:url="info.userAvatarUrl" mode="aspectFill"></qq-image>
					<view style="flex:1;" class="hidden">
						<text class="fs-28 color-ffffff over-line1"
							style="margin-left: 14rpx;lines:1;text-overflow: ellipsis;">
							{{info.userName}}
						</text>
					</view>
				</view>
			</view>
			<!-- 左侧主播头像 -->

			<view style="flex-direction: row;">
				<qq-image v-for="(item,index) in filterUserList()" :key="index"
					imageStyle="border-radius:32rpx;width:61rpx;height:61rpx;margin-left:10rpx;" :url="item.avatarUrl"
					mode="aspectFill"></qq-image>
			</view>

			<view class="header-number" v-if="userList.length>0">
				<text class="fs-28 color-ffffff">{{userList.length}}人</text>
			</view>

			<!-- 退出 -->
			<view class="header-exit" @tap="close">
				<image v-if="status == 2" src="../../static/lives/exit.png"
					style="width: 30rpx;height: 30rpx;margin-left: 6rpx;"></image>
				<image v-else src="../../static/lives/end.png" style="width: 33rpx;height: 35rpx;"></image>
			</view>
			<!-- 退出 -->

		</view>
		<view style="flex-direction: row;" v-if="number>0 || info.praiseNum > 0">

			<view class="header-likes">
				<image src="../../static/lives/zan.png" style="width: 24rpx;height: 24rpx;"></image>
				<text class="fs-26 color-ffffff" style="margin-left: 16rpx;">{{number || info.praiseNum}}</text>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getRoomUser
	} from '@/pages/live/api/live.js';
	export default {
		name: 'lives-header',
		props: {
			perNum: {
				type: [String, Number],
				default: 0,
			},
			info: {
				type: Object,
				default: null
			},
			roomId: {
				type: [String, Number],
				default: '',
			},
			status: {
				type: [String, Number],
				default: '',
			}
		},
		data() {
			return {
				number: 0,
				userList: [], //房间里的人
			}
		},
		created() {
			uni.$off('live_like_change');
			uni.$off('live_room_user_change');
			uni.$on('live_like_change', (data) => {
				if (data.roomId != this.roomId) return;
				this.number = data.praiseNum;
			});
			uni.$on('live_room_user_change', this.live_room_user_change);
			
			this.getRoomUser();
		},
		methods: {
			close() {
				this.$emit('close');
			},
			filterUserList() {
				return this.userList.filter((val, index) => {
					return index < 3
				});
			},
			getRoomUser() {
				getRoomUser(this.roomId).then(res => {
					if (res.status != 200) return;
					if (!res.data) return;
					this.userList = Object.keys(res.data).map(key =>
						res.data[key]).filter(val => val.id != this.info.userId);
					uni.$emit('update_make_user_list', JSON.parse(JSON.stringify(this.userList)));
				})
			},
			live_room_user_change(data) {
				//data里没有房间号
				if (!data.userId) return;
				//主播自己
				if (data.userId == this.info.userId) return;
				this.userList = this.userList.filter(val => val.id != data.userId);
				if (data.type == 'add') {
					this.userList.push({
						id: data.userId,
						name: data.userName,
						avatarUrl: data.userAvatarUrl,
					});
				}
				uni.$emit('update_make_user_list', JSON.parse(JSON.stringify(this.userList)));
			},
		}
	}
</script>

<style>
	.lives-header {
		flex-direction: row;
		width: 750rpx;
		align-items: center;
		padding: 0 20rpx;
	}

	.header-left-box {
		flex-direction: row;
		height: 68rpx;
		width: 262rpx;
		border-radius: 34rpx;
		background-color: rgba(16, 16, 16, 0.7);
		flex: 1;
		align-items: center;
	}

	.header-number {
		height: 68rpx;
		background-color: rgba(16, 16, 16, 0.7);
		align-items: center;
		padding: 0 20rpx;
		border-radius: 34rpx;
		justify-content: center;
		margin-left: 10rpx;
	}

	.header-exit {
		height: 68rpx;
		background-color: rgba(16, 16, 16, 0.7);
		align-items: center;
		width: 68rpx;
		border-radius: 34rpx;
		justify-content: center;
		margin-left: 10rpx;
	}

	.header-likes {
		height: 48rpx;
		background-color: rgba(16, 16, 16, 0.7);
		align-items: center;
		border-radius: 34rpx;
		justify-content: center;
		padding-right: 30rpx;
		padding-left: 20rpx;
		margin-left: 20rpx;
		margin-top: 10rpx;
		flex-direction: row;
	}
</style>