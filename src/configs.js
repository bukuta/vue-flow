import FONT_AWESOME from './font-awesome-unicode-map.js';

console.log(FONT_AWESOME);

const components = [
  {
    name: 'start',
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
    icon: '',
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
