pragma solidity 0.6.6;

import {IStateSender} from "../StateSender/IStateSender.sol";
import {ICheckpointManager} from "../ICheckpointManager.sol";

abstract contract ATokenRootChainManagerStorage {    
    mapping(address => address) public rootToChildToken;
    mapping(address => address) public childToRootToken;    
    mapping(bytes32 => bool) public processedExits;
    IStateSender internal _stateSender;
    ICheckpointManager internal _checkpointManager;
    address public childChainManagerAddress;
    bytes32 public childTokenBytecodeHash;
}
