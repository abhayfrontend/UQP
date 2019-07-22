export const navigation = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'dashboard',
    fname: 'dashboard'
    // badge: {
    //   variant: 'info',
    //   text: 'NEW'
    // }
  },
  // {
  //   title: true,
  //   name: 'UI elements'
  // },
  {
    name: 'Quality Measures',
    url: '/measures',
    icon: 'accessibility',
    fname: 'Quality Measure'
  },
  {
    name: 'STAR Value',
    url: '/star-management',
    icon: 'grade', 
    fname: 'STAR Values'
  },
  // {
  //   name: 'Widgets',
  //   url: '',
  //   icon: 'icon-calculator',
  //   badge: {
  //     variant: 'info',
  //     text: 'NEW'
  //   }
  // },
  {
    name: 'Access Control',
    url: '/acm',
    icon: 'lock',
    fname: 'Access Control Management'
  },
  // {
  //   divider: true
  // },
  // {
  //   title: true,
  //   name: 'Extras',
  // },

    {
    name: 'Contacts',
    url: '/user',
    icon: 'person',
    fname: 'dashboard',
    children: [
      
      {
        name: 'User role',
        url: '/user/role',
        icon: 'people',
        fname: 'Role Management'
      },
      {
        name: 'User list',
        url: '/user/list',
        icon: 'people',
        fname: 'User Management'
      }
    ]
  },
      {
    name: 'Master',
    url: '',
    icon: 'settings',
    fname: 'dashboard',
    children: [
    {
        name: 'ACO group',
        url: '/reports/aco-group',
        icon: 'people',
        fname: 'ACO Group'
     },
     {
        name: 'ACO Provider',
        url: '/aco-provider/list',
        icon: 'local_pharmacy',
        fname: 'ACO Provider Management'
      },
       {
        name: 'IPA',
        url: '/IPA/list',
        icon: 'assignment',
        fname: 'IPA Management'
      },
       {
        name: 'Insurance',
        url: '/insurance/list',
        icon: 'local_pharmacy',
        fname: 'Insurance Management'
      },
      {
        name: 'Provider',
        url: '/provider/list',
        icon: 'people',
        fname: 'Provider Management'
      }
     
     
     
      
    ]
  },
   {
    name: 'Scorecard',
    url: '',
    icon: 'format_list_numbered',
    fname: 'dashboard',
    children: [
      {
        name: 'ACO',
        url: '/scorecard/aco-scorecard',
        icon: 'local_hospital',
        fname: 'ACO Score Card'
      },
      {
        name: 'CAHPS',
        url: '/scorecard/survey-scorecard/CAHPS',
        icon: 'local_hospital',
        fname: 'CAHPS Score Card'
      },
    {
        name: 'Healthplan',
        url: '/scorecard/healthplan',
        icon: 'local_hospital',
        fname: 'Health Plan Score Card'
      },
      {
        name: 'HOS',
        url: '/scorecard/survey-scorecard/HOS',
        icon: 'local_hospital',
        fname: 'HOSP Score Card'
      },
       {
        name: 'IPA',
        url: '/scorecard/ipa',
        icon: 'local_hospital',
        fname: 'IPA Score Card'
      },
       {
        name: 'overall provider',
        url: '/scorecard/overallprovider',
        icon: 'local_hospital',
        fname: 'Overall Provider Score Card'
      },
      {
        name: 'Provider',
        url: '/scorecard/provider',
        icon: 'local_hospital',
        fname: 'Provider Score Card'
      }
        
    ]
  },
        
   {
    name: 'Reports',
    url: '',
    icon: 'equalizer',
    fname: 'dashboard',
    children: [
    {
        name: 'ACO Members',
        url: '/reports/aco/members',
        icon: 'people',
        fname: 'ACO Members'
      },
      {
        name: 'ACO Gaps',
        url: '/reports/aco/gaps',
        icon: 'people',
        fname: 'ACO Gaps'
      },

      
       {
        name: 'compliant',
        url: '/reports/compliant',
        icon: 'people',
        fname: 'Overall Gap'
      },
       {
        name: 'custom-report',
        url: '/reports/custom-report',
        icon: 'people',
        fname: 'Custom Reports'
      },
       {
        name: 'census-report',
        url: '/reports/census-report',
        icon: 'people',
        fname: 'Census report'
      },
       {
        name: 'follow-ups',
        url: '/reports/followups',
        icon: 'people',
        fname: 'Follow Ups'
      },
      {
        name: 'last-visit',
        url: '/reports/last-visit',
        icon: 'people',
        fname: 'Last Visit'
      },
      {
        name: 'membership-roster',
        url: '/reports/membership-roster',
        icon: 'people',
        fname: 'Membership Roaster'
      },
     
      {
        name: 'non-compliant',
        url: '/reports/non-compliant',
        icon: 'people',
        fname: 'Overall Gap'
      },
      {
        name: 'Prevalence',
        url: '/reports/prevalence',
        icon: 'people',
        fname: 'Overall Gap'
      },
      
      {
        name: 'Trends',
        url: '/trends',
        icon: 'assignment',
        fname: 'Trends'
      }

     
     
     
      
    ]
  },

  {
    name: 'Survey',
    url: '',
    icon: 'equalizer',
    fname: 'dashboard',
    children: [
      {
        name: 'CAHPS',
        url: '/survey/cahps',
        icon: 'people',
        fname: 'CAHPS Survey'
      },
      {
        name: 'HOS',
        url: '/survey/hosp',
        icon: 'people',
        fname: 'HOS Survey'
      }
    ]
  },

  {
    name: 'Content',
    url: '',
    icon: 'equalizer',
    fname: 'dashboard',
    children: [
      
       {
        name: 'Education',
        url: '/education',
        icon: 'people',
        fname: 'Education'
      },
      {
        
        name: 'Email Management',
        url: '/email-management',
        icon: 'people',
        fname: 'Email Management'
      },
       {
        name: 'Message',
        url: '/message',
        icon: 'people',
        fname: 'Message Management'
      },
      {
        name: 'Notifications',
        url: '/notifications',
        icon: 'people',
        fname: 'Notification Management'
      },
      
      {
        name: 'Videos',
        url: '/videos',
        icon: 'people',
        fname: 'Video Management'
      },
       {
        
        name: 'Bulk Mail',
        url: '/bulk-mail',
        icon: 'people',
        fname: 'Bulk Email Management'
      }

     
     
      
    ]
  },

   {
    name: 'Productivity',
    url: '',
    icon: 'equalizer',
    fname: 'dashboard',
    children: [
    {
        name: 'Audit-Hedis',
        url: '/reports/productivity/audit/hedis',
        icon: 'people',
        fname: 'Quality Audit Productivity'
      },
      {
        name: 'HEDIS',
        url: '/reports/productivity/HEDIS',
        icon: 'people',
        fname: 'Hedis Productivity'
      },
      {
        name: 'MRA',
        url: '/reports/productivity/MRA',
        icon: 'people',
        fname: 'MRA Productivity'
      },
      {
        name: 'Surveyor',
        url: '/productivity/surveyor',
        icon: 'people',
        fname: 'Surveyor Productivity'
      }
      
    ]
  },
  
  {
    name: 'Audit',
    url: '',
    icon: 'equalizer',
    fname: 'dashboard',
    children: [
      {
        name: 'ACO Gap ',
        url: '/reports/aco/audit',
        icon: 'people',
        fname: 'ACO Gap Audit'
      },
      {
        name: 'HEDIS Gap ',
        url: '/gap-closure/gap-audit',
        icon: 'lock',
        fname: 'Gap Audit'
      },
      
    ]
  },


  {
    name: 'user-activity',
    url: '/reports/user-activity',
    icon: 'people',
    fname: 'User Activity'
  },

  {
    name: 'Dummy',
    url: '',
    icon: 'Dummy',
    fname: 'dashboard',
    children: [
     {
        name: 'last-visit',
        url: '/reports/last-visit',
        icon: 'people',
        fname: 'Last Visit'
      },
      {
        name: 'membership-roster',
        url: '/reports/membership-roster',
        icon: 'people',
        fname: 'Membership Roaster'
      },
      
      {
        name: 'overall-gaps',
        url: '/reports/overall-gaps',
        icon: 'people',
        fname: 'Overall Gap'
      }

     
    ]
  },
  
];



// ,
//       {
//         name: 'Message',
//         url: '/message',
//         icon: 'people',
//         fname: 'Last Visit'

// //master member
//    {
//         name: 'Member',
//         url: '/member/list',
//         icon: 'person',
//         fname: 'Member Management'

//       }
  // {
  //   name: 'Gap Closure',
  //   url: '',
  //   icon: 'equalizer',
  //   fname: 'dashboard',
  //   children: [
  //     {
  //       name: 'Gap Audit',
  //       url: '/gap-closure/gap-audit',
  //       icon: 'people',
  //       fname: 'Membership Roaster'
  //     },
      
      
  //   ]
  // },

  // ,
  //     {
  //       name: 'Trends',
  //       url: '/trends',
  //       icon: 'assignment',
  //       fname: 'Trends'
  //     }
     // {
        
     //    name: 'Bulk Mail',
     //    url: '/bulk-mail',
     //    icon: 'people',
     //    fname: 'Bulk Email Management'
     //  },