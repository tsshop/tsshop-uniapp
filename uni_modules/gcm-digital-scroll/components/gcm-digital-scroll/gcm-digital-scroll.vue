<!-- 数字滚动效果 -->
<template>
	<view class="digital-scroll"
		:style="`font-size: ${size}px;color:${color};justify-content: ${textAlign == 'center' ? 'center' : textAlign == 'right' ? 'flex-end' : 'flex-start'};`">
		<view v-for="(item, index) in digitalData" :key="index"
			:class="{'digital': true, 'digital-str': isNaN(item.num)}">
			<!-- 符号显示 -->
			<view v-if="isNaN(item.num)">{{item.num}}</view>
			<!-- 滚动的列表 -->
			<view v-else class="scroll-num">
				<view class="tra-num" :style="item.style">0123456789</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 数值
			value: {
				type: [Number, String],
				default: '8.88'
			},

			// 字体大小
			size: {
				type: [Number, String],
				default: '14'
			},

			// 字体颜色
			color: {
				type: String,
				default: '#333'
			},

			// 文字居中
			textAlign: {
				type: String,
				default: 'center' // left, center, right
			}
		},

		data() {
			return {
				digitalData: []
			}
		},

		watch: {
			value: {
				handler(val) {
					const digitalArr = String(val).split('')
					const dataList = []
					digitalArr.forEach((num) => {
						const obj = {
							num: isNaN(num) ? num : Number(num),
							style: ''
						}
						dataList.push(obj)
					})
					this.digitalData = dataList
					this.setScrollNum()
				},
				immediate: true
			}
		},

		methods: {
			// 滚动数字
			setScrollNum() {
				const defData = JSON.parse(JSON.stringify(this.digitalData))
				defData.forEach((item, index) => {
					// 设置移动距离
					item.style = `transform: translateY(-${item.num}em);`
				})
				setTimeout(() => {
					this.digitalData = defData
				}, 10)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.digital-scroll {
		font-size: 28rpx;
		font-weight: bold;
		display: flex;
		align-items: center;

		.digital {
			display: flex;
			justify-content: center;
			width: 0.7em; // 0.7em 是为了让文本间隔没那么宽
			height: 1em;
			line-height: 0.7em;
			overflow: hidden;

			.scroll-num {
				// 文本竖直排列
				writing-mode: vertical-rl;
				text-orientation: upright;

				.tra-num {
					transition: all 1s;
				}
			}
		}

		.digital-str {
			width: auto;
			line-height: 1em;
		}
	}
</style>
