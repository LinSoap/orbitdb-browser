import { Button, List, ListItem } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";

const DatabaseList = () => {
  const { databases } = useOrbitDB();
  const navigate = useNavigate();

  const onClickDatabaseItem = (address: string) => {
    navigate("/database-info" + address);
  };

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
        <ul>
          {databases.map((database) => (
            <li key={database.address}>
              <Button onClick={() => onClickDatabaseItem(database.address)}>
                {database.address}
              </Button>
            </li>
          ))}
        </ul>
      </ListItem>
    </List>
  );
};

export default DatabaseList;
