cc.Class({
    extends: cc.Component,

    properties: {
        id: null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.scene = cc.find('Canvas');
        let eventController = cc.find('EventController').getComponent('RegisterEvents');
        eventController.subscribeEvent('tap', this.callback, this);
    },

    start () {
        // this.scheduleOnce(function() {
        //     // cc.log("Yo")
        // }, 2);
    },

    reuse () {
        // console.log("reused!");
        this.scene = cc.find('Canvas');
        let eventController = cc.find('EventController').getComponent('RegisterEvents');
        eventController.subscribeEvent('tap', this.callback, this);
    },

    unuse () {
        // console.log("unused!");
        // this.node.targetOff(this);
        // cc.director.getActionManager().removeAllActionsFromTarget(this.node, true);
        this.node.stopAllActions();
    },

    callback() {
        let blockCount = this.scene.getComponent('GameScene').blockCount;
        let moveDown =  cc.moveBy(0.01, cc.v2(0, -this.node.height));
        if (blockCount >= 13) {
            this.node.runAction(moveDown);
        }

    },

    // kill() {
    //     this.node.destroy();
    //     cc.log("Kill!");
    // }, 

    update (dt) {
        // cc.log("alpha: " + this.node.opacity);
        if (this.node.opacity < 1) {
            this.scene.getComponent('GameScene').recycleFragment(this.node);
        }
    },
});
