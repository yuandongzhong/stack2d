let Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (!Global.isGameOn) {
            this.admobInit();
        } 
    },

    start () {

    },

    // update (dt) {},

    admobInit () {
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.init();
            sdkbox.PluginAdMob.cache("banner");
            // sdkbox.PluginAdMob.cache("gameover");
        }
    },

    // showGameover() {
    //     if(cc.sys.isMobile) {
    //         sdkbox.PluginAdMob.show('gameover');
    //     }
    // },

    showBanner () {
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.show('banner');
        }
    },

    hideBanner() {
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.hide('banner');
        }
    }
});
