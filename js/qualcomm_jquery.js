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
    translateX: null,
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
    this.onEventLister($('#navigator-bar'), 'click', 'nav-item', this.goNavigator);
    $(window).on('scroll', this.refreshNavigatorBar);
    $('.teacher-icon-left').on('click', this.teacherSwiperSwitchLeft);
    $('.teacher-icon-right').on('click', this.teacherSwiperSwitchRight);
    $('.chapter-icon').eq(0).on('click', this.chapterSwiperSwitchLeft);
    $('.chapter-icon').eq(1).on('click', this.chapterSwiperSwitchRight);
    this.onEventLister($('#video-chapter-list'), 'click', 'video-chapter-item', this.goChapter);
    this.onEventLister($('#video-chapter-list'), 'click', 'chapter-item-link', this.goChapter);
    $('#video-chapter-list').on('mousewheel', this.chapterWheel)
    this.onEventLister($('#video-catalog-list'), 'click', 'toggle-arrow', this.toggleCatalog);
    $('#video-catalog-list').on('scroll', this.refreshChapter);
    this.onEventLister($('#video-catalog-list'), 'click', 'catalog-item-content', this.toggleContent);
    $('video').on('click', this.videoObj);
  },
  onEventLister(parentNode, action, childClassName, callback) {
    $(parentNode).on(action, function (e) {
      e.target.className.indexOf(childClassName) >= 0 && callback(e);
    })
  },
  render() {
    let toggle = this.data.toggle;
    let chapterIdArr = this.data.chapterIdArr;
    let chapterContent = this.data.chapterContent;
    let aStr = `
      display:none;`;
    let aStrTwo = `
      display:flex;`;
    let catalogElement = chapterContent.map((data, index) => {
      return `
              <li class="video-catalog-item" id="${chapterIdArr[index]}">
                <img class="toggle-arrow ${!toggle[index] ? 'active' : ''}" data-index="${index}" src="./images/qualcomm/toggle-arrow.png">
                <p class="catalog-item-title">${data[2]}</p>` + data[0].map((dataTwo, indexTwo) => `
                <a class="catalog-item-link" href="javascript:void(0)" style="${!toggle[index] ? aStr : aStrTwo}" data-v="data-video">
                  <div class="catalog-item-content">
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
    for (let i = 0; i < $('.teacher-item').length; i++) {
      let teacherItem = $('.teacher-item')[i].cloneNode(true);
      if ($('.teacher-item').length <= 15) {
        $('#teacher-list').prepend(teacherItem);
        $('#teacher-list').append(teacherItem);
      }
    }
    let translateX = -(teacherListWidth + teacherItemWidth * index)
    $('#teacher-list').css('transform', `translateX(${translateX}px)`);
    PAGE.goIndex(index);
    PAGE.data.translateX = translateX;
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
    let duration = PAGE.data.duration;
    let beginSwiper = PAGE.data.translateX;
    let teacherListWidth = PAGE.data.teacherListWidth
    let teacherItemWidth = PAGE.data.teacherItemWidth;
    let endSwiper = -(teacherListWidth + teacherItemWidth * index);
    let isLock = PAGE.data.isLock;
    if (isLock) {
      return
    }
    PAGE.data.isLock = true;
    PAGE.animateTo(beginSwiper, endSwiper, duration, function (value) {
      $('#teacher-list').css('transform', `translateX(${value}px)`);
    }, function (value) {
      if (index === -5) {
        index = 0;
        PAGE.data.index = index;
        value = -(teacherListWidth + teacherItemWidth * index);
      }
      if (index === 5) {
        index = 0;
        PAGE.data.index = index;
        value = -(teacherListWidth + teacherItemWidth * index);
      }
      $('#teacher-list').css('transform', `translateX(${value}px)`);
      PAGE.data.translateX = value;
      PAGE.data.isLock = false;
      PAGE.data.index = index;
    })
  },
  chapterSwiperSwitchLeft() {
    let chapterWidth = PAGE.data.chapterWidth;
    let translateX = PAGE.data.chapterTranslateX;
    let preIndex = Math.ceil(Math.abs(translateX) / (chapterWidth / 6))
    if (preIndex > 0) {
      PAGE.goChapterIndex(preIndex - 1)
    }
    PAGE.data.chapterTranslateX = translateX;
    PAGE.renderTwo();
  },
  chapterSwiperSwitchRight() {
    let chapterWidth = PAGE.data.chapterWidth;
    let translateX = PAGE.data.chapterTranslateX;
    let preIndex = Math.floor(Math.abs(translateX) / (chapterWidth / 6))
    if (preIndex < 2) {
      PAGE.goChapterIndex(preIndex + 1)
    }
    PAGE.data.chapterTranslateX = translateX;
    PAGE.renderTwo();
  },
  goChapterIndex(index) {
    let chapterWidth = PAGE.data.chapterWidth;
    let endTranslateX = -(chapterWidth / 6 * index);
    let beginTranslateX = PAGE.data.chapterTranslateX;
    let duration = PAGE.data.duration;
    let isLock = PAGE.data.isLock;
    if (isLock) {
      return
    }
    PAGE.data.isLock = true;
    PAGE.animateTo(beginTranslateX, endTranslateX, duration, function (value) {
      $('#video-chapter-list').css('transform', `translateX(${value}px)`);
    }, function (value) {
      $('#video-chapter-list').css('transform', `translateX(${value}px)`);
      PAGE.data.isLock = false;
      PAGE.data.chapterTranslateX = value;
    })
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
    
    let chapterItems = $('.video-chapter-item')
    let chapterLinks = $('.chapter-item-link');
    if (filterNav) {
      for (let i = 0; i < chapterLinks.length; i++) {
        let chapterLink = chapterLinks[i];
        let chapterItem = chapterItems[i];
        if (scrollTop + clientHeight != scrollHeight) {
          if ($(chapterItem).data('nav') == filterNav[filterNav.length - 1]) {
            $(chapterLink).attr('class', 'chapter-item-link active')
          } else {
            $(chapterLink).attr('class', 'chapter-item-link')
          }
        } else {
          $(chapterLinks[chapterLinks.length - 1]).attr('class', 'chapter-item-link active')
          $(chapterLinks[chapterLinks.length - 2]).attr('class', 'chapter-item-link')
        }
      }
    }
    let defaultWidth = $('.video-chapter-bar')[0].offsetWidth;
    let translateX = -(chapterListWidth - defaultWidth) * (scrollTop / (scrollHeight - clientHeight));
    $('#video-chapter-list').css('transform', `translateX(${translateX}px)`);
    PAGE.data.chapterTranslateX = translateX;
    PAGE.renderTwo();
  },
  fixedNavigator() {
    let navigatorBarTop = PAGE.data.navigatorBarFixedOffset;
    let navigatorFixed = $(window).scrollTop() >= navigatorBarTop;
    if (PAGE.data.navigatorBarFixed !== navigatorFixed) {
      PAGE.data.navigatorBarFixed = navigatorFixed;
      if (PAGE.data.navigatorBarFixed) {
        $('#nav-section').attr('class', 'nav-section nav-fixed')
      } else {
        $('#nav-section').attr('class', 'nav-section')
      }
    }
  },
  highlightNavigator() {
    let scrollTop = $(window).scrollTop();
    let filterNav = PAGE.data.navigatorBarIdArr.filter(data => {
      let offsetTop = $(`#${data}`).offset().top;
      return scrollTop >= offsetTop - PAGE.data.navigatorBarHeight;
    })
    let navigatorItems = $('.nav-item');
    if (filterNav) {
      for (let i = 0; i < navigatorItems.length; i++) {
        let navigatorItem = navigatorItems[i]
        if (scrollTop + $(window).height() != $(document.body).outerHeight()) {
          if ($(navigatorItem).data('nav') == filterNav[filterNav.length - 1]) {
            $(navigatorItem).attr('class', 'nav-item active')
          } else {
            $(navigatorItem).attr('class', 'nav-item')
          }
        } else {
          $(navigatorItems[navigatorItems.length - 1]).attr('class', 'nav-item active')
          $(navigatorItems[navigatorItems.length - 2]).attr('class', 'nav-item')
        }
      }
    }
  },
  goNavigator(e) {
    let id = $(e.target).data('nav');
    let offsetTop = $(`#${id}`).prop('offsetTop');
    let beginScrollTop = $(window).scrollTop();
    let endScrollTop = offsetTop - PAGE.data.navigatorBarHeight;
    let duration = PAGE.data.duration;
    let isLock = PAGE.data.isLock;
    if (isLock) {
      return
    }
    PAGE.data.isLock = true;
    PAGE.animateTo(beginScrollTop, endScrollTop, duration, function (value) {
      $(window).scrollTop(value);
    }, function (value) {
      $(window).scrollTop(value);
      PAGE.data.isLock = false;
    })
  },
  goChapter(e) {
    let id = $(e.target).data('nav');
    let item = e.target;
    if ($(e.target).parent().hasClass('video-chapter-item')) {
      item = $(e.target).parent()
      id = $(e.target).parent().data('nav');
    }
    let duration = PAGE.data.duration;
    let isLock = PAGE.data.isLock;
    if (isLock) {
      return
    }
    PAGE.data.isLock = true;
    PAGE.animateTo($('#video-catalog-list').scrollTop(), $(`#${id}`).prop('offsetTop'), duration, function (value) {
      $('#video-catalog-list').scrollTop(value);
    }, function (value) {
      $('#video-catalog-list').scrollTop(value);
      PAGE.data.isLock = false;
    })
  },
  animateTo(begin, end, duration, changeCallback, finishCallback) {
    let startTime = Date.now();
    requestAnimationFrame(function update() {
      let dataNow = Date.now();
      let time = dataNow - startTime;
      let value = PAGE.linear(time, begin, end, duration);
      changeCallback(value)
      if (startTime + duration > dataNow) {
        requestAnimationFrame(update);
      } else {
        finishCallback(end);
      }
    })
  },
  linear(time, begin, end, duration) {
    return (end - begin) * time / duration + begin;
  },
  toggleCatalog(e) {
    let index = $(e.target).data('index');
    let toggle = PAGE.data.toggle;
    if (toggle[index]) {
      toggle[index] = false;
    } else {
      toggle[index] = true;
    }
    PAGE.render();
  },
  toggleContent() {
    let courseLength = PAGE.data.chapterContent.map(data => { return data[0].length }).map(data => data).reduce(getSum);
    function getSum(total, num) {
      return total + num;
    }
    for (let n = 0; n < courseLength; n++) {
      $('.catalog-item-content').eq(n).click(function () {
        for (let j = 0; j < courseLength; j++) {
          $('.catalog-item-content').eq(j).attr('class', 'catalog-item-content');
          $('.catalog-info').eq(j).attr('class', 'catalog-info');
        }
        $(this).attr('class', 'catalog-item-content active');
        $('.catalog-info').eq(n).attr('class', 'catalog-info active');
      })
    }
    let endScrollTop = $('#section-1').prop('offsetTop') - PAGE.data.navigatorBarHeight;
    let duration = PAGE.data.duration;
    let isLock = PAGE.data.isLock;
    if (isLock) {
      return
    }
    PAGE.data.isLock = true;
    PAGE.animateTo($(window).scrollTop(), endScrollTop, duration, function (value) {
      $(window).scrollTop(value);
    }, function (value) {
      $(window).scrollTop(value);
      PAGE.data.isLock = false;
    })
  },
  chapterWheel(e) {
    let offsetWidth = PAGE.data.chapterWidth / 6;
    if (e.originalEvent.wheelDelta < 0) {
      if (PAGE.data.index < 2) {
        let index = ++PAGE.data.index
        let translateX = -(offsetWidth * index);
        $('#video-chapter-list').css('transform', `translateX(${translateX}px)`);
        PAGE.data.chapterTranslateX = translateX;
      }
    }
    if (e.originalEvent.wheelDelta > 0) {
      if (PAGE.data.index > 0) {
        let index = --PAGE.data.index
        let translateX = -(offsetWidth * index);
        $('#video-chapter-list').css('transform', `translateX(${translateX}px)`);
        PAGE.data.chapterTranslateX = translateX;
      }
    }
    if (e = window.event) {
      // 默认禁止事件
      e.preventDefault();
      // 阻止事件冒泡到父元素
      // e.stopPropagation();
    }
    PAGE.renderTwo();
  },
  videoObj() {
    if ($(this).hasClass('pause')) {
      $("video").trigger("play");
      $(this).removeClass('pause');
      $(this).addClass('play');
      $('.video-icon').css('display', 'none');
    } else {
      $("video").trigger("pause");
      $(this).removeClass('play');
      $(this).addClass('pause');
      $('.video-icon').css('display', 'block');
    }

  },
}
PAGE.init();