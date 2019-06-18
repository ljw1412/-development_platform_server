const router = require('koa-router')()
const mongoose = require('mongoose')
const config = require('../config')

router.prefix('/api')

router.get('/list_all_menu', async ctx => {
  ctx.body = [
    {
      icon: 'el-icon-location',
      image: '',
      title: '导航一',
      index: '1',
      route: { name: 'main' },
      children: []
    },
    {
      icon: 'el-icon-location',
      image: '',
      title: '导航二',
      index: '2',
      route: { name: 'main' }
    },
    {
      icon: 'el-icon-setting',
      image: '',
      title: '设置',
      index: '3',
      route: { name: 'setting' }
    }
  ]
})

module.exports = router
