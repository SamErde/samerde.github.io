// @ts-check

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

const siteUrl = 'https://day3bits.com';
const rssDescription =
  "Notes about enterprise IT with a focus on automation, design, security, user experience. Sam's primary goal is to promote the growth of operational maturity through intentional growth and continuous improvement.";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Day 3 Bits',
  tagline:
    "Sharing ideas and things I'm learning about IT infrastructure operations, cybersecurity, automation, and the value of continuous improvement.",
  url: siteUrl,
  baseUrl: '/',
  organizationName: 'SamErde',
  projectName: 'samerde.github.io',
  trailingSlash: true,
  staticDirectories: ['static'],
  favicon: 'assets/img/avatar-icon.png',
  customFields: {
    giscus: {
      hostname: 'https://giscus.app',
      repository: 'samerde/samerde.github.io',
      repositoryId: 'R_kgDOK3A-Qg',
      category: 'Announcements',
      categoryId: 'DIC_kwDOK3A-Qs4CvalR',
      mapping: 'title',
      reactionsEnabled: '1',
      emitMetadata: '0',
      theme: 'preferred_color_scheme',
    },
  },
  onBrokenLinks: 'throw',
  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
    mermaid: true,
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          path: 'blog',
          routeBasePath: '/',
          blogTitle: 'Day 3 Bits',
          blogDescription: rssDescription,
          blogSidebarCount: 5,
          blogSidebarTitle: 'Recent posts',
          postsPerPage: 5,
          showReadingTime: true,
          editUrl:
            'https://github.com/SamErde/samerde.github.io/edit/main/',
          feedOptions: {
            type: ['rss', 'atom'],
            title: 'Day 3 Bits',
            description: rssDescription,
            copyright: `Copyright © ${new Date().getFullYear()} Sam Erde`,
          },
        },
        pages: {
          path: 'src/pages',
          routeBasePath: '/',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
        },
        gtag: {
          trackingID: 'G-WSWT0E3F1K',
          anonymizeIP: true,
        },
      }),
    ],
  ],
  themes: ['@docusaurus/theme-mermaid'],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'assets/img/social/Return-Multiple-Objects-from-a-PowerShell-Function.png',
      navbar: {
        title: 'Day 3 Bits',
        items: [
          {to: '/aboutme/', label: 'About Me', position: 'left'},
          {
            href: 'https://linktr.ee/SamErde',
            label: 'Linktree',
            position: 'left',
          },
          {
            type: 'dropdown',
            label: 'PowerShell Modules',
            position: 'left',
            items: [
              {
                label: 'PSPreworkout',
                href: 'https://day3bits.com/PSPreworkout',
              },
              {
                label: 'TheCleaners',
                href: 'https://day3bits.com/TheCleaners',
              },
              {
                label: 'DLL Pickle',
                href: 'https://day3bits.com/DLLPickle',
              },
            ],
          },
          {to: '/tags/', label: 'Tags', position: 'left'},
          {
            href: 'https://github.com/SamErde',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Connect',
            items: [
              {label: 'Email', href: 'mailto:sam@day3bits.com'},
              {label: 'GitHub', href: 'https://github.com/SamErde'},
              {label: 'LinkedIn', href: 'https://www.linkedin.com/in/SamErde'},
              {label: 'Bluesky', href: 'https://bsky.app/profile/samerde.day3bits.com'},
              {label: 'RSS', href: 'https://day3bits.com/feed.xml'},
            ],
          },
          {
            title: 'PowerShell Modules',
            items: [
              {label: 'PSPreworkout', href: 'https://day3bits.com/PSPreworkout'},
              {label: 'TheCleaners', href: 'https://day3bits.com/TheCleaners'},
              {label: 'DLL Pickle', href: 'https://day3bits.com/DLLPickle'},
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Sam Erde.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['powershell', 'bash'],
      },
      mermaid: {
        theme: {light: 'neutral', dark: 'forest'},
      },
      algolia: {
        appId: 'P1TQ2GZ57L',
        apiKey: '73710804bf8e607df1b562bba5fdf27a',
        indexName: 'Day3Bits',
        contextualSearch: true,
      },
    }),
};

module.exports = config;
