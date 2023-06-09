<template>
	<view class="likes-box">

		<!-- 按钮 -->
		<view @tap="click_likes" class="likes-btn"></view>
		<!-- 按钮 -->

		<!-- 爱心 -->
		<view class="likes-item-box"
			:style="{right:item.right,bottom:item.bottom,transform:item.transform,opacity:item.opacity}"
			v-for="(item,index) in likesArr" :key="item.id">
			<view :style="{width:item.size,height:item.size,transform:item.rotate}">
				<text class="iconfont1" :style="{fontSize:item.size,color:item.color}">&#xeca1;</text>
			</view>
		</view>
		<!-- 爱心 -->
	</view>
</template>

<script>
	import {
		toLivePraise
	} from '@/pages/live/api/live.js';
	export default {
		name: 'likes',
		props: {
			roomId: {
				type: [String, Number],
				default: '',
			},
			liveId: {
				type: [String, Number],
				default: '',
			}
		},
		data() {
			return {
				colors: ['#E03B3E', '#FBB3B4', '#39BEE7', '#FEDC00', '#FF6B03', '#AEDDE3', '#EC9987', '#C74D66', '#AEDEDD',
					'#FABFC7', '#EF4860', '#CFE667', '#9B5CB6', '#AA57BC', '#D4513B', '#F95E4D', '#F21A25', '#F31B27',
					'#FB7449', '#ED252D', '#BF0020', '#E21F26', '#E2E8BF'
				],
				likesArr: [],
				number: 0,
			}
		},
		methods: {
			click_likes() {
				this.toLivePraise();
				
				let time = new Date().getTime();
				if (this.lastTime) {
					//隔好久点一下
					if (time - this.lastTime > 500) {
						this.addOne(time, 90, this.colors[0]);
					} else {
						this.addOne(time + 1);
						this.addOne(time + 2);
						if (Math.random() > 0.5) {
							this.addOne(time + 3);
						}
						if (Math.random() > 0.5) {
							this.addOne(time + 4);
						}
					}

				} else {
					this.addOne(time, 90, this.colors[0]);
				}

				this.lastTime = time;

			},
			addOne(ids, sizes, color) {
				getApp().globalData.liveLikeClick && getApp().globalData.liveLikeClick();
				let id = ids;
				let size = sizes || parseInt(Math.random() * 40) + 50;
				let right = 20 + (45 - (size / 2));
				let lastRgiht = right;
				if (size < 70) {
					right = right += ((75 - right) / 2) * (Math.random() > 0.5 ? -1 : 1);
				}

				let rotate = `rotate(${Math.random()*10* (lastRgiht < right ? -1 : 1)}deg)`;
				if (size < 70) {
					rotate = `rotate(${Math.random()*20* (lastRgiht < right ? -1 : 1)}deg)`;
				}
				if (size > 80) {
					rotate = `rotate(0deg)`;
				}
				this.likesArr.push({
					color: color || this.colors[parseInt(Math.random() * this.colors.length)],
					size: size + 'rpx',
					bottom: `${100+parseInt(Math.random()*40)}rpx`,
					right: right + 'rpx',
					opacity: 0.9,
					id,
					transform: 'translate(0,0) scale(0.9)',
					rotate: rotate,
				});



				// #ifndef H5
				// this.$nextTick(() => {
				// 	this.changeStyle(id);
				// });
				setTimeout(() => {
					this.changeStyle(id);
				}, 20);
				// #endif
				// #ifdef H5
				setTimeout(() => {
					this.changeStyle(id);
				}, 20);
				// #endif
				clearTimeout(this.clearTime);
				this.clearTime = setTimeout(() => {
					this.likesArr = [];
				}, 3000);
				
			},
			changeStyle(id) {
				this.likesArr.some(val => {
					if (val.id == id) {
						val.opacity = 0;
						val.transform = `translate(0,-${Math.random()*150+250}rpx) scale(1.1)`;
						return true;
					}
					return false;
				})
			},
			toLivePraise() {
				//点赞 
				this.number++;
				clearTimeout(this.timerLike);
				this.timerLike = setTimeout(() => {
					console.log(this.liveId, this.number)
					toLivePraise(this.liveId, this.number);
					this.number = 0;
				}, 1000);
			},
		}
	}
</script>

<style>
	.likes-box {
		position: fixed;
		bottom: 50rpx;
		right: 20rpx;
	}

	.likes-btn {
		width: 90rpx;
		height: 90rpx;
	}



	.likes-item-box {
		position: fixed;
		transform: translate(0, 0px);
		bottom: 150rpx;
		right: 60rpx;
		opacity: 1;
		transition: transform 2.6s, opacity 2.6s ease-in;

	}

	/* #ifdef H5 */
	@font-face {
		font-family: 'iconfont1';
		/* Project id 4083804 */
		src: url('//at.alicdn.com/t/c/font_4083804_gl9spfdbu8f.ttf?t=1685519407301');
	}

	.iconfont1 {
		font-family: iconfont1;
	}

	/* #endif */
</style>