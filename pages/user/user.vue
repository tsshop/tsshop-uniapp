<template>
	<view>


		<view style="z-index: 1;" class="hidden pr">



			<custom fixed="fixed" background="rgba(0,0,0,0)" mode="2" title=" " :hiddenBtn="true">
				<view @tap.stop="toPage('/pages/setting/setting','',true)" slot="right" class="flex flex-y-center"
					style="width: 180rpx;transform: translateX(-10rpx);transform: translateY(20rpx);">
					<view class="iconfont  icon-shezhi1" style="font-size: 40rpx;"></view>
				</view>

			</custom>

			<view @tap.stop="toPage('/pages/user/userinfo','',true)" class="flex pr p-20"
				style="z-index: 4;height: 280rpx;padding-top: 0;">
				<view
					style="width: 140rpx;height: 140rpx;border-radius: 50%;overflow: hidden;margin-right: 20rpx;background-color: #FFFFFF;">
					<qq-image :url="user_info.avatarUrl" imageStyle="width: 140rpx;height:140rpx;"></qq-image>
				</view>

				<view v-if="user_info.name" @tap.stop="toPage('/pages/user/userinfo','',true)"
					class="flex flex-y flex-x-center flex-1" style="height: 128rpx;">
					<view class="fs-36 color-323232 flex flex-y-center">
						<view class="fs-36">{{user_info.name}}</view>

					</view>
					<view class="fs-28 color-646464 mt-20">{{user_info.phone}}</view>
				</view>
				<view v-else class="flex flex-y flex-x-center flex-1" style="height: 128rpx;">
					<view class="fs-36 color-black">点我登录</view>
				</view>





			</view>




			<view
				style="position: absolute;top: 0;left:0;height: 100%;width: 322rpx;background: #FAEBFF;opacity: 0.49;filter: blur(20rpx);">
			</view>
			<view
				style="position: absolute;top: 0;right:0;height: 100%;width: 322rpx;background: #EDEBFF;opacity: 0.49;filter: blur(20rpx);">
			</view>
			<view
				style="position: absolute;top: 0;left:0;height: 100%;width: 322rpx;background: #EBEDFF;opacity: 0.49;filter: blur(20rpx);transform: translate(-50%);">
			</view>

		</view>

		<view class="pr" style="z-index: 10;">




			<view class="flex flex-y" style="margin-top: -80rpx;">
				<!-- 订单 -->
				<view class="ml-20 mr-20 flex flex-wrap more-list">
					<view style="width: 100%;" class="fs-32 color-323232"
						@tap.stop="toPage('/pages/order/order','',true)">我的订单</view>
					<view @tap.stop="toPage('/pages/order/order?index=1','',true)"
						class="more-item flex flex-y flex-x-y">
						<view class="more-item-icon">
							<view class="iconfont icon-daifukuan"></view>
						</view>
						<view class="gd">待付款</view>
					</view>
					<view @tap.stop="toPage('/pages/order/order?index=2','',true)"
						class="more-item flex flex-y flex-x-y">
						<view class="more-item-icon">
							<view class="iconfont icon-daifahuo"></view>
						</view>
						<view class="gd">待发货</view>
					</view>

					<view @tap.stop="toPage('/pages/order/order?index=3','',true)"
						class="more-item flex flex-y flex-x-y">
						<view class="more-item-icon">
							<view class="iconfont icon-daishouhuo"></view>
						</view>
						<view class="gd">待收货</view>
					</view>

					<view @tap.stop="toPage('/pages/order/order?index=4','',true)"
						class="more-item flex flex-y flex-x-y">
						<view class="more-item-icon">
							<view class="iconfont icon-daipingjia"></view>
						</view>
						<view class="gd">待评价</view>
					</view>

					<view @tap.stop="toPage('/pages/refund/list','',true)" class="more-item flex flex-y flex-x-y">
						<view class="more-item-icon">
							<view class="iconfont icon-shouhou"></view>
						</view>
						<view class="gd">退款/售后</view>
					</view>

				</view>
				<!-- 订单 -->
				<!-- 其他功能 -->
				<view class="ml-20 mr-20 flex flex-wrap more-list mt-20">
					
					<!-- #ifndef MP-WEIXIN -->
					<view @tap.stop="jumpLive" class="more-item-2 flex flex-y flex-x-y">
						<view class="more-item-icon">
							<image src="../../static/mine/live.png" style="width: 47rpx;height: 40rpx;"></image>
						</view>
						<view class="gd">直播小店</view>
					</view>
					<!-- #endif -->
					<view @tap.stop="toPage('/pages/address/list','',true)" class="more-item-2 flex flex-y flex-x-y">
						<view class="more-item-icon">
							<image src="../../static/mine/1.png" style="width: 40rpx;height: 40rpx;" mode="aspectFill">
							</image>
						</view>
						<view class="gd">地址管理</view>
					</view>
					<view @tap.stop="toPage('/pages/evaluate/evaluate','',true)"
						class="more-item-2 flex flex-y flex-x-y">
						<view class="more-item-icon">
							<image src="../../static/mine/2.png" style="width: 40rpx;height: 40rpx;" mode="aspectFill">
							</image>
						</view>
						<view class="gd">我的评价</view>
					</view>
					<view @tap.stop="toPage('/pages/goods/collection','',true)"
						class="more-item-2 flex flex-y flex-x-y">
						<view class="more-item-icon">
							<image src="../../static/mine/3.png" style="width: 40rpx;height: 40rpx;" mode="aspectFill">
							</image>
						</view>
						<view class="gd">我的收藏</view>
					</view>
					<view @tap.stop="toPage('/pages/liveGift/my','',true)" class="more-item-2 flex flex-y flex-x-y">
						<view class="more-item-icon">
							<image src="../../static/mine/gift.png" style="width: 40rpx;height: 40rpx;"
								mode="aspectFill"></image>
						</view>
						<view class="gd">我的礼物</view>
					</view>
					<!-- <view @tap.stop="toPage('/pages/goods/subscribe','',true)" class="more-item-2 flex flex-y flex-x-y">
						<view class="more-item-icon">
							<image src="../../static/mine/4.png" style="width: 40rpx;height: 40rpx;" mode="aspectFill"></image>
						</view>
						<view class="gd">我的订阅</view>
					</view> -->
					<view @tap.stop="toPage('/pages/user/feedback','',true)" class="more-item-2 flex flex-y flex-x-y">
						<view class="more-item-icon">
							<image src="../../static/mine/5.png" style="width: 40rpx;height: 40rpx;" mode="aspectFill">
							</image>
						</view>
						<view class="gd">意见反馈</view>
					</view>
					<!-- <view @tap.stop="toPage('/pages/test-nvue/test-nvue','')" class="more-item-2 flex flex-y flex-x-y">
						<view class="more-item-icon">
							<image src="../../static/mine/5.png" style="width: 40rpx;height: 40rpx;" mode="aspectFill">
							</image>
						</view>
						<view class="gd">直播</view>
					</view> -->
					<!-- <view @tap.stop="createLive" class="more-item-2 flex flex-y flex-x-y">
						<view class="more-item-icon">
							<image src="../../static/mine/5.png" style="width: 40rpx;height: 40rpx;" mode="aspectFill">
							</image>
						</view>
						<view class="gd">创建直播</view>
					</view> -->
					
					<!-- <view @tap.stop="toPage('/pages/lives-list/lives-list','',true)" class="more-item-2 flex flex-y flex-x-y">
						<view class="more-item-icon">
							<image src="../../static/mine/5.png" style="width: 40rpx;height: 40rpx;" mode="aspectFill">
							</image>
						</view>
						<view class="gd">直播列表</view>
					</view> -->


				</view>
				<!-- 其他功能 -->
			</view>



			<!-- 猜你喜欢 -->
			<!-- <view class="flex flex-x-y mt-20">
				<goods-title></goods-title>
				<list :list="list"></list>
			</view> -->
			<!-- 猜你喜欢 -->








		</view>













		<toast ref="toast"></toast>
		<!-- <fixed-line></fixed-line> -->
		<view style="height: 50rpx;"></view>


		<common></common>
		<fixed-line></fixed-line>



	</view>
</template>

<script>
	export default {
		data() {
			return {

				userinfo: {},
				statusbar: getApp().globalData.statusBar + 0 + 'px',
				pay_code: '',
				shop_info: {
					acticityNum: '0',
					followNum: '0',
					likes: "0",
				},
				coupon: '', //核销优惠券id
				list: [], //商品列表
			};
		},
		computed: {

		},
		mounted() {


		},
		onLoad(e) {

			uni.$on('logout', () => {
				this.userinfo = {};
			})

			// if (this.user_info.isShop == 1) {
			// 	this.shop_info = uni.getStorageSync('shop_info') || this.shop_info;
			// }


			// if (e.q) {
			// 	let query = decodeURIComponent(e.q);
			// 	console.log('query', query);
			// 	let obj = {};
			// 	let arr = String(query.split('?')[1]).split('&').map(val => {
			// 		return val.split('=');
			// 	})
			// 	arr.forEach(val => {
			// 		if (val && val.length == 2) {
			// 			obj[val[0]] = val[1];
			// 		}
			// 	});

			// 	if (obj.coupon) {
			// 		this.coupon = obj.coupon;

			// 		this.hexiao_coupon();

			// 	}
			// }
			// if (!uni.getStorageSync('ACCESS_TOKEN')) {
			// 	this.toPage('/pages/login/login', 'relaunch');
			// }



		},
		onShow() {


			if (this.coupon) {
				this.hexiao_coupon();

			}
			if (!this.login(false)) {
				this.$store.dispatch('refresh_user');
				setTimeout(() => {
					this.get_shop_z();
				}, 500);
				return;
			}



		},
		methods: {
		  jumpLive() {
			  if(this.login()) return ;
				this.request({
					url: '/liveStore/info',
					toast: false,
				}).then(res => {
						console.log('res',res);
					if (res && res.status == 200) {
						this.vuexSet('live_store_info',res.data.liveStore, true);
						let {
							applyFlag,
							applyStatus,
							failReason
						} = res.data
						if (!applyFlag) return this.toPage('/pages/liveStore/firstEntry?status=0', '', true)
						if (applyStatus === 0) return this.toPage('/pages/liveStore/firstEntry?status=1', '', true)
						if (applyStatus === 2) return this.toPage('/pages/liveStore/firstEntry?status=2&failReason=' + failReason, '', true)
						if (applyStatus === 1) return this.toPage('/pages/liveStore/index', '', true)
						
					}
				})
				
			},
			show_shop_code() {
				this.$refs.shop.open();
			},
			get_shop_z() {
				return;
				this.request({
					url: '/myShop/getMyQQ',
					toast: false,
					login: false,
				}).then(res => {
					if (!this.rsuccess(res)) return;
					if (res.data) {
						this.shop_info = res.data;
					} else {
						this.shop_info = {
							acticityNum: '0',
							followNum: '0',
							likes: "0",
						};
					}
					uni.setStorage({
						key: 'shop_info',
						data: this.shop_info,
					})
				});
			},
			get_size(val) {
				if (val) {
					if (String(val).length > 7) {
						return 'font-size:30rpx;'
					}
				}
				return '';
			},
			get_size_2(val) {
				if (val) {
					if (String(val).length > 8) {
						return 'font-size:48rpx;';
					}
				}
				return '';
			},

			//扫码
			saoma() {
				uni.scanCode({
					success: res => {
						let result = res.result || '';
						this.to_page_by_code(result, {
							type: 'writeoff',
							fn: (id) => {
								this.writeoff(id);
							}
						});

					}
				})
			},

			choose_image(url) {

				if (url) {
					uni.previewImage({
						urls: [url]
					})
				}
			},

			to_call() {
				if (!this.CONFIG.SERVER_MOBILE) {
					this.showToast('后台未配置电话号码');
					return;
				}
				this.$refs.toast.open({
					title: '拨打电话',
					desc: `您确定拨打：${this.CONFIG.SERVER_MOBILE}`,
					success: () => {
						uni.makePhoneCall({
							phoneNumber: this.CONFIG.SERVER_MOBILE
						});
					}
				});

			},
			to_info() {
				if (this.user_info.isShop == 1) {
					this.toPage('/pages/store/info');
				} else {
					this.toPage('/pages/user/info');
				}
			},
			writeoff(data) {
				this.request({
					url: '/shopCoupon/writeOff',
					method: 'POST',
					data: {
						data: data,
					},
					loading: true,
				}).then(res => {
					console.log('res.................', res);
					if (!this.rsuccess(res)) return;
					this.coupon = '';
					this.$refs.toast.open({
						title: '',
						desc: '优惠券核销成功',
					});
				});
			},
			//微信摄像头核销优惠券
			hexiao_coupon() {
				setTimeout(() => {
					//先登录

					if (!this.coupon) return;

					if (this.login()) return;


					this.writeoff(this.coupon);
					this.coupon = '';

				}, 500);
			},
			send_push_msg() {
				// this.request({
				// 	url: '/login/push',
				// }).then(res => {
				// 	console.log('ssssssssssss', res);
				// });
				// this.request({
				// 	url: 'https://ee7290a6-32cb-4f46-83a3-4e6d831ca3c6.bspapp.com/sum',
				// 	static: true,
				// 	method: 'POST',
				// 	data: {
				// 		a: '33',
				// 		b: '张三'
				// 	}
				// });

			},
			stop_scoket() {
				getApp().globalData.ssssss = true;
				getApp().globalData.CHAT.CLOSE();

			},
			show_code() {
				this.toPage('/pages/user/code', '', true);
				return;
				// #ifdef APP-PLUS
				let wi = plus.webview.getLaunchWebview();


				// 创建Bitmap对象
				let bitmap = new plus.nativeObj.Bitmap("test");
				// 将首页Webview窗口截图保存到Bitmap中
				wi.draw(bitmap, function() {
					console.log("截图成功");
					uni.saveImageToPhotosAlbum({
						filePath: bitmap,
						success: () => {
							console.log('')
						}
					})
				}, function(e) {
					console.log("截图失败：" + JSON.stringify(e));
				});
				// #endif
			},
			//创建直播
			createLive() {
				if (this.login()) return;
				this.less(() => {

					////////
					this.request({
						url: '/live/createLive',
						data: {
							reckonTime: new Date().getTime(),
							title: '我是直播标题，我是直播标题，我是直播标题。',
							url: 'https://x0.ifengimg.com/res/2020/BD7474ADA41F63478CEDAAB9F0D0A3D26FBFA4F1_size34_w640_h497.jpeg',
							describes: '我是直播描述，我是直播描述，我是直播描述，我是直播描述。',
							goodsList: []
						},
						method: 'POST',
					}).then(res => {
						if (res.status != 200) return;

						this.toPage(`/pages/live/live?liveId=${res.data.id}&status=1`);

					});
					////////

				});
			},
		}
	}
</script>

<style lang="scss">
	page {

		/* #ifdef H5  */
		// min-height: 100vh;
		/* #endif */
		background-color: $pageColor;
		color: #3B4644;
	}

	.item-list-box {
		height: 110rpx;
		border-bottom: 0.5px solid rgba(0, 0, 0, 0.05);
		color: #323232;
		font-size: 28rpx;
		display: flex;
		align-items: center;
	}

	.shop-box {
		height: 100%;
		background: #FFFFFF;
		border-radius: 16rpx;
		box-shadow: 0px 4rpx 12rpx 0px rgba(0, 0, 0, 0.10);
		height: 160rpx;
		flex: 1;

	}

	.show-box-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.show-box-item .v1 {
		line-height: 36rpx;
	}

	.show-box-item .v2 {
		line-height: 48rpx;
		// margin-top: 4rpx;
		color: #FE861E;
		// background-color: red;
	}

	.hexiao {
		position: absolute;
		right: 0;
		top: 30rpx;
		width: 152rpx;
		height: 72rpx;
		color: #333333;
		font-size: 28rpx;
		background: rgba(72, 217, 208, 0.50);
		border-radius: 200rpx 0px 0px 200rpx;
		white-space: nowrap;
	}

	.hexiao-user {
		background-color: rgba(255, 255, 255, 1);
		width: 180rpx;
	}



	.more-item {

		width: 20%;
	}

	.more-item image {
		width: 66rpx;
		height: 66rpx;
	}

	.more-item .gd {
		font-size: 26rpx;
		line-height: 34rpx;
		margin-top: 18rpx;
		line-height: 40rpx;
		color: #323232;

	}

	.gd {
		font-size: 26rpx;
		line-height: 34rpx;
		margin-top: 18rpx;
		line-height: 40rpx;
		color: #323232;

	}

	.more-list {
		padding: 20rpx 20rpx 34rpx 20rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;

	}

	.setting-btn {
		position: absolute;
		right: 38rpx;
		top: -40rpx;
	}

	.more-item-icon {
		width: 54rpx;
		height: 54rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		color: $color;
		font-size: 54rpx;
		margin-top: 20rpx;
	}

	.more-item-2 .more-item-icon {
		align-items: flex-start;
	}

	.more-item-2 {
		width: 25%;
		margin-top: 20rpx;
	}
</style>