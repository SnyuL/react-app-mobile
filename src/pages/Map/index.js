import React from "react"

//导入样式
import "./index.scss"
import NavHeader from '../../components/NavHeader/index'

import styles from './index.module.css'
// 覆盖物样式
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

export default class Map extends React.Component {
  
  state = {
    houseList: [{
        coord: {
          latitude: "117.27",
          longitude: "31.85"
        },
        count: "40",
        label: "蜀山",
        value: "46797787"
      },
      {
        coord: {
          latitude: "117.47",
          longitude: "31.88"
        },
        count: "10",
        label: "肥东",
        value: "46797732"
      },
      {
        coord: {
          latitude: "117.17",
          longitude: "31.72"
        },
        count: "10",
        label: "肥西",
        value: "46797587"
      },
      {
        coord: {
          latitude: "117.25",
          longitude: "31.88"
        },
        count: "20",
        label: "庐阳",
        value: "46797735"
      },
      {
        coord: {
          latitude: "117.3",
          longitude: "31.87"
        },
        count: "50",
        label: "瑶海",
        value: "46797767"
      },
      {
        coord: {
          latitude: "117.3",
          longitude: "31.8"
        },
        count: "10",
        label: "包河",
        value: "46797754"
      },
    ],
    // 表示是否展示房源列表
    isShowList: false
  }
  componentDidMount() {
    this.initMap()
  }
    // 初始化地图
    initMap() {
      // 获取当前定位城市
      const {
        label,value
      } = JSON.parse(localStorage.getItem('hkzf_city'))
          // 注意：在 react 脚手架中全局对象需要使用 window 来访问，否则，会造成 ESLint 校验错误
          const {
            BMapGL
          } = window
          const map = new BMapGL.Map('container')
      // 作用：能够在其他方法中通过 this 来获取到地图对象
      this.map = map
      // 创建地址解析器实例
      const myGeo = new BMapGL.Geocoder()
      // 将地址解析结果显示在地图上，并调整地图视野
      myGeo.getPoint(
        label,
        async point => {
          if (point) {
            //  初始化地图
            map.centerAndZoom(point, 11)
            // 添加常用控件
            map.addControl(new BMapGL.NavigationControl())
            map.addControl(new BMapGL.ScaleControl())
  
            // 调用 renderOverlays 方法
            this.renderOverlays(value)
          }
        },
        label
      )
    }
  //渲染覆盖物入口
  renderOverlays(second){
    // 调用 getTypeAndZoom 方法获取级别和类型
     const { nextZoom, type } = this.getTypeAndZoom()
     console.log(second)
     if(second==="小区"){
       this.setState({
        houseList:[{
          coord: {
            latitude: "117.30",
            longitude: "31.89"
          },
          count: "10",
          label: "蜀山1",
          value: "56797787"
        },],
        isShowList:true
       })
       this.state.houseList.forEach(item=>{

        //调用创建覆盖物的方法
        this.createOverlays(item,nextZoom, type)
      }) 
     }else{
        this.state.houseList.forEach(item=>{

      //调用创建覆盖物的方法
      this.createOverlays(item,nextZoom, type)
    })
     }
         
   
  }
  //计算小区的缩放级别
  getTypeAndZoom(){
     // 调用地图的 getZoom() 方法，来获取当前缩放级别
     const zoom = this.map.getZoom()
     let nextZoom, type
     // console.log('当前地图缩放级别：', zoom)
    if (zoom >= 10 && zoom < 12) {
      // 区
      // 下一个缩放级别
      nextZoom = 13
      // circle 表示绘制圆形覆盖物（区、镇）
      type = 'circle'
    } else if (zoom >= 12 && zoom < 14) {
      // 镇
      nextZoom = 15
      type = 'circle'
    } else if (zoom >= 14 && zoom < 16) {
      // 小区
      type = 'rect'
    }

    return {
      nextZoom,
      type
    }
  }
  //创建覆盖物
  createOverlays(data,zoom, type) {
    const {
      coord: {
        latitude,
        longitude
      },
      label: areaName,
      count,value
    } = data

    //创建坐标对象
    const areaPoint = new window.BMapGL.Point(latitude, longitude)
    if(type==="circle"){
      //区镇
      this.createCircle(areaPoint,areaName,count,value,zoom)
    }else{
      //小区覆盖物
      this.createReat(areaPoint,areaName,count,value)
    }
  }
  //创建区镇覆盖物
  createCircle(point,name,count,id,zoom){
    const label = new window.BMapGL.Label("", {
      position: point,
      // offset: new BMapGL.Size(35, -35) //偏移位置
    }) //文本内容不需要，""清空即可

      //每个房源信息的id是唯一的
    label.id = id

    // 设置房源覆盖物内容
    label.setContent(`
    <div class="${styles.bubble}">
      <p class="${styles.name}">${name}</p>
      <p>${count}套</p>
    </div>
  `)
      //设置样式
      label.setStyle(labelStyle)
         //添加点击事件
  label.addEventListener("click", () => {
    console.log("房屋被覆盖了！",label.id)
    this.renderOverlays("小区")
    //点击覆盖物放大当前的地图位置,第一个参数是地点坐标，第二个参数是放大倍数
   this.map.centerAndZoom(point, zoom);

     // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
     setTimeout(() => {
      // 清除当前覆盖物信息
      this.map.clearOverlays()
    }, 0)
  })
       //添加覆盖物到地图中去
       this.map.addOverlay(label)
  }
  //创建小区覆盖物
  createReat(point, name, count, id){
     // 创建覆盖物
     const label = new window.BMapGL.Label('', {
      position: point,
      offset: new window.BMapGL.Size(-50, -28)
    })

    // 给 label 对象添加一个唯一标识
    label.id = id

    // 设置房源覆盖物内容
    label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${name}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)

    // 设置样式
    label.setStyle(labelStyle)

    // 添加单击事件
    label.addEventListener('click', e => {
      // 获取并渲染房源数据
      this.getHousesList(id)

      // 获取当前被点击项
      const target = e.changedTouches[0]
      this.map.panBy(
        window.innerWidth / 2 - target.clientX,
        (window.innerHeight - 330) / 2 - target.clientY
      )
    })

    // 添加覆盖物到地图中
    this.map.addOverlay(label)
  }
  render() {
    return ( 
    <div className = {styles.map} >
      <NavHeader> 地图找房 </NavHeader>
      {/* 地图容器元素 */ } 
      <div id = "container"/>
      </div>
    )
  }
}