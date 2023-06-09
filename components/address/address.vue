<template>
	<view>
		<uni-popup ref="address" type="bottom">
			<view style="height: 800rpx;border-radius: 30rpx 30rpx  0 0;background-color: #FFFFFF;">
				<view style="height: 100rpx;padding:36rpx" class="flex flex-y-center flex-x-b fs-32 bold">
					<view class="color-999999" @tap="close()">取消</view>
					<view class="color-all" style="color: #FC8D06;" @tap="sure()">确定</view>
				</view>
				<picker-view v-if="show" style="height: 600rpx;" :value="value" @change="bindChange"
					class="picker-view">
					<picker-view-column>
						<view class="item" v-for="(item,index) in adders_list" :key="index">{{item.name}}</view>
					</picker-view-column>
					<picker-view-column v-if="adders_list[value[0]].node">
						<view class="item" v-for="(item,index) in adders_list[value[0]].node" :key="index">{{item.name}}
						</view>
					</picker-view-column>
					<picker-view-column v-if="adders_list[value[0]].node[value[1]].node">
						<view class="item" v-for="(item,index) in adders_list[value[0]].node[value[1]].node"
							:key="index">{{item.name}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		name: "address",
		data() {
			return {
				adders_list: [],
				value: [0, 0, 0],
				show: false,
				indicatorStyle: `height: 600rpx;`
			};
		},
		created() {
			this.get_address();
			console.log('dfdfd')
		},
		methods: {
			get_address() {
				let address = uni.getStorageSync('address_list');
				if (address.length) {
					this.adders_list = address;

				}
			
				this.request({
					url: '/address/district',
					

				}).then(res => {
					console.log(res);
					if (res.status == 200 && res.data && res.data.length > 0) {
						this.adders_list = res.data || [];
						// this.open();
						uni.setStorage({
							key: 'address_list',
							data: res.data
						})
					}
				});
			},
			get_city(id) {


			},
			bindChange(e) {
				console.log(e);
				let old_value = this.value.concat();
				let new_value = e.detail.value;

				if (old_value[0] != new_value[0]) {
					new_value[1] = 0;
					new_value[2] = 0;
				} else if (old_value[1] != new_value[1]) {
					new_value[2] = 0;
				}

				this.value = new_value;

			},
			open(arr) {
				if (arr && arr.length == 3) {
					this.value = arr;
				}
				console.log('sss')
				this.$refs.address.open();
				setTimeout(() => {
					this.show = true;
				}, 200)
			},
			close() {
				this.$refs.address.close();
				this.show = false;

			},
			sure() {
				this.$refs.address.close();
				this.show = false;
				// 选中的数据
				let data = {};
				if (this.adders_list.length > 0) {
					data.checked_arr = this.value;
					data.checked_str = [];

					data.checked_str[0] = this.adders_list[this.value[0]].name;
					data.checked_str[1] = this.adders_list[this.value[0]].node[this.value[1]].name;
					data.checked_str[2] = this.adders_list[this.value[0]].node[this.value[1]].node[this.value[2]].name;
					data.checked_id = [];
					data.checked_id[0] = this.adders_list[this.value[0]].id;
					data.checked_id[1] = this.adders_list[this.value[0]].node[this.value[1]].id;
					data.checked_id[2] = this.adders_list[this.value[0]].node[this.value[1]].node[this.value[2]].id;

					data.vals = [];
					data.vals[0] = this.adders_list[this.value[0]];
					data.vals[1] = this.adders_list[this.value[0]].node[this.value[1]];
					data.vals[2] = this.adders_list[this.value[0]].node[this.value[1]].node[this.value[2]];



				}
				console.log(data);
				this.$emit('sure', data);

			},
			set_detault(id1, id2, id3) {

				if (this.adders_list.length > 0) {
					this.adders_list.forEach((val, index) => {

						if (val.id == id1) {
							this.value[0] = index;

							if (val.node && val.node.length > 0) {

								val.node.forEach((val2, index2) => {
									if (val2.id == id2) {
										this.value[1] = index2;
										if (val2.node && val2.node.length > 0) {
											val2.node.forEach((val3, index3) => {
												if (val3.id == id3) {
													this.value[2] = index3;
												}

											})
										}
									}

								})
							}
						}
					})
					this.sure();
				}
			},

		},

	}
</script>

<style>
	.item {
		text-align: center;
		line-height: 34px;
	}
</style>
