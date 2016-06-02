// var link = document.getElementById("start");

// link.addEventListener("click", function(){
//   chrome.tabs.create({'url': 'http://120.117.2.135/CourSel/Pages/CourseMap/CourseMap.aspx?helper=1'});
// }, false);


// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//     if (request.greeting == "hello")
//       sendResponse({farewell: "goodbye"});
// });
// $('.secondscan').text(JSON.stringify(data, undefined ,2))


// chrome.runtime.sendMessage({get: "firstscan"}, function(res) {
//   dumpdata('first',res.status)
// })

// chrome.runtime.sendMessage({get: "secondscan"}, function(res) {
//   dumpdata('second',res.status)
// })

$(document).ready(function(){
  chrome.runtime.sendMessage({get: "secondscan"}, function(res) {
    var getdata = res.status
    new Vue({
      el: '.container',
      data: {gPussy: getdata.專業學程門檻, gPenis: getdata.分類通識審查, gFuck: getdata.必修科目審查, gPorn: getdata.必修學分審查, gXxx: getdata.選修學分審查, gSex: getdata.總學分審查},
      computed: {
        gPornRec:function(){
          var orzDone = this.gPorn.info.done;
          var orzAll = this.gPorn.info.all;
          orzAll = 100 / orzAll;
          orzDone = orzDone * orzAll;
          return orzDone;
        },
        gXxxRec:function(){
          var orzDone = this.gXxx.info.done;
          var orzAll = this.gXxx.info.all;
          orzAll = 100 / orzAll;
          orzDone = orzDone * orzAll;
          return orzDone;
        },
        gSexRec:function(){
          var orzDone = this.gSex.info.done;
          var orzAll = this.gSex.info.all;
          orzAll = 100 / orzAll;
          orzDone = orzDone * orzAll;
          return orzDone;
        }
      }
    })
  })
})
