pragma solidity ^0.4.23;

contract BasicThing {
    uint internal someStuff;
    uint public setSomeStuff;

    function checkTheThing() public view returns (bytes32) {
        return keccak256(abi.encodePacked(someStuff));
    }

    function setSomeStuff(uint _) {

    }
}
