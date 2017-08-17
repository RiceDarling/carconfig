/* 封装加载xml的方法  读取  写入 删除 */
/* 
 *
 *首先在 xml-engine-core.xml 中配置对象名称、id 
 *
 *<?xml version="1.0" encoding="utf-8"?>
 *<engine-object>
 *	<carinfo carid="1">
 *		<id>1</id>
 *      <name>carPaint</name>
 *   </carinfo>
 *   <carinfo carid="2">
 *      <id>2</id>
 *      <name>carWheel</name>
 *   </carinfo>
 *</engine-object>
 *
 *其中头文件和engin-Object标签不需要修改
 *
 *再name标签中填写xml对象名，同时也应该是文件名，这些名称所对应的xml文件应在object-xml文件夹中找到
 *
 *标签内不要加任何标点符号和空格
 *
 */

'use strict'




$.fn[ 'dataengine' ] = function () {
	var self = $( this ),
		settings = {
			folder : 'object-xml/',				/* 存储xml对象的文件夹 */				
			coreurl : 'xml-engine-core.xml',	/* 核心xml对象的路径 */
			type : 'get',						/* 获取方式 */
			timeout : 1000,						/* 延迟时间 如果对象内容较多则设置的延迟时间大些 */
			dataname : '',						/* html中的对象标记 */
			cache : false,						/* 是否缓存 */
			async : false,						/* 是否异步加载 */
			fnafter : function () {},			/* 加载成功后执行的方法 */
			fnerror : function () {},			/* 加载失败后执行的方法 */
			jsondata : '',						/* 转换后的json对象 */
			M_DOT : 1,							/* 用于核心xml缩进, 根据节点级别 此参数不是外传参数 */
			cM_DOT : 1,							/* 用于非核心xml缩进, 根据节点级别 此参数不是外传参数 */
			stringarr : [],						/* 用于承载对象字符串的数组 此参数不是外传参数 */
			Objectarr : {},						/* 存储用于生成json的对象 此参数不是外传参数 */
			objerror : []						/* 用于存储无法加载的xml对象文件 */
		};
	var exps = {
		init : function ( options ) {
			
			/* 初始化 */
			settings = $.extend( settings , options );

			/* 为了确保兼容性使用jquery ajax加载xml  此处应注意jquery仅解决架构问题，对象的操作需使用原生js */
			/* 首先加载xml-engine-core.xml中的对象数据用于在文件夹中查找xml对象文件 */
			$.ajax({
				type : settings.type,
				url : 'xml-engine-core.xml',
				dataType : 'xml',
				timeout : settings.timeout,
				cache : settings.cache,
				async : settings.async,
				success : function ( xmldata ) {

					/* 首先找到顶级节点  xml的对象是用节点表示 */
					$( xmldata ).find( '*:first' ).children().each( function( i ){

						exps.nodefn( $( this ) , settings.stringarr );

					});

					//$( '.engine-code' ).html( settings.stringarr.join( '' ) );
					var clearspace = /\s/g;
					var child_obj = {}; //承载所有非核心的xml对象
					for ( var c = 0 ; c < settings.stringarr.length ; c++ ) {
						
						var objstr = ( ( settings.stringarr[ c ] ).split( '        ' ) )[ 1 ].replace( clearspace , '' );
						
						$.ajax({
							type : settings.type,
							url : settings.folder + '/' + objstr + '.xml',
							dataType : 'xml',
							timeout : settings.timeout,
							cache : settings.cache,
							async : settings.async,
							success : function ( xmldata2 ) {

								
								child_obj[ objstr ] = new Array();	/* 子对象集合 */
								/* 获取子对象中的所有属性 */
								$( xmldata2 ).find( '*:first' ).children().each( function( i ){

									exps.childobjnodefn( $( this ) , child_obj[ objstr ] );

								});
								
								var child_objwell = new Array();
								/* 解析xml对象 */
								for ( var k = 0 ; k < child_obj[ objstr ].length ; k++ ) {
									var tojsonarr = {};
									for ( var _tag in child_obj[ objstr ][ k ] ) {
										tojsonarr[ _tag ] = child_obj[ objstr ][ k ];
									}
									child_objwell.push( tojsonarr );
								}
								child_obj[ objstr ] = child_objwell;
							
								

							},
							error : function () {
								settings.objerror.push( objstr + 'xml' );
							}
						});
				
						
					}
					
					settings.Objectarr = child_obj;
					self.data( 'settings' , settings );
					
					/* 以下方法经测试无法找到所需节点对象
					var rectstr = '';   
					for ( var c in xmldata ) {
						var _val = xmldata[ c ];
						rectstr = rectstr + c + ' : ' + _val + ";\n";
					}
					$( '.engine-code' ).html( rectstr );
					*/

				},
				error : function () {
					alert('先设置浏览器跨域')
					settings.fnerror();
					settings.objerror.push( 'xml-engine-core.xml' );
				
				}
			});

		},
		getxml : function () {
			
			return self.data( 'settings').Objectarr;
		},
		childobjnodefn : function ( nodeobj , objarr ) {
			
			/* 用于遍历非核心xml对象 */
			var myObj = nodeobj[ 0 ].attributes;
			$( myObj ).each( function ( i ) {
				var _str = $( this )[ 0 ].ownerElement.children;
				
				if ( _str != null && _str != undefined ) {
					objarr.push( _str );
				}
			});
			if ( nodeobj.length > 0 ) {
				nodeobj.children().each( function ( i ) {
					exps.childobjnodefn( $( this ) );
				})
			}else{
				return false;
			}
			
		},
		faildload : function () {
			
			/* 返回未加载成功的对象名 */
			return settings.objerror;
			
		},
		nodefn : function ( nodeobj , objarr ) {
			
			/* 遍历xml核心对象 */
			var myObj = nodeobj[ 0 ].attributes;//赋给myObj变量

			/* 在页面中输出对象看是否正确 BEGIN */

					//var dotString = ''; //定义一个变量, 用于缩进
					/* 根据缩进量, 得到缩进的长度 */
					/*for ( var j = 1 ; j <= settings.M_DOT ; j++ ) {
						dotString += ' ';
					}*/

					/* 页面测试 打印缩进 */
					//$('.engine-code' ).append( dotString );

					/* 页面测试 打印属性集nodeName, nodeValue为原生JS, 分别表示为属性的名称, 和属性值 */
					/*$( myObj ).each( function ( i ) {        
						$( '.engine-code' ).append( ( $( this )[ 0 ].nodeName ) + '=' + ( $( this )[ 0 ].nodeValue ) + '</br>' ); 
					})*/

					/* 页面测试 打印节点的文本 */
					//$( '.engine-code' ).append( nodeobj );


			/* 在页面中输出对象看是否正确 END */

			$( myObj ).each( function ( i ) {
				var _str = $( this )[ 0 ].ownerElement.textContent;
				if ( _str != null && _str != undefined ) {
					objarr.push( _str );
				}
			});

			/* 判断DOM有无子DOM */
			if ( nodeobj.length > 0 ) {
				/* 如果有, 遍历 */
				nodeobj.children().each( function ( i ) {
					settings.M_DOT++; //缩进量加一
					exps.nodefn( $( this ) );//递归遍历子DOM
					settings.M_DOT--;
				})

			}else{
				return false;
			}
			
		},
		jsondata : function () {
			/* 将对象转为json */
		}
	}
	return exps;
}
/* table 封装 END */



/* 进度条 */
var _timer
$.fn[ 'processbar' ] = function () {

	var exps = {
		setValue : function ( persent ) {
			var process_width = $( '.processcontainer' ).width();
			var processbar_width = process_width * persent;
			clearTimeout( _timer );
			$( '.processcontainer .processbar' ).animate( { 'width' : processbar_width } , 300 );
			_timer = setTimeout( function () {
				$( '.processcontainer-title' ).html( persent * 100 + '%' );
			} , 1000 );
		},
		hideprocess : function () {
			$( '.car_config_loading' ).fadeOut( 500 );
		},
		showprocess : function () {
			$( '.car_config_loading' ).fadeIn( 500 );
		}
	}
	return exps;
}



//$( 'body' ).processbar().setValue( 0.7 );

//$( 'body' ).processbar().hideprocess();