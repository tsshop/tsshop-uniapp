<template>
	<view>

		<template v-if="list.length>0">
			<!-- :scroll-top="scrollTop" -->
			<scroll-view :scroll-with-animation="true" :scroll-into-view="scrollintoview" @touchstart="onScroll"
				class="scroll-box" :lower-threshold="0" @scrolltolower="onBottom" :scroll-y="true"
				:show-scrollbar="false" :class="[show?'':'hidden-scroll-box']">
				<!-- <view> -->
				<view v-for="(item,index) in list" :key="item.id" style="width: 400px;">
					<view class="message-users" style="flex-wrap: wrap;">

						<text class="text-add-rome" :style="item.color?(`color:${item.color};`):''" v-if="!item.row">
							{{item.text}}
						</text>

						<text class="text-add-rome" :style="item.color?(`color:${item.color};`):''" v-else
							style="width: 530rpx;">
							{{item.text}}
						</text>


					</view>
				</view>

				<!-- <text v-for="(item,index) in list" :key="item.id" class="text-add-rome">
						{{item.name}}：{{item.text}}
					</text> -->
				<!-- 隐藏按钮 -->
				<!-- </view> -->
				<view id="last11"></view>

			</scroll-view>
			<view @tap.stop="showD" class="danmu-box" v-if="!show">
				<text class="iconfont1" style="font-size: 34rpx;color:#ffffff;">&#xe665;</text>
			</view>

			<view @tap.stop="hiddenD" class="danmu-box-2" v-if="show">
				<text class="iconfont1" style="font-size: 34rpx;color:rgba(255,255,255,0.7);">&#xe725;</text>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		name: 'room-users',
		props: {
			roomId: {
				type: [String, Number],
				default: '',
			},
			info: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				show: true,
				list: [
					//
					{
						id: new Date().getTime(),
						text: '欢迎来到直播间！直播间严禁出现违法违规低俗色情、吸烟酗酒、人身伤害等内容。如主播在直播中以不当方式诱导送礼物、私下交易，请谨慎判断以防人身财产损失。购买商品请点击下方购物车按钮，请勿私下交易。请大家注意财产安全，谨防网络诈骗。',
						row: true,
						color: '#B49A46',
					},

				],
				autoBottom: true, //自动滚动到底部
				scrollTop: 500, //
				scrollintoview: '',
			}
		},
		created() {
			uni.$off('live_add_user');
			uni.$off('live_add_gift_line');
			uni.$off('live_user_message');
			uni.$on('live_add_user', data => {
				this.add_user(data);
			});
			uni.$on('live_add_gift_line', data => {
				this.add_gift(data);
			})
			uni.$on('live_user_message', this.addMessage);

		},
		methods: {
			showD() {
				this.autoBottom = true;
				this.show = true;
			},
			hiddenD() {
				this.show = false;
			},
			add_user(data) {
				if(data.userId == this.info.userId) return ;
				let text = data.text || `${data.userName} 进入房间`
				let time = new Date().getTime();
				this.list.push({
					id: time,
					text,
					row: this.getTextLength(text) > 16 ? true : false,
				});
				if (this.list.length >= 200) {
					this.list = this.list.filter((val, index) => index >= 100);
				}
				this.toLate();

			},
			add_gift(data) {
				let time = new Date().getTime();
				let text = `${data.userName} 送出 ${data.name} x${data.num}`
				this.list.push({
					id: time,
					text,
					row: this.getTextLength(text) > 16 ? true : false,
					color: data.color || '',
				});

				this.toLate();
			},
			addMessage(data) {

				if (data.roomId != this.roomId) return;
				let time = new Date().getTime();
				let text = `${data.userName}: ${data.content}`
				this.list.push({
					id: time,
					text,
					row: this.getTextLength(text) > 20 ? true : false,
				});
				if (this.list.length >= 200) {
					this.list = this.list.filter((val, index) => index >= 100);
				}
				this.toLate();
			},
			onBottom() {
				setTimeout(() => {
					this.autoBottom = true;
				}, 500);
			},
			onScroll(e) {
				this.autoBottom = false;
			},
			toLate() {
				if (this.autoBottom) {
					this.scrollintoview = '';
					this.$nextTick(() => {
						setTimeout(() => {
							this.scrollintoview = 'last11';
						}, 50);
					})
				}
			},
			getTextLength(text) {
				let str2 = String(text);
				//统计空格
				// var knum = 0; //计数
				// var kong = str2.match(/ /g) //筛选
				// for (let i in kong) {
				// 	knum++
				// }


				var num2 = 0;
				var numbe2 = str2.match(/\d{1}/g) //统计一位数
				for (let i in numbe2) {
					num2++
				}


				//统计字母
				var num3 = 0
				var zimu2 = str2.match(/[a-zA-Z]/g)
				for (let i in zimu2) {
					num3++
				}

				return parseInt(str2.length - (num2 + num3) / 2);



			},
		}
	}
</script>

<style>
	.scroll-box {
		width: 600rpx;
		height: 570rpx;
		/* background-color: rgba(0, 0, 0, 0.4); */
		border-radius: 18rpx;
		padding: 20rpx;
		transition: transform 0.3s;
		transform: translateX(0rpx);

	}

	.text-add-rome {
		font-size: 28rpx;
		color: #FFFFFF;
		line-height: 36rpx;
		background-color: rgba(16, 16, 16, 0.7);
		border-radius: 20rpx;
		padding: 14rpx 22rpx;
		/* word-wrap: anywhere; */
	}

	.hidden-scroll-box {
		transform: translateX(-680rpx);
	}

	.iconfont1 {
		font-family: iconfont1;
	}

	.danmu-box {
		position: absolute;
		left: 20rpx;
		top: 300rpx;
		width: 72rpx;
		height: 72rpx;
		background-color: rgba(0, 0, 0, 0.59);
		border-radius: 36rpx;
		justify-content: center;
		align-items: center;
	}

	.danmu-box-2 {
		position: absolute;
		left: 550rpx;
		top: 20rpx;
	}

	.message-users {

		margin-bottom: 10rpx;
		flex-direction: row;
		width: 530rpx;
	}

	.room-user-name {
		font-size: 28rpx;
		color: #B9B9B9;
		line-height: 36rpx;
	}
</style>