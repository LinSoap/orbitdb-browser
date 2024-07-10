import { Button, List, ListItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";

const DatabaseList = () => {
  const { databases } = useOrbitDB();
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
          <ul>
            {databases.map((database) => (
              <li key={database.address}>{database.address}</li>
            ))}
          </ul>
        </Link>
      </ListItem>
    </List>
  );
};

export default DatabaseList;
