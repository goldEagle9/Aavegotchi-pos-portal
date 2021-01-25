pragma solidity 0.6.6;

import {IChildToken} from "../ChildToken/IChildToken.sol";
import {IStateReceiver} from "../IStateReceiver.sol";
import {MATokenUChildERC20Proxy} from "../ChildToken/UpgradeableChildERC20/MATokenUChildERC20Proxy.sol";
import {UChildERC20} from "../ChildToken/UpgradeableChildERC20/UChildERC20.sol";

struct AppStorage {
    mapping(address => address) rootToChildToken;
    mapping(address => address) childToRootToken;
    bool inited;
    address childTokenImplementation;
    address mapper;
    address stateReceiver;
    address owner;
}

contract ATokenChildChainManager is IStateReceiver {
    AppStorage s;
    event TokenMapped(address indexed rootToken, address indexed childToken);
    bytes32 public constant DEPOSIT = keccak256("DEPOSIT");
    bytes32 public constant MAP_TOKEN = keccak256("MAP_TOKEN");

    function rootToChildToken(address _rootToken) external view returns (address) {
        return s.rootToChildToken[_rootToken];
    }

    function childToRootToken(address _childToken) external view returns (address) {
        return s.childToRootToken[_childToken];
    }

    function childTokenImplementation() external view returns (address) {
        return s.childTokenImplementation;
    }

    function stateReceiver() external view returns (address) {
        return s.stateReceiver;
    }

    function owner() external view returns (address) {
        return s.owner;
    }

    modifier onlyOwner() {
        require(msg.sender == s.owner, "Is not owner");
        _;
    }

    modifier onlyStateReceiver() {
        require(msg.sender == s.stateReceiver, "Is not state receiver");
        _;
    }

    event SetOwner(address indexed _previousOwner, address indexed _newOwner);

    function setOwner(address _newOwner) external onlyOwner {
        emit SetOwner(s.owner, _newOwner);
        s.owner = _newOwner;
    }

    event SetStateReceiver(address indexed _previousStateReceiver, address indexed _newStateReceiver);

    function setStateReceiver(address _newStateReceiver) external onlyOwner {
        emit SetStateReceiver(s.stateReceiver, _newStateReceiver);
        s.stateReceiver = _newStateReceiver;
    }

    function initialize(
        address _owner,
        address _stateReceiver,
        address _childTokenImplementation
    ) external {
        require(!s.inited, "already inited");
        s.inited = true;
        s.owner = _owner;
        s.stateReceiver = _stateReceiver; //0x0000000000000000000000000000000000001001
        s.childTokenImplementation = _childTokenImplementation;
    }

    function setChildTokenImplementation(address _childTokenImplementation) external onlyOwner {
        s.childTokenImplementation = _childTokenImplementation;
    }

    /**
     * @notice Receive state sync data from root chain, only callable by state syncer
     * @dev state syncing mechanism is used for both depositing tokens and mapping them
     * @param data bytes data from RootChainManager contract
     * `data` is made up of bytes32 `syncType` and bytes `syncData`
     * `syncType` determines if it is deposit or token mapping
     * in case of token mapping, `syncData` is encoded address `rootToken`, address `childToken` and bytes32 `tokenType`
     * in case of deposit, `syncData` is encoded address `user`, address `rootToken` and bytes `depositData`
     * `depositData` is token specific data (amount in case of ERC20). It is passed as is to child token
     */
    function onStateReceive(uint256, bytes calldata data) external override onlyStateReceiver {
        (bytes32 syncType, bytes memory syncData) = abi.decode(data, (bytes32, bytes));

        if (syncType == DEPOSIT) {
            _syncDeposit(syncData);
        } else if (syncType == MAP_TOKEN) {
            _mapToken(syncData);
        } else {
            revert("ChildChainManager: INVALID_SYNC_TYPE");
        }
    }

    function _syncDeposit(bytes memory syncData) private {
        (address user, address rootToken, bytes memory depositData) = abi.decode(syncData, (address, address, bytes));
        address childTokenAddress = s.rootToChildToken[rootToken];
        require(childTokenAddress != address(0x0), "ChildChainManager: TOKEN_NOT_MAPPED");
        IChildToken childTokenContract = IChildToken(childTokenAddress);
        childTokenContract.deposit(user, depositData);
    }

    function childTokenBytecodeHash() external pure returns (bytes32) {
        return keccak256(type(MATokenUChildERC20Proxy).creationCode);
    }

    function _mapToken(bytes memory syncData) internal {
        (address rootToken, string memory name, string memory symbol, uint8 decimals) = abi.decode(syncData, (address, string, string, uint8));

        MATokenUChildERC20Proxy childTokenContract = new MATokenUChildERC20Proxy{salt: bytes32(bytes20(rootToken))}();
        childTokenContract.updateImplementation(s.childTokenImplementation);
        childTokenContract.transferProxyOwnership(s.owner);
        UChildERC20(address(childTokenContract)).initialize(name, symbol, decimals, address(this));

        address childToken = address(childTokenContract);
        address oldChildToken = s.rootToChildToken[rootToken];
        address oldRootToken = s.childToRootToken[childToken];
        require(childToken != oldChildToken, "Can not remap to same child token");

        if (s.rootToChildToken[oldRootToken] != address(0)) {
            s.rootToChildToken[oldRootToken] = address(0);
        }

        if (s.childToRootToken[oldChildToken] != address(0)) {
            s.childToRootToken[oldChildToken] = address(0);
        }

        s.rootToChildToken[rootToken] = childToken;
        s.childToRootToken[childToken] = rootToken;

        emit TokenMapped(rootToken, childToken);
    }
}
