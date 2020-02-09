import Vue from 'vue'
import Router from 'vue-router'

import HomeRoute from '@/home/route'
import GameRoute from '@/game/route'
import ResultRoute from '@/result/route'

Vue.use(Router)

const routesList = [].concat(
  HomeRoute,
  GameRoute,
  ResultRoute
)

const router = new Router({
  mode: 'history',
  routes: routesList
})

export default router
