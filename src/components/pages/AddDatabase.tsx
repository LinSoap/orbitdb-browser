import { useIpfs } from "../../hooks/useIpfs";
import { useOrbitDB } from "../../hooks/useOrbitDB";

const AddDatabase = () => {
  const ipfs = useIpfs();
  const orbitDB = useOrbitDB("LinSoap");
  console.log(orbitDB);
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
