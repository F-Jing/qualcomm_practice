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
  init: function () {
    this.bind();
    this.clone();
    this.render();
    this.renderTwo();
    // this.setData();
  },
  bind: function () {
    let navigatorBar = document.getElementById('navigator-bar');
    this.onEventLister(navigatorBar, 'click', 'nav-item', this.goNavigator);
    window.addEventListener('scroll', this.refreshNavigatorBar);
    let teacherSwiperSwitchLeft = document.getElementsByClassName('teacher-icon-left')[0];
    let teacherSwiperSwitchRight = document.getElementsByClassName('teacher-icon-right')[0];
    teacherSwiperSwitchLeft.addEventListener('click', this.teacherSwiperSwitchLeft);
    teacherSwiperSwitchRight.addEventListener('click', this.teacherSwiperSwitchRight);
    let chapterSwiperSwitchLeft = document.getElementsByClassName('chapter-icon')[0];
    let chapterSwiperSwitchRight = document.getElementsByClassName('chapter-icon')[1];
    chapterSwiperSwitchLeft.addEventListener('click', this.chapterSwiperSwitchLeft);
    chapterSwiperSwitchRight.addEventListener('click', this.chapterSwiperSwitchRight);
    let chapterList = document.getElementById('video-chapter-list');
    this.onEventLister(chapterList, 'click', 'video-chapter-item', this.goChapter);
    this.onEventLister(chapterList, 'click', 'chapter-item-link', this.goChapter);
    chapterList.addEventListener('mousewheel', this.chapterWheel)
    let catalogList = document.getElementById('video-catalog-list');
    this.onEventLister(catalogList, 'click', 'toggle-arrow', this.toggleCatalog);
    catalogList.addEventListener('scroll', this.refreshChapter);
    this.onEventLister(catalogList, 'click', 'catalog-item-content', this.toggleContent);
    let videoObj = document.getElementsByTagName('video')[0];
    videoObj.addEventListener('click', this.videoObj);
  },
  onEventLister(parentNode, action, childClassName, callback) {
    parentNode.addEventListener(action, function (e) {
      e.target.className.indexOf(childClassName) >= 0 && callback(e);
    })
  },
  // setData: function () {
  //   let catalogList = document.getElementById('video-catalog-list');
  //   let id = this.data.chapterIdArr;
  //   let chapterTitle = this.data.chapterTitle;
  //   let chapterContent = this.data.chapterContent;
  //   for (let i = 0; i < chapterTitle.length; i++) {
  //     let catalogImg = document.createElement('img');
  //     catalogImg.setAttribute('class', 'toggle-arrow');
  //     catalogImg.setAttribute('data-index', PAGE.data.toggle[0]);
  //     catalogImg.setAttribute('src', './images/qualcomm/toggle-arrow.png');
  //     let catalogItemTitle = document.createElement('p');
  //     catalogItemTitle.setAttribute('class', 'catalog-item-title');
  //     catalogItemTitle.innerText = chapterTitle[i];
  //     let catalogItem = document.createElement('li');
  //     catalogItem.setAttribute('class', 'video-catalog-item');
  //     catalogItem.setAttribute('id', id[i]);
  //     catalogItem.prepend(catalogItemTitle);
  //     catalogItem.prepend(catalogImg);
  //     catalogList.appendChild(catalogItem);
  //     for (let j = 0; j < chapterContent[i][0].length; j++) {
  //       let catalogLink = document.createElement('a');
  //       catalogLink.setAttribute('class', 'catalog-item-link');
  //       catalogLink.setAttribute('href', 'javascript:void(0)');
  //       catalogLink.innerHTML = `
  //       <div class="catalog-item-content">
  //       <p class="catalog-info">
  //         <span class="catalog-info-number">${j + 1}</span>
  //         ${chapterContent[i][0][j]}
  //       </p>
  //       <p class="catalog-info-time">${chapterContent[i][1][j]}</p>
  //       </div>`
  //       catalogItem.appendChild(catalogLink)
  //     }
  //   }
  // },
  render: function () {
    let catalogList = document.getElementById('video-catalog-list');
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
    catalogList.innerHTML = catalogElement
  },
  renderTwo: function () {
    let chapterTranslateX = PAGE.data.chapterTranslateX;
    let chapterSwiperSwitchLeft = document.getElementsByClassName('chapter-icon')[0];
    let chapterSwiperSwitchRight = document.getElementsByClassName('chapter-icon')[1];
    if (chapterTranslateX == 0) {
      chapterSwiperSwitchLeft.style.opacity = '0.5';
    } else {
      chapterSwiperSwitchLeft.style.opacity = '1';
    }
    if (chapterTranslateX >= -137 && chapterTranslateX < -135) {
      chapterSwiperSwitchRight.style.opacity = '0.5';
    } else {
      chapterSwiperSwitchRight.style.opacity = '1';
    }
  },
  clone: function () {
    let teacherSwiperList = document.getElementById('teacher-list');
    let teacherListWidth = PAGE.data.teacherListWidth;
    let teacherItemWidth = PAGE.data.teacherItemWidth;
    let teacherSwiperItem = document.getElementsByClassName('teacher-item');
    for (let i = 0; i < teacherSwiperItem.length; i++) {
      let teacherItem = teacherSwiperItem[i].cloneNode(true);
      if (teacherSwiperItem.length <= 15) {
        teacherSwiperList.prepend(teacherItem);
        teacherSwiperList.appendChild(teacherItem);
      }
    }
    let index = PAGE.data.index;
    let translateX = -(teacherListWidth + teacherItemWidth * index)
    teacherSwiperList.style.transform = `translateX(${translateX}px)`;
    PAGE.goIndex(index);
    PAGE.data.translateX = translateX;
  },
  // 半自动轮播
  // teacherSwiperSwitchLeft: function () {
  //   PAGE.myTimeout(PAGE.teacherSwiperSwitchLeft);
  //   let index = PAGE.data.index;
  //   PAGE.goIndex(index - 1)
  // },
  // myTimeout: function (value) {
  //   setTimeout(() => {
  //     value();
  //   }, 2500)
  // },
  teacherSwiperSwitchLeft: function () {
    let index = PAGE.data.index;
    PAGE.goIndex(index - 1)
  },
  teacherSwiperSwitchRight: function () {
    let index = PAGE.data.index;
    PAGE.goIndex(index + 1)
  },
  goIndex: function (index) {
    let duration = PAGE.data.duration;
    let teacherSwiperList = document.getElementById('teacher-list');
    let beginSwiper = PAGE.data.translateX;
    let teacherListWidth = PAGE.data.teacherListWidth
    let teacherItemWidth = PAGE.data.teacherItemWidth;
    let endSwiper = -(teacherListWidth + teacherItemWidth * index);
    let isLock = PAGE.data.isLock;
    if (isLock) {
      return
    }
    PAGE.data.isLock = true;
    // 回调函数异步进行
    PAGE.animateTo(beginSwiper, endSwiper, duration, function (value) {
      teacherSwiperList.style.transform = `translateX(${value}px)`
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
      teacherSwiperList.style.transform = `translateX(${value}px)`;
      PAGE.data.translateX = value;
      PAGE.data.isLock = false;
      PAGE.data.index = index;
    })
  },
  chapterSwiperSwitchLeft: function () {
    let chapterWidth = PAGE.data.chapterWidth;
    let translateX = PAGE.data.chapterTranslateX;
    let preIndex = Math.ceil(Math.abs(translateX) / (chapterWidth / 6))
    if (preIndex > 0) {
      PAGE.goChapterIndex(preIndex - 1)
    }
    PAGE.data.chapterTranslateX = translateX;
    PAGE.renderTwo();
  },
  chapterSwiperSwitchRight: function () {
    let chapterWidth = PAGE.data.chapterWidth;
    let translateX = PAGE.data.chapterTranslateX;
    let preIndex = Math.floor(Math.abs(translateX) / (chapterWidth / 6))
    if (preIndex < 2) {
      PAGE.goChapterIndex(preIndex + 1)
    }
    PAGE.data.chapterTranslateX = translateX;
    PAGE.renderTwo();
  },
  goChapterIndex: function (index) {
    let chapterWidth = PAGE.data.chapterWidth;
    let endTranslateX = -(chapterWidth / 6 * index);
    let beginTranslateX = PAGE.data.chapterTranslateX;
    let duration = PAGE.data.duration;
    let chapterList = document.getElementById('video-chapter-list');
    let isLock = PAGE.data.isLock;
    if (isLock) {
      return
    }
    PAGE.data.isLock = true;
    PAGE.animateTo(beginTranslateX, endTranslateX, duration, function (value) {
      chapterList.style.transform = `translateX(${value}px)`;
    }, function (value) {
      chapterList.style.transform = `translateX(${value}px)`
      PAGE.data.isLock = false;
      PAGE.data.chapterTranslateX = value;
    })
  },
  refreshNavigatorBar: function () {
    PAGE.fixedNavigator();
    PAGE.highlightNavigator();
  },
  refreshChapter: function () {
    let chapterListWidth = PAGE.data.chapterWidth;
    let scrollTop = document.getElementById('video-catalog-list').scrollTop;
    let clientHeight = document.getElementById('video-catalog-list').clientHeight;
    let scrollHeight = document.getElementById('video-catalog-list').scrollHeight;
    let filterNav = PAGE.data.chapterIdArr.filter(data => {
      let offsetTop = document.getElementById(data).offsetTop;
      return scrollTop >= offsetTop;
    })
    let chapterItems = document.getElementsByClassName('video-chapter-item')
    let chapterLinks = document.getElementsByClassName('chapter-item-link');
    if (filterNav) {
      for (let i = 0; i < chapterLinks.length; i++) {
        let chapterLink = chapterLinks[i];
        let chapterItem = chapterItems[i];
        if (scrollTop + clientHeight != scrollHeight) {
          if (chapterItem.dataset.nav == filterNav[filterNav.length - 1]) {
            chapterLink.className = 'chapter-item-link active'
          } else {
            chapterLink.className = 'chapter-item-link'
          }
        } else {
          chapterLinks[chapterLinks.length - 1].className = 'chapter-item-link active'
          chapterLinks[chapterLinks.length - 2].className = 'chapter-item-link'
        }
      }
    }
    let chapterList = document.getElementById('video-chapter-list');
    let defaultWidth = document.getElementsByClassName('video-chapter-bar')[0].offsetWidth;
    let translateX = -(chapterListWidth - defaultWidth) * (scrollTop / (scrollHeight - clientHeight));
    chapterList.style.transform = `translateX(${translateX}px)`;
    PAGE.data.chapterTranslateX = translateX;
    PAGE.renderTwo();
  },
  fixedNavigator: function () {
    let scrollTop = document.documentElement.scrollTop;
    let navigatorBarTop = PAGE.data.navigatorBarFixedOffset;
    let navigatorFixed = scrollTop >= navigatorBarTop;
    let navigatorSec = document.getElementById('nav-section');
    if (PAGE.data.navigatorBarFixed !== navigatorFixed) {
      PAGE.data.navigatorBarFixed = navigatorFixed;
      if (PAGE.data.navigatorBarFixed) {
        navigatorSec.className = 'nav-section nav-fixed'
      } else {
        navigatorSec.className = 'nav-section'
      }
    }
  },
  highlightNavigator: function () {
    let scrollTop = document.documentElement.scrollTop;
    let filterNav = PAGE.data.navigatorBarIdArr.filter(data => {
      let offsetTop = document.getElementById(data).offsetTop;
      return scrollTop >= offsetTop - PAGE.data.navigatorBarHeight;
    })
    let navigatorItems = document.getElementsByClassName('nav-item');
    if (filterNav) {
      for (let i = 0; i < navigatorItems.length; i++) {
        let navigatorItem = navigatorItems[i]
        if (document.documentElement.scrollTop + document.documentElement.clientHeight != document.documentElement.scrollHeight) {
          if (navigatorItem.dataset.nav == filterNav[filterNav.length - 1]) {
            navigatorItem.className = 'nav-item active'
          } else {
            navigatorItem.className = 'nav-item'
          }
        } else {
          navigatorItems[navigatorItems.length - 1].className = 'nav-item active'
          navigatorItems[navigatorItems.length - 2].className = 'nav-item'
        }
      }
    }
  },
  goNavigator: function (e) {
    let id = e.target.dataset.nav;
    let offsetTop = document.getElementById(id).offsetTop;
    let beginScrollTop = document.documentElement.scrollTop;
    let endScrollTop = offsetTop - PAGE.data.navigatorBarHeight;
    let duration = PAGE.data.duration;
    let isLock = PAGE.data.isLock;
    if (isLock) {
      return
    }
    PAGE.data.isLock = true;
    PAGE.animateTo(beginScrollTop, endScrollTop, duration, function (value) {
      document.documentElement.scrollTop = value;
    }, function (value) {
      document.documentElement.scrollTop = value;
      PAGE.data.isLock = false;
    })
  },
  goChapter: function (e) {
    let id = e.target.dataset.nav;
    let item = e.target;
    if (e.target.parentNode.className == 'video-chapter-item') {
      item = e.target.parentNode
      id = e.target.parentNode.dataset.nav;
    }
    let beginScrollTop = document.getElementById('video-catalog-list').scrollTop;
    let endScrollTop = document.getElementById(id).offsetTop;
    let duration = PAGE.data.duration;
    let isLock = PAGE.data.isLock;
    if (isLock) {
      return
    }
    PAGE.data.isLock = true;
    PAGE.animateTo(beginScrollTop, endScrollTop, duration, function (value) {
      document.getElementById('video-catalog-list').scrollTop = value;
    }, function (value) {
      document.getElementById('video-catalog-list').scrollTop = value;
      PAGE.data.isLock = false;
    })
  },
  animateTo: function (begin, end, duration, changeCallback, finishCallback) {
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
  linear: function (time, begin, end, duration) {
    return (end - begin) * time / duration + begin;
  },
  toggleCatalog: function (e) {
    let item = e.target;
    let index = item.dataset.index;
    let toggle = PAGE.data.toggle;
    if (toggle[index]) {
      toggle[index] = false;
    } else {
      toggle[index] = true;
    }
    PAGE.render();
  },
  toggleContent: function () {
    let catalogContent = document.getElementsByClassName('catalog-item-content');
    let catalogInfo = document.getElementsByClassName('catalog-info')
    for (let n = 0; n < 22; n++) {
      catalogContent[n].onclick = function () {
        for (let j = 0; j < 22; j++) {
          catalogContent[j].className = 'catalog-item-content'
          catalogInfo[j].className = 'catalog-info'
        }
        this.className = 'catalog-item-content active'
        catalogInfo[n].className = 'catalog-info active'
      }
    }
    let beginScrollTop = document.documentElement.scrollTop;
    let offsetTop = document.getElementById('section-1').offsetTop;
    let endScrollTop = offsetTop - PAGE.data.navigatorBarHeight;
    let duration = PAGE.data.duration;
    let isLock = PAGE.data.isLock;
    if (isLock) {
      return
    }
    PAGE.data.isLock = true;
    PAGE.animateTo(beginScrollTop, endScrollTop, duration, function (value) {
      document.documentElement.scrollTop = value;
    }, function (value) {
      document.documentElement.scrollTop = value;
      PAGE.data.isLock = false;
    })

  },
  chapterWheel: function (e) {
    let offsetWidth = PAGE.data.chapterWidth / 6;
    let chapterList = document.getElementById('video-chapter-list');
    if (e.wheelDelta < 0) {
      if (PAGE.data.index < 2) {
        let index = ++PAGE.data.index
        let translateX = -(offsetWidth * index);
        chapterList.style.transform = `translateX(${translateX}px)`
        PAGE.data.chapterTranslateX = translateX;
      }
    }
    if (e.wheelDelta > 0) {
      if (PAGE.data.index > 0) {
        let index = --PAGE.data.index
        let translateX = -(offsetWidth * index);
        chapterList.style.transform = `translateX(${translateX}px)`
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
  videoObj: function () {
    let videoIcon = document.getElementsByClassName('video-icon')[0];
    var videoObj = document.querySelector('video')
    if (videoObj.paused) {
      videoObj.play();
      videoIcon.style.display = 'none'
    } else {
      videoObj.pause();
      videoIcon.style.display = 'block'
    }
  },
}
PAGE.init();