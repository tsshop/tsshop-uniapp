<template>
	<view style="" class="flex flex-x-b flex-y-center" :class="scroll?'scroll flex-x-start':''"
		:style="{height,'padding-bottom':paddingB}">

		<template v-if="!scroll && mode === 1">
			<view @tap="channge(key)" style="height: 100%;" class="flex flex-y-center" v-for="(item,key) in list"
				:key="key">
				<view class="tabs-item" :class="tab_index == key ?'tab-active':''"
					:style="size?'font-size:' + (tab_index == key?sizeActive:size):''">
					<text class="pr" style="z-index: 3;">{{item.name}}</text>
				</view>
			</view>
		</template>
		<template v-if="scroll && mode ===1">
			<view @tap="channge(key)" style="height: 100%;display: inline-block;" class="flex flex-y-center"
				v-for="(item,key) in list" :key="key">
				<view class="tabs-item" style="margin-right: 36rpx;" :class="tab_index == key ?'tab-active':''"
					:style="size?'font-size:' + (tab_index == key?sizeActive:size):''">
					<text class="pr" style="z-index: 3;">{{item.name}}</text>
				</view>
			</view>
		</template>

		<template v-if="mode ===2">
			<view @tap="channge(key)" style="height: 100%;display: inline-block;" class="flex flex-y-center"
				v-for="(item,key) in list" :key="key">
				<view class="tabs-item flex flex-x-y" style="margin-right: 36rpx;height: 100%;" :class="tab_index == key ?'tab-active1':''"
					:style="size?'font-size:' + (tab_index == key?sizeActive:size):''">
					<text class="pr" style="z-index: 3;">{{item.name}}</text>
				</view>
			</view>
		</template>

	</view>
</template>

<script>
	export default {
		name: "tabs",
		props: {
			list: {
				type: Array,
				default: () => {
					return []
				}
			},
			height: {
				type: String,
				default: '100rpx'
			},
			index: {
				type: Number,
				default: 0,
			},
			//下边距
			paddingB: {
				type: String,
				default: '0rpx'
			},
			//是否可左右滑动
			scroll: {
				type: Boolean,
				default: false,
			},
			size: {
				type: String,
				default: '30rpx',
			},
			sizeActive: {
				type: String,
				default: '30rpx',
			},
			mode: {
				type:Number,
				default:2
			}


		},
		computed: {

		},
		created() {
			this.tab_index = this.index;
		},
		data() {
			return {
				tab_index: 0,
			};
		},
		methods: {
			channge(index) {
				this.tab_index = index;
				this.$emit('change', index);
			}
		}
	}
</script>

<style lang="scss">
	.tabs-item {

		color: #AFBAB8;
		font-weight: 400;
		font-size: 30rpx;
		border-radius: 16rpx 0 16rpx 0;
		// padding-top: 10rpx;
	}

	.tab-active {

		font-weight: 500;
		font-size: 40rpx;
		padding-top: 0rpx;
		position: relative;
		color: $color;
		transition: color 0.6s;
	}

	.tab-active::after {
		content: '';
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 0rpx;
		width: 68rpx;
		height: 8rpx;
		background: #46D9C5;
		border-radius: 4px;
		animation: show-hiden 0.6s;

	}

	.tab-active1 {
		//font-weight: 500;
		//font-size: 40rpx;
		font-size: 30rpx;
		padding-top: 0rpx;
		position: relative;
		color: $color;
		transition: color 0.6s;
		&::after {
			content: '';
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 0rpx;
			width: 100%;
			height: 8rpx;
			background: $color;
			border-radius: 4px;
			animation: show-hiden 0.6s;
		}
	}

	@keyframes show-hiden {
		0% {
			opacity: 0;
			// bottom: -6rpx;
		}

		50% {
			// bottom: 0rpx;
		}

		100% {
			opacity: 1;
			// bottom: 0rpx;
		}
	}

	.scroll {
		white-space: nowrap;
	}
</style>
