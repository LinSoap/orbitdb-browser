import { useIpfs } from "../../hooks/useIpfs";

const AddDatabase = () => {
  const ipfs = useIpfs();

  return (
    <div>
      {ipfs ? (
        <div>IPFS Service Initialized</div>
      ) : (
        <div>Loading IPFS Service...</div>
      )}
    </div>
  );
};

export default AddDatabase;
