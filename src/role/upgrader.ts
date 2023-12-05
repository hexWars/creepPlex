/**
 * upgrader逻辑
 * prepare: 
 * source:  修container
 * target:  采集source
 * 
 * @param sourceId 要挖的矿 id
 */
var upgrader: CreepLifeCycle = {
    // contain没建好就自己挖自己升级
    prepare(creep: Creep): boolean {
        // sourceId是能量矿
        const source = <Source>Game.getObjectById(creep.memory.targetId)

        // 找container
        const containers = source.pos.findInRange(FIND_MY_STRUCTURES, 1,
            { filter: { structureType: StructureContainer } }
        )
        var container;
        if (containers.length > 0) {
            // 找到container就返回true
            return true
        }
        // --- 后面是container没建好的情况 ---
        // 直接抄教程代码
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        return false
    },
    // 当container修好就去container里拿
    source(creep: Creep): boolean {
        const source = <Source>Game.getObjectById(creep.memory.sourceId)
        const container = creep.room.memory.containerIds[source.id]
        // TODO: 不确定正不正确,大概需要调试
        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
            return false
        }
        return true
        
    },
    // 移动并升级
    target(creep: Creep): boolean {
        creep.moveTo(creep.room.controller)
        creep.upgradeController(creep.room.controller)
        return true
    }
}
module.exports = upgrader