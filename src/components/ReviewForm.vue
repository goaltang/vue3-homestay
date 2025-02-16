<script setup lang="ts">
import { ref } from "vue";
import { reviewApi } from "@/api/review";
import type { CreateReviewForm } from "@/types/review";

const props = defineProps<{
    houseId: string;
}>();

const emit = defineEmits<{
    (e: "success"): void;
}>();

const form = ref<CreateReviewForm>({
    rating: 5,
    content: "",
    images: [],
});

const loading = ref(false);
const previewImages = ref<string[]>([]);

const handleImageUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        const files = Array.from(input.files);
        form.value.images = files;

        // 生成预览
        previewImages.value = files.map(file => URL.createObjectURL(file));
    }
};

const submitReview = async () => {
    if (!form.value.content.trim()) {
        alert("请输入评价内容");
        return;
    }

    loading.value = true;
    try {
        await reviewApi.createReview(props.houseId, form.value);
        emit("success");
        form.value = { rating: 5, content: "", images: [] };
        previewImages.value = [];
    } catch (error) {
        console.error("Failed to submit review:", error);
        alert("评价提交失败，请重试");
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="review-form">
        <h3>写评价</h3>
        <div class="rating-select">
            <span>评分：</span>
            <div class="stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ active: i <= form.rating }"
                    @click="form.rating = i">
                    ★
                </span>
            </div>
        </div>

        <textarea v-model="form.content" placeholder="分享您的住宿体验..." rows="4"></textarea>

        <div class="image-upload">
            <input type="file" multiple accept="image/*" @change="handleImageUpload" ref="fileInput">
            <div class="preview-images" v-if="previewImages.length">
                <div v-for="(url, index) in previewImages" :key="index" class="preview-item">
                    <img :src="url">
                </div>
            </div>
        </div>

        <button class="submit-btn" @click="submitReview" :disabled="loading">
            {{ loading ? '提交中...' : '提交评价' }}
        </button>
    </div>
</template>

<style scoped>
.review-form {
    margin-top: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
}

.rating-select {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.stars {
    display: flex;
    gap: 5px;
}

.star {
    cursor: pointer;
    color: #ddd;
    font-size: 1.5em;
    transition: color 0.3s;
}

.star.active {
    color: #f1c40f;
}

textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    resize: vertical;
    margin-bottom: 15px;
}

.image-upload {
    margin-bottom: 15px;
}

.preview-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 10px;
    margin-top: 10px;
}

.preview-item img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
}

.submit-btn {
    width: 100%;
    padding: 12px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.submit-btn:hover {
    background: #2980b9;
}

.submit-btn:disabled {
    background: #95a5a6;
    cursor: not-allowed;
}
</style>