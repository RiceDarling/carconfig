$('#darkpane').addClass('on');
$("body").addClass("wait");

window.onload = function() {
	$('#darkpane').removeClass('on');
	$("body").removeClass("wait");
	$("body").addClass("ready");
	//级联菜单("车型" 鼠标移入移出事件)
	function fnFirstMenu(obj1) {

		var oVehicle = document.getElementById(obj1);
		//鼠标移入
		oVehicle.onmouseover = function() {
			$("html").addClass("noscroll");
			$("body").addClass("open-modelflyout");
			$('#darkpane').addClass('on');
			$('#s_models').addClass('open');
		};
		//鼠标离开
		$('#s_models').mouseleave(function() {
			$("html").removeClass("noscroll");
			$("body").removeClass("open-modelflyout");
			$('#darkpane').removeClass('on');
			$('#s_models').removeClass('open');
		});

	};
	//级联菜单-二级菜单
	function fnSecondMenu(obj) {

		var oModels = document.getElementById(obj);
		var aDiv = oModels.querySelectorAll(".model-item");

		for(var i = 0; i < aDiv.length; i++) {

			aDiv[i].onmouseover = function() {
				$(".model-item").removeClass("open");
				$(this).addClass("open");
			};

			aDiv[i].onmouseout = function() {
				$(this).removeClass("open");
			};
		}
	};

	//nav导航左、右点击事件
	function nav_left_right_showBtn() {};

	//菜单(小窗口下的点击事件)
	function fnBurgerMenu() {

		var search_x_button = document.getElementById("search_x_button");
		var search_x_inp = document.getElementById("search_x_inp");
		var oSubmenu_summary = document.getElementById("submenu_summary_x_myPorsche_submenu_x_submenu_parent");

		//菜单展开
		$("#s_burgermenu").click(function() {
			if($("html").hasClass("noscroll")) {
				$("html").removeClass("noscroll");
				$("body").removeClass("open-burgermenu");
			} else {
				$("html").addClass("noscroll");
				$("body").addClass("open-burgermenu");

				//菜单展开后列表展开收缩
				$("#s_conf_submenu section").click(function() {

					if($(this).hasClass('selected')) {

						$("#s_conf_submenu section div").removeClass("selected");
						$("#s_conf_submenu section").removeClass("selected");
						$("#s_conf_submenu section").removeClass("activeNav");

					} else {

						$("#s_conf_submenu section div").removeClass("selected");
						$("#s_conf_submenu section").removeClass("selected");
						$("#s_conf_submenu section").removeClass("activeNav");
						$(this).addClass("selected");
						$(this).addClass("activeNav");
					}
					preventdefault;
				});

				//搜索按钮(放大镜)点击并赋予焦点
				search_x_button.onclick = function() {
					$("body").addClass("search-active");
					search_x_inp.focus(); //添加焦点事件
				};

				//失去焦点事件
				search_x_inp.onblur = function() {
					$("body").removeClass("search-active");
				};

				//汇总事件
				oSubmenu_summary.onclick = function() {

					$("html").addClass("show-scrollbar-y");
					$("html").removeClass("noscroll");
					$("body").removeClass("open-burgermenu");
					//继续配置页面
					$("html").addClass("show-scrollbar-y");
					//$("body").addClass("wait");
					//$("#ui").addClass("summary");
				};
				//列表样式添加
				$(".configMenu_hdl").click(function() {

					if($(this).parent().parent().parent().hasClass("accordion-open")) {
						$(this).parent().parent().parent().removeClass("accordion-open");
						$(this).parent().parent().parent().addClass("accordion-closed");
						$(this).parent().parent().prev().attr("data-active", "false");
						$(this).parent().parent().next().next().attr("data-active", "false");
					} else {
						$(this).parent().parent().parent().removeClass("accordion-closed");
						$(this).parent().parent().parent().addClass("accordion-open");
						$(this).parent().parent().prev().attr("data-active", "true");
						$(this).parent().parent().next().next().attr("data-active", "true");
					}
				});

				//锚点跳转
				//车身颜色及车轮-车身颜色
				fnAnimate("#submenu_exterieur_x_AA_submenu_x_IAF", "#IAF_subHdl");
				//车身颜色及车轮-车轮
				fnAnimate("#submenu_exterieur_x_AA_submenu_x_IRA", "#IRA_subHdl");
				//车身颜色及车轮-车轮配件 
				fnAnimate("#submenu_exterieur_x_AA_submenu_x_IRZ", "#IRZ_subHdl");

				//内饰颜色及座椅-内饰颜色及材料
				fnAnimate("#submenu_interieur_x_AI_submenu_x_submenu_interior_and_material", "#submenu_interior_and_material_subHdl");
				//内饰颜色及座椅-座椅
				fnAnimate("#submenu_interieur_x_AI_submenu_x_submenu_seats", "#submenu_seats_subHdl");

				//选装-外部
				fnAnimate("#submenu_individualization_x_individual_submenu_x_IEX", "#IEX_subHdl");
				//选装-变速箱/底盘
				fnAnimate("#submenu_individualization_x_individual_submenu_x_IMG", "#IMG_subHdl");
				//选装-内饰
				fnAnimate("#submenu_individualization_x_individual_submenu_x_IIN", "#IIN_subHdl");
				//选装-真皮内饰
				fnAnimate("#submenu_individualization_x_individual_submenu_x_IIL", "#IIL_subHdl");
				//选装-Alcantara 内饰
				fnAnimate("#submenu_individualization_x_individual_submenu_x_IAL", "#IAL_subHdl");
				//选装-木质内饰
				fnAnimate("#submenu_individualization_x_individual_submenu_x_IIH", "#IIH_subHdl");
				//选装-碳纤维内饰
				fnAnimate("#submenu_individualization_x_individual_submenu_x_IIC", "#IIC_subHdl");
				//选装-铝合金内饰
				fnAnimate("#submenu_individualization_x_individual_submenu_x_IIA", "#IIA_subHdl");
				//选装-音响与交通
				fnAnimate("#submenu_individualization_x_individual_submenu_x_IAU", "#IAU_subHdl");

				//更多个性化选项-真皮颜色选择/装饰性缝线
				fnAnimate("#submenu_zoffer_x_zOffer_submenu_x_ZFW", "#ZFW_subHdl");

				//精装配件-车轮和车轮附件
				fnAnimate("#submenu_tequipment_x_tequipment_submenu_x_ABC", "#ABC_subHdl");
				//精装配件-车内
				fnAnimate("#submenu_tequipment_x_tequipment_submenu_x_AAF", "#AAF_subHdl");
				//精装配件-运输和保护
				fnAnimate("#submenu_tequipment_x_tequipment_submenu_x_ABE", "#ABE_subHdl");
				//精装配件-儿童座椅
				fnAnimate("#submenu_tequipment_x_tequipment_submenu_x_AAG", "#AAG_subHdl");
				//精装配件-养护
				fnAnimate("#submenu_tequipment_x_tequipment_submenu_x_ABB", "#ABB_subHdl");
			};
		});

	}
	//轮播图  (移入移出)prev next   
	function prev_next_showBtn(id, id2) {

		var oShowBtn = document.getElementById(id);
		var oPrintBtn = document.getElementById(id2);

		oShowBtn.onmouseover = function() {

			$(oPrintBtn).addClass("showArrows");
		};

		oShowBtn.onmouseout = function() {

			$(oPrintBtn).removeClass("showArrows");

		};
	};
	//头部添加active选中样式
	function addActive(id) {

		var navigation = document.getElementById(id);
		var aActive = navigation.getElementsByTagName("a");

		var len = aActive.length;

		for(i = 1; i < len; i++) {

			aActive[i].onclick = function() {

				for(i = 0; i < len; i++) {

					aActive[i].className = '';
				};
				this.className = 'activeNav';
				if($("#navigation_main_x_mainsuboffer_x_myPorsche").hasClass("activeNav")) {
					$("html").addClass("show-scrollbar-y");
					//$("body").addClass("wait");
					$("#ui").addClass("summary");
				} else {
					$("html").removeClass("show-scrollbar-y");
					//$("body").removeClass("wait");
					$("#ui").removeClass("summary");
				}
			};
		};
	};

	//价格详情
	function priceMobile(id) {

		var s_price_mobile = document.getElementById(id);

		s_price_mobile.onclick = function() {

			if(!$("#s_price_mobile").hasClass("open")) {
				$("#s_price_mobile").addClass("open")

			} else {
				$("#s_price_mobile").removeClass("open")
			}

		};
	};

	/*//大图预览
	function fnBtnFullScreen2D(id) {
		var oBtnFullScreen2D = document.getElementById(id);

		oBtnFullScreen2D.onclick = function() {
			alert("2D模式大图预览事件")
		}
	}*/

	//搜索框
	/*function oSearch(id1, id2, id3) {

		var oSearch_x_inp = document.getElementById(id1);
		var s_conf_submenu = document.getElementById(id2);

		var offsetW = s_conf_submenu.offsetWidth;

		//获得焦点事件
		oSearch_x_inp.onfocus = function() {

			var w = document.body.clientWidth;
			if(w > 1050) {
				oSearch_x_inp.style.width = offsetW - 15 + "px";
			} else if(w < 1050) {
				oSearch_x_inp.style.width = (offsetW - 50) + "px";
			}

		};

		//失去焦点事件
		oSearch_x_inp.onblur = function() {
			oSearch_x_inp.style.width = "";
		};
	};*/

	//添加选配列表按钮,开关(switchSize)
	function addSwitchSize(id) {
		var oSwitchSize = document.getElementById(id);

		oSwitchSize.title = "添加选配列表";
		//点击展开
		oSwitchSize.onclick = function() {

			switchSize.title = "添加车辆图片";
			alert("添加选配列表按钮事件");
		}
	};

	//概览按钮
	function submenuAddOpen() {

		$('.flyout-label').click(function() {

			if(!$('#s_conf_submenu').hasClass('open')) {

				$('#s_conf_submenu').addClass("open");

				$("#s_conf_submenu section").click(function() {

					if($(this).hasClass('selected')) {
						$("#s_conf_submenu section div").removeClass("selected");
						$("#s_conf_submenu section").removeClass("selected");
						$("#s_conf_submenu section").removeClass("activeNav");

					} else {
						$("#s_conf_submenu section div").removeClass("selected");
						$("#s_conf_submenu section").removeClass("selected");
						$("#s_conf_submenu section").removeClass("activeNav");
						$(this).addClass("selected");
						$(this).addClass("activeNav");
					}
					preventdefault;
				});

			} else {
				$('#s_conf_submenu').removeClass("open");

			};

		});

		//车身颜色
		$("#IAF_subHdl").click(function() {

			if($(this).parent().parent().parent().hasClass("accordion-open")) {
				$(this).parent().parent().parent().removeClass("accordion-open");
				$(this).parent().parent().parent().addClass("accordion-closed");
				$(this).parent().parent().prev().attr("data-active", "false");
				$(this).parent().parent().next().next().attr("data-active", "false");

			} else {
				$(this).parent().parent().parent().removeClass("accordion-closed");
				$(this).parent().parent().parent().addClass("accordion-open");
				$(this).parent().parent().prev().attr("data-active", "true");
				$(this).parent().parent().next().next().attr("data-active", "true");

			}
		});

		//车轮
		$("#IRA_subHdl").click(function() {

			if($(this).parent().parent().parent().hasClass("accordion-open")) {
				$(this).parent().parent().parent().removeClass("accordion-open");
				$(this).parent().parent().parent().addClass("accordion-closed");
				$(this).parent().parent().prev().attr("data-active", "false");
				$(this).parent().parent().next().next().attr("data-active", "false");

			} else {
				$(this).parent().parent().parent().removeClass("accordion-closed");
				$(this).parent().parent().parent().addClass("accordion-open");
				$(this).parent().parent().prev().attr("data-active", "true");
				$(this).parent().parent().next().next().attr("data-active", "true");

			}
		});
		/*//概览列表菜单点击事件
		$(".configMenu_hdl").click(function() {

			if($(this).parent().parent().parent().hasClass("accordion-open")) {
				$(this).parent().parent().parent().removeClass("accordion-open");
				$(this).parent().parent().parent().addClass("accordion-closed");
				$(this).parent().parent().prev().attr("data-active", "false");
				$(this).parent().parent().next().next().attr("data-active", "false");

			} else {
				$(this).parent().parent().parent().removeClass("accordion-closed");
				$(this).parent().parent().parent().addClass("accordion-open");
				$(this).parent().parent().prev().attr("data-active", "true");
				$(this).parent().parent().next().next().attr("data-active", "true");

			}
		});*/

	};

	//单选按钮+文本
	function fnCheckedText(obj1, obj2, obj3) {

		$(obj1).mouseover(function() {
			//提示框
			layer.tips("黑色 -" + "2800￥", $(this), {
				tips: [1, '#999']
			});
		});

		$(obj1).click(function() {
			$(obj1).removeClass("selected");
			$(this).addClass("selected");
			$(obj2).text("车型");
			$(obj3).text("价格￥");
		});

	};

	//单选按钮
	function fnChecked(obj, obj2) {
		$(obj).click(function() {
			$(obj).removeClass("checked");
			$(obj2).removeClass("checked");
			$(this).addClass("checked");
			$(obj2).addClass("checked");
		});
	};

	//锚点
	function fnAnimate(obj1, obj2) {

		var _offtop2 = $('#s_conf_submenu').offset().top + $('#s_conf_submenu').height() - 2; //166

		$(obj1).click(function() {

			if($("html").hasClass("noscroll")) {
				$("html").removeClass("noscroll");
				$("body").removeClass("open-burgermenu");
			} else {
				//$("#ui").addClass("smallView");
				$(this).addClass("selected").siblings(".selected").removeClass("selected");

				$("html, body").animate({
					scrollTop: $(obj2).offset().top - _offtop2
				}, {
					duration: 500,
					easing: "swing"
				});

				$('#s_conf_submenu').removeClass("open");

				return false;
			}

		});
	};
	//提示框
	function headNavTooltip() {

		$("#navigation_contact_x_ConfigurationListView").mouseover(function() {
			layer.tips('载入', '#navigation_contact_x_ConfigurationListView', {
				tips: [1, '#999']
			});
		});

		$("#navigation_contact_x_saveAsButton").mouseover(function() {
			layer.tips('保存', '#navigation_contact_x_saveAsButton', {
				tips: [1, '#999']
			});
		});

		$("#navigation_contact_x_printButton").mouseover(function() {
			layer.tips('打印', '#navigation_contact_x_printButton', {
				tips: [1, '#999']
			});
		});

		$("#navigation_contact_x_shareButton").mouseover(function() {
			layer.tips('分享', '#navigation_contact_x_shareButton', {
				tips: [1, '#999']
			});
		});

		$("#navigation_contact_x_pictureButton").mouseover(function() {
			layer.tips('截图', '#navigation_contact_x_pictureButton', {
				tips: [1, '#999']
			});
		});

	};
	//截图
	function fnPictureButton() {

		// 进行canvas生成
		$("#navigation_contact_x_pictureButton").click(function() {
			html2canvas($("#main"), {
				onrendered: function(canvas) {
					//添加属性
					canvas.setAttribute('id', 'mycanvas');
					var dataUrl = canvas.toDataURL();
					//读取属性值
					var value = canvas.getAttribute('id');
					document.getElementById('pictureButton').appendChild(canvas);
					$("#pictureButton img").remove();
					//替换 img-src 地址
					//$("#pictureButton img").attr("src", dataUrl);
				}
			});
		});

		/*
		 * 说明
		 * html2canvas，目前该插件还在开发中，暂不支持带有图片的div转换。图片会被忽略
		 * 对一些的默认样式的支持可能不那么尽如人意，建议自己定义样式,
		 * 不支持iframe
		 * 不支持跨域图片
		 * 不能在浏览器插件中使用
		 * 部分浏览器上不支持SVG图片
		 * 不支持Flash
		 * 不支持古代浏览器和IE，如果你想确认是否支持某个浏览器，可以用它访问 http://deerface.sinaapp.com/ 试试
		 */

		$("#navigation_contact_x_saveAsButton").click(function() {
			var oCanvas = document.getElementById("mycanvas");

			/*自动保存为png*/
			// 获取图片资源
			var img_data1 = Canvas2Image.saveAsPNG(oCanvas, true).getAttribute('src');
			saveFile(img_data1, 'car');

			/*下面的为原生的保存，不带格式名*/
			// 这将会提示用户保存PNG图片
			// Canvas2Image.saveAsPNG(oCanvas);
		});
		// 保存文件函数
		var saveFile = function(data, filename) {
			var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
			save_link.href = data;
			save_link.download = filename;

			var event = document.createEvent('MouseEvents');
			event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			save_link.dispatchEvent(event);
		};
	};

	//分享
	function fnShareButton() {
		$("#navigation_contact_x_shareButton").click(function() {
			/*layer.msg('分享功能', {
				offset: 'c',
				anim: 6
			});*/
			layer.open({
				type: 1,
				title: false,
				closeBtn: 0,
				shadeClose: true,
				content: '<div id="code" style="width:240px;height:240px;text-align: center;background:#fff;color:#000;opacity:0.75"></div>'
			});
			$("#code").qrcode({
				render: "table", //table方式 
				width: 200, //宽度 
				height: 200, //高度 
				text: "www.baidu.com" //任意内容 
			});
		})
	};

	//360°  3D模型按钮vL_3D
	function modelBtn(obj) {
		var oVL_3D = document.getElementById(obj);

		$("#vL_3D").mouseover(function() {
			layer.tips('3D 模式可以提供更加宽广展示,包括所有的选装项和额外的功能,例如360°画面以及内饰和外饰的不同背景', '#vL_3D', {
				tips: [1, '#999'] //还可配置颜色
			});
		});

		/*oVL_3D.onclick = function() {
			alert("3D模型按钮");
		};*/
	};

	//查看内饰(view)
	function seeInterior(obj) {

		var oView = document.getElementById(obj);
		var xLlength = 1;

		var t_left = $(".api3dxcite-container.swiper-slide-active").width();

		$("#view").mouseover(function() {
			layer.tips('查看内饰', '#view', {
				tips: [1, '#999']
			});
		});

		var imgmovefn = function(xL) {
			$('#vis2d_swiper .paginationVis2d > span').removeClass('swiper-visible-switch swiper-active-switch');
			$('#vis2d_swiper .paginationVis2d > span').eq(xL - 1).addClass('swiper-visible-switch swiper-active-switch');
		};
		var sidemovefn = function(xL) {
			$(".api3dxcite-container").removeClass('swiper-slide-visible swiper-slide-active');
			$('.api3dxcite-container.extcam0' + xL).addClass('swiper-slide-visible swiper-slide-active');
		};

		oView.onclick = function() {

			if($("#view").hasClass("ex_on")) {
				$("#view").removeClass("ex_on");
				$("#view").addClass("in_on");
				if(xLlength = 1) {
					xLlength = 5;
					var imgrest = function() {
						imgmovefn(xLlength);
						sidemovefn(xLlength);
					};
					$("#vis2d_swiper .swiper-wrapper").animate({
							'left': t_left
						}, {
							duration: 600,
							easing: "easeOutQuad"
						},
						imgrest()
					);
					setTimeout(function() {
						$('#vis2d_swiper .swiper-wrapper').css('left', -((xLlength - 1) * t_left));
					}, 620);
				}
			} else {
				$("#view").removeClass("in_on");
				$("#view").addClass("ex_on");

				if(xLlength = 5) {
					xLlength = 1;
					var imgrest = function() {
						imgmovefn(xLlength);
						sidemovefn(xLlength);
					};
					$("#vis2d_swiper .swiper-wrapper").animate({
							'left': t_left
						}, {
							duration: 600,
							easing: "easeOutQuad"
						},
						imgrest()
					);
					setTimeout(function() {
						$('#vis2d_swiper .swiper-wrapper').css('left', -((xLlength - 1) * t_left + 20));
					}, 620);
				}
			}

		};
	};

	//声响按钮事件(sound)
	/*function fnSound(obj) {
		var oSound = document.getElementById(obj);

		$("#sound").mouseover(function() {
			layer.tips('播放发动机声响', '#sound', {
				tips: [1, '#999']
			});
		});

		oSound.onclick = function() {
			alert("声响按钮事件");
		};
	};*/

	//显示汇总按钮事件
	function showSummary(obj, obj2, obj3) {

		var oShowSelection = document.getElementById(obj);
		var myPorsche_submenu = document.getElementById(obj2);
		var navigation_mainsuboffer = document.getElementById(obj3);

		oShowSelection.onclick = myPorsche_submenu.onclick = /*navigation_mainsuboffer.onclick =*/ function() {
			$("html").addClass("show-scrollbar-y");
			//$("body").addClass("wait");
			$("#ui").addClass("summary");
		};

		$("#s_navigation_summary_config_end_x_s_navigation_summary_config_end_x_configureButton a,#s_navigation_summary_config_x_s_navigation_summary_config_x_configureButton a").click(function() {
			$("html").removeClass("show-scrollbar-y");
			//$("body").removeClass("wait");
			$("#ui").removeClass("summary");
		});
	};

	//下方红色箭头按钮
	function redBtnClick(id1, id2) {

		var oScrollIndicator = document.getElementById(id1);
		var oScrollIndicatorWrapper = document.getElementById(id2);

		oScrollIndicator.onclick = function() {

		};
	};

	//级联菜单(一二级菜单)
	fnFirstMenu("navigation_main_x_mainsuboffer_x_models");
	fnSecondMenu("models");
	//轮播图(中心区域图片移入移出事件)
	//prev_next_showBtn("vis2d_swiper_arrow_left", "vis2d_swiper");
	//prev_next_showBtn("vis2d_swiper_arrow_right", "vis2d_swiper");

	//头部添加active选中样式
	addActive("navigation_main_x_mainsuboffer");

	//头部导航提示框
	headNavTooltip();

	//截图+保存
	fnPictureButton();

	//分享
	fnShareButton();

	//小窗口菜单点击事件
	fnBurgerMenu();

	//手机版nav导航事件
	nav_left_right_showBtn();

	//搜索框
	/*oSearch("search_x_inp", "s_conf_submenu");*/

	//添加选配列表按钮,开关(switchSize)
	addSwitchSize("switchSize");

	//概览按钮事件
	submenuAddOpen();

	//360°  3D模型按钮vL_3D
	modelBtn("vL_3D");

	//查看内饰(view)
	seeInterior("view");

	//声响按钮事件(sound)
	/*fnSound("sound");*/

	//显示汇总按钮事件
	showSummary("s_navigation_config_end_x_s_navigation_config_end_x_showSelection", "submenu_summary_x_myPorsche_submenu_x_submenu_parent", "navigation_main_x_mainsuboffer_x_myPorsche");
	//右下方红色箭头
	redBtnClick("scrollIndicator", "scrollIndicatorWrapper");

	//价格详情弹窗
	priceMobile("s_price_mobile");

	//大图预览
	/*fnBtnFullScreen2D("btnfullscreen2D");*/

	/*锚点 start*/
	//车身颜色及车轮-车身颜色
	fnAnimate("#submenu_exterieur_x_AA_submenu_x_IAF", "#IAF_subHdl");
	//车身颜色及车轮-车轮
	fnAnimate("#submenu_exterieur_x_AA_submenu_x_IRA", "#IRA_subHdl");
	//车身颜色及车轮-车轮配件 
	fnAnimate("#submenu_exterieur_x_AA_submenu_x_IRZ", "#IRZ_subHdl");

	//内饰颜色及座椅-内饰颜色及材料
	fnAnimate("#submenu_interieur_x_AI_submenu_x_submenu_interior_and_material", "#submenu_interior_and_material_subHdl");
	//内饰颜色及座椅-座椅
	fnAnimate("#submenu_interieur_x_AI_submenu_x_submenu_seats", "#submenu_seats_subHdl");

	//选装-外部
	fnAnimate("#submenu_individualization_x_individual_submenu_x_IEX", "#IEX_subHdl");
	//选装-变速箱/底盘
	fnAnimate("#submenu_individualization_x_individual_submenu_x_IMG", "#IMG_subHdl");
	//选装-内饰
	fnAnimate("#submenu_individualization_x_individual_submenu_x_IIN", "#IIN_subHdl");
	//选装-真皮内饰
	fnAnimate("#submenu_individualization_x_individual_submenu_x_IIL", "#IIL_subHdl");
	//选装-Alcantara 内饰
	fnAnimate("#submenu_individualization_x_individual_submenu_x_IAL", "#IAL_subHdl");
	//选装-木质内饰
	fnAnimate("#submenu_individualization_x_individual_submenu_x_IIH", "#IIH_subHdl");
	//选装-碳纤维内饰
	fnAnimate("#submenu_individualization_x_individual_submenu_x_IIC", "#IIC_subHdl");
	//选装-铝合金内饰
	fnAnimate("#submenu_individualization_x_individual_submenu_x_IIA", "#IIA_subHdl");
	//选装-音响与交通
	fnAnimate("#submenu_individualization_x_individual_submenu_x_IAU", "#IAU_subHdl");

	//更多个性化选项-真皮颜色选择/装饰性缝线
	fnAnimate("#submenu_zoffer_x_zOffer_submenu_x_ZFW", "#ZFW_subHdl");

	//精装配件-车轮和车轮附件
	fnAnimate("#submenu_tequipment_x_tequipment_submenu_x_ABC", "#ABC_subHdl");
	//精装配件-车内
	fnAnimate("#submenu_tequipment_x_tequipment_submenu_x_AAF", "#AAF_subHdl");
	//精装配件-运输和保护
	fnAnimate("#submenu_tequipment_x_tequipment_submenu_x_ABE", "#ABE_subHdl");
	//精装配件-儿童座椅
	fnAnimate("#submenu_tequipment_x_tequipment_submenu_x_AAG", "#AAG_subHdl");
	//精装配件-养护
	fnAnimate("#submenu_tequipment_x_tequipment_submenu_x_ABB", "#ABB_subHdl");
	/*锚点 end*/

	/*功能列表配置项-单选按钮选中事件 start*/
	//车身颜色及车轮-车身颜色--请求中状态( " curSelected " );
	fnCheckedText("#s_exterieur_x_IAF ul li", "#s_exterieur_x_IAF .tt_text.tt_cell", "#s_exterieur_x_IAF .tt_price.tt_cell");
	//车身颜色及车轮-车轮
	fnCheckedText("#s_exterieur_x_IRA ul li", "#s_exterieur_x_IRA .tt_text.tt_cell", "#s_exterieur_x_IRA .tt_price.tt_cell");
	//车身颜色及车轮-车轮配件
	fnChecked("#s_exterieur_x_IRZ #vs_table_IRZ div");
	//内饰颜色及座椅-内饰颜色及材料
	fnCheckedText("#s_interieur_x_submenu_interior_and_material ul li", "#s_interieur_x_submenu_interior_and_material .tt_text.tt_cell", "#s_interieur_x_submenu_interior_and_material .tt_price.tt_cell");
	//内饰颜色及座椅-座椅
	fnChecked("#s_interieur_x_submenu_seats .content span", "#s_interieur_x_submenu_seats .content .seatTypes");
	//选装-外部
	fnChecked("#s_individual #vs_table_IEX div");
	//选装-变速箱/底盘
	fnChecked("#s_individual #vs_table_IMG div");
	//选装-内饰
	fnChecked("#s_individual #vs_table_IIN div");
	//选装-真皮内饰
	fnChecked("#s_individual #vs_table_IIL div");
	//选装-Alcantara 内饰
	fnChecked("#s_individual #vs_table_IAL div");
	//选装-木质内饰
	fnChecked("#s_individual #vs_table_IIH div");
	//选装-碳纤维内饰
	fnChecked("#s_individual #vs_table_IIC div");
	//选装-铝合金内饰
	fnChecked("#s_individual #vs_table_IIA div");
	//选装-音响与交通
	fnChecked("#s_individual #vs_table_IAU div");

	//更多个性化选项 - 真皮颜色选择/装饰性缝线
	fnChecked("#s_zoffer #vs_table_ZFW div");

	//精装配件 -车轮和车轮附件
	fnChecked("#s_tequipment #vs_table_ABC div");
	//精装配件 -车内
	fnChecked("#s_tequipment #vs_table_AAF div");
	//精装配件 -运输和保护
	fnChecked("#s_tequipment #vs_table_ABE div");
	//精装配件 -儿童座椅
	fnChecked("#s_tequipment #vs_table_AAG div");
	//精装配件 -养护
	fnChecked("#s_tequipment #vs_table_ABB div");
	/*功能列表配置项-单选按钮选中事件 end*/
}