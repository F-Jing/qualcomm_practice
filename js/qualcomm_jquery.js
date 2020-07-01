const PAGE = {
  data: {
    navigatorBarIdArr: ['section-1', 'section-2', 'section-3', 'section-4'],
    chapterIdArr: ['chapter-one', 'chapter-two', 'chapter-three', 'chapter-four', 'chapter-five', 'chapter-six'],
    chapterContent: [[['课程介绍'], ['5分钟'], ['第一节']], [['为何要使用异步化', '异步化设计所面临的挑战', 'RocketMQ简介及环境搭建', 'RocketMQ简介及环境搭建'], ['40分钟', '120分钟', '28分钟', '30分钟'], ['第二节']], [['a', 'b', 'c', 'd', 'e', 'f'], ['a分钟', 'b分钟', 'c分钟', 'd分钟', 'e分钟', 'f分钟'], ['第三节']], [['a', 'b', 'c', 'd'], ['a分钟', 'b分钟', 'c分钟', 'd分钟'], ['第四节']], [['a', 'b', 'c', 'd', 'e'], ['a分钟', 'b分钟', 'c分钟', 'd分钟', 'e分钟'], ['第五节']], [['a', 'b'], ['a分钟', 'b分钟'], ['第六节']]],
    navigatorBarFixed: false,
    navigatorBarFixedOffset: 380,
    navigatorBarHeight: 57,
    duration: 500,
    isLock: false,
    teacherItemWidth: 333,
    teacherListWidth: 1666,
    index: 0,
    chapterIndex: 0,
    chapterWidth: 408,
    chapterTranslateX: 0,
    toggle: [1, 2, 3, 4, 5, 6],
  },
  init() {
    this.bind();
    this.clone();
    this.render();
    this.renderTwo();
  },
  bind() {
    $('.nav-item').on('click', this.goNavigator)
    $(window).on('scroll', this.refreshNavigatorBar);
    $('.teacher-icon-left').on('click', this.teacherSwiperSwitchLeft);
    $('.teacher-icon-right').on('click', this.teacherSwiperSwitchRight);
    $('.chapter-item-icon-left').on('click', this.chapterSwiperSwitchLeft);
    $('.chapter-item-icon-right').on('click', this.chapterSwiperSwitchRight);
    $('.video-chapter-item').on('click', this.goChapter);
    $('#video-chapter-list').on('mousewheel', this.chapterWheel)
    $('#video-catalog-list').on('scroll', this.refreshChapter);
    $('#video-catalog-list').on('click', this.toggleContent);
    $('video').on('click', this.videoObj);
  },
  render() {
    let toggle = this.data.toggle;
    let chapterIdArr = this.data.chapterIdArr;
    let chapterContent = this.data.chapterContent;
    let courseLength = PAGE.data.chapterContent.map(data => { return data[0].length }).reduce(getSum);
    function getSum(total, num) {
      return total + num;
    }
    let aStr = `display:none;`;
    let aStrTwo = `display:flex;`;
    for (let i = 0; i < courseLength; i++) {
      let catalogElement = chapterContent.map((data, index) => {
        return `
        <li class="video-catalog-item" id="${chapterIdArr[index]}">
          <img class="toggle-arrow ${!toggle[index] ? 'active' : ''}" data-index="${index}" src="./images/qualcomm/toggle-arrow.png">
          <p class="catalog-item-title">${data[2]}</p>` + data[0].map((dataTwo, indexTwo) => `
          <a class="catalog-item-link" href="javascript:void(0)" style="${!toggle[index] ? aStr : aStrTwo}" data-v="data-video">
            <div class="catalog-item-content" data-index="${i++}">
              <p class="catalog-info">
                <span class="catalog-info-number">${indexTwo + 1}</span>
                ${dataTwo}
              </p>
              <p class="catalog-info-time">${data[1][indexTwo]}</p>
            </div>
          </a>`) + `
        </li>`
      })
      $('#video-catalog-list').html(catalogElement)
    }
  },
  renderTwo() {
    let chapterTranslateX = PAGE.data.chapterTranslateX;
    let chapterWidth = PAGE.data.chapterWidth;
    if (chapterTranslateX == 0) {
      $('.chapter-icon').eq(0).css('opacity', '0.5');
    } else {
      $('.chapter-icon').eq(0).css('opacity', '1');
    }
    if (chapterTranslateX >= $('.video-chapter-bar').outerWidth() - chapterWidth && chapterTranslateX < $('.video-chapter-bar').outerWidth() - chapterWidth + 2) {
      $('.chapter-icon').eq(1).css('opacity', '0.5');
    } else {
      $('.chapter-icon').eq(1).css('opacity', '1');
    }
  },
  clone() {
    let teacherListWidth = PAGE.data.teacherListWidth;
    let teacherItemWidth = PAGE.data.teacherItemWidth;
    let index = PAGE.data.index;
    $('#teacher-list').children().clone(true).appendTo('#teacher-list');
    $('#teacher-list').children('.teacher-item:lt(5)').clone(true).prependTo('#teacher-list');
    let translateX = -(teacherListWidth + teacherItemWidth * index);
    $('#teacher-list').css('marginLeft', `${translateX}px`);
  },
  teacherSwiperSwitchLeft() {
    let index = PAGE.data.index;
    PAGE.goIndex(index - 1)
  },
  teacherSwiperSwitchRight() {
    let index = PAGE.data.index;
    PAGE.goIndex(index + 1)
  },
  goIndex(index) {
    let teacherItemWidth = PAGE.data.teacherItemWidth;
    let value = -1666 - teacherItemWidth * index;
    this.isLock(function () {
      $('#teacher-list').animate({ marginLeft: `${value}px` }, 'slow', 'linear', function () {
        if (index <= -5 || index >= 5) {
          $('#teacher-list').css('marginLeft', '-1666px');
          index = 0;
        }
        PAGE.data.index = index;
        PAGE.data.isLock = false;
      })
    })
  },
  chapterSwiperSwitchLeft() {
    let chapterWidth = PAGE.data.chapterWidth;
    let translateX = PAGE.data.chapterTranslateX;
    let preIndex = Math.ceil(Math.abs(translateX) / (chapterWidth / 6))
    if (preIndex > 0) {
      PAGE.goChapterIndex(preIndex - 1);
    }
  },
  chapterSwiperSwitchRight() {
    let chapterWidth = PAGE.data.chapterWidth;
    let translateX = PAGE.data.chapterTranslateX;
    let preIndex = Math.floor(Math.abs(translateX) / (chapterWidth / 6));
    if (preIndex < 2) {
      PAGE.goChapterIndex(preIndex + 1);
    }
  },
  goChapterIndex(index) {
    let chapterWidth = PAGE.data.chapterWidth;
    let value = -(chapterWidth / 6 * index)
    this.isLock(function () {
      $('#video-chapter-list').animate({ marginLeft: `${value}px` }, 'slow', 'linear', function () {
        PAGE.data.isLock = false;
      })
      PAGE.data.chapterTranslateX = value;
      PAGE.renderTwo();
    })
  },
  chapterWheel(e) {
    let marginLeft = Math.abs(parseInt($('#video-chapter-list').css('margin-left')))
    if (e.originalEvent.wheelDelta < 0 && marginLeft < $('#video-chapter-list').outerWidth() - $('.video-chapter-bar').outerWidth()) {
      PAGE.chapterSwiperSwitchRight();
    } else if (e.originalEvent.wheelDelta > 0 && marginLeft > 0) {
      PAGE.chapterSwiperSwitchLeft();
    }
    if (e = window.event) {
      e.preventDefault();
    }
    PAGE.renderTwo();
  },
  goChapter(e) {
    let id = $(e.target).data('nav');
    $('#video-catalog-list').animate({ scrollTop: $(`#${id}`).prop('offsetTop') + 'px' }, 'slow');
    PAGE.data.chapterTranslateX = $(`#${id}`).prop('offsetTop');
  },
  refreshNavigatorBar() {
    PAGE.fixedNavigator();
    PAGE.highlightNavigator();
  },
  refreshChapter() {
    let chapterListWidth = PAGE.data.chapterWidth;
    let scrollTop = $('#video-catalog-list').scrollTop();
    let clientHeight = $('#video-catalog-list').outerHeight();
    let scrollHeight = $('#video-catalog-list').prop('scrollHeight');
    let filterNav = PAGE.data.chapterIdArr.filter(data => {
      let offsetTop = $(`#${data}`).prop('offsetTop');
      return scrollTop >= offsetTop;
    })
    PAGE.highlight(filterNav, $('.video-chapter-item'), scrollTop, clientHeight, scrollHeight);
    let defaultWidth = $('.video-chapter-bar').outerWidth();
    let translateX = -(chapterListWidth - defaultWidth) * (scrollTop / (scrollHeight - clientHeight));
    $('#video-chapter-list').css('marginLeft', `${translateX}px`);
    PAGE.data.chapterTranslateX = translateX;
    PAGE.renderTwo();
  },
  fixedNavigator() {
    if (PAGE.data.navigatorBarFixedOffset < $(window).scrollTop()) {
      $('#nav-section').addClass('nav-fixed')
    } else {
      $('#nav-section').removeClass('nav-fixed')
    }
  },
  highlightNavigator() {
    let scrollTop = $(window).scrollTop();
    let clientHeight = $(window).height();
    let scrollHeight = $(document.body).prop('clientHeight');
    let filterNav = PAGE.data.navigatorBarIdArr.filter(data => {
      let offsetTop = $(`#${data}`).offset().top;
      return scrollTop >= offsetTop - PAGE.data.navigatorBarHeight;
    })
    this.highlight(filterNav, $('.nav-item'), scrollTop, clientHeight, scrollHeight);
  },
  highlight(filterNav, items, scrollTop, clientHeight, scrollHeight) {
    if (filterNav) {
      for (let i = 0; i < items.length; i++) {
        let item = items.eq(i)
        if (scrollTop + clientHeight != scrollHeight) {
          if ($(item).data('nav') == filterNav[filterNav.length - 1]) {
            $(item).addClass('active')
          } else {
            $(item).removeClass('active')
          }
        } else {
          items.eq(-1).addClass('active')
          items.eq(-2).removeClass('active')
        }
      }
    }
  },
  goNavigator(e) {
    let id = $(e.target).data('nav');
    PAGE.isLock(function () {
      $('html,body').animate({ scrollTop: $(`#${id}`).offset().top - 57 + 'px' }, 'slow', function () {
        PAGE.data.isLock = false;
      })
    })
  },
  toggleContent(e) {
    let courseLength = PAGE.data.chapterContent.map(data => { return data[0].length }).map(data => data).reduce(getSum);
    function getSum(total, num) {
      return total + num;
    }
    for (let n = 0; n < courseLength; n++) {
      let catalogItem = $('.catalog-item-content').eq(n);
      let catalogTime = $('.catalog-info-time').eq(n);
      if ($(catalogItem).data('index') == $(e.target).data('index') || $(catalogItem).data('index')==$(e.target).parents('.catalog-item-content').data('index')) {
        $(catalogItem).attr('class', 'catalog-item-content active')
        $(catalogTime).attr('class', 'catalog-info-time active')
      }else{
        $(catalogItem).attr('class','catalog-item-content')
        $(catalogTime).attr('class', 'catalog-info-time')
      }
    }
    $('html,body').animate({ scrollTop: $('.video-section').offset().top - 57 + 'px' }, 'slow')
    if ($(e.target).hasClass('toggle-arrow')) {
      $(e.target).siblings('a').slideToggle('slow')
      $(e.target).toggleClass('active')
    }
  },
  videoObj() {
    if ($(this).hasClass('pause')) {
      $("video").trigger("play");
      $(this).attr('class', 'play')
      $('.video-icon').css('display', 'none');
    } else {
      $("video").trigger("pause");
      $(this).attr('class', 'pause')
      $('.video-icon').css('display', 'block');
    }
  },
  isLock(callback) {
    let isLock = PAGE.data.isLock;
    if (isLock) {
      return
    }
    PAGE.data.isLock = true;
    typeof callback === 'function' && callback()
  }
}
PAGE.init();