<template>
	<view>
		<custom fixed="fixed" mode="2" :title="type==1?'用户消费认购协议': protocal_info.serviceTitle"></custom>
		<view v-if="type!=1">
			<view class="w-688 ml-31 text fs-28 color-333333"
				style="line-height: 50rpx;padding-top: 20rpx;padding-bottom: 100rpx;">
				<rich-text :nodes="protocal_info.serviceAgreement"></rich-text>
			</view>
		</view>
		<view v-else>
			<view class="w-688 ml-31 text fs-28 color-333333"
				style="line-height: 50rpx;padding-top: 20rpx;padding-bottom: 100rpx;">
				用户消费认购协议

				重要提示!
				本平台是由用户自主进行消费认购，认购成功获得等相应贝壳，如您不接受该条款，请切勿参与认购!

				消费认购和重开规则:
				1、限时限量消费认购，每期认购时效为48小时内，超时未认购满，即为本期认购失败;
				2、当最后一期未认购满，系统自动重开结算，该期全额退回+认购成功1%的奖励；倒数两期获得70%广告补贴+斛西子奶茶终身分红权或者30%购物券+优先权;
				3、重开结算后，可再从第1期重新消费认购，以此类推，周而复始，生生不息;
				4、当第3期消费认购成功时，发放第1期广告补贴:
				当第4期消费认购成功时，发放第2期广告补贴，以此类推;
				5、广告补贴100%可提现;
				6、广告补贴是平台赠送用户的行为，有不可逆性及最终性，用户可根据平台活动规则获得广告补贴。平台回馈用户的活动不存在长期性和固定性，是根据市场情况而设立的活动或取消活动!
				如您同意点击"同意并继续”后，即表示您已充分阅读理解并接受协议

				勾选表示已阅读并同意《用户购买协议》


			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 0
			}
		},
		onLoad(option) {
			console.log(option)
			this.type = option.type
			console.log('protocal_info', this.protocal_info);
		},
		methods: {

		}
	}
</script>

<style>

</style>
