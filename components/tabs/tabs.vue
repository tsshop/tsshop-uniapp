<template>
	<view class="flex flex-x-b flex-y-center" :class="scroll?'scroll flex-x-start':''"
		:style="{height,'padding-bottom':paddingB}">

		<template v-if="!scroll">
			<view @tap="channge(key)" style="height: 100%;" class="flex flex-x-y" v-for="(item,key) in list" :key="key">
				<view class="tabs-item" style="white-space: nowrap;" :style="tab_index == key?'':'padding:0 10rpx;'"
					:class="tab_index == key ?'tab-active':''">{{item.name}}</view>
			</view>
		</template>

		<template v-else>
			<view @tap="channge(key)" style="height: 100%;" class="flex flex-x-y " v-for="(item,key) in list"
				:key="key">
				<view class="tabs-item" style="margin-right: 48rpx;" :class="tab_index == key ?'tab-active':''"
					:style="tab_index == key && activeColor ?('color:' + activeColor +';'):''">
					{{item.name}}
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
			color: {
				type: String,
				default: ''
			},
			activeColor: {
				type: String,
				default: ''
			},

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
			},
			setIndex(index) {
				this.tab_index = index;
			}
		}
	}
</script>

<style lang="scss">
	.tabs-item {
		font-size: 30rpx;
		color: #666666;
		font-weight: 400;
		position: relative;
	}

	.tab-active {
		color: #FF882F;
		font-size: 32rpx;
		font-weight: bold;
	}

	.tab-active::before {
		position: absolute;
		content: '';
		bottom: -12rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 4rpx;
		border-radius: 8rpx;
		background: #FF882F;
	}

	.scroll {
		white-space: nowrap;
	}
</style>
