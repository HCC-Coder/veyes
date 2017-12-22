const Freewall = require('freewall').Freewall;
require('promise');
require('jquery.marquee');

var insta_show = false;
var column_width = null;

ipcRenderer.on('insta_show', (event, message) => {
  insta_show = message;
  column_width = $('body').width()/$column_number;

  if (message) {
    $('#insta-gallery').show();
  } else {
    $('#insta-gallery').hide();    
  }
});

(function(EL, $, undefined){

  EL.Data = {
    'hashtags' : ['hccjb']
  };

}(window.EL = window.EL || {}, jQuery));


(function(EL, $, undefined){

  EL.Box = {

    insta_obj : [],

    filter : function(insta_objects) {

      var new_items = [];

      for(var i in insta_objects) {

        var is_repeated = false;
        var item = insta_objects[i];

        for(var j in EL.Box.insta_obj) {
          var raw_item = EL.Box.insta_obj[j];

          if (raw_item.id == item.id) {
            is_repeated = true;
          }
        }
        if (is_repeated == false) {
          new_items.push(item);
          EL.Box.insta_obj.push(item);
        }
      }

      // EL.Box.insta_obj.push.apply(EL.Box.insta_obj, new_items);

      return new_items;
    }
  };

}(window.EL = window.EL || {}, jQuery));
(function(EL, $, undefined){
  
  EL.Fetcher = {

    get_image : function(code, column_width, callback) {

      EL.Insta.fetch_post(code, function(insta_obj_str) {

        var insta_obj = EL.Insta.parse_post(insta_obj_str);


        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {

          var nheight = column_width/insta_obj.dimensions.width*insta_obj.dimensions.height;
          var img = new Image();
          img.setAttribute('style', 'width:'+column_width+'px;height:'+nheight+'px');
          img.iid = insta_obj.id;
          img.caption = insta_obj.edge_media_to_caption.edges[0].node.text + ' ✎' + insta_obj.owner.full_name;

          img.setAttribute('src', URL.createObjectURL(xhr.response));
          callback({
            obj : img,
            type : 'img'
          });
        }
        xhr.open('GET', insta_obj.display_url, true);
        xhr.send();

      });
    },

    get_video : function(code, column_width, callback) {

      EL.Insta.fetch_post(code, function(insta_obj_str){

        var insta_obj = EL.Insta.parse_post(insta_obj_str);

        var nheight = column_width/insta_obj.dimensions.width*insta_obj.dimensions.height;

        console.log(insta_obj);

        var video = $('<video />').attr({
          src : insta_obj.video_url,
          iid : insta_obj.id,
          caption : insta_obj.edge_media_to_caption.edges[0].node.text + ' ✎' + insta_obj.owner.full_name,
          width : column_width,
          height : nheight,
          autoplay : 'autoplay',
          muted : 'muted',
          loop : 'loop'
        });
        callback({
          obj : video,
          type: 'video'
        });
      });
    }
  };
})(window.EL = window.EL || {}, jQuery);

$.fn.random = function()
{
  var ret = $();

  if(this.length > 0)
    ret = ret.add(this[Math.floor((Math.random() * this.length))]);

  return ret;
};
(function(EL, $, undefined){

  EL.Wall = {

    prepend_video : function(video) {

      console.log(video);
      $(video).attr('id', 'iid'+video.attr('iid'));
      var html = $('<div class="brick"></div>');
      html.append($(video));
      html.append($('<div class="info marquee">'+video.attr('caption')+'</div>'));
      $('#insta-gallery').prepend(html[0].outerHTML);

    },

    prepend_image : function(image) {

      $(image).attr('id', 'iid'+image.iid);
      var html = $('<div class="brick"></div>');
      html.append($(image));
      html.append($('<div class="info marquee">'+image.caption+'</div>'));
      $('#insta-gallery').prepend(html[0].outerHTML);

    },


    reset_wall : function(column_width) {

      $('.brick').dblclick(function(){
        $(this).remove();
        wall.fitWidth();
      });

      $('.brick:gt(58)').remove();

      wall.reset({
        selector: '.brick',
        animate: true,
        cellW: column_width,
        cellH: 'auto',
        delay: 100,
        gutterX: 0,
        gutterY: 0,
        onResize: function() {
          wall.fitWidth();
        }
      });
      wall.fitWidth();
      // $("html, body").animate({ scrollTop: $(document).height() }, 1000);
      // console.log('finally');

      console.log('marquee');

      $('.info.marquee').marquee();
      $('.info.marquee').removeClass('marquee');
    }

  };

})(window.EL = window.EL || {}, jQuery);

(function(EL, $, undefined){

  EL.Insta = {

    fetch_post : function(code, callback) {
      var target_url = 'https://www.instagram.com/p/' + code;
      EL.Insta._fetch(target_url, callback);
    },

    fetch_hashtag : function(hashtag, callback) {
      var target_url = 'https://www.instagram.com/explore/tags/' + hashtag;
      EL.Insta._fetch(target_url, callback);
    },

    _fetch : function(target_url, callback) {
      $.get(target_url,{}, function(sc) {

        // search and eval object str : in var insta_obj
        var insta_obj_str;
        var lines = sc.split('\n');
        for(var i = lines.length-1; i >= 0; i--) {
          if (lines[i].indexOf('window._sharedData') !== -1) {
            insta_obj_str = lines[i];
            break;
          }
        }
        callback(insta_obj_str);
      });
    },

    parse_nodes : function(insta_obj_str) {

      var insta_objs = EL.Insta._parse(insta_obj_str);
      return insta_objs.entry_data.TagPage[0].tag.media.nodes;
    },

    parse_post : function(insta_obj_str) {

      var insta_objs = EL.Insta._parse(insta_obj_str);
      return insta_objs.entry_data.PostPage[0].graphql.shortcode_media;

    },

    _parse : function(insta_obj_str) {

      return JSON.parse(insta_obj_str.split(' = ')[1].split(';</script')[0]);

    }
  };

}(window.EL = window.EL || {}, jQuery));


/// bootstrap

// 5, 6, 7, 8
$column_number = 6;

(function(EL, $, undefined){

  $(function(){

    // hash tag from url

    // console.log(EL.Data.hashtags);

    // map column width
    column_width = $('body').width()/$column_number;

    // new wall
    wall = new Freewall("#insta-gallery");

    // insta_connect
    if (insta_show)
      insta_connect(column_width);

    // insta_connect loop timer
    setInterval(function(){
      if (insta_show) {
        insta_connect(column_width);
      }
    }, 5000);

    // animation
    setInterval(function(){
      var target = $('img').not('.animated').not('.notanimate').random()
      target.addClass('animated');
      setTimeout(function(){
        target.removeClass('animated');
      }, 7000);

    }, 2000);

  });

  function insta_connect(column_width) {

    // fetch insta
    // var promise_fetch_insta = new Promise(function(callback){
    //   EL.Insta.fetch_hashtag(EL.Data.hashtags[0], callback)
    // });

    var promise_fetch_insta = Promise.all(EL.Data.hashtags.map(function(hashtag){
        return new Promise(function(callback){
          EL.Insta.fetch_hashtag(hashtag, callback);
        });
    }));

    promise_fetch_insta.then(function(result){

      var insta_objects = [];

      // parse insta
      for(var i in result) {
        var insta_objects = insta_objects.concat(EL.Insta.parse_nodes(result[i]));
      }

      //filter
      var new_insta_objects = EL.Box.filter(insta_objects);

      // append wall
      if (new_insta_objects.length != 0) {

        Promise.all(new_insta_objects.reverse().map(function(insta_obj){
          return new Promise(function(callback){

            if (insta_obj.is_video) {

              EL.Fetcher.get_video(insta_obj.code, column_width, callback);

            } else {
              EL.Fetcher.get_image(insta_obj.code, column_width, callback);
            }

          });
        })).then(function(result){
          console.log(result);

          console.log('done fetch ' + result.length + ' imgs');
          for(var i in result) {
            var item = result[i];
            if (item.type === 'img') {
              EL.Wall.prepend_image(item.obj);
            } else {
              EL.Wall.prepend_video(item.obj);
            }
          }
          console.log('done append');
          EL.Wall.reset_wall(column_width);
        });
      }
    });
  };

}(EL, jQuery));

