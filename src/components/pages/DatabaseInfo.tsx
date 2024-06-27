import { Box, Heading } from "@chakra-ui/react";

import { useParams } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";

const DatabaseInfo = () => {
  let { address } = useParams();
  const { orbitDB } = useOrbitDB();
  console.log(
    orbitDB.open("/orbitdb/zdpuAtGdti2PiNsfr3ac3dpARr2fTi7eUeMVe6mb9YocA2CWK")
  );
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
