<template>
	<view>
		<uni-popup ref="gift" type="bottom">
			<!-- 底部 -->
			<view class="gift-box-bg">
				<!-- 顶部 -->
				<view style="flex-direction: row;justify-content: space-between;padding: 20rpx 0rpx 10rpx 20rpx;align-items: center;">
					<text class="fs-34" style="color:#FBCE2B;">赠送礼物</text>
					<view @tap="close"  style="width: 68rpx;height: 68rpx;padding:20rpx;">
						<image src="@/static/lives/close.png" style="width: 28rpx;height: 28rpx;"></image>
					</view>
				</view>
				<!-- 顶部 -->


				<!-- 礼物列表 -->
				<scroll-view :scroll-y="true" style="height: 600rpx;flex-direction: row;">
					<view style="flex-direction: row;flex-wrap: wrap;justify-content: space-between;padding: 0 20rpx;flex:1;">
						<view @tap.stop="send(item,index)" v-for="(item,index) in list" :key="item.id" class="gift-one-box"
							:class="[checked_index == index?'checked-gift':'']">
							<!-- <image :src="giftSrc" mode="aspectFill" style="width:108rpx;height: 108rpx;"></image> -->
							<template v-if="item.front">
					
								<qq-image :url="item.front" imageStyle="width:94rpx;height: 94rpx;"></qq-image>
					
					
								<view>
									<text class="fs-26 color-ffffff mt-20">{{item.giftName}}x{{item.giftNum || '0'}}</text>
								</view>
								<view
									style="flex:1;flex-direction: row;justify-content: center;align-items: center;margin-top: 6rpx;">
					
									<view class="zengsong" v-if="index == checked_index" @click="sendSure"
										:style="{height:index == checked_index?'50rpx':'0',width:index == checked_index?'172rpx':'0'}">
										<text class="fs-26" style="color:#FFFFFF;">
											{{item.giftNum >0 ?'赠送':'购买'}}
										</text>
									</view>
									<view style="height: 50rpx;line-height: 50rpx;" v-else
										:style="{height:index != checked_index?'50rpx':'0',width:index != checked_index?'172rpx':'0'}">
										<text class="fs-26"
											style="color: #FBCE2B;text-align: center;">{{item.unitPrice}}信币</text>
									</view>
					
								</view>
							</template>
						</view>
						
					
					</view>
				</scroll-view>
				<view style="height: 30rpx;"></view>
				<view :style="{height:safeArea+'px'}"></view>
				<!-- 礼物列表 -->

				<!-- 赠送 -->
				<!-- <view>
					<view style="flex-direction: row;justify-content: flex-end;">
						<view style="" class="send-btn-box">
							<input type="number" :adjust-position="false" v-model="number" @input="input_number"
								@blur="input_blur" style="" class="send-btn-number" />
							<view class="send-btn-text" @tap.stop="click(sendSure)">
								<text style="color:#FFFFFF;font-size: 28rpx;">赠送</text>
							</view>
						</view>
					</view>
					<view :style="{height:safeArea+'px'}"></view>
				</view> -->
				<!-- 赠送 -->

			</view>
			<!-- 底部 -->
		</uni-popup>


		<toast-nvue ref="toast"></toast-nvue>
	</view>
</template>

<script>
	import {
		getLiveGiftList,
		brushGifts
	} from '@/pages/live/api/live.js';


	export default {
		name: 'sendGift',
		props: {
			roomId: {
				type: [String, Number],
				default: ''
			},
			liveId: {
				type: [String, Number],
				default: ''
			}
		},
		data() {
			return {
				beike: '',
				screenHeight: getApp().globalData.screenHeight,
				screenWidth: getApp().globalData.screenWidth,
				safeArea: getApp().globalData.safeArea,
				show: false,
				giftShow: false,
				list: [
					//
					// {
					// 	front: '../../static/lives/gift-zan.png',
					// 	unitPrice: '1',
					// 	giftNum: 100,
					// 	giftName: '百事可乐'
					// },

				],
				checked_index: 0,
				number: 1,
				gift_obj: {},
			}
		},
		created() {
			this.list = uni.getStorageSync('liveGiftList') || [];
			this.set_gift_obj();
			this.get_list();
			uni.$on('refresh_gift_list', () => {
				this.get_list();
			});
			uni.$on('send_live_gift', (data) => {
				this.romote_send_gift(data);
			});
			uni.$on('showLivesGift', () => {
				this.open();
			});
		},
		destroyed() {
			if (uni) {
				uni.$off('refresh_gift_list');
				uni.$off('send_live_gift');
				uni.$off('showLivesGift');
			}
		},

		methods: {
			aa() {

			},
			click(fn, ...params) {
				let newTime = new Date().getTime();
				if ((!this.onoff1 || (newTime - this.onoff1 > 500)) && fn) {
					this.onoff1 = newTime;
					fn(...params);
				} else {
					console.log("请稍后点击")
				}
			},
			showToast(title = "", duration = 2000, icon = "none") {

				// #ifdef APP-PLUS || APP-NVUE
				plus.nativeUI.toast(title);
				// #endif

				// #ifndef APP-PLUS || APP-NVUE
				uni.showToast({
					title,
					icon,
					duration
				})
				// #endif

			},
			toBuy() {
				uni.navigateTo({
					url: `/pages/chat/buy-live-gift`,
				})
			},
			open() {
				this.$refs.gift.open();
			},
			close() {

				this.$refs.gift.close();
			},
			send(item, index) {
				if (item.front) {
					this.checked_index = index;
				}
			},
			sendSure() {

				if (this.list.length == 0) return;
				let item = this.list[this.checked_index];
				let index = this.checked_index;
				// if (item.giftNum <= 0 || item.giftNum < Number(this.giftNum)) {
				// 	this.showToast('该礼物数量不足，赶紧去购买吧');
				// 	return;
				// }
				if (item.giftNum < 1) {
					this.showToast('该礼物数量不足，赶紧去购买吧');
					uni.navigateTo({
						url:'/pages/liveGift/my?source=live',
					})
					return;
				}
				////////////////
				// uni.$emit('sendOneGift',{
				// 	id:new Date().getTime(),
				// 	name:this.list[this.checked_index].name,
				// 	imgUrl:this.list[this.checked_index].front,
				// 	num:1,
				// 	userName:'张三',
				// });

				brushGifts(this.list[this.checked_index].id, this.liveId, 1).then(res => {
					if (res.status == 200) {
						item.giftNum = item.giftNum - 1;
						this.$set(this.list, index, JSON.parse(JSON.stringify(item)));
					}
				});

				return;
				////////////////
				this.$refs.toast.open({
					desc: '确定赠送？',
					success: () => {


					}
				});
				// this.$emit('send',item);
			},
			get_list() {
				getLiveGiftList().then(res => {
					
					console.log('我的礼物', res);
					if (res.status == 200 && res.data && res.data.list) {
						this.checked_index = 0;
						let arr = res.data.list;
						let len = 0;
						if (arr.length % 4 == 0) {

						} else {
							len = 4 - (arr.length % 4);
						}
						let id = 11111;
						for (let i = 0; i < len; i++) {
							arr.push({
								id: id++,
							});
						}
						this.list = arr;
						this.set_gift_obj();
						uni.setStorage({
							key:'liveGiftList',
							data:arr
						});
					}
				});
			},
			input_number() {
				this.$nextTick(() => {
					if (!this.number) {
						this.number = '';
					} else {
						this.number = parseInt(this.number);
					}

				})
			},
			input_blur() {
				this.$nextTick(() => {
					if (!this.number) {
						this.number = 1;
					} else {
						this.number = parseInt(this.number);
					}

				})
			},
			set_gift_obj() {
				this.list.forEach((val => {
					this.gift_obj[val.id] = val;
				}))
			},
			romote_send_gift(data) {
				if (data.roomId == this.roomId) {
					// if (!this.gift_obj[data.giftId]) return;
					// let item = JSON.parse(JSON.stringify(this.gift_obj[data.giftId]));
					// item.num = data.num;
					// item.userName = data.userName;
					// console.log('item', item);
					// this.$emit('send', item);
					// uni.$emit('live_add_gift_line', item);
					uni.$emit('sendOneGift', {
						id: new Date().getTime(),
						imgUrl: data.url,
						num: data.number,
					});
					uni.$emit('live_add_gift_line', {
						userName: data.userName,
						name: data.giftName,
						num: data.number,
						color: '#5ED1FD',
					});
				}
			}
		}
	}
</script>

<style>
	.gift-box-bg {

		background-color: #191621;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
	}



	.buy-gift-btn {
		padding: 0 18rpx;
		justify-content: center;
		align-items: flex-end;
		height: 54rpx;
		border-radius: 30rpx;
		/* background-color: #6F37A0; */
		background-image: linear-gradient(to right, #E7548C, #5130A6);
	}

	.gift-one-box {
		width: 174rpx;
		padding-top: 30rpx;
		justify-content: center;
		align-items: center;
		margin-top: 20rpx;
		border: 0.5px solid rgba(0, 0, 0, 0);
	}

	.checked-gift {

		border-radius: 20rpx;
		border: 0.5px solid #FFFFFF;
	}

	.send-btn-box {

		flex-direction: row;
		align-items: center;
		margin-bottom: 40rpx;
		height: 70rpx;
		width: 200rpx;

		margin-top: 20rpx;
	}

	.send-btn-text {
		width: 100rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		background-color: #2F95FD;
		border-radius: 0 36rpx 36rpx 0;
		height: 66rpx;
		justify-content: center;
		align-items: center;
		/* background-image: linear-gradient(to right, #E7548C, #5130A6); */
	}

	.send-btn-number {
		width: 100rpx;
		text-align: center;
		border-radius: 36rpx 0 0 36rpx;
		background-color: #FFFFFF;
		height: 50rpx;
		color: #333333;
	}

	.zengsong {
		width: 172rpx;
		height: 50rpx;
		background-color: #F8791A;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
	}
</style>