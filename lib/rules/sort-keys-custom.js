'use strict'

const astUtils = require('./utils/ast-utils');
const naturalCompare = require('natural-compare');

// 获取 AST 节点的所以属性名，类似 Object.keys() 方法
function getPropertyName(node) {
  const staticName = astUtils.getStaticPropertyName(node)
  if (staticName !== null) {
    return staticName
  }
  const key = node.key
  return (key && key.name) || null
}

function hasBlankLineBetweenNodes(context, node, prevNode) {
  const sourceCode = context.getSourceCode()
  const tokens = prevNode && sourceCode.getTokensBetween(prevNode, node, { includeComments: true })

  if (!tokens) {
    return false
  }
  let previousToken

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (previousToken && token.loc.start.line - previousToken.loc.end.line > 1) {
      return true
    }
    previousToken = token
  }

  if (node.loc.start.line - tokens[tokens.length - 1].loc.end.line > 1) {
    return true
  }

  if (tokens[0].loc.start.line - prevNode.loc.end.line > 1) {
    return true
  }
  return false
}

function isValidAllCapsTest(a, b) {
  const aIsAllCaps = a === a.toUpperCase()
  const bIsAllCaps = b === b.toUpperCase()

  return aIsAllCaps === bIsAllCaps ? null : aIsAllCaps && !bIsAllCaps
}

function isValidShorthandTest(a, b) {
  return !a.shorthand === !b.shorthand ? null : Boolean(a.shorthand && !b.shorthand)
}

// 倒序函数
const reverseOrder = isValidOrder => (a, b) => isValidOrder(b, a) // eslint-disable-line func-style

// 返回 Null
const returnNull = () => null // eslint-disable-line func-style

// 根据配置项，first，last 枚举值，获取具体校验器
function firstLastTest(option, isValidOrder) {
  switch (option) {
    case 'first':
      return isValidOrder
    case 'last':
      return reverseOrder(isValidOrder)
    default:
      return returnNull
  }
}

// 排序校验器
const isValidOrders = {
  // 区分大小写的字符对比
  asc(a, b) {
    return a <= b
  },
  // 忽略大小写的字符对比
  ascI(a, b) {
    return a.toLowerCase() <= b.toLowerCase()
  },
  // 数值对比
  ascN(a, b) {
    return naturalCompare(a, b) <= 0
  },
  // 数值转化为字符后，基于字符编码的对比
  ascIN(a, b) {
    return naturalCompare(a.toLowerCase(), b.toLowerCase()) <= 0
  },
}

// 生成对应降序函数
Object.keys(isValidOrders).forEach(asc => {
  const desc = `desc${asc.slice(3)}`
  isValidOrders[desc] = Object.defineProperty(reverseOrder(isValidOrders[asc]), 'name', { value: desc })
}) 

// 自定义排序的比较函数
function validCustomOrderComparator(order) {
  return (a, b) => {
    const aIndex = order.indexOf(a)
    const bIndex = order.indexOf(b)

    if (aIndex >= 0) {
      if (bIndex >= 0) {
        return aIndex <= bIndex
      }
      return true
    }
    return bIndex < 0 && null
  }
}

// 自动修复函数，本质是使用 AST 方法，对源代码进行位移操作
function createFixer(context, node, prevNode) {
  return function fix(fixer) {
    // 修复后的源代码数组
    const fixes = []

    // 获取源代码
    const sourceCode = context.getSourceCode()
    
    // 移动属性
    function moveProperty(fromNode, toNode) {
      const prevText = sourceCode.getText(fromNode)
      
      // 获取当前节点之前的注释
      const thisComments = sourceCode.getCommentsBefore(fromNode)

      // 移动注释
      for (const thisComment of thisComments) {
        fixes.push(fixer.insertTextBefore(toNode, `${sourceCode.getText(thisComment)}\n`))
        fixes.push(fixer.remove(thisComment))
      }
      fixes.push(fixer.replaceText(toNode, prevText))
    }

    // 交换属性
    moveProperty(node, prevNode)
    moveProperty(prevNode, node)
    return fixes
  }
}

// 组装错误提示语
function createReport(context, node, prevNode, fixable, messageId, data) {
  const reportMessage = data.overrideMessage
    ? { message: `${data.overrideMessage} '{{thisName}}' should be before '{{prevName}}'.` }
    : { messageId }
  const report = {
    node,
    loc: node.key.loc,
    ...reportMessage,
    data,
  }

  // 可修复的，则给出自动修复函数，供 eslint 调用
  if (fixable) {
    report.fix = createFixer(context, node, prevNode)
  }
  context.report(report)
}

// 入口，提供给 eslint 处理器的入口
module.exports = {
  // 定义元信息
  meta: {
    // 意味着该规则确定了一些可以用更好的方式完成的事情，但如果不改变代码，就不会发生错误。
    type: 'suggestion',
    // 表示规则可以通过修改代码结构进行修复，whitespace:只可以通过修改空格缩进等样式问题进行修复
    fixable: 'code',
    // 文档消息
    docs: {
      // 功能描述
      description: 'require object keys to be sorted',
      // 功能分类
      category: 'Stylistic Issues',
      // "eslint:recommended" 属性时是否启用该规则
      recommended: false,
      // 规则配套说明书
      url: 'https://github.com/forivall/eslint-plugin-sort-keys-plus#rule-configuration',
    },

    // 该规则的配置 schema，使用 JSON-schema 约定各参数的类型和范围
    schema: [
      // 参数一，一个字符串枚举
      {
        enum: ['asc', 'desc'],
      },
      // 参数二，一个配置对象
      {
        type: 'object',
        properties: {
          caseSensitive: {
            type: 'boolean',
            default: true,
          },
          natural: {
            type: 'boolean',
            default: false,
          },
          minKeys: {
            type: 'integer',
            minimum: 2,
            default: 2,
          },
          allowLineSeparatedGroups: {
            type: 'boolean',
            default: false,
          },
          ignoreSingleLine: {
            type: 'boolean',
            default: false,
          },
          allCaps: {
            enum: ['first', 'last', 'ignore'],
            default: 'ignore',
          },
          shorthand: {
            enum: ['first', 'last', 'ignore'],
            default: 'ignore',
          },
          overrides: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                order: {
                  type: 'array',
                  minLength: 1,
                  items: {
                    type: 'string',
                  },
                },
                properties: {
                  type: 'array',
                  minLength: 1,
                  items: { type: 'string' },
                },
                sort: {
                  properties: {
                    ignore: {
                      type: 'boolean',
                    },
                  },
                },
              },
              // $anyOf是一个JSON Schema标准定义的关键字，即必须满足下面条件之一
              $anyOf: [
                {
                  // 要么 order 字段必填
                  required: ['order'],
                },
                {
                  // 要么 properties ignore 字段必填
                  required: ['properties', 'ignore'],
                },
              ],
            },
            default: [],
          },
        },
        additionalProperties: false,
      },
    ],

    // 错误提示语模版
    messages: {
      sortKeys:
        "Expected object keys to be in {{natural}}{{insensitive}}{{order}}ending order. '{{thisName}}' should be before '{{prevName}}'.",
      sortKeysAllCaps:
        "Expected all caps object keys to be {{allCaps}}. '{{thisName}}' should be before '{{prevName}}'.",
      sortKeysOverride:
        "Expected {{parentName}} object keys to be in custom order. '{{thisName}}' should be before '{{prevName}}'.",
      sortKeysShorthand:
        "Expected shorthand properties to be {{shorthand}}. '{{thisName}}' should be before '{{prevName}}'.",
    },
  },

  // 方法详解：https://zh-hans.eslint.org/docs/latest/extend/custom-rules
  create(context) {
    // context.options 该规则的入参，在此规则中，有两个入参
    const order = context.options[0] || 'asc'
    // 参数二，具体配置规则
    const options = context.options[1]
    // 配置规则的默认值处理
    const insensitive = options && options.caseSensitive === false
    const natural = options && options.natural
    const minKeys = (options && options.minKeys) || 2
    // 该规则允许通过换行符对对象键进行分组。换句话说，属性后面的空行将重置键的排序
    const allowLineSeparatedGroups = (options && options.allowLineSeparatedGroups) || false
    const ignoreSingleLine = (options && options.ignoreSingleLine) || false
    const allCaps = (options && options.allCaps) || 'ignore'
    const shorthand = (options && options.shorthand) || 'ignore'
    // 对「特定的键集」或「具有特定父键的子对象」进行自定义顺序，排序规则复写
    const overrides = (options && options.overrides) || []

    // 数据结构转换，以对象中 properties 的逐个值为 key 提出对象
    // properties 定义应用自定义 order 这个规则的父属性键，即那个 obj 才自定义 order 顺序。指定特定 key 的对象才应用自定义 order 顺序
    const propOverrides = new Map(overrides.flatMap(item => (item.properties ? item.properties.map(property => [property, item]) : [])))

    // 没指定父键 key 的 order 配置，即往所有的对象都启用这个自定义 order 排序
    const otherOverrides = new Map()
    overrides.forEach(override => {
      // 找到没有指定父 key 的配置项，往所有对象启用本自定义 order
      if (override.properties) {
        return
      }

      // order 自定义属性 key 的排查，不一定按字母排序
      // .concat()方法的用意是为了避免直接对原数组排序.sort(),从而保留原始顺序。
      const sortedOrder = override.order.concat().sort()

      // 获取所有可能的组合，以 order 的 key 字符串拼接所有可能，先枚举所以可能，以快速排序
      function combination(arr, minLength) {
        const initialValue = []
        return arr
          .reduce((out, item) => [...out, [item], ...out.map(c => [...c, item])], initialValue)
          .filter(c => c.length >= minLength)
      }

      // ['scorenameage', { order: ['age', 'score', 'name']  }] 
      // 由此可知，存在缺陷，当对象中的属性未满，或者缺失时，自定义排序将失效
      combination(sortedOrder, minKeys).forEach(combo => {
        const key = combo.join() // 所以可能组件的 keyPath
        const existing = otherOverrides.get(key)

        if (!existing || override.order.length < existing.order.length) {
          otherOverrides.set(key, override)
        }
      })
    })

    // 是否按字母排序的校验器
    const isValidOrderAlpha = isValidOrders[`${order}${insensitive ? 'I' : ''}${natural ? 'N' : ''}`]
    // 是否校验大小写的校验器
    const isValidOrderAllCaps = firstLastTest(allCaps, isValidAllCapsTest)
    // 是否校验简写的校验器
    const isValidOrderShorthand = firstLastTest(shorthand, isValidShorthandTest)

    // 堆栈信息
    let stack = null

    // 扩展表达式的 visitor 函数
    function SpreadElement(node) {
      // 如果父节点是 对象表达式 var a = {}，则重置堆栈信息
      if (node.parent.type === 'ObjectExpression') {
        stack.prevNode = null
        stack.prevName = null
        stack.prevNameSkipped = false
      }
    }

    // 返回不同类型节点的检测器函数（visitor函数），每个节点都将运行都有检查器进行处理
    // 节点类型解析，不同的语言定义有不同语言特性的节点类型，https://astexplorer.net/
    // 本插件是基于 Babel 的 AST 类型，https://www.babeljs.cn/docs/babel-types#standardized
    // https://blog.csdn.net/qq_31411389/article/details/113487860
    return {

      // 对象表达式 {}，每一层对象都会执行一遍
      ObjectExpression(node) {
        // 父节点
        const parent = node.parent
        // 父节点名
        let parentName
        // 排序规则复写，自定义排序规则
        let override

        // 如果父节点是对象属性，即本节点是子对象类型。
        if (parent.type === 'Property' && !parent.computed) {
          const parentKey = parent.key
          parentName = typeof parentKey.value === 'string' ? parentKey.value : parentKey.name
          // 尝试获取指定 父 key 的自定义排序规则
          override = propOverrides.get(parentName)
        }

        // 如果指定的 父属性 key 的自定义规则，则从 otherOverrides 里面找
        if (!override && otherOverrides.size > 0) {
          // 对节点的属性进行排序，node.properties 是 Object.keys()
          const key = node.properties
            .map(getPropertyName)
            .filter(name => name !== null)
            .sort()
            .join()
          // 尝试获取未指定父 key 的自定义排序规则
          override = otherOverrides.get(key)
        }

        // 开发自定义的数据结构，用于实现本功能
        stack = {
          // 包一层壳，增加一层上下文深度
          upper: stack,
          // 忽略单行表达式
          ignore: (stack && stack.ignore) || (ignoreSingleLine && node.loc.start.line === node.loc.end.line),
          // 同层级前一个节点
          prevNode: null,
          // 同层级前一个空行，用于中断某部分排序
          prevBlankLine: false,
          // 同层级前一个节点名
          prevName: null,
          // 同层级前一个节点是否是可跳过的节点，没有 key 也没有 name 的节点
          prevNameSkipped: false,
          // 当前对象的属性个数
          numKeys: node.properties.length,
          // 父节点名
          parentName,
          // 自定义排序规则
          override,
          // 有自定义规则，则返回自定义排序规则的对比方法，用在 sort 函数中
          isValidOrderOverride: override && validCustomOrderComparator(override.order),
        }
      },

      // 新对象表达式，:exit 是离开节点后触发,适合收尾工作
      // 对应的钩子还有 :enter 进入前，做准备工作
      'ObjectExpression:exit'() {
        // 堆栈脱一层壳，脱离一层上下文深度，离开一层对象结构
        stack = stack.upper
      },

      // [标准]扩展表达式 {...a},[...a]
      SpreadElement,

      // [ts 专属]，扩展表达式 {...a},[...a]
      ExperimentalSpreadProperty: SpreadElement,

      // 对象属性，即定义每一个对象属性都会进入一遍。
      Property(node) {
        // ObjectPattern 对象解构，或直接跳过检查（如单行对象）
        if (node.parent.type === 'ObjectPattern' || stack.ignore || (stack.override && stack.override.ignore)) {
          return
        }

        const prevNode = stack.prevNode
        const prevName = stack.prevName
        const prevNameSkipped = stack.prevNameSkipped
        const fixable = !prevNameSkipped // 标识当做错误是否可以修复，若是空节点，则不可修复
        const numKeys = stack.numKeys
        // 当前属性节点名
        const thisName = getPropertyName(node)
        // 当前是否为两个空白行直接的节点
        const isBlankLineBetweenNodes = stack.prevBlankLine || (allowLineSeparatedGroups && hasBlankLineBetweenNodes(context, node, prevNode))

        // 修改堆栈信息，记录上一个节点的信息
        stack.prevNode = node
        stack.prevNameSkipped = thisName === null

        if (thisName !== null) {
          stack.prevName = thisName
        }

        // 空白行，重置排序
        if (allowLineSeparatedGroups && isBlankLineBetweenNodes) {
          stack.prevBlankLine = thisName === null
          return
        }

        // 其他特殊情况，跳过排序
        if (prevName === null || thisName === null || numKeys < minKeys) {
          return
        }

        // 当前有自定义排序，且顺序是否正确
        const isValidOverride = stack.isValidOrderOverride && stack.isValidOrderOverride(prevName, thisName)

        // 自定义排序不正确，则给出错误提示
        if (isValidOverride === false) {
          createReport(context, node, prevNode, fixable, 'sortKeysOverride', {
            thisName,
            prevName,
            parentName: stack.parentName || '',
            overrideMessage: stack.override.message,
          })
          return
        }

        // 自定义排序正确
        if (isValidOverride) {
          return
        }

        // 大小写排序是否正确
        const isValidAllCaps = isValidOrderAllCaps(prevName, thisName)

        // 大小写不正确，提示
        if (isValidAllCaps === false) {
          createReport(context, node, prevNode, fixable, 'sortKeysAllCaps', {
            thisName,
            prevName,
            allCaps,
          })
          return
        }

        // 简写排序是否正确
        const isValidShorthand = isValidOrderShorthand(prevNode, node)

        // 简写排序不正确
        if (isValidShorthand === false) {
          createReport(context, node, prevNode, fixable, 'sortKeysShorthand', {
            thisName,
            prevName,
            shorthand,
          })
          return
        }

        // isValidAllCaps 和 isValidShorthand 包括了基础的字母排序，若其中一个正确，都不需要走最后的基础字母排序
        if (isValidAllCaps || isValidShorthand) {
          return
        }

        // 最后一步，字母排序是否正确，不正确则提示
        if (!isValidOrderAlpha(prevName, thisName)) {
          createReport(context, node, prevNode, fixable, 'sortKeys', {
            thisName,
            prevName,
            order,
            insensitive: insensitive ? 'insensitive ' : '',
            natural: natural ? 'natural ' : '',
          })
        }
      },
    }
  },
}
