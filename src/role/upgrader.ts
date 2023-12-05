/**
 * upgrader逻辑
 * source: 从指定地方取出资源
 * target: 升级指定的 Controller 中
 * 
 * @param sourceId 要挖的矿 id
 */
var upgrader: CreepLifeCycle = {
    // 采集能量矿
    source(creep: Creep, objectId: Id<_HasId>): boolean {
        const source0: Source = <Source>Game.getObjectById(objectId)
        if (creep.harvest(source0) == ERR_NOT_IN_RANGE) creep.moveTo(source0)

        // 自己身上的能量装满了，返回 true（切换至 target 阶段）
        return creep.store.getFreeCapacity() <= 0
    },
    // 升级控制器
    target(creep: Creep): boolean {
        const controller = creep.room.controller
        if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) creep.moveTo(controller)

        // 自己身上的能量没有了，返回 true（切换至 source 阶段）
        return creep.store[RESOURCE_ENERGY] <= 0
    }
}
module.exports = upgrader