import { Box, Button, Card, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SideBarHeader = () => {
  const navigate = useNavigate();
  return (
    <Card>
      <Box p={3}>
        <Button
          colorScheme="messenger"
          w={"full"}
          onClick={() => navigate("/")}
        >
          <Text fontSize="xl" fontWeight="bold">
            Home
          </Text>
        </Button>
      </Box>
    </Card>
  );
};

export default SideBarHeader;
