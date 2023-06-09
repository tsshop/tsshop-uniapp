<template>
	<view>
		<custom title="个人信息" mode="2" fixed="fixed" background="rgba(0,0,0,0)">
		</custom>


		<view class="pl-20" style="background-color: #FFFFFF;">

			<view @tap="choose_image" class="setting-item flex  flex-y-center">
				<view class="flex-1 fs-28">头像</view>
				<image :src="user_info.avatarUrl" mode="aspectFill"
					style="width: 108rpx;height: 108rpx;border-radius: 50%;background-color: #F5F6F7;"></image>

				<view class="iconfont icon-jinru  fs-30 ml-10"></view>
			</view>

		</view>
		<view class="pl-20 mt-20" style="background-color: #FFFFFF;">


			<view @tap.stop="eidt_nickname" class="setting-item flex flex-x-b flex-y-center">
				<view class="fs-30 ">用户名</view>
				<view class="flex-1 flex flex-x-end color-999999">{{user_info.name}}</view>
				<view class="iconfont icon-jinru  fs-30"></view>
			</view>

			<view @tap.stop="eidt_sex" class="setting-item flex flex-x-b flex-y-center">
				<view class="fs-30 ">性别</view>
				<view class="flex-1 flex flex-x-end color-999999">{{user_info.gender == 0?'':user_info.gender==1?'男':'女'}}</view>
				<view class="iconfont icon-jinru  fs-30"></view>
			</view>

			<!-- <view  class="setting-item flex flex-x-b flex-y-center">
				<view class="fs-30 ">出生日期</view>
				<view class="flex-1 flex flex-x-end color-999999">2001年06月05日</view>
				<view class="iconfont icon-jinru  fs-30"></view>
			</view>
			 -->



			<view @tap.stop="toPage('/pages/user/password','',true)" class="setting-item flex flex-x-b flex-y-center">
				<view class="fs-30 ">设置密码</view>
				<view class="iconfont icon-jinru  fs-30"></view>
			</view>

			<view class="setting-item flex flex-x-b flex-y-center">
				<view class="fs-30 ">手机号</view>
				<view class="flex-1 flex flex-x-end color-999999">{{user_info.phone}}</view>
				<!-- <view class="iconfont icon-jinru  fs-30"></view> -->
			</view>


			<view class="setting-item flex flex-x-b flex-y-center" v-if="user_info.createTime">
				<view class="fs-30 ">注册时间</view>
				<view class="fs-30  color-999999">{{user_info.createTime}}</view>
			</view>

		</view>










		<toast ref="toast"></toast>

		<qq-input ref="qqinput"></qq-input>

		<qq-select ref="select" title="选择性别" ></qq-select>

	</view>
</template>

<script>
	let utils = require('../../utils/util');
	export default {
		data() {
			return {
			}
		},
		onLoad(e) {
			//0为止1男2女

		},
		methods: {
			choose_image() {
				utils.upload_one(url => {
					this.updateInfo({
						
						avatarUrl: url,
					});
				});
			},

			eidt_nickname() {
				this.$refs.qqinput.open({
					title: '修改用户名',
					text: this.user_info.name,
					check: (text) => {
						if (String(text).trim() == '' || String(text).trim().length > 10) {
							this.showToast('用户名长度为1~10');
							return false;
						}
						return true;
					},
					success: name => {
						this.updateInfo({
							name: String(name).trim(),
							avatarUrl: this.user_info.avatarUrl,
							gender: this.sex
						});
					}
				});
			},
			eidt_sex() {
				
				this.$refs.select.open(
					['男', '女'],
					this.user_info.gender == 2 ? 1:0,
					(res) => {
						this.updateInfo({
							gender: res.index + 1
						});
					});
				
			},
			updateInfo(data) {
				this.less(() => {
					this.request({
						url: '/user/updateAudi',
						loading: true,
						method: 'POST',
						data,
					}).then(res => {
						if (!this.rsuccess(res)) return;
						this.showToast('修改成功');
						this.$store.dispatch('refresh_user');
					});
				});
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

	.input-box {
		height: 120rpx;
		border-bottom: 1rpx solid #EEEEEE;
		display: flex;
		align-items: center;
		color: #3B4644;
		font-size: 30rpx;
		padding-right: 40rpx;
	}

	.input-box-2 {
		padding: 20rpx 40rpx 20rpx 0;
		border-bottom: 1rpx solid #EEEEEE;
		display: flex;
		align-items: center;
		color: #3B4644;
		font-size: 30rpx;
	}

	.input-box-2 textarea {
		height: auto;
		line-height: 40rpx;

	}


	.input-box .input-title {
		width: 170rpx;
		white-space: nowrap;
	}

	.input-box .input-title.require::after {
		content: '*';
		color: #FA4A4A;
	}

	.input-box input {
		line-height: 80rpx;
		height: 80rpx;
		flex: 1;
		font-size: 30rpx;
	}

	.hui {
		opacity: 0.6;
	}
</style>
