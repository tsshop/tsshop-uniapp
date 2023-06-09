<template>
	<view>
		<custom title="设置" mode="2" fixed="fixed" background="rgba(0,0,0,0)">
		</custom>


		<view class="pl-20" style="background-color: #FFFFFF;">

			<view @tap="toPage('/pages/user/userinfo')" class="setting-item flex  flex-y-center">
				<image :src="user_info.avatarUrl" mode="aspectFill"
					style="width: 108rpx;height: 108rpx;border-radius: 50%;background-color: #F5F6F7;"></image>
				<view class="fs-30 flex-1 ml-20 fs-32">{{user_info.name}}</view>
				<view class="iconfont icon-jinru  fs-30"></view>
			</view>

		</view>
		<view class="pl-20 mt-20" style="background-color: #FFFFFF;">




			<!-- <view @tap="toPage('/pages/user/password','',true)" class="setting-item flex flex-x-b flex-y-center">
				<view class="fs-30 ">设置密码</view>
				<view class="iconfont icon-jinru  fs-30"></view>
			</view> -->

			<view @tap="toPage('/pages/protocol/protocol','',true)" class="setting-item flex flex-x-b flex-y-center">
				<view class="fs-30 ">{{ protocal_info.serviceTitle }}</view>
				<view class="iconfont icon-jinru  fs-30" style="font-size:30rpx;"></view>
			</view>
			<view @tap="toPage('/pages/privacy/privacy','',true)" class="setting-item flex flex-x-b flex-y-center">
				<view class="fs-30 ">{{ protocal_info.privacyTitle }}</view>
				<view class="iconfont icon-jinru  fs-40" style="font-size:30rpx;"></view>
			</view>
			<!-- <view class="setting-item flex flex-x-b flex-y-center">
				<view class="fs-30 ">注册时间</view>
				<view class="fs-30  color-999999">2022.8.12</view>
			</view> -->
			<view class="setting-item flex flex-x-b flex-y-center">
				<view class="fs-30 ">版本号</view>
				<view class="fs-30  color-999999">{{envinfo.version}}</view>
			</view>
		</view>



		<fixed-bottom height="120rpx">
			<view style="height: 120rpx;" class="flex felx-x-y">
				<view @tap="logout" class="ml-20 mr-20 flex flex-x-y fs-32 color-323232"
					style="height: 80rpx;flex:1;background-color: #FFFFFF;border-radius: 40rpx;">退出登录</view>
			</view>
		</fixed-bottom>

		<toast ref="toast"></toast>
		<!-- <pay></pay> -->
	</view>
</template>

<script>
	let envinfo = require('../../version.js');
	export default {
		data() {
			return {
				envinfo: envinfo,
			}
		},
		methods: {
			logout() {

				this.$refs.toast.open({
					desc: '确定退出登录？',
					left: '我再想想',
					right: '退出',
					success: () => {
						this.less(() => {
							this.request({
								url: '/login/out',
								method:'POST',
							}).then(res => {

								// uni.$emit('logout');
								this.vuexSet('user_info', {}, true);
								this.vuexSet('user_list', [], true);
								this.vuexSet('checked_user', {}, true);
								uni.setStorageSync('ACCESS_TOKEN', '');
								uni.setStorage({
									'pay_order_id': ''
								})
								uni.redirectTo({
									url: '/pages/login/login'
								});
								if (getApp().globalData.CHAT && getApp().globalData.CHAT
									.CLOSE) {
									getApp().globalData.CHAT.CLOSE();
								}


							});
						})
					}
				});
				uni.setStorage({
					key: 'openid',
					data: '',
				})



			},
			choose_image() {
				uni.chooseImage({
					count: 1,
					success: res => {

						let {
							tempFilePaths = []
						} = res
						console.log('res', res);
						tempFilePaths.forEach(val => {

							// #ifdef APP-PLUS
							uni.compressImage({
								src: val,
								width: '200',
								success: img => {
									this.upload_image(img.tempFilePath);
									console.log('img.tempFilePath', img.tempFilePath);
								},
								fail: err => {
									console.log('err', err);

								}
							});
							// #endif

							// #ifdef H5
							this.upload_image(val);
							// #endif

						})


					}
				})
			},
			upload_image(url) {
				uni.showLoading({
					title: '上传图片中',
					mask: true,
				})
				let appUrl = '/api/common/uploadImages';

				appUrl = envinfo.root + appUrl;


				uni.uploadFile({
					url: appUrl,
					filePath: url,
					data: {
						photo: 'img',
						name: 'img'
					},
					name: 'img',
					header: {
						token: uni.getStorageSync('ACCESS_TOKEN'),
					},
					success: img_data => {
						uni.hideLoading();
						let data = JSON.parse(img_data.data);
						if (img_data.statusCode == 200 && img_data.errMsg == 'uploadFile:ok') {


							if (data.status == 200 && data.data && data.data.imgUrl) {



								this.request({
									url: '/wjuser/user',
									loading: true,
									data: {
										avatarUrl: data.data.imgUrl,
										id: this.user_info.id,
									},
									method: 'PUT',
									loading: true,
								}).then(res => {
									if (res.status == 200) {
										this.showToast('修改成功');

									}
								});






							} else {

							}

						} else {
							this.$refs.toast.open({
								desc: data?.msg || '请稍后重试'
							});
							// this.showToast(data.msg || '请稍后重试');

							if (data.status == 403 || data.status == 4006) {
								// this.toPage('/pages/login/login')
							}
						}

					},
					complete: (res) => {

					},
					fail: res => {
						this.$refs.toast.open({
							desc: data.msg || '请稍后重试'
						});
					}
				})

			},

		}
	}
</script>

<style lang="scss">
	page {
		background-color: $pageColor;
		color: #3B4644;
	}

	.setting-item {
		padding: 26rpx 0;
		background-color: #FFFFFF;
		padding-right: 20rpx;
		color: #323232;
		font-size: 28rpx;

		.iconfont {
			color: #C0C0C0;
		}
	}



	.setting-item {

		border-bottom: 1rpx solid #F5F6F7;
	}

	.abcd {


		height: 108rpx;
		background: #FFFFFF;


		color: #333;
	}
</style>
