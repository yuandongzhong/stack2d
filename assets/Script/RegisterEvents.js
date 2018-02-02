cc.Class({
    extends: cc.Component,

    properties: {
    
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    subscribeEvent: function(event, callback, self) {
        // console.log("Subsribed a event");
        this.node.on(event, callback, self);
    },

    unsubscribeEvent: function(event,callback, self) {
        console.log("unsubsribed a event");
        this.node.off(event, callback, self);
    },

    sendEvent: function(event) {
        // console.log("fired a event");
        this.node.emit(event);
    }

});
