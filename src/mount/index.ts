import { creepExtension } from "./prototype_creep"
import { roomExtension } from "./prototype_room"



export const mount = function () {
    try {
        _.assign(Creep.prototype, creepExtension)
        _.assign(Room.prototype, roomExtension)
    }
    catch (e) {
        console.log('挂载模块失败')
    }

}
