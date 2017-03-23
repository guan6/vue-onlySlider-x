module.exports = {
  plugins: [
    // 自动补全前缀
    require('autoprefixer')({ /* ...options */ }),
    /*px to rem
      require('postcss-pxtorem')({
        //根元素font size
        rootValue:75,
        //会被转换的属性
        propList:[]
        propList:["width","height","min-width","max-width","min-height","max-height","top","right","bottom","left","line-height","padding","padding-top","padding-right","padding-bottom","padding-left","margin","margin-top","margin-right","margin-bottom","margin-left"]
      })
    */
  ]
}