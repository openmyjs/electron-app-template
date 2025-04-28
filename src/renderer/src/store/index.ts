import { defineStore } from 'pinia'

export const commonPinia: any = defineStore('commonCounter', {
  state: () => ({
    count: 0,
    pageUnload: true
  }),
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    }
  },
  getters: {
    doubleCount: (state) => state.count * 2
  }
})
export const PmPinia: any = defineStore('PmCounter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    }
  },
  getters: {
    doubleCount: (state) => state.count * 2
  }
})
