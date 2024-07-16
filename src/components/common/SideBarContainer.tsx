import { Box, Container } from "@chakra-ui/react";

import DatabaseList from "./DatabaseList";
import SideBarHeader from "./SideBarHeader";
import SideBarFooter from "./SideBarFooter";

const SideBarContainer = () => {
  return (
    <Container
      display={"flex"}
      flexDirection={"column"}
      left={0}
      top={0}
      height={"100vh"}
      width={250}
    >
      <SideBarHeader />
      <DatabaseList />
      <Box marginTop={"auto"} padding={"1rem"}>
        <SideBarFooter />
      </Box>
    </Container>
  );
};

export default SideBarContainer;
