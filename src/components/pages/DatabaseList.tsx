import { Button, List, ListItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const DatabaseList = () => {
  return (
    <List padding={5}>
      <ListItem key="0" paddingY="5px">
        <Link to="/">
          <Button
            width={"100%"}
            colorScheme="messenger"
            whiteSpace="normal"
            textAlign="left"
            fontSize="md"
          >
            Connect Database
          </Button>
        </Link>
      </ListItem>
    </List>
  );
};

export default DatabaseList;
