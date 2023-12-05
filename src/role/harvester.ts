/**
 * harvester逻辑
 * prepare: 前往container(工地)
 * source:  修container
 * target:  采集source
 * 
 * @param creep 
 */
var harvester: CreepLifeCycle = {
    // 存储的是sourceId
    // 寻找source旁边的container或者工地进行移动
    prepare(creep: Creep): boolean {
        var target;
        const source = <Source>Game.getObjectById(creep.memory.targetId)

        // 找container
        const containers = source.pos.findInRange(FIND_MY_STRUCTURES, 1,
            { filter: { structureType: StructureContainer } }
        )
        var container;
        if (containers.length > 0) {
            // 找到container
            container = containers[0]
            target = container
            // TODO: 缓存
        } else {
            // 继续找container建筑工地
            const structures = source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1)
            if (structures.length > 0) {
                // 找到工地
                var structure = structures[0]
                target = structure
            } else {
                console.log("异常: 没有container建筑工地")
                return false
            }
        }
        // 抵达位置了就准备完成
        const range = target instanceof Source ? 1 : 0
        if (creep.pos.inRangeTo(target.pos, range)) {
            return true
        } else {
            creep.moveTo(target, { reusePath: 10, visualizePathStyle: { stroke: '#ffffff' } });
            return false

        }
    },
    // 采集资源对对container进行建造和维护
    source(creep: Creep): boolean {
        creep.say('🚧')

        const source: Source = <Source>Game.getObjectById(creep.memory.sourceId)

        // 允许采集一下工作一下，这样效率合适的话不会变低
        if (creep.store[RESOURCE_ENERGY] <= 0) {
            creep.harvest(source);
            return false;
        } else {
            // 找container工地并建造
            const structures = source.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 1)
            if (structures.length > 0) {
                const structure = structures[0]
                creep.build(structure)
                return false
            } else {
                return true
            }
        }
    },
    // 放到container里，直接掉落，快死了就丢出去
    target(creep: Creep): boolean {
        const source = <Source>Game.getObjectById(creep.memory.sourceId);
        creep.harvest(source);

        if (creep.ticksToLive < 2) {
            creep.drop(RESOURCE_ENERGY)
        }
        return true;
    }
}
module.exports = harvester