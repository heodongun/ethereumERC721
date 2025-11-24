import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { DongunCoin } from "../typechain-types";

describe("DongunCoin", function () {
    let dongunCoin: DongunCoin;
    let owner: Signer;
    let addr1: Signer;
    let addr2: Signer;
    const sampleURI = "ipfs://Qm...";
    const newURI = "https://example.com/new_metadata.json";

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const DongunCoinFactory = await ethers.getContractFactory("DongunCoin");
        dongunCoin = await DongunCoinFactory.deploy();
        await dongunCoin.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the correct name and symbol", async function () {
            expect(await dongunCoin.name()).to.equal("dongunCoin");
            expect(await dongunCoin.symbol()).to.equal("DGC");
        });
    });

    describe("Minting Cards", function () {
        it("Should allow the owner to mint a card", async function () {
            const addr1Address = await addr1.getAddress();
            const tx = await dongunCoin.connect(owner).mintCard(addr1Address, sampleURI);

            // 이벤트 검증
            await expect(tx)
                .to.emit(dongunCoin, "CardMinted")
                .withArgs(addr1Address, 1, sampleURI);

            expect(await dongunCoin.ownerOf(1)).to.equal(addr1Address);
            expect(await dongunCoin.tokenURI(1)).to.equal(sampleURI);
        });

        it("Should not allow non-owners to mint a card", async function () {
            const addr1Address = await addr1.getAddress();
            await expect(dongunCoin.connect(addr1).mintCard(addr1Address, sampleURI))
                .to.be.revertedWithCustomError(dongunCoin, "OwnableUnauthorizedAccount");
        });

        it("Should increment tokenId for each minted card", async function () {
            const addr1Address = await addr1.getAddress();
            const addr2Address = await addr2.getAddress();

            await dongunCoin.connect(owner).mintCard(addr1Address, "uri1");
            expect(await dongunCoin.ownerOf(1)).to.equal(addr1Address);

            await dongunCoin.connect(owner).mintCard(addr2Address, "uri2");
            expect(await dongunCoin.ownerOf(2)).to.equal(addr2Address);
        });
    });

    describe("Updating Card URI", function () {
        beforeEach(async function () {
            // 테스트를 위해 addr1에게 토큰 ID 1을 민팅합니다.
            const addr1Address = await addr1.getAddress();
            await dongunCoin.connect(owner).mintCard(addr1Address, sampleURI);
        });

        it("Should allow the token owner to update the URI", async function () {
            const tx = await dongunCoin.connect(addr1).updateCardURI(1, newURI);

            // 이벤트 검증
            await expect(tx)
                .to.emit(dongunCoin, "CardUpdated")
                .withArgs(1, newURI);

            expect(await dongunCoin.tokenURI(1)).to.equal(newURI);
        });

        it("Should not allow a non-owner to update the URI", async function () {
            // addr2가 addr1의 토큰 URI를 변경하려고 시도합니다.
            await expect(dongunCoin.connect(addr2).updateCardURI(1, newURI))
                .to.be.revertedWith("Not the owner");
        });
    });
});
