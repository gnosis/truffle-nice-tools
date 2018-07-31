pragma solidity ^0.4.23;

contract BasicThing {
    uint internal someStuff;

    function checkTheThing() public view returns (bytes32) {
        return keccak256(abi.encodePacked(someStuff));
    }

    function doTheThing() public {
        someStuff++;
    }
}
