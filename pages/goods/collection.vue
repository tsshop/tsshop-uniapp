<template>
	<view>
		<custom title="我的收藏" fixed="fixed" background="#F5F6F7">
			<view slot="right">
				<view style="transform: translateX(-10rpx);" @tap.stop="to_edit">
					{{edit?'完成':'编辑'}}
				</view>
			</view>
		</custom>


		<view>
			<view v-for="(item,index) in list" :key="index" class="flex p-20 flex-y-center" @tap.stop="toPage('/pages/goods/goods?id='+item.id)">
				<!-- 编辑 -->
				<view v-if="edit" class="mr-20" @tap.stop="item.checked = !item.checked">
					<!-- <qq-icon v-if="index==0" icon="icon-xuanzhong" color="#FF882F" size="40rpx"></qq-icon> -->
					<qq-icon :icon="item.checked? 'icon-xuanzhong': 'icon-weixuanzhong'" color="#FF882F" size="40rpx"></qq-icon>
				</view>
				<!-- 编辑 -->
				<view class="flex-1 flex hidden">
					<image  mode="aspectFill" class="love-image" :src="item.headPortrait"></image>
					<view class="pl-20 flex-1 color-323232 fs-28 flex flex-y flex-x-b">
						<view class="over-line2">
							{{item.name}}
						</view>
						<view class="flex flex-x-b flex-y-center">
							<price :price="item.price"></price>
							<view  @tap.stop="add_cart(item)" class="order-btn">
								加入购物车
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>


		<qq-footer :show="is_null" :list="list"></qq-footer>


		<fixed-bottom height="120rpx" v-if="edit" bStyle="background:#FFFFFF;padding-left:20rpx;padding-right:20rpx;">
			<view style="height: 120rpx;">
				<view class="flex flex-y-center flex-x-b" style="height: 100rpx;">
					<view class="flex flex-x-y" @tap.stop="allcheck">
						<!-- <qq-icon icon="" size="40rpx" color="#FF882F"></qq-icon> -->
						<qq-icon :icon="isAllchecked?'icon-xuanzhong':'icon-weixuanzhong'" size="40rpx" color="#FF882F"></qq-icon>
						<view style="margin-left: 14rpx;">全选</view>
					</view>
					<view @tap.stop="del" class="default-btn" style="width: 152rpx;height: 68rpx;font-size: 32rpx;">
						删除
					</view>
				</view>
			</view>
		</fixed-bottom>
		<sku ref="sku" :mode="1" :goods="goods" :showAddcart="true" ></sku>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				edit: false,
				statusbar: getApp().globalData.statusBar + 'px',
				tabs_list: [],
				tab_index: 0,
				list: [],
				page: 1,
				is_null: false,
				isAllchecked:false,
				goods:{},
				skuList:[],
				skulistObj: {}
			};
		},
		watch: {
			list: {
				handler(val, oldVal) {
					this.isAllchecked = this.list.every(val => val.checked == true)
				},
				deep:true,
				immediate:true
				
			}
		},
		computed: {
			get_left() {
				if (this.tab_index > 3) {
					return 35 * this.tab_index;
				}
				return 0;
			},
		},
		onLoad() {


			this.init();

		},
		onReachBottom() {
			this.get_list(this.page);
		},
		onPullDownRefresh() {


			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 200);
			this.init();

		},
		methods: {
			to_edit() {
				this.click(() => {
					this.edit = !this.edit;
				});
			},
			tab_change(index) {
				this.tab_index = index;
				this.init();
			},


			init() {
				this.setData({
					page: 1,
					list: [],
					is_null: false,
				})

				this.get_list();
				// this.get_sku(item.id)
			},
			get_list(page = 1) {
				let data = {
					page: page,
				};
				// if (this.tab_index > -1 && this.tabs_list.length > 0) {
				// 	data.goodsType = this.tabs_list[this.tab_index].id || ''
				// }
				this.request({
					url: '/goodsCollect/getList',
					data,
					loading: page == 1,
				}).then(res => {
					if (!this.rsuccess(res)) return;

					
					let arr = res.data.filter(val => val != null)
					if (arr) {
						arr.forEach(val => {
							if (val.headPortrait) {
								val.headPortrait = val.headPortrait.split(',')[0]
							}
							console.log('getsku')
							// this.get_sku(val.id)
							val.checked = false
						})
					}
					
					console.log(arr, 'res,data')
					this.list = this.list.concat(arr || []);
					console.log(this.list,'list')
					if (res.data?.length == 0) {
						this.is_null = true;
					} else {
						this.page++;
					}

				});
			},
			allcheck() {
				if(this.isAllchecked) {
					this.list.forEach(val => val.checked = false)
				}
				else {
					this.list.forEach(val => val.checked = true)
				}
			},
			del() {
				
				let arr = this.list.filter(val => val.checked == true).map(val => val.id)
				this.list.forEach(val => {
					if(val.checked) {
						this.request({
							url:'/goodsCollect/delete',
							data: {
								goodsIds:arr
							}
						}).then(res => {
							if(res.status != 200) return
							
							this.init();
							this.showToast('删除成功');
							
						})
					}
				})
			},
			add_cart(item) {
				this.goods = item
				if(this.skulistObj[item.id]) {
					this.init_sku(this.skulistObj[item.id]);
					return 
				}
				this.get_sku(item.id)
				
				// this.$refs.sku.add_cart()
				
			},
			buy_now_fail() {},
			get_sku(id) {
				this.request({
					url: '/goods/getSku',
					data: {
						id: id
					}
				}).then(res => {
					if (res.status != 200) return
					this.goods.skuList = res.data
					this.skuList = res.data || [];
					this.goods.skuList = this.goods.skuList.filter(val => val.properties);
					console.log(this.goods, 'goods')
					if (this.goods.skuList) {
						this.skulistObj[id] = this.clone(this.skuList)
						this.init_sku(this.goods.skuList);
						
					}
				})
			},
			
			init_sku(sku_list = []) {
				// sku_list = [
				// 	{
				// 		properties:'颜色:蓝色;尺码:L',
				// 		name:'name1',
				// 	},
				// 	{
				// 		properties:'颜色:黄色;尺码:M',
				// 		name:'name2',
				// 	}
				// ]
				let attr_group_list_obj = {
			
				};
				sku_list.forEach(val => {
			
					let attr_arr = val.properties.split(';').map(attrs => {
						return attrs.split(':');
					})
					let attr_list = [];
					attr_arr.forEach(attr => {
						attr_list.push({
							attr_group_name: attr[0],
							attr_name: attr[1]
						})
						if (attr_group_list_obj[attr[0]] === undefined) {
							attr_group_list_obj[attr[0]] = []
						}
						if (attr_group_list_obj[attr[0]].indexOf(attr[1]) == -1) {
							attr_group_list_obj[attr[0]].push(attr[1])
						}
					})
					val.attr_list = attr_list;
					val.num = val.stocks || 0;
			
				})
				let attr_group_list = {}
			
				Object.keys(attr_group_list_obj).forEach(key => {
					attr_group_list[key] = {};
					attr_group_list[key].attr_group_name = key
			
					attr_group_list[key].attr_list = attr_group_list_obj[key].map(val => {
						return {
							attr_name: val
						}
					});
			
				})
				
					this.$refs.sku.init(attr_group_list, sku_list, '');
					this.$nextTick(() => {
						this.$refs.sku.add_cart()
					})
					// this.$refs.sku.buy_now();
				
				// console.log('sku_list', sku_list);
				// console.log('attr_group_list_obj', attr_group_list_obj)
				// console.log('attr_group_list', attr_group_list)
			},
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}

	.love-image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 10rpx;
		background-color: #f4f4f4;
	}
	.order-btn {
		margin-left: 26rpx;
		height: 52rpx;
		border-radius: 26rpx;
		padding: 0 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		border: 1rpx solid  #FF882F;
		color: #FF882F;
	}
</style>
