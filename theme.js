let fs = require('fs')
function readTheme() {
  fs.readFile('./themes.json', function(err, data) {
    if (err) console.error(err)
    const themes = JSON.parse(data.toString())
    const folder = './assets/css'
    fs.stat(folder, function(err, stats) {
      if (err && err.code === 'ENOENT') {
        fs.mkdir(folder, err => {
          if (err) console.log(err)
        })
      }
    })
    themes.forEach(x => {
      let fileName = `${folder}/theme.${x.displayName}.less`
      fs.writeFile(fileName, '// out: false', err => {
        if (err) console.log(err)
        let fWrite = fs.createWriteStream(fileName, {
          flags: 'a'
        })
        fWrite.write('\r\n')
        fWrite.write("@import 'base.less';")
        fWrite.write('\r\n')
        fWrite.write(':root {')
        fWrite.write('\r\n')
        fWrite.write(`--primary-hue: ${x.hue};`)
        fWrite.write('\r\n')
        fWrite.write(`--primary-saturation: ${x.saturation};`)
        fWrite.write('\r\n')
        fWrite.write(`--primary-lightness: ${x.lightness};`)
        fWrite.write('\r\n')
        fWrite.write('}')
        fWrite.end()
      })
    })
  })
}
readTheme()
