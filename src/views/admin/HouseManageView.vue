<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminApi } from '@/api/admin';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { HouseInfo } from '@/types/house';

const tableData = ref<HouseInfo[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const searchForm = ref({
    title: '',
    status: '',
    hostName: ''
});

// 获取房源列表
const fetchHouses = async () => {
    loading.value = true;
    try {
        const { data } = await adminApi.getHouses({
            page: currentPage.value - 1,
            size: pageSize.value,
            ...searchForm.value
        });
        tableData.value = data.content;
        total.value = data.totalElements;
    } catch (error) {
        ElMessage.error('获取房源列表失败');
    } finally {
        loading.value = false;
    }
};

// 处理审核通过
const handleApprove = async (row: HouseInfo) => {
    try {
        await adminApi.approveHouse(row.id.toString());
        ElMessage.success('审核通过成功');
        fetchHouses();
    } catch (error) {
        ElMessage.error('操作失败');
    }
};

// 处理审核拒绝
const handleReject = async (row: HouseInfo) => {
    try {
        const reason = await ElMessageBox.prompt(
            '请输入拒绝原因',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }
        );
        if (reason) {
            await adminApi.rejectHouse(row.id.toString(), reason);
            ElMessage.success('操作成功');
            fetchHouses();
        }
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('操作失败');
        }
    }
};

// 处理删除
const handleDelete = async (row: HouseInfo) => {
    try {
        await ElMessageBox.confirm(
            '确定要删除该房源吗？',
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        );
        await adminApi.deleteHouse(row.id.toString());
        ElMessage.success('删除成功');
        fetchHouses();
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败');
        }
    }
};

// 处理搜索
const handleSearch = () => {
    currentPage.value = 1;
    fetchHouses();
};

// 处理重置
const handleReset = () => {
    searchForm.value = {
        title: '',
        status: '',
        hostName: ''
    };
    currentPage.value = 1;
    fetchHouses();
};

// 处理页码变化
const handleCurrentChange = (page: number) => {
    currentPage.value = page;
    fetchHouses();
};

// 处理每页条数变化
const handleSizeChange = (size: number) => {
    pageSize.value = size;
    currentPage.value = 1;
    fetchHouses();
};

onMounted(() => {
    fetchHouses();
});
</script>

<template>
    <div class="house-manage">
        <!-- 搜索表单 -->
        <el-card class="search-card">
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="房源标题">
                    <el-input v-model="searchForm.title" placeholder="请输入房源标题" clearable />
                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                        <el-option label="待审核" value="PENDING" />
                        <el-option label="已通过" value="APPROVED" />
                        <el-option label="已拒绝" value="REJECTED" />
                    </el-select>
                </el-form-item>

                <el-form-item label="房东">
                    <el-input v-model="searchForm.hostName" placeholder="请输入房东名称" clearable />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 房源列表 -->
        <el-card class="table-card">
            <el-table v-loading="loading" :data="tableData" style="width: 100%">
                <el-table-column prop="title" label="房源标题" />
                <el-table-column prop="price" label="价格">
                    <template #default="{ row }">
                        ¥{{ row.price }}/晚
                    </template>
                </el-table-column>
                <el-table-column label="封面图">
                    <template #default="{ row }">
                        <el-image :src="row.cover" :preview-src-list="[row.cover]" fit="cover"
                            style="width: 100px; height: 60px" />
                    </template>
                </el-table-column>
                <el-table-column prop="host.username" label="房东" />
                <el-table-column prop="status" label="状态">
                    <template #default="{ row }">
                        <el-tag
                            :type="row.status === 'APPROVED' ? 'success' : row.status === 'PENDING' ? 'warning' : 'danger'">
                            {{ row.status === 'APPROVED' ? '已通过' : row.status === 'PENDING' ? '待审核' : '已拒绝' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250">
                    <template #default="{ row }">
                        <el-button v-if="row.status === 'PENDING'" type="success" size="small"
                            @click="handleApprove(row)">
                            通过
                        </el-button>
                        <el-button v-if="row.status === 'PENDING'" type="warning" size="small"
                            @click="handleReject(row)">
                            拒绝
                        </el-button>
                        <el-button type="danger" size="small" @click="handleDelete(row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
                    :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </el-card>
    </div>
</template>

<style scoped>
.house-manage {
    padding: 20px;
}

.search-card {
    margin-bottom: 20px;
}

.table-card {
    margin-bottom: 20px;
}

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}
</style>