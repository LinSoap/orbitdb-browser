import { Box, Text } from "@chakra-ui/react";

const MainTitle = ({ title }: { title: string }) => {
  return (
    <Box p={4} borderBottom="2px solid #e2e8f0">
      <Text fontSize="xl" fontWeight="bold">
        {title}
      </Text>
    </Box>
  );
};

export default MainTitle;
