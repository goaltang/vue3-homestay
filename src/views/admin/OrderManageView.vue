<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { adminApi } from '@/api/admin';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { OrderInfo } from '@/types/order';

const tableData = ref<OrderInfo[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const searchForm = ref({
    orderNo: '',
    status: '',
    username: ''
});

// 获取订单列表
const fetchOrders = async () => {
    loading.value = true;
    try {
        const { data } = await adminApi.getOrders({
            page: currentPage.value - 1,
            size: pageSize.value,
            ...searchForm.value
        });
        tableData.value = data.content;
        total.value = data.totalElements;
    } catch (error) {
        ElMessage.error('获取订单列表失败');
    } finally {
        loading.value = false;
    }
};

// 处理退款
const handleRefund = async (row: OrderInfo) => {
    try {
        await ElMessageBox.confirm(
            '确定要退款吗？此操作不可恢复',
            '警告',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        );
        await adminApi.refundOrder(row.id);
        ElMessage.success('退款成功');
        fetchOrders();
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('退款失败');
        }
    }
};

// 处理搜索
const handleSearch = () => {
    currentPage.value = 1;
    fetchOrders();
};

// 处理重置
const handleReset = () => {
    searchForm.value = {
        orderNo: '',
        status: '',
        username: ''
    };
    currentPage.value = 1;
    fetchOrders();
};

// 处理页码变化
const handleCurrentChange = (page: number) => {
    currentPage.value = page;
    fetchOrders();
};

// 处理每页条数变化
const handleSizeChange = (size: number) => {
    pageSize.value = size;
    currentPage.value = 1;
    fetchOrders();
};

// 格式化订单状态
const formatStatus = (status: string) => {
    const statusMap: Record<string, { type: string; label: string }> = {
        PENDING: { type: 'warning', label: '待支付' },
        PAID: { type: 'success', label: '已支付' },
        COMPLETED: { type: 'info', label: '已完成' },
        CANCELLED: { type: 'danger', label: '已取消' },
        REFUNDED: { type: '', label: '已退款' }
    };
    return statusMap[status] || { type: '', label: status };
};

onMounted(() => {
    fetchOrders();
});
</script>

<template>
    <div class="order-manage">
        <!-- 搜索表单 -->
        <el-card class="search-card">
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="订单号">
                    <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
                </el-form-item>

                <el-form-item label="状态">
                    <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                        <el-option label="待支付" value="PENDING" />
                        <el-option label="已支付" value="PAID" />
                        <el-option label="已完成" value="COMPLETED" />
                        <el-option label="已取消" value="CANCELLED" />
                        <el-option label="已退款" value="REFUNDED" />
                    </el-select>
                </el-form-item>

                <el-form-item label="用户">
                    <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 订单列表 -->
        <el-card class="table-card">
            <el-table v-loading="loading" :data="tableData" style="width: 100%">
                <el-table-column prop="orderNo" label="订单号" width="180" />
                <el-table-column prop="house.title" label="房源" />
                <el-table-column prop="user.username" label="用户" />
                <el-table-column prop="amount" label="金额">
                    <template #default="{ row }">
                        ¥{{ row.amount }}
                    </template>
                </el-table-column>
                <el-table-column prop="checkInDate" label="入住日期" />
                <el-table-column prop="checkOutDate" label="离店日期" />
                <el-table-column prop="status" label="状态">
                    <template #default="{ row }">
                        <el-tag :type="formatStatus(row.status).type">
                            {{ formatStatus(row.status).label }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间" />
                <el-table-column label="操作" width="120">
                    <template #default="{ row }">
                        <el-button v-if="row.status === 'PAID'" type="warning" size="small" @click="handleRefund(row)">
                            退款
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
.order-manage {
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