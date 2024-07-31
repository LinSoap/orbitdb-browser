import { forwardRef } from "react";
import { Input, InputProps, useColorMode, useTheme } from "@chakra-ui/react";

const StyledInput = forwardRef<HTMLInputElement, InputProps>((props) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const inputFocusColor = theme.colors.custom.inputFocusColor[colorMode];
  return <Input {...props} focusBorderColor={inputFocusColor} />;
});

export default StyledInput;