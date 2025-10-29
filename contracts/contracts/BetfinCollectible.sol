// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BetfinCollectible is ERC721Enumerable, Ownable {
    using Strings for uint256;

    struct Meta {
        string name;
        string description;
        uint8 rarity;
        string tokenURI;
    }

    uint256 public nextTokenId = 1;
    mapping(uint256 => Meta) private _metadata;

    event Minted(address indexed to, uint256 indexed tokenId, string name, uint8 rarity);

    constructor() ERC721("BetfinCollectible", "BETNFT") Ownable(msg.sender) {}

    function safeMint(
        string calldata _name,
        string calldata _description,
        uint8 _rarity,
        string calldata _tokenURI
    ) external {
        require(bytes(_name).length > 0, "Name required!!!");
        require(_rarity > 0 && _rarity <= 100, "Invalid rarity!!!");

        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);

        _metadata[tokenId] = Meta({
            name: _name,
            description: _description,
            rarity: _rarity,
            tokenURI: _tokenURI
        });

        emit Minted(msg.sender, tokenId, _name, _rarity);
    }

    function getMetadata(uint256 tokenId) external view returns (Meta memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token!!!");
        return _metadata[tokenId];
    }

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory ids = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            ids[i] = tokenOfOwnerByIndex(owner, i);
        }
        return ids;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        string memory uri = _metadata[tokenId].tokenURI;
        return bytes(uri).length > 0 ? uri : string(abi.encodePacked("https://nft.betfin.io/", tokenId.toString(), ".json"));
    }
}
