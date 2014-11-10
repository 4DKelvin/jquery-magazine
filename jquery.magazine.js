/**
 * Created by Kelvin on 11/7/14.
 */
(function ($) {
  $.fn.magazine = function (args) {

    var _this = this;

    var $layout = $(_this);

    var $before, $current, $after;

    //默认的配置选项
    var _options = {
      items: 'div',
      onChange: function () {
      },
      onInit: function () {
      }
    }

    this.init = function (options) {
      var option = $.extend(_options, options);
      var startY, offsetY, touchMode, height = $(window).height(), width = $(window).width();
      //初始化布局
      $layout.addClass('magazines').css({'height': height, 'width': width});
      $layout.find(option.items).addClass('magazine');
      //插入翻页指示
      $('<div/>', {class: 'magazine-arrow'}).insertAfter($layout);
      //获取第一张和第二张
      $current = $layout.find(option.items).eq(0).addClass('current-magazine');
      $after = $layout.find(option.items).eq(1).addClass('after-magazine');
      //初始化事件
      $layout.on('init', option.onInit);

      $layout.on('change', option.onChange);

      $layout.on('touchstart', function (e) {
        startY = e.originalEvent.touches[0].clientY;
        offsetY = undefined;
        touchMode = undefined;
      });

      $layout.on('touchmove', function (e) {
        e.preventDefault();//防止IOS回弹
        offsetY = e.originalEvent.touches[0].clientY;
        var offset = Math.abs(offsetY - startY);//本次移动的范围
        var cut = 0.8;//这里是活动幅度，值越小滑动的幅度越小
        if (offset > 50 && !touchMode) {
          //移动范围超过50像素才决定向上还是向下
          //为了防止上下移动误导的判断,所以touchMode一定要为空
          touchMode = offsetY - startY > 0 ? 'prev' : 'next';
        }
        //开始进行css3动画效果
        if (touchMode == 'next' && $after && $after.length) {
          var translate = (1 - offset / (height * cut)) * 100;
          var scale = 1 - (offset / (height * cut) * 0.2);
          $current.css('-webkit-transform', 'scale(' + scale + ')');
          $after.css('-webkit-transform', 'translateY(' + translate + '%)');
        } else if (touchMode == 'prev' && $before && $before.length) {
          var translate = (offset / (height * cut)) * 100;
          var scale = 0.8 + (offset / (height * cut) * 0.2);
          $before.css('-webkit-transform', 'scale(' + scale + ')');
          $current.css('-webkit-transform', 'translateY(' + translate + '%)');
        }
      });

      $layout.on('touchend touchcancel', function () {
        if (offsetY && touchMode) {
          if (touchMode == 'next' && $after && $after.length) {
            $current.css('-webkit-transform', 'scale(.8)');
            $after.css('-webkit-transform', 'translateY(0)');
            _this.change(touchMode);
          } else if (touchMode == 'prev' && $before && $before.length) {
            $before.css('-webkit-transform', 'scale(1)');
            $current.css('-webkit-transform', 'translateY(100%)');
            _this.change(touchMode);
          }
        }
      });
      //触发事件
      $layout.trigger('init');
    };

    //动画完毕后替换相应的before，after，current
    this.change = function (touchMode) {
      if (touchMode == 'next') {
        if ($after.next().length)$after.next().addClass('after-magazine');
        if ($after)$after.addClass('current-magazine').removeClass('after-magazine');
        if ($current)$current.addClass('before-magazine').removeClass('current-magazine');
        if ($before)$before.removeClass('before-magazine');
      }
      else if (touchMode == 'prev') {
        if ($before.prev().length)$before.prev().addClass('before-magazine');
        if ($before)$before.addClass('current-magazine').removeClass('before-magazine');
        if ($current)$current.addClass('after-magazine').removeClass('current-magazine');
        if ($after)$after.removeClass('after-magazine');
      }
      $before = $('.magazine.before-magazine');
      $current = $('.magazine.current-magazine');
      $after = $('.magazine.after-magazine');

      if ($after.length) {
        //如果这不是最后一张那么显示翻页指示
        $('.magazine-arrow').show();
      } else {
        //否则就隐藏
        $('.magazine-arrow').hide();
      }
      //触发事件
      $layout.trigger('change');
    };

    if (args) {
      if (args.constructor == Object) {
        return this['init'](args);
      } else {
        return this[args]();
      }
    }

    return $layout;//return jquery obj
  };
}(jQuery));
