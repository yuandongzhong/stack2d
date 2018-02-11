cc.Class({
    extends: cc.Component,

    properties: {
        id: null,
    },

    // LIFE-CYCLE CALLBACKS:



    reuse () {
        this.scene = cc.find('Canvas');
    },

    unuse () {
        // cc.log("unuse");
        // this.node.targetOff(this);
        this.node.stopAllActions();
        // this.stopSystem();
    },

    onLoad () {
        this.scene = cc.find('Canvas');
    },

    start () {
        // this.resetSystem();     // 杀死所有存在的粒子，然后重新启动粒子发射器。
    },

    resetSystem() {

    },

    // kill() {
    //     this.node.destroy();
    //     // cc.log("Kill!");
    // }, 

    update (dt) {
        // cc.log("alpha: " + this.node.opacity);
        if (this.node.opacity < 1) {
            this.scene.getComponent('GameScene').recycleSpark(this.node);
        }
    },
});
