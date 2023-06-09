<template>
	<view>
		<!-- 搜索筛选条 -->
		<!-- 搜索筛选条 -->
		<view style="padding: 20rpx 30rpx;" class="flex flex-x-b flex-y-center">

			<view @tap.stop="choose(item,index)" v-for="(item,index) in list" :key="index"
				class="screen-item flex flex-x-y">
				<text :class="item.checked && item.type == 'radio'?'active':''">{{item.name}}</text>
				<!-- icon-shengxu icon-asc -->

				<qq-icon size="32rpx" v-if="item.type == 'switch'" color="#646464"
					:icon="item.checked == 0?'icon-paixu':item.checked == 1?'icon-asc':'icon-shengxu'"></qq-icon>
			</view>

			<view class="screen-item flex flex-x-y" @tap.stop="choose_all">
				<text>筛选</text>
				<qq-icon icon="icon-shaixuan" size="30rpx" color="#323232"></qq-icon>
			</view>

		</view>


		<!-- 精确搜索 -->
		<uni-popup type="right" ref="popup">
			<view
				style="height: 100vh;width: 590rpx;border-radius: 20rpx 0px 0px 20rpx;background: #FFFFFF;overflow: hidden;">
				<view :style="{height:statusbar}"></view>
				<!-- 价格区间 -->
				<view class="mt-30  fs-30 color-323232">
					<view class="pl-40">价格区间</view>
					<view class="flex flex-x-y mt-20 pl-20 pr-40">
						<input @input="input_change('min_price')" class="s-input-box" type="number" placeholder="最低价"
							v-model="min_price">
						<view class="s-input-bar"></view>
						<input @input="input_change('max_price')" class="s-input-box" type="number" v-model="max_price"
							placeholder="最高价">
					</view>
				</view>
				<!-- 价格区间 -->

				<fixed-bottom height="120rpx">
					<view class="flex flex-x-b flex-x-y pl-20 pr-20" style="width: 590rpx;height: 120rpx;">
						<view class="s-btn-1" @tap.stop="showToast('重置')">重置</view>
						<view class="s-btn-2" @tap.stop="sure_close">确定</view>
					</view>
				</fixed-bottom>

			</view>
		</uni-popup>
		<!-- 精确搜索 -->

	</view>
</template>

<script>
	export default {
		name: "screen",
		data() {
			return {
				statusbar: getApp().globalData.statusbar + 'px',
				list: [
					// type radio单选  check
					{
						name: '综合',
						type: 'radio', //单选
						checked: true,
						key: 'zonghe'
					},
					{
						name: '销量',
						type: 'radio', //单选
						checked: false,
						key: 'xiangliang'
					},
					{
						name: '排序',
						type: 'switch',
						checked: 0, //0未选中  1降序  2升序  
						key: 'price',
					}
				],
				min_price: '',
				max_price: '',
			};
		},
		methods: {
			choose(item, index) {
				if (item.type == 'radio') {
					//单选
					this.list = this.list.map((val, idx) => {
						if (val.type != 'radio') {
							return val;
						}
						if (idx == index) {
							val.checked = true;
						} else {
							val.checked = false;
						}
						return val;
					});
					this.$emit('change', this.list.filter(val => (val.type == 'radio' && val.checked) || (val.type ==
						'switch')))

				}
				if (item.type == 'switch') {
					//单选
					this.list = this.list.map((val, idx) => {
						if (val.type != 'switch') {
							return val;
						}
						if (idx == index) {
							let checked = val.checked;
							val.checked = checked == 0 ? 1 : checked == 1 ? 2 : 0;

						}
						return val;
					});
					this.$emit('change', this.list.filter(val => (val.type == 'radio' && val.checked) || (val.type ==
						'switch')))

				}
			},
			choose_all() {
				this.$refs.popup.open();
			},
			input_change(key) {
				console.log('sss');
				if (this[key] == 0) {
					this.$nextTick(() => {
						this[key] = '';
					})
					return;
				}
				if (this[key]) {
					this.$nextTick(() => {
						this[key] = Math.abs(this.xs(this[key], -1));
					})
				}
			},
			sure_close() {
				this.$refs.popup.close();
				this.$emit('quantityRange', [this.min_price, this.max_price])
			}
		}
	}
</script>

<style lang="scss">
	.screen-item {
		font-size: 26rpx;
		line-height: 30rpx;
		color: #646464;
		width: 25%;

		text {
			transition: color 0.3s;
		}

		.active {
			color: $color;
		}
	}

	.s-btn-1 {
		flex: 1;
		height: 68rpx;
		border-radius: 24rpx;
		font-size: 28rpx;
		border: 2rpx solid #FFFFFF;
		border-color: $color;
		color: $color;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 34rpx;

	}

	.s-btn-2 {
		flex: 1;
		height: 68rpx;
		border-radius: 34rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: $bgColor;
		margin-left: 50rpx;
	}

	.s-input-box {
		text-align: center;
		font-size: 24rpx;
		color: #323232;
		height: 48rpx;
		padding: 0 20rpx;
		border-radius: 24rpx;
		background-color: #F5F6F7;

	}

	.s-input-bar {
		height: 2rpx;
		width: 20rpx;
		background-color: #646464;
		margin: 0 4rpx;
	}
</style>
