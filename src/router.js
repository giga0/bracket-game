import Vue from 'vue'
import Router from 'vue-router'

import HomeRoute from '@/home/route'
import GameRoute from '@/game/route'

Vue.use(Router)

const routesList = [].concat(
  HomeRoute,
  GameRoute
)

const router = new Router({
  mode: 'history',
  routes: routesList
})

export default router
