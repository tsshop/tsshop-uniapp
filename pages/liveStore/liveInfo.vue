<template>
	<view>
		<custom title="个人信息" fixed="fixed"></custom>
		<view class="flex">
			<view class="flex-content" style="">

				<!-- 头像 -->
				<view class="flex flex-y flex-x-y" style="margin-top: 48rpx;">
					<view class="pr" style="height: 164rpx;width: 164rpx;" @tap.stop="choose_image">
						<qq-image @click="choose_image" :url="form.storeHeadPortrait || '../../static/images/no-avater-1.png'"
							imageStyle="background:#f4f5f6;;width:164rpx;height:164rpx;border-radius:50%;">
						</qq-image>
						<image src="../../static/images/camera1.png"
							style="width: 48rpx;height: 48rpx;bottom: 0;right: 0;position: absolute;"></image>
					</view>
					<view class="mt-20 fs-26 color-999999">上传头像</view>
				</view>
				<!-- 头像 -->
				<view class="" style="padding:20rpx">
					<view class="userinfo-item flex-y-center">
						<view class="userinfo-title">店铺昵称</view>
						<input :adjust-position="false" style="text-align:right;"  placeholder="请输入昵称" type="text" v-model="form.storeName">
					</view>
					<view class="userinfo-item flex-x-b flex-y-center">
						<view class="userinfo-title">店铺联系电话</view>
						<view class="" style="text-align:right;">
							<lw-num-input :value.sync="form.storePhone" align="right" placeholder="请输入手机号" maxlength="11"></lw-num-input>
						</view>
					</view>
				<!-- 	<view class="userinfo-item flex-x-b flex-y-center" @tap.stop="toPage('/pages/liveStore/cashAccount','',true)">
						<view class="userinfo-title">提现账号</view>
						<view class="flex flex-x-y">
							<view class="mr-10 fs-26">未设置</view>
							<view class="iconfont icon-jinru  fs-26"></view>
						</view>
					</view> -->
				</view>
				



			</view>
		</view>

		<fixed-bottom height="200rpx">
			<view class="flex flex-x-y" style="padding-top: 20rpx;padding-bottom: 50rpx;">
				<view class="default-btn" style="width: 550rpx;" @tap.stop="save">保存</view>
			</view>
		</fixed-bottom>

	</view>
</template>

<script>
	let utils = require('../../utils/util');
	export default {
		data() {
			return {
				form: {
					storeHeadPortrait: '',
					storestoreName: '',
					storePhone: '',
				},
				old_form: {},
			}
		},
		computed: {
			show_save() {
				return JSON.stringify(this.form) != JSON.stringify(this.old_form);
			},
		},
		onLoad() {
			let {
				storeName,
				storeHeadPortrait,
				storePhone,
			} = this.live_store_info;
			this.form = {
				storeName,
				storeHeadPortrait,
				storePhone,
			};
			this.old_form = this.clone(this.form);
		},
		methods: {
			choose_image() {
				utils.upload_one(url => {
					this.form.storeHeadPortrait = url
				});
			},
			save() {
				this.request({
					url: '/liveStore/edit',
					method: 'POST',
					data: {
						...this.form,
					}
				}).then(res => {
					if (res.status != 200) return;
					this.showToast('修改成功');
					this.$store.dispatch('refresh_live_stroe_info');
					this.uniBack()
					this.old_form = this.clone(this.form);
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.userinfo-item {
		display: flex;
		padding: 32rpx 0;
		border-bottom: 1px solid #E6E6E6;
		overflow: hidden;
		width: 690rpx;
	}

	.userinfo-item+.userinfo-item {}

	.userinfo-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333333;
		width: 180rpx;
	}

	.userinfo-item input {
		flex: 1;
		font-size: 28rpx;
		color: #333333;
	}

	.userinfo-item textarea {
		flex: 1;
		font-size: 28rpx;
		color: #333333;
	}

	.gender {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 168rpx;
		height: 72rpx;
		border-radius: 10rpx;
		border: 1px solid #999999;
		border-color: #999999;
		font-size: 28rpx;
		color: #333333;
		margin-right: 24rpx;
		transition: all 0.2s;

	}

	.active-gender {
		background-color: $bgColor;
		color: #FFFFFF;
		border-color: $bgColor;
	}
</style>