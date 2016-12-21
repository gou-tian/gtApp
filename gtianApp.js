/**
 * author GouTian
 * E-Mail goutian@foxmail.com
 * Created on 2016-04-14.
 * Last modified time 2016-07-25 (+8)09:06
 */
(function(window) {
	var tian = (function() {
		var type = {};
		var toString = type.toString;

		var app = {
			// 获取css属性值
			css: function(obj, attr) {
				// 标准浏览器与IE非标准浏览器兼容处理
				if (obj.currentStyle) {
					// IE非标准浏览器
					return obj.currentStyle[attr];
				} else {
					// 标准浏览器
					// 兼容老版本火狐下getComputedStyle的一个Bug。需要多传入一个参数
					return getComputedStyle(obj, false)[attr];
				}
			},
			// 缓动动画
			bufferMove: function(obj, valName, func) {
				clearInterval(obj.iTime);
				//速度值计算变量
				var iSpeed = 0;
				var num = 0;
				//开启定时器
				obj.iTime = setInterval(function() {
					//设置多属性判断条件
					var iSwitch = true;
					//循环json获取属性及属性值
					for (var nature in valName) {
						//获取属性值
						var iTarget = valName[nature];
						//判断属性
						if (nature == 'opacity') {
							num = Math.round(app.css(obj, 'opacity') * 100);
						} else {
							num = parseInt(app.css(obj, nature));
						}
						//速度值计算
						iSpeed = (iTarget - num) / 8;
						iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
						//属性赋值
						if (num != iTarget) {
							//每次进来时说明有条件未执行完成iSwitch设置为false
							iSwitch = false;
							if (nature == 'opacity') {
								obj.style.opacity = (iSpeed + num) / 100;
								obj.style.filter = 'alpha(opacity' + (iSpeed + num) + ')';
							} else {
								obj.style[nature] = iSpeed + num + 'px';
							}
						}
					}
					//全部for循环执行完毕后检查所有条件是否执行完，判断条件为iSwitch,iSwitch为true为所有条件满足
					if (iSwitch) {
						//关闭定时器
						clearInterval(obj.iTime);
						//关闭定时器后判断是否有回调函数，如果有则执行同时把this指向调用对象
						func && func.call(obj);
					}
				}, 14);
			},
			// 事件绑定
			addEventBind: function(obj, events, func) {
				if (obj.addEventListener) {
					obj.addEventListener(events, func, false);
				} else if (obj.attachEvent) {
					obj.attachEvent('on' + events, function() {
						func.call(obj);
					});
				} else {
					obj["on" + events] = func;
				}
			},
			// 删除事件
			removeEvent: function(obj, events, func) {
				if (obj.removeEventListener) {
					obj.removeEventListener(events, func, false);
				} else if (obj.detachEvent) {
					obj.detachEvent("on" + events, func);
				} else {
					delete obj["on" + events];
				}
			},
			// 判断浏览器
			ifBrowser: function() {
				// 取得浏览器的userAgent字符串
				var userAgent = navigator.userAgent;
				var isOpera = userAgent.indexOf("Opera") > -1;
				// 判断是否Opera浏览器
				if (isOpera) {
					return "Opera";
				}
				// 判断是否Firefox浏览器
				if (userAgent.indexOf("Firefox") > -1) {
					return "FF";
				}
				// 判断是否Chrome浏览器
				if (userAgent.indexOf("Chrome") > -1) {
					return "Chrome";
				}
				// 判断是否Safari浏览器
				if (userAgent.indexOf("Safari") > -1) {
					return "Safari";
				}
				// 判断是否IE浏览器
				if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
					return "IE";
				}
			},
			// 获取指定节点
			getNode: function(nodes, type) {
				type = type || 1;
				var aResult = [];
				for (var i = 0, len = nodes.length; i < len; i++) {
					if (nodes[i].nodeType === type) {
						aResult.push(nodes[i]);
					}
				}
				return aResult;
			},
			// 获取iframe高度
			setIframeHeight: function(contentID, boxID) {
				boxID = boxID || null;
				var frameWin = document.getElementById(contentID);
				var frameBox = document.getElementById(boxID);
				var newHeight;
				if (frameWin.Document) {
					newHeight = frameWin.Document.body.scrollHeight + 20 + "px";
				} else {
					newHeight = frameWin.contentDocument.body.scrollHeight + 20 + "px";
				}

				if (boxID !== null) {
					frameBox.style.height = newHeight;
				}
				frameWin.style.height = newHeight;
			},
			// HTML5 上传图片预览
			fileReader: function(inputs, box) {
				var oImg = document.getElementById(box);
				var oInput = document.getElementById(inputs);
				if (typeof FileReader === 'undefined') {
					oImg.innerHTML = "抱歉，你的浏览器不支持 FileReader";
					oInput.setAttribute('disabled', 'disabled');
					return false;
				}

				var that = this;
				this.bind(oInput, 'change', readFile);

				function readFile() {
					// 获取file对象
					if (this.files.length > 1) {
						for (var i = 0, len = this.files.length; i < len; i++) {
							ifFile(this.files[i]);
						}
					} else {
						ifFile(this.files[0]);
					}

					function ifFile(elem) {
						// 判断file的类型是不是图片类型。
						if (!/image\/\w+/.test(elem.type)) {
							alert("文件必须为图片！");
							return false;
						}
						// 声明一个FileReader实例
						var reader = new FileReader();
						//调用readAsDataURL方法来读取选中的图像文件
						reader.readAsDataURL(elem);
						//最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片
						oImg.innerHTML = '';
						that.bind(reader, 'load', function() {
							oImg.innerHTML += '<img src="' + this.result + '" title="' + elem.name + '"/>';
						});
					}
				}
			},
			// 数据类型判断
			type: function(obj) {
				return toString.call(obj).split('object ').pop().trim().split(']').shift();
			}
		};

		var objectType = (function() {
			return {
				isPlainObject: function(obj) {
					return app.type(obj) === 'object';
				},
				isArray: Array.isArray || function(obj) {
					return app.type(obj) === 'array';
				}
			};
		}());

		function getViewportWH() {
			return {
				w: document.documentElement.clientWidth,
				h: document.documentElement.clientHeight
			};
		}

		function touchAngle(touchObj, showHide) {
			var setting = {
				show: showHide.show,
				hide: showHide.hide,
				up: showHide.up,
				down: showHide.down
			};
			//返回角度
			function GetSlideAngle(dx, dy) {
				return Math.atan2(dy, dx) * 180 / Math.PI;
			}
			//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
			function GetSlideDirection(startX, startY, endX, endY) {
				var dy = startY - endY;
				var dx = endX - startX;
				var result = 0;
				//如果滑动距离太短
				if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
					return result;
				}
				var angle = GetSlideAngle(dx, dy);
				if (angle >= -45 && angle < 45) {
					result = 4;
				} else if (angle >= 45 && angle < 135) {
					result = 1;
				} else if (angle >= -135 && angle < -45) {
					result = 2;
				} else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
					result = 3;
				}
				return result;
			}
			//滑动处理
			var startX, startY;
			bind(touchObj, 'touchstart', function(ev) {
				startX = ev.touches[0].pageX;
				startY = ev.touches[0].pageY;
			});
			bind(touchObj, 'touchend', function(ev) {
				var endX, endY;
				endX = ev.changedTouches[0].pageX;
				endY = ev.changedTouches[0].pageY;
				var direction = GetSlideDirection(startX, startY, endX, endY);
				switch (direction) {
					case 0:
						// 没滑动
						break;
					case 1:
						// 向上
						ifFn(setting.up);
						break;
					case 2:
						// 向下
						ifFn(setting.down);
						break;
					case 3:
						// 向左
						ifFn(setting.hide);
						break;
					case 4:
						// 向右
						ifFn(setting.show);
						break;
					default:
				}

				function ifFn(setting) {
					if (typeof setting != 'undefined') {
						setting();
					} else {
						ev.stopPropagation();
					}
				}
			});
		}
		// 元素拖动
		function drag(dom) {
			dom.onmousedown = function(e) {
				this.style.cursor = 'move';
				down.call(this, e);
			};

			function down(e) {
				e = e || window.event;
				var mouseY = e.clientY - this.offsetTop;
				var mouseX = e.clientX - this.offsetLeft;
				// 低版本ie全局捕获
				if (this.setCapture) {
					this.setCapture();
				}
				document.onmousemove = function(e) {
					move.call(null, e, mouseX, mouseY);
				};
				document.onmouseup = function() {
					removeEvent.call(dom);
				};
			}

			function move(e, x, y) {
				var
					ev = e || event,
					// 计算鼠标当前位置
					docX = ev.clientX - x,
					docY = ev.clientY - y;
				// 属性值赋值
				dom.style.top = docY + 'px';
				dom.style.left = docX + 'px';
			}

			function removeEvent() {
				//清空事件
				document.onmousemove = null;
				document.onmouseup = null;
				//释放全局捕获
				if (this.setCapture) {
					this.releaseCapture();
				}
				this.style.cursor = 'default';
			}
			return false;
		}
		// 获取浏览器及其版本
		function getBrowser() {
			var agent = navigator.userAgent.toLowerCase();
			var regStr_ie = /msie [\d.]+/gi;
			var regStr_ff = /firefox\/[\d.]+/gi;
			var regStr_chrome = /chrome\/[\d.]+/gi;
			var regStr_saf = /safari\/[\d.]+/gi;
			// MsIe
			if (agent.indexOf("msie") > 0) {
				return agent.match(regStr_ie);
			}
			// Firefox
			if (agent.indexOf("firefox") > 0) {
				return agent.match(regStr_ff);
			}
			// Chrome
			if (agent.indexOf("chrome") > 0) {
				return agent.match(regStr_chrome);
			}
			// Safari
			if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
				return agent.match(regStr_saf);
			}
		}
		// 判断小于IE10的IE浏览器
		function judgeIeBrowser(dom) {
			if (this.user !== 'msie') {
				return false;
			}
			dom.value = '用户名';
			if (this.user === 'msie' && parseInt(this.verinfo) < 10) {
				if (dom.type === 'password') {
					dom.type = 'text';
					dom.value = '密码';
					dom.onfocus = function() {
						dom.type = 'password';
						dom.value = '';
					};
					dom.onblur = function() {
						if (this.value === '') {
							dom.type = 'text';
							dom.value = '密码';
						}
					};
				} else {
					dom.onfocus = function() {
						if (this.value === '用户名') {
							this.value = '';
						} else {
							return false;
						}
					};
					dom.onblur = function() {
						if (this.value === '') {
							this.value = '用户名';
						}
					};
				}
			}
		}
		// 获取光标起始和结束位置
		var seat = (function() {
			var toStr = window.getSelection();
			var toString = toStr.toString();
			var start = 0,
				end = 0;
			if (window.getSelection) {
				start = toStr.anchorOffset;
				end = toStr.focusOffset;
			} else {
				if (typeof this.selectionStart === 'number') {
					start = this.selectionStart;
					end = this.selectionEnd;
				} else {
					return {
						start: -1,
						end: -1
					};
				}
			}
			return {
				start: start,
				end: end,
				toStr: toString
			};
		});
		// 深、浅度拷贝
		function extend() {
			var src, copyIsArray, copy, name, options, clone,
				target = arguments[0] || {},
				len = arguments.length,
				i = 1,
				deep = false,
				type = objectType;

			if (typeof target === 'boolean') {
				deep = target;
				target = arguments[i] || {};
				i++;
			}

			if (typeof target === 'object' && typeof target === 'function') {
				target = {};
			}

			for (; i < len; i++) {

				if ((option = arguments[i]) !== null) {

					for (name in option) {
						src = target[name];
						copy = option[name];

						if (target === copy) {
							continue;
						}

						if (deep && copy && (type.isPlainObject(copy) ||
								(copyIsArray = type.isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && type.isArray(src) ? src : [];
							} else {
								clone = src && type.isPlainObject(src) ? src : {};
							}
							target[name] = extend(deep, clone, copy);
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}
			return target;
		}
		// 节流函数测试
		function throttle(method, delay, duration) {
			delay = 100;
			duration = 300;
			var timer = null,
				begin = new Date();
			return (function() {
				var context = this,
					args = arguments,
					current = new Date();
				clearTimeout(timer);
				if (current - begin >= duration) {
					method.apply(context, args);
					begin = current;
				} else {
					timer = setTimeout(function() {
						method.apply(context, args);
					}, delay);
				}
			}());
		}
		// 函数重载
		function addMethod(object, name, fn) {
			//保存原有的函数，因为调用的时候可能不匹配传入的参数个数
			var old = object[name];
			object[name] = function() {
				if (fn.length == arguments.length) {
					//如果该匿名函数的形参个数和实数个数匹配，就调用该函数
					return fn.apply(this, arguments);
				} else if (typeof old == 'function') {
					//如果传入的参数个数不匹配，则调用原有的参数
					return old.apply(this, arguments);
				}
			};
		}
		//时钟
		function clock(obj){
			var gtTime = new Date();
			var gtYear = gtTime.getFullYear(); // 年
			var gtMonth = gtTime.getMonth() + 1; // 月
			var gtDate = gtTime.getDate(); // 日
			var gtDay = (function(){
				var rel = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
				return rel[gtTime.getDay()];
			}());
			var gtHours = gtTime.getHours(); //时
			var gtMinute = gtTime.getMinutes(); //分
			var gtSecond = gtTime.getSeconds(); //秒
			var timeObj = obj.children;
			var str = gtYear + '-' + zeroize(gtMonth) + '-' + zeroize(gtDate) + ' ' + gtDay + ' ' + zeroize(gtHours) + ':' + zeroize(gtMinute) + ':' + zeroize(gtSecond);
			obj.innerHTML = str;
			function zeroize(obj){
				return obj < 10 ? '0' + obj : '' + obj;
			}
		}
		// 发布订阅		
		var obs = (function() {
			function subscribe(key, func) {
				if (!this.listener[key]) {
					this.listener[key] = [];
				}
				this.listener[key].push(func);
			}

			function trigger() {
				var key = Array.prototype.shift.call(arguments),
					fn = this.listener[key];
				if (!fn || fn.length === 0) {
					return false;
				}
				for (var attr in fn) {
					fn[attr].apply(this, arguments);
				}
			}

			function remove(key, func) {
				if (!this.listener[key]) {
					return false;
				}
				var fn = this.listener[key],
					i = 0,
					len = fn.length;

				if (!func) {
					fn.length = 0;
				} else {
					for (; i < len; i++) {
						if (fn[i] === func) {
							fn.splice(i, 1);
						}
					}
				}
			}
			return {
				listener: {},
				add: subscribe,
				trigger: trigger,
				rm: remove
			};
		}());
		return {
			css: app.css,
			bufferMove: app.bufferMove,
			on: app.addEventBind,
			off: app.removeEvent,
			getBrowser: app.ifBrowser,
			typeNode: app.getNode,
			iframeHei: app.setIframeHeight,
			getViewWH: getViewportWH,
			touchAngle: touchAngle,
			file: app.fileReader,
			drag: drag,
			type: app.type,
			getBrowserType: (getBrowser() + '').replace(/[0-9+\/+.\s]/ig, ""),
			getBrowserNum: (getBrowser() + '').replace(/[^0-9.]/ig, ""),
			ieBrowser: judgeIeBrowser,
			seat: seat,
			extend: extend,
			choke: throttle,
			addMethod: addMethod,
			clock: clock,
			obs: obs
		};
	}());
	window.tian = tian;
}(typeof window !== 'undefined' ? window : this));
