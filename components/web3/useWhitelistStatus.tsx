import { useState, useEffect } from 'react';
import { MerkleTree } from 'merkletreejs';
import { keccak256, encodePacked } from 'viem';
import whitelistAddresses from './whitelistAddresses'




export const useWhitelistStatus = (address: string | undefined) => {
    const [isWhitelisted, setIsWhitelisted] = useState(false);
    const [merkleProof, setMerkleProof] = useState<`0x${string}`[]>([]);
    const [merkleRoot, setMerkleRoot] = useState<string>('');

    useEffect(() => {
        const leafNodes = whitelistAddresses.map(addr =>
            keccak256(encodePacked(['address'], [addr.toLowerCase() as `0x${string}`]))
        );
        const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
        const rootHash = merkleTree.getHexRoot();

        setMerkleRoot(rootHash);
        console.log('Merkle Root:', rootHash);

        if (!address) {
            setIsWhitelisted(false);
            setMerkleProof([]);
            return;
        }

        const claimingAddress = keccak256(encodePacked(['address'], [address.toLowerCase() as `0x${string}`]));
        const hexProof = merkleTree.getHexProof(claimingAddress);
        const verified = merkleTree.verify(hexProof, claimingAddress, rootHash);

        setIsWhitelisted(verified);
        setMerkleProof(hexProof as `0x${string}`[]);

        console.log('Address:', address);
        console.log('Is Whitelisted:', verified);
        console.log('Merkle Proof:', hexProof);
    }, [address]);

    return { isWhitelisted, merkleProof, merkleRoot };
};

export default useWhitelistStatus;