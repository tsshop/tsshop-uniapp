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

						<text class="text-add-rome" v-if="!item.row">
							{{item.row}}{{item.name?(item.name+'：'):''}}{{item.text}}
						</text>

						<text class="text-add-rome" v-else style="width: 530rpx;">
							{{item.row}}{{item.name?(item.name+'：'):''}}{{item.text}}
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
				<text class="iconfont1" style="font-size: 30rpx;color:#ffffff;">&#xe665;</text>
			</view>

			<view @tap.stop="hiddenD" class="danmu-box-2" v-if="show">
				<text class="iconfont1" style="font-size: 30rpx;color:#FFFFFF;">&#xe624;</text>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		name: 'room-users',
		data() {
			return {
				show: true,
				list: [

					{
						id: '1',
						text: '法外狂徒进入直播间'
					},
					{
						id: '2',
						text: '狗头进入直播间'
					},
					{
						id: '3',
						text: '盲僧进入直播间'
					},
					{
						id: '4',
						text: '金克斯进入直播间,并且给主播扣了一个6。❤❤❤❤',
						name: '张三',
						row: true,
					},
					{
						id: '5',
						text: '金克斯进入直播间,并且给主播扣了一个6。❤❤❤❤',
						name: '主播好漂亮呀'
					},
					//
				],
				autoBottom: true, //自动滚动到底部
				scrollTop: 500, //
				scrollintoview: '',
			}
		},
		created() {
			uni.$on('live_add_user', data => {
				this.add_user(data);
			});
			uni.$on('live_add_gift_line', data => {
				this.add_gift(data);
			})
			let n = 0;
			setInterval(() => {
				n++;
				if (n % 2 == 1) {
					this.add_user({
						id: new Date().getTime(),
						text: '主播太漂亮了，能加个微信了解一下么?',
						name: '张三' + new Date().getTime(),
						row: true,
					});
				} else {
					this.add_user({
						id: new Date().getTime(),
						userName: '法外狂徒'
					});
				}

			}, 1000)
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

				let time = new Date().getTime();
				this.list.push({
					id: time,
					text: data.text || `${data.userName} 进入房间`,
					name: data.name || '',
					row: String(data.text).length > 16 ? true : false,
				});
				if (this.list.length >= 200) {
					this.list = this.list.filter((val, index) => index >= 100);
				}
				if (this.autoBottom) {
					this.scrollintoview = '';
					this.$nextTick(() => {
						setTimeout(() => {
							this.scrollintoview = 'last11';
						}, 50);
					})
				}

			},
			add_gift(data) {
				let time = new Date().getTime();
				this.list.push({
					id: time,
					text: `${data.userName} 送出 ${data.name} x${data.num}`,
				});

				if (this.autoBottom) {
					this.scrollintoview = '';
					this.$nextTick(() => {
						setTimeout(() => {
							this.scrollintoview = 'last11';
						}, 50);
					})
				}
			},
			onBottom() {
				setTimeout(() => {
					this.autoBottom = true;
				}, 10);
			},
			onScroll(e) {
				this.autoBottom = false;
			}
		}
	}
</script>

<style>
	.scroll-box {
		width: 570rpx;
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
		width: 58rpx;
		height: 58rpx;
		background-color: rgba(0, 0, 0, 0.59);
		border-radius: 36rpx;
		justify-content: center;
		align-items: center;
	}

	.danmu-box-2 {
		position: absolute;
		right: 0;
		top: 205rpx;
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