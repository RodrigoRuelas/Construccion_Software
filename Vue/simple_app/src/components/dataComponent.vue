<template>
<div class='test'>
    <h2>Component Data</h2> 
    Var title: {{ title }} <br>
    Object user: {{ user }} <br>
    Attribute: {{ user.firstName }} <br>
    Composed var: {{ fullName }} <br>
    Message from father: {{ msg }} <br>
    
    <!-- para poder un html -->
    <div v-html='myHtml'></div>
    
    <!-- para mostrar el contenido solo si una variable es true -->
    <div v-if='showName'> 
        <p>showName == true</p>
    </div>
    <div v-else='showName'> 
        <p>showName == false</p>
    </div>

    <!-- para mostrar un array -->
    <ul><li v-for='task in tasks'> {{ task.title }} </li></ul>      
</div>
</template>

<script>
export default{    
    data(){
        return {
            title: 'Hello Vue.js',
            user: {
                firstName: 'Vicente',
                lastName: 'Machaca'
            },
            myHtml: '<font color="red"> red </font>',
            showName: true,
            tasks: [
                {title: 'eat'},
                {title: 'study'}
            ]
        }
    },
    computed:{ 
        fullName(){
            return this.user.firstName + ' ' + this.user.lastName;
        }
    },  
    props:{ // se utiliza para recibir datos
        msg: {
            type: String,
            default: 'default'
        }
    }
}
</script>

<style media="screen">
    .test{background-color: #eeeeee;}
</style>
