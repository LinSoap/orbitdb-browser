import { CopyIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

const CopyIconButton = ({
  ariaLabel,
  data,
}: {
  ariaLabel: string;
  data: string;
}) => {
  return (
    <IconButton
      aria-label={ariaLabel}
      icon={<CopyIcon />}
      size="sm"
      onClick={() => navigator.clipboard.writeText(data)}
    />
  );
};

export default CopyIconButton;
