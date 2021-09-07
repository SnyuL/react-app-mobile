import React from 'react'
// import axios from "axios"
import {Toast} from 'antd-mobile'
import NavHeader from '../../components/NavHeader/index'

import "./index.scss"
//导入react-virtualized组件
import { List, AutoSizer } from 'react-virtualized';

//导入 utils中获取当前定位的城市
// import { getCurrentCity } from "../../utils/index.jsx"
/**
 * 格式化返回的数据
 * @param {*} list 
 */

function formatCityData(list) {
    // 键是首字母，值是一个数组：对应首字母的城市信息
    let cityList = {}
    list.forEach(item => {
        // 通过简写获取到第一个首字母
        let first = item.short.substr(0, 1)
        // 判断对象中是否有这个key 我们可以利用对象取值的第二种方式 中括号的方式
        if (cityList[first]) {
            // 如果进入if 代表有这个值，我们只需要直接push进去
            cityList[first].push(item)
        } else {
            // 如果进入else 代表没有这个值，我们初始化这个属性，并且把当前数据设置进去
            cityList[first] = [item]
        }
    })
    // 接下来我们需要把 cityList里面所有的key取出来，放在数组中，充当城市列表右侧的首字母导航条
    let cityIndex = Object.keys(cityList).sort()
    return {
        cityList,
        cityIndex
    }
}

// 封装处理字母索引的方法
const formatCityIndex = letter => {
    switch (letter) {
        case '#':
            return '当前定位'
        case 'hot':
            return '热门城市'
        default:
            return letter.toUpperCase()
    }
}

// 有房源的城市
const HOUSE_CITY = ['合肥', '上海', '广州', '深圳']
export default class CityList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cityList: {},
            cityIndex: [],
            activeIndex: 0,
            list: [
                { "label": "北京", "value": "1", "pinyin": "bejing", "short": "bg" },
                { "label": "上海", "value": "2", "pinyin": "shanghai", "short": "sh" },
                { "label": "武汉", "value": "3", "pinyin": "wuhan", "short": "wh" },
                { "label": "南京", "value": "4", "pinyin": "nanjing", "short": "nj" },
                { "label": "合肥", "value": "5", "pinyin": "hefei", "short": "hf" },
                { "label": "成都", "value": "6", "pinyin": "chengdu", "short": "cd" },
                { "label": "深圳", "value": "7", "pinyin": "shenzhen", "short": "sz" },
                { "label": "西安", "value": "7", "pinyin": "xian", "short": "xa" },
            ],//定位信息
            hotList: [
                { "label": "北京", "value": "11", "pinyin": "bejing", "short": "bg" },
                { "label": "上海", "value": "22", "pinyin": "shanghai", "short": "sh" },
                { "label": "武汉", "value": "33", "pinyin": "wuhan", "short": "wh" },
                { "label": "深圳", "value": "77", "pinyin": "shenzhen", "short": "sz" },
            ]//热门城市数据
        }
        //创建ref对象
        this.cityListComponent = React.createRef()
    }


   async componentDidMount() {
       await this.getCityList()
        // 调用 measureAllRows，提前计算 List 中每一行的高度，实现 scrollToRow 的精确跳转
        //需要保证这个方法在使用的时候页面是有数据的
        this.cityListComponent.current.measureAllRows()
    }
    //获取城市列表数据
    async getCityList() {
        // let { data: res } = await axios.get('http://localhost:8080/area/city?level=1')
        // console.log(res);
        let { cityList, cityIndex } = formatCityData(this.state.list)

        //把热门城市数据添加到cityList中，可以添加一个键为hot的索引，此处是后台接口，这边写的虚拟数据
        cityList["hot"] = this.state.hotList
        //添加索引号在最前面
        cityIndex.unshift("hot")
        //#添加所有的城市列表
        cityList["#"] = [cityList]
        cityIndex.unshift("#")
        this.state.cityList = cityList
        this.state.cityIndex = cityIndex
        this.setState({
            cityList,
            cityIndex
        })
        console.log(this.state.cityList, this.state.cityIndex);

    }
    changeCity({ label, value }) {
        if (HOUSE_CITY.indexOf(label) > -1) {
          // 有
          localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
        //   this.props.history.go(-1)
        } else {
          Toast.info('该城市暂无房源数据', 1, null, false)
        }
      }
    //渲染每一行的方法
    rowRenderer = ({
        key, // 唯一key
        index, // 索引号
        isScrolling, // 当前是否在滚动中{isScrolling+""},布尔值，滚动中就是true，不滚动就是false
        isVisible, // 当前的list是可见的
        style, // 重点；每一行渲染的样式，必须添加
    }) => {
        const { cityIndex, cityList } = this.state
        const letter = cityIndex[index]

        //获取指定列表上的数据

        return (
            <div key={key} style={style} className="city">
                {/* 获取每一行的字母索引 */}
                <div className="title">{formatCityIndex(letter)}</div>
                {
                    cityList[letter].map(item =>
                        <div className="name" key={item.value} onClick={this.changeCity(item)}>{item.label}</div>
                    )
                }
            </div>
        );
    }
    // 创建动态计算每一行高度的方法
    getRowHeight = ({ index }) => {
        // 索引（A、B等）的高度
        const TITLE_HEIGHT = 36
        // 每个城市名称的高度
        const NAME_HEIGHT = 50
        // 索引标题高度 + 城市数量 * 城市名称的高度
        // TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
        const { cityList, cityIndex } = this.state
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }
    //用户获取list组件渲染行的信息
    onRowsRendered = ({ startIndex }) => {
        // console.log(startIndex)
        if (this.state.activeIndex !== startIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
    }
    // 封装渲染右侧索引列表的方法
    renderCityIndex() {
        // 获取到 cityIndex，并遍历其，实现渲染
        const { cityIndex, activeIndex } = this.state

        return cityIndex.map((item, index) => (
            <li className="city-index-item" key={item} onClick={() => { console.log(this.cityListComponent.current.scrollToRow(index)) }}>
                <span className={activeIndex === index ? 'index-active' : ''}>
                    {item === 'hot' ? '热' : item.toUpperCase()}
                </span>
            </li>
        ))
    }

    render() {
        return (
            <div className="citylist">
                <NavHeader>城市列表</NavHeader>
                {/* 城市列表 */}
                <AutoSizer>
                    {
                        ({ width, height }) => (
                            <List
                                ref={this.cityListComponent}
                                width={width}
                                height={height}
                                rowCount={this.state.cityIndex.length}
                                rowHeight={this.getRowHeight}
                                rowRenderer={this.rowRenderer}
                                onRowsRendered={this.onRowsRendered}
                                scrollToAlignment="start"
                            />
                        )
                    }
                </AutoSizer>
                {/* 右侧索引列表 */}
                {/* 
          1 封装 renderCityIndex 方法，用来渲染城市索引列表。
          2 在方法中，获取到索引数组 cityIndex ，遍历 cityIndex ，渲染索引列表。
          3 将索引 hot 替换为 热。
          4 在 state 中添加状态 activeIndex ，指定当前高亮的索引。
          5 在遍历 cityIndex 时，添加当前字母索引是否高亮的判断条件。
        */}
                <ul className="city-index">{this.renderCityIndex()}</ul>
            </div>
        )
    }
}
