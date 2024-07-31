import { extendTheme,ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: 'dark',
};

// 扩展主题，添加自定义颜色
const theme = extendTheme({
  config,
  colors: {
    gray: {
      50: "#F9FAFB", 
      100: "#F3F4F6", 
      200: "#E5E7EB", 
      300: "#D1D5DB", 
      400: "#9CA3AF", 
      500: "#6B7280", 
      600: "#4B5563", 
      700: "#374151", 
      800: "#1F2937", 
      900: "#111827", 
    },
    custom: {
      bgColorMain: {
        light: "white",
        dark: "#212121",
      },
      bgColorAside: {
        light: "#f8f8f8",
        dark: "#171717",
      },
      bgButton: {
        light: "#d8d8d8",
        dark: "#676767",
      },
      fontColor: {
        light: "#0d0d0d",
        dark: "#ececec"
      },
      lineColor:{
        light: "#e5e5e5",
        dark: "#2f2f2f"
      },
      inputFocusColor:{
        light: "#0d0d0d",
        dark: "#ececec"
      }
    },
  },
  components:{
    Input:{
    },
    Table:{
      baseStyle:{
        th:{
          color: "#2f2f2f",
          borderColor: "#2f2f2f"
        },
        td:{
          borderColor: "#2f2f2f"
        }
      }
    }
  }
});


export default theme;
