<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { get, post } from '@/utils'

const container = ref<HTMLElement | null>(null)
const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  if ('VKIDSDK' in window) {
    const VKID = (window as any).VKIDSDK

    const response = await get('/api/pkce/').then(res => res.json())
    const { code_challenge, state } = response ? response : { code_challenge: 111, state: 111 }

    console.log(code_challenge, state)

    VKID.Config.init({
      app: 52749809,
      redirectUrl: 'http://localhost/app/',
      responseMode: VKID.ConfigResponseMode.Callback,
      source: VKID.ConfigSource.LOWCODE,
      state: state,
      codeChallenge: code_challenge,
      scope: 'vkid.personal_info email',
      codeChallengeMethod: 'S256',
    })

    const oneTap = new VKID.OneTap()

    oneTap.render({
      container: container.value,
      showAlternativeLogin: true,

    })
      .on(VKID.WidgetEvents.ERROR, vkidOnError)
      .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, handleLoginSuccess)


    // eslint-disable-next-line no-inner-declarations
    async function handleLoginSuccess(payload: { code: string, device_id: string, state: string }) {
      const { code, device_id, state } = payload
      console.log(payload)

      const response = await post('/api/auth/vk/', { code, device_id, state })

      if (response.ok) {
        userStore.login()
        await router.push({ name: 'app' })
      } else {
        alert(response.json())
      }
    }


    // eslint-disable-next-line no-inner-declarations
    function vkidOnSuccess(data: any): void {

      const requestData = {
        client_id: import.meta.env.VK_APP_ID,
        access_token: data['access_token']
      }

      const response = fetch('https://id.vk.com/oauth2/user_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(requestData).toString(),
        credentials: 'include'
      })
      console.log(response)
    }

    // eslint-disable-next-line no-inner-declarations
    function vkidOnError(error: any): void {
      console.log(error)
    }
  }
})

</script>

<template>
  <div ref="container"></div>
</template>


<style scoped>

</style>