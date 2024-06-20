import { Container } from "@chakra-ui/react";
import DatabseListHeader from "./DatabseListHeader";
import DatabaseListFooter from "./DatabaseListFooter";
import DatabaseList from "./DatabaseList";

const DatabaseListContainer = () => {
  return (
    <Container left={0} top={0} height={"100vh"} width={250}>
      <DatabseListHeader />
      <DatabaseList />
      <DatabaseListFooter />
    </Container>
  );
};

export default DatabaseListContainer;
