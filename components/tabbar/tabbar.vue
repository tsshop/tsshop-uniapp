<template>
	<view>
		<view class="tabber-heigth">
			<view style="position: fixed;bottom: 0;width: 100vw;left: 0;z-index: 90;">
				<view class="tabbar-box">
					<!-- 内容开始 -->
					<view class="tabbar-list flex-y-center">
						<view @tap.stop="toPage(item.path,'switch')" v-for="(item,index1) in list" :index="index1"
							:key="index1" class="tabbar-item"
							v-if="(item.index != 1) || (item.index == 1 && appType == 'yong')">
							<template>
								<view class="image">
									<image :src="index == item.index ? item.src2:item.src"
										style="width: 100%;height: 100%;"></image>
								</view>
								<view class="tabbar-name" :class="index == item.index?'tabbar-item-active':''">
									{{item.name}} 
								</view>
							</template>

						</view>
					</view>
					<!-- 内容结束 -->
					<view :style="{height:safeArea}"></view>

				</view>
			</view>
		</view>
		<view :style="{height:safeArea}"></view>
	</view>
</template>

<script>
	export default {
		name: "tabbar",
		props: {
			index: {
				type: Number,
				default: 0,
				appType: uni.getStorageSync('appType') || 'yong',
			}
		},
		created() {
			this.appType = uni.getStorageSync('appType') || 'yong';

		},
		data() {
			return {
				safeArea: getApp().globalData.safeArea + 'px',
				list: [{
						name: '检测',
						src: '../../static/tabbar1-1.png',
						src2: '../../static/tabbar1-2.png',
						index: 0,
						path: '/pages/index/index',
					},
					//#ifndef MP-WEIXIN
					{
						name: '家人',
						src: '../../static/tabbar2-1.png',
						src2: '../../static/tabbar2-2.png',
						index: 1,
						path: '/pages/family/family',
					},
					//#endif
					{
						name: '我的',
						src: '../../static/tabbar3-1.png',
						src2: '../../static/tabbar3-2.png',
						index: 2,
						path: '/pages/user/user',
					}
				]
			};
		}
	}
</script>

<style lang="scss" scoped>
	.tabber-heigth {
		width: 100vw;
		// height: 148rpx;
		position: relative;
		z-index: 90;
	}

	.tabbar-box {
		width: 100vw;
		// height: 148rpx;
		background-color: #FDFFFF;
		z-index: 90;
		position: relative;
	}

	.tabbar-list {
		display: flex;
		height: 108rpx;
		align-items: center;

	}

	.tabbar-item {
		flex: 1;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
		padding-top: 6rpx;

		.image {
			width: 46rpx;
			height: 46rpx;
			display: flex;
			justify-content: center;
			align-items: center;

		}

		.tabbar-name {
			font-size: 20rpx;
			color: #AFBAB8;

		}
	}

	.tabbar-item-active {
		color: #46D9C9 !important;
	}

	.tabbar-box {
		animation: jianbian 0.5s;
	}

	@keyframes jianbian {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}
</style>
