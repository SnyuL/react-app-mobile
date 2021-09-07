import React from 'react'

import PropTypes from 'prop-types'

import styles from './index.module.css'

const NoHouse = ({ children }) => (
    <div className={styles.root}>
        <img
            className={styles.img}
            src=""
            alt="暂无数据"
        />
        <p className={styles.msg}>{children}</p>
    </div>
)

NoHouse.propTypes = {
    children: PropTypes.string.isRequired
}

export default NoHouse
