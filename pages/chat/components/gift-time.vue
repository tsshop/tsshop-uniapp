<template>
	<view>
		<view class="gift-time-box-1">
			<view>
				<!-- 赠送礼物列表 -->
				<view v-for="(item,index) in list" :key="item.id">
					<giftOne :ios="ios" @del="del_one" :info="item"></giftOne>
				</view>
				<!-- 赠送礼物列表 -->
			</view>
		</view>
	</view>
</template>

<script>
	import giftOne from './gift-one';
	export default {
		name: 'giftTime',
		components: {
			giftOne
		},
		data() {
			return {
				ios: true,
				list: [

					// {
					// 	id: '13949009234',
					// 	imgUrl: 'https://bcfiles.oss-cn-hangzhou.aliyuncs.com/beicheng/1652081889926.png?Expires=1967441881&OSSAccessKeyId=LTAI5tPbovjS75Cwy1d2B5cY&Signature=q6iZ5E3hl8W12xeUhCVlp3gYfmg%3D'

					// }
				],
			}
		},
		created() {

			
			//#ifdef APP-PLUS
			if (uni.getSystemInfoSync().platform != 'ios') {
				this.ios = false;
			}
			//#endif
			uni.$on('sendOneGift',(item)=>{
				this.add_one(item);
			});
		},
		methods: {
			del_one(id) {
				// this.list = this.list.filter(val => val.id != id);
			},
			add_one(item) {

				// if(this.list.length == 8){
				// 	this.list.splice(0,1);
				// }
				if (this.list.length >= 50) {

					this.list = this.list.slice(40);
					// this.list.splice(0,6);
					// console.log('剪裁一次')
				}
				this.list.push(item);

			}
		},
	}
</script>

<style>
	.gift-time-box-1 {

		position: fixed;
		bottom: 700rpx;
		left: 0;

	}
</style>
