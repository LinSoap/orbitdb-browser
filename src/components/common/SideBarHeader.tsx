import {
  Box,
  Button,
  Card,
  Text,
  useColorMode,
  useTheme,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SideBarHeader = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgButton = theme.colors.custom.bgButton[colorMode];

  return (
    <Box p={3}>
      <Button bg={bgButton} w={"full"} onClick={() => navigate("/")}>
        <Text fontSize="xl" fontWeight="bold">
          Home
        </Text>
      </Button>
    </Box>
  );
};

export default SideBarHeader;
