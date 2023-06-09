<template>
	<view>
		<custom background="#F5F6F7" fixed="fixed" mode="2" title="商品评论" titleColor="#32343A" :titleBold="false">
		</custom>
		<comment :list="list"></comment>
		<qq-footer :show="is_null" :list="list"></qq-footer>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				id:'',
				is_null:false
			}
		},
		onLoad(e) {
			console.log(e)
			if(e.id) {
				this.id = e.id
			}
			this.get_list()
		},
		methods: {
			get_list() {
				this.request({
					url: '/goodsReview/getGoodsReviewList',
					data: {
						goodsId: this.id,
						pageNumber:1,
						pageSize:3
					},
					method:'POST'
				}).then(res => {
					if (res.status != 200) return
					res.data.list.forEach(val => {
						val.imgList = val.imgs.split(",")
						val.time = this.dateFormat('YY-mm-dd', new Date(val.createTime))
					})
					this.list = res.data.list
					if(this.list.length == 0) {
						this.is_null = true
					}
					console.log(this.list )
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}

	
</style>
