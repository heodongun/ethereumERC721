const DONGUN_COIN_ABI = [
    "function mintCard(address to, string cardURI) public returns (uint256)",
    "function updateCardURI(uint256 tokenId, string newCardURI) public",
    "function ownerOf(uint256 tokenId) public view returns (address)",
    "function tokenURI(uint256 tokenId) public view returns (string)"
];
