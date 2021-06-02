export default [
  {
    name: 'neptune',
    id: '1d94b96b-f0b3-40b5-929e-1f22bb54e1c2',
    targets: [
      {
        selectorId: '30420b59-7e77-481c-8722-3d518ff8bd45',
        systemName: 'DummyDesktopApp',
      },
    ],
    alerts: [
      {
        date: '22.05.2021',
        message:
          'An error occurred on selector 30420b59-7e77-481c-8722-3d518ff8bd45 in system DummyDesktopApp.',
      },
    ],
    warnings: [
      {
        date: '02.06.2021',
        message:
          'An error occurred in system DummyDesktopApp on a selector. Your automation might be affected.',
      },
      {
        date: '16.05.2021',
        message:
          'An error occurred in system DummyDesktopApp on a selector. Your automation might be affected.',
      },
    ],
    recentAlert: false,
    recentWarning: true
  },
  {
    name: 'venus',
    id: '65099e0f-aa7f-447b-9fda-3181c71f93fa',
    targets: [
      {
        selectorId: 'e65453cd-49be-44ca-a15c-31a763222397',
        systemName: 'DummyDesktopApp',
      },
    ],
    alerts: [
      {
        date: '02.06.2021',
        message:
          'An error occurred on selector e65453cd-49be-44ca-a15c-31a763222397 in system DummyDesktopApp.',
      },
      {
        date: '16.05.2021',
        message:
          'An error occurred on selector e65453cd-49be-44ca-a15c-31a763222397 in system DummyDesktopApp.',
      },
    ],
    warnings: [
      {
        date: '22.05.2021',
        message:
          'An error occurred in system DummyDesktopApp on a selector. Your automation might be affected.',
      },
    ],
    recentAlert: true,
    recentWarning: false
  },
  {
    name: 'jupiter',
    id: '23c9ba73-07bd-4ac5-a241-b7c78ffa59a6',
    targets: [
      {
        selectorId: 'e65453cd-49be-44ca-a15c-31a763222397',
        systemName: 'DummyDesktopApp',
      },
    ],
    alerts: [
      {
        date: '02.06.2021',
        message:
          'An error occurred on selector e65453cd-49be-44ca-a15c-31a763222397 in system DummyDesktopApp.',
      },
      {
        date: '16.05.2021',
        message:
          'An error occurred on selector e65453cd-49be-44ca-a15c-31a763222397 in system DummyDesktopApp.',
      },
    ],
    warnings: [
      {
        date: '22.05.2021',
        message:
          'An error occurred in system DummyDesktopApp on a selector. Your automation might be affected.',
      },
    ],
    recentAlert: true,
    recentWarning: false
  },
];
