cc.Class({
    extends: cc.Component,

    properties: {
    
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // cc.game.addPersistRootNode(this.node);
        this.admobInit();
    },

    start () {

    },

    admobInit () {
        if(cc.sys.isMobile) {
            // let self = this
            // sdkbox.PluginAdMob.setListener({
            //     adViewDidReceiveAd: function(name) {
            //         // self.showInfo('adViewDidReceiveAd name=' + name);
            //     },
            //     adViewDidFailToReceiveAdWithError: function(name, msg) {
            //         // self.showInfo('adViewDidFailToReceiveAdWithError name=' + name + ' msg=' + msg);
            //     },
            //     adViewWillPresentScreen: function(name) {
            //         // self.showInfo('adViewWillPresentScreen name=' + name);
            //     },
            //     adViewDidDismissScreen: function(name) {
            //         // self.showInfo('adViewDidDismissScreen name=' + name);
            //     },
            //     adViewWillDismissScreen: function(name) {
            //         // self.showInfo('adViewWillDismissScreen=' + name);
            //     },
            //     adViewWillLeaveApplication: function(name) {
            //         // self.showInfo('adViewWillLeaveApplication=' + name);
            //     }
            // });
            sdkbox.PluginAdMob.init();
            // sdkbox.PluginAdMob.cache("banner");
        }
    },

    showBanner () {
        if(cc.sys.isMobile) {
            sdkbox.PluginAdMob.cache("banner");
            sdkbox.PluginAdMob.show('banner');
        }
    },

    hideBanner() {
        // if(cc.sys.isMobile) {
        //     sdkbox.PluginAdMob.hide('banner');
        // }
    },

    // cacheInterstitial: function() {
    //     if(cc.sys.isMobile) {
    //         sdkbox.PluginAdMob.cache('gameover');
    //     }
    // },

    // showInterstitial: function() {
    //     if(cc.sys.isMobile) {
    //         sdkbox.PluginAdMob.show('gameover');
    //     }
    // },

    // update (dt) {},
});
