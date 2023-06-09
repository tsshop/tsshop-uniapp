<template>
	<view>
		<common></common>
		<custom fixed="fixed" title="填写物流单号" background="rgba(0,0,0,0)"></custom>

		<!-- 需要填写物流信息 -->
		<view v-if="status == 4 && address" class="pl-20 pr-20 mt-20 color-323232 fs-28">
			<view class="p-20 bg-FFFFFF br-10">

				<view class="fs-30">
					请尽快寄出商品，长时间未寄出，系统将关闭售后单，你需要重新申请
				</view>
			</view>


			<view class="p-20 bg-FFFFFF br-10 mt-20">
				<view class="fs-30">
					寄回地址
				</view>

				<view v-if="address"
					style="margin-top: 24rpx;background-color: #EEEEEE;border-radius: 16rpx;padding:28rpx;"
					class="fs-28 color-000000">
					<view class="flex flex-y-center">
						<view style="width: 162rpx;">收货人</view>
						<view>{{address.name || ''}}</view>
						<view class="flex-1" style="text-align: right;color: #1460B7;" @tap.stop="copy_address">点击复制
						</view>
					</view>
					<view class="flex flex-y-start mt-20">
						<view style="width: 162rpx;">手机号码</view>
						<view class="flex-1">
							{{address.phone}}
						</view>
					</view>
					<view class="flex flex-y-start mt-20">
						<view style="width: 162rpx;">收货地址</view>
						<view class="flex-1">
							{{address.detailAddr}}
						</view>
					</view>
				</view>


				<view class="fs-30 mt-20">
					填写寄回的物流信息
				</view>

				<view class="fs-28 color-000000"
					style="border-radius: 16rpx;margin-top: 24rpx;border: 1rpx solid #EEEEEE;padding:24rpx;">
					<view class="flex flex-y-center" @tap="choose_express">
						<view style="margin-right: 40rpx;">物流公司</view>
						<view style="color: #989898;" :style="express_index>-1?'color:#000000;':''">
							{{express_index>-1 && express_list[express_index] ?express_list[express_index].dvyName:'点击，选择物流公司'}}
						</view>
					</view>
					<view class="flex flex-y-center" style="margin-top: 40rpx;">
						<view style="margin-right: 40rpx;">物流单号</view>
						<input placeholder="点击，填写物流单号" type="text" v-model="order"
							placeholder-style="color:#989898;font-size:28rpx;"
							style="flex:1;height: 40rpx;font-size: 28rpx;color: #000000;" placeholder-class="font" />
					</view>
				</view>

				<!-- 禁用颜色 #989898 -->
				


			</view>
			<view @tap.stop="update_refund" class="flex flex-x-y color-ffffff bg-all"
				style="width: 100%;margin-top: 40rpx;height: 88rpx;border-radius: 44rpx;">
				提交
			</view>
			<!-- <view style="height: 16rpx;background-color: #EEEEEE;"></view> -->
		</view>

		<!-- <view style="padding:32rpx 0rpx 32rpx 36rpx;background-color: #FFFFFF;" class="color-000000 fs-28">
			<view class="fs-30 bold">
				进度记录
			</view>
			<view class="refund-item1" v-for="(item,index) in list" :key="index">
				<view>{{item.date}}</view>
				<view>{{item.content || ''}}</view>
			</view>
		</view> -->
		<qq-select ref="select" @sure="sure"></qq-select>
		<toast ref="toast"></toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order: '', //物流单号
				address: null,
				info: null,
				express_list: [],
				all: {},
				list: [],
				status: '',
				express_index: -1,
			}
		},
		onLoad(e) {
			if (e.id) {
				this.id = e.id;
				this.get_info();
			}
			if (e.status) {
				this.status = e.status;
			}
			this.get_list();
		},
		methods: {
			get_info() {
				this.request({
					url: '/returnOrder/detail',
					data: {
						returnId: this.id
					}
				}).then(res => {
					if (!this.rsuccess(res, true)) return;
					if (!res.data.address) return;
					this.address = res.data.address;
				});
			},
			get_list() {

				this.request({
					url: '/delivery/getList',
					data: {
						size: 100,
					}
				}).then(res => {
					if (res.status == 200 && res.data) {
						this.express_list = res.data || [];
					}
				});
			},
			copy_address() {
				let str = ''
				str += this.address.name;
				str += '\n';
				str += this.address.phone;
				str += '\n';
				str += this.address.detailAddr;
				this.mycopy(str);
			},
			sure(data) {
				this.express_index = data.index;
			},
			choose_express() {
				this.$refs.select.open(this.express_list.map(val => val.dvyName));
			},
			update_refund() {
				if (this.express_index == -1) {
					this.showToast("请选择物流公司", 3000);
					return;

				}
				if (this.order == '') {
					this.showToast("请填写物流单号", 3000);
					return;

				}
				this.less(() => {
					this.request({
						url: '/returnOrder/express',
						method: 'POST',
						data: {
							id: this.id,
							express: this.express_list[this.express_index].expressBird,
							expressNo: this.order,
							expressName: this.express_list[this.express_index].dvyName,
						},
					}).then(res => {

						if (res.status != 200) return;
						this.$refs.toast.open({
							desc: '提交成功',
							success: () => {
								uni.$emit('refresh_refund_list');
								this.uniBack();
							},
							left: '',
						});
					});
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $pageColor;
	}

	.refund-item1 {
		height: 110rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28rpx;
		padding-right: 36rpx;
	}

	.refund-item1 {
		border-bottom: 0.5px solid #EEEEEE;
	}
</style>
