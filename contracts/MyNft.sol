// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title 간단한 ERC-721 예제 컨트랙트 (MyNft)
/// @notice 배포 시 배포자에게 tokenId 1을 자동 민팅하고, 오너만 추가 민팅 가능
contract MyNft is ERC721, Ownable {
    // 다음으로 발행될 토큰 ID (1부터 시작)
    uint256 private _nextTokenId = 1;

    // 메타데이터 조회 시 사용할 기본 URI
    string private _baseTokenURI;

    event Mint(address indexed to, uint256 indexed tokenId);

    constructor() ERC721("My NFT", "MYNFT") Ownable(msg.sender) {
        // 컨트랙트 배포자에게 tokenId 1을 자동으로 민팅
        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);
        emit Mint(msg.sender, tokenId);
        unchecked {
            _nextTokenId++;
        }
    }

    /**
     * @dev 오너만 새로운 토큰을 민팅할 수 있습니다.
     * @notice 민팅 후 `Mint` 이벤트가 발생합니다.
     * @param to NFT를 받을 주소.
     */
    function mint(address to) external onlyOwner {
        uint256 tokenId = _nextTokenId;
        _safeMint(to, tokenId);
        emit Mint(to, tokenId);
        unchecked {
            _nextTokenId++;
        }
    }

    /**
     * @dev 오너만 메타데이터의 기본 URI를 설정할 수 있습니다.
     * @notice URI는 토큰 ID와 결합되어 최종 `tokenURI`를 구성합니다.
     * @param newBaseURI 새로운 기본 URI. 예: "https://example.com/api/token/"
     */
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    /// @dev ERC721의 _baseURI를 오버라이드하여 저장된 URI를 반환
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
