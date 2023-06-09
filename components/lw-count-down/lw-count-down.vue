<template>
    <view class="">{{ showTime }}</view>
</template>

<script>
export default {
    name: 'TsshopUniappLwCountDown',

    data() {
        return {
            showTime:'',
            timer:null
        };
    },
    props: {
        endTime: {
            type: Number,
            default:0,
        }
    },

    mounted() {
        
    },

    created() {
        this.init()
    },
    beforeDestroy() {
        clearTimeout(this.timer)
    },
    methods: {
        init() {
            clearTimeout(this.timer)
            let now = new Date().getTime()
            let cha = this.endTime - now
            let h = parseInt(cha / (1000* 60 * 60)).toString().padStart(2, '0')
            let cha1 = parseInt(cha % (1000* 60 * 60))
            let m = parseInt(cha1 / (1000 * 60)).toString().padStart(2, '0')
            let cha2 = parseInt(cha1 % (1000 * 60))
            let s = parseInt(cha2 / 1000).toString().padStart(2, '0')
            this.showTime = `${h}:${m}:${s}`
			if(cha == 0){
				this.$emit('init');
				return ;
			}

            this.timer = setTimeout(()=> {
                this.init()
            },1000)
        }
    },
};
</script>

<style lang="scss" scoped>

</style>