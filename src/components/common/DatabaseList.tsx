import {
  Box,
  Button,
  List,
  ListItem,
  Tooltip,
  Text,
  useColorMode,
  useTheme,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";

const DatabaseList = () => {
  const { address } = useParams<{ address: string }>();
  const { databases } = useOrbitDB();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgColorAside = theme.colors.custom.bgColorAside[colorMode];

  const formatDatabaseName = (name: string) => {
    if (name.length > 20) {
      return `${name.slice(0, 15)}...${name.slice(-8)}`;
    }
    return name;
  };

  return (
    <Box>
      <Text marginLeft={"15px"}>DataBase List</Text>
      <List>
        {databases.map((database: any) => (
          <ListItem key={database.address}>
            <Tooltip label={database.address}>
              <Button
                w={"95%"}
                border={"20px"}
                isActive={"/orbitdb/" + address === database.address}
                onClick={() => navigate("/database-info" + database.address)}
                bg={bgColorAside}
                display="flex"
                justifyContent="flex-start"
                textAlign="left"
                padding="1rem"
              >
                {formatDatabaseName(database.name)}
              </Button>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DatabaseList;
