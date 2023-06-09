<template>
	<view style="height: 124rpx;" @touchmove.stop.prevent="clear">
		<view style="position: fixed;bottom: -2rpx;left: 0;width: 100vw;transform: translateZ(0);"
			:style="{bottom:bottom+'px'}">
			<view @touchmove.stop.prevent="clear"
				style="padding:14rpx 0rpx;background-color: #E7E9ED;box-shadow: 0px 0px 4rpx 0px rgba(52,80,153,0.2);width: 100vw;box-sizing: border-box;transform: translateY(2rpx);">

				<view style="display: flex;align-items: center;flex-flow: row nowrap;padding:0rpx 20rpx;"
					class="flex-x-center">
					<view @tap.stop="choose_input_type" style="height: 100%;" class="flex flex-x-y">
						<view class="iconfont  icon-jianpan input-icon"
							style="margin-left:0;font-size: 66rpx;"></view>
					</view>
					<voice @send="send_voice" v-if="!input_type"></voice>
					<view v-else class="flex-1 input-box no-scroll">
						<textarea :confirm-hold="true" @confirm="input_confirm" :focus="focus" @focus="input_focus"
							@blur="input_blur" confirm-type="send" :hold-keyboard="true"
							@keyboardheightchange="keyboardheightchange" :adjust-position="false" class="textarea1"
							placeholder-style="color: #999999;" :autoHeight="true" v-model.sync="message" placeholder=""
							@linechange="linechange" :maxlength="500"></textarea>
					</view>
					<view class="iconfont icon-smile input-icon" @tap.stop="choose_bqb"></view>
					<view v-if="!show_btn" @tap.stop="choose_more" class="iconfont icon-tianjia1 input-icon" style="padding: 0 10rpx 0 0rpx;"></view>
					<view v-else @touchend.prevent="input_confirm" class="send-btn-1">发送</view>
				</view>
				<view style="height: 20rpx;"></view>

				<view v-if="more" style="height: 500rpx;border-top: 0.5px solid rgba(0,0,0,0.1);"
					class="flex flex-wrap flex-y-start">
					<view @tap.stop="choose_image(1)" class="more-item">
						<view class="flex flex-y flex-x-y more-box">
							<view class="iconfont icon-tupian"></view>
						</view>
						<view class="more-text color-blue">图片</view>
					</view>
					<view class="more-item"></view>
					<view class="more-item"></view>
				</view>
				<!-- 表情 -->
				<view v-if="bqb" @touchmove.stop.prevent="clear"
					style="height: 500rpx;border-top: 0.5px solid rgba(0,0,0,0.1);align-items: flex-start;padding: 0 14rpx;">
					<scroll-view :scroll-x="true"
						style="height: 80rpx;padding: 0 20rpx;white-space: nowrap;width: 100%;">

						<view style="width: auto;">
							<view @tap.stop="choose_bqb_1(item,index)" v-for="(item,index) in bqb_title_list"
								:key="item.id"
								style="height: 80rpx;display: inline-block;margin-right: 30rpx;line-height: 80rpx;"
								class="color-black" :style="bqb_index == index ?'color:#6D9DFD;':''">
								<text>{{item}}</text>
							</view>
						</view>


					</scroll-view>
					<scroll-view :scroll-y="true" style="width: 100%;height: 434rpx;">
						<view style="height: 10rpx;"></view>
						<view class="flex flex-wrap flex-y-start" style="width: 100%;">
							<view class="more-item-1 flex flex-x-y" v-if="mine_bqb">

								<view @tap.stop="choose_image(2,160)" class="i-add flex flex-x-y">
									<view class="iconfont icon-zengjia"
										style="color: rgba(255,255,255,0.65);font-size: 50rpx;">
									</view>
								</view>
							</view>
							<view @longpress="del_bqb(item)" @tap.stop="send_bqb(item.url)" class="more-item-1"
								v-for="(item,index) in bqb_list" :key="item.id">
								<image :lazy-load="true" :src="item.url" mode="aspectFill"></image>
							</view>
						</view>


					</scroll-view>
				</view>

				<!-- 表情 -->
			</view>

		</view>
	</view>
</template>

<script>
	let envinfo = require('../../siteinfo');
	import voice from './voice.vue';
	export default {
		name: "chat",
		components: {
			voice
		},
		data() {
			return {
				message: '',
				bottom: 0,
				focus: false,
				bottom2: 0,
				more: false,
				bqb: false,
				bqb_title_list: [],
				bqb_list: [],
				bqb_all: [],
				mine_bqb: true,
				ios: false,

				bqb_index: 0,

				input_type: true,
			};
		},
		watch: {
			bottom(value) {
				this.$emit('heightChange', value + this.bottom2 + ((this.more || this.bqb) ? uni.upx2px(500) : 0));
			},
			bottom2(value) {
				this.$emit('heightChange', value + this.bottom + ((this.more || this.bqb) ? uni.upx2px(500) : 0));
			}

		},
		computed: {
			show_btn() {
				return String(this.message).trim() && !this.ios;
			},
		},
		created() {
			let data = uni.getStorageSync('bqb') || [];
			if (data.length > 0) {
				this.bqb_all = data;
				if (!data[0].emoticonList) {
					data[0].emoticonList = [];
				}
				this.bqb_list = data[0].emoticonList || [];
				this.bqb_title_list = data.map(val => val.title);
			}

			if (uni.getSystemInfoSync().platform == 'ios') {
				this.ios = true;
			}
		},
		mounted() {

			if (!getApp().globalData.bqb) {

				this.get_bqb();
			}
			uni.$on('refresh_bqb', () => {
				this.get_bqb();
			});
		},
		beforeDestroy() {
			uni.$off('refresh_bqb');
		},
		methods: {
			choose_input_type() {
				this.bqb = false;
				this.more = false;
				this.input_type = !this.input_type;
				this.bottom = Math.random();

			},
			choose_more() {
				this.more = !this.more;
				this.bqb = false;
				this.bottom = Math.random();
				this.input_type = true;
			},
			choose_bqb() {
				this.bqb = !this.bqb;
				this.more = false;
				this.bottom = Math.random();
				this.input_type = true;
			},
			keyboardheightchange(e) {

				console.log('input', e);
				this.bottom = Math.random();
				// if(this.ios){
				// 	setTimeout(()=>{
				// 		this.bottom = Math.random();
				// 	},100);
				// }
				return;
				if (!this.ios) {
					this.bottom = e.detail.height || 0;
				} else {
					this.bottom = Math.random();
				}


			},
			input_focus() {
				this.more = false;
				this.bqb = false;
				this.focus = true;

				if (this.ios) {
					setTimeout(() => {
						this.bottom = Math.random();
					}, 300);
				}

				// #ifdef H5
				this.$emit('heightChange', 1 + this.bottom2 + this.bottom + ((this.more || this.bqb) ? uni.upx2px(400) :
					0));
				// #endif
			},
			input_blur() {
				this.focus = false;
			},
			input_confirm() {

				if (!this.message.trim()) {
					return;
				}
				let time_now = new Date().getTime();
				if (!this.time2 || (time_now - this.time2) > 600) {
					this.time2 = time_now;
					let message = this.message.trim();
					this.message = '';

					this.$nextTick(() => {
						this.focus = true;
						this.message = '';
					});

					if (message.indexOf('emoji[') >= 0 || message.indexOf('img[') >= 0 || message.indexOf('shell[') >=
						0 || message.indexOf('notice[') >= 0 || message.indexOf('voice[') >=
						0) {


						if (message.indexOf('lqq') == 0) {
							message = message.replace('lqq', '');
						} else {
							this.showToast('非法消息');
							return;
						}
					}
					this.$emit('send', {
						msg: message,
						type: 'TEXT',
					});
				}

			},
			linechange() {
				// 行高发生改变
				this.$nextTick(() => {
					uni.createSelectorQuery().in(this).select('.input-box').boundingClientRect(data => {
						console.log('input-box', data);
						let height_default = uni.upx2px(80);
						let height_now = Math.round(data.height);
						if (height_now <= height_default) {
							this.bottom2 = 0;
						} else {
							this.bottom2 = height_now - height_default;
						}
					}).exec();
				});
			},
			choose_image(type = 1, size = 800) {
				uni.chooseImage({
					count: 1,
					success: res => {

						let {
							tempFilePaths = []
						} = res
						console.log('res', res);
						tempFilePaths.forEach(val => {

							// #ifdef APP-PLUS
							uni.compressImage({
								src: val,
								width: size,
								success: img => {
									this.upload_image(img.tempFilePath, type);
									console.log('img.tempFilePath', img.tempFilePath);
								},
								fail: err => {
									console.log('err', err);
								}
							});
							// #endif

							// #ifdef H5
							this.upload_image(val, type);
							// #endif

						})


					}
				})
			},
			upload_image(url, type = 1) {
				uni.showLoading({
					title: '上传图片中',
					mask: true,
				})
				let appUrl = '/upload/image';

				appUrl = envinfo.root + appUrl;


				uni.uploadFile({
					url: appUrl,
					filePath: url,
					data: {
						photo: 'file',
						name: 'file'
					},
					name: 'file',
					header: {
						token: uni.getStorageSync('ACCESS_TOKEN'),
					},
					success: img_data => {
						uni.hideLoading();
						let data = JSON.parse(img_data.data);
						if (img_data.statusCode == 200 && img_data.errMsg == 'uploadFile:ok') {


							if (data.status == 200 && data.data && data.data) {

								if (type == 1) {
									this.$emit('send', {
										msg: `${data.data}`,
										type: 'IMAGE'
									})
								}
								if (type == 2) {
									this.add_bqb(data.data);
								}

							}

						}

					}
				})

			},

			//获取表情包
			get_bqb() {
				this.request({
					url: '/chat/emoticon/getEmoticon',
					chat: true,
				}).then(res => {
					if (res.status == 200) {
						getApp().globalData.bqb = true;
						if (res.data) {
							this.bqb_index = 0;
							this.bqb_all = res.data || [];
							this.bqb_list = res.data[0]?.emoticonList || [];
							this.bqb_title_list = res.data.map(val => val.title);
							uni.setStorage({
								key: 'bqb',
								data: res.data || []
							});
						}

					}
				});
			},
			choose_bqb_1(item, index) {
				this.bqb_index = index;
				if (item == '我的收藏') {
					this.mine_bqb = true;
				} else {
					this.mine_bqb = false;
				}
				this.bqb_list = this.bqb_all.filter(val => val.title == item)[0].emoticonList;
			},
			//发送表情包
			send_bqb(src) {
				clearTimeout(this.send_timer);
				this.send_timer = setTimeout(() => {
					this.$emit('send', {
						msg: `${src}`,
						type: 'EMOJI'
					});
				}, 300);
			},
			send_voice(obj) {
				this.$emit('send', {
					msg: obj.msg,
					type: 'VOICE'
				});

			},
			//添加表情包
			add_bqb(url) {
				this.request({
					url: '/chat/emoticon/save',
					method: 'POST',
					chat: true,
					data: {
						url,
					}
				}).then(res => {
					//重新获取
					this.get_bqb();
				});
			},
			del_bqb(item) {
				if (!this.mine_bqb) return;
				uni.showActionSheet({
					itemList: ['删除'],
					success: (res) => {
						if (res.tapIndex == 0) {
							this.request({
								url: '/chat/emoticon/delete',
								method: 'POST',
								chat: true,
								data: {
									id: item.id,
								},
								loading: true
							}).then(res => {
								//重新获取
								// this.get_bqb();
								//去除本地
								this.bqb_list = this.bqb_list.filter(val => val.id != item.id);
								this.bqb_all[0].emoticonList = this.bqb_all[0].emoticonList.filter(
									val => val.id != item.id);
								uni.setStorage({
									key: 'bqb',
									data: this.bqb_all
								});
							});
						}
					}
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.xxx {
		position: absolute;
		overflow-y: scroll;
		overflow-scrolling: touch;
	}

	.input-icon {
		font-size: 60rpx;
		color: #32343A;
		
		// background-color: red;
		height: 90rpx;
		line-height: 90rpx;
		padding: 0 20rpx;
	}

	.input-box {
		min-height: 80rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 0rpx 28rpx;
		width: 534rpx;
		max-height: 160rpx;
		overflow-y: scroll;


	}

	.textarea1 {
		padding: 0;
		font-size: 32rpx;
		line-height: 44rpx;
		flex: 1;
		width: 100%;
		text-align: justify;
		color: #32343A;
		padding-top: 18rpx;
		padding-bottom: 18rpx;
		word-break: break-word;

	}

	.more-item {
		width: 25%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 30rpx;

		.more-box {
			width: 100rpx;
			height: 100rpx;
			background-color: rgba(255, 255, 255, 1);
			border-radius: 8rpx;

			&>view {
				// color: red;
				font-size: 50rpx;
			}
		}

		.more-text {
			line-height: 44rpx;
			margin-top: 10rpx;
			color: #FFFFFF;
		}
	}

	.more-item-1 {
		width: 25%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-bottom: 30rpx;


		& image {
			width: 156rpx;
			height: 156rpx;
			border-radius: 8rpx;
			// background-color: #FFFFFF;
		}



	}

	.i-add {
		width: 156rpx;
		height: 156rpx;
		border-radius: 8rpx;
		// border: 0.5px solid rgba(255, 255, 255, 0.4);
		box-shadow: 0 0 4rpx 0rpx rgba(255, 255, 255, 0.4) inset;
	}

	.send-btn-1 {
		width: 100rpx;
		height: 60rpx;
		background-color: #6D9EFB;
		border-radius: 6rpx;
		color: #FFFFFF;
		font-size: 26rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		animation: send 0.4s;
		white-space: nowrap;
		overflow: hidden;
	}

	@keyframes send {
		0% {
			width: 60rpx;
		}

		100% {
			width: 100rpx;
		}
	}
</style>
