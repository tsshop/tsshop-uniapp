<template>
	<view>
		<custom :title="id?'修改地址':'新增地址'" fixed="fixed" mode="2" background="#FFFFFF"></custom>

		<!-- <view class="w-688 bg-FFFFFF br-16 ml-31 pr" style="padding:32rpx;margin-top: 34rpx;">
			<textarea placeholder="粘贴地址信息，自动拆分、电话和地址" style="width: 100%;height: 200rpx;" class="fs-30"
				rows="4"></textarea>
			<view class="fs-26 flex flex-x-y"
				style="width: 112rpx;height: 56rpx;border-radius: 28rpx;color: #191A1B;background-color:rgba(25,26,27,0.10);right: 34rpx;position: absolute;bottom: 34rpx;">
				识别</view>
		</view> -->

		<view class="pr" style="padding: 20rpx;color:#323232;">


			<view style="padding: 0 12rpx;">
				<view class="h-120 border-b flex flex-y-center">
					<view class="w-150">联系人</view>
					<input v-model="name" type="text" class=" flex-1 ml-8 input-box" placeholder-class="font"
						placeholder="请输入联系人姓名">
				</view>
				
				<view class="h-120 border-b flex flex-y-center  ">
					<view class="w-150">联系电话</view>
					<input v-model="mobile" type="number" class=" flex-1 ml-8 input-box" placeholder-class="font"
						placeholder="请输入联系人电话">
				</view>
				
				<view class="h-120 border-b flex flex-y-center  " @tap="choose_address">
					<view class="w-150">所在地区</view>
					<view type="number" class="flex flex-y-center flex-1 ml-8 input-box hidden"
						:class="address_str?'':'color-999999'" placeholder-class="font">
						<view class="flex-1 over-line1">{{address_str || '请选择省、市、区'}}</view>
						<view class="iconfont icon-jinru " style="padding-right: 10rpx;font-size: 30rpx;color:#AFBAB8;">
						</view>
					</view>
				
				</view>
				<view class="border-b flex flex-y-center   flex-y-start" style="padding:26rpx 0 ;">
					<view class="w-150">详细地址</view>
					<textarea v-model="detail" placeholder="请输入详细地址"
						style="flex:1;height: 150rpx;padding-top: 6rpx;line-height: 50rpx;" class=" input-box"
						rows="3"></textarea>
				</view>
				<view class="h-120  flex flex-y-center flex-x-b" style="color:#3B4644;height: 80rpx;">
					<view class="bold fs-30">设为默认地址</view>
				
					<switch @change="checked_change" :checked="checked" color="#FF882F"
						style="transform: scale(0.7) translateX(20rpx);" />
				</view>
			</view>

			

			


		</view>

		<view @tap="save" hover-class="click" hover-start-time="2" class="flex flex-x-y bg-all"
			style="width: 710rpx;height: 88rpx;border-radius: 44rpx;color: #fff;font-size: 32rpx;margin:52rpx auto 0 auto;">
			保存
		</view>


		<my-addres @sure="sure" ref="address"></my-addres>


	</view>
</template>

<script>
	import address from '@/components/address/address.vue';
	export default {
		data() {
			return {
				checked: false,
				name: '',
				mobile: '',
				detail: '',
				address_str: '',
				old_: {
					checked_arr: [0, 0, 0],
					checked_str: ['', '', ''],
					checked_id: [0, 0, 0]
				},
				value: -1,
				array: [],
				array_filter: [],
				array_id: '',
				set_default: false,
				id: '',
				vals: [],
			}
		},
		components: {
			myAddres: address
		},
		onLoad(e) {

			// if (e.id)
			// 	this.id = e.id;
			if (e.item) {

				this.item = JSON.parse(e.item);
				this.id = this.item.id
				this.name = this.item.name || '';
				this.mobile = this.item.phone || '';
				this.detail = this.item.detailAddr || '';
				this.checked = this.item.defaultCargo == 1 ? true : false;
				console.log('this.checked', this.checked)
				setTimeout(() => {
					this.$refs.address.set_detault(this.item.province, this.item.city, this.item
						.area);
				}, 500);

				// data.province = this.old_.checked_id[0];
				// data.area = this.old_.checked_id[2];
				// data.city = this.old_.checked_id[1];
				// this.get_xiaoqu(this.item.district_id, this.item.town_id)
			}
		},
		methods: {
			checked_change(e) {
				// console.log('checked',this.checked);
				// console.log('e',e);
				this.checked = e.detail.value;
				console.log('checked', this.checked);
			},
			sure(data) {
				console.log(data)
				if (data.checked_arr) {
					this.address_str = data.checked_str.join('  ');
					this.old_ = data;
					this.array_id = data.checked_id[2];
					// this.get_xiaoqu(this.array_id);
					this.vals = data.vals;
				}
			},
			choose_address() {
				this.$refs.address.open();
			},
			get_xiaoqu(id, town_id = '') {
				return;
				// return ;
				console.log('town_id', town_id)
				if (!id) return;

				this.getApp().request({
					url: '/district/son',
					data: {
						id: id
					},
					success: res => {
						console.log('小区', res);
						if (res.data && res.code == 0 && res.data.length > 0) {
							this.array = res.data;
							if (town_id) {
								res.data.forEach((val, index) => {
									console.log(val, ',', town_id)
									if (val.id == town_id) {
										this.value = index;
									}
								})
							}
							this.array_filter = res.data.map(val => val.name);

						}
					}
				});
			},
			bindPicker_change(e) {
				console.log(e);
				this.value = e.detail.value;
			},
			choose_before() {
				this.showToast('请先选择所在地');
			},
			change_default() {
				this.set_default = !this.set_default;
			},
			save() {
				let data = {};
				if (this.name == '' || this.mobile == '' || this.array_id == '' || this.detail == '') {
					this.showToast('信息填写不完整', 3000);
					return;
				}
				if (!(/^1[3456789]\d{9}$/.test(this.mobile))) {
					this.showToast('号码格式不正确', 3000);
					return;
				}
				this.less(() => {
					this.id && (data.id = this.id);

					data.name = this.name;
					data.phone = this.mobile;
					data.province = this.old_.checked_id[0];
					data.area = this.old_.checked_id[2];
					data.city = this.old_.checked_id[1];
					// data.town_id = this.array[this.value].id;
					data.detailAddr = this.detail;
					data.defaultCargo = this.checked ? 1 : 2;
					data.userId = this.user_info.id;
					console.log(data, 'data')
					this.request({
						url: this.id ? '/address/update' : '/address/create',
						method: 'POST',
						loading: true,
						data,

					}).then(res => {
						if (res.status == 200) {
							this.showToast('保存成功');
							uni.$emit('refresh_address');
							this.uniBack();
						}
					});
				});


			},
			del_address() {
				if (this.id) {
					uni.showModal({
						title: '确定删除该地址',
						success: res => {
							if (res.confirm) {
								this.less(() => {
									this.getApp().request({
										url: '/address/delete',
										loading: true,
										data: {
											ids: this.id
										},
										success: res => {
											if (res.code == 0) {
												this.showToast('删除成功');
												this.uniBack();
											}
										}
									});
								})
							}
						}
					})

				}
			},
		},
		async onShareAppMessage() {

		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}

	.h-120 {
		height: 114rpx;
	}

	.input-box {
		flex: 1;
		height: 80rpx;
		border-radius: 10rpx;
		background-color: #F5F6F7;
		padding-left: 20rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		
	}

	.w-150 {
		width: 150rpx;
		font-size: 30rpx;
		color: #323232;
		white-space: nowrap;
		font-weight: bold;
	}
</style>
