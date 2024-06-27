import { Box, Heading, List, ListItem } from "@chakra-ui/react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const DatabaseInfo = () => {
  let { address } = useParams();
  // const data = orbitDB
  //   .open("/orbitdb/zdpuAzqNqnKfPihAMV2qpNob8vdDWhLtZEuaGLQendHm8jh1Y")
  //   .all();
  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        OrbitDB Data
        {address}
      </Heading>
      {/* <List spacing={3}>
        {data.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List> */}
    </Box>
  );
};

export default DatabaseInfo;
