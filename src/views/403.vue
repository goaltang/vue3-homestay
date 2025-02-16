<template>
  <div class="forbidden">
    <h1>403</h1>
    <p>抱歉，您没有权限访问该页面</p>
    <el-button type="primary" @click="$router.push('/')">
      返回首页
    </el-button>
  </div>
</template>

<style scoped>
.forbidden {
  text-align: center;
  padding: 100px 0;
}

h1 {
  font-size: 72px;
  color: #409EFF;
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  color: #606266;
  margin-bottom: 30px;
}
</style> 