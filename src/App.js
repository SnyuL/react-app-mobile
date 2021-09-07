import React from 'react';
import { BrowserRouter as Router, Route,Redirect } from 'react-router-dom'
import './App.css';
// 导入首页和城市选择两个组件（页面）
import Home from "./pages/Home"
import CityList from './pages/CityList'
import Map from './pages/Map'

import Login from './pages/Login'

// 导入样式
import 'antd-mobile/dist/antd-mobile.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置默认路由组件,要引用Redirect这个方法 */}
        <Route exact path="/" render={()=><Redirect to="/home"/>}/>
        {/* 配置路由 */}
        {/* Home 组件是父路由的内容 */}
        
        <Route  path="/home" component={(props)=><Home {...props}/>} />
        <Route path="/citylist" component={(props)=><CityList {...props}/>} />
        <Route path="/map" component={Map} />
        
        <Route path="/login" component={Login} />
      </div>
    </Router>
  )
}

export default App;