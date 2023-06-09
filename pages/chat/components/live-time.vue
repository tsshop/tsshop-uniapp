<template>
	<text class="fs-28 color-ffffff">{{str}}</text>
</template>

<script>
	export default {
		name: 'liveTime',
		props: {
			liveTime: {
				type: [Number, String],
				default: 0,
			}
		},
		data() {
			return {
				str: '00:00:00',
				time: 0,
			}
		},
		created() {
			this.time = Number(this.liveTime) || 0;
			clearInterval(this.timer1);
			this.timer1 = setInterval(() => {
				this.time++;
				this.setTime();
			}, 1000);

		},
		methods: {
			stop() {
				clearInterval(this.timer1);
			},
			setTime() {


				let time = this.time;

				let h = parseInt(time / 3600);
				if (String(h).length == 1)
					h = '0' + String(h);
				time = time % 3600;
				let m = parseInt(time / 60);
				if (String(m).length == 1)
					m = '0' + String(m);
				time = time % 60;
				let s = time;
				if (String(s).length == 1)
					s = '0' + String(s);
				this.str = `${String(h)}:${String(m)}:${String(s)}`;


			}
		},
	}
</script>

<style>

</style>
