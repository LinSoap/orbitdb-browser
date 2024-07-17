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
                display="flex" // 设置为flex
                justifyContent="flex-start" // 左对齐
                textAlign="left" // 文字左对齐
                padding="1rem" // 添加内边距以增加可点击区域
              >
                {database.name}
              </Button>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DatabaseList;
