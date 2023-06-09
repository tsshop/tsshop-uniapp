<template>
    <view class="flex">
        <view class="year mr-20 flex flex-y-center" @tap.stop="changeYear">
            <view class="fs-28">{{ this.defaultYear }}年</view>
            <view class="jiantou mt-10" :class="{rotate: isOpen}"></view>
            <view class="year-list" :class="{'active-list': isOpen}">
                <view class="year-item" v-for="(year,index) in yearList" :key="index" :style="{color:year === defaultYear ? '#fb6b3a' : ''}" @tap.stop="changeActiveYear(year)">{{ year }}年</view>
            </view>
        </view>
        <view class="month-show fs-28">{{ showMonth }}</view>
        <view class="month ml-10">
            <scroll-view scroll-x="true" class="scroll-view_H" :scroll-into-view="activeId" :scroll-with-animation="true">
                <view :id="'id' + index" class="scroll-view-item_H uni-bg-red fs-28" :style="{color: active === index ? '#333333' : '#999999'}" v-for="(item,index) in month" :key="index" @tap.stop="changeActive(index)">{{ item }}</view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'TsshopUniappLwLiveDate',

    data() {
        return {
            month:['全年','一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            active: 0,
            isOpen: false,
            defaultYear:'',
            yearList:[],
            activeId:'id0'
        };
    },
    computed: {
        showMonth() {
            return this.month[this.active]
        }
    },

    created() {
        this.defaultYear = new Date().getFullYear()
        this.yearList = [ this.defaultYear - 1 , this.defaultYear, this.defaultYear + 1 ]
    },

    mounted() {
        this.submit()
    },

    methods: {
        changeActiveYear(year) {
            this.isOpen = !this.isOpen
            if(this.defaultYear === year) return
            this.defaultYear = year
            this.submit()
        },
        changeActive(index) {
            if(this.active === index) return
            this.active = index
            this.activeId = 'id' + (index - 1)
            this.submit()
        },
        changeYear() {
            this.isOpen = !this.isOpen
        },
        submit() {
            this.$emit('onSubmit',{ year: this.defaultYear,month: this.active })
        }
    },
};
</script>

<style lang="scss" scoped>
.scroll-view_H {
    white-space: nowrap;
    width: 100%;
}
.scroll-view-item_H {
    display: inline-block;
    padding: 0 20rpx;
    text-align: center;
}
.month {
    width: 280rpx;
}
.month-show {
    position: relative;
    &::before {
        position: absolute;
        content:'';
        width: 70%;
        text-align: center;
        height:6rpx;
        border-radius: 6rpx;
        bottom: -10rpx;
        left: 50%;
		transform: translateX(-50%);
        background-color: #333333;
    }
}
.year {
    position: relative;
    .jiantou {
        width: 0;
        height: 0;
        margin-left: 5rpx;
        border-top: 6rpx solid transparent;
        border-left: 6rpx solid transparent;
        border-bottom: 6rpx solid #333333;
        border-right: 6rpx solid #333333;
        transition: transform 0.4s, top 0.4s;
        transform-origin:50% 50%;
    }
    .rotate {
        transform: rotate(45deg);
    }
    .year-list {
        position: absolute;
        width: 150rpx;
        height: 0;
        top: 50rpx;
        left:50%;
        transform: translateX(-50%);
        border-radius: 20rpx;
        background: linear-gradient(108deg, #F9FAFB 0%, #FFFFFF 100%);
        box-shadow: 11rpx 10rpx 9rpx 1rpx rgba(50,71,93,0.04);
        transition: all 0.2s linear;
        overflow: hidden;
        opacity: 0;
    }
    .active-list {
        padding: 10rpx;
        height: 180rpx;
        opacity: 1;
    }
    .year-item {
        height:50rpx;
        text-align: center;
        line-height: 60rpx;
    }
}
</style>