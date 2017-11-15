let fs = require('fs')
let $ = require('jquery')

fs.readdir('resources/videos', function(err, items) {
  for(var i in items)
  {   
    if ($.inArray(items[i].split('.').pop(), ['mov', 'mp4']) == 1) {
      let item_html = `<tr><td> ${items[i]} </td><td> <button class="ui mini icon button"><i class="add icon"></i></button> </td></tr>`
      $('#files').append(item_html)
    }
  }
})

$(function(){
  $('#btn-start').click(function(){

    const electron = require('electron')
    const eScreen = electron.screen
    let displays = eScreen.getAllDisplays()

    for (let i in displays) {
      let option_html = `<option> ${parseInt(i)+1}. ${displays[i].size.height} </option>`
      $('#show-screen').append(option_html)
    }

    console.log(displays);
  })
})