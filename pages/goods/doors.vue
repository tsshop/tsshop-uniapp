<template>
	<view>
		<custom title="附近门店" fixed="fixed" mode="2"></custom>

		<view style="padding:0 20rpx;">
			<view v-for="(item,index) in list" :key="item.id" @tap.stop="to_address(item)" class="doors-item">
				<view>{{item.shopName}}</view>
				<view class="fs-24" style="color:#3B4644;">
					营业时间 {{item.startTime}}-{{item.endTime}}
				</view>
				<view style="height: 1rpx;background-color: #F2F6F5;margin:20rpx 0;"></view>
				<view class="flex">
					<image src="../../static/address.png" mode="aspectFill" style="width: 28rpx;height: 28rpx;"></image>
					<view class="flex-1 pl-20 pr-20">
						<view class="fs-28" style="line-height: 40rpx;margin-top: -6rpx;">
							<text :selectable="true">
								{{item.city}} {{item.area}} {{item.detailAddr}}
							</text>
						</view>
						<view class="fs-24" style="color:#808080;">距您{{item.distance}}</view>
					</view>
					<view style="padding:20rpx;margin-top: -20rpx;padding-left: 40rpx;" @tap.stop="call_one(item)">
						<image src="../../static/call.png" mode="aspectFill"
							style="width: 40rpx;height: 40rpx;margin-right: 20rpx;"></image>
					</view>
				</view>
			</view>
		</view>
		<qq-footer :list="list" :show="is_null"></qq-footer>
		<toast ref="toast"></toast>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				///store/storeList
				list: [],
				is_null: false,
			}
		},
		onLoad() {
			this.get_list();
			this.get_address();
		},
		methods: {
			call_one(item) {
				this.$refs.toast.open({
					title: '是否要拨打电话',
					desc: item.contactNumber,
					success: () => {
						uni.makePhoneCall({
							phoneNumber: item.contactNumber
						})
					}
				});
			},
			get_list() {

				this.is_null = false;
				this.request({
					url: '/store/storeList',
					data: {
						lng: uni.getStorageSync('longitude') || 0,
						lat: uni.getStorageSync('latitude') || 0
					},
				}).then(res => {
					if (!this.rsuccess(res));
					if (res.data && res.data.length == 0) {
						this.is_null = true;
					} else {
						res.data.forEach(val => {
							val.distance = this.get_mi(val.distance);
						});
						this.list = res.data;
					}
				});
			},
			get_mi(m) {
				m = Number(m);
				if (m <= 0) {
					return '0m';
				}

				if (m > 1000) {
					return Number(this.xs(m / 1000, 1)) + 'km'
				}
				return `${this.xs(m,-1)}m`;
			},
			//导航去该门店
			to_address(item) {
				uni.openLocation({
					latitude: Number(this.xs(item.lat, 3)),
					longitude: Number(this.xs(item.lon, 3)),
					complete: (res) => {
						console.log('res', res);
					},
					fail:res=>{
						// #ifdef  H5 || APP-PLUS
						this.showToast(JSON.stringify(res));
						// #endif
					}
				})
			},
			get_address() {
				uni.getLocation({
					type: 'wgs84',
					success: (res) => {

						uni.setStorageSync('longitude', res.longitude);
						uni.setStorageSync('latitude', res.latitude);

						//重新获取
						this.get_list();
					},
					fail: res => {
						if (!uni.getStorageSync('longitude')) {
							this.showToast('打开定位可以查看最近的门店哦');
						}
					},
					complete: res => {

					}
				});

			}
		}
	}
</script>

<style>
	page {
		background-color: #F2F6F5;
	}

	.doors-item {
		background-color: #FFFFFF;
		padding: 20rpx;
		border-radius: 20rpx;
		margin-top: 20rpx;
		color: #3B4644;
		font-size: 32rpx;
	}
</style>
