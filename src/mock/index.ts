import Mock from "mockjs";

// 模拟后端接口延迟
Mock.setup({
  timeout: "300-600",
});

// 房源数据库
const houses = [
  {
    id: "1",
    title: "温馨海景双床房",
    address: "三亚市海棠湾",
    price: 458,
    imageUrl: "https://picsum.photos/800/600?random=1",
    rating: 4.8,
    tags: ["海景", "双床", "度假"],
    description:
      "180°一线海景房，距离海滩仅需3分钟步行。房间配备高品质床上用品，24小时热水，提供免费WiFi。",
    facilities: ["免费WiFi", "24小时热水", "空调", "电视", "冰箱", "洗衣机"],
    owner: {
      name: "张先生",
      phone: "13800138000",
      avatar: "https://picsum.photos/100/100?random=1",
    },
  },
  {
    id: "2",
    title: "现代简约大床房",
    address: "北京市朝阳区",
    price: 328,
    imageUrl: "https://picsum.photos/800/600?random=2",
    rating: 4.6,
    tags: ["大床", "商圈", "地铁"],
    description: "紧邻三里屯商圈，交通便利。房间装修简约现代，配备智能家电。",
    facilities: ["智能门锁", "地暖", "空调", "投影仪", "咖啡机"],
    owner: {
      name: "李女士",
      phone: "13900139000",
      avatar: "https://picsum.photos/100/100?random=2",
    },
  },
  {
    id: "3",
    title: "古色古香四合院",
    address: "北京市东城区",
    price: 688,
    imageUrl: "https://picsum.photos/800/600?random=3",
    rating: 4.9,
    tags: ["四合院", "文化", "胡同"],
    description:
      "百年老宅修缮，保留传统建筑特色，融入现代化设施，体验老北京生活。",
    facilities: ["庭院", "茶室", "空调", "暖气", "专属管家"],
    owner: {
      name: "王先生",
      phone: "13700137000",
      avatar: "https://picsum.photos/100/100?random=3",
    },
  },
];

// 生成房源列表数据（无参数）
Mock.mock(/^\/api\/houses$/, "get", () => {
  console.log("Mock: Returning all houses");
  return {
    list: houses.map(
      ({ id, title, address, price, imageUrl, rating, tags, description }) => ({
        id,
        title,
        address,
        price,
        imageUrl,
        rating,
        tags,
        description,
      })
    ),
  };
});

// 搜索房源数据（有参数）
Mock.mock(/^\/api\/houses\?.*$/, "get", (options) => {
  console.log("Mock: Processing search request", options.url);

  // 解析查询参数
  const url = new URL(options.url, window.location.origin);
  const params = {
    keyword: url.searchParams.get("keyword")?.toLowerCase(),
    minPrice: url.searchParams.get("minPrice"),
    maxPrice: url.searchParams.get("maxPrice"),
    city: url.searchParams.get("city"),
    tags: url.searchParams.get("tags")?.split(",").filter(Boolean),
    minRating: url.searchParams.get("minRating"),
    sortBy: url.searchParams.get("sortBy"),
    sortOrder: url.searchParams.get("sortOrder"),
  };

  console.log("Mock: Parsed params:", params);

  // 过滤房源
  let filteredHouses = [...houses];

  // 关键词搜索
  if (params.keyword) {
    filteredHouses = filteredHouses.filter(
      (house) =>
        house.title.toLowerCase().includes(params.keyword!) ||
        house.address.toLowerCase().includes(params.keyword!) ||
        house.description.toLowerCase().includes(params.keyword!) ||
        house.tags.some((tag) => tag.toLowerCase().includes(params.keyword!))
    );
  }

  // 价格范围
  if (!isNaN(params.minPrice) && params.minPrice > 0) {
    filteredHouses = filteredHouses.filter(
      (house) => house.price >= params.minPrice
    );
  }
  if (!isNaN(params.maxPrice) && params.maxPrice > 0) {
    filteredHouses = filteredHouses.filter(
      (house) => house.price <= params.maxPrice
    );
  }

  // 城市筛选
  if (params.city && params.city !== "全部城市") {
    filteredHouses = filteredHouses.filter((house) =>
      house.address.includes(params.city!)
    );
  }

  // 标签筛选
  if (params.tags && params.tags.length > 0) {
    filteredHouses = filteredHouses.filter((house) =>
      params.tags!.some((tag) => house.tags.includes(tag))
    );
  }

  // 评分筛选
  if (!isNaN(params.minRating) && params.minRating > 0) {
    filteredHouses = filteredHouses.filter(
      (house) => house.rating >= params.minRating
    );
  }

  // 排序
  if (params.sortBy && params.sortBy !== "default") {
    const [sort, order] = params.sortBy.includes("_")
      ? params.sortBy.split("_")
      : [params.sortBy, params.sortOrder || "desc"];

    filteredHouses.sort((a, b) => {
      const multiplier = order === "asc" ? 1 : -1;
      switch (sort) {
        case "price":
          return (a.price - b.price) * multiplier;
        case "rating":
          return (a.rating - b.rating) * multiplier;
        default:
          return 0;
      }
    });
  }

  console.log("Mock: Filtered houses count:", filteredHouses.length);

  return {
    list: filteredHouses.map(
      ({ id, title, address, price, imageUrl, rating, tags, description }) => ({
        id,
        title,
        address,
        price,
        imageUrl,
        rating,
        tags,
        description,
      })
    ),
  };
});

// 生成房源详情数据
Mock.mock(/^\/api\/houses\/\d+$/, "get", (options) => {
  const id = options.url.split("/").pop();
  const house = houses.find((h) => h.id === id);

  if (!house) {
    return {
      status: 404,
      message: "房源不存在",
    };
  }

  return house;
});

// 登录接口
Mock.mock("/api/auth/login", "post", (options: any) => {
  const { email, password } = JSON.parse(options.body);

  // 管理员账号
  if (email === "admin@example.com" && password === "123456") {
    return {
      code: 200,
      data: {
        token: "admin-token",
        user: {
          id: "1",
          username: "管理员",
          email: "admin@example.com",
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          role: "ADMIN",
        },
      },
    };
  }

  // 普通用户
  return {
    code: 200,
    data: {
      token: "user-token",
      user: {
        id: "2",
        username: "测试用户",
        email: email,
        avatar:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        role: "USER",
      },
    },
  };
});

// 获取当前用户信息
Mock.mock("/api/auth/me", "get", (options: any) => {
  const token = options.headers?.Authorization;

  if (token === "Bearer admin-token") {
    return {
      code: 200,
      data: {
        id: "1",
        username: "管理员",
        email: "admin@example.com",
        avatar:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        role: "ADMIN",
      },
    };
  }

  return {
    code: 200,
    data: {
      id: "2",
      username: "测试用户",
      email: "user@example.com",
      avatar:
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      role: "USER",
    },
  };
});

// 登出接口
Mock.mock("/api/auth/logout", "post", {
  code: 200,
  message: "退出成功",
});

// 修改评价相关的 Mock 数据
Mock.mock(new RegExp("/api/houses/\\d+/reviews"), "get", () => {
  return {
    list: [
      {
        id: "1",
        userId: "user1",
        houseId: "1",
        rating: 5,
        content: "房间非常干净整洁，位置也很方便，房东特别热情！",
        createdAt: "2024-03-15T08:00:00.000Z",
        user: {
          username: "张三",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
        },
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
        ],
      },
      {
        id: "2",
        userId: "user2",
        houseId: "1",
        rating: 4,
        content: "整体不错，就是价格稍贵。",
        createdAt: "2024-03-14T10:30:00.000Z",
        user: {
          username: "李四",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
        },
      },
    ],
  };
});

// 添加创建评价的 Mock
Mock.mock(new RegExp("/api/houses/\\d+/reviews"), "post", (options) => {
  const body = JSON.parse(options.body);
  return {
    id: Date.now().toString(),
    userId: "current_user",
    houseId: options.url.split("/")[2],
    rating: body.get("rating"),
    content: body.get("content"),
    createdAt: new Date().toISOString(),
    user: {
      username: "当前用户",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=current",
    },
  };
});

// 获取用户订单列表
Mock.mock("/api/orders", "get", {
  list: [
    {
      id: "1",
      houseId: "1",
      userId: "user1",
      checkIn: "2024-03-20",
      checkOut: "2024-03-22",
      guests: 2,
      totalPrice: 916,
      status: "confirmed",
      createdAt: "2024-03-15T08:00:00.000Z",
      house: {
        title: "温馨海景双床房",
        imageUrl:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
        address: "三亚市海棠湾",
      },
    },
    {
      id: "2",
      houseId: "2",
      userId: "user1",
      checkIn: "2024-04-01",
      checkOut: "2024-04-03",
      guests: 1,
      totalPrice: 656,
      status: "pending",
      createdAt: "2024-03-16T10:30:00.000Z",
      house: {
        title: "现代简约大床房",
        imageUrl:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
        address: "北京市朝阳区",
      },
    },
  ],
});

// 创建订单
Mock.mock("/api/orders", "post", (options) => {
  const body = JSON.parse(options.body);
  return {
    id: Date.now().toString(),
    ...body,
    status: "pending",
    createdAt: new Date().toISOString(),
    totalPrice: 458 * 2, // 示例价格计算
  };
});

// 取消订单
Mock.mock(/\/api\/orders\/\d+\/cancel/, "post", {
  success: true,
});
