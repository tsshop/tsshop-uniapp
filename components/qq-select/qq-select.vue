<template>
	<view>
		<uni-popup ref="select" type="bottom" :scroll="true">
			<view class=""
				style="padding: 40rpx 0 30rpx 0rpx;width: 750rpx;border-radius: 16rpx 16rpx 0 0;background-color: #FFFFFF;color:#3B4644;">
				<view class="center bold fs-30">{{title}}</view>
				<view style="padding: 0 36rpx;max-height: 900rpx;overflow-y: scroll;">
					<view @tap.stop="choose(index)" v-for="(item,index) in arr" :key="index"
						style="height: 96rpx;padding:0 24rpx;" class="fs-28 select-item flex flex-y-center">
						<view class="flex-1 text-hidden">{{item}}</view>
						<view style="margin-left: 20rpx;">

							<qq-icon iClass="a-show" color="#FF882F" size="36rpx" v-if="is_show(index)"
								icon="icon-xuanzhong">
							</qq-icon>
							<qq-icon iClass="a-show" v-else size="36rpx" icon="icon-weixuanzhong"></qq-icon>
						</view>
					</view>
				</view>
				<slot name="slot1"></slot>
				<view class="flex" hover-class="click1">
					<view @tap.stop="sure" class="mt-20 flex-1 ml-40 mr-40 bg-all flex flex-x-y fs-30 color-ffffff"
						style="height: 88rpx;border-radius: 48rpx;">确定</view>
				</view>
				<view :style="{height:safeArea}"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "qq-select",
		props: {
			multiple: {
				type: Boolean,
				default: false,
			},
			title: {
				type: String,
				default: '请选择'
			}
		},
		data() {
			return {
				checked_index: -1,
				arr: [],
				checked_arr: [],
				safeArea: getApp().globalData.safeArea + 'px',
			};
		},
		methods: {
			open(arr = [], index = -1, success) {
				if (arr.length > 0) {
					this.arr = arr;
				}
				// if (index > -1 && arr.length > 0) {
				// 	this.checked_index = index;
				// }
				if (typeof index == 'object') {
					this.checked_arr = index;
				} else {
					this.checked_index = index;
				}
				if (success) {
					this.success = success;
				} else {
					this.success = null;
				}
				this.$refs.select.open();
			},
			is_show(index) {
				if (this.multiple) {
					return this.checked_arr.includes(index);
				} else {
					return index == this.checked_index;
				}
				return false;
			},
			choose(index) {
				if (!this.multiple) {
					//单选
					if (index != this.checked_index) {
						this.checked_index = index;
					} else {
						// this.checked_index = -1;
					}
				} else {
					//多选
					let index_ = this.checked_arr.indexOf(index);
					if (index_ > -1) {
						this.checked_arr.splice(index_, 1);
					} else {
						this.checked_arr.push(index);
					}
				}


			},
			sure() {
				if (this.checked_arr.length == 0 && this.checked_index == -1) {
					console.log('iii')
					this.showToast('未选择任何选项', 3000);
					return;
				}
				let checked = this.multiple ? this.checked_arr.length > 0 : this.checked_index > -1;
				this.$refs.select.close();
				this.$emit('sure', {
					checked,
					index: this.multiple ? this.checked_arr : this.checked_index
				});
				if (this.success) {
					this.success({
						checked,
						index: this.multiple ? this.checked_arr : this.checked_index
					});
				}
			},
		}
	}
</script>

<style lang="scss">
	.select-item+.select-item {
		border-top: 0.5px solid #EEEEEE;
	}

	.a-show {
		animation: a-show 0.8s;
	}

	@keyframes a-show {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}
</style>
