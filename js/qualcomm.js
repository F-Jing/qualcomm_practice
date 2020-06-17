const PAGE = {
  data: {
    navigatorBarIdArr: ['section-1', 'section-2', 'section-3', 'section-4'],
    
    navigatorBarFixed: false,
    navigatorBarFixedOffset: 380,
    navigatorBarHeight: 57,
    duration: 500,
    isLock: false,
    translateX: null,
    teacherItemWidth: 333,
    teacherListWidth: 1666,
    index: 0,
  },
  init: function () {
    this.bind();
    this.clone();
  },
  bind: function () {
    let navigatorBar = document.getElementById('navigator-bar');
    this.onEventLister(navigatorBar, 'click', 'nav-item', this.goNavigator);
    window.addEventListener('scroll', this.refreshNavigatorBar);
    let teacherSwiperSwitchLeft = document.getElementsByClassName('teacher-icon-left')[0];
    let teacherSwiperSwitchRight = document.getElementsByClassName('teacher-icon-right')[0];
    teacherSwiperSwitchLeft.addEventListener('click', this.teacherSwiperSwitchLeft);
    teacherSwiperSwitchRight.addEventListener('click', this.teacherSwiperSwitchRight);
  },
  onEventLister(parentNode, action, childClassName, callback) {
    parentNode.addEventListener(action, function (e) {
      e.target.className.indexOf(childClassName) >= 0 && callback(e);
    })
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
  refreshNavigatorBar: function () {
    PAGE.fixedNavigator();
    PAGE.highlightNavigator();
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
    e.target.className == "nav-item"
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
    })
    PAGE.data.isLock = false;
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
  }
}
PAGE.init();