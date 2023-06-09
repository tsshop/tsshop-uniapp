<template>
	<view class="lqq-custom" :style="{'height':height?height:(customBar+'px')}">
		<!--头部导航栏 -->
		<view @tap.stop="double_click" class="lqq-content"
			:class="{'mode1':mode == 1,'mode2':mode == 2,'otherMode':btnMode == 2 && mode == 2}"
			:style="{'height': customBar   + 'px','padding-top':statusBar+'px','background':background,'position':(fixed?fixed:'relative'),'border-bottom':border}">
			<view class="lqq-left" :style="{'height':customBar - statusBar +'px'}">
				<text @click="goback" v-if="!hiddenBtn&&btnMode==1" :style="{'color':backColor}"
					class="iconfont icon-back-1 aaa blod" style="font-size: 36rpx;"></text>
				<view class="btnMode2"
					:style="{'border-color':borderColor,'border-radius':(customHeight/2) + 'px','color':backColor,'height':'58rpx','background-color':houseBackgroundColor} "
					v-if="!hiddenBtn&&btnMode==2">
					<text @click="goback" class="btnIcon iconfont icon-back-1" style="font-size: 36rpx;"></text><text @click="goback2"
						class="btnIcon iconfont icon-zhuye color-red"><text style="padding-left: 8rpx;font-size: 28rpx;">商城</text></text>
					
					<view class="line-line" :style="{'background-color':lineColor || backColor}">

					</view>
				</view>
				<slot name="left"></slot>
			</view>
			<view class="lqq-center text-hidden" :style="{'height':customBar - statusBar +'px'}">
				<text class="text-hidden" style="max-width: 400rpx;" :style="{'color':titleColor,'font-weight':titleBold?'550':'400'}">{{title}}</text>
				<slot name="center"></slot>
			</view>
			<view class="lqq-right" :style="{'height':customBar - statusBar +'px'}">
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'custom',
		data() {
			return {
				customBar: getApp().globalData.customBar,
				statusBar: getApp().globalData.statusBar,
				customHeight: getApp().globalData.custom.height || (getApp().globalData.custom.bottom - getApp().globalData
					.custom.top) || 0,
				qqq: 0,
			};
		},
		props: {
			//是否固定，不会随着页面滚动
			fixed: {
				type: String,
				default: ''
			},
			//整个导航栏的高度决定是否占高
			height: {
				type: String,
				default: ''
			},
			//背景色，background属性
			background: {
				type: String,
				default: '#FFFFFF'
			},
			//显示模式 ，1：所有元素左浮动效果，2：标题居中显示
			mode: {
				type: [String, Number],
				default: 2
			},
			//中部标题
			title: {
				type: String,
				default: ''
			},
			//标题样式颜色
			titleColor: {
				type: String,
				default: '#32343A'
			},
			//返回按钮样式颜色
			backColor: {
				type: String,
				default: '#32343A'
			},
			//隐藏返回按钮
			hiddenBtn: {
				type: Boolean,
				default: false
			},
			//返回按钮模式 1 普通模式***  2 双按钮模式
			btnMode: {
				type: [String, Number],
				default: 1
			},
			// 边框的颜色
			borderColor: {
				type: String,
				default: 'rgba(0,0,0,1)'
			},
			//双按钮背景色 又透明度
			houseBk: {
				type: Boolean,
				default: false
			},
			lineColor: {
				type: String,
				default: ''
			},
			// 是否用自己的返回按钮
			pageBack: {
				type: Boolean,
				default: false
			},
			//显示下边框
			border: {
				type: String,
				default: 'none',
			},
			titleBold:{
				type:Boolean,
				default:true
			}

		},
		methods: {
			goback() {
				if (this.pageBack) {
					this.$emit('goback')
				} else {
					this.uniBack();
				}
			},
			goback2() {
				uni.reLaunch({
					url: "/pages/index/index",
					fail: res => {
						uni.reLaunch({
							url: '/pages/qinUnion/qinUnion'
						})
					}
				})
			},
			//双击头部返回顶部
			double_click() {

				this.qqq++;
				if (this.qqq == 2) {
					uni.pageScrollTo({
						duration: 200,
						scrollTop: 0
					});
					this.qqq = 0;
				}

			}
		},
		computed: {
			houseBackgroundColor() {
				if (this.houseBk)
					return 'rgba(255, 255, 255, 0.7)';
				return 'rgba(255, 255, 255, 0)';
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lqq-custom {
		width: 100%;
		position: relative;
		z-index: 999;

		.lqq-content {
			overflow: hidden;
			width: 100%;
			// transition:background  0.3s;

			.lqq-left,
			.lqq-right,
			.lqq-center {
				display: flex;
				flex-flow: row nowrap;
				align-items: center;

				text {
					font-size: 36rpx;
				}
			}

		}

		.mode1 {
			display: flex;
			flex-flow: row nowrap;

			.lqq-left,
			.lqq-right,
			.lqq-center {
				display: flex;
				flex-flow: row nowrap;
				align-items: center;
				// color: #FFFFFF;
			}

			.lqq-left {
				padding-left: 30rpx;
				box-sizing: border-box;
				.aaa {
					width: 50rpx;
					height: 100%;
					display: flex;
					flex-flow: row nowrap;
					justify-content: center;
					align-items: center;
					font-weight: bold;
					
					
				}
			}

			.lqq-center {
				padding-left: 20rpx;
				font-size: 32rpx;
			}

		}

		.mode2 {
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			justify-content: space-between;

			.lqq-left {
				width: 70rpx;
				padding-left: 20rpx;
				box-sizing: border-box;
				// color: #FFFFFF;
				font-size: 20rpx;
				display: flex;
				flex-flow: row nowrap;
				align-items: center;

				.aaa {
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.lqq-right {
				width: 70rpx;
				display: flex;
				flex-flow: row nowrap;
				align-items: center;
			}

			.lqq-center {
				flex: 1;
				text-align: center;
				// color: #FFFFFF;
				display: flex;
				flex-flow: row nowrap;
				align-items: center;
				justify-content: center;
				font-size: 36rpx;
			}
		}
	}

	.btnMode2 {
		// width: 158rpx;
		width: 200rpx;
		border: 0.5px solid #FFFFFF;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		position: relative;

		.btnIcon {
			// width: 50%;
			width:35%;
			height: 100%;
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			
		}
		.btnIcon:nth-of-type(2){
			width: 65%;
			// background-color: red;
		}
		

		.line-line {
			position: absolute;
			content: "";
			left:35%;
			top: 50%;
			transform: translateY(-50%);
			width: 0.5px;
			height: 36rpx;
			opacity: 0.6;
		}
	}

	.lqq-custom {
		.otherMode {
			.lqq-left {
				width: 240rpx;
			}


			.lqq-right {
				// width: 180rpx;
				width: 240rpx;
			}

			.lqq-center {
				white-space: nowrap;
				text-overflow: ellipsis;

			}
			
		}
		
	}
	
</style>
