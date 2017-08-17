( function () {
    'use strict';

	var DoorAnimas = null;
    var P = window.P;
    var OSG = window.OSG;
    var osg = OSG.osg;
    var osgViewer = OSG.osgViewer;
    var osgDB = OSG.osgDB;
    var osgGA = OSG.osgGA;
    var osgUtil = OSG.osgUtil;
    var osgShader = OSG.osgShader;
    var $ = window.$;
    var JSZip = window.JSZip;
    var Object = window.Object;

    var Environment = window.Environment;

    var PredefinedMaterials = {
        Silver: [ 0.971519, 0.959915, 0.915324 ],
        Aluminium: [ 0.913183, 0.921494, 0.924524 ],
        Gold: [ 1, 0.765557, 0.336057 ],
        Copper: [ 0.955008, 0.637427, 0.538163 ],
        Chromium: [ 0.549585, 0.556114, 0.554256 ],
        Nickel: [ 0.659777, 0.608679, 0.525649 ],
        Titanium: [ 0.541931, 0.496791, 0.449419 ],
        Cobalt: [ 0.662124, 0.654864, 0.633732 ],
        Platinum: [ 0.672411, 0.637331, 0.585456 ]
    };

    var CameraPresets = {
        CarBound: {
            fov: 60,
            eye: [ 284, -444,-379]
        },
      	FrontLightBound: {
          fov: 60,
          eye: [ 344,121,-476]
      	},
      	BackLightBound: {
          fov: 60,
          eye: [ -297,145,-498]
      	}
//      CameraCenter: {
//          target: [ 80.0, 0.0, 20.0 ],
//          eye: [ 80.0, -215.0, 20.0 ]
//      },
//      CameraPBR: {
//          target: [ 160.0, 0.0, 80.0 ],
//          eye: [ 160.0, -100.0, 80.0 ]
//      },
//      CameraSamples: {
//          target: [ 46.0, 20.0, 80.0 ],
//          eye: [ 46.0, -62.5, 80.0 ]
//      }


    };
    
    var FindByNameVisitor = function(name) {

        osg.NodeVisitor.call(this, osg.NodeVisitor.TRAVERSE_ALL_CHILDREN);

        this._name = name;

    };



    FindByNameVisitor.prototype = osg.objectInherit(osg.NodeVisitor.prototype, {

        // in found we'll store our resulting matching node

        init: function() {

            this.found = undefined;

        },

        // the crux of it

        apply: function(node) {

            if (node.getName() === this._name) {

                this.found = node;

                return;

            }

            this.traverse(node);

        }

    });
    
    var DoorAnimaUpdateCallback = function() {};


	DoorAnimaUpdateCallback.prototype = {
	
	    // rotation angle
	
	    angle: 0,
	    
	    direct : -1,
	    
	    startMat : null,
	    
	    startAngle : 0 ,
	    
	    endAngle : 0,
	    
	    time :0,
	    
	    curTime : 0,
	    
	    tmpMat : null ,
	    
	    rotMat : null,
	    
	    
	    starting : false,
	    
	    lastTime : 0 ,
	    
	    
	    setConfig : function(mat,sAngle,eAngle,t)
	    {
	    	this.startMat = mat;
	    	this.startAngle = sAngle*3.1415926/180;
	    	this.endAngle = eAngle*3.1415926/180;
	    	this.time = t;
	    	
	    	this.tmpMat = osg.mat4.create();
	    	
	    	this.rotMat = osg.mat4.create();
	    	
	    },
	    
	    start : function(dir)
	    {
	    	this.direct = dir;
	    	
	    	//this.curTime =0 ;
	    	
	    	this.starting = true;
	    	
	    	this.lastTime = null;
	    	
	    },
	    
	    update: function(node, nv) {
	
			if(!this.starting) return;
			
	        
	        if(this.lastTime == null)
	        {
	        	this.lastTime = nv.getFrameStamp().getSimulationTime();
	        }
	        
	        var t = nv.getFrameStamp().getSimulationTime()-this.lastTime;
	        
	        this.lastTime =  nv.getFrameStamp().getSimulationTime();
	         
	        this.curTime+= this.direct*t;	
	        
	        this.rotMat = osg.mat4.create();
	        
			if(this.curTime>this.time)
			{
				this.starting = false;
				
				this.curTime = this.time;
			}else if(this.curTime<0)
			{
				this.starting = false;
				this.curTime = 0;
			}
	        
	        
	        var alpha = this.curTime/this.time;
	        
	        
	        var pos = osg.vec3.create();
	        
	        pos[0] = this.startMat[12];
	        pos[1] = this.startMat[13];
	        pos[2] = this.startMat[14];
	        
	        osg.mat4.copy(this.tmpMat,this.startMat);
	        this.tmpMat[12] = 0;
	  		this.tmpMat[13] = 0;
	  		this.tmpMat[14] = 0;
	        
	        
	        var curAngle = alpha*this.endAngle+(1-alpha)*this.startAngle;
	        
	        osg.mat4.fromRotation(this.rotMat, curAngle, osg.vec3.fromValues(0.0, 0.0, 1.0));
	        
 
	        osg.mat4.mul( this.tmpMat, this.tmpMat, this.rotMat);

	        this.tmpMat[12] += pos[0];
	  		this.tmpMat[13] += pos[1];
	  		this.tmpMat[14] += pos[2];
	  		
	  		node.setMatrix(this.tmpMat);
	  		
	  		console.log("update");
	        
	        return true;
	
	    }
	
	};
    var MaterialApply = function () {
	    osg.NodeVisitor.call( this );
	    //this._Transparent = undefined;
	    //this._ControlMatrial = undefined;
	    //this._Default = undefined;
	    this.statesets = [];
	};
	MaterialApply.prototype = osg.objectInherit( osg.NodeVisitor.prototype, {
	
	    apply: function ( node ) {
	    	
	    	var stateSet = node.getStateSet();
	    	
	    	if(stateSet!=null&&stateSet!=undefined)
	    	{
	    		var name = stateSet.getName();
	    		if(name !=null&&name!=undefined)
	    		{
	    			if(this.statesets[name]==null&&this.statesets[name]==undefined)
	    			{
	    				this.statesets[name] = stateSet;
	    			}
	    		}
	    	}
	        this.traverse(node);
	    }
	 });

	var MyManipulator = function()
	{
		osgGA.OrbitManipulator.call(this)
	};
	
	MyManipulator.prototype = osg.objectInherit( osgGA.OrbitManipulator.prototype, {
	    update: ( function () {
	        var eye = osg.vec3.create();
	        return function ( nv ) {
	            var dt = nv.getFrameStamp().getDeltaTime();
				
				this.getEyePosition(eye)
	
	  			if(this.owner.cameraTarget!=null)
	            {
	            	osg.vec3.lerp(eye,eye,this.owner.cameraTarget.eye,4*dt);
	            	
	            	if(osg.vec3.squaredDistance(eye,this.owner.cameraTarget.eye)<0.5)
	            	{
	            		this.owner.cameraTarget = null;
	            	}
	            }
	            console.log("dist : " +eye[0]+ "," + eye[1]+","+eye[2]);
				this.setEyePosition(eye)
	            var delta;
	            var mouseFactor = 0.1;
	            delta = this._rotate.update( dt );
	            
	            var pitch = -delta[ 1 ] * mouseFactor * this._scaleMouseMotion;
	            
	            if(this.getEyePosition(eye)[2] <=this.getTarget(osg.vec3.create())[2]&&pitch<0)
	            {
	            	pitch = 0;
	            }
	            this.computeRotation( -delta[ 0 ] * mouseFactor * this._scaleMouseMotion, pitch);
	
	            var panFactor = 0.002;
	            delta = this._pan.update( dt );
	            this.computePan( -delta[ 0 ] * panFactor, -delta[ 1 ] * panFactor );
	
	
	            delta = this._zoom.update( dt );
	            this.computeZoom( 1.0 + delta[ 0 ] / 10.0 );
	
				if(this._distance>1000)
				{
					this._distance = 1000;
				}else if(this._distance<300)
				{
					this._distance =300;
				}
				this._target = osg.vec3.fromValues(0,0,-500);
	            var target = this._target;
	            var distance = this._distance;
				
	            /* 1. Works but bypass other manipulators */
	            // mat4.copy( this._inverseMatrix , this._vrMatrix );
	
	            /* 2. Works but gets broken by other manipulators */
	            osg.mat4.invert( this._inverseMatrix, this._rotation );
	            osg.mat4.mul( this._inverseMatrix, this._vrMatrix, this._inverseMatrix );
	
	            /* 3. Doesnt' work */
	            // mat4.mul( this._vrMatrix,  this._vrMatrix, this._rotation );
	            // mat4.invert( this._inverseMatrix, this._vrMatrix );
	
	            osg.vec3.set( eye, 0.0, distance, 0.0 );
	            osg.vec3.transformMat4( eye, eye, this._inverseMatrix );
	            
	          
	            
	            if(eye[2]<0)
	            {
	               eye[2] =0;
	            }
	            //console.log("dist : " +eye[0]+ "," + eye[1]+","+eye[2]);
	
	            osg.mat4.lookAt( this._inverseMatrix, osg.vec3.add( eye, target, eye ), target, this._upz );
	            
	
	        };
	    } )(),
	 });
    var isMobileDevice = function () {

		//return false;
        if ( navigator.userAgent.match( /Mobile/i ) )
            return true;
        if ( navigator.userAgent.match( /Android/i ) )
            return true;
        if ( navigator.userAgent.match( /iPhone/i ) )
            return true;
        if ( navigator.userAgent.match( /iPad/i ) )
            return true;
        if ( navigator.userAgent.match( /iPod/i ) )
            return true;
        if ( navigator.userAgent.match( /BlackBerry/i ) )
            return true;
        if ( navigator.userAgent.match( /Windows Phone/i ) )
            return true;

        return false;

    };

    var optionsURL = {};
    ( function ( options ) {
        var vars = [],
            hash;
        var indexOptions = window.location.href.indexOf( '?' );
        if ( indexOptions < 0 ) return;

        var hashes = window.location.href.slice( indexOptions + 1 ).split( '&' );
        for ( var i = 0; i < hashes.length; i++ ) {
            hash = hashes[ i ].split( '=' );
            var element = hash[ 0 ];
            vars.push( element );
            var result = hash[ 1 ];
            if ( result === undefined ) {
                result = '1';
            }
            options[ element ] = result;
        }
    } )( optionsURL );


    var linear2Srgb = function ( value, gammaIn ) {
        var gamma = gammaIn;
        if ( !gamma ) gamma = 2.2;
        var result = 0.0;
        if ( value < 0.0031308 ) {
            if ( value > 0.0 )
                result = value * 12.92;
        } else {
            result = 1.055 * Math.pow( value, 1.0 / gamma ) - 0.055;
        }
        return result;
    };

    var PBRWorklowVisitor = function () {

        this._workflow = [];
        osg.NodeVisitor.call( this );

    };

    PBRWorklowVisitor.prototype = osg.objectInherit( osg.NodeVisitor.prototype, {
        apply: function ( node ) {
            var data = node.getUserData();
            if ( data && data.pbrWorklow ) {
                var stateSetWorkflow = {
                    stateSet: node.getOrCreateStateSet(),
                    workflow: data.pbrWorklow
                };
                this._workflow.push( stateSetWorkflow );
            }
            this.traverse( node );
        },
        getWorkflows: function () {
            return this._workflow;
        }
    } );

    var shaderProcessor = new osgShader.ShaderProcessor();

    window.ALBEDO_TEXTURE_UNIT = 3;
    window.DIFFUSE_TEXTURE_UNIT = 0;
    window.METALLIC_ROUGHNESS_TEXTURE_UNIT = 1;
    window.SPECULAR_TEXTURE_UNIT = 4;
    window.NORMAL_TEXTURE_UNIT = 2;

    window.GLTF_PBR_SPEC_MODE = 'PBR_specular_glossiness';

    var modelList = [ 'sphere', 'model' ];

    var defaultEnvironment = 'textures/parking.zip';
    var envURL = defaultEnvironment;
    if ( optionsURL.env ) {
        if ( optionsURL.env.indexOf( 'http' ) !== -1 )
            envURL = optionsURL.env;
        else
            envURL = 'textures/' + optionsURL.env;
    }
    var environment = envURL;
    var environmentList = [];
    var environmentMap = {};
    
    var cameraTarget = {};


    var Example = function () {

        this._gui = new window.dat.GUI();

        this._shaderPath = 'shaders/';

        this._config = {
            光朝向: Math.PI,
            lod: 0.01,
            漆面色: '#ffffff',
            environmentType: 'cubemapSeamless',
            brightness: 1.2,
            normalAA: Boolean( optionsURL.normalAA === undefined ? true : optionsURL.normalAA ),
            specularPeak: Boolean( optionsURL.specularPeak === undefined ? true : optionsURL.specularPeak ),
            occlusionHorizon: Boolean( optionsURL.occlusionHorizon === undefined ? true : optionsURL.occlusionHorizon ),
            cameraPreset: optionsURL.camera ? Object.keys( CameraPresets )[ optionsURL.camera ] : 'CameraCenter',

            平滑度: 0.05,
            material: 'Gold',

            format: '',
            model: modelList[ 0 ],
            环境: '',
            mobile: isMobileDevice(),
            nb: 8,
            offset: 1000,
            金属感:0.12,
            cameraFov : 60
        };

        this.updateAlbedo();

        this._uniformHammersleySequence = {};
        this._integrateBRDFTextureUnit = 14;
        this._materialDefines = [];
        this._shaderDefines = [];
        this._modelDefines = [];

        this._modelsLoaded = {};

        this._environmentTransformUniform = osg.Uniform.createMatrix4( osg.mat4.create(), 'uEnvironmentTransform' );

        this._cubemapUE4 = {};

        this._shaders = [];

        this._currentEnvironment = undefined;

        // node that will contains models
        this._proxyRealModel = new osg.Node();
        this._proxyRealModel.setName( 'ProxyRealModel' );

        // rotation of the environment geometry
        this._environmentTransformMatrix = undefined;

        this._envBrightnessUniform = osg.Uniform.createFloat1( 1.0, 'uBrightness' );

        this._normalAA = osg.Uniform.createInt1( 0, 'uNormalAA' );
        this._specularPeak = osg.Uniform.createInt1( this._config.specularPeak ? 1 : 0, 'uSpecularPeak' );

        this._occlusionHorizon = osg.Uniform.createInt1( 0, 'uOcclusionHorizon' );

        // background stateSet
        this._backgroundStateSet = new osg.StateSet();
        // Keep a reference to update it from the GUI
        this._rowMetalic = undefined;

        window.printCurrentCamera = function () {
            var eye = osg.vec3.create();
            var target = osg.vec3.create();
            console.log( 'target ' + this._viewer.getManipulator().getTarget( target ).toString() );
            console.log( 'eye ' + this._viewer.getManipulator().getEyePosition( eye ).toString() );
        }.bind( this );


    };

    Example.prototype = {


        createEnvironment: function ( urlOrZip, zipFileName ) {

            var env = new Environment();

            var registerEnvironment = function ( envReady ) {

                var name = envReady.name;
                environmentMap[ name ] = envReady;
                environmentList.push( name );

                var controllers = this._gui.__controllers;
                var controller = controllers.filter( function ( cont ) {
                    return cont.property === '环境';
                } )[ 0 ];

                this._config.环境 = name;
                //controller = controller.options( environmentList );
                //controller.onChange( this.setEnvironment.bind( this ) );

            }.bind( this );

            if ( typeof urlOrZip === 'string' ) {
                var url = urlOrZip;
                return env.loadPackage( url ).then( function () {
                    registerEnvironment( env );
                    return env;
                } );
            }

            var zip = urlOrZip;
            return env.readZipContent( zip, zipFileName ).then( function () {
                registerEnvironment( env );
                return env;
            } );


        },

        updateConfigFromEnvironment: function ( formatList ) {


            if ( formatList.indexOf( this._config.format ) === -1 ) this._config.format = formatList[ 0 ];

            var controllers = this._gui.__controllers;
            var controller = controllers.filter( function ( cont ) {
                return cont.property === 'format';
            } )[ 0 ];
           // controller = controller.options( formatList );
            //controller.onChange( this.updateEnvironment.bind( this ) );

        },

        setEnvironment: function ( name ) {

            if ( environmentMap[ name ] ) {
                this._currentEnvironment = environmentMap[ name ];
                this.updateConfigFromEnvironment( this._currentEnvironment.getFormatList() );
                this.updateEnvironment();
            }

        },

        loadZipFile: function ( fileOrBlob, zipFileName ) {

            return JSZip.loadAsync( fileOrBlob ).then( function ( zip ) {

                var gltfFormat;
                var environmentFormat;
                Object.keys( zip.files ).forEach( function ( path ) {
                    var filename = path.split( '/' ).pop();
                    var ext = filename.split( '.' ).pop();
                    if ( ext === 'gltf' ) gltfFormat = true;
                    if ( filename === 'config.json' ) environmentFormat = true;
                } );

                if ( gltfFormat ) {
                    var self = this;
                    var filesMap = new window.Map();
                    filesMap.set( zipFileName, fileOrBlob );
                    osgDB.readNodeURL( zipFileName, {
                        filesMap: filesMap
                    } ).then( function ( node ) {
                        return self.loadNode( node );
                    } );

                } else if ( environmentFormat ) {

                    var name = zipFileName;
                    return this.createEnvironment( zip, name ).then( function ( env ) {
                        return this.setEnvironment( env.name );
                    }.bind( this ) );

                }

                return false;

            }.bind( this ) );

        },

        handleDroppedFiles: function ( files ) {
            var self = this;
            $( '#loading' ).show();


            if ( files.length === 1 && files[ 0 ].name.split( '.' ).pop().toLowerCase() === 'zip' ) {
                return this.loadZipFile( files[ 0 ], files[ 0 ].name ).then( function () {
                    $( '#loading' ).hide();
                } );
            }

            return osgDB.FileHelper.readFileList( files ).then( function ( root ) {
                self.loadNode( root );
            } ).catch( function ( fails ) {

                $( '#loading' ).hide();
                osg.error( 'cant\'t read file ' + fails );

            } );
        },

        loadNode: function ( node ) {
            $( '#loading' ).hide();
            if ( !node ) return;
            var gltfFileName = node.getName();
            //osg.mat4.scale( root.getMatrix(), root.getMatrix(), [ 20, 20, 20 ] );

            this._modelsLoaded[ gltfFileName ] = node;

            this._config.model = gltfFileName;
            this.updateModel();
            console.timeEnd( 'time' );
            // Updates the dropdown list
            modelList.push( gltfFileName );

            var controllers = this._gui.__controllers;
            var controller = controllers.filter( function ( cont ) {
                return cont.property === 'model';
            } )[ 0 ];
            controller = controller.options( modelList );
            controller.onChange( this.updateModel.bind( this ) );
        },


        handleDroppedURL: function ( url ) {
            $( '#loading' ).show();
            return osgDB.requestFile( url, {
                responseType: 'blob'
            } ).then( function ( blob ) {
                return this.loadZipFile( blob, url ).then( function () {
                    $( '#loading' ).hide();
                } );
            }.bind( this ) );

        },

        loadFiles: function () {

            var self = this;

            var input = $( document.createElement( 'input' ) );
            input.attr( 'type', 'file' );
            input.attr( 'multiple', '' );
            input.trigger( 'click' );
            input.on( 'change', function () {

                self.handleDroppedFiles( this.files );

            } );


            return false;
        },

        setMaterial: function ( stateSet, albedo, metalRoughness, specular ) {

			if(albedo)
            	stateSet.setTextureAttributeAndModes( window.ALBEDO_TEXTURE_UNIT, albedo );
            stateSet.setTextureAttributeAndModes( window.METALLIC_ROUGHNESS_TEXTURE_UNIT, metalRoughness );
            
            if ( specular )
                stateSet.setTextureAttributeAndModes( window.SPECULAR_TEXTURE_UNIT, specular );
            if ( this._stateSetPBR )
                this.updateShaderPBR();
        },

        getTexture0000: function () {
            if ( !this._texture0000 )
                this._texture0000 = this.createTextureFromColor( osg.vec4.fromValues( 0, 0, 0, 1 ) );
            return this._texture0000;
        },

        getTexture1111: function () {
            if ( !this._texture1111 )
                this._texture1111 = this.createTextureFromColor( osg.vec4.ONE );
            return this._texture1111;
        },

        createTextureFromColor: function ( colorArg, srgb, textureOutput ) {
            var colorInput = colorArg;
            var albedo = new osg.Uint8Array( 4 );

            if ( typeof colorInput === 'number' ) {
                colorInput = [ colorInput ];
            }
            var color = colorInput.slice( 0 );

            if ( color.length === 3 )
                color.push( 1.0 );

            if ( color.length === 1 ) {
                color.push( color[ 0 ] );
                color.push( color[ 0 ] );
                color.push( 1.0 );
            }

            color.forEach( function ( value, index ) {
                if ( srgb )
                    albedo[ index ] = Math.floor( 255 * linear2Srgb( value ) );
                else
                    albedo[ index ] = Math.floor( 255 * value );
            } );

            var texture = textureOutput;
            if ( !texture )
                texture = new osg.Texture();
            texture.setTextureSize( 1, 1 );
            texture.setImage( albedo );
            return texture;
        },

        createMetalRoughnessTextureFromColors: function ( metalColor, roughnessColor, srgb, textureOutput ) {
            var colorInput = metalColor;
            var albedo = new osg.Uint8Array( 4 );

            if ( typeof colorInput === 'number' ) {
                colorInput = [ colorInput ];
            }
            var color = colorInput.slice( 0 );

            if ( color.length === 3 )
                color[ 1 ] = roughnessColor;

            if ( color.length === 1 ) {
                color.push( roughnessColor );
                // 2nd and 3rd safely could be ignored
                color.push( 0.0 );
                color.push( 0.0 );
            }

            color.forEach( function ( value, index ) {
                if ( srgb )
                    albedo[ index ] = Math.floor( 255 * linear2Srgb( value ) );
                else
                    albedo[ index ] = Math.floor( 255 * value );
            } );

            var texture = textureOutput;
            if ( !texture )
                texture = new osg.Texture();
            texture.setTextureSize( 1, 1 );
            texture.setImage( albedo );
            return texture;
        },

        readShaders: function () {

            var defer = P.defer();

            var shaderNames = [
                'math.glsl',
                'cubemapVertex.glsl',
                'cubemapFragment.glsl',
                'cubemapSampler.glsl',
                'panoramaVertex.glsl',
                'panoramaFragment.glsl',
                'panoramaSampler.glsl',

                'pbrReferenceFragment.glsl',
                'pbrReferenceVertex.glsl',
                'colorSpace.glsl',

                'pbr_ue4.glsl',

                'sphericalHarmonics.glsl',
                'sphericalHarmonicsVertex.glsl',
                'sphericalHarmonicsFragment.glsl',
                
                'vertex.glsl',
                'fragment.glsl',
                'envVertex.glsl' ,
                'envFragment.glsl',
                'postvertex.glsl'

            ];


            var shaders = shaderNames.map( function ( arg ) {
                return this._shaderPath + arg;
            }.bind( this ) );


            var promises = [];
            shaders.forEach( function ( shader ) {
                promises.push( P.resolve( $.get( shader ) ) );
            } );


            P.all( promises ).then( function ( args ) {

                var shaderNameContent = {};
                shaderNames.forEach( function ( name, idx ) {
                    shaderNameContent[ name ] = args[ idx ];
                } );

                shaderProcessor.addShaders( shaderNameContent );

                defer.resolve();

            } );

            return defer.promise;
        },

        // config = {
        //     normalMap: false,
        //     glossinessMap: false,
        //     specularMap: false
        //     aoMap: false
        // }
        createShaderPBR: function ( config ) {

            var defines = [];

            this._materialDefines.forEach( function ( d ) {
                defines.push( d );
            } );

            this._modelDefines.forEach( function ( d ) {
                defines.push( d );
            } );

            if ( config && config.noTangent === true )
                defines.push( '#define NO_TANGENT' );

            if ( config && config.normalMap === true )
                defines.push( '#define NORMAL' );

            if ( config && config.specularGlossinessMap === true )
                defines.push( '#define SPECULAR_GLOSSINESS' );

            if ( config && config.specularMap === true )
                defines.push( '#define SPECULAR' );

            if ( config && config.aoMap === true )
                defines.push( '#define AO' );


            if ( config && config.environmentType === 'cubemapSeamless' ) {
                defines.push( '#define CUBEMAP_LOD ' );
            } else {
                defines.push( '#define PANORAMA ' );
            }

            defines.push( '#define ' + config.format );

            if ( config && config.mobile ) {
                defines.push( '#define MOBILE' );
            }
            
            if(config&&config.enableTransparent === true){
            	defines.push( '#define TRANSPARENT' );
            }
            if(config&&config.enableAlbedo === true){
            	defines.push( '#define ALBEDO' );
            }


            if ( !this._shaderCache )
                this._shaderCache = {};

            var hash = defines.join();
            if ( !this._shaderCache[ hash ] ) {

                var vertexshader = shaderProcessor.getShader( 'pbrReferenceVertex.glsl' );
                var fragmentshader = shaderProcessor.getShader( 'pbrReferenceFragment.glsl', defines );

                var program = new osg.Program(
                    new osg.Shader( 'VERTEX_SHADER', vertexshader ),
                    new osg.Shader( 'FRAGMENT_SHADER', fragmentshader ) );

                this._shaderCache[ hash ] = program;

            }

            return this._shaderCache[ hash ];
        },


        updateEnvironmentBrightness: function () {
            var b = this._config.brightness;
            this._envBrightnessUniform.setFloat( b );
        },

        updateNormalAA: function () {
            var aa = this._config.normalAA ? 1 : 0;
            this._normalAA.setInt( aa );
        },

        updateSpecularPeak: function () {
            var aa = this._config.specularPeak ? 1 : 0;
            this._specularPeak.setInt( aa );
        },

        updateOcclusionHorizon: function () {
            var aa = this._config.occlusionHorizon ? 1 : 0;
            this._occlusionHorizon.setInt( aa );
        },

        updateCameraPreset: function () {
        	
            var preset = CameraPresets[ this._config.cameraPreset ];
            if ( !preset ) {
                preset = CameraPresets[ Object.keys( CameraPresets )[ 0 ] ];
                osg.warn( 'Camera preset not found, use default' );
            }
            this.cameraTarget = preset;
            //this._viewer.getManipulator().setTarget( preset.target );
            //this._viewer.getManipulator().setEyePosition( preset.eye );
        },

        updateEnvironmentRotation: function () {
            if ( !this._environmentTransformMatrix )
                return;
            var rotation = this._config.光朝向;
            osg.mat4.fromRotation( this._environmentTransformMatrix, rotation, [ 0, 0, 1 ] );
        },
        createEnvironmentNode: function () {
			


            var scene = new osg.Node();

            // create the environment sphere
            var size = 500;
            //var geom = osg.createTexturedBoxGeometry( 0, 0, 0, size, size, size );

            // to use the same shader panorama
            var geom = osg.createTexturedSphereGeometry( size / 2, 20, 20 );
            var ss = geom.getOrCreateStateSet();
            geom.getOrCreateStateSet().setAttributeAndModes( new osg.CullFace( 'DISABLE' ) );
            geom.getOrCreateStateSet().setAttributeAndModes( new osg.Depth( 'DISABLE' ) );
            geom.setBound( new osg.BoundingBox() );

            ss.setRenderBinDetails( -1, 'RenderBin' );

            var environmentTransform = this._environmentTransformUniform;

            var mt = new osg.MatrixTransform();
            mt.addChild( geom );

            var CullCallback = function () {
                this.cull = function ( node, nv ) {
                    // overwrite matrix, remove translate so environment is always at camera origin
                    osg.mat4.setTranslation( nv.getCurrentModelViewMatrix(), [ 0, 0, 0 ] );
                    var m = nv.getCurrentModelViewMatrix();

                    // add a rotation, because environment has the convention y up
                    var rotateYtoZ = osg.mat4.fromRotation( osg.mat4.create(), Math.PI / 2, [ 1, 0, 0 ] );

                    osg.mat4.mul( environmentTransform.getInternalArray(), m, rotateYtoZ );
                    //osg.mat4.copy( environmentTransform.get() , m );
                    return true;
                };
            };
            mt.setCullCallback( new CullCallback() );
            this._environmentTransformMatrix = mt.getMatrix();

            var cam = new osg.Camera();
            cam.setClearMask( 0x0 );
            cam.setReferenceFrame( osg.Transform.ABSOLUTE_RF );
            cam.addChild( mt );
            cam.setCullCallback( new CullCallback() );


            var self = this;
            // the update callback get exactly the same view of the camera
            // but configure the projection matrix to always be in a short znear/zfar range to not vary depend on the scene size
            var info = {};
            var proj = [];
            var updateConfig = this._config;
            var UpdateCallback = function () {
                this.update = function () {
                    var rootCam = self._viewer.getCamera();

					//console.log("fov " + updateConfig.cameraFov)
                    osg.mat4.getPerspective( info, rootCam.getProjectionMatrix() );
                    osg.mat4.perspective( proj, Math.PI / 180 * updateConfig.cameraFov, info.aspectRatio, 1.0, 1000.0 );

                    cam.setProjectionMatrix( proj );
                    cam.setViewMatrix( rootCam.getViewMatrix() );

                    return true;
                };
            };
            cam.addUpdateCallback( new UpdateCallback() );

            scene.addChild( cam );
           // scene.addChild(this.getOrCreateModel());
            return scene;
        },

        createModelMaterialSample: function () {

            this._proxyModel = new osg.Node();

            var request = osgDB.readNodeURL( 'models/material-test/kl4.osgjs' ,{
            	progress: function(event)
            	{
            		$( 'body' ).processbar().setValue( event.loaded / 38670085 );
            		//if (event.lengthComputable) {
            			//console.log("val : "+ event.position / event.totalSize);
            		//}
            	}
            });
           

            request.then( function ( model ) {

				$( 'body' ).processbar().hideprocess();
                var mt = new osg.MatrixTransform();
                osg.mat4.fromRotation( mt.getMatrix(), -Math.PI / 2, [ 1, 0, 0 ] );
                var bb = model.getBound();
                osg.mat4.mul( mt.getMatrix(), osg.mat4.fromTranslation( osg.mat4.create(), [ 0, -bb.radius() / 2, 0 ] ), mt.getMatrix() );
                mt.addChild( model );

                this._modelMaterial = mt;

                this._proxyModel.addChild( this._modelMaterial );
                this._modelMaterial.setNodeMask( 0 );

                var tangentVisitor = new osgUtil.TangentSpaceGenerator();
                model.accept( tangentVisitor );
                
                var materialApply = new MaterialApply();
                model.accept( materialApply );
                
                this._proxyModel.statesets=materialApply.statesets;
                
                this.setMaterial(model.getOrCreateStateSet(), false,this.createMetalRoughnessTextureFromColors(0.5, 0.5, false ));
                model.getOrCreateStateSet().setTextureAttributeAndModes( window.NORMAL_TEXTURE_UNIT, this.createTextureFromColor( osg.vec4.fromValues( 0, 0, 1, 1 )));
                
                
                DoorAnimas = new Object();
                
                DoorAnimas.frDoorAnima = new DoorAnimaUpdateCallback();
                DoorAnimas.brDoorAnima = new DoorAnimaUpdateCallback();
                DoorAnimas.flDoorAnima = new DoorAnimaUpdateCallback();
                DoorAnimas.blDoorAnima = new DoorAnimaUpdateCallback();
                
                var finder = new FindByNameVisitor('chemen_fr');
                model.accept(finder);
                
                DoorAnimas.frDoorAnima.node = finder.found;
    			
    			finder.found.addUpdateCallback(DoorAnimas.frDoorAnima);
    			
    			DoorAnimas.frDoorAnima.setConfig(finder.found.getMatrix(),0,70,0.5);
    			
    			
    			
    			finder = new FindByNameVisitor('chemen_br');
                model.accept(finder);
                
                DoorAnimas.brDoorAnima.node = finder.found;
    			
    			finder.found.addUpdateCallback(DoorAnimas.brDoorAnima);
    			
    			DoorAnimas.brDoorAnima.setConfig(finder.found.getMatrix(),0,70,0.5);
    			
    			
    			finder = new FindByNameVisitor('chemen_fl');
                model.accept(finder);
                
                DoorAnimas.flDoorAnima.node = finder.found;
    			
    			finder.found.addUpdateCallback(DoorAnimas.flDoorAnima);
    			
    			DoorAnimas.flDoorAnima.setConfig(finder.found.getMatrix(),0,-70,0.5);
    			
    			
    			finder = new FindByNameVisitor('chemen_bl');
                model.accept(finder);
                
                DoorAnimas.blDoorAnima.node = finder.found;
    			
    			finder.found.addUpdateCallback(DoorAnimas.blDoorAnima);
    			
    			DoorAnimas.blDoorAnima.setConfig(finder.found.getMatrix(),0,-70,0.5);
    			
    			//frAnima.start(1);
    			
    			
                
            }.bind( this ) );
            
            return request;

        },

        updateModel: function () {

            this._modelMaterial.setNodeMask( 0x0 );
            this._proxyRealModel.setNodeMask( 0x0 );

            var node= this._modelMaterial;

            if ( node ) {
                node.setNodeMask( ~0x0 );
                node.dirtyBound();
                this._viewer.getManipulator().computeHomePosition();
            }
        },


        getModelTestInstance: function () {
            var mt = new osg.MatrixTransform();

            mt.addChild( this._proxyModel );

            return mt;
        },

        updateRowModelsSpecularMetal: function () {
            var specularTexture = this._specularMetalTexture = this.createTextureFromColor( PredefinedMaterials[ this._config.material ], true, this._specularMetalTexture );
            return specularTexture;
        },


        updateRowModelsMetalic: function () {
            this._rowMetalic.removeChildren();
            this._rowMetalic.addChild( this.createRowModelsMetalic() );
        },

        createRowModelsMetalic: function () {

            var albedo = this._albedoTexture; 
            var roughness = this._config.平滑度;

            var group = new osg.MatrixTransform();

            
            var metal = this._config.金属感;
			var sample = this.getModelTestInstance();
			
            osg.mat4.fromTranslation( sample.getMatrix(), [ 0, 0, 0 ] );

            var metallicRoughnessTexture = this.createMetalRoughnessTextureFromColors( metal, roughness, false );

            //this.setMaterial( sample.getOrCreateStateSet(), albedo, metallicRoughnessTexture );
            
            //this.setMaterial( this._proxyModel.controlMaterialNode.getOrCreateStateSet(), albedo, metallicRoughnessTexture );
            for(var index in this._proxyModel.controlStateSets)
            {
            	this.setMaterial(this._proxyModel.controlStateSets[index], albedo, metallicRoughnessTexture );
            }
            group.addChild( sample );
            
            return group;
        },

        createSampleModels: function () {

            var group = new osg.Node();

            var stateSet;
            var config;

//          var rowRoughness = this.createRowModelsRoughness();
//          stateSet = rowRoughness.getOrCreateStateSet();
//          config = {
//              stateSet: stateSet,
//              config: {
//                  noTangent: true
//              }
//          };
//          this._shaders.push( config );
//          group.addChild( rowRoughness );
//          osg.mat4.fromTranslation( rowRoughness.getMatrix(), [ 0, 0, 0 ] );
            // Keep a reference to update it from the GUI
  
            var vertexshader = shaderProcessor.getShader( 'vertex.glsl' );
            var fragmentshader = shaderProcessor.getShader( 'fragment.glsl' );

            var program = new osg.Program(
                new osg.Shader( 'VERTEX_SHADER', vertexshader ),
                new osg.Shader( 'FRAGMENT_SHADER', fragmentshader ) );
                
                
            var env_vertexshader = shaderProcessor.getShader( 'envVertex.glsl' );
            var env_fragmentshader = shaderProcessor.getShader( 'envFragment.glsl' );

            var env_program = new osg.Program(
                new osg.Shader( 'VERTEX_SHADER', env_vertexshader ),
                new osg.Shader( 'FRAGMENT_SHADER', env_fragmentshader ) );
            
            
            this._proxyModel.controlStateSets = []
            
            for(var key in this._proxyModel.statesets)
            {
            	
            	var stateset = this._proxyModel.statesets[key];
            	
            	var name = stateset.getName();
            	console.log("name : " + name);
            	if(name.indexOf("transparent_") == 0)
            	{
            		config = {
                		stateSet: stateset,
                		config: {
                    		noTangent: true,
                    		enableTransparent : true
               		 	}
            		};
            		this._shaders.push( config );
            		stateset.setRenderingHint('TRANSPARENT_BIN');
            		stateset.setAttributeAndModes(new osg.BlendFunc('ONE', 'ONE_MINUS_SRC_ALPHA'));
            		
            		//this.setMaterial(stateset, false,this.createMetalRoughnessTextureFromColors(1.0, 0.0, false ));
            	}else if(name.indexOf("control_") == 0)
            	{
            		config = {
                		stateSet: stateset,
                		config: {
                    		noTangent: true,
                    		enableAlbedo: true,
                    		normalMap:true
               		 	}
            		};
            		
            		this._shaders.push( config );
            		//stateset.setTextureAttributeAndModes( window.NORMAL_TEXTURE_UNIT, ));//T_MetalFlakes_N.png
            		//this.setMaterial(stateset, false,this.createMetalRoughnessTextureFromColors(0.5, 0.5, false ));
            		
            		this._proxyModel.controlStateSets.push(stateset)
            	}else if(name.indexOf("normal_") == 0)
            	{
            		config = {
                		stateSet: stateset,
                		config: {
                    		noTangent: true,
                    		normalMap: true
               		 	}
            		};
            		this._shaders.push( config ); 
            		//this.setMaterial(stateset, false,this.createMetalRoughnessTextureFromColors(0.5, 0.5, false ));
            		//stateset.setTextureAttributeAndModes( window.NORMAL_TEXTURE_UNIT, this.createTextureFromColor( osg.vec4.fromValues( 0, 0, 1, 1 )));
            	}else if(name.indexOf("env_") == 0)
            	{
            		stateset.setAttributeAndModes( env_program );
            		stateset.addUniform( osg.Uniform.createInt(0, 'uTexture' ) );
            	}else{
            		if(stateset.getNumTextureAttributeLists() == 1||stateset._binNumber ==10)
            		{
            			stateset.setAttributeAndModes( program );
            			stateset.addUniform( osg.Uniform.createInt(0, 'uTexture' ) );
            			
            		}else{
            			config = {
                			stateSet: stateset,
                			config: {
                    			noTangent: true
               		 		}
            			};
            			this._shaders.push( config ); 
            		}
            		//this.setMaterial(stateset, false,this.createMetalRoughnessTextureFromColors(0.5, 0.5, false ));
            	}
            }
            
           	this._rowMetalic = new osg.MatrixTransform();
            this._rowMetalic.addChild( this.createRowModelsMetalic() );
            group.addChild( this._rowMetalic );
            osg.mat4.fromTranslation( this._rowMetalic.getMatrix(), [ 0, 130, 0 ] );

//          var rowSpecular = this.createRowModelsSpecularMetal();
//          stateSet = rowSpecular.getOrCreateStateSet();
//          config = {
//              stateSet: stateSet,
//              config: {
//                  specularMap: true,
//                  noTangent: true
//              }
//          };
//          this._shaders.push( config );
//          group.addChild( rowSpecular );
//          osg.mat4.fromTranslation( rowSpecular.getMatrix(), [ 0, 260, 0 ] );


            this.updateShaderPBR();

            group.getOrCreateStateSet().setAttributeAndModes( new osg.CullFace() );
            return group;
        },


        createSampleScene: function () {

            var group = this._mainSceneNode;

            group.addChild( this._environmentGeometry );

            group.addChild( this.createSampleModels() );

            // add node that contains model loaded
            group.addChild( this._proxyRealModel );

            return group;
        },

        createShaderPanorama: function ( defines ) {

            var vertexshader = shaderProcessor.getShader( 'panoramaVertex.glsl' );
            var fragmentshader = shaderProcessor.getShader( 'panoramaFragment.glsl', defines );

            var program = new osg.Program(
                new osg.Shader( 'VERTEX_SHADER', vertexshader ),
                new osg.Shader( 'FRAGMENT_SHADER', fragmentshader ) );

            return program;
        },

        createShaderCubemap: function ( defines ) {

            var vertexshader = shaderProcessor.getShader( 'cubemapVertex.glsl' );
            var fragmentshader = shaderProcessor.getShader( 'cubemapFragment.glsl', defines );

            var program = new osg.Program(
                new osg.Shader( 'VERTEX_SHADER', vertexshader ),
                new osg.Shader( 'FRAGMENT_SHADER', fragmentshader ) );

            return program;

        },

        updateGlobalUniform: function ( stateSet ) {
            stateSet.addUniform( this._environmentTransformUniform );
            stateSet.addUniform( this._envBrightnessUniform );
            stateSet.addUniform( this._normalAA );
            stateSet.addUniform( this._specularPeak );
            stateSet.addUniform( this._occlusionHorizon );
        },

        setPanorama: function () {

            // set the stateSet of the environment geometry
            this.setSphericalEnv();

            var texture;

            texture = this._currentEnvironment.getPanoramaUE4()[ this._config.format ].getTexture();

            var stateSet = this._mainSceneNode.getOrCreateStateSet();
            var w = texture.getWidth();
            stateSet.addUniform( osg.Uniform.createFloat2( [ w, w / 2 ], 'uEnvironmentSize' ) );

            // x4 because the base is for cubemap
            var textures = this._currentEnvironment.getTextures( 'specular_ue4', 'luv', 'panorama' );
            
            
            var textureConfig = textures[ 0 ];
            var minTextureSize = textureConfig.limitSize;

            var nbLod = Math.log( w ) / Math.LN2;
            var maxLod = nbLod - Math.log( minTextureSize ) / Math.LN2;

            stateSet.addUniform( osg.Uniform.createFloat2( [ nbLod, maxLod ], 'uEnvironmentLodRange' ) );
            stateSet.addUniform( osg.Uniform.createInt1( 6, 'uEnvironment' ) );

            this.updateGlobalUniform( stateSet );

            stateSet.setTextureAttributeAndModes( 6, texture );
            

        },

        setCubemapSeamless: function () {

            this.setSphericalEnv();

            var texture = this._currentEnvironment.getCubemapUE4()[ this._config.format ].getTexture();

            var stateSet = this._mainSceneNode.getOrCreateStateSet();
            var w = texture.getWidth();

            var textures = this._currentEnvironment.getTextures( 'specular_ue4', 'luv', 'cubemap' );
            var textureConfig = textures[ 0 ];
            var minTextureSize = textureConfig.limitSize;

            var nbLod = Math.log( w ) / Math.LN2;
            var maxLod = nbLod - Math.log( minTextureSize ) / Math.LN2;

            stateSet.addUniform( osg.Uniform.createFloat2( [ nbLod, maxLod ], 'uEnvironmentLodRange' ) );
            stateSet.addUniform( osg.Uniform.createFloat2( [ w, w ], 'uEnvironmentSize' ) );
            stateSet.addUniform( osg.Uniform.createInt1( 6, 'uEnvironmentCube' ) );

            this.updateGlobalUniform( stateSet );

            stateSet.setTextureAttributeAndModes( 6, texture );

        },


        setBackgroundEnvironment: function () {

            // set the stateSet of the environment geometry
            this._environmentStateSet.setAttributeAndModes(
                this.createShaderCubemap( [
                    '#define ' + this._config.format
                ] ) );

            var textureBackground = this._currentEnvironment.getBackgroundCubemap()[ this._config.format ].getTexture();
            
           // var textureBackground  = this._currentEnvironment.getCubemapUE4()[ this._config.format ].getTexture();
            var w = textureBackground.getWidth();
            this._environmentStateSet.addUniform( osg.Uniform.createFloat2( [ w, w ], 'uEnvironmentSize' ) );
            this._environmentStateSet.addUniform( osg.Uniform.createInt1( 0, 'uEnvironmentCube' ) );
            this._environmentStateSet.setTextureAttributeAndModes( 0, textureBackground );

        },

        setSphericalEnv: function () {
            this._environmentStateSet.addUniform( this._currentEnvironment.getSpherical()._uniformSpherical );
        },

        createScene: function () {

            this._environmentGeometry = this.createEnvironmentNode();
            this._environmentStateSet = this._environmentGeometry.getOrCreateStateSet();

            this._mainSceneNode = new osg.Node();

            var root = new osg.Node();
            //root.addChild( osg.createAxisGeometry( 50 ) );

            var group = new osg.MatrixTransform();
            root.addChild( group );
            //root.addChild(this.getOrCreateModel());

            // add lod controller to debug
            this._lod = osg.Uniform.createFloat1( 0.0, 'uLod' );
            group.getOrCreateStateSet().addUniform( this._lod );
            //var flipNormalY = osg.Uniform.createInt1( 0, 'uFlipNormalY' );
            //group.getOrCreateStateSet().addUniform( flipNormalY );

            //if ( !isMobileDevice() ) {
                var integrateBRDFUniform = osg.Uniform.createInt1( this._integrateBRDFTextureUnit, 'uIntegrateBRDF' );
                group.getOrCreateStateSet().addUniform( integrateBRDFUniform );
                this._stateSetBRDF = group.getOrCreateStateSet();
            //}

            var promises = [];

            // precompute panorama
            P.all( promises ).then( function () {

                group.addChild( this.createSampleScene() );

                this.updateEnvironment();
                //group.getOrCreateStateSet().setAttributeAndModes( new osg.CullFace( 'DISABLE' ) );
                // y up
                osg.mat4.fromRotation( group.getMatrix(), -Math.PI / 2, [ -1, 0, 0 ] );

                root.getOrCreateStateSet().addUniform( osg.Uniform.createInt( window.METALLIC_ROUGHNESS_TEXTURE_UNIT, 'metallicRoughnessMap' ) );
                root.getOrCreateStateSet().addUniform( osg.Uniform.createInt( window.NORMAL_TEXTURE_UNIT, 'normalMap' ) );
                root.getOrCreateStateSet().addUniform( osg.Uniform.createInt( window.SPECULAR_TEXTURE_UNIT, 'specularMap' ) );
                root.getOrCreateStateSet().addUniform( osg.Uniform.createInt( window.ALBEDO_TEXTURE_UNIT, 'albedoMap' ) );
                root.getOrCreateStateSet().addUniform( osg.Uniform.createInt( window.DIFFUSE_TEXTURE_UNIT, 'diffuseMap' ) );


                this._viewer.getManipulator().computeHomePosition();
                this.updateCameraPreset();


            }.bind( this ) );

            return root;
        },

        readEnvConfig: function ( file ) {

            var d = P.defer();
            var p = P.resolve( $.get( file ) );

            p.then( function ( text ) {

                var config = text;
                d.resolve( config );

            } );

            return d.promise;
        },

        setEnableInput: function ( enable ) {

            this._viewer.getEventProxy().StandardMouseKeyboard.setEnable( enable );

        },


        createGUI: function () {
            var gui = this._gui;

            var controller;

            controller = gui.add( this._config, '光朝向', -Math.PI, Math.PI ).step( 0.1 );
            controller.onChange( this.updateEnvironmentRotation.bind( this ) );

            //controller = gui.add( this._config, 'brightness', 0.0, 25.0 ).step( 0.01 );
            //controller.onChange( this.updateEnvironmentBrightness.bind( this ) );

            //controller = gui.add( this._config, 'normalAA' );
            //controller.onChange( this.updateNormalAA.bind( this ) );

            //controller = gui.add( this._config, 'specularPeak' );
            //controller.onChange( this.updateSpecularPeak.bind( this ) );

            //controller = gui.add( this._config, 'occlusionHorizon' );
            //controller.onChange( this.updateOcclusionHorizon.bind( this ) );

            controller = gui.add( this._config, 'cameraPreset', Object.keys( CameraPresets ) );
            controller.onChange( this.updateCameraPreset.bind( this ) );

            //controller = gui.add( this._config, 'lod', 0.0, 15.01 ).step( 0.1 );
            //controller.onChange( function ( value ) {
             //   this._lod.getInternalArray()[ 0 ] = value;
            //}.bind( this ) );

            //controller = gui.add( this._config, 'format', [] );

            //controller = gui.add( this._config, 'environmentType', [ 'cubemapSeamless', 'panorama' ] );
           // controller.onChange( this.updateEnvironment.bind( this ) );

            //controller = gui.add( this._config, 'material', Object.keys( PredefinedMaterials ) );
            //controller.onChange( this.updateRowModelsSpecularMetal.bind( this ) );

            controller = gui.add( this._config, '平滑度', 0, 1.0 );
            controller.onChange( this.updateRowModelsMetalic.bind( this ) );
            
            controller = gui.add( this._config, '金属感', 0, 1.0 );
            controller.onChange( this.updateRowModelsMetalic.bind( this ) );

            controller = gui.addColor( this._config, '漆面色' );
            controller.onChange( this.updateAlbedo.bind( this ) );
            
            
            controller = gui.add( this._config,'cameraFov', 30, 100 );

            //controller = gui.add( {
            //    loadModel: function () {}
            //}, 'loadModel' );
            //controller.onChange( this.loadFiles.bind( this ) );

            //controller = gui.add( this._config, 'model', modelList );
            //controller.onChange( this.updateModel.bind( this ) );

            //controller = gui.add( this._config, '环境', environmentList );
           // controller.onChange( this.updateEnvironment.bind( this ) );
        },

        run: function ( canvas ) {

            //osgGA.Manipulator.DEFAULT_SETTINGS = osgGA.Manipulator.DEFAULT_SETTINGS | osgGA.Manipulator.COMPUTE_HOME_USING_BBOX;

            var viewer = this._viewer = new osgViewer.Viewer( canvas, {
                preserveDrawingBuffer: true,
                premultipliedAlpha: false
            } );

			viewer._config = this._config
			if(!isMobileDevice())
			{
				viewer.computeCanvasSize = function(canvas)
				{
					var clientWidth, clientHeight;
		            clientWidth = canvas.clientWidth;
		            clientHeight = canvas.clientHeight;
		
		            if ( clientWidth < 1 ) clientWidth = 1;
		            if ( clientHeight < 1 ) clientHeight = 1;
		
		            var devicePixelRatio = this._devicePixelRatio;
		
		            var widthPixel = Math.floor( clientWidth * devicePixelRatio );
		            var heightPixel = Math.floor( clientHeight * devicePixelRatio );
		
		            var hasChanged = false;
		            if ( canvas.width !== 2.0*widthPixel ) {
		                canvas.width = 2.0*widthPixel;
		                this._canvasWidth = widthPixel;
		                hasChanged = true;
		            }
		
		            if ( canvas.width!== 2.0*heightPixel ) {
		                canvas.height = 2.0*heightPixel;
		                this._canvasHeight = heightPixel;
		                hasChanged = true;
		            }
		            
		            if(hasChanged)
		            {
		            	 osg.mat4.perspective( viewer.getCamera().getProjectionMatrix(), Math.PI / 180 * this._config.cameraFov, canvas.width / canvas.height, 0.1, 1000 );
		            }
		            return hasChanged;
		            
				}
				viewer.setUpView(canvas,viewer.initOptions({
	                preserveDrawingBuffer: true,
	                premultipliedAlpha: false
	            }));
			}
			

            viewer.init();

           

            var gl = viewer.getState().getGraphicContext();
            console.log( gl.getSupportedExtensions() );
            console.log( gl.getExtension( 'OES_texture_float' ) );
            var hasFloatLinear = gl.getExtension( 'OES_texture_float_linear' );
            console.log( hasFloatLinear );
            var hasTextureLod = gl.getExtension( 'EXT_shader_texture_lod' );
            console.log( hasTextureLod );

            this.createGUI();

            var ready = [];

            var promise = this.createEnvironment( environment );
            ready.push( this.readShaders() );
            ready.push( promise);
            
            //ready.push( this.createEnvironment( "textures/unity_gareoult.zip" ) );
            //ready.push( this.createEnvironment( "textures/unity_kirbycove.zip" ) );
            //ready.push( this.createEnvironment( "textures/unity_seaside.zip" ) );
            
            ready.push( this.createModelMaterialSample() );

            P.all( ready ).then( function () {

                var root = this.createScene();
                viewer.setSceneData( root );

                viewer.setupManipulator();
                var mani = new MyManipulator();
                mani.owner = this;
                viewer.setManipulator(mani);
                
                
                viewer.getManipulator()._boundStrategy = OSG.osgGA.Manipulator.COMPUTE_HOME_USING_BBOX;
                
                viewer.getManipulator().computeHomePosition();
                viewer.getManipulator().setComputeBoundNodeMaskOverride( 0x0 );

                viewer.run();

                osg.mat4.perspective( viewer.getCamera().getProjectionMatrix(), Math.PI / 180 * this._config.cameraFov, canvas.width / canvas.height, 0.1, 1000 );

                //if ( !hasTextureLod )
                    this._config.environmentType = 'panorama';

                this.updateModel();
                this.setEnvironment( environmentList[ 0 ] );

                // Iterate over all controllers
                for ( var i in this._gui.__controllers ) {
                    this._gui.__controllers[ i ].updateDisplay();
                }


            }.bind( this ) );
            
            return viewer;
        },

        updateAlbedo: function () {
            this._albedoTexture = this.createTextureFromColor( this.convertColor( this._config.漆面色 ), true, this._albedoTexture );
        },

        updateShaderPBR: function () {

            this._shaders.forEach( function ( config ) {

                var stateSet = config.stateSet;

                var shaderConfig = osg.objectMix( {
                    environmentType: this._config.environmentType,
                    format: this._config.format,
                    mobile: this._config.mobile
                }, config.config );

                var program = this.createShaderPBR( shaderConfig );

                stateSet.setAttributeAndModes( program );

            }.bind( this ) );

        },

        updateEnvironment: function () {
            if ( !this._currentEnvironment ) return;

            if ( this._config.environmentType === 'cubemapSeamless' ) {
                this.setCubemapSeamless();
            } else {
                this.setPanorama();
            }

            //if ( !isMobileDevice() ) 
            this._stateSetBRDF.setTextureAttributeAndModes( this._integrateBRDFTextureUnit, this._currentEnvironment.getIntegrateBRDF().getTexture() );

            //this.setBackgroundEnvironment();
            this.updateEnvironmentRotation();
            this.updateShaderPBR();
        },

        convertColor: function ( color ) {

            var r, g, b;

            // rgb [255, 255, 255]
            if ( color.length === 3 ) {
                r = color[ 0 ];
                g = color[ 1 ];
                b = color[ 2 ];

            } else if ( color.length === 7 ) {

                // hex (24 bits style) '#ffaabb'
                var intVal = parseInt( color.slice( 1 ), 16 );
                r = intVal >> 16;
                g = intVal >> 8 & 0xff;
                b = intVal & 0xff;
            }

            var result = [ 0, 0, 0, 1 ];
            result[ 0 ] = r / 255.0;
            result[ 1 ] = g / 255.0;
            result[ 2 ] = b / 255.0;
            return result;
        }


    };

    var dragOverEvent = function ( evt ) {

        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';

    };

    var dropEvent = function ( evt ) {

        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files;
        if ( files.length )
            this.handleDroppedFiles( files );
        else {
            var url = evt.dataTransfer.getData( 'text' );
            if ( url.indexOf( '.zip' ) !== -1 || url.indexOf( '.gltf' ) !== -1 )
                this.handleDroppedURL( url );
            else
                osg.warn( 'url ' + url + ' not supported, drag n drop only valid zip files' );
        }

    };

	var mouseMoveLength = 0;
	var mouseClick = function(canvas , viewer , ev)
	{
		//console.log("xy : " + x +","+y)
		if(DoorAnimas == null) return;
		
		
		  console.log("mouseMoveLength : " + mouseMoveLength)
		if(mouseMoveLength>50||mouseMoveLength<-50) return;
		
		
		//DoorAnimas.frDoorAnima.direct *=-1;
		
		//DoorAnimas.frDoorAnima.
		
        //DoorAnimas.brDoorAnima = new DoorAnimaUpdateCallback();
        //DoorAnimas.flDoorAnima = new DoorAnimaUpdateCallback();
        //DoorAnimas.blDoorAnima = new DoorAnimaUpdateCallback();
        
        
        var ratioX = canvas.width / canvas.clientWidth;

        var ratioY = canvas.height / canvas.clientHeight;


        var hits = viewer.computeIntersections(

            ev.clientX * ratioX,

            (canvas.clientHeight - ev.clientY) * ratioY
            
        );
        
        
        var cameraPos = viewer.getManipulator().getEyePosition(osg.vec3.create());
        
        console.log("hits.length : " + hits.length)
        if(hits.length<=0) return;
        
		hits.sort(function(a, b) {
			  var l1 = osg.vec3.squaredLength(osg.vec3.sub(osg.vec3.create(),a.point,cameraPos));
			  var l2 = osg.vec3.squaredLength(osg.vec3.sub(osg.vec3.create(),b.point,cameraPos));
		      return l2-l1;
		
		 });
		     
      for(var j = 0 ; j<hits.length; j++)
      {
        	var hit = hits[j];
        	for(var i = 0 ; i<hit.nodepath.length ; i++)
        	{
        		console.log(hit.nodepath[i].getName())
        		if(hit.nodepath[i]== DoorAnimas.frDoorAnima.node)
        		{
        			DoorAnimas.frDoorAnima.direct *=-1;
        			
        			DoorAnimas.frDoorAnima.start(DoorAnimas.frDoorAnima.direct);
        			
        			console.log(hit.nodepath[i].getName())
        			return;
        		}else if(hit.nodepath[i]== DoorAnimas.flDoorAnima.node)
        		{
        			DoorAnimas.flDoorAnima.direct *=-1;
        			DoorAnimas.flDoorAnima.start(DoorAnimas.flDoorAnima.direct);
        			console.log(hit.nodepath[i].getName())
        			return;
        		}else if(hit.nodepath[i]== DoorAnimas.brDoorAnima.node)
        		{
        			DoorAnimas.brDoorAnima.direct *=-1;
        			DoorAnimas.brDoorAnima.start(DoorAnimas.brDoorAnima.direct);
        			console.log(hit.nodepath[i].getName())
        			return;
        		}else if(hit.nodepath[i]== DoorAnimas.blDoorAnima.node)
        		{
        			DoorAnimas.blDoorAnima.direct *=-1;
        			DoorAnimas.blDoorAnima.start(DoorAnimas.blDoorAnima.direct);
        			console.log(hit.nodepath[i].getName())
        			return;
        		} 
        	 	
        	}
      }
        
       
	}
    window.addEventListener( 'load', function () {

        var example = new Example();
        var canvas = $( '#View' )[ 0 ];
                    

        var viewer = example.run( canvas );
        //$( '#loading' ).hide();
		//$( 'body' ).processbar().hideprocess();

       // window.addEventListener( 'dragover', dragOverEvent.bind( example ), false );
        //window.addEventListener( 'drop', dropEvent.bind( example ), false );

        var lastMousePosition = {
            x: 0.0,
            y: 0.0,
            sx:0,
            sy:0
       
        };
        window.example = example;
        window.addEventListener( 'mousemove', function ( evt ) {

            var button = evt.which || evt.button;

            if ( evt.altKey && button ) {

                evt.stopPropagation();
                var deltaX = evt.clientX - lastMousePosition.x;
                example._config.光朝向 += deltaX * 0.01;
                example.updateEnvironmentRotation();

            }
            
            mouseMoveLength = evt.clientX-lastMousePosition.sx+evt.clientY-lastMousePosition.sy;
			
			
            lastMousePosition.x = evt.clientX;
            lastMousePosition.y = evt.clientY;
        }, true );
        
         window.addEventListener( 'mousedown', function ( evt ) {

            var button = evt.which || evt.button;

			mouseMoveLength = 0;
            lastMousePosition.sx = evt.clientX;
            lastMousePosition.sy = evt.clientY;

        }, true );
        window.addEventListener( 'click', function ( evt ) {
			mouseClick(canvas,viewer,evt);
        }, true );
        

    }, true );

} )();
