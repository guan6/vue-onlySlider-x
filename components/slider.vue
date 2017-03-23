<!-- slider 组件 for VUE 2.x -->
<template>
  <div class="vue-only-slider">
    <ul :style="{
      width:`${scaleW}px`,
      height:`${sliderHeight}px`
    }">
      <li v-for="(item,index) in itemsForDom" :key="index" :style="{
        width:scaleW+'px',
        transform:'translate3d('+index*scaleW+'px, 0, 0)'
      }">
      	<a v-if="item.href" :href="item.href">
          <img :src="item.src" :style="{
            height:`${sliderHeight}px`
          }">
        </a>
        <img :src="item.src" v-else :style="{
          height:`${sliderHeight}px`
        }">
      </li>
    </ul>
    <div class="pagination" v-if="pagination">
      <i v-for="(item,index) in itemsLength" :class="{on:(current === index) || (itemsLength === 2 && current%itemsLength === index)}">{{index+1}}</i>
    </div>
  </div>
</template>

<script>
module.exports = {
	/*
		items 幻灯片数组
			- 此数组至少包含一个对象，每个对象可以包含1个或多个键值对；分别存储图片地址和链接地址等信息
        - [{src:'xxx',href:'xxxx'},{}.......]
    pagination  是否显示页码
      - 默认 true
      - 可以通过props :pagination="false" 禁用页码
    autoPlay    自动播放
      - 默认 true
      - 可通过props :auto-play="false" 禁止自动播放
    speed   自动播放时间间隔（毫秒）
      - 默认 3000
      - 可通过props :speed="5000" 修改间隔
	*/
  props:{
    sync:{
      type:Boolean,
      default: false//传入数据是否为同步？
    },
    items:{
      type:Array
    },
    width:{
      type:Number
    },
    height:{
      type:Number
    },
    pagination:{
      type:Boolean,
      default: true
    },
    speed:{
      type:Number,
      default: 3000//自动播放，默认时间间隔
    },
    autoPlay:{
      type:Boolean,
      default: true
    }
  },
  data(){
    return {
      scaleW:window.innerWidth,//页面宽度
      sliedrWrap:null,//滑块容器dom对象
      itemsDom:null,//滑动单元dom对象数组
      itemsDomLength:undefined,//滑块数量（渲染后的）
      current:0,//当前滑块索引
      prev:undefined,//上滑块索引
      next:1,//下滑块索引
      startTime:undefined,//记录手指按下时间
      startX:undefined,//手指按下的坐标
      offsetX:0,//手指偏移量
      timer:null//计数器
    }
  },
  computed:{
    itemsForDom(){
      // 用于渲染的滑块单元数组
      //默认情况下用于渲染的滑块数组 === 传入的滑块数组
      var tmp = []
      if(this.items.length === 2){
        for(var i=0;i<4;i++) tmp.push(this.items[i%2])
        return tmp
      }else{
        return this.items
      }
    },
    itemsLength(){
      //计算滑块数量（传入的）
      return this.items.length
    },
    sliderHeight(){
      return parseFloat(this.scaleW * (this.height / this.width))
    }
  },
  mounted(){
    if(this.sync){
      // 如果为同步数据，则直接初始化
      this.init()
    }else{
      this.$watch('items',function(){
        // 如果为ajax异步返回数据，则监控items更改后在初始化
        this.init()
      });
    } 
  },
  methods:{
    init(){
      /***  
        初始化
      */

      // 如果仅有一个滑块，则只渲染dom，不使用滑块其他功能
      if(this.itemsLength < 2){
        this.autoPlay = this.pagination = false
      }else{
        this.itemsDomLength = this.itemsLength === 2 ? 4 : this.itemsLength

        //重置上滑块索引
        this.prev = this.itemsDomLength - 1

        //保存滑块容器dom对象
        this.sliedrWrap = this.$el.getElementsByTagName('ul')[0]

        //保存滑块单元dom对象数组
        this.itemsDom = this.sliedrWrap.getElementsByTagName('li')

        // 在滑块容器上监听事件
        this.addListener()

        // 自动播放
        this.autoPlay ? this.play(true) : ''
      }
    },
    goIndex(orientation){
      /***  过渡方法：
        orientation 只接收字符串 '+1'、'-1'、'0'
          +1  左移一屏
          -1  右移一屏
          0   停在当前屏
      */
      var _current = this.current,
          _prev = this.prev,
          _next = this.next,
          _cidx = 0,
          _time = 300 // 过渡动画时长

      if(typeof orientation == 'string'){
        _cidx = _current + orientation*1
      }

      // cidx仅一种情况值为 -1 ：初始化完成后第一次向右滑动一屏
      // 滑动完成后，当前索引 === 最高位索引
      if(_cidx === -1){
        _current = this.itemsDomLength-1
        _prev = _current-1
        _next = 0
      }else{
        _current = _cidx % this.itemsDomLength
        _prev = _current === 0 ? this.itemsDomLength-1 : (_cidx-1) % this.itemsDomLength
        _next = (_cidx+1) % this.itemsDomLength
      }

      // 保存各位置索引
      this.current = _current
      this.prev = _prev
      this.next = _next

      // 过渡动画设置 动画结束后图片的相应位置
      this.setTrans(this.itemsDom[_current], _time, 0)

      switch(orientation){
        case '+1':
          this.setTrans(this.itemsDom[_next], 0, this.scaleW)
          this.setTrans(this.itemsDom[_prev], _time, -this.scaleW)
        break;
        case '-1':
          this.setTrans(this.itemsDom[_prev], 0, -this.scaleW)
          this.setTrans(this.itemsDom[_next], _time, this.scaleW)
        break;
        default:
          this.setTrans(this.itemsDom[_prev], _time, -this.scaleW)
          this.setTrans(this.itemsDom[_next], _time, this.scaleW)
      }
    },
    startHandler(event){
      /***  
        手指按下时触发的方法
      */
     
      // 暂停自动播放
      this.autoPlay ? this.play(false) : ''

      //记录手指按下的时间
      this.startTime = new Date() * 1

      //记录手指按下的坐标
      this.startX = event.touches[0].pageX

      //清除偏移量
      this.offsetX = 0
    },
    moveHandler(event){
      /***
        手指拖动时触发方法
      */
     
      //兼容chrome android，阻止浏览器默认行为，修复安卓中微信内置浏览器touchmove不连续触发问题
      event.preventDefault()

      //计算手指的偏移量
      this.offsetX = event.targetTouches[0].pageX - this.startX

      // 手指滑动时改变图片位置
      this.setTrans(this.itemsDom[this.current], 0, this.offsetX)
      this.setTrans(this.itemsDom[this.prev], 0, -this.scaleW+this.offsetX)
      this.setTrans(this.itemsDom[this.next], 0, this.scaleW+this.offsetX)
    },
    endHandler(){
      /***
          手指离开时触发方法
      */
     
      // 手指离开后重新开始自动播放
      this.autoPlay ? this.play(true) : ''

      var _boundary = this.scaleW/6,// 边界就翻页值
          _endTime = new Date() * 1// 手指离开的时间值

      //当手指移动时间超过300ms 的时候，按位移算
      if(_endTime - this.startTime > 300){
        if(this.offsetX >= _boundary){
          this.goIndex('-1')
        }else if(this.offsetX < 0 && this.offsetX < -_boundary){
          this.goIndex('+1')
        }else{
          this.goIndex('0')
        }
      }else{
        //快速移动也能使得翻页
        if(this.offsetX > 50){
          this.goIndex('-1')
        }else if(this.offsetX < -50){
          this.goIndex('+1')
        }else{
          this.goIndex('0')
        }
      }
    },
    play(play){
      /***
        自动播放
      */
      var self = this

      if(play){
        clearInterval(self.timer)
          self.timer = setInterval(function(){
            // 默认左滑动
            self.goIndex('+1')
          },self.speed)
      }else{
        clearInterval(self.timer)
      }
    },
    setTrans(obj,time,target){
      /*** 设置动画
        obj 待处理DOM对象
        time 过渡时间
        target 目标位置
      */
      obj.style.WebkitTransitionDuration = time+'ms'
      obj.style.WebkitTransform = 'translate3d('+ target +'px, 0, 0)'
    },
    addListener(){
      // 添加事件监听
      this.sliedrWrap.addEventListener('touchstart', this.startHandler)
      this.sliedrWrap.addEventListener('touchmove', this.moveHandler)
      this.sliedrWrap.addEventListener('touchend', this.endHandler)
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
  ul{
    width: 100%;
    overflow: hidden;
  }
  li{
    position: absolute;
  }
  a,img{
    display: block;
    width: 100%;
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