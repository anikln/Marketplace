pragma solidity >=0.4.22 <0.6.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/// @title A smart contract for an Online Marketplace
/// @author Athina Styliani Kleinaki
/// @notice You can use this contract for a Decentralizes Online Marketplace
/// @dev All function calls are currently implemented without side effects.
///  The indexes we provide for the store and item in contract's functions
///  are their indexes in the arrays where they are stored, plus one because
///  the mappings stores the first element at index 1
contract Market is Ownable {
    using SafeMath for uint256;

    struct Owner{
        bool isActive;
        bytes32[] storeNames;
        mapping (uint => Store) storeInfo;
    }

    struct Store{
        bytes32[] itemName;
        bytes32 name;
        string ipfsHash;
        uint balance;
        mapping (uint => Item) itemInfo;
    }

    struct Item{
        bytes32 name;
        string description;
        uint quantity;
        uint price;
        uint inquant;
    }

    address[] public adminsArray;
    address[] public storeOwners;
    mapping (address => bool) public admins;
    mapping (address => Owner) public storeOwner;
    mapping (address => uint) public refundBalance;
    mapping (address => uint) public reservedBalance;
    bool public contractPaused = false;

    modifier isPaused() {
        require(contractPaused == false);
        _;
    }

    modifier onlyManagerAdmins() {
        require(owner() == msg.sender || admins[msg.sender] == true);
        _;
    }

    modifier onlyStoreOwners() {
        require(storeOwner[msg.sender].isActive == true);
        _;
    }

    modifier onlyStoreOwnersOfSpecificStore(bytes32 _storeName, uint _index) {
      require(storeOwner[msg.sender].storeInfo[_index].name == _storeName);
        _;
    }

    event AddedAdmin(address newAdmin);
    event RemovedAdmin(address removedAdmin);
    event AddedOwner(address newOwner, address admin);
    event RemovedOwner(address removedOwner, address admin);
    event AddedNewStore(address owner, bytes32 storeName);
    event RemovedStore(address owner, bytes32 removedStoreName);
    event AddedNewStoreItem(address owner, uint storeIndex, bytes32 itemName);
    event RemovedStoreItem(address owner, uint storeIndex, bytes32 removedStoreItem);
    event ModifyStore(address storeOwner, bytes32 oldName, bytes32 newName);
    event ModifyItemName(address storeOwner, bytes32 oldName, bytes32 newName, uint index);
    event ModifyItemDescr(address storeOwner, string oldDescr, string newDesc, uint index);
    event ModifyItemQuantity(address storeOwner, uint oldQuant, uint newQuant, uint index);
    event ModifyItemPrice(address storeOwner, uint oldPrice, uint newPrice, uint index);
    event LogBuyItem(
        address buyer,
        address storeOwner,
        bytes32 itemName,
        uint numberItems,
        uint storeIndex,
        uint itemIndex
    );
    event Withdraw(address owner, bytes32 storeName, uint amount);
    event PurchaseFulfillment(
        address storeOwner,
        address byer,
        uint storeIndex,
        uint itemIndex,
        uint amount
    );
    event Refund(address customer, uint value);
    event Paused(bool paused);

    /// @notice If the contract is paused, stop the modified function
    /// @dev Attach this modifier to all public functions
    function circuitBreaker() public onlyOwner {
        if(contractPaused == false){
          contractPaused = true;
        }
        else {
          contractPaused = false;
        }
        emit Paused(!contractPaused);
    }

    /// @notice Add new admin to the marketplace
    /// @dev The array is used to retrieve all admins
    /// @param _newAdmin The address of the admin
    function addAdmin(address _newAdmin) public isPaused onlyOwner {
        require(_newAdmin != address(0));
        admins[_newAdmin] = true;
        adminsArray.push(_newAdmin);
        emit AddedAdmin(_newAdmin);
    }

    /// @notice Remove an admin from the marketplace
    /// @param _toRemove The address of the admin
    function removeAdmin(address _toRemove) public isPaused onlyOwner {
        require(_toRemove != address(0));
        admins[_toRemove] = false;
        emit RemovedAdmin(_toRemove);
    }

    /// @notice Add a new store Owner
    /// @dev The array is used to retrieve all owners
    /// @param _newOwner The address of the owner that will be added
    function addOwner(address _newOwner) public isPaused onlyManagerAdmins {
        require(_newOwner != address(0));
        storeOwner[_newOwner].isActive = true;
        storeOwners.push(_newOwner);
        emit AddedOwner(_newOwner, msg.sender);
    }

    /// @notice Remove an Owner
    /// @param _toRemove The address of the owner we want to deactivate
    function removeOwner(address _toRemove) public isPaused onlyManagerAdmins {
        require(_toRemove != address(0));
        storeOwner[_toRemove].isActive = false;
        emit RemovedOwner(_toRemove, msg.sender);
    }

    /// @notice Adds new store to the marketplace
    /// @param _storeName The name of the store
    function addNewStore(bytes32 _storeName) public isPaused onlyStoreOwners {
        require(_storeName[0] != 0);
        storeOwner[msg.sender].storeInfo[storeOwner[msg.sender].storeNames.length+1].name = _storeName;
        storeOwner[msg.sender].storeNames.push(_storeName);
        emit AddedNewStore(msg.sender, _storeName);
    }

    /// @notice Adds the hash value of the store's image stored in IPFS
    /// @dev Only the store owner, who is still an active owner, can add a
    ///  new hash value. It is required that the referring store is not a
    ///  deleted one. We also check if the  given index corresponds to the
    ///  store name that is given, in order to avoid storing a hash value to
    ///  a store that doesn't exist. The index of the store is the index of the
    ///  store in the array plus one because the storeInfo mapping stores the
    ///  first element in index 1
    /// @param _name The name of the store
    /// @param _indexStore The index of the store
    /// @param _ipfsHash The hash value of the image returned from IPFS
    function addHash(bytes32 _name, uint _indexStore, string memory _ipfsHash)
        public
        onlyStoreOwners
        onlyStoreOwnersOfSpecificStore(_name, _indexStore)
    {
        require(_name[0] != 0);
        storeOwner[msg.sender].storeInfo[_indexStore].ipfsHash = _ipfsHash;
    }

    /// @notice Removes a store from the marketplace. It is required that
    ///  the store doesn't hold funds.
    /// @param _storeName The name of the store that we want to remove
    /// @param _indexToDelete The index of the store we want to delete
    function removeStore(bytes32 _storeName, uint _indexToDelete)
        public
        isPaused
        onlyStoreOwners
        onlyStoreOwnersOfSpecificStore(_storeName,  _indexToDelete)
    {
        require(_storeName[0] != 0);
        require(_indexToDelete > 0);
        require(storeOwner[msg.sender].storeInfo[_indexToDelete].balance == 0);
        delete storeOwner[msg.sender].storeNames[_indexToDelete-1];
        delete storeOwner[msg.sender].storeInfo[_indexToDelete];
        emit RemovedStore(msg.sender, _storeName);
    }

    /// @notice Add a new item to an existing store in the marketplace
    /// @param _index The index of the store where the new item will be added
    /// @param _itemName The name of the item we want to add
    /// @param _description The description of the item we want to add
    /// @param _quantity The available quantity of the item
    /// @param _price The price in wei of the item
    function addNewItem(
        bytes32 _storeName,
        uint _index,
        bytes32 _itemName,
        string memory _description,
        uint _quantity,
        uint _price
    )
        public
        isPaused
        onlyStoreOwners
        onlyStoreOwnersOfSpecificStore(_storeName, _index)
    {
        require(_itemName[0] != 0);
        require(_storeName[0] != 0);
        require( _quantity >= 0 && _price >= 0);
        storeOwner[msg.sender].storeInfo[_index].itemInfo[storeOwner[msg.sender].storeInfo[_index].itemName.length+1].name = _itemName;
        storeOwner[msg.sender].storeInfo[_index].itemInfo[storeOwner[msg.sender].storeInfo[_index].itemName.length+1].description = _description;
        storeOwner[msg.sender].storeInfo[_index].itemInfo[storeOwner[msg.sender].storeInfo[_index].itemName.length+1].quantity = _quantity;
        storeOwner[msg.sender].storeInfo[_index].itemInfo[storeOwner[msg.sender].storeInfo[_index].itemName.length+1].inquant = _quantity;
        storeOwner[msg.sender].storeInfo[_index].itemInfo[storeOwner[msg.sender].storeInfo[_index].itemName.length+1].price = _price;
        storeOwner[msg.sender].storeInfo[_index].itemName.push(_itemName);
        emit AddedNewStoreItem(msg.sender, _index, _itemName);
    }

    /// @notice Remove an item from an existing store.
    /// @param _storeName The name of the store which item we want to remove
    /// @param _index The index of the store which item we want to remove
    /// @param _itemName The name of the item which we want to remove
    /// @param _indexToDelete The index of item we want to remove
    function removeStoreItem(
        bytes32 _storeName,
        uint _index,
        bytes32 _itemName,
        uint _indexToDelete
    )
        public
        isPaused
        onlyStoreOwners
        onlyStoreOwnersOfSpecificStore(_storeName, _index)
    {
        require(_storeName[0] != 0);
        require(_itemName[0] != 0);
        require(_index > 0);
        require(_indexToDelete > 0);
        require(storeOwner[msg.sender].storeInfo[_index].itemInfo[_indexToDelete].name == _itemName);
        delete storeOwner[msg.sender].storeInfo[_index].itemName[_indexToDelete-1];
        delete storeOwner[msg.sender].storeInfo[_index].itemInfo[_indexToDelete];
        emit RemovedStoreItem(msg.sender, _index, _itemName);
    }

    /// @notice Change the name of an existing store.
    /// @param _name The new name of the store that we want to save
    /// @param _indexStore The index of the store that we want to modify his
    ///  name
    /// @param _oldName The name of the store that we want to modify his name
    function modifyStore(bytes32 _name, uint _indexStore, bytes32 _oldName)
        public
        isPaused
        onlyStoreOwners
        onlyStoreOwnersOfSpecificStore(_oldName, _indexStore)
    {
        require(_name[0] != 0);
        require(_indexStore > 0);
        require(_name != _oldName);
        storeOwner[msg.sender].storeInfo[_indexStore].name = _name;
        storeOwner[msg.sender].storeNames[_indexStore-1] = _name;
        emit ModifyStore(msg.sender, _oldName, _name);
    }

    /// @notice Change the name of an item in an existing store.
    /// @param _name The new name of the item we want to save
    /// @param _itemIndex The index of the item whose name we want to change
    /// @param _indexStore The index of the store where the item we want to
    ///  change exists
    /// @param _oldName The name of the item we want to change
    /// @param _storeName The name of the store where the item we want to
    ///  change exist
    function modifyItemName(
        bytes32 _name,
        uint _itemIndex,
        uint _indexStore,
        bytes32 _oldName,
        bytes32 _storeName
    )
        public
        isPaused
        onlyStoreOwners
        onlyStoreOwnersOfSpecificStore(_storeName, _indexStore)
    {
        require(_storeName[0] != 0);
        require(_name[0] != 0);
        require(_indexStore > 0);
        require(_itemIndex > 0);
        require(storeOwner[msg.sender].storeInfo[_indexStore].itemInfo[_itemIndex].name == _oldName);
        require(_name != _oldName);
        storeOwner[msg.sender].storeInfo[_indexStore].itemInfo[_itemIndex].name = _name;
        storeOwner[msg.sender].storeInfo[_indexStore].itemName[_itemIndex-1] = _name;
        emit ModifyItemName(msg.sender, _oldName, _name, _indexStore);
    }

    /// @notice Change the description of an item in an existing store.
    /// @param _descr The description of the store that we want to save
    /// @param _itemIndex The index of the item whose name we want to change
    /// @param _indexStore The index of the store where the item we want to
    ///  change exists
    /// @param _oldDescr The description of the store that we want to change
    /// @param _storeName The name of the store where the item we want to
    ///  change exists
    /// @param _itemName The name of the item whose description we want to
    ///  change
    function modifyItemDescr(
        string memory _descr,
        uint _itemIndex,
        uint _indexStore,
        string memory _oldDescr,
        bytes32 _storeName,
        bytes32 _itemName
    )
        public
        isPaused
        onlyStoreOwners
        onlyStoreOwnersOfSpecificStore(_storeName, _indexStore)
    {
        require(_indexStore > 0);
        require(_itemIndex > 0);
        require(_storeName[0] != 0);
        require(_itemName[0] != 0);
        require(storeOwner[msg.sender].storeInfo[_indexStore].itemInfo[_itemIndex].name == _itemName);
        storeOwner[msg.sender].storeInfo[_indexStore].itemInfo[_itemIndex].description = _descr;
        emit ModifyItemDescr(msg.sender, _oldDescr, _descr, _indexStore);
    }

    /// @notice Change the description of an item in an existing store.
    /// @param _quantity The quantity of the store that we want to save
    /// @param _itemIndex The index of the item whose name we want to change
    /// @param _indexStore The index of the store where the item we want to
    ///  change exists
    /// @param _oldQuantity The quantity of the store that we want to change
    /// @param _storeName The name of the store where the item we want to
    ///  change exists
    /// @param _itemName The name of the item whose description we want to
    ///  change
    function modifyItemQuantity(
        uint _quantity,
        uint _itemIndex,
        uint _indexStore,
        uint _oldQuantity,
        bytes32 _storeName,
        bytes32 _itemName
    )
        public
        isPaused
        onlyStoreOwners
        onlyStoreOwnersOfSpecificStore(_storeName, _indexStore)
    {
        require(_indexStore > 0);
        require(_itemIndex > 0);
        require(_storeName[0] != 0);
        require(_itemName[0] != 0);
        require(storeOwner[msg.sender].storeInfo[_indexStore].itemInfo[_itemIndex].name == _itemName);
        require(_quantity > 0);
        require(_quantity != _oldQuantity);
        storeOwner[msg.sender].storeInfo[_indexStore].itemInfo[_itemIndex].quantity = _quantity;
        storeOwner[msg.sender].storeInfo[_indexStore].itemInfo[_itemIndex].inquant = _quantity;
        emit ModifyItemQuantity(msg.sender, _oldQuantity, _quantity, _indexStore);
    }

    /// @notice Change the price of an item in an existing store.
    /// @param _price The price of the store that we want to save
    /// @param _itemIndex The index of the item whose name we want to change
    /// @param _indexStore The index of the store where the item we want to
    ///  change exists
    /// @param _oldPrice The old price of the store that we want to change
    /// @param _storeName The name of the store where the item we want to
    ///  change exists
    /// @param _itemName The name of the item whose description we want to
    ///  change
    function modifyItemPrice(
        uint _price,
        uint _itemIndex,
        uint _indexStore,
        uint _oldPrice,
        bytes32 _storeName,
        bytes32 _itemName
    )
        public
        isPaused
        onlyStoreOwners
        onlyStoreOwnersOfSpecificStore(_storeName, _indexStore)
    {
        require(_indexStore > 0);
        require(_itemIndex > 0);
        require(_storeName[0] != 0);
        require(_itemName[0] != 0);
        require(storeOwner[msg.sender].storeInfo[_indexStore].itemInfo[_itemIndex].name == _itemName);
        require(_price > 0);
        require(_price != _oldPrice);
        storeOwner[msg.sender].storeInfo[_indexStore].itemInfo[_itemIndex].price = _price;
        emit ModifyItemPrice(msg.sender, _oldPrice, _price, _indexStore);
    }

    /// @notice Buy an item from a store
    /// @param _storeOwner The owner of the store that the items we want to buy
    ///  exist
    /// @param _indexStore The index of the store where the items we want to
    ///  buy exist
    /// @param _itemIndex The index of the item we want buy
    /// @param numberOfItems The number of the items we want to buy
    /// @param _storeName The name of the store where the item we want to
    ///  buy exist
    /// @param _itemName The name of the item we want to buy
    function purchase(
        address _storeOwner,
        uint _indexStore,
        uint _itemIndex,
        uint numberOfItems,
        bytes32 _storeName,
        bytes32 _itemName
    )
        public
        isPaused
        payable
    {
        require(_indexStore > 0);
        require(_itemIndex > 0);
        require(_storeName[0] != 0);
        require(_itemName[0] != 0);
        require(storeOwner[_storeOwner].storeInfo[_indexStore].name == _storeName);
        require(storeOwner[_storeOwner].storeInfo[_indexStore].itemInfo[_itemIndex].name == _itemName);
        require(numberOfItems > 0);
        uint value = numberOfItems.mul(storeOwner[_storeOwner].storeInfo[_indexStore].itemInfo[_itemIndex].price);
        require(msg.value >= value);
        require (numberOfItems <= storeOwner[_storeOwner].storeInfo[_indexStore].itemInfo[_itemIndex].quantity);
        storeOwner[_storeOwner].storeInfo[_indexStore].itemInfo[_itemIndex].quantity = storeOwner[_storeOwner].storeInfo[_indexStore].itemInfo[_itemIndex].quantity.sub(numberOfItems);
        reservedBalance[msg.sender] = reservedBalance[msg.sender].add(value);
        emit LogBuyItem (msg.sender, _storeOwner, storeOwner[_storeOwner].storeInfo[_indexStore].itemName[_itemIndex-1], numberOfItems, _indexStore, _itemIndex);
        if (msg.value > value){
            refundBalance[msg.sender] = refundBalance[msg.sender].add(msg.value - value);
        }
    }

    /// @notice Byer consents, the balance to transfer the reserved funds from the
    ///  purchase to the store' s balance. All the parameters can be retrieved
    ///  from the event emmited from the transcaction' s receipt.
    /// @param _storeOwner The owner of the store
    /// @param _storeIndex The index of the store
    /// @param _itemIndex The index of the item bought
    /// @param _amountToRelease The amount paid for the purchase
    /// @param _storeName The name of the store
    /// @param _itemName The name of the item bought
    function releaseFunds(
        address _storeOwner,
        uint _storeIndex,
        uint _itemIndex,
        uint _amountToRelease,
        bytes32 _storeName,
        bytes32 _itemName
    )
        public
    {
        require(_storeName[0] != 0);
        require(_itemName[0] != 0);
        require(storeOwner[_storeOwner].storeInfo[_storeIndex].name == _storeName);
        require(storeOwner[_storeOwner].storeInfo[_storeIndex].itemInfo[_itemIndex].name == _itemName);
        require(reservedBalance[msg.sender] > 0 && _amountToRelease > 0);
        storeOwner[_storeOwner].storeInfo[_storeIndex].balance = _amountToRelease.add(storeOwner[_storeOwner].storeInfo[_storeIndex].balance);
        reservedBalance[msg.sender] = reservedBalance[msg.sender].sub(_amountToRelease);
        emit PurchaseFulfillment(_storeOwner, msg.sender, _storeIndex, _itemIndex, _amountToRelease);
    }

    /// @notice If accidentaly a buyer send more ether, he can use this function
    ///  to take the money back.
    function getRefund() public {
        require(refundBalance[msg.sender] > 0);
        uint refund = refundBalance[msg.sender];
        refundBalance[msg.sender] = 0;
        msg.sender.transfer(refund);
        emit Refund(msg.sender, refund);
    }

    /// @notice A store owner can withdraw the ether stored in his store's
    ///  balance
    /// @param _indexStore The index of the store
    function withdraw(uint _indexStore) public isPaused {
        require(_indexStore > 0);
        require(storeOwner[msg.sender].storeInfo[_indexStore].balance > 0);
        uint value = storeOwner[msg.sender].storeInfo[_indexStore].balance;
        emit Withdraw(
            msg.sender,
            storeOwner[msg.sender].storeNames[_indexStore-1],
            storeOwner[msg.sender].storeInfo[_indexStore].balance
        );
        storeOwner[msg.sender].storeInfo[_indexStore].balance = 0;
        msg.sender.transfer(value);
    }

    /// @notice Return the number of admins added so far
    /// @dev It may hold duplicate values, because admins can be reenabled.
    ///  To find if enabled check the mapping
    /// @return the length of the array of the of admins
    function lenAdminsArr() view public returns(uint _length) {
        return  adminsArray.length;
    }

    /// @notice Return then number of owners added so far
    /// @dev It may hold duplicate values, because owners can be reenabled.
    ///  To find if enabled call the corresponding function
    /// @return the length of the array of the of owners
    function lenOwnersArr() view public returns(uint _length) {
        return  storeOwners.length;
    }

    /// @notice Check if an address of an owner is still activated
    /// @param _owner The address of the owner
    /// @return true if the address is an active owner or false otherwise
    function isStoreOwner(address _owner) view public returns(bool _answer) {
        return storeOwner[_owner].isActive;
    }

    /// @notice Returns the hash value of the store's image stored in IPFS
    /// @param _storeOwner The owner of the store
    /// @param _indexStore The index of the store
    /// @return the hash value
    function getHash(address _storeOwner, uint _indexStore)
        public view
        returns (string memory ipfshash)
    {
        return storeOwner[_storeOwner].storeInfo[_indexStore].ipfsHash;
    }

    /// @notice Returns the store names an owner has added. Zero values
    ///  correspond to elements that have been deleted.
    /// @param _storeOwner The owner of the store
    /// @param startIndex The index of the store
    /// @param endIndex The index greater than one of the last element
    /// @return an array with store names
    function returnStores(address _storeOwner, uint startIndex, uint endIndex)
        view public
        returns(bytes32[] memory _arrayToReturn)
    {
        require(storeOwner[_storeOwner].isActive == true);
        require(startIndex >= 0);
        require(endIndex > 0);
        require(endIndex <= storeOwner[_storeOwner].storeNames.length);
        require(startIndex <= storeOwner[_storeOwner].storeNames.length);
        require(startIndex < endIndex);
        uint elements = endIndex - startIndex;
        bytes32[] memory k = new bytes32[](elements);
        for(uint i = 0; i < k.length; i++){
            k[i] = storeOwner[_storeOwner].storeNames[startIndex];
            startIndex++;
        }
        return k;
    }

    /// @notice Returns the items names that an owner has added to a store.
    ///  Zero values correspond to elements that have been deleted.
    /// @param startIndex The index of the first item we want to retrieve
    /// @param endIndex The index greater than one of the last element we want
    ///  to retrieve from the array
    /// @param _indexStore The index of the store
    /// @return an array with the item names
    function returnItems
    (
        address _storeOwner,
        uint startIndex,
        uint endIndex,
        uint _indexStore
    )
        view public
        returns(bytes32[] memory _arrayOfItems)
    {
        require(storeOwner[_storeOwner].isActive == true);
        require(_indexStore > 0);
        require(storeOwner[_storeOwner].storeInfo[_indexStore].name != "");
        require(startIndex >= 0);
        require(endIndex > 0);
        require(endIndex <= storeOwner[_storeOwner].storeInfo[_indexStore].itemName.length);
        require(startIndex <= storeOwner[_storeOwner].storeInfo[_indexStore].itemName.length);
        require(startIndex < endIndex);
        uint elements = endIndex - startIndex;
        bytes32[] memory k = new bytes32[](elements);
        for(uint i = 0; i < k.length; i++){
            k[i] = storeOwner[_storeOwner].storeInfo[_indexStore].itemName[startIndex];
            startIndex++;
        }
        return k;
    }

    /// @notice Returns the info for a specfic item
    /// @param _storeOwner The owner of the store
    /// @param _indexStore The index of the store
    /// @param _itemIndex The index of the item
    /// @return name The name of the item whose we want to retreive
    /// @return desc The description of the item
    /// @return quantity The available quantity of the item
    /// @return inquant The initial quantity of the item
    /// @return price The price of the item
    function returnItemInfo(address _storeOwner, uint _indexStore, uint _itemIndex)
        view public
        returns (
            bytes32 name,
            string memory desc,
            uint quantity,
            uint inquant,
            uint price
        )
    {
        require(storeOwner[_storeOwner].storeInfo[_indexStore].name != "");
        require(storeOwner[_storeOwner].storeInfo[_indexStore].itemInfo[_itemIndex].name != "");
        return (
            storeOwner[_storeOwner].storeInfo[_indexStore].itemInfo[_itemIndex].name,
            storeOwner[_storeOwner].storeInfo[_indexStore].itemInfo[_itemIndex].description,
            storeOwner[_storeOwner].storeInfo[_indexStore].itemInfo[_itemIndex].quantity,
            storeOwner[_storeOwner].storeInfo[_indexStore].itemInfo[_itemIndex].inquant,
            storeOwner[_storeOwner].storeInfo[_indexStore].itemInfo[_itemIndex].price
        );
    }

    /// @notice Return the number of the stores that an owner has added so far
    /// @dev It is required that the owner is active otherwise the returned
    ///  number is not valid as he is a deactivated store owner
    /// @param _storeOwner The address of the owner
    /// @return the number of the the stores that an owner has added so far
    function returnLengthStoreArray(address _storeOwner)
        view public
        returns(uint _length)
    {
        require(storeOwner[_storeOwner].isActive == true);
        return storeOwner[_storeOwner].storeNames.length;
    }

    /// @notice Return the number of the items that an owner has added for a
    ///  specific store so fa
    /// @param _storeOwner The address of the owner
    /// @param _indexStore The index of the store
    /// @return the number of the items
    function returnLengthItemArray(address _storeOwner, uint _indexStore)
        view public
        returns(uint _length)
    {
        require(_indexStore > 0);
        require(storeOwner[_storeOwner].isActive == true);
        return storeOwner[_storeOwner].storeInfo[_indexStore].itemName.length;
    }

    /// @notice Return the balance in wei of a store
    /// @param owner The owner of the store
    /// @param _indexStore The index of the store
    /// @return the balance for a specific store, in wei
    function balanceOfStore(address owner, uint _indexStore)
        view public
        returns(uint _balance)
    {
        require(storeOwner[owner].storeInfo[_indexStore].name != "");
        return storeOwner[owner].storeInfo[_indexStore].balance;
    }
}
