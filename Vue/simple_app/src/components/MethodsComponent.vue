<template>
<div class='test'>
    Object user: {{ user }} <br>
    Attribute: {{ user.firstName }} <br>

    <!-- este botton llama a un metodo -->
    <button type='button' v-on:click="saludar(user.firstName)"> Call a method</button><br>

    <!-- podemos hacer un bind de elementos html con variables -->
    Binded to user.firstName:
    <input type='text' v-model='user.firstName'> <br>

    <!-- invocamos a un metodo en cada keyup -->
    Keyup event:
    <input type='text' v-on:keyup='typing'><br>

    <!-- invocamos a un metodo en keyup ENTER-->
    Keyup ENTER event:
    <input type='text' v-on:keyup.enter='typingEnter'><br>    
</div>
</template>

<script>
export default{    
    data(){ 
        return {            
            user: {firstName: 'Vicente', lastName: 'Machaca'}
        }
    },    
    methods:{ 
        saludar(text){ console.log(text); },
        typing(e){
            console.log(e.target.value); 
            if (e.target.value == 'quit'){ 
                console.log('exit...');
            }           
        },
        typingEnter(e){ console.log('ENTER'); }
    }
}
</script>

<style>
    .test{background-color: #eeeeee;}
</style>
