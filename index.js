let fs = require('fs')
let $ = require('jquery')

fs.readdir('resources/videos', function(err, items) {
    if ($.inArray(items[i].split('.').pop(), ['mov', 'mp4']) == 1) {
  		let item_html = `<div> ${items[i]} </div>`
  		$('body').append(item_html)
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