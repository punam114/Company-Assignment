const Group = require('../models/Group');
const User = require('../models/User');
const notificationService = require('../services/notification.service');

// Create a new group
exports.createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;

        const group = await Group.create({
            name,
            description,
            members: [req.user._id],
            admins: [req.user._id],
            createdBy: req.user._id,
        });

        res.status(201).json(group);
    } catch (error) {
        console.error('Error in createGroup:', error);
        res.status(500).json({ message: 'Failed to create group: ' + error.message });
    }
};

// Get all groups for current user
exports.getMyGroups = async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user._id })
            .populate('members', 'displayName email photoURL');

        res.json(groups);
    } catch (error) {
        console.error('Error in getMyGroups:', error);
        res.status(500).json({ message: 'Failed to fetch your groups: ' + error.message });
    }
};

// Get details for a specific group
exports.getGroupDetails = async (req, res) => {
    try {
        const group = await Group.findOne({ _id: req.params.groupId, members: req.user._id })
            .populate('members', 'displayName email photoURL')
            .populate('admins', 'displayName email photoURL');

        if (!group) {
            return res.status(404).json({ message: 'Group not found or you are not a member' });
        }

        res.json(group);
    } catch (error) {
        console.error('Error in getGroupDetails:', error);
        res.status(500).json({ message: 'Failed to fetch group details: ' + error.message });
    }
};

// Add member to group by email
exports.addMember = async (req, res) => {
    try {
        const { email } = req.body;

        const group = await Group.findOne({ _id: req.params.groupId, members: req.user._id });
        if (!group) return res.status(404).json({ message: 'Group not found or access denied' });

        const userToAdd = await User.findOne({ email });
        if (!userToAdd) return res.status(404).json({ message: 'No user found with this email' });

        if (group.members.includes(userToAdd._id)) {
            return res.status(400).json({ message: 'User is already a member' });
        }

        group.members.push(userToAdd._id);
        await group.save();

        if (userToAdd.fcmToken) {
            await notificationService.sendNotification(
                userToAdd.fcmToken,
                'New Group Invitation',
                `You have been added to: ${group.name}`
            );
        }

        res.json({ message: 'Member added successfully', group });
    } catch (error) {
        console.error('Error in addMember:', error);
        res.status(500).json({ message: 'Failed to add member: ' + error.message });
    }
};

// Remove member from group
exports.removeMember = async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const group = await Group.findById(groupId);

        if (!group) return res.status(404).json({ message: 'Group not found' });

        if (!group.admins.includes(req.user._id)) {
            return res.status(403).json({ message: 'Only admins can remove members' });
        }

        group.members = group.members.filter(m => m.toString() !== userId);
        group.admins = group.admins.filter(a => a.toString() !== userId);

        await group.save();
        res.json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error('Error in removeMember:', error);
        res.status(500).json({ message: 'Failed to remove member: ' + error.message });
    }
};
