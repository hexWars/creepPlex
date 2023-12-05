/**
 * builder逻辑
 * prepare: container没有的时候，直接取
 * source:  获取能量
 * target:  寻找工地建造
 * 
 * @param creep 
 */
var builder: CreepLifeCycle = {
    // 没有container,直接挖,和教程一样
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

        // --- 教程代码 ---
        if (creep.store.getFreeCapacity() > 0) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
        return false
    },
    // 有container就从里面拿
    source(creep: Creep): boolean {
        // sourceId是能量矿
        const source = <Source>Game.getObjectById(creep.memory.targetId)
        const container = <StructureContainer>Game.getObjectById(creep.room.memory.containerIds[source.id])
        // TODO: 不确定正不正确,大概需要调试
        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
            return false
        }
        return true
    },
    // 工地建好
    target(creep: Creep): boolean {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length > 0) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        return true
    }
}
module.exports = builder