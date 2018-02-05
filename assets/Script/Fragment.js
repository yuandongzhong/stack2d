cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.scene = cc.find('Canvas');
        let eventController = cc.find('EventController').getComponent('RegisterEvents');
        eventController.subscribeEvent('tap', this.callback, this);
    },

    reuse () {
        cc.log("reuse");
        this.scene = cc.find('Canvas');
        let eventController = cc.find('EventController').getComponent('RegisterEvents');
        eventController.subscribeEvent('tap', this.callback, this);

        // this.scheduleOnce(function() {
        //     this.recycle();
        //     // cc.log("Yo")
        // }, 2);
    },

    unuse () {
        cc.log("unuse");
        this.node.targetOff(this);
        // cc.director.getActionManager().removeAllActionsFromTarget(this.node, true);
        this.node.stopAllActions();
    },

    start () {
        // this.scheduleOnce(function() {
        //     this.recycle();
        //     // cc.log("Yo")
        // }, 2);
    },

    callback() {
        let blockCount = this.scene.getComponent('GameScene').blockCount;
        let moveDown =  cc.moveBy(0.01, cc.v2(0, -this.node.height));
        if (blockCount >= 13) {
            this.node.runAction(moveDown);
        }

        // if (this.node.getPosition().y < -this.scene.height/2) {
        //     this.scene.getComponent('GameScene').kill(this.node);
        // } 
    },

    // recycle() {
    //     this.scene.getComponent('GameScene').fragmentPool.put(this.node);
    //     cc.log("fragment recycled!")
    // },

    kill() {
        this.node.destroy();
        cc.log("Kill!");
    }, 

    // update (dt) {
    //     // cc.log("alpha: " + this.node.color);
    // },
});
