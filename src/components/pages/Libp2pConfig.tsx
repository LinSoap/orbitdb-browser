import { useIpfs } from "../../context/IpfsProvider";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";
import {
  HStack,
  VStack,
  IconButton,
  Button,
  Box,
  Text,
  useColorMode,
  useTheme,
  Card,
  Center,
} from "@chakra-ui/react";
import MainTitle from "../common/MainTitle";
import StyledInput from "../common/StyledInput";

const Libp2pConfig = () => {
  const {
    topics,
    setTopics,
    stuns,
    setStuns,
    bootstrapsList,
    setBootstrapsList,
    updateLibp2pOptions,
  } = useIpfs();
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const bgColorMain = theme.colors.custom.bgColorMain[colorMode];
  const bgButton = theme.colors.custom.bgButton[colorMode];

  const handleTopicChange = (index: number, newValue: string) => {
    setTopics((prevTopics: string[]) => {
      const updatedTopics = [...prevTopics];
      updatedTopics[index] = newValue;
      return updatedTopics;
    });
  };
  const handleStunChange = (index: number, newValue: string) => {
    setStuns((prevStuns: string[]) => {
      const updatedStuns = [...prevStuns];
      updatedStuns[index] = newValue;
      return updatedStuns;
    });
  };
  const handleBootstrapsChange = (index: number, newValue: string) => {
    setBootstrapsList((prevBootstraps: string[]) => {
      const updatedBootstraps = [...prevBootstraps];
      updatedBootstraps[index] = newValue;
      return updatedBootstraps;
    });
  };
  const handleBootstrapsDelete = (index: number) => {
    setBootstrapsList((prevBootstraps: string[]) => {
      if (prevBootstraps.length <= 1) {
        return prevBootstraps;
      }
      return prevBootstraps.filter((_, i) => i !== index);
    });
  };

  return (
    <Card bg={bgColorMain} h={"full"}>
      <MainTitle title="Libp2p Configuration" />
      <Box p={4}>
        <Text fontSize="lg" mb={2}>
          PubSub Topics:
        </Text>
        <VStack spacing={4} align="stretch">
          {topics.map((topic: string, index: number) => (
            <HStack key={index}>
              <StyledInput
                type="text"
                placeholder="PubSub Topic"
                value={topic}
                onChange={(e) => handleTopicChange(index, e.target.value)}
              />
              <IconButton
                aria-label="drop"
                bg={bgButton}
                icon={<CloseIcon />}
                onClick={() =>
                  setTopics((prevTopics: string[]) =>
                    prevTopics.filter((_, i) => i !== index)
                  )
                }
              />
            </HStack>
          ))}
          <IconButton
            aria-label="add"
            bg={bgButton}
            icon={<AddIcon />}
            onClick={() =>
              setTopics((prevTopics: string[]) => [...prevTopics, ""])
            }
          />
        </VStack>
        <Text fontSize="lg" mt={4} mb={2}>
          Stun Servers:
        </Text>
        <VStack spacing={4} align="stretch">
          {stuns.map((stun: string, index: number) => (
            <HStack key={index}>
              <StyledInput
                type="text"
                placeholder="Stun Server"
                value={stun}
                onChange={(e) => handleStunChange(index, e.target.value)}
              />
              <IconButton
                aria-label="drop"
                bg={bgButton}
                icon={<CloseIcon />}
                onClick={() =>
                  setStuns((prevStuns: string[]) =>
                    prevStuns.filter((_, i) => i !== index)
                  )
                }
              />
            </HStack>
          ))}
          <IconButton
            aria-label="add"
            bg={bgButton}
            icon={<AddIcon />}
            onClick={() =>
              setStuns((prevStuns: string[]) => [...prevStuns, ""])
            }
          />
        </VStack>
        <Text fontSize="lg" mt={4} mb={2}>
          Relay Servers:
        </Text>
        <VStack spacing={4} align="stretch">
          {bootstrapsList.map((bootstraps: string, index: number) => (
            <HStack key={index}>
              <StyledInput
                type="text"
                placeholder="Relay Server multiaddr"
                value={bootstraps}
                onChange={(e) => handleBootstrapsChange(index, e.target.value)}
              />
              <IconButton
                aria-label="drop"
                bg={bgButton}
                icon={<CloseIcon />}
                onClick={() => handleBootstrapsDelete(index)}
              />
            </HStack>
          ))}
          <IconButton
            aria-label="add"
            bg={bgButton}
            icon={<AddIcon />}
            onClick={() =>
              setBootstrapsList((prevBootstraps: string[]) => [
                ...prevBootstraps,
                "",
              ])
            }
          />
          <Center>
            <Button
              w={"auto"}
              bg={bgButton}
              onClick={() => updateLibp2pOptions()}
            >
              Save Libp2p Options
            </Button>
          </Center>
        </VStack>
      </Box>
    </Card>
  );
};

export default Libp2pConfig;
