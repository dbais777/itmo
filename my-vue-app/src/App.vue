<script setup lang="ts">
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

interface Video {
  id: string;
  title: string;
  duration: number;
}

const apiUrl = import.meta.env.VITE_API_URL ?? '/api/video';
const title = ref('');
const duration = ref<number | null>(null);
const videos = ref<Video[]>([]);
const error = ref('');
const isLoading = ref(false);
const isSubmitting = ref(false);

const titleLength = computed(() => title.value.trim().length);



function getErrorMessage(requestError: unknown): string {
  if (axios.isAxiosError(requestError)) {
    const message = requestError.response?.data?.message;

    return Array.isArray(message) ? message.join(', ') : message || 'Не удалось выполнить запрос к серверу.';
  }

  return 'Произошла непредвиденная ошибка.';
}

async function loadVideos() {
  isLoading.value = true;
  error.value = '';

  try {
    const response = await axios.get<Video[]>(apiUrl);
    videos.value = response.data;
  } catch (requestError) {
    error.value = getErrorMessage(requestError);
  } finally {
    isLoading.value = false;
  }
}

async function handleSubmit() {
  error.value = '';

  if (titleLength.value < 150) {
    error.value = 'Название должно содержать не менее 150 символов.';
    return;
  }

  if (duration.value === null || duration.value < 0) {
    error.value = 'Укажите длительность в секундах.';
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await axios.post<Video>(apiUrl, {
      title: title.value.trim(),
      duration: duration.value,
    });

    videos.value.push(response.data);
    title.value = '';
    duration.value = null;
  } catch (requestError) {
    error.value = getErrorMessage(requestError);
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(loadVideos);
</script>

<template>
  <main>
    <section>
      <p>Video API</p>
      <h1>Библиотека видео (dev)</h1>
       </section>

    <section aria-labelledby="create-video-title">
      <div>
        <h2 id="create-video-title">Добавить видео</h2>
        <span>POST /video</span>
      </div>

      <form @submit.prevent="handleSubmit">
        <label>
          Название
          <textarea
            v-model="title"
            rows="5"
            placeholder="Опишите видео — не менее 150 символов"
            aria-describedby="title-hint"
          />
        </label>
        <p id="title-hint">
          {{ titleLength }} / 150 символов
        </p>

        <label>
          Длительность, секунд
          <input v-model.number="duration" type="number" min="0" step="1" placeholder="Например, 7200" />
        </label>

        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Создаём…' : 'Создать видео' }}
        </button>
      </form>
    </section>

    <section aria-labelledby="video-list-title">
      <div>
        <div>
          <h2 id="video-list-title">Видео</h2>
          <p>{{ videos.length }} {{ videos.length === 1 ? 'запись' : 'записей' }}</p>
        </div>
        <button type="button" :disabled="isLoading" @click="loadVideos">
          {{ isLoading ? 'Обновляем…' : 'Обновить' }}
        </button>
      </div>

      <p v-if="error" role="alert">{{ error }}</p>
      <p v-else-if="isLoading">Загружаем список…</p>
      <p v-else-if="videos.length === 0">Список пока пуст. Добавьте первое видео выше.</p>

      <ul v-else>
        <li v-for="video in videos" :key="video.id">
          <div>
            <h3>{{ video.title }}</h3>
            <code>{{ video.id }}</code>
          </div>
           </li>
      </ul>
    </section>
  </main>
</template>
