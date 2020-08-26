

var fileNames = [];
var randomId = [];
var FORDLER = 'htmlFiles';

$(document).ready(function () {

  $('#toc .sectlevel1 > li > a').removeAttr("href");
  // a링크 클릭시 애니메이션 효과 및 위치 잡아주기
  $('#toc .sectlevel2 > li > a, #toc .sectlevel3 > li > a').click(function () {
    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top - 110
    }, 300);
    return false;
  });


  //content 지우고, contetns 넣기
  $('#content').remove();
  $('#footer').remove();
  $('body').append('<div id="contents"></div>');


  // 헤더에 메뉴바 넣기
  var html = '';
  html += '<div id=menubar>';
  html += '<div id="menues">';
  html += '<a id="home" >';
  html += '<img src="icons/title.png" alt="title" />';
  html += '</a>';
  html += '<a id="down">';
  html += '<img src="icons/down.png" alt="down" />';
  html += '</a>'
  html += '<a id="search">';
  html += '<img src="icons/search.png" alt="search" />';
  html += '</a>';
  html += '<a id="aworks">';
  html += '<img src="icons/aworks.png" alt="aworks" />';
  html += '</a>';
  html += '</div>';
  html += '</div>';
  $('#header').prepend(html);

  //a. 아이콘 누르면 a.wors 사이트로 가기
  $('#aworks').click(function () {
    window.open("https://aworksrpa.com");
  });

  // 돋보기 누르면 검색창 깜빡이기
  $('#search').click(function () {
    $('#keyword').focus();
  });

  //footer 넣기
  $('body').append('<div id="last"><a href=#>ⓒ2020 A.WORKS.All rights resevers.</a></div>');

  // 목차 라는 글자 없애기
  $('#toc > #toctitle').remove();

  //header뒤에 형제 노드 추가
  $('#header').append('<div id=first_page><a id="gotoHome">A.WORKS 사용자 메뉴얼 (v2.0.0)</a></div>');

  // 스크롤 맨 위로 올려주는 버튼
  $('body').append('<a id="gotoTop"><img src="icons/top.png" /></a>')
  $('#gotoTop').click(function () {
    $('html, body').animate({ scrollTop: '0' }, 300);
  });


  $('#toc').find('strong').contents().unwrap().wrap('<span></span>');

  // 너비 조정 버튼
  // $('#toc').append('<button id="widthBtn">width</button>');
  $('#widthBtn').css({ position: 'fixed', marginLeft: '288px' });
  $('#widthBtn').draggable({
    cancel: false, axis: "x", scroll: false, drag: function (event, ui) {

      var buttonOriginOffSet = $(this).offset().left;
      $('#toc').css('width', buttonOriginOffSet + 28);
      // $('#contents').css('display', 'block');
      $('#contents').css('marginLeft', buttonOriginOffSet + 28);
    }
  });
  $('#widthBtn').click(function () {
    console.log('btn');
  });


  //홈 버튼 누르면 목차 사라지고 나타나기
  var toggleHome = false;
  $('#header #home').click(function () {
    $('#toc').toggle();
    if (toggleHome === false) {
      $('#first_page > a, #last > a').css('paddingLeft', '30px');
      $('#wrappingContents').css('marginLeft', '0px');
      toggleHome = true;
    } else {
      $('#first_page > a, #last > a').css('paddingLeft', '385px');
      $('#wrappingContents').css('marginLeft', '357px');
      toggleHome = false;
    }
    // console.log($('#contents')[0].style.marginLeft);
  });

  // 검색 하는 input 창 + 버튼 넣기
  var inputHTML = '<div id="input-form"><input type ="text" id ="keyword" title="F4를 누르면 다음 검색어로 이동" placeholder="검색" /><button id="searching"><img src="icons/search.png" /></button></div>'
  $('#toc').prepend(inputHTML);

  // 다운로드 하는 기능
  $('#down').click(function (e) {
    e.preventDefault();
    window.open('./pdfFile/test.pdf');
  });

  //input box title tooltip
  $('#keyword').tooltip({ position: { my: "center bottom", at: "center top" } });
  // $('.ui-helper-hidden-accessible').remove();
  // JSON 파일 불러오기
  $('#contents').wrap("<div id='wrappingContents'></div>");
  var jsonLocation = 'filename.json';
  $.getJSON(jsonLocation, function (data) {

    var allData = JSON.parse(data);
    for (var i = 0; i < allData.length; i++) {
      var prev = '';
      var now = '';

      (function (i) {
        $.ajax({
          type: 'GET',
          url: ' ' + FORDLER + '/' + allData[i].name,
          async: false,
        })
          .done(function () {
            // console.log(window.location);
            if (openFile($(this)[0].url)) {
              fileNames.push($(this));
              randomId.push(Math.random().toString(36).substr(2, 9));
              // console.log(fileNames);
            };

            $('.sectlevel1 > li > a').wrap("<div></div>");
            $('.sectlevel1 > li > div').eq(i).attr('id', 'cl' + randomId[i]);
            $('.sectlevel1 > li > ul').eq(i).hide();
            $('.sectlevel1 > li > div').eq(i).click(function (e) {
              now = e.target.id;
              $(this).next().slideToggle();
              $(this).parents('li').attr('class', 'liWhite');
              $(".sectlevel1 > li > div").not(this).next().slideUp(300);
              $(".sectlevel1 > li > div").not(this).parent().removeAttr('class', 'liWhite');

            });
            // 클릭하면 페이지 로드, 단 페이지가 이미 로드 된 상태면 로드 안함

            $('#cl' + randomId[i]).on('click', function () {
              var currentH3Hash = [];
              var currentH4Hash = [];
              var h3selector = $(this).find('h3').selector;
              var h4selector = $(this).find('h4').selector;
              var current = $(this).next();
              current.children().children('a').each(function (idx, item) {
                currentH3Hash.push(decodeURI(item.hash.slice(1)));
              });
              current.children().children().children('li').children().each(function (idx, item) {
                currentH4Hash.push(decodeURI(item.hash.slice(1)))
              });
              // console.log(currentH4Hash);
              if (prev === '') {
                $('#contents').load(fileNames[i][0].url.slice(1) + ' ' + '#content', function () {
                  $('#content a').attr('target', '_blank');
                  var htagid =
                  {
                    h3tagid: getHtagid($(this).find('h3')),
                    h4tagid: getHtagid($(this).find('h4'))
                  };
                  changeHtagId(currentH3Hash, htagid.h3tagid, h3selector);
                  changeHtagId(currentH4Hash, htagid.h4tagid, h4selector);
                  scrollTop();
                });
              } else {
                if (prev === now) {
                  scrollTop();
                  return;
                } else {
                  $('#contents').load(fileNames[i][0].url.slice(1) + ' ' + '#content', function () {
                    $('#content a').attr('target', '_blank');
                    var htagid =
                    {
                      h3tagid: getHtagid($(this).find('h3')),
                      h4tagid: getHtagid($(this).find('h4'))
                    };
                    changeHtagId(currentH3Hash, htagid.h3tagid, h3selector);
                    changeHtagId(currentH4Hash, htagid.h4tagid, h4selector);
                    scrollTop();
                  });
                };
              };
              prev = now;
            });
          });
      })(i);
    };
    $('#contents').load(fileNames[0][0].url.slice(1) + ' ' + '#content', function () {
      $('#content a').attr('target', '_blank');
      scrollTop();
    });
    $('#content a').attr('target', '_blank');
    $('#gotoHome').bind('click', function () {
      $('#cl' + randomId[0]).trigger('click');
    });
  });

  // load된 파일의 h3,h4 id 가져오기
  function getHtagid(hid) {
    var htagid = [];

    hid.each(function (idx, val) {
      htagid.push(val.id);
    });
    return htagid;
  };

  // h3,h4 id 변경 함수
  function changeHtagId(currentHash, htagid, selector) {

    if (selector === 'h3') {
      for (var k = 0; k < currentHash.length; k++) {
        if (htagid[k] !== currentHash[k]) {
          $('#content h3')[k].id = currentHash[k];
        }
      };
    } else {
      for (var k = 0; k < currentHash.length; k++) {
        if (htagid[k] !== currentHash[k]) {
          $('#content h4')[k].id = currentHash[k];
        }
      };
    }
  }


  // html파일만 가져오기
  function openFile(file) {
    var extension = file.substr((file.lastIndexOf('.') + 1));
    switch (extension) {
      case 'html':
        return true;
      default:
        return false;
    }
  };

  // 검색 및 하이라이트 기능
  var searchedText = [];
  var searchText = function () {
    num = 0;
    searchedText = [];
    $('#contents').unmark(localStorage.getItem('text'));
    var search = $('#keyword').val();
    var regex = new RegExp(search, 'gi');
    var regexedText = search.replace(regex, search);
    if (regexedText === '') {
      $('#content').unmark(localStorage.getItem('text'));
      return;
    } else {
      $('#content').mark(regexedText, {
        'element': 'span',
        'className': 'hi'
      });
      searchedText.push($('.hi'));
      localStorage.setItem('text', regexedText);
    }
  };


  // 검색 버튼 클릭 혹은 엔터 칠 경우 
  $(document).ready(function () {
    $('#searching').on('click', function () {
      searchText();
      if (searchedText.length && searchedText[0].length !== 0) {
        scrollToMiddle(searchedText[0][0]);
      }
    });
    $('#keyword').keydown(function (e) {
      if (e.keyCode === 13) {
        searchText();
        if (searchedText.length && searchedText[0].length !== 0) {
          scrollToMiddle(searchedText[0][0]);
        }
      }
    });
  });

  function scrollToMiddle(hilighted) {

    var elem_position = $(hilighted).offset().top;
    var window_height = $(window).height();
    var y = elem_position - window_height / 2;

    window.scrollTo(0, y);

  }

  // 다음 검색된 텍스트로 넘어가기 'F4'버튼 눌러야함
  var num = 0;
  var prevFind = undefined;
  var nowFind = undefined;
  $('body').on('keydown', function (e) {
    if (e.which === 115) {
      e.preventDefault();
      if (searchedText[0] && searchedText[0].length !== 0) {
        nowFind = searchedText[0][num];
        nowFind.style.backgroundColor = 'red';
        scrollToMiddle(nowFind);
        // if (searchedText[0].length === 1) {
        //   return alert('첫번째이자 마지막입니다.')
        // }
      } else {
        return;
      }
      if (prevFind !== undefined) {
        prevFind.style.backgroundColor = 'yellow';
      };
      prevFind = nowFind;
      num++;
      if (num === searchedText[0].length) {
        num = 0;
      }
    };
  })
});



// 스크롤 최상단으로 가게 하기
function scrollTop() {
  $('html').scrollTop(0);
};

