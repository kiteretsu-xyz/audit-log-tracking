// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AuditLogTracking {
    struct AuditEntry {
        address actor;
        string actionType;
        string target;
        string description;
        uint32 severity;
        bool isFlagged;
        string flagReason;
        string accessType;
        uint64 loggedAt;
    }

    // Mapping from entry ID to the actual entry
    mapping(string => AuditEntry) private entries;
    
    // Array to keep track of all entry IDs
    string[] private entryIds;
    
    // Counters
    uint32 private flaggedCount;

    // Events
    event ActionLogged(string indexed id, address indexed actor, string actionType, uint32 severity);
    event AccessLogged(string indexed id, address indexed accessor, string accessType);
    event EntryFlagged(string indexed id, address indexed auditor, string reason);

    error InvalidDescription();
    error InvalidTimestamp();
    error InvalidSeverity();
    error EntryAlreadyExists();
    error EntryNotFound();
    error AlreadyFlagged();

    // Check if an entry exists by checking if loggedAt > 0
    function entryExists(string memory id) internal view returns (bool) {
        return entries[id].loggedAt > 0;
    }

    function logAction(
        string memory id,
        string memory actionType,
        string memory target,
        string memory description,
        uint32 severity,
        uint64 timestamp
    ) public {
        if (bytes(description).length == 0) revert InvalidDescription();
        if (timestamp == 0) revert InvalidTimestamp();
        if (severity > 5) revert InvalidSeverity();
        if (entryExists(id)) revert EntryAlreadyExists();

        entries[id] = AuditEntry({
            actor: msg.sender,
            actionType: actionType,
            target: target,
            description: description,
            severity: severity,
            isFlagged: false,
            flagReason: "",
            accessType: "none",
            loggedAt: timestamp
        });

        entryIds.push(id);
        emit ActionLogged(id, msg.sender, actionType, severity);
    }

    function logAccess(
        string memory id,
        string memory resource,
        string memory accessType,
        uint64 timestamp
    ) public {
        if (bytes(resource).length == 0) revert InvalidDescription();
        if (timestamp == 0) revert InvalidTimestamp();
        if (entryExists(id)) revert EntryAlreadyExists();

        entries[id] = AuditEntry({
            actor: msg.sender,
            actionType: "access",
            target: resource,
            description: "Access log",
            severity: 1,
            isFlagged: false,
            flagReason: "",
            accessType: accessType,
            loggedAt: timestamp
        });

        entryIds.push(id);
        emit AccessLogged(id, msg.sender, accessType);
    }

    function flagEntry(string memory id, string memory reason) public {
        if (!entryExists(id)) revert EntryNotFound();
        
        AuditEntry storage entryToFlag = entries[id];
        
        if (entryToFlag.isFlagged) revert AlreadyFlagged();
        
        entryToFlag.isFlagged = true;
        entryToFlag.flagReason = reason;
        
        flaggedCount++;
        emit EntryFlagged(id, msg.sender, reason);
    }

    function getEntry(string memory id) public view returns (AuditEntry memory) {
        if (!entryExists(id)) revert EntryNotFound();
        return entries[id];
    }

    function listEntries() public view returns (string[] memory) {
        return entryIds;
    }

    function getEntryCount() public view returns (uint32) {
        return uint32(entryIds.length);
    }

    function getFlaggedCount() public view returns (uint32) {
        return flaggedCount;
    }
}
