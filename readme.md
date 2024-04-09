### fork 自 [eslint-plugin-sort-keys-plus](https://github.com/forivall/eslint-plugin-sort-keys-plus)

### 特点
- 自动修复排序问题
- 自定义“指定对象”的“指定层级”的“指定排序”，灵活性高
- 完善的中文备注，方便二次开发
- 适合 eslint 插件开发入门

### 修改点
保留[官方基础配置](https://zh-hans.eslint.org/docs/latest/rules/sort-keys)
```
{
  "sort-keys-custom/sort-keys": [ "error", "asc", {
    "caseSensitive": true,
    "minKeys": 2,
    "natural": false,
    "allowLineSeparatedGroups": false,
  }]
}
```

保留[eslint-plugin-sort-keys-plus](https://github.com/forivall/eslint-plugin-sort-keys-plus)中 ignoreSingleLine、allCaps、shorthand 的配置
```
{
  "sort-keys-custom/sort-keys": [ "error", "asc", {
    "ignoreSingleLine": false,
    "allCaps": "ignore",
    "shorthand": "ignore",
  }]
}
```

去除[eslint-plugin-sort-keys-plus](https://github.com/forivall/eslint-plugin-sort-keys-plus)中 overrides 配置

新增`customTarget`配置项
```
{
  "sort-keys-custom/sort-keys": [ "error", "asc", {
    "customTarget": [{
      "targetKeys": ["renderComponent"], // 指定 key 为 renderComponent 的对象下面的属性才排序
      "subLevels": [2], // 指定 key 为 renderComponent 的对象的第几层对象才排序
      "fieldsOrder": [ // 自定义字段的顺序
        "label",
        "isActive",
        "required",
      ],
    }],
  }]
}
```

- 譬如以下动态表单配置示例
```
{
  desc: '配置描述',
  version: '1.0',
  groups: [
    {
      isActive: true,
      isMultiTab: false,
      renderComponent: {
        channel: {
          componentName: 'BaseRadio',
          defaultValue: {
            name: '',
          },
          slotName: 'default',
          isActive: true,
          visibleOption: {
            condition: '!!template.label',
          },
        },
        account: {
          componentName: 'BaseRadio',
          defaultValue: [],
          disabledOption: {
            condition: '$$.base.campaign_list.length !== 0',
          },
          options: {
            channel: 'channel',
          },
          isActive: true,
          required: true,
          slotName: 'default',
        },
        objective: {
          componentName: 'BaseRadio',
          isActive: true,
          options: {
            kind: 'button',
            disabled: true,
            list: [
              {
                label: 'label',
                value: 'PROMOTION',
              },
            ],
          },
          slotName: 'default',
        },
      },
    },
  ],
}
```
- channel、account、objective 是表单的字段名，由表单顺序决定，无需排序
- channel、account、objective 里面包裹的字段才是真正的配置项，希望对该配置项进行排序
- 这时就可以利用自定义规则配置
  - "targetKeys": ["renderComponent"], // 以 renderComponent 为基准
  - "subLevels": [2], // renderComponent 对象下的第二层对象才排序，channel、account、objective 不排序，里面的配置项才排序
```
{
  "sort-keys-custom/sort-keys": [ "error", "asc", {
    "customTarget": [{
      "targetKeys": ["renderComponent"], // 指定 key 为 renderComponent 的对象下面的属性才排序
      "subLevels": [2], // 指定 key 为 renderComponent 的对象的第几层对象才排序，
      "fieldsOrder": [ // 自定义字段的顺序
        "label",
        "isActive",
        "required",
      ],
    }],
  }]
}
```

### 使用说明
安装依赖：`npm install eslint-plugin-sort-keys-custom --save-dev`

添加插件：.eslintrc.js 中添加本插件
```
{
  "plugins": [
    "sort-keys-custom"
  ]
}
```

使用规则：.eslintrc.js 中使用本规则
```
overrides: [{
  files: [
    'xxx/**/*.ts',
  ],
  rules: {
    'sort-keys-custom/sort-keys': ['warn', 'asc', {
      customTarget: [{
        targetKeys: ['renderComponent'],
        subLevels: [2],
        fieldsOrder: [
          'label',
          'isActive',
          'required',
        ],
      }],
    }],
  },
}]
```


### 本地调试（pnpm 版本）
- 在本项目执行：pnpm link --global
- 在使用本规则的项目运行：pnpm link --global eslint-plugin-sort-keys-custom
​- 正常使用本规则


