// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title dongunCoin NFT (명함형 ERC-721)
/// @notice 메타데이터(명함 정보)가 담긴 URI를 토큰마다 저장하고, 소유자가 URI를 갱신할 수 있습니다.
contract DongunCoin is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    event CardMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event CardUpdated(uint256 indexed tokenId, string newTokenURI);

    constructor() ERC721("dongunCoin", "DGC") Ownable(msg.sender) {}

    /// @notice 명함 NFT를 발행 (컨트랙트 오너가 발행 권한을 가짐)
    /// @param to NFT를 받을 주소
    /// @param cardURI 메타데이터 URI(예: IPFS CID, HTTPS URL 등)
    function mintCard(address to, string calldata cardURI) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId;
        unchecked {
            _nextTokenId++;
        }

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, cardURI);

        emit CardMinted(to, tokenId, cardURI);
        return tokenId;
    }

    /// @notice 토큰 소유자 또는 승인받은 계정이 명함 정보를 업데이트
    /// @param tokenId 수정할 토큰 ID
    /// @param newCardURI 새 메타데이터 URI
    function updateCardURI(uint256 tokenId, string calldata newCardURI) external {
        require(_ownerOf(tokenId) == msg.sender, "Not the owner");
        _setTokenURI(tokenId, newCardURI);
        emit CardUpdated(tokenId, newCardURI);
    }
}
