#// SPDX-License-Identifier: MIT
pragma solidity    0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title UPXToken
 * @dev UnityPay 2045 Token - The governance and utility token for the UnityPay ecosystem
 * 
 * Features:
 * - ERC20 standard token
 * - Burnable: Tokens can be burned to reduce supply
 * - Pausable: Token transfers can be paused in emergencies
 * - Ownable: Admin functions restricted to owner
 * - Permit: Gasless approvals via EIP-2612
 * 
 * Tagline: One People. One Pay. One Future.
 */
contract UPXToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ERC20Permit {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100 million tokens

    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);

    /**
     * @dev Constructor that mints initial supply to deployer
     */
    constructor() 
        ERC20("UnityPay Token", "UPX") 
        Ownable(msg.sender)
        ERC20Permit("UnityPay Token")
    {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to receive minted tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "UPX: Max supply exceeded");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Pause all token transfers (only owner)
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause token transfers (only owner)
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Override burn to emit custom event
     */
    function burn(uint256 amount) public override {
        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Returns the remaining tokens that can be minted
     */
    function mintableSupply() public view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }

    /**
     * @dev Hook that is called before any token transfer
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
   
}
