import Vue from 'vue'
import Slider from './components/slider.vue'


// slider 数据
let imgs = [
  {href:'',src:'img/1.png'},
  {src:'img/2.png'},
  {href:'https://cn.vuejs.org/',src:'img/3.png'}
]

// 创建实例
new Vue({
	el: '#Slider',
	data: {
    imgs: imgs
	},
	components:{
		Slider
	}
})