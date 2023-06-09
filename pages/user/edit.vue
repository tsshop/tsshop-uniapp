<template>
	<view>
		<custom title="设置昵称" mode="2" fixed="fixed"></custom>

		<!-- icon-jinru -->
		<view class="mt-20 pl-31" style="background-color: #FFFFFF;">
			<view class="setting-item flex flex-x-b flex-y-center">
				<input @confirm="edit_name" confirm-type="done" type="text" v-model="nickname"
					style="height: 100rpx;font-size: 34rpx;flex:1;">
				<view @tap.stop="clear_name" class="iconfont icon-guanbi-  fs-40 ml-30" style="color: #D8D8D8;"></view>
			</view>

		</view>

		<view @tap="edit_name" hover-class="click" hover-start-time="2" @click="toPage('/pages/address/edit?type=add')"
			class="flex flex-x-y bg-blue"
			style="width: 672rpx;height: 88rpx;border-radius: 44rpx;color: #fff;font-size: 36rpx;margin:52rpx auto 0 auto;">
			确定修改
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickname: '',
			}
		},
		mounted() {
			this.nickname = this.user_info.name;
		},
		methods: {
			clear_name() {
				this.nickname = '';
			},
			edit_name() {

				this.click(() => {
					let name = this.nickname.trim();
					if (name.length == 0 || name.length > 12) {
						this.showToast('名字长度在1-12之间');
						return;
					}
					this.request({
						url: '/wjuser/user',
						loading: true,
						data: {
							name,
							id: this.user_info.id,
						},
						method: 'PUT',

					}).then(res => {
						if (res.status == 200) {
							this.showToast('修改成功');
							this.$store.dispatch('refresh_user');
							setTimeout(() => {
								this.uniBack();
							}, 500);
						}
					});
				});

			},
		}
	}
</script>

<style>
	page {
		background-color: #EFF0F1;
	}

	.setting-item {
		height: 142rpx;
		background-color: #FFFFFF;
		padding-right: 30rpx;

	}

	/* .setting-item+.setting-item {
		border-top: 0.5px solid #D8D8D8;
	} */
</style>
