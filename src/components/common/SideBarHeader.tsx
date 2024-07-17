import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const SideBarHeader = () => {
  return (
    <Link to="/">
      <Button
        width={"100%"}
        colorScheme="messenger"
        whiteSpace="normal"
        textAlign="left"
        fontSize="md"
      >
        Home
      </Button>
    </Link>
  );
};

export default SideBarHeader;
