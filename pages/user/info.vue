<template>
	<view>
		<custom :title="(!add && !edit) || self ? '个人档案':'成员档案'" fixed="fixed">



			<!-- #ifndef MP-WEIXIN -->
			<view @tap.stop="del_one" v-if="edit" slot="right" class="flex flex-y-center"
				style="width: 180rpx;transform: translateX(-30rpx);">
				<view v-if="realNameAuth == 1" class="fs-28" style="color: #646464;">解绑</view>
				<view v-if="realNameAuth != 1" class="fs-28" style="color: #646464;">删除</view>
			</view>
			<!-- #endif -->

		</custom>

		<view class="flex flex-wrap">
			<view class="flex-1 ml-40 mt-24">
				<view @tap.stop="choose_image" class="input-box" style="height: 140rpx;">
					<view class="input-title">头像</view>
					<view class="flex-1 flex flex-y-center flex-x-end">
						<image :src="info.picture"
							style="width: 100rpx;height: 100rpx;border-radius: 50%;background-color: #f1f1f1;"
							mode="aspectFill"></image>

						<qq-icon icon="icon-jinru ml-36 w-20"></qq-icon>
					</view>
				</view>
				<view class="input-box">
					<view class="input-title require">真实姓名</view>
					<input class="font" :disabled="realNameAuth == 1" placeholder-class="font"
						v-model="info.membersname" placeholder="请填写真实姓名" />
				</view>
				<view class="input-box" style="border: none;">
					<view class="input-title require">身份证号</view>
					<input class="font" type="idcard" :disabled="realNameAuth == 1" maxlength="18" v-model="info.idCard"
						placeholder-class="font" placeholder="请填写身份证号" />
				</view>
			</view>
			<view style="height: 20rpx;background-color: #F2F6F5;width: 100%;"></view>
			<view class="flex-1 ml-40 mt-24">

				<view class="input-box">
					<view class="input-title require">手机号</view>
					<input class="font" :disabled="realNameAuth == 1 || self == 1 || (!edit&&!add)" placeholder-class="font" v-model="info.tel"
						placeholder="请填写手机号" type="number" />
				</view>
				<view class="input-box">
					<view class="input-title">性别</view>
					<view class="flex-1 flex-y-center">
						<!-- 单选 -->
						<qq-radio :arr="sexArr" v-model="info.sex"></qq-radio>
						<!-- 单选 -->
					</view>
				</view>
				<view class="input-box">
					<view class="input-title require">年龄</view>
					<input class="font flex-1" placeholder-class="font" type="number" v-model="info.age"
						placeholder="请填写年龄" />
				</view>

				<view class="input-box">
					<view class="input-title require">身高</view>
					<input class="font" placeholder-class="font" v-model="info.height" placeholder="请填写身高 cm"
						type="number" />
				</view>



				<view class="input-box" style="">
					<view class="input-title">婚否</view>
					<view class="flex-1 flex-y-center">
						<!-- 单选 -->
						<qq-radio :arr="hunArr" v-model="info.marryStatus"></qq-radio>
						<!-- 单选 -->
					</view>
				</view>

				<view class="input-box">
					<view class="input-title">个人习惯</view>
					<input class="font" :maxlength="200" placeholder-class="font" v-model="info.habit"
						placeholder="请填写个人习惯" />
				</view>


				<view class="input-box-2">
					<view class="input-title" style="width: 170rpx;white-space: nowrap;">过敏史</view>
					<textarea style="width: 480rpx;" v-model="info.allergic" maxlength="300" :auto-height="true"
						placeholder="请填写过敏史">
					</textarea>
				</view>

				<view class="input-box-2">
					<view class="input-title" style="width: 170rpx;white-space: nowrap;">过往病史</view>
					<textarea style="width: 480rpx;" v-model="info.family" maxlength="300" :auto-height="true"
						placeholder="请填写过往病史">
					</textarea>
				</view>




				<view style="height: 40rpx;"></view>
			</view>
		</view>


		<fixed-bottom height="120rpx">
			<view style="height: 120rpx;" class="flex felx-x-y">
				<view v-if="add || edit" @tap.stop="srue_add"
					class="ml-40 mr-40 flex flex-x-y fs-32 bg-all color-ffffff"
					style="height: 80rpx;flex:1;border-radius: 40rpx;transition: all 0.5s;">确认</view>
				<view v-if="!add && !edit" @tap.stop="srue_add"
					class="ml-40 mr-40 flex flex-x-y fs-32 bg-all color-ffffff"
					style="height: 80rpx;flex:1;border-radius: 40rpx;transition: all 0.5s;">确认</view>
			</view>
		</fixed-bottom>

		<toast ref="toast"></toast>

		<qq-select ref="qqselect" :multiple="true"></qq-select>


	</view>
</template>

<script>
	let utils = require('../../utils/util');
	export default {
		data() {
			return {
				sexArr: [{
						name: '女',
						id: 2,
					},
					{
						name: '男',
						id: 1
					}
				],

				hunArr: [{
						name: '未知',
						id: "未知",
					},
					{
						name: '未婚',
						id: '未婚',
					},
					{
						name: '已婚',
						id: '已婚',
					}
				],

				add: '', //创建档案
				edit: '', //上级 修改

				info: {
					idCard: "",
					tel: "",
					membersname: "",
					sex: 1, //1男 2女
					age: '',
					height: '',
					marryStatus: '未知',
					habit: '', //个人习惯
					allergic: '', //过敏史
					family: '', //其他（家族史）
					history: '', //过往病史
					picture: '', //头像
				},
				realNameAuth: 0, //1 已实名，实名不可修改三要素
				self: '',
			}
		},
		onLoad(e) {
			// add  和 edit 不能同时存在
			if (e.add) {
				//创建档案
				this.add = e.add;
				if (getApp().globalData.add_user_info) {
					this.info.membersname = getApp().globalData.add_user_info.membersname;
					this.info.idCard = getApp().globalData.add_user_info.idCard;
					getApp().globalData.add_user_info = null;
				}
			}
			if (e.edit) {
				//上级 修改
				this.edit = e.edit;
				this.id = e.id;
				this.realNameAuth = e.realNameAuth; // 1已实名
				this.get_info_by_id();
			}


			if (!this.add && !this.edit) {
				this.info.picture = this.user_info.avatarUrl;
				this.info.tel = this.user_info.phone;
				this.get_self_info();
			}
			if (e.self) {
				this.self = e.self;
			}

		},
		methods: {
			choose_image() {
				utils.upload_one(url => {
					this.info.picture = url;
				});
			},
			get_self_info() {
				this.request({
					url: '/archives/getMyArchives',
					toast: false,
					method: 'POST',
				}).then(res => {
					if (!this.rsuccess(res)) return;
					if (res.data) {
						this.info = res.data;
						if (res.data.realNameAuth == 1) {
							this.realNameAuth = res.data.realNameAuth;

						} else if(res.data.tel) {
							this.$refs.toast.open({
								desc: '实名后才可查看检测数据',
								left: '取消',
								right: '去实名',
								success: () => {
									getApp().globalData.add_authentication = {
										idCard: this.info.idCard,
										membersname: String(this.info.membersname).trim(),
										tel: this.info.tel
									};
									this.toPage(`/pages/user/authentication?id=${res.data.id}`,
										'3');
								},

							});
						}
					}
				});
			},
			get_info_by_id() {
				this.request({
					url: '/archives/getById',
					method: 'POST',
					data: {
						id: this.id,
					}
				}).then(res => {
					if (!this.rsuccess(res)) return;
					if (!res.data) return;
					this.info = res.data;
					this.id = res.data.id;
					this.realNameAuth = res.data.realNameAuth;
				});
			},
			srue_add() {
				//上级 添加档案
				if (!this.verify_data()) return;
				console.log(this.info);
				if (this.info.id) {
					this.save();
					return;
				}
				this.less(() => {
					this.request({
						url: this.add ? '/archives/create' : '/archives/createMyArchives',
						loading: true,
						method: 'POST',
						data: {
							...this.info,
						},
					}).then(res => {
						if (!this.rsuccess(res)) return;
						this.$store.dispatch('refresh_user_list');
						this.$refs.toast.open({
							desc: '档案已保存,请实名,实名后才可查看检测数据',
							left: '返回',
							right: '确定',
							success: () => {
								getApp().globalData.add_authentication = {
									idCard: this.info.idCard,
									membersname: String(this.info.membersname).trim(),
									tel: this.info.tel
								};
								this.toPage(`/pages/user/authentication?id=${res.data.id}`,
									'3');
							},
							fail: () => {
								this.uniBack();
							}
						});
					});
				});
			},
			save() {
				this.less(() => {
					this.request({
						url: '/archives/update',
						loading: true,
						method: 'POST',
						data: {
							...this.info,
						},
					}).then(res => {
						if (!this.rsuccess(res)) return;

						this.showToast('保存成功');
						this.$store.dispatch('refresh_user_list');
						if (this.realNameAuth == 0 && this.info.id) {
							this.$refs.toast.open({
								desc: '档案已保存,请实名,实名后才可查看检测数据',
								left: '返回',
								right: '确定',
								success: () => {
									getApp().globalData.add_authentication = {
										idCard: this.info.idCard,
										membersname: String(this.info.membersname).trim(),
										tel: this.info.tel
									};
									this.toPage(
										`/pages/user/authentication?id=${this.info.id}`,
										'3');
								},
								fail: () => {
									this.uniBack();
								}
							});
						}
					});
				});
			},
			verify_data() {

				// idCard: "362427199812197010",
				// tel: "13732297916",
				// membersname: "廖清泉",
				// height: '160',
				// age:3,
				if (!this.info.membersname) {
					this.showToast('请填写真实姓名');
					return false;
				}
				if (!this.info.idCard || String(this.info.idCard).length != 18) {
					this.showToast('请填写正确的身份证号');
					return false;
				}
				if (!this.info.tel) {
					this.showToast('请填写正确的手机号');
					return false;
				}
				if (!this.info.age) {
					this.showToast('请填写正确的年龄');
					return false;
				}
				if (!this.info.height) {
					this.showToast('请填写正确的身高');
					return false;
				}
				return true;


			},
			del_one() {
				// realNameAuth
				if (this.info.userId == this.user_info.id) {
					this.showToast(`不能${this.realNameAuth == 1 ? '解绑' : '删除'}自己的档案哦`);
					return;
				}
				this.$refs.toast.open({
					desc: this.realNameAuth == 1 ? '确定要解绑该成员？' : '确定要删除该成员？',
					success: () => {
						this.request({
							url: '/archives/del',
							method: 'POST',
							data: {
								id: this.info.id,
							}
						}).then(res => {
							if (!this.rsuccess(res)) return;
							this.$store.dispatch('refresh_user_list');
							this.showToast(this.realNameAuth == 1 ? '解绑成功' : '删除成功');
							this.uniBack();
						});
					}
				});
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}

	.input-box {
		height: 80rpx;
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
