<template>
    <div>用户管理页面</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminApi } from '@/api/admin';
import { ElMessage, ElMessageBox } from 'element-plus';

const tableData = ref([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const searchForm = ref({
    username: '',
    email: '',
    role: ''
});

// 获取用户列表
const fetchUsers = async () => {
    loading.value = true;
    try {
        const { data } = await adminApi.getUsers({
            page: currentPage.value - 1,
            size: pageSize.value,
            ...searchForm.value
        });
        tableData.value = data.content;
        total.value = data.totalElements;
    } catch (error) {
        ElMessage.error('获取用户列表失败');
    } finally {
        loading.value = false;
    }
};

// 处理角色变更
const handleRoleChange = async (row: any) => {
    try {
        await adminApi.updateUserRole(row.id, row.role);
        ElMessage.success('角色更新成功');
    } catch (error) {
        ElMessage.error('角色更新失败');
    }
};

// 处理删除用户
const handleDelete = async (row: any) => {
    try {
        await ElMessageBox.confirm(
            '确定要删除该用户吗？此操作不可恢复',
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        );

        await adminApi.deleteUser(row.id);
        ElMessage.success('删除成功');
        fetchUsers();
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败');
        }
    }
};

onMounted(() => {
    fetchUsers();
});
</script>