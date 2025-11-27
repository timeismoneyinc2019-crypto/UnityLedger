const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UPXToken", function () {
  let upxToken;
  let owner;
  let addr1;
  let addr2;

  const INITIAL_SUPPLY = ethers.parseEther("100000000");
  const MAX_SUPPLY = ethers.parseEther("1000000000");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const UPXTokenFactory = await ethers.getContractFactory("UPXToken");
    upxToken = await UPXTokenFactory.deploy();
    await upxToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await upxToken.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await upxToken.name()).to.equal("UnityPay Token");
      expect(await upxToken.symbol()).to.equal("UPX");
    });

    it("Should mint initial supply to owner", async function () {
      expect(await upxToken.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
    });

    it("Should have correct total supply", async function () {
      expect(await upxToken.totalSupply()).to.equal(INITIAL_SUPPLY);
    });

    it("Should have correct max supply constant", async function () {
      expect(await upxToken.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await upxToken.mint(addr1.address, mintAmount);
      expect(await upxToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should emit TokensMinted event", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(upxToken.mint(addr1.address, mintAmount))
        .to.emit(upxToken, "TokensMinted")
        .withArgs(addr1.address, mintAmount);
    });

    it("Should not allow non-owner to mint", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(
        upxToken.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWithCustomError(upxToken, "OwnableUnauthorizedAccount");
    });

    it("Should not exceed max supply", async function () {
      const excessAmount = MAX_SUPPLY - INITIAL_SUPPLY + ethers.parseEther("1");
      await expect(
        upxToken.mint(addr1.address, excessAmount)
      ).to.be.revertedWith("UPX: Max supply exceeded");
    });

    it("Should return correct mintable supply", async function () {
      expect(await upxToken.mintableSupply()).to.equal(MAX_SUPPLY - INITIAL_SUPPLY);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseEther("100");
      await upxToken.transfer(addr1.address, transferAmount);
      expect(await upxToken.balanceOf(addr1.address)).to.equal(transferAmount);
    });

    it("Should update balances after transfers", async function () {
      const transferAmount = ethers.parseEther("100");
      const initialOwnerBalance = await upxToken.balanceOf(owner.address);
      
      await upxToken.transfer(addr1.address, transferAmount);
      await upxToken.connect(addr1).transfer(addr2.address, transferAmount);
      
      expect(await upxToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance - transferAmount
      );
      expect(await upxToken.balanceOf(addr2.address)).to.equal(transferAmount);
    });
  });

  describe("Burning", function () {
    it("Should allow token holders to burn their tokens", async function () {
      const burnAmount = ethers.parseEther("1000");
      const initialBalance = await upxToken.balanceOf(owner.address);
      
      await upxToken.burn(burnAmount);
      
      expect(await upxToken.balanceOf(owner.address)).to.equal(
        initialBalance - burnAmount
      );
    });

    it("Should emit TokensBurned event", async function () {
      const burnAmount = ethers.parseEther("1000");
      await expect(upxToken.burn(burnAmount))
        .to.emit(upxToken, "TokensBurned")
        .withArgs(owner.address, burnAmount);
    });

    it("Should reduce total supply when burning", async function () {
      const burnAmount = ethers.parseEther("1000");
      const initialSupply = await upxToken.totalSupply();
      
      await upxToken.burn(burnAmount);
      
      expect(await upxToken.totalSupply()).to.equal(initialSupply - burnAmount);
    });
  });

  describe("Pausable", function () {
    it("Should allow owner to pause", async function () {
      await upxToken.pause();
      expect(await upxToken.paused()).to.be.true;
    });

    it("Should allow owner to unpause", async function () {
      await upxToken.pause();
      await upxToken.unpause();
      expect(await upxToken.paused()).to.be.false;
    });

    it("Should block transfers when paused", async function () {
      await upxToken.pause();
      await expect(
        upxToken.transfer(addr1.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(upxToken, "EnforcedPause");
    });

    it("Should not allow non-owner to pause", async function () {
      await expect(
        upxToken.connect(addr1).pause()
      ).to.be.revertedWithCustomError(upxToken, "OwnableUnauthorizedAccount");
    });
  });

  describe("Approval", function () {
    it("Should approve tokens for delegated transfer", async function () {
      const approveAmount = ethers.parseEther("1000");
      await upxToken.approve(addr1.address, approveAmount);
      expect(await upxToken.allowance(owner.address, addr1.address)).to.equal(
        approveAmount
      );
    });

    it("Should allow transferFrom after approval", async function () {
      const approveAmount = ethers.parseEther("1000");
      await upxToken.approve(addr1.address, approveAmount);
      
      await upxToken.connect(addr1).transferFrom(
        owner.address,
        addr2.address,
        approveAmount
      );
      
      expect(await upxToken.balanceOf(addr2.address)).to.equal(approveAmount);
    });
  });
});
