pragma solidity 0.6.6;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import {AccessControlMixin} from "../../common/AccessControlMixin.sol";
import {RLPReader} from "../../lib/RLPReader.sol";
import {ITokenPredicate} from "./ITokenPredicate.sol";
import {Initializable} from "../../common/Initializable.sol";

interface ILendingPool {
    function getReserveNormalizedIncome(address _asset) external view returns (uint256);
}

interface IAToken {
    function POOL() external returns(ILendingPool);
    function UNDERLYING_ASSET_ADDRESS() external returns(address);
}

contract ERC20Predicate is ITokenPredicate, AccessControlMixin, Initializable {
    using RLPReader for bytes;
    using RLPReader for RLPReader.RLPItem;
    using SafeERC20 for IERC20;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant TOKEN_TYPE = keccak256("ERC20");
    bytes32 public constant TRANSFER_EVENT_SIG = 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef;
    uint256 internal constant P27 = 1e27;
    uint256 internal constant HALF_P27 = P27 / 2;

    event LockedERC20(
        address indexed depositor,
        address indexed depositReceiver,
        address indexed rootToken,
        uint256 amount
    );

    constructor() public {}

    function initialize(address _owner) external initializer {
        _setupContractId("ERC20Predicate");
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
        _setupRole(MANAGER_ROLE, _owner);
    }

    /**
     * @notice Lock ERC20 tokens for deposit, callable only by manager
     * @param depositor Address who wants to deposit tokens
     * @param depositReceiver Address (address) who wants to receive tokens on child chain
     * @param rootToken Token which gets deposited
     * @param depositData ABI encoded amount
     */
    function lockTokens(
        address depositor,
        address depositReceiver,
        address rootToken,
        bytes calldata depositData
    )
        external
        override
        only(MANAGER_ROLE)
    {
        uint256 amount = abi.decode(depositData, (uint256));
        emit LockedERC20(depositor, depositReceiver, rootToken, amount);
        IERC20(rootToken).safeTransferFrom(depositor, address(this), amount);
    }

    /**
    * @dev Multiplies two 27 decimal percision values, rounding half up to the nearest decimal
    * @param a 27 decimal percision value
    * @param b 27 decimal percision value
    * @return The result of a*b, in 27 decimal percision value
    **/
    function p27Mul(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a * b;
        if(c == 0) {
            return 0;
        }
        require(b == c / a, "p27 multiplication overflow");
        c += HALF_P27;
        require(c >= HALF_P27, "p27 multiplication addition overflow");
        return c / P27;
    }

    /**
     * @notice Validates log signature, from and to address
     * then sends the correct amount to withdrawer
     * callable only by manager
     * @param rootToken Token which gets withdrawn
     * @param log Valid ERC20 burn log from child chain
     */
    function exitTokens(
        address,
        address rootToken,
        bytes memory log
    )
        public
        override
        only(MANAGER_ROLE)
    {
        RLPReader.RLPItem[] memory logRLPList = log.toRlpItem().toList();
        RLPReader.RLPItem[] memory logTopicRLPList = logRLPList[1].toList(); // topics

        require(
            bytes32(logTopicRLPList[0].toUint()) == TRANSFER_EVENT_SIG, // topic0 is event sig
            "ERC20Predicate: INVALID_SIGNATURE"
        );

        address withdrawer = address(logTopicRLPList[1].toUint()); // topic1 is from address

        require(
            address(logTopicRLPList[2].toUint()) == address(0), // topic2 is to address
            "ERC20Predicate: INVALID_RECEIVER"
        );
        uint256 maTokenValue = logRLPList[2].toUint(); // log data field
        ILendingPool pool = IAToken(rootToken).POOL();
        uint256 liquidityIndex = pool.getReserveNormalizedIncome(IAToken(rootToken).UNDERLYING_ASSET_ADDRESS());
        uint256 aTokenValue = p27Mul(maTokenValue, liquidityIndex);

        IERC20(rootToken).safeTransfer(
            withdrawer,
            aTokenValue
        );
    }
}
