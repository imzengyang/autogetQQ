require('chromedriver')
let fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const {
    Builder
} = require('selenium-webdriver')

let yourQQ = 'xxxxx'
let yourQQgroup = 'xxxxx'
let driver = new Builder().forBrowser('chrome').build();

async function init() {
    await driver.get('https://qun.qq.com/member.html#gid=`${yourQQgroup}`')

    await driver.manage().window().maximize();
    await driver.sleep(1000);
    await driver.switchTo().frame('login_frame');
    await driver.findElement({
        id: 'img_out_`${yourQQ}`'
    }).click();

    await driver.sleep(2000);
}

async function run(QQnum) {
    const csvWriter = createCsvWriter({
        path: './file' + QQnum + '.csv',
        header: [{
                id: 'nickname',
                title: 'nickname'
            },
            {
                id: 'manager',
                title: 'manager'
            },
            {
                id: 'QQ',
                title: 'QQ'
            },
            {
                id: 'sex',
                title: 'sex'
            },
            {
                id: 'age',
                title: 'age'
            }

        ]
    });

    await driver.get('https://qun.qq.com/member.html#gid=' + QQnum);
    await driver.navigate().refresh();
    await driver.sleep(1000);

    let qqmem = await driver.findElement({
        id: 'groupMemberNum'
    }).getText();
    qqmem = parseInt(qqmem)
    let count = Math.ceil(qqmem / 20)
    for (let index = 0; index < count; index++) {
        await driver.executeScript('document.querySelector(".footer").scrollIntoView()');
        await driver.sleep(1000);
    }

    // collection data
    let alluserinfo = [];

    let alluser = await driver.findElements({
        css: 'tr.mb'
    })
    for (let index = 0; index < alluser.length; index++) {
        let userinfo = {};

        const nickname = await alluser[index].findElement({
            css: 'td.td-user-nick'
        }).getText();
        userinfo.nickname = nickname;

        let classvalue = await alluser[index].findElement({
            css: 'td.td-user-nick>a>i'
        }).getAttribute('class')
        if (classvalue.includes('icon-group-manage') || classvalue.includes('icon-group-master')) {
            userinfo.manager = true
        } else {
            userinfo.manager = false
        }
        const QQ = await alluser[index].findElement({
            css: "td:nth-child(5)"
        }).getText();
        userinfo.QQ = QQ;
        const sex = await alluser[index].findElement({
            css: 'td:nth-child(6)'
        }).getText();
        userinfo.sex = sex;
        const age = await alluser[index].findElement({
            css: 'td:nth-child(7)'
        }).getText();
        userinfo.age = age;

        alluserinfo.push(userinfo)

    }

    // 写入csv文件
    csvWriter.writeRecords(alluserinfo) // returns a promise
        .then(() => {
            console.log(QQnum + '...Done');
        });
}

async function main() {
    await init();
    let qqgroups = ['xxxxxx','xxxxx']

    for (let i=0;i<qqs.length; i++){
        await run(qqs[i])
    }
}

main()