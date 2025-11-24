import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { MyNft } from "../typechain-types"; // TypeChain으로 생성된 타입을 가져옵니다.

describe("MyNft", function () {
    let myNft: MyNft;
    let owner: Signer;
    let addr1: Signer;
    let addr2: Signer;

    // 테스트 실행 전에 컨트랙트를 배포합니다.
    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const MyNftFactory = await ethers.getContractFactory("MyNft");
        myNft = await MyNftFactory.deploy();
        await myNft.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should mint tokenId 1 to the deployer", async function () {
            const ownerAddress = await owner.getAddress();
            expect(await myNft.ownerOf(1)).to.equal(ownerAddress);
        });

        it("Should set the correct name and symbol", async function () {
            expect(await myNft.name()).to.equal("My NFT");
            expect(await myNft.symbol()).to.equal("MYNFT");
        });
    });

    describe("Minting", function () {
        it("Should allow the owner to mint a new token and emit a Mint event", async function () {
            const addr1Address = await addr1.getAddress();
            await expect(myNft.connect(owner).mint(addr1Address))
                .to.emit(myNft, "Mint")
                .withArgs(addr1Address, 2); // constructor에서 1이 민팅되었으므로 다음은 2

            expect(await myNft.ownerOf(2)).to.equal(addr1Address);
        });

        it("Should not allow non-owners to mint", async function () {
            const addr1Address = await addr1.getAddress();
            await expect(myNft.connect(addr1).mint(addr1Address)).to.be.revertedWithCustomError(myNft, "OwnableUnauthorizedAccount");
        });

        it("Should increment the token ID after minting", async function () {
            const addr1Address = await addr1.getAddress();
            const addr2Address = await addr2.getAddress();

            // tokenId 2 민팅
            await myNft.connect(owner).mint(addr1Address);
            expect(await myNft.ownerOf(2)).to.equal(addr1Address);

            // tokenId 3 민팅
            await myNft.connect(owner).mint(addr2Address);
            expect(await myNft.ownerOf(3)).to.equal(addr2Address);
        });
    });

    describe("Base URI", function () {
        it("Should allow the owner to set the base URI", async function () {
            const newURI = "https://example.com/api/token/";
            await myNft.connect(owner).setBaseURI(newURI);

            // _baseURI()는 internal이라 직접 호출할 수 없지만,
            // tokenURI를 통해 간접적으로 확인할 수 있습니다.
            // 먼저 토큰을 하나 민팅해야 tokenURI를 호출할 수 있습니다.
            const addr1Address = await addr1.getAddress();
            await myNft.connect(owner).mint(addr1Address); // tokenId 2 민팅

            expect(await myNft.tokenURI(2)).to.equal(newURI + "2");
        });

        it("Should not allow non-owners to set the base URI", async function () {
            const newURI = "https://example.com/api/token/";
            await expect(myNft.connect(addr1).setBaseURI(newURI)).to.be.revertedWithCustomError(myNft, "OwnableUnauthorizedAccount");
        });
    });
});
