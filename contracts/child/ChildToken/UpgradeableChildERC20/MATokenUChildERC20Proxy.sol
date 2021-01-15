pragma solidity 0.6.6;

import {UpgradableProxy} from "../../../common/Proxy/UpgradableProxy.sol";

contract MATokenUChildERC20Proxy is UpgradableProxy {
    constructor()
        public
        UpgradableProxy(address(0))
    {}
}
