import { Container } from "@chakra-ui/react";

import DatabaseList from "./DatabaseList";
import SideBarHeader from "./SideBarHeader";
import SideBarFooter from "./SideBarFooter";

const SideBarContainer = () => {
  return (
    <Container left={0} top={0} height={"100vh"} width={250}>
      <SideBarHeader />
      <DatabaseList />
      <SideBarFooter />
    </Container>
  );
};

export default SideBarContainer;
