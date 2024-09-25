<template>
  <div class='com-container' @dblclick="revertMap">
    <div class='com-chart' ref='map_ref' ></div>
  </div>
</template>
<script>
import axios from 'axios';
import chalkTheme from '../../public/static/theme/chalk.json'
import {getProvinceMapInfo} from '@/utils/map_utils'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null
    }
  },
  mounted() {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    async initChart() {
      this.$echarts.registerTheme('theme1',chalkTheme)
      this.chartInstance = this.$echarts.init(this.$refs.map_ref,this.$store.state.theme)
      const res=await axios.get('http://localhost:8899/static/map/china.json')
      console.log(res)
      this.$echarts.registerMap('chinaMap',res.data)
      const initOption = {
        title:{
          text:'玩家分布',
          left:20,
          top:20
        },
        legend:{
          bottom:'5%',
          left:'5%',
          orient:'vertical'
        },
        geo:{
          type:'map',
          map:'chinaMap',
          top:'5%',
          bottom:'5%',
          itemStyle:{
            areaColor:'#2E72BF',
            borderColor:'#333'
          }
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click',async (arg)=>{
        const provinceInfo=getProvinceMapInfo(arg.name)
        const res=await axios.get('http://localhost:8899'+provinceInfo.path)
        this.$echarts.registerMap(provinceInfo.key,res.data)
        const changeOption={
          geo:{
            map:provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    async getData() {
      const result=await this.$http.get('map')
      this.allData=result.data
      console.log(this.allData)
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      this.updateChart()
    },
    updateChart() {
      const seriesArr=this.allData.map((item)=>{
        return {
          type:'effectScatter',
          name:item.name,
          data:item.children,
          coordinateSystem:'geo',
          rippleEffect:{
            scale:5,
            brushType:'stroke'
          }
        }
      })
      const legendArr=this.allData.map((item)=> item.name)
      // 处理图表需要的数据
      const dataOption = {
        series:seriesArr,
        legend:{
          data:legendArr
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize=this.$refs.map_ref.offsetWidth/100*3.6
      const adapterOption = {
        title:{
          textStyle:{
            fontSize:titleFontSize
          }
        },
        legend:{
          itemWidth:titleFontSize/2,
          itemHeight:titleFontSize/2,
          itemGap:titleFontSize/2,
          textStyle:{
            fontSize:titleFontSize/2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    revertMap(){
      const revertOption={
        geo:{
          map:'china'
        }
      }
      this.chartInstance.setOption(revertOption)
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
<style lang='less' scoped></style>