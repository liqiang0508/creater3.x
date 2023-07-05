"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAfterBuild = exports.throwError = void 0;
const mfs_1 = require("./mfs");
const constant_1 = require("./constant");
const ModeType = {
    EXACT_FIT: 0,
    FIXED_WIDTH: 1,
    FIXED_HEIGHT: 2,
    NO_BORDER: 3,
    SHOW_ALL: 4,
    NONE: 5
};
exports.throwError = true;
const onAfterBuild = async function (options, result) {
    const { platform, packages } = options;
    const { dest } = result;
    if ('web-mobile' !== platform) {
        return;
    }
    dealHtml(platform, dest, packages['web-adapter']);
};
exports.onAfterBuild = onAfterBuild;
const dealHtml = async function (platform, dest, params) {
    if (!params.open) {
        return;
    }
    console.info(constant_1.PACKAGE_NAME, '网页适配开始');
    let needAdapter = ModeType.EXACT_FIT != params.mode && (!params.pcIgnore || !params.mobileIgnore);
    if (needAdapter) {
        if (params.pcIgnore) {
            needAdapter = '!isPC';
        }
        else if (params.mobileIgnore) {
            needAdapter = 'isPC';
        }
    }
    let ignoreState = params.mode == ModeType.EXACT_FIT || (params.pcIgnore && params.mobileIgnore);
    if (!ignoreState) {
        if (params.mobileIgnore || params.pcIgnore) {
            ignoreState = false;
        }
        else if (params.pcIgnore) {
            ignoreState = 'isPC';
        }
        else {
            ignoreState = '!isPC';
        }
    }
    let needFull = params.pcFull && params.mobileFull;
    if (!needFull) {
        if (params.pcFull) {
            needFull = 'isPC';
        }
        else if (params.mobileFull) {
            needFull = '!isPC';
        }
        else {
            needFull = false;
        }
    }
    let widthState;
    let heightState;
    if (ModeType.NONE == params.mode) {
        widthState = `${params.width}px`;
        heightState = `${params.height}px`;
    }
    else {
        let fitWidth = false;
        if (ModeType.FIXED_HEIGHT == params.mode) {
            fitWidth = false;
        }
        else if (ModeType.FIXED_WIDTH == params.mode) {
            fitWidth = true;
        }
        else if (ModeType.NO_BORDER == params.mode) {
            fitWidth = `(widthRatio > heightRatio)`;
        }
        else if (ModeType.SHOW_ALL == params.mode) {
            fitWidth = `(widthRatio < heightRatio)`;
        }
        widthState = `${fitWidth} ? '100%' : ${params.width} * heightRatio`;
        heightState = `${fitWidth} ? ${params.height} * widthRatio : '100%'`;
    }
    let jsCode = `<script type="text/javascript">
    (function () {

        var curWidth = 0;
        var curHeight = 0;

        function isFullScreen() {
            return !!(
                document.fullscreen ||
                document.mozFullScreen ||
                document.webkitIsFullScreen ||
                document.webkitFullScreen ||
                document.msFullScreen
            );
        }

        function requestFullScreen() {
            var element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            }
        }

        function exitFullscreen() {
            var element = document.documentElement;
            if (element.exitFullscreen) {
                element.exitFullscreen();
            } else if (element.mozCancelFullScreen) {
                element.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                element.webkitCancelFullScreen();
            }
        }

        var userAgent = navigator.userAgent;
        var agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var isPC = true;
        for (var v = 0; v < agents.length; v++) {
            if (userAgent.indexOf(agents[v]) > 0) {
                isPC = false;
                break;
            }
        }

        document.body.style.margin = "0 auto";
        document.body.style.overflow = "auto";
        var gameDiv = document.getElementById('GameDiv');
        gameDiv.style.margin = '0 auto';
        gameDiv.style.position = 'relative';

        var gameCanvas = document.getElementById('GameCanvas');

        var splash = document.getElementById('splash');
        if (splash) {
            document.body.removeChild(splash);
            gameDiv.appendChild(splash);
        }

        function setGameDiv() {
            var position = 'absolute';
            var clientWidth = document.documentElement.clientWidth;
            var clientHeight = document.documentElement.clientHeight;
            var gameWidth;
            var gameHeight;
            if (${needAdapter}) {
                if (curWidth == clientWidth && curHeight == clientHeight) {
                    return;
                }
                var widthRatio = clientWidth / ${params.width};
                var heightRatio = clientHeight / ${params.height};
                gameWidth = ${widthState};
                gameHeight = ${heightState};
                if(gameWidth != '100%') {
                    if(gameWidth > clientWidth) {
                        position = 'relative';
                    }
                    gameWidth += 'px';
                }
                if(gameHeight != '100%') {
                    if(gameHeight > clientHeight) {
                        position = 'relative';
                    }
                    gameHeight += 'px';
                }
            } else {
                gameWidth = '100%';
                gameHeight = '100%';
            }
            document.body.style.position = position;
            gameDiv.style.width = gameWidth;
            gameDiv.style.height = gameHeight;
        }

        setGameDiv();

        document.body.addEventListener('click', function () {
            if (${needFull} && !isFullScreen()) {
                requestFullScreen();
            }
        }, false);

        gameCanvas.addEventListener('touchend', function () {
            if (${needFull} && !isFullScreen()) {
                requestFullScreen();
            }
        }, false);

        window.onresize = function () {
            setGameDiv();
        }
    })();
</script>`;
    const htmlPath = (0, mfs_1.join)(dest, 'index.html');
    let data = (0, mfs_1.readFileSync)(htmlPath, "utf8");
    if (null != params.title && '' != params.title) {
        data = data.replace(/<title>[\S|\s]*<\/title>/g, `<title>${params.title}</title>`);
    }
    const idx = data.indexOf('<script');
    const newStr = data.slice(0, idx) + '\n' + jsCode + '\n' + data.slice(idx - 1);
    (0, mfs_1.writeFileSync)(htmlPath, newStr);
    // 获取settings脚本
    const srcFiles = (0, mfs_1.readdirSync)((0, mfs_1.join)(dest, 'src'));
    for (let i = srcFiles.length - 1; i >= 0; i--) {
        if ((0, mfs_1.extname)(srcFiles[i]) === '.json') {
            const settingPath = (0, mfs_1.join)(dest, 'src', srcFiles[i]);
            const settingData = JSON.parse((0, mfs_1.readFileSync)(settingPath, 'utf-8'));
            settingData.screen.exactFitScreen = false;
            (0, mfs_1.writeFileSync)(settingPath, JSON.stringify(settingData));
            break;
        }
    }
    console.info(constant_1.PACKAGE_NAME, '网页适配结束');
};
