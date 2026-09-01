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
  subtitle: '日月星辰の小窝',
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
      url: 'https://jumc7et35z6o.vip3.xiaomiqiu123.top/',
      image: 'https://cdn.jsdelivr.net/gh/filebrowser/filebrowser@master/frontend/public/img/logo.svg',
      description: '基于 File Browser 搭建的个人本地网盘',
      external: true,
    },
    {
      name: '个人密码库',
      url: 'https://3mc6gx9ewgtu.vip3.xiaomiqiu123.top/',
      image: 'https://cdn.jsdelivr.net/gh/dani-garcia/vaultwarden@main/resources/vaultwarden-icon.svg',
      description: '基于 Vaultwarden 搭建的个人密码管理库',
      external: true,
    },
    {
      name: '个人网盘',
      url: 'https://59vp3kckptwv.vip3.xiaomiqiu123.top/',
      image: 'https://cdn.jsdelivr.net/gh/OpenListTeam/OpenList-Resource@main/logo/logo.svg',
      description: '基于 Openlist 搭建的个人本地网盘',
      external: true,
    },
    {
      name: '个人AI助手',
      url: 'https://rcsvnfd47bsc.ngrok.xiaomiqiu123.top/#/chat',
      image: 'https://cdn.jsdelivr.net/gh/AstrBotDevs/AstrBot@master/dashboard/src/assets/images/icon-no-shadow.svg',
      description: '基于 Astrbot 搭建的个人AI助手，对接Napcat机器人',
      external: true,
    },
    {
      name: '个人家居系统',
      url: 'https://76kfxaa44u7a.vip3.xiaomiqiu123.top/',
      image: 'https://cdn.jsdelivr.net/gh/home-assistant/home-assistant.io@current/source/images/favicon.svg',
      description: '基于 HomeAssistant 搭建的个人智能家居系统',
      external: true,
    },
    {
      name: '个人路由器',
      url: 'https://rlv29j98hrje.ngrok.xiaomiqiu123.top',
      image: 'https://cdn.jsdelivr.net/gh/openwrt/branding@master/logo/openwrt_logo_blue_and_dark_blue.svg',
      description: '基于 ImmortalWrt 搭建的个人软路由系统',
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
  bio: '人工智能硕士，研究方向二次元、动漫、游戏，偶尔写写代码调调机器人',
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
