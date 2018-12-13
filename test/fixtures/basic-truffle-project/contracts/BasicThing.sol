pragma solidity ^0.4.23;

contract BasicThing {
    uint public someStuff;

    function checkTheThing() public view returns (bytes32) {
        return keccak256(abi.encodePacked(someStuff));
    }

    function addSomeStuff() public {
        someStuff++;
    }

    function setSomeStuff(uint _someStuff) public {
        someStuff = _someStuff;
    }   
}
