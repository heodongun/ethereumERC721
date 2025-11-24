import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("배포자:", deployer.address);

  const DongunCoin = await ethers.getContractFactory("DongunCoin");
  const dongunCoin = await DongunCoin.deploy();
  await dongunCoin.waitForDeployment();

  const contractAddress = await dongunCoin.getAddress();
  console.log("DongunCoin 배포 완료:", contractAddress);

  // 예시: 배포자에게 기본 명함 NFT 1개 발행 (메타데이터는 data URI 예시)
  const sampleCardURI = `data:application/json,${encodeURIComponent(
    JSON.stringify({
      name: "dongunCoin | Business Card",
      description: "Default business card NFT for dongunCoin",
      image: "https://pbs.twimg.com/media/FrV6PijakAEExDY.png" // 기본 이미지 URL
    })
  )}`;

  const tx = await dongunCoin.mintCard(deployer.address, sampleCardURI);
  const receipt = await tx.wait();
  const tokenId = receipt?.logs
    .map((log) => {
      try {
        const parsed = dongunCoin.interface.parseLog(log);
        return parsed.name === "CardMinted" ? parsed.args.tokenId : null;
      } catch {
        return null;
      }
    })
    .find((id) => id !== null);

  console.log("샘플 명함 민팅 완료. tokenId:", tokenId?.toString() || "1");
  console.log("tokenURI:", await dongunCoin.tokenURI(1));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
