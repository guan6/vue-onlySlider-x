<!-- slider 组件 for VUE 2.x -->
<template>
  <div class="vue-only-slider" :class="{'slider-left':touchOffsetX < 0,'slider-right':touchOffsetX > 0,reseting:reseting}" ref="sliderWrap">
    <div class="slider-wrap" :style="{width:`${itemWidth}px`,height:`${sliderHeight}px`}">
      <ul :style="{width:`${totalWidth}px`,}" ref="slider">
        <li v-for="(item,index) in _items" :key="index" :style="itemStyle" ref="itemDoms">
          <a v-if="item.href" :href="item.href">
            <img :src="item.src">
          </a>
          <img :src="item.src" v-else>
        </li>
      </ul>
    </div>
    <div class="pagination" v-if="pagination">
      <i v-for="(item,index) in items.length" :class="{on:current - loopPushNum === index}">{{item}}</i>
    </div>
  </div>
</template>

<script>
module.exports = {
  props:{
    //传入数据是否为同步？
    sync:{
      type:Boolean,
      default: false
    },
    // 单滑块的宽度占屏幕总宽百分比
    viewportRatio:{
      type:Number,
      default:100
    },
    // 单滑块间距
    gap:{
      type:Number,
      default:0
    },
    // 传入的滑块数组
    items:{
      type:Array
    },
    // 原图宽度
    sourceWidth:{
      type:Number
    },
    // 原图高度
    sourceHeight:{
      type:Number
    },
    // 是否显示分页
    pagination:{
      type:Boolean,
      default: true
    },
    // 自动播放，默认时间间隔
    speed:{
      type:Number,
      default: 3000
    },
    // 是否自动播放
    autoPlay:{
      type:Boolean,
      default: false
    },
    // 是否循环播放
    loop:{
      type:Boolean,
      default:true
    },
    // 过渡css
    anims:{
      type:String
    }
  },
  data(){
    return {
      windowWidth:window.innerWidth,//页面宽度
      slider:null,//滑块
      itemDoms:null,//
      sliedrWrap:null,//滑块容器
      orientation:'<',//方向 左< 、右>
      animTime:200,//动画时长
      startTime:0,//记录手指按下时间
      touchStartX:0,//手指按下的坐标
      sliderTouchOffsetX:0,//记录滑块位置
      touchOffsetX:0,//手指偏移量
      timer:null,//计数器
      current:0,//当前滑块索引
      reseting:false//重置位置过程中？
    }
  },
  computed:{
    // 头尾补充元素个数(不要修改)
    loopPushNum(){
      return this.loop ? 2 : 0
    },
    // 单滑块宽度
    itemWidth(){
      return this.windowWidth * this.viewportRatio / 100
    },
    // 单滑块宽度（含间距）
    itemSpaceWidth(){
      return this.itemWidth + this.gap
    },
    // 滑块容器总宽度
    totalWidth(){
      return this.itemSpaceWidth * this.itemsLength - this.gap
    },
    // 滑块容器高度
    sliderHeight(){
      return parseFloat(this.itemWidth * (this.sourceHeight / this.sourceWidth))
    },
    // 用于渲染DOM的数据(当只有一个元素时，不添加其他元素)
    _items(){
      if(this.loop && this.items.length > 1){
        return this.items.slice(this.items.length - this.loopPushNum).concat(this.items,this.items.slice(0,this.loopPushNum))
      }else{
        return this.items
      }
    },
    // 数组长度
    itemsLength(){
      return this._items.length
    },
    itemStyle(){
      return `width:${this.itemWidth}px;margin-right:${this.gap}px;`
    }
  },
  watch:{
    current(){
      this.anims ? this.setDomStyle('init') : ''
    },
  },
  mounted(){
    this.sliedrWrap = this.$refs.sliderWrap
    this.slider = this.$refs.slider
    this.itemDoms = this.$refs.itemDoms

    if(this.sync){
      // 如果为同步数据，则直接初始化
      this.init()
    }else{
      this.$watch('items',function(){
        // 如果为ajax异步返回数据，则监控items更改后在初始化
        this.init()
      })
    }
  },
  methods:{
    init(){
      // 当只有一个元素时，什么都不做
      if(this.items.length === 1) return

      // 监听touch事件
      this.addListener()

      // 如果无限循环，则初始化滑块位置
      if(this.loop){
        this.current = this.loopPushNum
        this.sliderTouchOffsetX = -this.itemSpaceWidth * this.loopPushNum
        this.setTrans(this.sliderTouchOffsetX, 0)
      }

      // 是否自动播放
      this.autoPlay ? this.autoplay() : ''
    },
    setDomStyle(init){
      if(init){
        let min = this.anims.replace(/{[^}]+}/g,val => JSON.parse(val).min),
            max = this.anims.replace(/{[^}]+}/g,val => JSON.parse(val).max)

        this.itemDoms.forEach((elem,i) => {
          elem.style = this.itemStyle + min
        })

        this.itemDoms[this.current].style = this.itemStyle + max
      }else{
        let inDom = this.orientation === '>' ? this.itemDoms[this.current - 1] : this.itemDoms[this.current + 1],
            outDom = this.orientation === '>' ? this.itemDoms[this.current + 1] : this.itemDoms[this.current - 1],
            up = this.anims.replace(/{[^}]+}/g, val => {
              let v = JSON.parse(val)
              return v.min + (v.max - v.min) * Math.abs(this.touchOffsetX / this.itemWidth)
            }),
            down = this.anims.replace(/{[^}]+}/g, val => {
              let v = JSON.parse(val)
              return v.max - (v.max - v.min) * Math.abs(this.touchOffsetX / this.itemWidth)
            })

        inDom.style = this.itemStyle + up
        this.itemDoms[this.current].style = this.itemStyle + down
      }
    },
    goIndex(index){
      let target = -this.itemSpaceWidth * index

      // 检查是否需要重置位置
      this.loop ? this.resetPosition() : ''

      this.setTrans(target, this.animTime)
      this.sliderTouchOffsetX = target
    },
    autoplay(){
      this.timer = setInterval(() => {
        // 非循环模式时，当到达边界时反向滚动
        if(!this.loop){
          if(this.current === 0){
            this.orientation = '<'
          }else if(this.current === this.itemsLength - 1){
            this.orientation = '>'
          }
        }else{
          // 检查是否需要重置位置
          this.resetPosition()
        }

        // 向左/右滑动
        if(this.current >= 0 && this.current < this.itemsLength){
          this.orientation === '>' ? this.current -= 1 : this.current += 1
          this.goIndex(this.current)
        }
      },this.speed)
    },
    // 检查是否需要重置位置
    resetPosition(){
      // 切换动画完成后执行检查
      if(this.current === 1 || this.current === this.itemsLength - 2){
        this.reseting = true
      }else{
        this.reseting = false
      }
      
      let timer = setTimeout(() => {
        // 滚动到头部、尾部补充元素
        if(this.current === 1 || this.current === this.itemsLength - 2){
          this.current = this.current === 1 ? this.itemsLength - (this.loopPushNum + 1) : this.loopPushNum
          this.sliderTouchOffsetX = -this.itemSpaceWidth * this.current
          this.setTrans(this.sliderTouchOffsetX)
        }
        
        clearTimeout(timer)
      },this.animTime + 1000)
    },
    startHandler(event){

      //记录手指按下的时间
      this.startTime = new Date() * 1

      //记录手指按下的坐标
      this.touchStartX = event.touches[0].pageX

      // 停止自动播放
      clearInterval(this.timer)
    },
    moveHandler(event){
      event.preventDefault()
      event.stopPropagation()

      //计算手指的偏移量
      this.touchOffsetX = event.targetTouches[0].pageX - this.touchStartX

      // 手指滑动时改变图片位置
      this.setTrans(this.touchOffsetX + this.sliderTouchOffsetX)

      // 手指偏移方向决定接下来的滚动方向
      this.orientation = this.touchOffsetX < 0 ? '<' : '>'

      this.anims ? this.setDomStyle() : ''
    },
    endHandler(){
      event.stopPropagation()
      
      // 开始自动播放
      this.autoPlay ? this.autoplay() : ''

      // 存储滑块偏移距离
      this.sliderTouchOffsetX += this.touchOffsetX

      // 计算应该到达的索引（大于50%则增一个索引，否则不变）
      let targetIndex = Math.round(this.sliderTouchOffsetX / this.itemWidth),
          moveTime = new Date() * 1

      // 快速滑动（时间小于500毫秒 && 距离大于50px）
      if(moveTime - this.startTime < 500 && Math.abs(this.touchOffsetX) > 50){
        this.touchOffsetX > 0 ? this.current-- : this.current++

        // 不要超出索引范围
        this.current = this.current < 0 ? 0 : this.current
        this.current = this.current >= this.itemsLength ? this.itemsLength - 1 : this.current
      }else{
        if(targetIndex > 0){
          this.current = 0
        }else if(Math.abs(targetIndex) >= this.itemsLength){
          this.current = this.itemsLength - 1
        }else{
          this.current = Math.abs(targetIndex)
        }
      }

      //清除偏移量
      this.touchOffsetX = 0

      // 滚动到目标
      this.goIndex(this.current)

      this.anims ? this.setDomStyle('init') : ''
    },
    setTrans(target,time = 0){
      this.slider.style.WebkitTransitionDuration = `${time}ms`
      this.slider.style.WebkitTransform = `translate3d(${target}px, 0, 0)`
    },
    addListener(){
      this.sliedrWrap.addEventListener('touchstart', this.startHandler,false)
      this.sliedrWrap.addEventListener('touchmove', this.moveHandler,false)
      this.sliedrWrap.addEventListener('touchend', this.endHandler,false)
    }
  }
}
</script>

<style lang="sass">
.vue-only-slider{
  width: 100%;
  position: relative;
  text-align: center;
  overflow: hidden;
  .slider-wrap{
    position:relative;
    margin:0 auto;
  }
  ul{
    position:absolute;
    left:0;
    top:0;
    &:after{
      content:"";
      display:block;
      clear:both;
    }
  }
  li{
    float:left;
    transition:all .3s;
    &:last-child{
      margin:0!important;
    }
  }
  &.reseting{
    li{
      transition:all 0s;
    }
  }
  a,img{
    display: block;
    width: 100%;
    border-radius:8px;
    -webkit-touch-callout: none;//禁止长按链接和图片出现菜单
  }
  .pagination{
    z-index: 2;
    line-height: 1;
    position: absolute;
    width: 100%;
    left:0;
    bottom:8px;
    i{
      display: inline-block;
      width: 6px;
      height: 6px;
      overflow: hidden;
      border-radius: 100%;
      background:rgba(255,255,255,.3);
      margin:0 3px;
      text-indent: -9999px;
      &.on{
        background-color: rgba(0,0,0,.3);
      }
    }
  }
}
</style>