
export const p_creep = function () {
    _.assign(Creep.prototype, creepExtension)
}

export const creepExtension = {
    /**
     * creep执行
     */
    work: function () {
        //TODO: 具体逻辑
        // 如果 creep 还没有发送重生信息的话，执行健康检查，保证只发送一次生成任务
        // 健康检查不通过则向 spawnList 发送自己的生成任务
        if (!this.memory.hasSendRebirth) {
            const health = this.isHealthy()
            if (!health) {
                //todo 向指定 spawn 推送生成任务
                this.memory.hasSendRebirth = true
                // Game.spawns[this.memory.spawnName].addTask(this.memory);//todo 内存中没有spawnName
            }
        }
    },
    /**
     * creep更新重生标记的时间限制
     * @return {boolean}
     */
    isHealthy: function () {
        return this.ticksToLive > 50;
    },
}