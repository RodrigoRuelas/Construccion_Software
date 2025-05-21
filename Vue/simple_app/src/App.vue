<template>
  <div id="app">
    <img src="./assets/logo.png">
    <MethodsComponent/>
    <HelloWorld/>
    <simpleComponent/>
    <dataComponent msg="Mensaje desde App.vue"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import simpleComponent from './components/simpleComponent'
import dataComponent from './components/dataComponent'
import MethodsComponent from './components/MethodsComponent'

export default {
  name: 'App',
  components: {
    MethodsComponent,
    HelloWorld,
    simpleComponent,
    dataComponent
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
