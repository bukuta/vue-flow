import FONT_AWESOME from './font-awesome-unicode-map.js';

console.log(FONT_AWESOME);

const components = [
  {
    name: 'start',
    description: '开始节点',
    icon: 'circle-o',
    inports: [
    ],
    outports: [
      {
        name: 'out',
        schema: {},
        position: 'bottom',
      },
    ],
  },
  {
    name: 'stop',
    description: '结束节点',
    icon: 'stop-circle',
    inports: [
      {
        name: 'in',
        schema: {},
        position: 'top',
      },
    ],
  },
  {
    name: 'action',
    description: '动作节点',
    icon: 'cogs',
    inports: [
      {
        name: 'in',
        schema: {},
        position: 'top',
      },
    ],
    outports: [
      {
        name: 'out',
        schema: {},
        position: 'bottom',
      },
    ],
  },
  {
    name: 'transfer',
    description: '转接节点',
    icon: 'exchange',
    inports: [
      {
        name: 'in',
        schema: {},
        position: 'top',
      },
    ],
    outports: [
      {
        name: 'out',
        schema: {},
        position: 'bottom',
      },
    ],
  },
  {
    name: 'assignment',
    description: '赋值节点',
    icon: 'code',
    inports: [
      {
        name: 'in',
        schema: {},
        position: 'top',
      },
    ],
    outports: [
      {
        name: 'out',
        schema: {},
        position: 'bottom',
      },
    ],
  },
  {
    name: 'empty',
    description: '空节点',
    icon: 'dot-circle-o',
    inports: [
      {
        name: 'in',
        schema: {},
        position: 'top',
      },
    ],
    outports: [
      {
        name: 'out',
        schema: {},
        position: 'bottom',
      },
    ],
  },
  {
    name: 'trigger',
    description: '事件触发节点',
    icon: 'lightbulb-o',
    inports: [
      {
        name: 'in',
        schema: {},
        position: 'top',
      },
    ],
    outports: [
      {
        name: 'out',
        schema: {},
        position: 'bottom',
      },
    ],
  },
];


const actions = {
  stage: [
    {
      action: 'create',
      label: 'create',
      icon: 'plus',
      fontIcon: FONT_AWESOME.plus,
    },
  ],
  node: [
    {
      action: 'info',
      label: 'info',
      icon: 'info',
      fontIcon: FONT_AWESOME.info,
    },
    // {
    //   action: 'right',
    //   label: 'right',
    //   icon: 'right',
    //   fontIcon: '',
    // },
    {
      action: 'delete',
      label: 'delete',
      icon: 'delete',
      fontIcon: FONT_AWESOME.trash,
    },
    // {
    //   action: 'top',
    //   label: 'top',
    //   icon: 'top',
    //   fontIcon: '',
    // },
  ],
  line: [
    {
      action: 'info',
      label: 'info',
      icon: 'info',
      fontIcon: FONT_AWESOME.info,
    },
    {
      action: 'delete',
      label: 'delete',
      icon: 'delete',
      fontIcon: FONT_AWESOME.trash,
    },

  ],

};

export default { components, actions };
