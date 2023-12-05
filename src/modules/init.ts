export const init = {
    /**
     * 对房间内的建筑和资源进行缓存
     */
    initMemoryCache: function () {
        for (const roomId in Game.rooms) {
            var room = Game.rooms[roomId];
            // Source
            if (!room.memory.sourceIds) {
                room.memory.sourceIds = [];
                for (var source in room.find(FIND_SOURCES)) {
                    var typeSource = source as unknown as Source
                    room.memory.sourceIds.push(typeSource.id);
                }
            }
            // mineral
            if (!room.memory.mineralId) {
                room.memory.mineralId = [];
                for (var mineral in room.find(FIND_MINERALS)) {
                    var typeMineral = mineral as unknown as Mineral
                    room.memory.mineralId.push(typeMineral.id);
                }
            }
        }
    },
    /**
     * 废弃!!!
     * 对source周围的container进行绑定
     * 即生成containerIds
     */
    source2container: function () {
        for (const roomId in Game.rooms) {
            const room = Game.rooms[roomId];
            if (room.memory.sourceIds) {
                for (const sourceId in room.memory.sourceIds) {
                    const source = <Source>Game.getObjectById(sourceId);
                    // TODO: 搜索周围8格，如果有container(建筑),那么加入source的内存，有问题，区域内搜索好像不对
                    var objects = room.lookForAtArea(LOOK_STRUCTURES, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true)
                    if (objects.length > 0) {
                        room.memory.containerIds[sourceId] = objects[0].structure.id;
                        console.log("source和container绑定成功")
                    }
                }
            }
        }
    }
}