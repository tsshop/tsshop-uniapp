<template>
  <view class="">
    <input type="text" v-model="inputValue" :style="{fontSize:fontSize + 'rpx',textAlign:align}" :placeholder="placeholder" :maxlength="maxlength"/>
  </view>
</template>

<script>
export default {
    name:'lw-num-input',
    props: {
        fontSize: {
            type:Number,
            default: 26
        },
        placeholder: {
            type:String,
            default:'请输入内容'
        },
        maxlength: {
            type:String,
            default:'1000'
        },
        numType: {
            type:String,
            default:'z'
        },
        value: {
            type: [String, Number],
            default:''
        },
        align: {
            type:String,
            default:'left'
        }
    },
    data() {
        return {
            inputValue:''
        };
    },
	created() {
		console.log('created------------');
        this.inputValue = this.value
	},
    computed: {
        num_rule() {
            const regMap = {
              d2: /^(-)?(\d+(\.?\d{0,2}))?/, // 两位小数正负
              zd2: /\d+(\.?\d{0,2})/, // 正两位小数
              zd1: /\d+(\.?\d{0,1})/, // 正一位小数
              z: /\d{0,12}/, // 正数 max 12位
              z180: /^(?:[1-9]\d?|1[0-7]\d|180)$/, // 正整数 大于0小于等于180
              zz: /^[0-9]*[0-9][0-9]*$/ // 正整数，包含零
            }
            return regMap[this.numType]
        }
    },
	watch: {
		inputValue(newV) {
			console.log('newV');
			this.TypeInput(newV?.toString())
		}
	},
    methods: {
        TypeInput(val) {
			this.$nextTick(() => {
                const matchedStrs = (val?.match(this.num_rule) && val?.match(this.num_rule)?.filter(t => t)) || []
                let result = matchedStrs[0] || ''
                this.inputValue = result
                this.$emit('update:value', result)
			})
		},
    }
}
</script>

<style>

</style>