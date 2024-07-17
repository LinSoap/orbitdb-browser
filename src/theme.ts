import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: 'dark',
};

// 扩展主题，添加自定义颜色
const theme = extendTheme({
  config,
  colors: {
    custom: {
      bgColorMain: {
        light: "gray.100",
        dark: "gray.800",
      },
      bgColorAside: {
        light: "gray.200",
        dark: "gray.700",
      },
    },
  },
});

export default theme;
