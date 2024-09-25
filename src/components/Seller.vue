<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>

import { mapState } from 'vuex';
import chalkTheme from '../../public/static/theme/chalk.json'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentPage:1,
      totalPage:0,
      timeId:null
    }
  },
  components: {

  },
  mounted() {
    this.initChart(),
    // this.getData()
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
  },
  created () {
    // 在组件创建完成之后 进行回调函数的注册
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  destroyed(){
    clearInterval()
    window.removeEventListener('resize',this.screenAdapter)
  },
  methods: {
    initChart() {
   
      // console.log(this.$echarts.getTheme('chalk'))
      this.$echarts.registerTheme('theme1',chalkTheme)
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref,this.$store.state.theme)
      const initOption={ title:{
          text:'| 在线人数统计',
          textStyle:{
            fontSize:66
          }
        },
        grid:{
          top:'20%',
          left:'35%',
          right:'6%',
          bottom:'3%',
          // containLabel:true
        },
        xAxis: { type: 'value' },
        yAxis: {
          type: 'category',
         
        },
        tooltip:{
          trigger:'axis',
          axisPointer:{
            type:'line',
            z:0,
            lineStyle:{
              width:66,
              color:'#2D3443'
            }
          }
        },
        series: [{ type: 'bar',
       
          barWidth:66,
        label:{
          show:true,
          position:'right',
          textStyle:{
            color:'white'
          }
        },
        itemStyle:{
          barBorderRadius:[0,33,33,0],
          //通过矩形四个顶点指示渐变方向
          color:this.$echarts.graphic.LinearGradient(0,0,1,0,[
            {offset:0,
              color:'#5052EE'
            },
            {
              offset:1,
              color:'#AB6EE5'
            }
          ])
        } }]}
        this.chartInstance.setOption(initOption)
      
    },
     getData(ret) {
      console.log(ret)
      
      this.allData = ret
      this.allData=this.allData.sort((a,b)=>{return a.value-b.value })
      // console.log(this.allData)
      this.totalPage=this.allData.length%5==0?this.allData.length/5:this.allData.length/5+1
      this.updateChart()
      this.startInterval()
    },
    updateChart() {
      const start=(this.currentPage-1)*5
      const end=this.currentPage*5
      const renderData=this.allData.slice(start,end)
      const sellerNames = renderData.map((item) => {
        return item.name
      })
      const sellerValues = renderData.map((item) => {
        return item.value
      })
      const Dataoption = {
        yAxis: {    
          data: sellerNames
        },
        series: [{ 
         data: sellerValues,
        }]
      }
      this.chartInstance.setOption(Dataoption)
    },
    screenAdapter(){
      const titleFontsize=this.$refs.seller_ref.offsetWidth/100*3.6
      const adapterOption={title:{
          textStyle:{
            fontSize:titleFontsize
          }
        },
        
       
        tooltip:{
        
          axisPointer:{
            
            lineStyle:{
              width:titleFontsize,
             
            }
          }
        },
        series: [{ 
       
          barWidth:titleFontsize,
        label:{
        
        },
        itemStyle:{
          barBorderRadius:[0,titleFontsize/2,titleFontsize/2,0],
          //通过矩形四个顶点指示渐变方向
         
        } }]}
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
    },
    startInterval(){
      console.log(this.totalPage)
      if(this.timeId){
        clearInterval(this.timeId)
      }
      this.timeId=setInterval(()=>{
        this.currentPage++
        if(this.currentPage>this.totalPage){
          this.currentPage=1
        }
     
        this.updateChart()
      },3000)
    }
  },
  computed:{
    ...mapState(['theme']),
  },
  watch:{
    theme(){
      console.log(111)
      this.chartInstance.dispose()
      this.initChart() // 重新以最新的主题名称初始化图表对象
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart()
      
    }
  }
}
</script>

<style scoped lang='less'></style>