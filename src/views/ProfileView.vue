<script setup lang="ts">

import AppBar from '@/components/AppBar.vue'
import { ref, computed } from 'vue'

const IsClicked = ref(false)
var startedName = 'Петров Петр Петрович'
var startedEmail = 'petr@gmail.com'
async function getData(){
    fetch('')
    .then(response=> response.json())
    .then(data=>{
        startedName = data.name
        startedEmail = data.email
    })
    .catch(()=>{
        alert('Ошибка доступа к данным')
    })
}
const name = ref(startedName)
const email = ref(startedEmail)
async function postData(){
    try {
        const requestData = { email: email.value, name: name.value }
        const response = await fetch('', {
        method: 'post',
        body: JSON.stringify(requestData),
        headers: {
            'content-type': 'application/json'
        }
        })
        if (response.ok) {
            location.reload()
        }else{
            alert('Server error')
        }
    }catch {
        alert('Произошла ошибка во время входа, попробуйте еще раз')
    }
}

async function postPassword(){
    try {
        const requestData = { email: email.value, password: password.value }
        const response = await fetch('', {
            method: 'post',
            body: JSON.stringify(requestData),
            headers: {
                'content-type': 'application/json'
            }
        })
        if (response.ok) {
            location.reload()
        } else if (response.status === 401) {
            alert('Неправильный пароль, попробуйте еще раз')
        } else {
            throw new Error('Server error')
        }
    } catch {
        alert('Произошла ошибка во время входа, попробуйте еще раз')
    } 
}
const isSendButtonDisabled = computed(() => {
  return (name.value?.trim()=== startedName &&  email.value?.trim()===startedEmail)
})
const password = ref('')
const newPassword= ref('')
const passwordConfirmation = ref('')
const isSetPasswordButtonDisabled = computed(() => {
  return !(password.value?.trim().length && newPassword.value?.trim().length && newPassword.value?.trim() === passwordConfirmation.value?.trim())
})
/*getData()*/
</script>

<template>
<AppBar mobile-title="Профиль"/>

<div class="page">
    <div class="container rounded-lg">
        <div>
            <p class="text">{{startedName}}</p>
            <p class="text">Почта: <span class="non-bold-text">{{startedEmail}}</span></p>
        </div>
        <div>
            <v-text-field 
                clearable 
                label = "Полное имя"
                v-model="name">
            </v-text-field>
            <v-text-field 
                clearable 
                label = "Почта" 
                type="email"
                v-model="email">
            </v-text-field>
            <div class="buttons">
                <v-btn 
                    variant="text"
                    rounded
                    text="Изменить пароль"
                    @click="IsClicked = !IsClicked" >
                </v-btn>
                <v-btn 
                    rounded 
                    text="Сохранить"
                    :disabled="isSendButtonDisabled"
                    @click="postData">
                </v-btn>
            </div>
        </div>
    </div>
    <div v-show="IsClicked" class="container rounded-lg">
        <div class="text">Смена пароля</div>
        <div>
            <v-text-field 
                clearable 
                type="password"
                label = "Старый пароль"
                v-model="password">
            </v-text-field>
            <v-text-field 
                clearable 
                label = "Новый пароль" 
                type="password"
                v-model="newPassword">
            </v-text-field>
            <v-text-field 
                clearable 
                label = "Подтверждение пароля" 
                type="password"
                v-model="passwordConfirmation">
            </v-text-field>
            <v-btn 
                rounded
                text="Установить"
                :disabled="isSetPasswordButtonDisabled"
                class="set-button"
                @click="postPassword">
            </v-btn>
        </div>
    </div>
</div>

</template>

<style scoped>
    .page{
        margin-top: 80px;
        display: grid;
        place-items: start center;
        gap: 10px;
    }
    .container{
        width: 100%;
        max-width: 800px;
        background: rgb(var(--v-theme-surface));
        padding: 50px 80px;
        text-align: start;
        display: grid;
        gap : 30px;
    }
    .text{
        font-size: 24px;
        color: black;
        text-transform: uppercase;
        font-weight:600
    }
    .non-bold-text{
        font-weight:400
    }
    .buttons{
        display: flex;
        justify-content: space-between;
    }
    .set-button{
        float:right
    }
    @media (max-width: 800px) {
        .container {
            background: transparent;
            padding: 20px;
        }
    }   
</style>