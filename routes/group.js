const router = require('express').Router();
const { GroupController } = require('./../controllers/GroupController');
const groupController = new GroupController();

router.post('/', groupController.create);
router.get('/', groupController.getAll);
router.get('/:id', groupController.getById);
router.delete('/:id', groupController.deleteById);
router.delete('/', groupController.deleteAll);
router.post('/:id/requestMembership', groupController.requestMembership);
router.post('/:id/pendingRequests', groupController.getPendingMembersByGroup);
router.post('/:id/requestMembership/act', groupController.takeMembershipAction);
router.post('/:id/checkMemberStatus', groupController.getMembershipStatus);
router.delete('/:id/:userId/removeMember', groupController.removeGroupMember)
router.post('/:id/changeProfile', groupController.changeGroupProfile);

module.exports = router;
