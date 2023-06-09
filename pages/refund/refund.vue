<template>
	<view>
		<common></common>
		<custom background="#F5F6F7" :titleBold="true" fixed="fixed" :title="title"></custom>
		<!-- 商品信息 -->
		<view class="pl-20 pr-20 mt-20" v-if="goods">
			<view style="" class="flex p-20 bg-FFFFFF br-10">
				<image mode="aspectFill" :src="goods.src"
					style="width: 132rpx;height: 132rpx;background-color: #F4F4F4;border-radius: 10rpx;"></image>
				<view style="margin-left: 24rpx;" class="flex-1 hidden color-323232 flex flex-y flex-x-b">
					<view class="flex flex hidden">
						<view class="flex-1 fs-28  text-hidden">
							{{goods.goodsName}}
						</view>
						<text class="fs-28 ml-20">¥{{goods.price}}</text>
					</view>
					<view class="flex flex-y-center">
						<view class="flex-1 fs-24  text-hidden color-646464">
							{{goods.sku}}
						</view>
						<text class="fs-24 ml-20 color-646464">共{{goods.quantity}}件</text>
					</view>

					<view class="flex  fs-26" style="height: 40rpx;line-height: 40rpx;">
						<text style="color: #00C35C;">
							{{type == 1 ? '没有收到货' : (type == 2 ? '已收到货' : '已收到货，请与客服沟通退款金额 ')}}

						</text>
					</view>
				</view>
			</view>
		</view>

		<view class="color-323232 pl-20 pr-20 mt-20" v-if="goods">
			<view class="bg-FFFFFF br-10 p-20" style="padding-bottom: 30rpx;">
				<!-- type = 1 仅退款（未收到货） -->
				<view v-if="type == 1">
					<view class="fs-30 bold">
						退款信息
					</view>
					<view class="refund-item flex-x-b">
						<view>退款原因</view>
						<view class="flex flex-y-center" @tap.stop="choose1">
							<text style="color: #989898;">{{ choose_text1 || '请选择'}}</text>
							<text class="iconfont icon-jinru" style="font-size: 28rpx;width: 20rpx;"></text>
						</view>
					</view>
				</view>
				<!-- type = 2 仅退款（收到货） -->
				<!-- type = 3 退货退款 -->
				<view v-if="type == 2 || type == 3">
					<view class="fs-30 bold">
						{{type == 2?'退款信息':'退货信息'}}
					</view>
					<view class="refund-item flex-x-b">
						<view>售后原因</view>
						<view class="flex flex-y-center" @tap="choose1">
							<text style="color: #989898;">{{ choose_text1 || '请选择'}}</text>
							<text class="iconfont icon-jinru" style="font-size: 28rpx;width: 20rpx;"></text>
						</view>
					</view>
					<view class="refund-item">
						<view>退款金额</view>
						<view @tap.stop="setData({input_focus:true,input_blur:true})" class="flex-1"
							style="padding-left: 40rpx;color: #989898;">
							{{'点击可修改，最多 ¥ '+(goods?goods.total_price:'0')}}
						</view>
						<view style="color: #FD4F4C;" class="bold ml-20 flex flex-y-center">
							<view v-if="!input_blur" class="flex-1">¥</view>

							<input :focus="input_focus" v-if="input_blur" @blur="blur" @focus="focus" type="digit"
								placeholder-class="font"
								style="color: #FD4F4C;font-size: 28rpx;height: 40rpx;width: auto;width: 100rpx;"
								v-model="money" placeholder-style="font-size:28rpx;" />
							<view @tap.stop="setData({input_focus:true,input_blur:true})" v-else>{{money}}</view>
						</view>
					</view>
					<view class="refund-item">
						<view>原因描述</view>
						<input type="text" style="color: #000000;font-size: 28rpx;height: 40rpx;padding-left: 40rpx;"
							placeholder="点击添加文字描述（非必填）" class="flex-1" v-model="detail"
							placeholder-style="font-size:28rpx;" />
					</view>

				</view>


				<!-- END -->
			</view>

			<view class="bg-FFFFFF br-10 p-20 mt-20" style="padding-bottom: 30rpx;">
				<view class="refund-item flex-x-b">
					<view>上传凭证（必填）</view>
					<view style="color: #989898;">上传照片，不超过3张</view>
				</view>
				<!-- 上传图片 -->
				<view style="margin-top: 28rpx;" class="flex flex-wrap">


					<!-- 图片 -->
					<upload @change="image_success" :length="3" :uploadBg="'#f4f4f4'"></upload>



				</view>
				<view style="color: #989898;font-size: 28rpx;line-height: 40rpx;margin-top: 12rpx;">
					<text space="nbsp">
						上传照片，不超过3张
						请拍下商品的实物、包装完好未使用的照片，方便审核
					</text>
				</view>
			</view>
		</view>

		<view style="height: 194rpx;">
			<view style="position: fixed;left: 0;bottom: 60rpx;z-index: 6;padding:0 36rpx;width: 100vw;" class="flex">
				<view hover-class="click1" class="flex-1 flex flex-x-y color-ffffff bg-all"
					style="height: 88rpx;border-radius: 44rpx;" @tap.stop="send_refund">
					提交申请
				</view>
			</view>
		</view>

		<qq-select ref="select1" @sure="sure">

		</qq-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				type: 1, //1 仅退款(未收到货) 2// 仅退款(已收到货) 3//退货退款 
				choose_text1: '',
				choose_text2: '',
				choose_text3: '',
				money: '', //用户填写的退款金额
				detail: '', //描述
				image_list: [], //上传图片
				upload_images: [],
				add_cart: false,
				goods: null, //商品信息
				reasons: {}, //理由
				input_blur: false,
				input_focus: false,
				str_arr: [
					'不想要了',
					'不喜欢，效果不好',
					'货物与描述不符',
					'质量问题',
					'收到商品少件',
					'商品破损或污渍',
					'空包裹',
					'商家发错货',
					'其他原因'
				],
				returnImg: '',
			}
		},
		onLoad(e) {
			let type = e.type || 1; //1 仅退款(未收到货) 2// 仅退款(已收到货) 3//退货退款 
			this.type = type;
			this.title = type == 1 ? '仅退款 (未收到货)' : (type == 2 ? '仅退款 (已收到货)' : '退货退款 ');
			// if (e.goods) {
			// 	this.goods = JSON.parse(e.goods) || {
			// 		total_price: '100.33'
			// 	};
			// 	this.money = this.xs(this.goods.total_price, 1);

			// }
			// this.get_reasons();
			this.o_id = e.o_id || '';
			this.get_detail();
		},
		methods: {
			image_success(arr) {
				console.log('arr', arr);
				// returnImg
				this.returnImg = arr.map(val => val.src).join(',');
			},
			get_detail() {
				this.request({
					url: '/order/detail',
					data: {
						orderId: this.o_id,
					},
					loading: true,
				}).then(res => {
					if (res.status == 200) {
						// res.data = {
						// 	...res.data,
						// 	...res.data.goodsDto,
						// 	purchaseQuantity: res.data.purchaseQuantity,
						// 	price: res.data.price,
						// 	headPortrait: res.data.goodsDto.headPortrait.split(',')[0],
						// 	price: res.data.price,
						// 	totalAmount: res.data.totalAmount,
						// 	orderNo: res.data.orderNo,
						// }

						if (res.data.freight > 0) {
							res.data.total_price = Number(this.xs(res.data.totalAmount - res.data.freight, 2));
						} else {
							res.data.total_price = res.data.totalAmount;
						}
						this.money = res.data.total_price;
						this.goods = res.data;

						// this.address = res.data?.addressDto || {};
					}
				});
			},
			choose_cart() {
				this.add_cart = !this.add_cart;
			},
			choose1() {

				this.$refs.select1.open(this.str_arr, 0);
			},



			blur() {
				this.input_blur = false;
				if (this.xs(this.money, 2) <= 0) {
					this.money = this.xs(this.goods.total_price, 2);
				}
				if (parseFloat(this.xs(this.money, 2)) > this.goods.total_price) {
					console.log('ddd')
					this.money = this.xs(this.goods.total_price, 2);
				}
			},
			focus() {
				this.input_blur = true;

			},
			check() {
				if (this.image_list.length == 0) {
					this.showToast('请上传1~3张图片', 3000);
					return false;
				}

				return true;
			},
			//提交售后
			send_refund() {
				if (this.choose_text1 == '') {
					this.showToast('请选择退款或售后原因', 3000);
					return;
				}
				let data = {};
				// data.order_detail_id = this.goods.order_detail_id;
				// data.type = (this.type == 1 || this.type == 2) ? 1 : 2;
				// if (this.type == 1) {
				// 	data.receipt_status = 1;
				// 	data.reason_for_return_money = this.choose_id; //进退款退款理由
				// }
				// if (this.type == 2 || this.type == 3) {
				// 	if (!this.check()) {
				// 		return;
				// 	}
				// }
				// if (this.type == 2) {
				// 	data.receipt_status = 2;
				// 	data.reason_for_return_money = this.choose_id; //进退款退款理由


				// }
				// if (this.type == 3) {
				// 	data.receipt_status = 2;

				// 	data.reason_for_return_goods_and_money = this.choose_id;

				// }
				// data.refund_price = this.money;
				// data.desc = this.detail;
				data.orderNo = this.goods.orderNo;
				data.returnAmt = this.money;
				data.returnReason = this.choose_text1;
				data.returnImg = this.returnImg;
				data.returnType = this.type;
				data.returnDetail = this.detail;
				// let pics = this.image_list.map(val => {
				// 	let src = "";
				// 	this.upload_images.some(val2 => {
				// 		if (val2.src == val.src) {
				// 			src = val2.url;
				// 			return true;
				// 		}
				// 		return false;
				// 	})
				// 	return src;
				// }).join(',');
				// data.pic_list = pics;
				// console.log('data', data);
				// return;

				//提交售后
				this.less(() => {
					this.request({
						method: 'POST',
						url: '/returnOrder/apply',
						data,
					}).then(res => {
						if (!this.rsuccess(res)) return;
						uni.$emit('refresh_order');
						this.toPage('/pages/refund/list', '3');
					});
				});

			},
			get_reasons() {
				this.request({
					url: '/refund/reasons',
					success: res => {
						if (res.code == 0) {
							this.reasons = res.data || {};
						}
					}
				});
			},
			choose_reasons() {
				let str = '';
				if (this.type == 1) {
					str = 'reason_for_return_money_no_send';
				}
				if (this.type == 2) {
					str = 'reason_for_return_money';
				}
				if (this.type == 3) {
					str = 'reason_for_return_goods_and_money';
				}
				let arr = [];
				let arr_key = [];
				if (this.reasons[str]) {
					for (let key in this.reasons[str]) {
						arr.push(this.reasons[str][key]);
						arr_key.push(key);
					}
				}
				if (arr.length > 0) {
					this.arr = arr;
					this.arr_key = arr_key;
					this.$refs.select1.open(arr, 0);
				}

			},
			sure(data) {
				console.log('data', data);
				this.choose_text1 = this.str_arr[data.index];
				this.choose_id = this.str_arr[data.index];
			},
			connect_server() {
				if (this.o_id) {
					this.mycopy(this.o_id, '订单号复制成功');
				}
				return;
				this.$refs.server.open();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $pageColor;
	}

	.label1 {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #FD4F4C;
		font-weight: 550;
		width: 128rpx;
		height: 34rpx;
		border-radius: 17rpx;
		background: rgba(253, 79, 76, 0.38);
		margin-right: 15rpx;

	}

	.label2 {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #FC9E2B;
		font-weight: 550;
		width: 94rpx;
		height: 34rpx;
		border-radius: 17rpx;
		background: rgba(255, 200, 32, 0.38);
		margin-right: 15rpx;
	}

	.refund-item {
		height: 40rpx;
		margin-top: 30rpx;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		font-size: 28rpx;
	}

	.img-item {
		margin-right: 12rpx;
		margin-bottom: 12rpx;
	}

	.img-item:nth-of-type(4n) {
		margin-right: 0;
	}
</style>
