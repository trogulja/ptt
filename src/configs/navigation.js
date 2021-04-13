export default {
  // main navigation - side menu
  menu: [
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-timer-outline',
          key: 'menu.time',
          text: 'Time',
          link: '/ptt',
        },
        {
          icon: 'mdi-clipboard-check-outline',
          key: 'menu.tasks',
          text: 'Tasks',
          link: '/tasks',
          disabled: true,
        },
        {
          icon: 'mdi-folder-outline',
          key: 'menu.projects',
          text: 'Projects',
          link: '/projects',
          disabled: true,
        },
        {
          icon: 'mdi-cart-outline',
          key: 'menu.expenses',
          text: 'Expenses',
          link: '/expenses',
          disabled: true,
        },
        {
          icon: 'mdi-filter-outline',
          key: 'menu.sales',
          text: 'Sales',
          link: '/sales',
          disabled: true,
        },
        {
          icon: 'mdi-account-multiple-outline',
          key: 'menu.contacts',
          text: 'Contacts',
          link: '/contacts',
          disabled: true,
        },
        {
          icon: 'mdi-currency-eur',
          key: 'menu.billing',
          text: 'Billing',
          link: '/billing',
          disabled: true,
        },
        {
          icon: 'mdi-chart-box-outline',
          key: 'menu.reports',
          text: 'Reports',
          link: '/reports',
          disabled: true,
        },
        {
          icon: 'mdi-finance',
          key: 'menu.insights',
          text: 'Insights',
          link: '/insights',
          disabled: true,
        },
      ],
    },
  ],

  // footer links
  footer: [
    {
      text: 'Repo',
      key: 'menu.repo',
      href: 'https://github.com/trogulja/ptt',
      target: '_blank',
    },
  ],
};
