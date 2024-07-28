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
        light: "white",
        dark: "gray.800",
      },
      bgColorAside: {
        light: "#f8f8f8",
        dark: "gray.700",
      },
      bgButton: {
        light: "#d8d8d8",
        dark: "gray.600",
      }
    },
  },
});

export default theme;
