import { Spinner, Box, Text, Center } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Center height="100vh">
      <Box textAlign="center">
        <Spinner size="xl" thickness="4px" speed="0.65s" />
        <Text mt={4} fontSize="lg" color="gray.600">
          Loading...
        </Text>
      </Box>
    </Center>
  );
};

export default Loading;
