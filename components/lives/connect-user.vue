<template>
	<view>
		<uni-popup ref="user" type="bottom">
			<view
				style="height: 708rpx;background-color: #191621;border-top-left-radius:30rpx;border-top-right-radius :30rpx;">
				<view
					style="flex-direction: row;justify-content: space-between;padding: 20rpx 0rpx 10rpx 20rpx;align-items: center;">
					<text class="fs-34" style="color:#FBCE2B;">连线观众</text>
					<view @tap="close" style="width: 68rpx;height: 68rpx;padding:20rpx;">
						<image src="@/static/lives/close.png" style="width: 28rpx;height: 28rpx;"></image>
					</view>
				</view>

				<view style="flex-direction: row;padding-left: 30rpx;align-items: center;">
					<text class="fs-28" @tap="change_tab(0)" :style="{color:tab_index == 0?'#FFFFFF':'#9A9A9A'}"
						style="padding-right: 50rpx;">现场观众</text>
					<text class="fs-28" @tap="change_tab(1)"
						:style="{color:tab_index == 1?'#FFFFFF':'#9A9A9A'}">申请连线观众</text>

					<view class="search-box">
						<image src="../../static/lives/search.png"
							style="width: 24rpx;height: 24rpx;transform: translateY(-2rpx);"></image>
						<input placeholder="搜索观众" type="text" v-model="keyword" class="search-user-input"
							placeholder-style="color:#ABABAB;" />
					</view>
				</view>


				<scroll-view class="scroll-box" :scroll-y="true" @scrolltolower="loadingLastPage">
					<!-- 列表 -->
					<view style="margin-bottom: 20rpx;">
						<view v-for="(item,index) in filterUserList()" :key="index" v-if="index<show_index"
							class="user-list-item">
							<image style="width: 80rpx;height: 80rpx;border-radius: 40rpx;" :src="item.avatarUrl"
								mode="aspectFill"></image>
							<text style="width: 300rpx;margin-left: 28rpx;text-overflow: ellipsis;lines:1;"
								class="fs-28 color-ffffff">
								{{item.name || item.userName}}
							</text>
							<view style="flex:1;flex-direction: row;justify-content: flex-end;">
								<template v-if="tab_index == 0">
									<view class="user-btn-1" @tap.stop="toMaikeUser(item)">
										<text class="fs-26 color-ffffff">连麦</text>
									</view>
								</template>
								<template v-if="tab_index == 1">
									
									<view class="user-btn-2" @tap.stop="rejectUser(item)">
										<text class="fs-26 color-ffffff">拒绝</text>
									</view>
									<view class="user-btn-1" @tap.stop="passUser(item)">
										<text class="fs-26 color-ffffff">接受</text>
									</view>
								</template>
							</view>
						</view>
					</view>
					<!-- 列表 -->

					<safeArea></safeArea>
				</scroll-view>


			</view>
		</uni-popup>
		<!-- 连麦 -->
		<view class="maike-box" v-if="maikeInfo">
			<qq-image :url="maikeInfo.userAvatarUrl"
				imageStyle="width:85rpx;height:85rpx;border-radius:44rpx;background-color:#f4f4f4;"></qq-image>
			<text
				style="width:106rpx;margin-top: 18rpx;line-height: 30rpx;text-overflow: ellipsis;lines:1;text-align: center;"
				class="fs-28 color-ffffff over-line1">
				{{maikeInfo.userName}}
			</text>
			<text style="margin-top: 10rpx;line-height: 30rpx;" class="fs-24 color-ffffff">通话{{getMikeTime()}}</text>
			<view @tap.stop="cancelMaike" class="guaduan-box">
				<text class="fs-26 color-ffffff">挂断</text>
			</view>
		</view>
		<!-- 连麦 -->

		<toast-nvue ref="toast"></toast-nvue>

	</view>
</template>

<script>
	import {
		getLinkList,
		createLink,
		openLink
	} from '@/pages/live/api/live.js';
	import {
		requestPermision
	} from '@/utils/permision.js';
	export default {
		name: 'connect-user',
		props: {
			roomId: {
				type: [String, Number],
				default: '',
			},
			liveId: {
				type: [String, Number],
				default: '',
			},
			status: {
				type: [String, Number],
				default: '',
			},
			info: {
				type: Object,
				default: null,
			},
		},
		data() {
			return {
				tab_index: 0,
				userList: [], //直播间观众
				apply_user_list: [], //申请连麦观众
				show_index: 10,
				keyword: '',
				maikeInfo: null,
				maikeTime: 0,
			}
		},
		mounted() {
			uni.$off('connectUser');
			uni.$off('update_make_user_list');
			uni.$off('requestLink');
			uni.$off('requestLinkChange');
			uni.$on('connectUser', () => {
				this.open();
			});
			uni.$on('update_make_user_list', this.update_make_user_list);
			uni.$on('requestLink', this.requestLink);
			uni.$on('requestLinkChange', this.requestLinkChange);
		},
		methods: {
			open() {
				this.$refs.user.open();
			},
			close() {
				this.$refs.user.close();
			},
			filterUserList() {
				if (this.tab_index == 0) {
					return this.userList.filter(val => {
						return !this.keyword || val.name.indexOf(val.name) > -1;
					});
				}
				return this.apply_user_list.filter(val => {
					return !this.keyword || val.name.indexOf(val.name) > -1;
				});
			},
			update_make_user_list(list) {
				if (this.userList.length === 0) {
					this.userList = list;
				} else {
					this.userList = list;
				}
			},
			change_tab(index) {
				this.tab_index = index;
				this.show_index = 10;
				if (this.tab_index == 1) {
					//获取连麦观众
					this.getMList();
				}
			},
			loadingLastPage() {
				this.show_index += 10;
			},
			cancelMaike() {
				this.$refs.toast.open({
					title: '',
					desc: '是否挂断连接',
					success: () => {
						openLink(this.maikeInfo.linkId, 3, this.liveId).then(res => {
							if (res.status != 200) return;
							this.maikeInfo = null;
							this.stopMaikeTime();
							this.getMList();
						});
					}
				});
			},
			//连麦观众
			toMaikeUser(item) {
				this.$refs.toast.open({
					title: '',
					desc: `是否与${item.name}申请连接`,
					success: () => {
						let user_info = uni.getStorageSync('user_info');
						let query = {
							liveId: this.liveId,
							userId: item.id,
							liveUserId: user_info.id,
							isFromUser: false,
						};
						console.log('query', query);
						createLink(query);
						this.showToast('已发送连麦申请');
					}
				});
			},
			//接受连接
			passUser(item) {
				this.$refs.toast.open({
					title: '',
					desc: `是否接受${item.userName}连接申请`,
					success: () => {
						openLink(item.id, 2, this.liveId).then(res => {
							this.getMList();
							this.showToast('等待对方接听');
						});
					}
				});
			},
			//拒绝连接
			rejectUser(item) {
				openLink(item.id, 4, this.liveId).then(res => {
					this.getMList();
				});
			},
			// 观众接听主播电话
			liveMaikeHandel() {
				this.$refs.toast.open({
					title: '',
					desc: `是否接受主播连接申请`,
					success: () => {

					}
				});
			},
			//接听电话
			requestLink(data) {
				if (data.liveId != this.liveId) return;
				if (this.status == 1) {
					//主播刷新列表
					this.getMList();
					return;
				}
				let user_info = uni.getStorageSync('user_info');
				if (this.status == 2 && data.status == 1) {
					//观众接电话
					this.$refs.toast.open({
						title: '',
						left: '拒绝',
						desc: `是否接受${'主播的'}连麦申请`,
						success: () => {
							let fn = () => {
								openLink(data.linkId, 2, this.liveId).then(res => {
									if (res.status != 200) return;
									this.$emit('openUserMaike');
								});
							};
							requestPermision(['android.permission.RECORD_AUDIO', 'record'], fn);
							//用户打开麦克风 2接收 3结束 4拒绝

						},
						fail: () => {
							openLink(data.linkId, 4, this.liveId);
						}
					});
				}
			},
			getMList() {
				getLinkList(this.liveId).then(res => {
					if (res.status != 200) return;
					console.log('连麦观众', res);
					let apply_user_list = res.data || [];
					apply_user_list.forEach(val => {
						val.avatarUrl = val.userAvatarUrl;
					});
					this.apply_user_list = apply_user_list;

					uni.$emit('changeMaikeNum', this.apply_user_list.length);
				});
			},
			requestLinkChange(data) {
				let user_info = uni.getStorageSync('user_info');
				if (data.liveId == this.liveId) {
					if (data.status == 2) {
						if (this.status == 1) {
							//主播
							this.maikeInfo = {
								userName: data.userName,
								liveId: data.liveId,
								linkId: data.linkId,
								userAvatarUrl: data.userAvatarUrl,
							}
							this.startMaikeTime();
						} else if (data.userId == user_info.id) {
							this.maikeInfo = {
								userName: '主播',
								liveId: data.liveId,
								linkId: data.linkId,
								userAvatarUrl: this.info.userAvatarUrl,
							}
							this.startMaikeTime();
						}

					} else {
						this.maikeInfo = null;
						this.stopMaikeTime();
					}
					this.$emit('requestLinkChange', data);
				}
			},
			startMaikeTime() {
				this.maikeTime = 0;
				this.maikeTimer = setInterval(() => {
					this.maikeTime++;
				}, 1000);
			},
			stopMaikeTime() {
				this.maikeTime = 0;
				clearInterval(this.maikeTimer);
			},
			getMikeTime() {
				let M = parseInt(this.maikeTime / 60).toString().padStart(2, '0');
				let S = parseInt(this.maikeTime % 60).toString().padStart(2, '0');
				return `${M}:${S}`;
			},
			showToast(title = "", duration = 2000, icon = "none") {
			
				// #ifdef APP-PLUS || APP-NVUE
				plus.nativeUI.toast(title);
				// #endif
			
				// #ifndef APP-PLUS || APP-NVUE
				uni.showToast({
					title,
					icon,
					duration
				})
				// #endif
			
			},
		}
	}
</script>

<style>
	.search-box {
		flex-direction: row;
		align-items: center;
		flex: 1;
		margin-left: 34rpx;
		height: 62rpx;
		border-radius: 10rpx;
		background-color: #312C3D;
		margin-right: 20rpx;
		padding: 0 20rpx;
	}

	.search-user-input {
		color: #FFFFFF;
		font-size: 24rpx;
		flex: 1;
		height: 60rpx;
		padding-left: 20rpx;
	}

	.scroll-box {
		height: 516rpx;
		border-top: 0.5px solid #585858;
		margin-top: 24rpx;
	}

	.user-list-item {
		flex-direction: row;
		align-items: center;
		margin-top: 20rpx;
		padding-left: 40rpx;
		padding-right: 20rpx;
	}

	.user-btn-1 {
		width: 105rpx;
		height: 51rpx;
		border-radius: 10rpx;
		background-color: #F8791A;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		margin-left: 20rpx;
	}

	.user-btn-2 {
		width: 105rpx;
		height: 51rpx;
		border-radius: 10rpx;
		background-color: #D14636;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}

	.maike-box {
		width: 204rpx;
		border-radius: 20rpx;
		position: fixed;
		bottom: 708rpx;
		right: 20rpx;
		background-color: #191621;
		height: 296rpx;
		align-items: center;
		justify-content: center;
	}

	.guaduan-box {
		width: 106rpx;
		height: 52rpx;
		border-radius: 10rpx;
		background-color: #D14636;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
		transition: opacity 0.3s;
	}

	.guaduan-box:active {
		opacity: 0.8;
	}
</style>