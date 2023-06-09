<template>
	<view class="flex flex-y-center fs-28 color-ffffff">
		<view class="tiem-item" :class="index?'tiem-item1':''">
			{{time_str[0]}}
		</view>
		<view class="dot" :class="index?'dot1':''">:</view>
		<view class="tiem-item" :class="index?'tiem-item1':''">
			{{time_str[1]}}
		</view>
		<view class="dot" :class="index?'dot1':''">:</view>
		<view class="tiem-item" :class="index?'tiem-item1':''">
			{{time_str[2]}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "countdown",
		data() {
			return {
				time_num: 0,
				time_str: ['00', '00', '00']
			};
		},
		props: {
			time: {
				type: Number | String,
				default: 0,
			},
			index: {
				type: Number | String, //0: 首页  1: 商品详情页
				default: 0,
			}
		},
		watch: {
			time(value) {
				clearTimeout(this.timer_count);
				if (Number(value) >= 0) {
					this.time_num = Number(value);
					this.set_time();
				}
			}
		},
		created() {
			this.time_num = this.time;
			if (this.time_num > 0) {
				this.set_time();
			}
		},
		methods: {
			set_time(time) {
				let countdown = () => {
					this.get_hms();
					this.timer_count = setTimeout(() => {
						this.time_num--;
						if (this.time_num >= 0) {
							countdown();
						} else {
							this.$emit('init');
							console.log('初始化');
						}
					}, 1000)

				}
				countdown();
			},
			get_hms() {

				let time = this.time_num;

				let h = parseInt(time / 3600);
				if (String(h).length == 1)
					h = '0' + String(h);
				time = time % 3600;
				let m = parseInt(time / 60);
				if (String(m).length == 1)
					m = '0' + String(m);
				time = time % 60;
				let s = time;
				if (String(s).length == 1)
					s = '0' + String(s);
				this.time_str = [String(h), String(m), String(s)];
				// console.log(this.time_str, 'this.time_str')

			},
		}
	}
</script>

<style scoped>
	.tiem-item {
		height: 40rpx;
		min-width: 40rpx;
		padding: 0 4rpx;
		background-color: #FF5F52;
		border-radius: 4rpx;
		text-align: center;
	}

	.tiem-item1 {
		background-color: #fff;
		color: #FF3434;
	}

	.dot {
		color: #323232;
		padding: 0 1rpx;
	}
	.dot1 {
		color: #fff;
		margin: 0 5rpx;
	}
</style>
