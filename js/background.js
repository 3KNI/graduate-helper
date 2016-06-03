var firstscan, secondscan, query

chrome.browserAction.onClicked.addListener(function () {
  var url = 'http://120.117.2.135/CourSel/Pages/CourseMap/CourseMap.aspx?helper=1'
  var proturl = 'http://portal.stust.edu.tw/StudentPortfolio/'
  chrome.tabs.create({url: url}, function(tab){

    setTimeout(function(){
      chrome.tabs.get(tab.id, function(tab){
        if(tab.url != url){
          var checking = setInterval(function(){
            chrome.tabs.get(tab.id, function(tab){

              if(tab.url == 'http://120.117.2.135/CourSel/Board.aspx') {
                clearInterval(checking)
                chrome.tabs.update(tab.id,{url: proturl})
                setTimeout(function(){
                  chrome.tabs.get(tab.id, function(tab){
                    if(tab.url != proturl){
                      var protcheck = setInterval(function(){
                        chrome.tabs.get(tab.id, function(tab){
                          if(tab.url == proturl){
                            clearInterval(protcheck)
                            chrome.tabs.create({url: url})
                            chrome.tabs.remove(tab.id)
                          }
                        })
                      }, 100)
                    }else{
                      clearInterval(protcheck)
                      chrome.tabs.create({url: url})
                      chrome.tabs.remove(tab.id)
                    }
                  })
                },1000)

              }
            })

          }, 100)
        }else{
          chrome.tabs.update(tab.id,{url: proturl})
          setTimeout(function(){
            chrome.tabs.get(tab.id, function(tab){
              if(tab.url != proturl){
                var protcheck = setInterval(function(){
                  chrome.tabs.get(tab.id, function(tab){
                    if(tab.url == proturl){
                      clearInterval(protcheck)
                      chrome.tabs.create({url: url})
                      chrome.tabs.remove(tab.id)
                    }
                  })
                }, 100)
              }else{
                clearInterval(protcheck)
                chrome.tabs.create({url: url})
                chrome.tabs.remove(tab.id)
              }
            })
          },1000)
        }
      })
    }, 1000)
  })
})

// GET
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.get){
      var get = request.get

      // Get Listener
      if(get == 'firstscan'){
        sendResponse({status: firstscan})
      }

      if(get == 'secondscan'){
        sendResponse({status: secondscan})
      }
    }
})

// POST
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.post){
      var post = request.post

      // Post Listener
      if(post.firstScan){
        firstscan = ScanFormatter(post.firstScan)
        secondscan = $.extend( true, {}, firstscan )
        secondscan = undoneTesting(secondscan)
        if(secondscan){
          chrome.tabs.update(sender.tab.id, {url: "result.html"})
        }else{
          alert('畢業資料審查中，無法執行畢業助手。')
        }
      }
    }
})

// UPDATE
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.update){
      var p = []
      if ( !secondscan['必修科目審查'].info.done){
        secondscan['必修科目審查'].info.done = []
      }
      var p2 = secondscan['必修科目審查'].info.done
      var u = request.update

      if(u.status == 'ok'){
        $.each(secondscan['必修科目審查'].info.undone, function(index, value){
          if(value.name.split(' ')[1] != u.name){
            p.push(value)
          }else{
            p2.push(value)
          }
        })
        secondscan['必修科目審查'].info.undone = p
      }

      chrome.tabs.remove(sender.tab.id)
    }
})

function ScanFormatter (data){
  $.each(data, function(index, value){
    switch(value.rule){

      case "專業學程門檻" :
        var prog = value.info.split('：')
        if(prog[0] == '已完成系所承認學程'){
          data[index].info = {done: { name: prog[1] } }
        }
        break

      case "分類通識審查" :
        var sub = value.info.split('已完成：')
        var undone = sub[0].split('：')[1]
        // if(undone){
        //   undone = undone.split(',')
        // }
        if(undone){
          undone = undone.split(',')
          $.each(undone, function(index, value){
            undone[index] = { name: value }
          })
        }
        var done = sub[1].split(',')
        $.each(done,function(index, value){
          done[index]={ name: value.replace(/^\s+|\s+$/g,'') }
        })
        data[index].info = { undone: undone, done: done }
        break

      case "必修科目審查" :
        var sub = value.info.split('：')
        if(sub[0] == '時序表未完成'){
          $.each(sub[1].split(','),function(index, value){
            sub[index]={ name: value.replace(/^\s+|\s+$/g,'') }
          })
          data[index].info = {undone: sub}
        }
        break

      case "總學分審查" :
      case "必修學分審查" :
        var obligatory = value.info.split('：')[1].split('/')
        data[index].info = {done: obligatory[0], all: obligatory[1]}
        break

      case "選修學分審查" :
        var e = value.info.split(',')
        var elective = e[0].split('：')[1].split('/')
        var deny = e[1].split('：')[1]
        data[index].info = { done: elective[0], all: elective[1], deny: deny }
        break

    }
  })
  return data
}

function undoneTesting(data){
  // chrome.tabs.update(sender.tab.id, {url: "result.html"})
  // Testing each 必修科目審查's item whether really undone
  try{

    query = $.extend( true, [], data['必修科目審查'].info.undone)
    $.each(query, function(index, value){
      query[index].name = value.name.split(' ')[1]
    })
    $.each(query, function(index, value){
      switch(value.name) {
        case '外語能力檢定': // 01D112 外語能力檢定
          chrome.tabs.create({url: 'http://portal.stust.edu.tw/StudentPortfolio/Pages/stud_lang_grad/stud_lang_grad.aspx?helper=1', active:false})
          break
        case '資訊基本能力檢核': // 01D12Q 資訊基本能力檢核
          chrome.tabs.create({url: 'http://portal.stust.edu.tw/StudentPortfolio/Pages/InfoAbility/InfoAbility.aspx?helper=1', active:false})
          break
        case '專業證照': // 30D167 專業證照
          chrome.tabs.create({url: 'http://portal.stust.edu.tw/StudentPortfolio/Pages/LicenseStudent/LicenseStudentPage.aspx?helper=1', active:false})
          break
        case '校外實習': // 30D1CD 校外實習
          chrome.tabs.create({url: 'http://portal.stust.edu.tw/StudentPortfolio/Pages/Manager/Student_Intern_data.aspx?helper=1', active:false})
          break
      }
    })

    return data

  }
  catch(err){

    return false

  }
}