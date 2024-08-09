import { HStack, Text, IconButton } from "@chakra-ui/react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Pagination = ({
  totalPage,
  currentPage,
  setCurrentPage,
}: {
  totalPage: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const handleNextPage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <HStack spacing={4} justifyContent="center" mt={4}>
      <IconButton
        icon={<FaAngleLeft />}
        onClick={handlePreviousPage}
        isDisabled={currentPage === 1}
        colorScheme="gray"
        aria-label={"Previous"}
      ></IconButton>

      <Text>{`${currentPage}/${totalPage} `}</Text>

      <IconButton
        icon={<FaAngleRight />}
        onClick={handleNextPage}
        isDisabled={currentPage === totalPage}
        colorScheme="gray"
        aria-label={"Next"}
      ></IconButton>
    </HStack>
  );
};

export default Pagination;
