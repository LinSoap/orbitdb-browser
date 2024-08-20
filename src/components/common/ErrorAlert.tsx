import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";

interface ErrorItem {
  id: string;
  message: string;
}

interface ErrorAlertProps {
  errors: ErrorItem[];
  onClose: (id: string) => void;
  autoCloseDuration?: number;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  errors,
  onClose,
  autoCloseDuration = 5000,
}) => {
  useEffect(() => {
    errors.forEach((error) => {
      const timer = setTimeout(() => {
        onClose(error.id);
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    });
  }, [errors, onClose, autoCloseDuration]);

  if (errors.length === 0) return null;

  return (
    <Box
      position="fixed"
      bottom={4}
      right={4}
      zIndex={9999}
      maxWidth="400px"
      width="100%"
    >
      <VStack spacing={2} align="stretch">
        {errors.map((error) => (
          <Alert key={error.id} status="error" borderRadius="md" boxShadow="lg">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle mr={2}>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Box>
            <CloseButton
              position="absolute"
              right={2}
              top={2}
              onClick={() => onClose(error.id)}
            />
          </Alert>
        ))}
      </VStack>
    </Box>
  );
};

export default ErrorAlert;
