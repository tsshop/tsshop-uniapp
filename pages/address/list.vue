<template>
	<view>
		<custom title="收货地址" fixed="fixed" mode="2"></custom>

		<template v-if="is_null">
			<view hover-class="click" @click="toPage('/pages/address/edit?type=add')" class="flex flex-x-y bg-all"
				style="width: 710rpx;height: 96rpx;border-radius: 48rpx;color: #fff;font-size: 36rpx;margin:40rpx auto 0 auto;">
				新增地址
			</view>
		</template>
		<template v-else>
			<view style="padding:0 20rpx;">
				<view @tap="choose_add(item)" v-for="(item,index) in list" :key="index"
					style="padding: 20rpx;margin-top: 20rpx;" class="br-16 bg-FFFFFF">
					<view class="flex flex-y-center">
						<view class="flex-1">
							
							<view class="fs-28 color-323232">
								<text>{{item.name}}</text>
								<text style="margin-left: 16rpx;">{{item.phone}}</text>
							</view>
							
							<view class="text over-line2 fs-26 color-323232" style="margin-top: 10rpx;">
								{{item.provinceName}} {{item.cityName}} {{item.areaName}} {{item.detailAddr}}
							</view>
							
							<view class="mt-30" style="border-bottom: 2rpx solid #EFEFEF;">
								
							</view>
							
							<view class="flex mt-16 flex-y-center mb-10">
								<view class="flex flex-1 flex-y-center color-323232">
									<view @tap.stop="edit_detault(item)" v-if="item.defaultCargo == 1" class="iconfont icon-xuanzhong color-all"></view>
									<view @tap.stop="edit_detault(item)" v-else class="iconfont icon-weixuanzhong"></view>
									<view @tap.stop="edit_detault(item)" class="fs-24 ml-8">默认地址</view>
								</view>
								<view class="flex flex-1 flex-y-center flex-x-end color-323232">
									
									<view @tap.stop="to_edit(item)"  class="flex flex-x-y iconfont icon-icon6 fs-28" style="margin-left: 49rpx;" mode="">
										<text class="fs-24" style="padding-left: 6rpx;">修改</text>
									</view>
									<view @tap.stop="del(item)"  class="flex flex-x-y iconfont icon-lajitong fs-36" style="margin-left: 49rpx;" mode="">
										<text class="fs-24">删除</text>
									</view>
								</view>
								

							</view>
						</view>

					</view>
				</view>
			</view>

			<view style="height: 190rpx;">
				<view style="padding-bottom: 15rpx;;height: 160rpx;width: 750rpx;position: fixed;bottom: 0;z-index: 6;"
					class="bg-FFFFFF flex flex-x-y">
					<view hover-class="click" @click="toPage('/pages/address/edit?type=add')"
						class="flex flex-x-y bg-all"
						style="width: 710rpx;height: 96rpx;border-radius: 48rpx;color: #fff;font-size: 36rpx;margin:0rpx auto 0 auto;">
						
						新增地址
					</view>
				</view>
			</view>

		</template>

		<toast ref="toast"></toast>

	</view>
</template>

<script>
	export default {
		data() {
			return {

				list: [],
				page: 1,
				is_null: true,
				default_address:'',
			}
		},
		onLoad(e) {

			if (e.choose) {
				this.choose = true;
			}
			uni.$on('refresh_address', () => {
				this.init();
			})
			this.init();

			this.login();

		},
		onReachBottom() {
			// this.get_list(this.page);
		},
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 200);
			this.init();
		},


		methods: {

			init() {
				this.setData({
					page: 1,
					list: [],
					is_null: false,
				})
				// this.get_default()
				this.get_list();
				
			},
			get_list(page = 1) {
				this.request({
					url: '/address/getList',
					data: {
						// pages: page,
					}
				}).then(res => {

					if (res.status == 200) {
						this.list = this.list.concat(res.data);

						if (res.data.length == 0) {
							this.is_null = true;
						} else {
							this.page++;
						}
					}
				});
			},
			to_edit(item) {
				this.toPage(`/pages/address/edit?item=${JSON.stringify(item)}`);
			},
			del(item) {
				this.$refs.toast.open({
					title: '删除',
					desc: '是否删除该地址',
					right: '删除',
					success: () => {
						this.less(() => {
							this.request({
								url: '/address/delete',
								method: 'POST',
								data: {
									id: item.id
								}
							}).then(res => {
								if (res.status == 200) {
									this.showToast('删除成功');
									this.init();
								}
							});
						});
					}
				});
			},
			choose_add(item) {
				if (this.choose) {
					uni.setStorageSync('cityId', item.area || '')
					uni.$emit('choose_address', item);
					this.uniBack();
					
				}
			},
			edit_detault(item) {
				let data = this.clone(item);
				data.defaultCargo = item.defaultCargo == 1 ? 0 : 1;
				if (data.createTime)
					delete data.createTime
				if (data.updateTime)

					delete data.updateTime

				if (data.deleted !== undefined) {
					delete data.deleted
				}

				this.request({
					url: '/address/setDefault',
					method: 'POST',
					loading: true,
					data,

				}).then(res => {
					if (res.status == 200) {
						this.showToast('修改成功');
						this.init();
					}
				});
			},
		},

	}
</script>

<style lang="scss">
	page {
		background-color: $pageColor;
	}
</style>
