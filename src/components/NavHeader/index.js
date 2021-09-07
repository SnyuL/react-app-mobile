import { React } from 'react';
import { useHistory } from "react-router-dom";
import { NavBar } from 'antd-mobile'
import PropTypes from 'prop-types'
// 导入 withRouter 高阶组件
import { withRouter } from 'react-router-dom'

import styles from './index.module.css'
/* 
  注意：默认情况下，只有路由 Route 直接渲染的组件才能够获取到路由信息（比如：history.go()等）
  如果需要在其他组件中获取到路由信息可以通过 withRouter 高阶组件来获取。

  1 从 react-router-dom 中导入 withRouter 高阶组件
  2 使用 withRouter 高阶组件包装 NavHeader 组件
    目的：包装后，就可以在组件中获取到当前路由信息了
  3 从 props 中解构出 history 对象
  4 调用 history.go() 实现返回上一页功能
  5 从 props 中解构出 onLeftClick 函数，实现自定义 < 按钮的点击事件
*/

function NavHeader(props) {
    const history = useHistory()
    const leftBtn = () => {
        history.go(-1)
    }
    return (
        <NavBar
            className={styles.navbar}
            // 模式 默认值是 dark
            mode="light"
            // 左侧小图片
            icon={<i className='iconfont icon-back' />}
            // 左侧按钮的点击事件
            onLeftClick={props.onLeftClick || leftBtn}
        // 标题内容
        >{props.children}</NavBar>
    )
}
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func
}

export default withRouter(NavHeader);