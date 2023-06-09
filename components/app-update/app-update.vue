<template>
	<view style="position: relative;z-index: 999999;">
		<view class="update-box" @touchmove.stop.prevent="clear" v-if="show">
			<!-- <view style="width: 500rpx;background-color: #FFFFFF;border-radius: 26rpx;">
				<view class="flex flex-x-y" style="margin-top: 70rpx;">
					<image src="../../static/images/update.png" style="width: 160rpx;height: 160rpx;" mode=""></image>
				</view>

				<view class="center color-666666 fs-30 mt-30">{{remark || 'App有新版本,需要更新'}}</view>

				<view class="flex flex-x-y" style="padding:100rpx 100rpx 80rpx 100rpx;">
					<view hover-class="click" hover-start-time="2" @click="to_update" class="flex flex-x-y"
						style="width: 672rpx;height: 88rpx;border-radius: 44rpx;background: linear-gradient(0deg,#fc8800, #ffb330 100%);color: #fff;font-size: 36rpx;">
						更新
					</view>
				</view>
			</view> -->
			<view style="padding:0 30rpx;" class="update-image pr">
				<view
					
					class="flex flex-y flex-x-y">
					<view class="color-333333 fs-34 bold" style="margin-top: 40rpx;">版本更新</view>
					<view class="mt-10 fs-28 color-666666" style="margin-top: 40rpx;">{{remark || '升级后使用更顺畅，是否进行更新版本'}}</view>
				</view>

				<view
					style="z-index: 4;width: 240rpx;height: 88rpx;position: absolute;bottom: 40rpx;left: 50%;transform: translateX(-50%);"
					class="flex flex-x-y">
					<view @click="to_update" class="fs-36 color-ffffff bg-all flex flex-x-y" style="width: 300rpx;height: 88rpx;border-radius: 44rpx;">立即升级</view>
				</view>
			</view>
		</view>

		<!-- 停服通知 -->
		<view class="update-box" @touchmove.stop.prevent="clear" v-else-if="CONFIG.IS_STOP_TAKING !== undefined && CONFIG.IS_STOP_TAKING != '1'">
			<view class="stop-server-box">
				<view class="flex flex-x-y mt-30 fs-30">停服公告</view>
				<view class="stop-server-content">
					{{CONFIG.SERVICE_BULLETIN    || ''}}
				</view>
			</view>
		</view>
		<!-- 停服通知 -->

	</view>
</template>

<script>
	let {
		version
	} = require('../../version');
	export default {
		name: "app-update",
		data() {
			return {
				width: '0',
				show: false,
				src: '', //下载地址
				remark: '', //更新描述
			};
		},
		created() {
			// #ifdef H5
			// 如果是H5 就不校验更新
			return;
			// #endif
			this.checkUpdate();
			// setTimeout(() => {
			// 	//监测停服
			// 	this.check_stop();
			// }, 500);
		},
		methods: {
			checkUpdate() {
				if (getApp().globalData.updated) {
					if (getApp().globalData.update_href) {
						this.show = true;
						this.src = getApp().globalData.update_href || '';
						this.remark = getApp().globalData.remark || '';
					}

				} else {
					this.get_src();
				}
			},
			get_src() {
				let phoneType = uni.getSystemInfoSync().platform;
				// let phoneType = 'an';

				this.request({
					url: phoneType == 'ios' ? '/edition/getEdition' : '/edition/getEdition',
					data:{
						type:phoneType == 'ios'?2:1,
					},
				}).then(res => {
					getApp().globalData.updated = true;
					console.log('vvvvvvvvvvvvvv',res);
					if (res.data && res.data.verionNo && res.data.url) {
						console.log('需要更新');
						if (version != res.data.verionNo) {
							//版本号不一样 更新
							getApp().globalData.update_href = res.data.url || '';
							getApp().globalData.remark = res.data.remark || '';
							this.src = res.data.url || '';
							this.remark = res.data.remark;
							this.show = true;
						}
					}
					console.log('检查版本中');


				});



			},
			to_update() {
				// #ifdef H5
				// window.location.reload();
				// #endif

				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == 'ios') {
					//苹果
					let appUrl = getApp().globalData.update_href; // XXXX为对应的AppID
					console.log('appUrl', appUrl)
					plus.runtime.openURL(appUrl);

				} else {
					//安卓
					let appUrl = getApp().globalData.update_href; // XXXX为对应的AppID
					plus.runtime.openURL(appUrl);
				}
				// #endif
			},
			check_stop() {
				// if (this.CONFIG.IS_STOP_TAKING !== undefined && this.CONFIG.IS_STOP_TAKING == 0) {
					
				// }
			},

		},
	}
</script>

<style>
	.update-box {
		position: fixed;
		z-index: 99999;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.7);
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.update-image {
		width: 454rpx;
		height: 524rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
	}

	.stop-server-box {
		width: 500rpx;
		height: 700rpx;
		background-color: rgba(255, 255, 255, 1);
		border-radius: 24rpx;

	}

	.stop-server-content {
		padding: 30rpx;
		white-space: pre-line;
		height: 620rpx;
		overflow-y: scroll;
		font-size: 28rpx;
		color: #666666;
		text-align: justify;
		line-height: 44rpx;
	}
</style>
