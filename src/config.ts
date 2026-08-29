import type {
  ExpressiveCodeConfig,
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from './types/config'
import { LinkPreset } from './types/config'

export const siteConfig: SiteConfig = {
  title: '日月星辰の个人博客',
  subtitle: '',
  lang: 'zh_CN',         // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko'
  themeColor: {
    hue: 250,         // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
    fixed: false,     // Hide the theme color picker for visitors
  },
  banner: {
    enable: false,
    src: 'assets/images/banner.jpg',   // Relative to the /src directory. Relative to the /public directory if it starts with '/'
    position: 'top',      // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
    credit: {
      enable: false,         // Display the credit text of the banner image
      text: '',              // Credit text to be displayed
      url: ''                // (Optional) URL link to the original artwork or artist's page
    }
  },
  toc: {
    enable: true,           // Display the table of contents on the right side of the post
    depth: 2                // Maximum heading depth to show in the table, from 1 to 3
  },
  favicon: [],                    // Use the avatar image as the default website icon
  apps: [
    {
      name: '个人网盘',
      url: 'https://e1mqdjgvdt2t.xiaomiqiu.com',
      image: 'https://raw.githubusercontent.com/filebrowser/filebrowser/master/frontend/public/img/logo.svg',
      description: '基于 File Browser 搭建的个人本地网盘',
      external: true,
    },
    {
      name: '个人密码库',
      url: 'https://ywht1wbab53o.xiaomiqiu.com/#/vault',
      image: 'https://raw.githubusercontent.com/dani-garcia/vaultwarden/main/resources/vaultwarden-icon.svg',
      description: '基于 Vaultwarden 搭建的个人密码管理库',
      external: true,
    },
  ],
}

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    {
      name: '应用',
      url: '/apps/',
    },
    {
      name: '统计',
      url: 'https://cloud.umami.is/share/dvktHwCGPSft7SGP',
      external: true,
    },
    {
      name: '旧博客',
      url: 'https://wangchuanfu294.github.io',     // Internal links should not include the base path, as it is automatically added
      external: true,                               // Show an external link icon and will open in a new tab
    },
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: 'assets/images/avatar.png',  // Relative to the /src directory. Relative to the /public directory if it starts with '/'
  name: '日月星辰',
  bio: '',
  links: [
    {
      name: 'csdn',
      icon: 'simple-icons:csdn',       // Visit https://icones.js.org/ for icon codes
                                        // You will need to install the corresponding icon set if it's not already included
                                        // `pnpm add @iconify-json/<icon-set-name>`
      url: 'https://blog.csdn.net/m0_72845244?spm=1000.2115.3001.5343', 
    },
    {
      name: 'bilibili',
      icon: 'fa6-brands:bilibili',
      url: 'https://space.bilibili.com/2058763975?spm_id_from=333.1007.0.0', 
    },
    {
      name: 'GitHub',
      icon: 'fa6-brands:github',
      url: 'https://github.com/riyuexingchennnn',
    },
  ],
}

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
