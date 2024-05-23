<script setup lang="ts">
import AboutSiteCart from '@/components/AboutSiteCard.vue'
import CapabilitiesCard from '@/components/CapabilitiesCard.vue'
</script>

<template>
  <v-img class="main-img" src="/luthfi-alfarizi-8i_KGxVeLtQ-unsplash.jpg" cover>
    <div class="main-img-overlay">
      <h1 class="main-text main-header">Дневник Тренера</h1>
      <p class="main-text describe">Универсальное приложение для тренеров спортивных секций и учителей физической
        культуры</p>
    </div>
  </v-img>
  <section class="anchor-scroll" id="AboutSite">
    <h2 class="header">Почему "CoachDiary"?</h2>

    <AboutSiteCart src="/картинка.jpg">Добро пожаловать в “Coachdiary” – ваш надежный
      помощник
      в управлении и контроле успеваемости учеников спортивных секций! Он создан специально для тренеров и учителей
      физкультуры. “CoachDiary” - уникальный сервис для эффективного отслеживания и анализа прогресса каждого ученика.
    </AboutSiteCart>
    <AboutSiteCart src="/jesse-orrico-mse1vdzZXjA-unsplash.jpg" mirrored>В мире, где спорт играет ключевую роль в
      физическом и
      психологическом развитии молодежи, важность четкого и организованного подхода к тренировочному процессу не может
      быть переоценена. “Coachdiary” призван стать инструментом в руках тренеров, предлагая комплексное решение для
      управления успеваемостью и прогрессом учеников спортивных секций.
    </AboutSiteCart>
    <AboutSiteCart src="/картинка2.jpg">Разработанный с учетом реальных потребностей и задач
      спортивного сообщества, “Coachdiary” объединяет в себе функциональность и удобство, делая процесс управления
      спортивным обучением более эффективным и результативным. С его помощью вы сможете не только следить за
      индивидуальным прогрессом каждого ученика, но и визуализировать успеваемость группы в целом, что позволит более
      целенаправленно подходить к планированию тренировок и обучения.
    </AboutSiteCart>
    <p class="text">Присоединяйтесь к “Coachdiary” сегодня и начните новую эру в управлении спортивным
      обучением!</p>
    <div class="text">
      <v-btn class="join-btn" variant="flat" rounded size="x-large" :to="{name: 'login'}">Зарегистрироваться</v-btn>
    </div>
  </section>
  <section class="anchor-scroll" id="Capabilities">
    <h2 class="header">Возможности сервиса</h2>
    <div class="cap-container">
      <CapabilitiesCard icon="mdi-arrow-up-thin-circle-outline" title="Вход и создание аккаунта">Пользователи могут
        создать собственный аккаунт на “Coachdiary”. Это обеспечит безопасность данных, и позволит каждому тренеру
        персонализировать свой опыт использования платформы.
      </CapabilitiesCard>
      <CapabilitiesCard icon="mdi-filter-cog-outline" title="Фильтрация для эффективного поиска в базе учеников">Наш
        инструмент позволит тренерам быстро находить нужную информацию о учениках, фильтруя данные по дисциплинам,
        классам или результатам.
        Такая функция облегчит планирование тренировок и отслеживание прогресса учеников!
      </CapabilitiesCard>
      <CapabilitiesCard icon="mdi-database-outline" title="Управление базой нормативов">Пользователь может создавать
        таблицы нормативов, представленные спортивными федерациями или собственными тренировочными программами.
        Нормативы возможно просматривать и обновлять в любое время!
      </CapabilitiesCard>
      <CapabilitiesCard icon="mdi-information-slab-circle-outline" title="Работа с информацией об учениках">Функционал
        “CouchDiary” позволит удобно управлять информацией об учениках, включая их личные данные, спортивный класс,
        достигнутые результаты и прогресс по нормативам.
      </CapabilitiesCard>
    </div>
    <p class="text">Каждая из возможностей разработана с учетом потребностей тренеров и спортивных секций, поэтому
      они
      максимально
      облегчают управление тренировочным процессом и отслеживанием успеваемости учеников.<br><br>

      “Coachdiary” стремится предоставить инструменты для создания оптимальной тренировочной среды, способствующей
      развитию и достижению лучших результатов.</p>
  </section>

  <section class="anchor-scroll" id="AboutUs">
    <h2 class="header">О нас</h2>
    <p class="text" style="text-align: left">Мы — группа студентов, увлеченных идеей создания эффективных решений для
      тренеров и учителей физкультуры. Веря в силу спорта как средства для развития и самосовершенствования, мы решили
      применить наши знания и навыки в программировании для создания Coachdiary.
      <br>
      <br>
      В процессе разработки Coachdiary, мы не только применили наши академические знания, но и учились на реальных
      задачах и вызовах. Каждый из нас внес уникальный вклад в проект, сочетая в себе разнообразные навыки и интересы
      — от веб-дизайна до программирования и анализа данных. Работая над Coachdiary, мы стремились создать инструмент,
      который был бы не только функциональным и удобным в использовании, но и вдохновлял пользователей на постоянное
      улучшение и достижение целей.
      <br>
      <br>
      Наша миссия превышает рамки создания просто еще одного веб-сервиса. Мы хотим вдохновить спортивное сообщество на
      использование цифровых технологий как средства для улучшения тренировочного процесса, повышения мотивации и, в
      конечном итоге, достижения лучших результатов. Мы верим, что Coachdiary может стать мостом между традиционными
      методами тренировок и современными технологическими решениями, делая спорт более доступным и эффективным для
      всех.</p>
  </section>

  <v-footer class="bg-grey-lighten-1 pt-7 text-center d-block">
    2024 — <strong>CoachDiary</strong>
  </v-footer>

</template>

<style scoped>
.anchor-scroll {
  scroll-margin-top: 64px;
}

.main-img {
  height: calc(100dvh - 64px);
}

.main-img-overlay {
  backdrop-filter: brightness(110%);
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: "Roboto Condensed", sans-serif;
}

.main-text {
  --border-size: 3px;
  color: white;
  text-shadow: calc(-1 * var(--border-size)) calc(-1 * var(--border-size)) 0 rgb(var(--v-theme-primary)),
  var(--border-size) calc(-1 * var(--border-size)) 0 rgb(var(--v-theme-primary)),
  calc(-1 * var(--border-size)) var(--border-size) 0 rgb(var(--v-theme-primary)),
  var(--border-size) var(--border-size) 0 rgb(var(--v-theme-primary));
  font-weight: bold;
}

.main-header {
  font-size: 70px;
  text-transform: uppercase;
}

.describe {
  --border-size: 2px;
  font-size: 28px;
  width: 700px;
  max-width: 100%;
}

section {
  padding-top: 60px;
  margin: 0 50px 80px;
  font-size: 22px;
}

.header {
  text-align: center;
  font-size: 40px;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 40px;
}

.text {
  text-align: center;
  padding: 0 10px;
  margin: 30px auto 0;
  max-width: 1200px;
}

.join-btn {
  font-size: 22px;
}

.cap-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 800px) {
  .main-header {
    font-size: 60px;
  }

  .describe {
    font-size: 20px;
  }

  .cap-container {
    grid-template-columns: 1fr;
  }

  .header {
    font-size: 30px;
  }

  section {
    padding-top: 30px;
    margin: 0 10px 30px;
  }

  .text {
    font-size: 16px;
  }

  .join-btn {
    font-size: 16px;
  }
}
</style>