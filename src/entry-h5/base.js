/*
 * @Author: your name
 * @Date: 2020-02-29 02:02:16
 * @LastEditTime: 2020-03-08 12:58:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /serverless/look/src/entry-pc/base.js
 */
import Vue from 'vue'
import './vant'
import '../utils/initChain'
import * as api from '../api'
import '../entry-pc/base'

Vue.prototype.$api = api
