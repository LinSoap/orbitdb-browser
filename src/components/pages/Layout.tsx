import { Box, Grid, GridItem, Show, useColorMode } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import Welcome from "./Welcome";
import SideBarContainer from "../common/SideBarContainer";

const Layout = () => {
  const { colorMode } = useColorMode();
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const bgColorMain = colorMode === "dark" ? "gray.800" : "gray.100";
  const bgColorAside = colorMode === "dark" ? "gray.700" : "gray.200";

  return (
    <Grid
      templateAreas={{
        base: ` "main"`,
        lg: `"aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        lg: "250px 1fr",
      }}
    >
      <Show above="lg">
        <GridItem area="aside" bg={bgColorAside} position={"fixed"}>
          <SideBarContainer />
        </GridItem>
      </Show>
      <GridItem area="main" bg={bgColorMain} minHeight={"100vh"}>
        <Show below="lg">
          <Box
            position={"fixed"}
            zIndex={999}
            bg={bgColorMain}
            width={"100%"}
          ></Box>
          <Box marginBottom={70} />
        </Show>
        <Outlet />
        {isRoot && <Welcome />}
      </GridItem>
    </Grid>
  );
};

export default Layout;
