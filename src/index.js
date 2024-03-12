const fs = require('fs');
const request = require('request');
const AdmZip = require('adm-zip');

const tempZip = 'temp.zip';


// 下载zip文件
function downloadZip(url,cookie, outputPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(outputPath);

        request(url, {
            headers: {
                cookie
            }
        })
            .pipe(file)
            .on('finish', () => {
                file.close(resolve);
            })
            .on('error', (error) => {
                fs.unlink(outputPath, () => reject(error));
            });
    });
}

// 解压zip文件
function extractZip(zipPath, outputPath) {
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();
    zipEntries.forEach(zipEntry => {
        zip.extractEntryTo(zipEntry.entryName, outputPath, false, true);
    });
}

/**
 * 下载iconfont并解压到指定文件夹
 * @param {object} obj 
 * @param {string} obj.url - iconfont的下载地址
 * @param {string} obj.cookie - iconfont的下载需要的cookie
 * @param {string} obj.outputPath - iconfont解压的文件夹
 */
async function download({
    url,
    cookie,
    outputPath
}) {
    if(!url || !cookie || !outputPath){
        console.error('')
        return
    }
    try {
        console.log('Downloading...');
        await downloadZip(url,cookie, tempZip);
        console.log('Download complete!');
        
        console.log('Extracting...');
        extractZip(tempZip, outputPath);
        console.log('Extraction complete!');

        // 删除临时文件
        fs.unlinkSync(tempZip);

        console.log('Process completed successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {
    download
}


