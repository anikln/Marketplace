pragma solidity >=0.4.22 <0.6.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/// @title A registry contract that stores the latest version of a smart
///  contract by providing its address
/// @author Athina Styliani Kleinaki
/// @notice You can use this contract to get the address of the latest version
///  of a contract
/// @dev The contracts whose addresses are provided through this contract,
///  should implement an emergency pattern, like a circuitBreaker, to protect
///  user from interacting with an older version. Also in this way, the data
///  stored in an old version will still be accessible, so the latest contract
///  versions could interact with the older versions, if needed, to fetch data
contract Registry is Ownable {

    address public currentVersion;
    address[] public previousVersions;

    event SetLatestVersion(
        address owner,
        address oldVersion,
        address newVersion
    );

    /// @notice Sets the current address of the latest version of the contract
    /// @dev Only the store owner, who is still an active owner, can add a
    ///  new hash value. It is required that the referring store is not a
    ///  deleted one. We also check if the  given index corresponds to the
    ///  store name that is given, in order to avoid storing a hash value to
    ///  a store that doesn't exist. The index of the store is the index of the
    ///  store in the array plus one because the storeInfo mapping stores the
    ///  first element in index 1
    /// @param _latestVersion The address of the latest version of the contract
    function setLatestVersionRegistry(address _latestVersion) public onlyOwner {
        require(_latestVersion != address(0));
        require(currentVersion != _latestVersion, "Already current version");
        previousVersions.push(currentVersion);
        emit SetLatestVersion(msg.sender, currentVersion, _latestVersion);
        currentVersion = _latestVersion;
    }

    /// @notice Get the number of the old versions of the contract that have
    ///  have been added
    /// @dev The returned value can be used to access all elements stored in
    ///  the public array previousVersions
    /// @return the number that shows the length of the array that stores the
    ///  the addresses of the previous contractss added
    function returnLengthPreviousVersionsArray()
        view public
        returns(uint _length)
    {
        return previousVersions.length;
    }

}
