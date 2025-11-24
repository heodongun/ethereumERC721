// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title 간단한 ERC-721 예제 컨트랙트 (MyNft)
/// @notice 배포 시 배포자에게 tokenId 1을 자동 민팅하고, 오너만 추가 민팅 가능
contract MyNft is ERC721, Ownable {
    // 다음으로 발행될 토큰 ID (2부터 시작)
    uint256 private _nextTokenId = 2;

    // 메타데이터 조회 시 사용할 기본 URI
    string private _baseTokenURI;

    constructor() ERC721("My NFT", "MYNFT") Ownable(msg.sender) {
        // 컨트랙트 배포자에게 tokenId 1을 자동으로 민팅
        _safeMint(msg.sender, 1);
    }

    /// @notice 오너만 호출 가능한 민팅 함수
    /// @param to 새 NFT를 받을 주소
    function mint(address to) external onlyOwner {
        uint256 currentTokenId = _nextTokenId;
        _safeMint(to, currentTokenId);
        _nextTokenId++;
    }

    /// @notice 메타데이터 기본 URI를 설정 (선택 기능)
    /// @param newBaseURI 예: "https://example.com/metadata/"
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    /// @dev ERC721의 _baseURI를 오버라이드하여 저장된 URI를 반환
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
