cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // sdkbox.PluginReview.setCustomPromptTitle("custom title");
        // sdkbox.PluginReview.setCustomPromptMessage("custom message");
        // sdkbox.PluginReview.setCustomPromptCancelButtonTitle("custom cancel");
        // sdkbox.PluginReview.setCustomPromptRateButtonTitle("custom rate");
        // sdkbox.PluginReview.setCustomPromptRateLaterButtonTitle("custom rate later");

        sdkbox.PluginReview.init();
    },

    start () {

    },

    // show() {
    //     sdkbox.PluginReview.init();
    // },

    // update (dt) {},
});
