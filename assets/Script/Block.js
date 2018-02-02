cc.Class({
    extends: cc.Component,

    properties: {
        id: null,
        label: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // console.log("onLoad!");
        this.scene = cc.find('Canvas');
        let eventController = cc.find('EventController').getComponent('RegisterEvents');
        eventController.subscribeEvent('tap', this.callback, this);
        // this.moveLength = this.scene.width - this.node.width;

        // this.label.string = this.id;
    },


    // start () {
    // },

    reuse () {
        // console.log("reused!");
        this.scene = cc.find('Canvas');
        let eventController = cc.find('EventController').getComponent('RegisterEvents');
        eventController.subscribeEvent('tap', this.callback, this);
        // this.moveLength = this.scene.width - this.node.width;
    },

    unuse () {
        // console.log("unused!");
        this.node.targetOff(this);
        // cc.director.getActionManager().removeAllActionsFromTarget(this.node, true);
        this.node.stopAllActions();
    },

    moveFrom(side, distance) {

        let moveAction;

        if (side == 'left') {
            let moveRight = cc.moveBy(1, cc.v2(distance, 0));
            let moveLeft = moveRight.reverse();
            moveAction = cc.repeatForever(cc.sequence([moveRight, moveLeft]));
        } else {
            let moveLeft = cc.moveBy(1, cc.v2(-distance, 0));
            let moveRight = moveLeft.reverse();
            moveAction = cc.repeatForever(cc.sequence([moveLeft, moveRight]));
        }
        
        moveAction.setTag(1);
        this.node.runAction(moveAction);
        // console.log("moving");
    },

    drop() {
        this.node.stopActionByTag(1);
    },


    callback() {
        let blockCount = this.scene.getComponent('GameScene').blockCount;
        let moveDown =  cc.moveBy(0.01, cc.v2(0, -this.node.height));
        // cc.log("pool node #" + this.id + ", pos" + this.node.getPosition()); 
        if (blockCount >= 11) {
            this.node.runAction(moveDown);
            // cc.log("move down")
            // cc.log("move down #" + this.id + "-------------------");
        }
        // cc.log("pool node #" + this.id + ", pos" + this.node.getPosition());    

        if (this.node.getPosition().y < -this.scene.height/2) {
            // cc.log("put node #" + this.id + " -------------------");
            this.scene.getComponent('GameScene').kill(this.node);
        } 
    },


    // update (dt) {
 
    // },
});
