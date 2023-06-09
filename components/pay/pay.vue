<template>
	<view>
		<uni-popup ref="pay" type="bottom">
			<view class="pay-box" @touchmove.stop.prevent="clear">
				<view style="padding:  0 30rpx;">
					<view class="flex flex-x-b flex-y-center title-box color-000000">
						<view @tap.stop="close" class="pay-icon">
							<view class="iconfont icon-cuo blod" style="font-size: 38rpx;"></view>
						</view>
						<view class="pay-title fs-28 ">请输入支付密码</view>
						<view class="pay-icon"></view>
					</view>

					<view class="money flex flex-x-y" style="height: 80rpx;">
						<!-- <image v-if="type == 1" style="width: 70rpx;height: 70rpx;margin-left: -20rpx;"
							src="../../static/erqi/mine/beike.png" mode=""></image>
						<image v-else style="width: 70rpx;height: 70rpx;" src="../../static/erqi/mine/zhenzhu.png"
							mode=""></image> -->
						<view>{{money}}</view>
					</view>

					<view v-if="text" style="padding:0 30rpx;" class="fs-24 color-999999 mt-20">
						{{text}}
					</view>

					<view class="pay-line"></view>
				</view>

				<!-- 密码块 -->
				<view class="pay-list">
					<view v-for="(item,index) in num_list" :key="index" class="pr pay-item "
						:class="password.length>=item?'pay-active':''"></view>


				</view>
				<!-- 密码块 -->


				<view class="flex flex-wrap num-list">

					<view @touchstart.stop="change_num(1)" hover-class="click-bg" hover-stay-time="50"
						hover-start-time="10" class="num-btn">1</view>
					<view @touchstart.stop="change_num(2)" hover-class="click-bg" hover-stay-time="50"
						hover-start-time="10" class="num-btn">2</view>
					<view @touchstart.stop="change_num(3)" hover-class="click-bg" hover-stay-time="50"
						hover-start-time="10" class="num-btn">3</view>

					<view @touchstart.stop="change_num(4)" hover-class="click-bg" hover-stay-time="50"
						hover-start-time="10" class="num-btn">4</view>
					<view @touchstart.stop="change_num(5)" hover-class="click-bg" hover-stay-time="50"
						hover-start-time="10" class="num-btn">5</view>
					<view @touchstart.stop="change_num(6)" hover-class="click-bg" hover-stay-time="50"
						hover-start-time="10" class="num-btn">6</view>

					<view @touchstart.stop="change_num(7)" hover-class="click-bg" hover-stay-time="50"
						hover-start-time="10" class="num-btn">7</view>
					<view @touchstart.stop="change_num(8)" hover-class="click-bg" hover-stay-time="50"
						hover-start-time="10" class="num-btn">8</view>
					<view @touchstart.stop="change_num(9)" hover-class="click-bg" hover-stay-time="50"
						hover-start-time="10" class="num-btn">9</view>

					<view class="num-btn no-bg"></view>
					<view @touchstart.stop="change_num('0')" hover-class="click-bg" hover-stay-time="50"
						hover-start-time="10" class="num-btn">0</view>
					<view @touchstart.stop="reduce" class="num-btn no-bg">
						<view class="iconfont icon-shanchu-yichu-13" style="font-size: 50rpx;color: #000;"></view>
					</view>

				</view>


			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "pay",
		data() {
			return {
				money: '0.00',
				password: '',
				num_list: [1, 2, 3, 4, 5, 6],
				type: 1,
				text: '',
			};
		},
		mounted() {
			// this.$refs.pay.open();
			// this.music = uni.createInnerAudioContext();

			// this.music.src = '../../static/images/dazi.mp3';
			// this.music.playbackRate = 2;


		},
		methods: {
			open(obj = {}) {
				this.money = this.xs(obj.money, 2);
				this.$refs.pay.open();
				if (obj.type) {
					this.type = obj.type;
				}
				if (obj.text) {
					this.text = obj.text;
				}
			},
			change_num(num) {
				this.play();
				if (this.password.length <= 5) {
					this.password += String(num);

				}
				if (this.password.length == 6) {
					//输入完成
					setTimeout(() => {
						this.$emit('success', this.password);
						this.$refs.pay.close();
						this.password = '';
					}, 200)
				}

				// console.log('this.password', this.password);
			},
			reduce() {
				this.play();
				if (this.password.length > 0) {
					let str_arr = this.password.split('');
					str_arr.pop();
					this.password = str_arr.join('');
				}

				// console.log('this.this.password', this.password);
			},
			close() {
				this.$refs.pay.close();
			},
			play() {
				return;
				if (this.music && this.music.stop) {
					this.music.stop();
					this.music.play();
				}
			},

		},
	}
</script>

<style lang="scss">
	.pay-box {
		background-color: #FFFFFF;
		border-radius: 20rpx 20rpx 0 0;
		padding: 20rpx 0 0 0;
		transform: translateY(160rpx);
		/* #ifdef H5 */
		transform: translateY(40rpx);
		/* #endif */
	}

	.pay-icon {
		width: 80rpx;
	}

	.title-box {
		height: 100rpx;

	}

	.money {
		font-size: 60rpx;
		color: #000;
		font-weight: bold;
	}

	.pay-line {

		height: 0.5px;

		margin-top: 40rpx;
		margin-bottom: 20rpx;
		background-color: #EDEDED;
	}

	.pay-list {
		display: flex;
		justify-content: center;
		margin: 60rpx 0;
	}

	.pay-item {
		width: 70rpx;
		height: 70rpx;
		background-color: #F2F2F2;
		border-radius: 6rpx;
	}

	.pay-active::after {
		content: "";
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 18rpx;
		height: 18rpx;
		background-color: #000000;
		border-radius: 50%;
	}

	.pay-item+.pay-item {
		margin-left: 16rpx;
	}

	.num-list {
		margin-top: 0;
		background-color: #EDEDED;
		padding-bottom: 170rpx;
	}

	.num-btn {
		width: 33.33%;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100rpx;
		font-size: 44rpx;
		border-top: 0.5px solid #EDEDED;
		border-right: 0.5px solid #EDEDED;
		background-color: #FFFFFF;
	}

	.num-btn:nth-of-type(3n) {
		border-right: none;
	}

	.no-bg {
		background-color: rgba(0, 0, 0, 0);
	}

	.click-bg {
		background-color: #EDEDED;
	}
</style>
