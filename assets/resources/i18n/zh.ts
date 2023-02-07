
const win = window as any;

export const languages = {
    // Data
    "1": "你好"
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zh = languages;
