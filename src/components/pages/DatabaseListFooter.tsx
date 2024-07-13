import { Box, Text } from "@chakra-ui/react";
import { useIdentities } from "../../context/IdentitiesProvider";

const DatabaseListFooter = () => {
  const { identity } = useIdentities();

  return (
    <Box p={4}>
      {identity?.id ? (
        <Text>Current Identity: {identity.id}</Text>
      ) : (
        <Text>Identity unavailable</Text>
      )}
    </Box>
  );
};

export default DatabaseListFooter;
