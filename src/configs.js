const configs = {
  components: [
    {
      name: 'start',
      icon: 'houzz',
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
      icon: 'stop',
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
      icon: 'address-book',
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
    {
      name: 'assignment',
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
    {
      name: 'empty',
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
  ],
};

export default configs;
