<template>
	<view style="display: inline;">
		{{get_time}}
	</view>
</template>

<script>
	export default {
		name: "timestamp",
		props: {
			time: {
				type: [String, Number],
				default: '',
			},
			timeType: {
				type: [String],
				default: '1',
			}
		},
		computed: {
			get_time() {
				let val = this.time;

				if (val) {
					let date_now = new Date();
					let y = date_now.getFullYear();
					let m = date_now.getMonth();
					let d = date_now.getDay();

					let date_v = new Date(Number(val));
					if (y == date_v.getFullYear()) {
						if (d == date_v.getDay() && m == date_v.getMonth()) {
							//今天
							let ss = String(date_v.getMinutes());
							if (ss.length == 1) {
								ss = '0' + ss;
							}
							return date_v.getHours() + ':' + ss;
						}
						if (m == date_v.getMonth() && d - date_v.getDay() == 1) {
							return '昨天';
						}
						return this.dateFormat('mm-dd', date_v);


					} else {
						//以前
						// return String(date_v.getMonth()) + '-' + String(date_v.getDay());
						return this.dateFormat('YY-mm-dd', date_v);

					}


				}

				return '';
			}
		},
		data() {
			return {
				str: '',
			};
		},
		methods: {

		}
	}
</script>

<style lang="scss">

</style>
