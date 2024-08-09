import {
  Box,
  Button,
  List,
  ListItem,
  Tooltip,
  useColorMode,
  useTheme,
  Heading,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrbitDB } from "../../context/OrbitDBProvier";

const DatabaseList = () => {
  const { address } = useParams<{ address: string }>();
  const { recentDatabase, databases, orbitDB, addDatabase } = useOrbitDB();
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

  const handleClick = async (address: string) => {
    if (!databases.some((item: any) => item.address === address)) {
      const db = await orbitDB.open(address);
      addDatabase(db);
    }
    navigate("/database-info" + address);
  };

  return (
    <Box>
      <Heading size={"sm"} marginLeft={"5%"} marginTop={"5%"}>
        DataBase:
      </Heading>
      <List>
        {recentDatabase.map((database: any) => (
          <ListItem key={database.address} paddingX={"4px"}>
            <Tooltip
              label={
                <>
                  {"Address: " + database.address}
                  <br />
                  {"Type: " + database.type}
                </>
              }
            >
              <Button
                w={"95%"}
                border={"20px"}
                isActive={"/orbitdb/" + address === database.address}
                onClick={() => handleClick(database.address)}
                bg={bgColorAside}
                display="flex"
                justifyContent="flex-start"
                textAlign="left"
                marginLeft={"2.5%"}
                paddingLeft={"2.5%"}
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
