"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = exports.unload = exports.load = void 0;
const webMobileOption = {
    open: {
        label: '启用',
        default: true,
        render: {
            ui: 'ui-checkbox'
        }
    },
    title: {
        label: '游戏名',
        render: {
            ui: 'ui-input'
        }
    },
    mobileFull: {
        label: '手机全屏',
        default: true,
        render: {
            ui: 'ui-checkbox'
        }
    },
    pcFull: {
        label: 'PC全屏',
        default: false,
        render: {
            ui: 'ui-checkbox'
        }
    },
    mobileIgnore: {
        label: '忽略手机',
        default: true,
        render: {
            ui: 'ui-checkbox'
        }
    },
    pcIgnore: {
        label: '忽略PC',
        default: false,
        render: {
            ui: 'ui-checkbox'
        }
    },
    mode: {
        label: '适配模式',
        default: '4',
        render: {
            ui: 'ui-select',
            items: [{
                    value: '0',
                    label: 'EXACT_FIT'
                }, {
                    value: '1',
                    label: 'FIXED_WIDTH'
                }, {
                    value: '2',
                    label: 'FIXED_HEIGHT'
                }, {
                    value: '3',
                    label: 'NO_BORDER'
                }, {
                    value: '4',
                    label: 'SHOW_ALL'
                }, {
                    value: '5',
                    label: 'NONE'
                }]
        }
    },
    width: {
        label: '设计分辨率:宽',
        default: 750,
        render: {
            ui: 'ui-num-input'
        }
    },
    height: {
        label: '设计分辨率:高',
        default: 1334,
        render: {
            ui: 'ui-num-input'
        }
    }
};
const load = function () {
};
exports.load = load;
const unload = function () {
};
exports.unload = unload;
exports.configs = {
    'web-mobile': {
        options: webMobileOption,
        hooks: './hooks'
    }
};
