(()=>{var Qp=Object.defineProperty;var Ft=(i,e)=>()=>(i&&(e=i(i=0)),e);var em=(i,e)=>{for(var t in e)Qp(i,t,{get:e[t],enumerable:!0})};function En(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[t&63|128]+Wt[t>>8&255]+"-"+Wt[t>>16&255]+Wt[t>>24&255]+Wt[n&255]+Wt[n>>8&255]+Wt[n>>16&255]+Wt[n>>24&255]).toLowerCase()}function $e(i,e,t){return Math.max(e,Math.min(t,i))}function Kl(i,e){return(i%e+e)%e}function tm(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function nm(i,e,t){return i!==e?(t-i)/(e-i):0}function Ar(i,e,t){return(1-t)*i+t*e}function im(i,e,t,n){return Ar(i,e,1-Math.exp(-t*n))}function sm(i,e=1){return e-Math.abs(Kl(i,e*2)-e)}function rm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function om(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function am(i,e){return i+Math.floor(Math.random()*(e-i+1))}function cm(i,e){return i+Math.random()*(e-i)}function lm(i){return i*(.5-Math.random())}function hm(i){i!==void 0&&(wu=i);let e=wu+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function um(i){return i*Er}function dm(i){return i*Qi}function fm(i){return(i&i-1)===0&&i!==0}function pm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function mm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function gm(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),m=o((n-e)/2);switch(s){case"XYX":i.set(a*h,c*u,c*d,a*l);break;case"YZY":i.set(c*d,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*d,a*h,a*l);break;case"XZX":i.set(a*h,c*m,c*f,a*l);break;case"YXY":i.set(c*f,a*h,c*m,a*l);break;case"ZYZ":i.set(c*m,c*f,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Bn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function lt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}function $l(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function zs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function jd(){let i=zs("canvas");return i.style.display="block",i}function ks(i){i in Eu||(Eu[i]=!0,console.warn(i))}function Qd(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function _m(){let i={enabled:!0,workingColorSpace:Dt,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ht&&(s.r=mi(s.r),s.g=mi(s.g),s.b=mi(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ht&&(s.r=Fs(s.r),s.g=Fs(s.g),s.b=Fs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Si?Ir:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ks("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ks("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Dt]:{primaries:e,whitePoint:n,transfer:Ir,toXYZ:Au,fromXYZ:Ru,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:vt},outputColorSpaceConfig:{drawingBufferColorSpace:vt}},[vt]:{primaries:e,whitePoint:n,transfer:ht,toXYZ:Au,fromXYZ:Ru,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:vt}}}),i}function mi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Fs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}function Wc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ia.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}function qc(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Wi.fromArray(i,r);let a=s.x*Math.abs(Wi.x)+s.y*Math.abs(Wi.y)+s.z*Math.abs(Wi.z),c=e.dot(Wi),l=t.dot(Wi),h=n.dot(Wi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}function rl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}function Rm(){let i=new ArrayBuffer(4),e=new Float32Array(i),t=new Uint32Array(i),n=new Uint32Array(512),s=new Uint32Array(512);for(let c=0;c<256;++c){let l=c-127;l<-27?(n[c]=0,n[c|256]=32768,s[c]=24,s[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,s[c]=-l-1,s[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,s[c]=13,s[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,s[c]=24,s[c|256]=24):(n[c]=31744,n[c|256]=64512,s[c]=13,s[c|256]=13)}let r=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;(l&8388608)===0;)l<<=1,h-=8388608;l&=-8388609,h+=947912704,r[c]=l|h}for(let c=1024;c<2048;++c)r[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)o[c]=c<<23;o[31]=1199570944,o[32]=2147483648;for(let c=33;c<63;++c)o[c]=2147483648+(c-32<<23);o[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(a[c]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:s,mantissaTable:r,exponentTable:o,offsetTable:a}}function Cm(i){Math.abs(i)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),i=$e(i,-65504,65504),pi.floatView[0]=i;let e=pi.uint32View[0],t=e>>23&511;return pi.baseTable[t]+((e&8388607)>>pi.shiftTable[t])}function Im(i){let e=i>>10;return pi.uint32View[0]=pi.mantissaTable[pi.offsetTable[e]+(i&1023)]+pi.exponentTable[e],pi.floatView[0]}function Dm(i,e,t,n,s,r,o,a){let c;if(e.side===Gt?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===kn,a),c===null)return null;ko.copy(a),ko.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(ko);return l<t.near||l>t.far?null:{distance:l,point:ko.clone(),object:i}}function Vo(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,Fo),i.getVertexPosition(c,Oo),i.getVertexPosition(l,Bo);let h=Dm(i,e,t,n,Fo,Oo,Bo,zu);if(h){let u=new P;Pi.getBarycoord(zu,Fo,Oo,Bo,u),s&&(h.uv=Pi.getInterpolatedAttribute(s,a,c,l,u,new he)),r&&(h.uv1=Pi.getInterpolatedAttribute(r,a,c,l,u,new he)),o&&(h.normal=Pi.getInterpolatedAttribute(o,a,c,l,u,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:c,c:l,normal:new P,materialIndex:0};Pi.getNormal(Fo,Oo,Bo,d.normal),h.face=d,h.barycoord=u}return h}function fs(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Yt(i){let e={};for(let t=0;t<i.length;t++){let n=fs(i[t]);for(let s in n)e[s]=n[s]}return e}function Nm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Jl(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}function qo(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(ca.fromBufferAttribute(a,s),la.fromBufferAttribute(a,r),t.distanceSqToSegment(ca,la,ul,Ju)>n)return;ul.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(ul);if(!(l<e.near||l>e.far))return{distance:l,point:Ju.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}function td(i,e,t,n,s,r,o){let a=Sl.distanceSqToPoint(i);if(a<t){let c=new P;Sl.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}function jl(){let i=0,e=0,t=0,n=0;function s(r,o,a,c){i=r,e=a,t=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}function nd(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,c=i*a;return(2*t-2*n+r+o)*c+(-3*t+3*n-2*r-o)*a+r*i+t}function Wm(i,e){let t=1-i;return t*t*e}function Xm(i,e){return 2*(1-i)*i*e}function qm(i,e){return i*i*e}function Rr(i,e,t,n){return Wm(i,e)+Xm(i,t)+qm(i,n)}function Ym(i,e){let t=1-i;return t*t*t*e}function Zm(i,e){let t=1-i;return 3*t*t*i*e}function Km(i,e){return 3*(1-i)*i*i*e}function $m(i,e){return i*i*i*e}function Cr(i,e,t,n,s){return Ym(i,e)+Zm(i,t)+Km(i,n)+$m(i,s)}function Jm(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=nf(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l;if(n&&(r=ng(i,e,r,t)),i.length>80*t){a=1/0,c=1/0;let h=-1/0,u=-1/0;for(let d=t;d<s;d+=t){let f=i[d],m=i[d+1];f<a&&(a=f),m<c&&(c=m),f>h&&(h=f),m>u&&(u=m)}l=Math.max(h-a,u-c),l=l!==0?32767/l:0}return Kr(r,o,t,a,c,l,0),o}function nf(i,e,t,n,s){let r;if(s===fg(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=id(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=id(o/n|0,i[o],i[o+1],r);return r&&js(r,r.next)&&(Jr(r),r=r.next),r}function ss(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(js(t,t.next)||wt(t.prev,t,t.next)===0)){if(Jr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Kr(i,e,t,n,s,r,o){if(!i)return;!o&&r&&ag(i,n,s,r);let a=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(r?Qm(i,n,s,r):jm(i)){e.push(c.i,i.i,l.i),Jr(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=eg(ss(i),e),Kr(i,e,t,n,s,r,2)):o===2&&tg(i,e,t,n,s,r):Kr(ss(i),e,t,n,s,r,1);break}}}function jm(i){let e=i.prev,t=i,n=i.next;if(wt(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,c=t.y,l=n.y,h=Math.min(s,r,o),u=Math.min(a,c,l),d=Math.max(s,r,o),f=Math.max(a,c,l),m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&Tr(s,a,r,c,o,l,m.x,m.y)&&wt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Qm(i,e,t,n){let s=i.prev,r=i,o=i.next;if(wt(s,r,o)>=0)return!1;let a=s.x,c=r.x,l=o.x,h=s.y,u=r.y,d=o.y,f=Math.min(a,c,l),m=Math.min(h,u,d),_=Math.max(a,c,l),g=Math.max(h,u,d),p=wl(f,m,e,t,n),M=wl(_,g,e,t,n),y=i.prevZ,x=i.nextZ;for(;y&&y.z>=p&&x&&x.z<=M;){if(y.x>=f&&y.x<=_&&y.y>=m&&y.y<=g&&y!==s&&y!==o&&Tr(a,h,c,u,l,d,y.x,y.y)&&wt(y.prev,y,y.next)>=0||(y=y.prevZ,x.x>=f&&x.x<=_&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&Tr(a,h,c,u,l,d,x.x,x.y)&&wt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;y&&y.z>=p;){if(y.x>=f&&y.x<=_&&y.y>=m&&y.y<=g&&y!==s&&y!==o&&Tr(a,h,c,u,l,d,y.x,y.y)&&wt(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;x&&x.z<=M;){if(x.x>=f&&x.x<=_&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&Tr(a,h,c,u,l,d,x.x,x.y)&&wt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function eg(i,e){let t=i;do{let n=t.prev,s=t.next.next;!js(n,s)&&rf(n,t,t.next,s)&&$r(n,s)&&$r(s,n)&&(e.push(n.i,t.i,s.i),Jr(t),Jr(t.next),t=i=s),t=t.next}while(t!==i);return ss(t)}function tg(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&hg(o,a)){let c=of(o,a);o=ss(o,o.next),c=ss(c,c.next),Kr(o,e,t,n,s,r,0),Kr(c,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function ng(i,e,t,n){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,c=r<o-1?e[r+1]*n:i.length,l=nf(i,a,c,n,!1);l===l.next&&(l.steiner=!0),s.push(lg(l))}s.sort(ig);for(let r=0;r<s.length;r++)t=sg(s[r],t);return t}function ig(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function sg(i,e){let t=rg(i,e);if(!t)return e;let n=of(t,i);return ss(n,n.next),ss(t,t.next)}function rg(i,e){let t=e,n=i.x,s=i.y,r=-1/0,o;if(js(i,t))return t;do{if(js(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,o=t.x<t.next.x?t:t.next,u===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,c=o.x,l=o.y,h=1/0;t=o;do{if(n>=t.x&&t.x>=c&&n!==t.x&&sf(s<l?n:r,s,c,l,s<l?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);$r(t,i)&&(u<h||u===h&&(t.x>o.x||t.x===o.x&&og(o,t)))&&(o=t,h=u)}t=t.next}while(t!==a);return o}function og(i,e){return wt(i.prev,i,e.prev)<0&&wt(e.next,i,i.next)<0}function ag(i,e,t,n){let s=i;do s.z===0&&(s.z=wl(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,cg(s)}function cg(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let l=0;l<t&&(a++,o=o.nextZ,!!o);l++);let c=t;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function wl(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function lg(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function sf(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function Tr(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&sf(i,e,t,n,s,r,o,a)}function hg(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!ug(i,e)&&($r(i,e)&&$r(e,i)&&dg(i,e)&&(wt(i.prev,i,e.prev)||wt(i,e.prev,e))||js(i,e)&&wt(i.prev,i,i.next)>0&&wt(e.prev,e,e.next)>0)}function wt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function js(i,e){return i.x===e.x&&i.y===e.y}function rf(i,e,t,n){let s=Jo(wt(i,e,t)),r=Jo(wt(i,e,n)),o=Jo(wt(t,n,i)),a=Jo(wt(t,n,e));return!!(s!==r&&o!==a||s===0&&$o(i,t,e)||r===0&&$o(i,n,e)||o===0&&$o(t,i,n)||a===0&&$o(t,e,n))}function $o(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Jo(i){return i>0?1:i<0?-1:0}function ug(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&rf(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function $r(i,e){return wt(i.prev,i,i.next)<0?wt(i,e,i.next)>=0&&wt(i,i.prev,e)>=0:wt(i,e,i.prev)<0||wt(i,i.next,e)<0}function dg(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function of(i,e){let t=Tl(i.i,i.x,i.y),n=Tl(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function id(i,e,t,n){let s=Tl(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Jr(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Tl(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function fg(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}function sd(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function rd(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}function mg(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}function jo(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function gg(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function _g(i){function e(s,r){return i[s]-i[r]}let t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function od(i,e,t){let n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){let a=t[r]*e;for(let c=0;c!==e;++c)s[o++]=i[a+c]}return s}function af(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=i[s++];while(r!==void 0)}function xg(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Qn;case"vector":case"vector2":case"vector3":case"vector4":return ti;case"color":return to;case"quaternion":return ei;case"bool":case"boolean":return xi;case"string":return yi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function yg(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=xg(i.type);if(i.times===void 0){let t=[],n=[];af(i.keys,t,n,"value"),i.times=t,i.values=n}return e.parse!==void 0?e.parse(i):new e(i.name,i.times,i.values,i.interpolation)}function ud(i,e){return i.distance-e.distance}function Ll(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)Ll(r[o],e,t,!0)}}function th(i,e,t,n){let s=Rg(n);switch(t){case Hl:return i*e;case Oa:return i*e/s.components*s.byteLength;case Ba:return i*e/s.components*s.byteLength;case Xl:return i*e*2/s.components*s.byteLength;case za:return i*e*2/s.components*s.byteLength;case Wl:return i*e*3/s.components*s.byteLength;case jt:return i*e*4/s.components*s.byteLength;case ka:return i*e*4/s.components*s.byteLength;case lo:case ho:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case uo:case fo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ga:case Wa:return Math.max(i,16)*Math.max(e,8)/4;case Va:case Ha:return Math.max(i,8)*Math.max(e,8)/2;case Xa:case qa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ya:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Za:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ka:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case $a:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Ja:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case ja:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Qa:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ec:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case tc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case nc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case ic:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case sc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case rc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case oc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ac:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case cc:case lc:case hc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case uc:case dc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case fc:case pc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Rg(i){switch(i){case Xn:case zl:return{byteLength:1,components:1};case nr:case kl:case qn:return{byteLength:2,components:1};case Ua:case Fa:return{byteLength:2,components:4};case Oi:case Na:case qt:return{byteLength:4,components:1};case Vl:case Gl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}var dd,Dl,fd,Nl,ba,ni,kn,Gt,gt,Mi,Ki,Ul,Fl,Ol,pd,Li,md,gd,_d,xd,yd,vd,Md,bd,ea,ta,Sd,wd,Td,Ed,Ad,Rd,Cd,Id,Pd,Sa,wa,Ta,$i,Ea,Aa,Ra,Ca,Ia,Ld,Dd,bi,Nd,Ud,Fd,Od,Bd,Pa,zd,xl,kd,Bl,hs,us,er,La,co,gn,Tn,Os,kt,Da,ds,Mt,tr,ln,Xn,zl,kl,nr,Na,Oi,qt,qn,Ua,Fa,ir,Vl,Gl,Hl,Wl,jt,Bs,sr,Oa,Ba,Xl,za,ka,lo,ho,uo,fo,Va,Ga,Ha,Wa,Xa,qa,Ya,Za,Ka,$a,Ja,ja,Qa,ec,tc,nc,ic,sc,rc,oc,ac,cc,lc,hc,uc,dc,fc,pc,Ji,ji,Qo,yl,vl,Ml,Vd,ql,po,rr,Gd,Hd,mc,Wd,Si,vt,Dt,Ir,ht,Yi,bl,Xd,qd,Yd,Yl,Zd,Kd,$d,Jd,na,Zl,zn,Pr,gi,Wt,wu,Er,Qi,At,he,nn,P,Gc,Tu,He,Hc,Eu,Au,Ru,nt,bs,ia,xm,Vs,ym,Xc,Bt,st,sa,Kn,Lr,ra,Vt,ci,Un,Eo,Ss,ws,Ts,Ti,Ei,Hi,_r,Ao,Ro,Wi,vm,xr,Yc,sn,li,Zc,Co,Ai,Kc,Io,$c,Di,Be,Es,Fn,Mm,bm,Ri,Po,pn,Cu,Iu,rn,Gs,Sm,Pu,As,hi,Lo,yr,wm,Tm,Lu,Du,Nu,Uu,Em,Rs,Jc,Qe,On,ui,jc,di,Cs,Is,Fu,Qc,el,tl,nl,il,sl,Pi,ef,Ci,Do,Ee,Xt,Am,Jt,Et,pi,Ni,It,No,Pm,ft,Dr,Nr,je,Lm,Sn,ol,Ps,mn,vr,Ot,ot,Ou,Xi,Uo,Bu,Fo,Oo,Bo,al,zo,zu,ko,qe,zt,tf,Um,Fm,Vn,Ur,Ii,ku,Vu,Pt,Ls,Ds,oa,Fr,aa,ye,Om,Hs,Or,es,Ws,$t,Xs,Gu,Hu,Wu,Bm,Xu,Go,cl,qu,ll,Br,qs,An,Yu,zm,zr,Ui,Ns,Zu,Ho,Ku,km,Mr,br,Lt,hl,Vm,Gm,wn,qi,Hm,Wo,Ys,Gn,ca,la,$u,Sr,Xo,ul,Ju,Hn,ju,Qu,ts,kr,_n,ed,Sl,Yo,Zo,Rn,Vr,Gr,Zs,$n,Hr,xn,Ks,ha,Ko,dl,fl,pl,Jn,Wr,ua,Xr,$s,qr,Yr,Zr,da,Js,ns,is,El,Zi,Qs,pg,Cn,jr,In,jn,Qr,at,on,eo,fa,pa,_i,ma,ga,_a,an,xi,to,Qn,xa,ei,yi,ti,no,Zn,ya,cf,Wn,fi,Al,rs,Us,va,io,os,as,so,ml,ad,cd,ro,Rl,oo,ld,wr,gl,Cl,cn,cs,Il,Fi,vi,_l,ao,Ma,Ql,vg,eh,Mg,bg,Sg,wg,Tg,Eg,Ag,Pl,mt,kv,hd,ls,nh=Ft(()=>{dd=0,Dl=1,fd=2,Nl=1,ba=2,ni=3,kn=0,Gt=1,gt=2,Mi=0,Ki=1,Ul=2,Fl=3,Ol=4,pd=5,Li=100,md=101,gd=102,_d=103,xd=104,yd=200,vd=201,Md=202,bd=203,ea=204,ta=205,Sd=206,wd=207,Td=208,Ed=209,Ad=210,Rd=211,Cd=212,Id=213,Pd=214,Sa=0,wa=1,Ta=2,$i=3,Ea=4,Aa=5,Ra=6,Ca=7,Ia=0,Ld=1,Dd=2,bi=0,Nd=1,Ud=2,Fd=3,Od=4,Bd=5,Pa=6,zd=7,xl="attached",kd="detached",Bl=300,hs=301,us=302,er=303,La=304,co=306,gn=1e3,Tn=1001,Os=1002,kt=1003,Da=1004,ds=1005,Mt=1006,tr=1007,ln=1008,Xn=1009,zl=1010,kl=1011,nr=1012,Na=1013,Oi=1014,qt=1015,qn=1016,Ua=1017,Fa=1018,ir=1020,Vl=35902,Gl=35899,Hl=1021,Wl=1022,jt=1023,Bs=1026,sr=1027,Oa=1028,Ba=1029,Xl=1030,za=1031,ka=1033,lo=33776,ho=33777,uo=33778,fo=33779,Va=35840,Ga=35841,Ha=35842,Wa=35843,Xa=36196,qa=37492,Ya=37496,Za=37808,Ka=37809,$a=37810,Ja=37811,ja=37812,Qa=37813,ec=37814,tc=37815,nc=37816,ic=37817,sc=37818,rc=37819,oc=37820,ac=37821,cc=36492,lc=36494,hc=36495,uc=36283,dc=36284,fc=36285,pc=36286,Ji=2300,ji=2301,Qo=2302,yl=2400,vl=2401,Ml=2402,Vd=2500,ql=0,po=1,rr=2,Gd=3200,Hd=3201,mc=0,Wd=1,Si="",vt="srgb",Dt="srgb-linear",Ir="linear",ht="srgb",Yi=7680,bl=519,Xd=512,qd=513,Yd=514,Yl=515,Zd=516,Kd=517,$d=518,Jd=519,na=35044,Zl="300 es",zn=2e3,Pr=2001,gi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],wu=1234567,Er=Math.PI/180,Qi=180/Math.PI;At={DEG2RAD:Er,RAD2DEG:Qi,generateUUID:En,clamp:$e,euclideanModulo:Kl,mapLinear:tm,inverseLerp:nm,lerp:Ar,damp:im,pingpong:sm,smoothstep:rm,smootherstep:om,randInt:am,randFloat:cm,randFloatSpread:lm,seededRandom:hm,degToRad:um,radToDeg:dm,isPowerOfTwo:fm,ceilPowerOfTwo:pm,floorPowerOfTwo:mm,setQuaternionFromProperEuler:gm,normalize:lt,denormalize:Bn},he=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},nn=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],f=r[o+1],m=r[o+2],_=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=m,e[t+3]=_;return}if(u!==_||c!==d||l!==f||h!==m){let g=1-a,p=c*d+l*f+h*m+u*_,M=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){let S=Math.sqrt(y),E=Math.atan2(S,p*M);g=Math.sin(g*E)/S,a=Math.sin(a*E)/S}let x=a*M;if(c=c*g+d*x,l=l*g+f*x,h=h*g+m*x,u=u*g+_*x,g===1-a){let S=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=S,l*=S,h*=S,u*=S}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],m=r[o+3];return e[t]=a*m+h*u+c*f-l*d,e[t+1]=c*m+h*d+l*u-a*f,e[t+2]=l*m+h*f+a*d-c*u,e[t+3]=h*m-a*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),d=c(n/2),f=c(s/2),m=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u+d*f*m;break;case"YZX":this._x=d*h*u+l*f*m,this._y=l*f*u+d*h*m,this._z=l*h*m-d*f*u,this._w=l*h*u-d*f*m;break;case"XZY":this._x=d*h*u-l*f*m,this._y=l*f*u-d*h*m,this._z=l*h*m+d*f*u,this._w=l*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-t)*h)/l,d=Math.sin(t*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},P=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Tu.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Tu.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Gc.copy(this).projectOnVector(e),this.sub(Gc)}reflect(e){return this.sub(Gc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos($e(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Gc=new P,Tu=new nn,He=class i{constructor(e,t,n,s,r,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],_=s[0],g=s[3],p=s[6],M=s[1],y=s[4],x=s[7],S=s[2],E=s[5],C=s[8];return r[0]=o*_+a*M+c*S,r[3]=o*g+a*y+c*E,r[6]=o*p+a*x+c*C,r[1]=l*_+h*M+u*S,r[4]=l*g+h*y+u*E,r[7]=l*p+h*x+u*C,r[2]=d*_+f*M+m*S,r[5]=d*g+f*y+m*E,r[8]=d*p+f*x+m*C,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,m=t*u+n*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/m;return e[0]=u*_,e[1]=(s*l-h*n)*_,e[2]=(a*n-s*o)*_,e[3]=d*_,e[4]=(h*t-s*c)*_,e[5]=(s*r-a*t)*_,e[6]=f*_,e[7]=(n*c-l*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Hc.makeScale(e,t)),this}rotate(e){return this.premultiply(Hc.makeRotation(-e)),this}translate(e,t){return this.premultiply(Hc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Hc=new He;Eu={};Au=new He().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ru=new He().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);nt=_m();ia=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{bs===void 0&&(bs=zs("canvas")),bs.width=e.width,bs.height=e.height;let s=bs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=bs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=zs("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=mi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(mi(t[n]/255)*255):t[n]=mi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},xm=0,Vs=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:xm++}),this.uuid=En(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Wc(s[o].image)):r.push(Wc(s[o]))}else r=Wc(s);n.url=r}return t||(e.images[this.uuid]=n),n}};ym=0,Xc=new P,Bt=class i extends gi{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Tn,s=Tn,r=Mt,o=ln,a=jt,c=Xn,l=i.DEFAULT_ANISOTROPY,h=Si){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ym++}),this.uuid=En(),this.name="",this.source=new Vs(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new he(0,0),this.repeat=new he(1,1),this.center=new he(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new He,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Xc).x}get height(){return this.source.getSize(Xc).y}get depth(){return this.source.getSize(Xc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Bl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case gn:e.x=e.x-Math.floor(e.x);break;case Tn:e.x=e.x<0?0:1;break;case Os:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case gn:e.y=e.y-Math.floor(e.y);break;case Tn:e.y=e.y<0?0:1;break;case Os:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Bt.DEFAULT_IMAGE=null;Bt.DEFAULT_MAPPING=Bl;Bt.DEFAULT_ANISOTROPY=1;st=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],m=c[9],_=c[2],g=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(m+g)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let y=(l+1)/2,x=(f+1)/2,S=(p+1)/2,E=(h+d)/4,C=(u+_)/4,I=(m+g)/4;return y>x&&y>S?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=E/n,r=C/n):x>S?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=E/s,r=I/s):S<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),n=C/r,s=I/r),this.set(n,s,r,t),this}let M=Math.sqrt((g-m)*(g-m)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(g-m)/M,this.y=(u-_)/M,this.z=(d-h)/M,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=$e(this.x,e.x,t.x),this.y=$e(this.y,e.y,t.y),this.z=$e(this.z,e.z,t.z),this.w=$e(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=$e(this.x,e,t),this.y=$e(this.y,e,t),this.z=$e(this.z,e,t),this.w=$e(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar($e(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},sa=class extends gi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new st(0,0,e,t),this.scissorTest=!1,this.viewport=new st(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new Bt(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Mt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Vs(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Kn=class extends sa{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Lr=class extends Bt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=kt,this.minFilter=kt,this.wrapR=Tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},ra=class extends Bt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=kt,this.minFilter=kt,this.wrapR=Tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Vt=class{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Un):Un.fromBufferAttribute(r,o),Un.applyMatrix4(e.matrixWorld),this.expandByPoint(Un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Eo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Eo.copy(n.boundingBox)),Eo.applyMatrix4(e.matrixWorld),this.union(Eo)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Un),Un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(_r),Ao.subVectors(this.max,_r),Ss.subVectors(e.a,_r),ws.subVectors(e.b,_r),Ts.subVectors(e.c,_r),Ti.subVectors(ws,Ss),Ei.subVectors(Ts,ws),Hi.subVectors(Ss,Ts);let t=[0,-Ti.z,Ti.y,0,-Ei.z,Ei.y,0,-Hi.z,Hi.y,Ti.z,0,-Ti.x,Ei.z,0,-Ei.x,Hi.z,0,-Hi.x,-Ti.y,Ti.x,0,-Ei.y,Ei.x,0,-Hi.y,Hi.x,0];return!qc(t,Ss,ws,Ts,Ao)||(t=[1,0,0,0,1,0,0,0,1],!qc(t,Ss,ws,Ts,Ao))?!1:(Ro.crossVectors(Ti,Ei),t=[Ro.x,Ro.y,Ro.z],qc(t,Ss,ws,Ts,Ao))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ci[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ci[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ci[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ci[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ci[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ci[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ci[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ci[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ci),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ci=[new P,new P,new P,new P,new P,new P,new P,new P],Un=new P,Eo=new Vt,Ss=new P,ws=new P,Ts=new P,Ti=new P,Ei=new P,Hi=new P,_r=new P,Ao=new P,Ro=new P,Wi=new P;vm=new Vt,xr=new P,Yc=new P,sn=class{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):vm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;xr.subVectors(e,this.center);let t=xr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(xr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Yc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(xr.copy(e.center).add(Yc)),this.expandByPoint(xr.copy(e.center).sub(Yc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},li=new P,Zc=new P,Co=new P,Ai=new P,Kc=new P,Io=new P,$c=new P,Di=class{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,li)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=li.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(li.copy(this.origin).addScaledVector(this.direction,t),li.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Zc.copy(e).add(t).multiplyScalar(.5),Co.copy(t).sub(e).normalize(),Ai.copy(this.origin).sub(Zc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Co),a=Ai.dot(this.direction),c=-Ai.dot(Co),l=Ai.lengthSq(),h=Math.abs(1-o*o),u,d,f,m;if(h>0)if(u=o*c-a,d=o*a-c,m=r*h,u>=0)if(d>=-m)if(d<=m){let _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-m?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=m?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Zc).addScaledVector(Co,d),f}intersectSphere(e,t){li.subVectors(e.center,this.origin);let n=li.dot(this.direction),s=li.dot(li)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,s=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,s=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,li)!==null}intersectTriangle(e,t,n,s,r){Kc.subVectors(t,e),Io.subVectors(n,e),$c.crossVectors(Kc,Io);let o=this.direction.dot($c),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ai.subVectors(this.origin,e);let c=a*this.direction.dot(Io.crossVectors(Ai,Io));if(c<0)return null;let l=a*this.direction.dot(Kc.cross(Ai));if(l<0||c+l>o)return null;let h=-a*Ai.dot($c);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Be=class i{constructor(e,t,n,s,r,o,a,c,l,h,u,d,f,m,_,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,h,u,d,f,m,_,g)}set(e,t,n,s,r,o,a,c,l,h,u,d,f,m,_,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=_,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Es.setFromMatrixColumn(e,0).length(),r=1/Es.setFromMatrixColumn(e,1).length(),o=1/Es.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,f=o*u,m=a*h,_=a*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=f+m*l,t[5]=d-_*l,t[9]=-a*c,t[2]=_-d*l,t[6]=m+f*l,t[10]=o*c}else if(e.order==="YXZ"){let d=c*h,f=c*u,m=l*h,_=l*u;t[0]=d+_*a,t[4]=m*a-f,t[8]=o*l,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-m,t[6]=_+d*a,t[10]=o*c}else if(e.order==="ZXY"){let d=c*h,f=c*u,m=l*h,_=l*u;t[0]=d-_*a,t[4]=-o*u,t[8]=m+f*a,t[1]=f+m*a,t[5]=o*h,t[9]=_-d*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){let d=o*h,f=o*u,m=a*h,_=a*u;t[0]=c*h,t[4]=m*l-f,t[8]=d*l+_,t[1]=c*u,t[5]=_*l+d,t[9]=f*l-m,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){let d=o*c,f=o*l,m=a*c,_=a*l;t[0]=c*h,t[4]=_-d*u,t[8]=m*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=f*u+m,t[10]=d-_*u}else if(e.order==="XZY"){let d=o*c,f=o*l,m=a*c,_=a*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+_,t[5]=o*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=a*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Mm,e,bm)}lookAt(e,t,n){let s=this.elements;return pn.subVectors(e,t),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),Ri.crossVectors(n,pn),Ri.lengthSq()===0&&(Math.abs(n.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),Ri.crossVectors(n,pn)),Ri.normalize(),Po.crossVectors(pn,Ri),s[0]=Ri.x,s[4]=Po.x,s[8]=pn.x,s[1]=Ri.y,s[5]=Po.y,s[9]=pn.y,s[2]=Ri.z,s[6]=Po.z,s[10]=pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],_=n[6],g=n[10],p=n[14],M=n[3],y=n[7],x=n[11],S=n[15],E=s[0],C=s[4],I=s[8],w=s[12],b=s[1],L=s[5],z=s[9],F=s[13],A=s[2],U=s[6],N=s[10],q=s[14],O=s[3],ee=s[7],ie=s[11],de=s[15];return r[0]=o*E+a*b+c*A+l*O,r[4]=o*C+a*L+c*U+l*ee,r[8]=o*I+a*z+c*N+l*ie,r[12]=o*w+a*F+c*q+l*de,r[1]=h*E+u*b+d*A+f*O,r[5]=h*C+u*L+d*U+f*ee,r[9]=h*I+u*z+d*N+f*ie,r[13]=h*w+u*F+d*q+f*de,r[2]=m*E+_*b+g*A+p*O,r[6]=m*C+_*L+g*U+p*ee,r[10]=m*I+_*z+g*N+p*ie,r[14]=m*w+_*F+g*q+p*de,r[3]=M*E+y*b+x*A+S*O,r[7]=M*C+y*L+x*U+S*ee,r[11]=M*I+y*z+x*N+S*ie,r[15]=M*w+y*F+x*q+S*de,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],_=e[7],g=e[11],p=e[15];return m*(+r*c*u-s*l*u-r*a*d+n*l*d+s*a*f-n*c*f)+_*(+t*c*f-t*l*d+r*o*d-s*o*f+s*l*h-r*c*h)+g*(+t*l*u-t*a*f-r*o*u+n*o*f+r*a*h-n*l*h)+p*(-s*a*h-t*c*u+t*a*d+s*o*u-n*o*d+n*c*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],_=e[13],g=e[14],p=e[15],M=u*g*l-_*d*l+_*c*f-a*g*f-u*c*p+a*d*p,y=m*d*l-h*g*l-m*c*f+o*g*f+h*c*p-o*d*p,x=h*_*l-m*u*l+m*a*f-o*_*f-h*a*p+o*u*p,S=m*u*c-h*_*c-m*a*d+o*_*d+h*a*g-o*u*g,E=t*M+n*y+s*x+r*S;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/E;return e[0]=M*C,e[1]=(_*d*r-u*g*r-_*s*f+n*g*f+u*s*p-n*d*p)*C,e[2]=(a*g*r-_*c*r+_*s*l-n*g*l-a*s*p+n*c*p)*C,e[3]=(u*c*r-a*d*r-u*s*l+n*d*l+a*s*f-n*c*f)*C,e[4]=y*C,e[5]=(h*g*r-m*d*r+m*s*f-t*g*f-h*s*p+t*d*p)*C,e[6]=(m*c*r-o*g*r-m*s*l+t*g*l+o*s*p-t*c*p)*C,e[7]=(o*d*r-h*c*r+h*s*l-t*d*l-o*s*f+t*c*f)*C,e[8]=x*C,e[9]=(m*u*r-h*_*r-m*n*f+t*_*f+h*n*p-t*u*p)*C,e[10]=(o*_*r-m*a*r+m*n*l-t*_*l-o*n*p+t*a*p)*C,e[11]=(h*a*r-o*u*r-h*n*l+t*u*l+o*n*f-t*a*f)*C,e[12]=S*C,e[13]=(h*_*s-m*u*s+m*n*d-t*_*d-h*n*g+t*u*g)*C,e[14]=(m*a*s-o*_*s-m*n*c+t*_*c+o*n*g-t*a*g)*C,e[15]=(o*u*s-h*a*s+h*n*c-t*u*c-o*n*d+t*a*d)*C,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,m=r*u,_=o*h,g=o*u,p=a*u,M=c*l,y=c*h,x=c*u,S=n.x,E=n.y,C=n.z;return s[0]=(1-(_+p))*S,s[1]=(f+x)*S,s[2]=(m-y)*S,s[3]=0,s[4]=(f-x)*E,s[5]=(1-(d+p))*E,s[6]=(g+M)*E,s[7]=0,s[8]=(m+y)*C,s[9]=(g-M)*C,s[10]=(1-(d+_))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Es.set(s[0],s[1],s[2]).length(),o=Es.set(s[4],s[5],s[6]).length(),a=Es.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Fn.copy(this);let l=1/r,h=1/o,u=1/a;return Fn.elements[0]*=l,Fn.elements[1]*=l,Fn.elements[2]*=l,Fn.elements[4]*=h,Fn.elements[5]*=h,Fn.elements[6]*=h,Fn.elements[8]*=u,Fn.elements[9]*=u,Fn.elements[10]*=u,t.setFromRotationMatrix(Fn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=zn,c=!1){let l=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),f=(n+s)/(n-s),m,_;if(c)m=r/(o-r),_=o*r/(o-r);else if(a===zn)m=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===Pr)m=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=zn,c=!1){let l=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),f=-(n+s)/(n-s),m,_;if(c)m=1/(o-r),_=o/(o-r);else if(a===zn)m=-2/(o-r),_=-(o+r)/(o-r);else if(a===Pr)m=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Es=new P,Fn=new Be,Mm=new P(0,0,0),bm=new P(1,1,1),Ri=new P,Po=new P,pn=new P,Cu=new Be,Iu=new nn,rn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin($e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin($e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin($e(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-$e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Cu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Cu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Iu.setFromEuler(this),this.setFromQuaternion(Iu,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};rn.DEFAULT_ORDER="XYZ";Gs=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Sm=0,Pu=new P,As=new nn,hi=new Be,Lo=new P,yr=new P,wm=new P,Tm=new nn,Lu=new P(1,0,0),Du=new P(0,1,0),Nu=new P(0,0,1),Uu={type:"added"},Em={type:"removed"},Rs={type:"childadded",child:null},Jc={type:"childremoved",child:null},Qe=class i extends gi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Sm++}),this.uuid=En(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new P,t=new rn,n=new nn,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Be},normalMatrix:{value:new He}}),this.matrix=new Be,this.matrixWorld=new Be,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Gs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return As.setFromAxisAngle(e,t),this.quaternion.multiply(As),this}rotateOnWorldAxis(e,t){return As.setFromAxisAngle(e,t),this.quaternion.premultiply(As),this}rotateX(e){return this.rotateOnAxis(Lu,e)}rotateY(e){return this.rotateOnAxis(Du,e)}rotateZ(e){return this.rotateOnAxis(Nu,e)}translateOnAxis(e,t){return Pu.copy(e).applyQuaternion(this.quaternion),this.position.add(Pu.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Lu,e)}translateY(e){return this.translateOnAxis(Du,e)}translateZ(e){return this.translateOnAxis(Nu,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(hi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Lo.copy(e):Lo.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),yr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hi.lookAt(yr,Lo,this.up):hi.lookAt(Lo,yr,this.up),this.quaternion.setFromRotationMatrix(hi),s&&(hi.extractRotation(s.matrixWorld),As.setFromRotationMatrix(hi),this.quaternion.premultiply(As.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Uu),Rs.child=e,this.dispatchEvent(Rs),Rs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Em),Jc.child=e,this.dispatchEvent(Jc),Jc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),hi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),hi.multiply(e.parent.matrixWorld)),e.applyMatrix4(hi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Uu),Rs.child=e,this.dispatchEvent(Rs),Rs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(yr,e,wm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(yr,Tm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){let a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),m=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Qe.DEFAULT_UP=new P(0,1,0);Qe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Qe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;On=new P,ui=new P,jc=new P,di=new P,Cs=new P,Is=new P,Fu=new P,Qc=new P,el=new P,tl=new P,nl=new st,il=new st,sl=new st,Pi=class i{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),On.subVectors(e,t),s.cross(On);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){On.subVectors(s,t),ui.subVectors(n,t),jc.subVectors(e,t);let o=On.dot(On),a=On.dot(ui),c=On.dot(jc),l=ui.dot(ui),h=ui.dot(jc),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(l*c-a*h)*d,m=(o*h-a*c)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,di)===null?!1:di.x>=0&&di.y>=0&&di.x+di.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,di)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,di.x),c.addScaledVector(o,di.y),c.addScaledVector(a,di.z),c)}static getInterpolatedAttribute(e,t,n,s,r,o){return nl.setScalar(0),il.setScalar(0),sl.setScalar(0),nl.fromBufferAttribute(e,t),il.fromBufferAttribute(e,n),sl.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(nl,r.x),o.addScaledVector(il,r.y),o.addScaledVector(sl,r.z),o}static isFrontFacing(e,t,n,s){return On.subVectors(n,t),ui.subVectors(e,t),On.cross(ui).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return On.subVectors(this.c,this.b),ui.subVectors(this.a,this.b),On.cross(ui).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;Cs.subVectors(s,n),Is.subVectors(r,n),Qc.subVectors(e,n);let c=Cs.dot(Qc),l=Is.dot(Qc);if(c<=0&&l<=0)return t.copy(n);el.subVectors(e,s);let h=Cs.dot(el),u=Is.dot(el);if(h>=0&&u<=h)return t.copy(s);let d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(Cs,o);tl.subVectors(e,r);let f=Cs.dot(tl),m=Is.dot(tl);if(m>=0&&f<=m)return t.copy(r);let _=f*l-c*m;if(_<=0&&l>=0&&m<=0)return a=l/(l-m),t.copy(n).addScaledVector(Is,a);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return Fu.subVectors(r,s),a=(u-h)/(u-h+(f-m)),t.copy(s).addScaledVector(Fu,a);let p=1/(g+_+d);return o=_*p,a=d*p,t.copy(n).addScaledVector(Cs,o).addScaledVector(Is,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},ef={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ci={h:0,s:0,l:0},Do={h:0,s:0,l:0};Ee=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=vt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=nt.workingColorSpace){return this.r=e,this.g=t,this.b=n,nt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=nt.workingColorSpace){if(e=Kl(e,1),t=$e(t,0,1),n=$e(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=rl(o,r,e+1/3),this.g=rl(o,r,e),this.b=rl(o,r,e-1/3)}return nt.colorSpaceToWorking(this,s),this}setStyle(e,t=vt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=vt){let n=ef[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=mi(e.r),this.g=mi(e.g),this.b=mi(e.b),this}copyLinearToSRGB(e){return this.r=Fs(e.r),this.g=Fs(e.g),this.b=Fs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=vt){return nt.workingToColorSpace(Xt.copy(this),e),Math.round($e(Xt.r*255,0,255))*65536+Math.round($e(Xt.g*255,0,255))*256+Math.round($e(Xt.b*255,0,255))}getHexString(e=vt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.workingToColorSpace(Xt.copy(this),t);let n=Xt.r,s=Xt.g,r=Xt.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=nt.workingColorSpace){return nt.workingToColorSpace(Xt.copy(this),t),e.r=Xt.r,e.g=Xt.g,e.b=Xt.b,e}getStyle(e=vt){nt.workingToColorSpace(Xt.copy(this),e);let t=Xt.r,n=Xt.g,s=Xt.b;return e!==vt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Ci),this.setHSL(Ci.h+e,Ci.s+t,Ci.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ci),e.getHSL(Do);let n=Ar(Ci.h,Do.h,t),s=Ar(Ci.s,Do.s,t),r=Ar(Ci.l,Do.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Xt=new Ee;Ee.NAMES=ef;Am=0,Jt=class extends gi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Am++}),this.uuid=En(),this.name="",this.type="Material",this.blending=Ki,this.side=kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ea,this.blendDst=ta,this.blendEquation=Li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ee(0,0,0),this.blendAlpha=0,this.depthFunc=$i,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=bl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yi,this.stencilZFail=Yi,this.stencilZPass=Yi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ki&&(n.blending=this.blending),this.side!==kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ea&&(n.blendSrc=this.blendSrc),this.blendDst!==ta&&(n.blendDst=this.blendDst),this.blendEquation!==Li&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==$i&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==bl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Yi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Yi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Yi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Et=class extends Jt{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new rn,this.combine=Ia,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},pi=Rm();Ni=class{static toHalfFloat(e){return Cm(e)}static fromHalfFloat(e){return Im(e)}},It=new P,No=new he,Pm=0,ft=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Pm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=na,this.updateRanges=[],this.gpuType=qt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)No.fromBufferAttribute(this,t),No.applyMatrix3(e),this.setXY(t,No.x,No.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyMatrix3(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyMatrix4(e),this.setXYZ(t,It.x,It.y,It.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.applyNormalMatrix(e),this.setXYZ(t,It.x,It.y,It.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)It.fromBufferAttribute(this,t),It.transformDirection(e),this.setXYZ(t,It.x,It.y,It.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=lt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Bn(t,this.array)),t}setX(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Bn(t,this.array)),t}setY(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Bn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Bn(t,this.array)),t}setW(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array),r=lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==na&&(e.usage=this.usage),e}},Dr=class extends ft{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Nr=class extends ft{constructor(e,t,n){super(new Uint32Array(e),t,n)}},je=class extends ft{constructor(e,t,n){super(new Float32Array(e),t,n)}},Lm=0,Sn=new Be,ol=new Qe,Ps=new P,mn=new Vt,vr=new Vt,Ot=new P,ot=class i extends gi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Lm++}),this.uuid=En(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new($l(e)?Nr:Dr)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new He().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Sn.makeRotationFromQuaternion(e),this.applyMatrix4(Sn),this}rotateX(e){return Sn.makeRotationX(e),this.applyMatrix4(Sn),this}rotateY(e){return Sn.makeRotationY(e),this.applyMatrix4(Sn),this}rotateZ(e){return Sn.makeRotationZ(e),this.applyMatrix4(Sn),this}translate(e,t,n){return Sn.makeTranslation(e,t,n),this.applyMatrix4(Sn),this}scale(e,t,n){return Sn.makeScale(e,t,n),this.applyMatrix4(Sn),this}lookAt(e){return ol.lookAt(e),ol.updateMatrix(),this.applyMatrix4(ol.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ps).negate(),this.translate(Ps.x,Ps.y,Ps.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new je(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];mn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ot.addVectors(this.boundingBox.min,mn.min),this.boundingBox.expandByPoint(Ot),Ot.addVectors(this.boundingBox.max,mn.max),this.boundingBox.expandByPoint(Ot)):(this.boundingBox.expandByPoint(mn.min),this.boundingBox.expandByPoint(mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new sn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let n=this.boundingSphere.center;if(mn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];vr.setFromBufferAttribute(a),this.morphTargetsRelative?(Ot.addVectors(mn.min,vr.min),mn.expandByPoint(Ot),Ot.addVectors(mn.max,vr.max),mn.expandByPoint(Ot)):(mn.expandByPoint(vr.min),mn.expandByPoint(vr.max))}mn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Ot.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Ot));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Ot.fromBufferAttribute(a,l),c&&(Ps.fromBufferAttribute(e,l),Ot.add(Ps)),s=Math.max(s,n.distanceToSquared(Ot))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ft(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let I=0;I<n.count;I++)a[I]=new P,c[I]=new P;let l=new P,h=new P,u=new P,d=new he,f=new he,m=new he,_=new P,g=new P;function p(I,w,b){l.fromBufferAttribute(n,I),h.fromBufferAttribute(n,w),u.fromBufferAttribute(n,b),d.fromBufferAttribute(r,I),f.fromBufferAttribute(r,w),m.fromBufferAttribute(r,b),h.sub(l),u.sub(l),f.sub(d),m.sub(d);let L=1/(f.x*m.y-m.x*f.y);isFinite(L)&&(_.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(L),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(L),a[I].add(_),a[w].add(_),a[b].add(_),c[I].add(g),c[w].add(g),c[b].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let I=0,w=M.length;I<w;++I){let b=M[I],L=b.start,z=b.count;for(let F=L,A=L+z;F<A;F+=3)p(e.getX(F+0),e.getX(F+1),e.getX(F+2))}let y=new P,x=new P,S=new P,E=new P;function C(I){S.fromBufferAttribute(s,I),E.copy(S);let w=a[I];y.copy(w),y.sub(S.multiplyScalar(S.dot(w))).normalize(),x.crossVectors(E,w);let L=x.dot(c[I])<0?-1:1;o.setXYZW(I,y.x,y.y,y.z,L)}for(let I=0,w=M.length;I<w;++I){let b=M[I],L=b.start,z=b.count;for(let F=L,A=L+z;F<A;F+=3)C(e.getX(F+0)),C(e.getX(F+1)),C(e.getX(F+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ft(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new P,r=new P,o=new P,a=new P,c=new P,l=new P,h=new P,u=new P;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),_=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,g),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,m),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,g),a.add(h),c.add(h),l.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(g,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ot.fromBufferAttribute(e,t),Ot.normalize(),e.setXYZ(t,Ot.x,Ot.y,Ot.z)}toNonIndexed(){function e(a,c){let l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h),f=0,m=0;for(let _=0,g=c.length;_<g;_++){a.isInterleavedBufferAttribute?f=c[_]*a.data.stride+a.offset:f=c[_]*h;for(let p=0;p<h;p++)d[m++]=l[f++]}return new ft(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=e(c,n);t.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){let d=l[h],f=e(d,n);c.push(f)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let c in n){let l=n[c];e.data.attributes[c]=l.toJSON(e.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){let f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(t))}let r=e.morphAttributes;for(let l in r){let h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let l=0,h=o.length;l<h;l++){let u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ou=new Be,Xi=new Di,Uo=new sn,Bu=new P,Fo=new P,Oo=new P,Bo=new P,al=new P,zo=new P,zu=new P,ko=new P,qe=class extends Qe{constructor(e=new ot,t=new Et){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){zo.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],u=r[c];h!==0&&(al.fromBufferAttribute(u,e),o?zo.addScaledVector(al,h):zo.addScaledVector(al.sub(t),h))}t.add(zo)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Uo.copy(n.boundingSphere),Uo.applyMatrix4(r),Xi.copy(e.ray).recast(e.near),!(Uo.containsPoint(Xi.origin)===!1&&(Xi.intersectSphere(Uo,Bu)===null||Xi.origin.distanceToSquared(Bu)>(e.far-e.near)**2))&&(Ou.copy(r).invert(),Xi.copy(e.ray).applyMatrix4(Ou),!(n.boundingBox!==null&&Xi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Xi)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){let g=d[m],p=o[g.materialIndex],M=Math.max(g.start,f.start),y=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let x=M,S=y;x<S;x+=3){let E=a.getX(x),C=a.getX(x+1),I=a.getX(x+2);s=Vo(this,p,e,n,l,h,u,E,C,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){let M=a.getX(g),y=a.getX(g+1),x=a.getX(g+2);s=Vo(this,o,e,n,l,h,u,M,y,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let m=0,_=d.length;m<_;m++){let g=d[m],p=o[g.materialIndex],M=Math.max(g.start,f.start),y=Math.min(c.count,Math.min(g.start+g.count,f.start+f.count));for(let x=M,S=y;x<S;x+=3){let E=x,C=x+1,I=x+2;s=Vo(this,p,e,n,l,h,u,E,C,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let g=m,p=_;g<p;g+=3){let M=g,y=g+1,x=g+2;s=Vo(this,o,e,n,l,h,u,M,y,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};zt=class i extends ot{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,t,e,o,r,0),m("z","y","x",1,-1,n,t,-e,o,r,1),m("x","z","y",1,1,e,n,t,s,o,2),m("x","z","y",1,-1,e,n,-t,s,o,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new je(l,3)),this.setAttribute("normal",new je(h,3)),this.setAttribute("uv",new je(u,2));function m(_,g,p,M,y,x,S,E,C,I,w){let b=x/C,L=S/I,z=x/2,F=S/2,A=E/2,U=C+1,N=I+1,q=0,O=0,ee=new P;for(let ie=0;ie<N;ie++){let de=ie*L-F;for(let we=0;we<U;we++){let G=we*b-z;ee[_]=G*M,ee[g]=de*y,ee[p]=A,l.push(ee.x,ee.y,ee.z),ee[_]=0,ee[g]=0,ee[p]=E>0?1:-1,h.push(ee.x,ee.y,ee.z),u.push(we/C),u.push(1-ie/I),q+=1}}for(let ie=0;ie<I;ie++)for(let de=0;de<C;de++){let we=d+de+U*ie,G=d+de+U*(ie+1),re=d+(de+1)+U*(ie+1),oe=d+(de+1)+U*ie;c.push(we,G,oe),c.push(G,re,oe),O+=6}a.addGroup(f,O,w),f+=O,d+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};tf={clone:fs,merge:Yt},Um=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Fm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Vn=class extends Jt{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Um,this.fragmentShader=Fm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=fs(e.uniforms),this.uniformsGroups=Nm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Ur=class extends Qe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Be,this.projectionMatrix=new Be,this.projectionMatrixInverse=new Be,this.coordinateSystem=zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ii=new P,ku=new he,Vu=new he,Pt=class extends Ur{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Qi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Er*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Qi*2*Math.atan(Math.tan(Er*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ii.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ii.x,Ii.y).multiplyScalar(-e/Ii.z),Ii.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ii.x,Ii.y).multiplyScalar(-e/Ii.z)}getViewSize(e,t){return this.getViewBounds(e,ku,Vu),t.subVectors(Vu,ku)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Er*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ls=-90,Ds=1,oa=class extends Qe{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Pt(Ls,Ds,e,t);s.layers=this.layers,this.add(s);let r=new Pt(Ls,Ds,e,t);r.layers=this.layers,this.add(r);let o=new Pt(Ls,Ds,e,t);o.layers=this.layers,this.add(o);let a=new Pt(Ls,Ds,e,t);a.layers=this.layers,this.add(a);let c=new Pt(Ls,Ds,e,t);c.layers=this.layers,this.add(c);let l=new Pt(Ls,Ds,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(let l of t)this.remove(l);if(e===zn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Pr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},Fr=class extends Bt{constructor(e=[],t=hs,n,s,r,o,a,c,l,h){super(e,t,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},aa=class extends Kn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Fr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new zt(5,5,5),r=new Vn({name:"CubemapFromEquirect",uniforms:fs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Gt,blending:Mi});r.uniforms.tEquirect.value=t;let o=new qe(s,r),a=t.minFilter;return t.minFilter===ln&&(t.minFilter=Mt),new oa(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},ye=class extends Qe{constructor(){super(),this.isGroup=!0,this.type="Group"}},Om={type:"move"},Hs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ye,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ye,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ye,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(let _ of e.hand.values()){let g=t.getJointPose(_,n),p=this._getHandJoint(l,_);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;l.inputState.pinching&&d>f+m?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-m&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Om)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ye;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Or=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ee(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}},es=class extends Qe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new rn,this.environmentIntensity=1,this.environmentRotation=new rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Ws=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=na,this.updateRanges=[],this.version=0,this.uuid=En()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=En()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=En()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},$t=new P,Xs=class i{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyMatrix4(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.applyNormalMatrix(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)$t.fromBufferAttribute(this,t),$t.transformDirection(e),this.setXYZ(t,$t.x,$t.y,$t.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=lt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Bn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Bn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Bn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Bn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),s=lt(s,this.array),r=lt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new ft(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new i(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Gu=new P,Hu=new st,Wu=new st,Bm=new P,Xu=new Be,Go=new P,cl=new sn,qu=new Be,ll=new Di,Br=class extends qe{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=xl,this.bindMatrix=new Be,this.bindMatrixInverse=new Be,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Vt),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Go),this.boundingBox.expandByPoint(Go)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new sn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Go),this.boundingSphere.expandByPoint(Go)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),cl.copy(this.boundingSphere),cl.applyMatrix4(s),e.ray.intersectsSphere(cl)!==!1&&(qu.copy(s).invert(),ll.copy(e.ray).applyMatrix4(qu),!(this.boundingBox!==null&&ll.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,ll)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new st,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===xl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===kd?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,s=this.geometry;Hu.fromBufferAttribute(s.attributes.skinIndex,e),Wu.fromBufferAttribute(s.attributes.skinWeight,e),Gu.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let o=Wu.getComponent(r);if(o!==0){let a=Hu.getComponent(r);Xu.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(Bm.copy(Gu).applyMatrix4(Xu),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},qs=class extends Qe{constructor(){super(),this.isBone=!0,this.type="Bone"}},An=class extends Bt{constructor(e=null,t=1,n=1,s,r,o,a,c,l=kt,h=kt,u,d){super(null,o,a,c,l,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Yu=new Be,zm=new Be,zr=class i{constructor(e=[],t=[]){this.uuid=En(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Be)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Be;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:zm;Yu.multiplyMatrices(a,t[r]),Yu.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new An(t,e,e,jt,qt);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){let r=e.bones[n],o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new qs),this.bones.push(o),this.boneInverses.push(new Be().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){let o=t[s];e.bones.push(o.uuid);let a=n[s];e.boneInverses.push(a.toArray())}return e}},Ui=class extends ft{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ns=new Be,Zu=new Be,Ho=[],Ku=new Vt,km=new Be,Mr=new qe,br=new sn,Lt=class extends qe{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ui(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,km)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Vt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ns),Ku.copy(e.boundingBox).applyMatrix4(Ns),this.boundingBox.union(Ku)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new sn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ns),br.copy(e.boundingSphere).applyMatrix4(Ns),this.boundingSphere.union(br)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(Mr.geometry=this.geometry,Mr.material=this.material,Mr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),br.copy(this.boundingSphere),br.applyMatrix4(n),e.ray.intersectsSphere(br)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ns),Zu.multiplyMatrices(n,Ns),Mr.matrixWorld=Zu,Mr.raycast(e,Ho);for(let o=0,a=Ho.length;o<a;o++){let c=Ho[o];c.instanceId=r,c.object=this,t.push(c)}Ho.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ui(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new An(new Float32Array(s*this.count),s,this.count,Oa,qt));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<n.length;l++)o+=n[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},hl=new P,Vm=new P,Gm=new He,wn=class{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=hl.subVectors(n,t).cross(Vm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(hl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Gm.getNormalMatrix(e),s=this.coplanarPoint(hl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},qi=new sn,Hm=new he(.5,.5),Wo=new P,Ys=class{constructor(e=new wn,t=new wn,n=new wn,s=new wn,r=new wn,o=new wn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=zn,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],u=r[5],d=r[6],f=r[7],m=r[8],_=r[9],g=r[10],p=r[11],M=r[12],y=r[13],x=r[14],S=r[15];if(s[0].setComponents(l-o,f-h,p-m,S-M).normalize(),s[1].setComponents(l+o,f+h,p+m,S+M).normalize(),s[2].setComponents(l+a,f+u,p+_,S+y).normalize(),s[3].setComponents(l-a,f-u,p-_,S-y).normalize(),n)s[4].setComponents(c,d,g,x).normalize(),s[5].setComponents(l-c,f-d,p-g,S-x).normalize();else if(s[4].setComponents(l-c,f-d,p-g,S-x).normalize(),t===zn)s[5].setComponents(l+c,f+d,p+g,S+x).normalize();else if(t===Pr)s[5].setComponents(c,d,g,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),qi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),qi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(qi)}intersectsSprite(e){qi.center.set(0,0,0);let t=Hm.distanceTo(e.center);return qi.radius=.7071067811865476+t,qi.applyMatrix4(e.matrixWorld),this.intersectsSphere(qi)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(Wo.x=s.normal.x>0?e.max.x:e.min.x,Wo.y=s.normal.y>0?e.max.y:e.min.y,Wo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Wo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Gn=class extends Jt{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ee(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},ca=new P,la=new P,$u=new Be,Sr=new Di,Xo=new sn,ul=new P,Ju=new P,Hn=class extends Qe{constructor(e=new ot,t=new Gn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)ca.fromBufferAttribute(t,s-1),la.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=ca.distanceTo(la);e.setAttribute("lineDistance",new je(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Xo.copy(n.boundingSphere),Xo.applyMatrix4(s),Xo.radius+=r,e.ray.intersectsSphere(Xo)===!1)return;$u.copy(s).invert(),Sr.copy(e.ray).applyMatrix4($u);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let _=f,g=m-1;_<g;_+=l){let p=h.getX(_),M=h.getX(_+1),y=qo(this,e,Sr,c,p,M,_);y&&t.push(y)}if(this.isLineLoop){let _=h.getX(m-1),g=h.getX(f),p=qo(this,e,Sr,c,_,g,m-1);p&&t.push(p)}}else{let f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let _=f,g=m-1;_<g;_+=l){let p=qo(this,e,Sr,c,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){let _=qo(this,e,Sr,c,m-1,f,m-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};ju=new P,Qu=new P,ts=class extends Hn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)ju.fromBufferAttribute(t,s),Qu.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+ju.distanceTo(Qu);e.setAttribute("lineDistance",new je(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},kr=class extends Hn{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},_n=class extends Jt{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ee(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},ed=new Be,Sl=new Di,Yo=new sn,Zo=new P,Rn=class extends Qe{constructor(e=new ot,t=new _n){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Yo.copy(n.boundingSphere),Yo.applyMatrix4(s),Yo.radius+=r,e.ray.intersectsSphere(Yo)===!1)return;ed.copy(s).invert(),Sl.copy(e.ray).applyMatrix4(ed);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){let d=Math.max(0,o.start),f=Math.min(l.count,o.start+o.count);for(let m=d,_=f;m<_;m++){let g=l.getX(m);Zo.fromBufferAttribute(u,g),td(Zo,g,c,s,e,t,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let m=d,_=f;m<_;m++)Zo.fromBufferAttribute(u,m),td(Zo,m,c,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};Vr=class extends Bt{constructor(e,t,n=Oi,s,r,o,a=kt,c=kt,l,h=Bs,u=1){if(h!==Bs&&h!==sr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Vs(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Gr=class extends Bt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Zs=class i extends ot{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],c=[],l=new P,h=new he;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*s;l.x=e*Math.cos(f),l.y=e*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new je(o,3)),this.setAttribute("normal",new je(a,3)),this.setAttribute("uv",new je(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},$n=class i extends ot{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,_=[],g=n/2,p=0;M(),o===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new je(u,3)),this.setAttribute("normal",new je(d,3)),this.setAttribute("uv",new je(f,2));function M(){let x=new P,S=new P,E=0,C=(t-e)/n;for(let I=0;I<=r;I++){let w=[],b=I/r,L=b*(t-e)+e;for(let z=0;z<=s;z++){let F=z/s,A=F*c+a,U=Math.sin(A),N=Math.cos(A);S.x=L*U,S.y=-b*n+g,S.z=L*N,u.push(S.x,S.y,S.z),x.set(U,C,N).normalize(),d.push(x.x,x.y,x.z),f.push(F,1-b),w.push(m++)}_.push(w)}for(let I=0;I<s;I++)for(let w=0;w<r;w++){let b=_[w][I],L=_[w+1][I],z=_[w+1][I+1],F=_[w][I+1];(e>0||w!==0)&&(h.push(b,L,F),E+=3),(t>0||w!==r-1)&&(h.push(L,z,F),E+=3)}l.addGroup(p,E,0),p+=E}function y(x){let S=m,E=new he,C=new P,I=0,w=x===!0?e:t,b=x===!0?1:-1;for(let z=1;z<=s;z++)u.push(0,g*b,0),d.push(0,b,0),f.push(.5,.5),m++;let L=m;for(let z=0;z<=s;z++){let A=z/s*c+a,U=Math.cos(A),N=Math.sin(A);C.x=w*N,C.y=g*b,C.z=w*U,u.push(C.x,C.y,C.z),d.push(0,b,0),E.x=U*.5+.5,E.y=N*.5*b+.5,f.push(E.x,E.y),m++}for(let z=0;z<s;z++){let F=S+z,A=L+z;x===!0?h.push(A,A+1,F):h.push(A+1,A,F),I+=3}l.addGroup(p,I,x===!0?1:2),p+=I}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Hr=class i extends $n{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},xn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new he:new P);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new P,s=[],r=[],o=[],a=new P,c=new Be;for(let f=0;f<=e;f++){let m=f/e;s[f]=this.getTangentAt(m,new P)}r[0]=new P,o[0]=new P;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let m=Math.acos($e(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,m))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos($e(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(c.makeRotationAxis(s[m],f*m)),o[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ks=class extends xn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new he){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},ha=class extends Ks{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};Ko=new P,dl=new jl,fl=new jl,pl=new jl,Jn=class extends xn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(Ko.subVectors(s[0],s[1]).add(s[0]),l=Ko);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Ko.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ko),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(l.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),m<1e-4&&(m=_),g<1e-4&&(g=_),dl.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,m,_,g),fl.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,m,_,g),pl.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,m,_,g)}else this.curveType==="catmullrom"&&(dl.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),fl.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),pl.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(dl.calc(c),fl.calc(c),pl.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};Wr=class extends xn{constructor(e=new he,t=new he,n=new he,s=new he){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new he){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Cr(e,s.x,r.x,o.x,a.x),Cr(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ua=class extends xn{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Cr(e,s.x,r.x,o.x,a.x),Cr(e,s.y,r.y,o.y,a.y),Cr(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Xr=class extends xn{constructor(e=new he,t=new he){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new he){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new he){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},$s=class extends xn{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},qr=class extends xn{constructor(e=new he,t=new he,n=new he){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new he){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Rr(e,s.x,r.x,o.x),Rr(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Yr=class extends xn{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Rr(e,s.x,r.x,o.x),Rr(e,s.y,r.y,o.y),Rr(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Zr=class extends xn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new he){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(nd(a,c.x,l.x,h.x,u.x),nd(a,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new he().fromArray(s))}return this}},da=Object.freeze({__proto__:null,ArcCurve:ha,CatmullRomCurve3:Jn,CubicBezierCurve:Wr,CubicBezierCurve3:ua,EllipseCurve:Ks,LineCurve:Xr,LineCurve3:$s,QuadraticBezierCurve:qr,QuadraticBezierCurve3:Yr,SplineCurve:Zr}),Js=class extends xn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new da[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new da[s.type]().fromJSON(s))}return this}},ns=class extends Js{constructor(e){super(),this.type="Path",this.currentPoint=new he,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Xr(this.currentPoint.clone(),new he(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new qr(this.currentPoint.clone(),new he(e,t),new he(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new Wr(this.currentPoint.clone(),new he(e,t),new he(n,s),new he(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Zr(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,s,r,o,a,c),this}absellipse(e,t,n,s,r,o,a,c){let l=new Ks(e,t,n,s,r,o,a,c);if(this.curves.length>0){let u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},is=class extends ns{constructor(e){super(e),this.uuid=En(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new ns().fromJSON(s))}return this}};El=class{static triangulate(e,t,n=2){return Jm(e,t,n)}},Zi=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];sd(e),rd(n,e);let o=e.length;t.forEach(sd);for(let c=0;c<t.length;c++)s.push(o),o+=t[c].length,rd(n,t[c]);let a=El.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};Qs=class i extends ot{constructor(e=new is([new he(.5,.5),new he(-.5,.5),new he(-.5,-.5),new he(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,c=e.length;a<c;a++){let l=e[a];o(l)}this.setAttribute("position",new je(s,3)),this.setAttribute("uv",new je(r,2)),this.computeVertexNormals();function o(a){let c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:pg,y,x=!1,S,E,C,I;p&&(y=p.getSpacedPoints(h),x=!0,d=!1,S=p.computeFrenetFrames(h,!1),E=new P,C=new P,I=new P),d||(g=0,f=0,m=0,_=0);let w=a.extractPoints(l),b=w.shape,L=w.holes;if(!Zi.isClockWise(b)){b=b.reverse();for(let ne=0,Q=L.length;ne<Q;ne++){let j=L[ne];Zi.isClockWise(j)&&(L[ne]=j.reverse())}}function F(ne){let j=10000000000000001e-36,J=ne[0];for(let me=1;me<=ne.length;me++){let ae=me%ne.length,_e=ne[ae],We=_e.x-J.x,Ge=_e.y-J.y,R=We*We+Ge*Ge,v=Math.max(Math.abs(_e.x),Math.abs(_e.y),Math.abs(J.x),Math.abs(J.y)),W=j*v*v;if(R<=W){ne.splice(ae,1),me--;continue}J=_e}}F(b),L.forEach(F);let A=L.length,U=b;for(let ne=0;ne<A;ne++){let Q=L[ne];b=b.concat(Q)}function N(ne,Q,j){return Q||console.error("THREE.ExtrudeGeometry: vec does not exist"),ne.clone().addScaledVector(Q,j)}let q=b.length;function O(ne,Q,j){let J,me,ae,_e=ne.x-Q.x,We=ne.y-Q.y,Ge=j.x-ne.x,R=j.y-ne.y,v=_e*_e+We*We,W=_e*R-We*Ge;if(Math.abs(W)>Number.EPSILON){let Z=Math.sqrt(v),se=Math.sqrt(Ge*Ge+R*R),$=Q.x-We/Z,Ne=Q.y+_e/Z,pe=j.x-R/se,Pe=j.y+Ge/se,Le=((pe-$)*R-(Pe-Ne)*Ge)/(_e*R-We*Ge);J=$+_e*Le-ne.x,me=Ne+We*Le-ne.y;let ce=J*J+me*me;if(ce<=2)return new he(J,me);ae=Math.sqrt(ce/2)}else{let Z=!1;_e>Number.EPSILON?Ge>Number.EPSILON&&(Z=!0):_e<-Number.EPSILON?Ge<-Number.EPSILON&&(Z=!0):Math.sign(We)===Math.sign(R)&&(Z=!0),Z?(J=-We,me=_e,ae=Math.sqrt(v)):(J=_e,me=We,ae=Math.sqrt(v/2))}return new he(J/ae,me/ae)}let ee=[];for(let ne=0,Q=U.length,j=Q-1,J=ne+1;ne<Q;ne++,j++,J++)j===Q&&(j=0),J===Q&&(J=0),ee[ne]=O(U[ne],U[j],U[J]);let ie=[],de,we=ee.concat();for(let ne=0,Q=A;ne<Q;ne++){let j=L[ne];de=[];for(let J=0,me=j.length,ae=me-1,_e=J+1;J<me;J++,ae++,_e++)ae===me&&(ae=0),_e===me&&(_e=0),de[J]=O(j[J],j[ae],j[_e]);ie.push(de),we=we.concat(de)}let G;if(g===0)G=Zi.triangulateShape(U,L);else{let ne=[],Q=[];for(let j=0;j<g;j++){let J=j/g,me=f*Math.cos(J*Math.PI/2),ae=m*Math.sin(J*Math.PI/2)+_;for(let _e=0,We=U.length;_e<We;_e++){let Ge=N(U[_e],ee[_e],ae);Ce(Ge.x,Ge.y,-me),J===0&&ne.push(Ge)}for(let _e=0,We=A;_e<We;_e++){let Ge=L[_e];de=ie[_e];let R=[];for(let v=0,W=Ge.length;v<W;v++){let Z=N(Ge[v],de[v],ae);Ce(Z.x,Z.y,-me),J===0&&R.push(Z)}J===0&&Q.push(R)}}G=Zi.triangulateShape(ne,Q)}let re=G.length,oe=m+_;for(let ne=0;ne<q;ne++){let Q=d?N(b[ne],we[ne],oe):b[ne];x?(C.copy(S.normals[0]).multiplyScalar(Q.x),E.copy(S.binormals[0]).multiplyScalar(Q.y),I.copy(y[0]).add(C).add(E),Ce(I.x,I.y,I.z)):Ce(Q.x,Q.y,0)}for(let ne=1;ne<=h;ne++)for(let Q=0;Q<q;Q++){let j=d?N(b[Q],we[Q],oe):b[Q];x?(C.copy(S.normals[ne]).multiplyScalar(j.x),E.copy(S.binormals[ne]).multiplyScalar(j.y),I.copy(y[ne]).add(C).add(E),Ce(I.x,I.y,I.z)):Ce(j.x,j.y,u/h*ne)}for(let ne=g-1;ne>=0;ne--){let Q=ne/g,j=f*Math.cos(Q*Math.PI/2),J=m*Math.sin(Q*Math.PI/2)+_;for(let me=0,ae=U.length;me<ae;me++){let _e=N(U[me],ee[me],J);Ce(_e.x,_e.y,u+j)}for(let me=0,ae=L.length;me<ae;me++){let _e=L[me];de=ie[me];for(let We=0,Ge=_e.length;We<Ge;We++){let R=N(_e[We],de[We],J);x?Ce(R.x,R.y+y[h-1].y,y[h-1].x+j):Ce(R.x,R.y,u+j)}}}k(),K();function k(){let ne=s.length/3;if(d){let Q=0,j=q*Q;for(let J=0;J<re;J++){let me=G[J];Re(me[2]+j,me[1]+j,me[0]+j)}Q=h+g*2,j=q*Q;for(let J=0;J<re;J++){let me=G[J];Re(me[0]+j,me[1]+j,me[2]+j)}}else{for(let Q=0;Q<re;Q++){let j=G[Q];Re(j[2],j[1],j[0])}for(let Q=0;Q<re;Q++){let j=G[Q];Re(j[0]+q*h,j[1]+q*h,j[2]+q*h)}}n.addGroup(ne,s.length/3-ne,0)}function K(){let ne=s.length/3,Q=0;ge(U,Q),Q+=U.length;for(let j=0,J=L.length;j<J;j++){let me=L[j];ge(me,Q),Q+=me.length}n.addGroup(ne,s.length/3-ne,1)}function ge(ne,Q){let j=ne.length;for(;--j>=0;){let J=j,me=j-1;me<0&&(me=ne.length-1);for(let ae=0,_e=h+g*2;ae<_e;ae++){let We=q*ae,Ge=q*(ae+1),R=Q+J+We,v=Q+me+We,W=Q+me+Ge,Z=Q+J+Ge;Ke(R,v,W,Z)}}}function Ce(ne,Q,j){c.push(ne),c.push(Q),c.push(j)}function Re(ne,Q,j){rt(ne),rt(Q),rt(j);let J=s.length/3,me=M.generateTopUV(n,s,J-3,J-2,J-1);D(me[0]),D(me[1]),D(me[2])}function Ke(ne,Q,j,J){rt(ne),rt(Q),rt(J),rt(Q),rt(j),rt(J);let me=s.length/3,ae=M.generateSideWallUV(n,s,me-6,me-3,me-2,me-1);D(ae[0]),D(ae[1]),D(ae[3]),D(ae[1]),D(ae[2]),D(ae[3])}function rt(ne){s.push(c[ne*3+0]),s.push(c[ne*3+1]),s.push(c[ne*3+2])}function D(ne){r.push(ne.x),r.push(ne.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return mg(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new da[s.type]().fromJSON(s)),new i(n,e.options)}},pg={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],c=e[n*3+1],l=e[s*3],h=e[s*3+1];return[new he(r,o),new he(a,c),new he(l,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],m=e[s*3+2],_=e[r*3],g=e[r*3+1],p=e[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new he(o,1-c),new he(l,1-u),new he(d,1-m),new he(_,1-p)]:[new he(a,1-c),new he(h,1-u),new he(f,1-m),new he(g,1-p)]}};Cn=class i extends ot{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=e/a,d=t/c,f=[],m=[],_=[],g=[];for(let p=0;p<h;p++){let M=p*d-o;for(let y=0;y<l;y++){let x=y*u-r;m.push(x,-M,0),_.push(0,0,1),g.push(y/a),g.push(1-p/c)}}for(let p=0;p<c;p++)for(let M=0;M<a;M++){let y=M+l*p,x=M+l*(p+1),S=M+1+l*(p+1),E=M+1+l*p;f.push(y,x,E),f.push(x,S,E)}this.setIndex(f),this.setAttribute("position",new je(m,3)),this.setAttribute("normal",new je(_,3)),this.setAttribute("uv",new je(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},jr=class i extends ot{constructor(e=.5,t=1,n=32,s=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:o},n=Math.max(3,n),s=Math.max(1,s);let a=[],c=[],l=[],h=[],u=e,d=(t-e)/s,f=new P,m=new he;for(let _=0;_<=s;_++){for(let g=0;g<=n;g++){let p=r+g/n*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),m.x=(f.x/t+1)/2,m.y=(f.y/t+1)/2,h.push(m.x,m.y)}u+=d}for(let _=0;_<s;_++){let g=_*(n+1);for(let p=0;p<n;p++){let M=p+g,y=M,x=M+n+1,S=M+n+2,E=M+1;a.push(y,x,E),a.push(x,S,E)}}this.setIndex(a),this.setAttribute("position",new je(c,3)),this.setAttribute("normal",new je(l,3)),this.setAttribute("uv",new je(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},In=class i extends ot{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],u=new P,d=new P,f=[],m=[],_=[],g=[];for(let p=0;p<=n;p++){let M=[],y=p/n,x=0;p===0&&o===0?x=.5/t:p===n&&c===Math.PI&&(x=-.5/t);for(let S=0;S<=t;S++){let E=S/t;u.x=-e*Math.cos(s+E*r)*Math.sin(o+y*a),u.y=e*Math.cos(o+y*a),u.z=e*Math.sin(s+E*r)*Math.sin(o+y*a),m.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),g.push(E+x,1-y),M.push(l++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<t;M++){let y=h[p][M+1],x=h[p][M],S=h[p+1][M],E=h[p+1][M+1];(p!==0||o>0)&&f.push(y,x,E),(p!==n-1||c<Math.PI)&&f.push(x,S,E)}this.setIndex(f),this.setAttribute("position",new je(m,3)),this.setAttribute("normal",new je(_,3)),this.setAttribute("uv",new je(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},jn=class i extends ot{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],c=[],l=[],h=new P,u=new P,d=new P;for(let f=0;f<=n;f++)for(let m=0;m<=s;m++){let _=m/s*r,g=f/n*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(_),u.y=(e+t*Math.cos(g))*Math.sin(_),u.z=t*Math.sin(g),a.push(u.x,u.y,u.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(m/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=s;m++){let _=(s+1)*f+m-1,g=(s+1)*(f-1)+m-1,p=(s+1)*(f-1)+m,M=(s+1)*f+m;o.push(_,g,M),o.push(g,p,M)}this.setIndex(o),this.setAttribute("position",new je(a,3)),this.setAttribute("normal",new je(c,3)),this.setAttribute("uv",new je(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},Qr=class i extends ot{constructor(e=new Yr(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new P,c=new P,l=new he,h=new P,u=[],d=[],f=[],m=[];_(),this.setIndex(m),this.setAttribute("position",new je(u,3)),this.setAttribute("normal",new je(d,3)),this.setAttribute("uv",new je(f,2));function _(){for(let y=0;y<t;y++)g(y);g(r===!1?t:0),M(),p()}function g(y){h=e.getPointAt(y/t,h);let x=o.normals[y],S=o.binormals[y];for(let E=0;E<=s;E++){let C=E/s*Math.PI*2,I=Math.sin(C),w=-Math.cos(C);c.x=w*x.x+I*S.x,c.y=w*x.y+I*S.y,c.z=w*x.z+I*S.z,c.normalize(),d.push(c.x,c.y,c.z),a.x=h.x+n*c.x,a.y=h.y+n*c.y,a.z=h.z+n*c.z,u.push(a.x,a.y,a.z)}}function p(){for(let y=1;y<=t;y++)for(let x=1;x<=s;x++){let S=(s+1)*(y-1)+(x-1),E=(s+1)*y+(x-1),C=(s+1)*y+x,I=(s+1)*(y-1)+x;m.push(S,E,I),m.push(E,C,I)}}function M(){for(let y=0;y<=t;y++)for(let x=0;x<=s;x++)l.x=y/t,l.y=x/s,f.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new da[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},at=class extends Jt{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ee(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mc,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new rn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},on=class extends at{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new he(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return $e(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ee(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ee(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ee(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},eo=class extends Jt{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ee(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ee(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mc,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new rn,this.combine=Ia,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},fa=class extends Jt{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Gd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},pa=class extends Jt{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};_i=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ma=class extends _i{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:yl,endingEnd:yl}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case vl:r=e,a=2*t-n;break;case Ml:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case vl:o=e,c=2*n-t;break;case Ml:o=1,c=n+s[1]-s[0];break;default:o=e-1,c=t}let l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),_=m*m,g=_*m,p=-d*g+2*d*_-d*m,M=(1+d)*g+(-1.5-2*d)*_+(-.5+d)*m+1,y=(-1-f)*g+(1.5+f)*_+.5*m,x=f*g-f*_;for(let S=0;S!==a;++S)r[S]=p*o[h+S]+M*o[l+S]+y*o[c+S]+x*o[u+S];return r}},ga=class extends _i{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[l+d]*u+o[c+d]*h;return r}},_a=class extends _i{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},an=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=jo(t,this.TimeBufferType),this.values=jo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:jo(e.times,Array),values:jo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new _a(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ga(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ma(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ji:t=this.InterpolantFactoryMethodDiscrete;break;case ji:t=this.InterpolantFactoryMethodLinear;break;case Qo:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ji;case this.InterpolantFactoryMethodLinear:return ji;case this.InterpolantFactoryMethodSmooth:return Qo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&gg(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Qo,r=e.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(s)c=!0;else{let u=a*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let _=t[u+m];if(_!==t[d+m]||_!==t[f+m]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};an.prototype.ValueTypeName="";an.prototype.TimeBufferType=Float32Array;an.prototype.ValueBufferType=Float32Array;an.prototype.DefaultInterpolation=ji;xi=class extends an{constructor(e,t,n){super(e,t,n)}};xi.prototype.ValueTypeName="bool";xi.prototype.ValueBufferType=Array;xi.prototype.DefaultInterpolation=Ji;xi.prototype.InterpolantFactoryMethodLinear=void 0;xi.prototype.InterpolantFactoryMethodSmooth=void 0;to=class extends an{constructor(e,t,n,s){super(e,t,n,s)}};to.prototype.ValueTypeName="color";Qn=class extends an{constructor(e,t,n,s){super(e,t,n,s)}};Qn.prototype.ValueTypeName="number";xa=class extends _i{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(s-t),l=e*a;for(let h=l+a;l!==h;l+=4)nn.slerpFlat(r,0,o,l-a,o,l,c);return r}},ei=class extends an{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new xa(this.times,this.values,this.getValueSize(),e)}};ei.prototype.ValueTypeName="quaternion";ei.prototype.InterpolantFactoryMethodSmooth=void 0;yi=class extends an{constructor(e,t,n){super(e,t,n)}};yi.prototype.ValueTypeName="string";yi.prototype.ValueBufferType=Array;yi.prototype.DefaultInterpolation=Ji;yi.prototype.InterpolantFactoryMethodLinear=void 0;yi.prototype.InterpolantFactoryMethodSmooth=void 0;ti=class extends an{constructor(e,t,n,s){super(e,t,n,s)}};ti.prototype.ValueTypeName="vector";no=class{constructor(e="",t=-1,n=[],s=Vd){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=En(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,s=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(yg(n[o]).scale(s));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(an.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){let r=t.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);let h=_g(c);c=od(c,1,h),l=od(l,1,h),!s&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new Qn(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){let l=e[a],h=l.name.match(r);if(h&&h.length>1){let u=h[1],d=s[u];d||(s[u]=d=[]),d.push(l)}}let o=[];for(let a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,n));return o}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(u,d,f,m,_){if(f.length!==0){let g=[],p=[];af(f,g,p,m),g.length!==0&&_.push(new u(d,g,p))}},s=[],r=e.name||"default",o=e.fps||30,a=e.blendMode,c=e.length||-1,l=e.hierarchy||[];for(let u=0;u<l.length;u++){let d=l[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){let f={},m;for(m=0;m<d.length;m++)if(d[m].morphTargets)for(let _=0;_<d[m].morphTargets.length;_++)f[d[m].morphTargets[_]]=-1;for(let _ in f){let g=[],p=[];for(let M=0;M!==d[m].morphTargets.length;++M){let y=d[m];g.push(y.time),p.push(y.morphTarget===_?1:0)}s.push(new Qn(".morphTargetInfluence["+_+"]",g,p))}c=f.length*o}else{let f=".bones["+t[u].name+"]";n(ti,f+".position",d,"pos",s),n(ei,f+".quaternion",d,"rot",s),n(ti,f+".scale",d,"scl",s)}}return s.length===0?null:new this(r,c,s,a)}resetDuration(){let e=this.tracks,t=0;for(let n=0,s=e.length;n!==s;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};Zn={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},ya=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){let u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){let f=l[u],m=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},cf=new ya,Wn=class{constructor(e){this.manager=e!==void 0?e:cf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Wn.DEFAULT_MATERIAL_NAME="__DEFAULT";fi={},Al=class extends Error{constructor(e,t){super(e),this.response=t}},rs=class extends Wn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Zn.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(fi[e]!==void 0){fi[e].push({onLoad:t,onProgress:n,onError:s});return}fi[e]=[],fi[e].push({onLoad:t,onProgress:n,onError:s});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=fi[e],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=d?parseInt(d):0,m=f!==0,_=0,g=new ReadableStream({start(p){M();function M(){u.read().then(({done:y,value:x})=>{if(y)p.close();else{_+=x.byteLength;let S=new ProgressEvent("progress",{lengthComputable:m,loaded:_,total:f});for(let E=0,C=h.length;E<C;E++){let I=h[E];I.onProgress&&I.onProgress(S)}p.enqueue(x),M()}},y=>{p.error(y)})}}});return new Response(g)}else throw new Al(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a==="")return l.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return l.arrayBuffer().then(m=>f.decode(m))}}}).then(l=>{Zn.add(`file:${e}`,l);let h=fi[e];delete fi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(l)}}).catch(l=>{let h=fi[e];if(h===void 0)throw this.manager.itemError(e),l;delete fi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},Us=new WeakMap,va=class extends Wn{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Zn.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let u=Us.get(o);u===void 0&&(u=[],Us.set(o,u)),u.push({onLoad:t,onError:s})}return o}let a=zs("img");function c(){h(),t&&t(this);let u=Us.get(this)||[];for(let d=0;d<u.length;d++){let f=u[d];f.onLoad&&f.onLoad(this)}Us.delete(this),r.manager.itemEnd(e)}function l(u){h(),s&&s(u),Zn.remove(`image:${e}`);let d=Us.get(this)||[];for(let f=0;f<d.length;f++){let m=d[f];m.onError&&m.onError(u)}Us.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Zn.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}},io=class extends Wn{constructor(e){super(e)}load(e,t,n,s){let r=this,o=new An,a=new rs(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(e,function(c){let l;try{l=r.parse(c)}catch(h){if(s!==void 0)s(h);else{console.error(h);return}}l.image!==void 0?o.image=l.image:l.data!==void 0&&(o.image.width=l.width,o.image.height=l.height,o.image.data=l.data),o.wrapS=l.wrapS!==void 0?l.wrapS:Tn,o.wrapT=l.wrapT!==void 0?l.wrapT:Tn,o.magFilter=l.magFilter!==void 0?l.magFilter:Mt,o.minFilter=l.minFilter!==void 0?l.minFilter:Mt,o.anisotropy=l.anisotropy!==void 0?l.anisotropy:1,l.colorSpace!==void 0&&(o.colorSpace=l.colorSpace),l.flipY!==void 0&&(o.flipY=l.flipY),l.format!==void 0&&(o.format=l.format),l.type!==void 0&&(o.type=l.type),l.mipmaps!==void 0&&(o.mipmaps=l.mipmaps,o.minFilter=ln),l.mipmapCount===1&&(o.minFilter=Mt),l.generateMipmaps!==void 0&&(o.generateMipmaps=l.generateMipmaps),o.needsUpdate=!0,t&&t(o,l)},n,s),o}},os=class extends Wn{constructor(e){super(e)}load(e,t,n,s){let r=new Bt,o=new va(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}},as=class extends Qe{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ee(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},so=class extends as{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Qe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ee(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},ml=new Be,ad=new P,cd=new P,ro=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new he(512,512),this.mapType=Xn,this.map=null,this.mapPass=null,this.matrix=new Be,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ys,this._frameExtents=new he(1,1),this._viewportCount=1,this._viewports=[new st(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;ad.setFromMatrixPosition(e.matrixWorld),t.position.copy(ad),cd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(cd),t.updateMatrixWorld(),ml.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ml,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ml)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Rl=class extends ro{constructor(){super(new Pt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Qi*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},oo=class extends as{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Qe.DEFAULT_UP),this.updateMatrix(),this.target=new Qe,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Rl}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},ld=new Be,wr=new P,gl=new P,Cl=class extends ro{constructor(){super(new Pt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new he(4,2),this._viewportCount=6,this._viewports=[new st(2,1,1,1),new st(0,1,1,1),new st(3,1,1,1),new st(1,1,1,1),new st(3,0,1,1),new st(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),wr.setFromMatrixPosition(e.matrixWorld),n.position.copy(wr),gl.copy(n.position),gl.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(gl),n.updateMatrixWorld(),s.makeTranslation(-wr.x,-wr.y,-wr.z),ld.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ld,n.coordinateSystem,n.reversedDepth)}},cn=class extends as{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Cl}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},cs=class extends Ur{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Il=class extends ro{constructor(){super(new cs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Fi=class extends as{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Qe.DEFAULT_UP),this.updateMatrix(),this.target=new Qe,this.shadow=new Il}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},vi=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}},_l=new WeakMap,ao=class extends Wn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Zn.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(l=>{if(_l.has(o)===!0)s&&s(_l.get(o)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(l),r.manager.itemEnd(e),l});return}return setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return Zn.add(`image-bitmap:${e}`,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){s&&s(l),_l.set(c,l),Zn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Zn.add(`image-bitmap:${e}`,c),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},Ma=class extends Pt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Ql="\\[\\]\\.:\\/",vg=new RegExp("["+Ql+"]","g"),eh="[^"+Ql+"]",Mg="[^"+Ql.replace("\\.","")+"]",bg=/((?:WC+[\/:])*)/.source.replace("WC",eh),Sg=/(WCOD+)?/.source.replace("WCOD",Mg),wg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",eh),Tg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",eh),Eg=new RegExp("^"+bg+Sg+wg+Tg+"$"),Ag=["material","materials","bones","map"],Pl=class{constructor(e,t,n){let s=n||mt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},mt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(vg,"")}static parseTrackName(e){let t=Eg.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Ag.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let c=n(a.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let o=e[s];if(o===void 0){let l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};mt.Composite=Pl;mt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};mt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};mt.prototype.GetterByBindingType=[mt.prototype._getValue_direct,mt.prototype._getValue_array,mt.prototype._getValue_arrayElement,mt.prototype._getValue_toArray];mt.prototype.SetterByBindingTypeAndVersioning=[[mt.prototype._setValue_direct,mt.prototype._setValue_direct_setNeedsUpdate,mt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[mt.prototype._setValue_array,mt.prototype._setValue_array_setNeedsUpdate,mt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[mt.prototype._setValue_arrayElement,mt.prototype._setValue_arrayElement_setNeedsUpdate,mt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[mt.prototype._setValue_fromArray,mt.prototype._setValue_fromArray_setNeedsUpdate,mt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];kv=new Float32Array(1),hd=new Be,ls=class{constructor(e,t,n=0,s=1/0){this.ray=new Di(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Gs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return hd.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(hd),this}intersectObject(e,t=!0,n=[]){return Ll(e,this,n,t),n.sort(ud),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Ll(e[s],this,n,t);return n.sort(ud),n}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180")});function Lf(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Ig(i){let e=new WeakMap;function t(a,c){let l=a.array,h=a.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){let h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],_=u[f];_.start<=m.start+m.count+1?m.count=Math.max(m.count,_.start+_.count-m.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let _=u[f];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}function ux(i,e,t,n,s,r,o){let a=new Ee(0),c=r===!0?0:1,l,h,u=null,d=0,f=null;function m(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?t:e).get(x)),x}function _(y){let x=!1,S=m(y);S===null?p(a,c):S&&S.isColor&&(p(S,1),x=!0);let E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,o):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(y,x){let S=m(x);S&&(S.isCubeTexture||S.mapping===co)?(h===void 0&&(h=new qe(new zt(1,1,1),new Vn({name:"BackgroundCubeMaterial",uniforms:fs(ii.backgroundCube.uniforms),vertexShader:ii.backgroundCube.vertexShader,fragmentShader:ii.backgroundCube.fragmentShader,side:Gt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,C,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ps.copy(x.backgroundRotation),ps.x*=-1,ps.y*=-1,ps.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(ps.y*=-1,ps.z*=-1),h.material.uniforms.envMap.value=S,h.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(hx.makeRotationFromEuler(ps)),h.material.toneMapped=nt.getTransfer(S.colorSpace)!==ht,(u!==S||d!==S.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=S,d=S.version,f=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new qe(new Cn(2,2),new Vn({name:"BackgroundMaterial",uniforms:fs(ii.background.uniforms),vertexShader:ii.background.vertexShader,fragmentShader:ii.background.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=nt.getTransfer(S.colorSpace)!==ht,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||d!==S.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=S,d=S.version,f=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function p(y,x){y.getRGB(gc,Jl(i)),n.buffers.color.setClear(gc.r,gc.g,gc.b,x,o)}function M(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(y,x=1){a.set(y),c=x,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,p(a,c)},render:_,addToRenderList:g,dispose:M}}function dx(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(b,L,z,F,A){let U=!1,N=u(F,z,L);r!==N&&(r=N,l(r.object)),U=f(b,F,z,A),U&&m(b,F,z,A),A!==null&&e.update(A,i.ELEMENT_ARRAY_BUFFER),(U||o)&&(o=!1,x(b,L,z,F),A!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(A).buffer))}function c(){return i.createVertexArray()}function l(b){return i.bindVertexArray(b)}function h(b){return i.deleteVertexArray(b)}function u(b,L,z){let F=z.wireframe===!0,A=n[b.id];A===void 0&&(A={},n[b.id]=A);let U=A[L.id];U===void 0&&(U={},A[L.id]=U);let N=U[F];return N===void 0&&(N=d(c()),U[F]=N),N}function d(b){let L=[],z=[],F=[];for(let A=0;A<t;A++)L[A]=0,z[A]=0,F[A]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:z,attributeDivisors:F,object:b,attributes:{},index:null}}function f(b,L,z,F){let A=r.attributes,U=L.attributes,N=0,q=z.getAttributes();for(let O in q)if(q[O].location>=0){let ie=A[O],de=U[O];if(de===void 0&&(O==="instanceMatrix"&&b.instanceMatrix&&(de=b.instanceMatrix),O==="instanceColor"&&b.instanceColor&&(de=b.instanceColor)),ie===void 0||ie.attribute!==de||de&&ie.data!==de.data)return!0;N++}return r.attributesNum!==N||r.index!==F}function m(b,L,z,F){let A={},U=L.attributes,N=0,q=z.getAttributes();for(let O in q)if(q[O].location>=0){let ie=U[O];ie===void 0&&(O==="instanceMatrix"&&b.instanceMatrix&&(ie=b.instanceMatrix),O==="instanceColor"&&b.instanceColor&&(ie=b.instanceColor));let de={};de.attribute=ie,ie&&ie.data&&(de.data=ie.data),A[O]=de,N++}r.attributes=A,r.attributesNum=N,r.index=F}function _(){let b=r.newAttributes;for(let L=0,z=b.length;L<z;L++)b[L]=0}function g(b){p(b,0)}function p(b,L){let z=r.newAttributes,F=r.enabledAttributes,A=r.attributeDivisors;z[b]=1,F[b]===0&&(i.enableVertexAttribArray(b),F[b]=1),A[b]!==L&&(i.vertexAttribDivisor(b,L),A[b]=L)}function M(){let b=r.newAttributes,L=r.enabledAttributes;for(let z=0,F=L.length;z<F;z++)L[z]!==b[z]&&(i.disableVertexAttribArray(z),L[z]=0)}function y(b,L,z,F,A,U,N){N===!0?i.vertexAttribIPointer(b,L,z,A,U):i.vertexAttribPointer(b,L,z,F,A,U)}function x(b,L,z,F){_();let A=F.attributes,U=z.getAttributes(),N=L.defaultAttributeValues;for(let q in U){let O=U[q];if(O.location>=0){let ee=A[q];if(ee===void 0&&(q==="instanceMatrix"&&b.instanceMatrix&&(ee=b.instanceMatrix),q==="instanceColor"&&b.instanceColor&&(ee=b.instanceColor)),ee!==void 0){let ie=ee.normalized,de=ee.itemSize,we=e.get(ee);if(we===void 0)continue;let G=we.buffer,re=we.type,oe=we.bytesPerElement,k=re===i.INT||re===i.UNSIGNED_INT||ee.gpuType===Na;if(ee.isInterleavedBufferAttribute){let K=ee.data,ge=K.stride,Ce=ee.offset;if(K.isInstancedInterleavedBuffer){for(let Re=0;Re<O.locationSize;Re++)p(O.location+Re,K.meshPerAttribute);b.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let Re=0;Re<O.locationSize;Re++)g(O.location+Re);i.bindBuffer(i.ARRAY_BUFFER,G);for(let Re=0;Re<O.locationSize;Re++)y(O.location+Re,de/O.locationSize,re,ie,ge*oe,(Ce+de/O.locationSize*Re)*oe,k)}else{if(ee.isInstancedBufferAttribute){for(let K=0;K<O.locationSize;K++)p(O.location+K,ee.meshPerAttribute);b.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let K=0;K<O.locationSize;K++)g(O.location+K);i.bindBuffer(i.ARRAY_BUFFER,G);for(let K=0;K<O.locationSize;K++)y(O.location+K,de/O.locationSize,re,ie,de*oe,de/O.locationSize*K*oe,k)}}else if(N!==void 0){let ie=N[q];if(ie!==void 0)switch(ie.length){case 2:i.vertexAttrib2fv(O.location,ie);break;case 3:i.vertexAttrib3fv(O.location,ie);break;case 4:i.vertexAttrib4fv(O.location,ie);break;default:i.vertexAttrib1fv(O.location,ie)}}}}M()}function S(){I();for(let b in n){let L=n[b];for(let z in L){let F=L[z];for(let A in F)h(F[A].object),delete F[A];delete L[z]}delete n[b]}}function E(b){if(n[b.id]===void 0)return;let L=n[b.id];for(let z in L){let F=L[z];for(let A in F)h(F[A].object),delete F[A];delete L[z]}delete n[b.id]}function C(b){for(let L in n){let z=n[L];if(z[b.id]===void 0)continue;let F=z[b.id];for(let A in F)h(F[A].object),delete F[A];delete z[b.id]}}function I(){w(),o=!0,r!==s&&(r=s,l(r.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:I,resetDefaultState:w,dispose:S,releaseStatesOfGeometry:E,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:g,disableUnusedAttributes:M}}function fx(i,e,t){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function a(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];t.update(f,n,1)}function c(l,h,u,d){if(u===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<l.length;m++)o(l[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let m=0;for(let _=0;_<u;_++)m+=h[_]*d[_];t.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function px(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(C){return!(C!==jt&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let I=C===qn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Xn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==qt&&!I)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=m>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:M,maxVaryings:y,maxFragmentUniforms:x,vertexTextures:S,maxSamples:E}}function mx(i){let e=this,t=null,n=0,s=!1,r=!1,o=new wn,a=new He,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,_=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):l();else{let M=r?0:n,y=M*4,x=p.clippingState||null;c.value=x,x=h(m,d,y,f);for(let S=0;S!==y;++S)x[S]=t[S];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,m){let _=u!==null?u.length:0,g=null;if(_!==0){if(g=c.value,m!==!0||g===null){let p=f+_*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(g===null||g.length<p)&&(g=new Float32Array(p));for(let y=0,x=f;y!==_;++y,x+=4)o.copy(u[y]).applyMatrix4(M,a),o.normal.toArray(g,x),g[x+3]=o.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,g}}function gx(i){let e=new WeakMap;function t(o,a){return a===er?o.mapping=hs:a===La&&(o.mapping=us),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===er||a===La)if(e.has(o)){let c=e.get(o).texture;return t(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new aa(c.height);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",s),t(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}function xx(i){let e=[],t=[],n=[],s=i,r=i-ar+1+lf.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let c=1/a;o>i-ar?c=lf[o-i+ar-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,_=3,g=2,p=1,M=new Float32Array(_*m*f),y=new Float32Array(g*m*f),x=new Float32Array(p*m*f);for(let E=0;E<f;E++){let C=E%3*2/3-1,I=E>2?0:-1,w=[C,I,0,C+2/3,I,0,C+2/3,I+1,0,C,I,0,C+2/3,I+1,0,C,I+1,0];M.set(w,_*m*E),y.set(d,g*m*E);let b=[E,E,E,E,E,E];x.set(b,p*m*E)}let S=new ot;S.setAttribute("position",new ft(M,_)),S.setAttribute("uv",new ft(y,g)),S.setAttribute("faceIndex",new ft(x,p)),e.push(S),s>ar&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function df(i,e,t){let n=new Kn(i,e,t);return n.texture.mapping=co,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function _c(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function yx(i,e,t){let n=new Float32Array(_s),s=new P(0,1,0);return new Vn({name:"SphericalGaussianBlur",defines:{n:_s,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:_h(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function ff(){return new Vn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_h(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function pf(){return new Vn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_h(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function _h(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function vx(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===er||c===La,h=c===hs||c===us;if(l||h){let u=e.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new xs(i)),u=l?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return l&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new xs(i)),u=l?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Mx(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&ks("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function bx(i,e,t,n){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let m in d.attributes)e.remove(d.attributes[m]);d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function c(u){let d=u.attributes;for(let f in d)e.update(d[f],i.ARRAY_BUFFER)}function l(u){let d=[],f=u.index,m=u.attributes.position,_=0;if(f!==null){let M=f.array;_=f.version;for(let y=0,x=M.length;y<x;y+=3){let S=M[y+0],E=M[y+1],C=M[y+2];d.push(S,E,E,C,C,S)}}else if(m!==void 0){let M=m.array;_=m.version;for(let y=0,x=M.length/3-1;y<x;y+=3){let S=y+0,E=y+1,C=y+2;d.push(S,E,E,C,C,S)}}else return;let g=new($l(d)?Nr:Dr)(d,1);g.version=_;let p=r.get(u);p&&e.remove(p),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function Sx(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,f){i.drawElements(n,f,r,d*o),t.update(f,n,1)}function l(d,f,m){m!==0&&(i.drawElementsInstanced(n,f,r,d*o,m),t.update(f,n,m))}function h(d,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];t.update(g,n,1)}function u(d,f,m,_){if(m===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)l(d[p]/o,f[p],_[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,m);let p=0;for(let M=0;M<m;M++)p+=f[M]*_[M];t.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function wx(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Tx(i,e,t){let n=new WeakMap,s=new st;function r(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let w=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",w)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],y=0;f===!0&&(y=1),m===!0&&(y=2),_===!0&&(y=3);let x=a.attributes.position.count*y,S=1;x>e.maxTextureSize&&(S=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let E=new Float32Array(x*S*4*u),C=new Lr(E,x,S,u);C.type=qt,C.needsUpdate=!0;let I=y*4;for(let b=0;b<u;b++){let L=g[b],z=p[b],F=M[b],A=x*S*4*b;for(let U=0;U<L.count;U++){let N=U*I;f===!0&&(s.fromBufferAttribute(L,U),E[A+N+0]=s.x,E[A+N+1]=s.y,E[A+N+2]=s.z,E[A+N+3]=0),m===!0&&(s.fromBufferAttribute(z,U),E[A+N+4]=s.x,E[A+N+5]=s.y,E[A+N+6]=s.z,E[A+N+7]=0),_===!0&&(s.fromBufferAttribute(F,U),E[A+N+8]=s.x,E[A+N+9]=s.y,E[A+N+10]=s.z,E[A+N+11]=F.itemSize===4?s.w:1)}}d={count:u,texture:C,size:new he(x,S)},n.set(a,d),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<l.length;_++)f+=l[_];let m=a.morphTargetsRelative?1:1-f;c.getUniforms().setValue(i,"morphTargetBaseInfluence",m),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Ex(i,e,t,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,u=e.get(c,h);if(s.get(u)!==l&&(e.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}function lr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=gf[s];if(r===void 0&&(r=new Float32Array(s),gf[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Nt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ut(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function vc(i,e){let t=_f[e];t===void 0&&(t=new Int32Array(e),_f[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Ax(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Rx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;i.uniform2fv(this.addr,e),Ut(t,e)}}function Cx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Nt(t,e))return;i.uniform3fv(this.addr,e),Ut(t,e)}}function Ix(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;i.uniform4fv(this.addr,e),Ut(t,e)}}function Px(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(Nt(t,n))return;vf.set(n),i.uniformMatrix2fv(this.addr,!1,vf),Ut(t,n)}}function Lx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(Nt(t,n))return;yf.set(n),i.uniformMatrix3fv(this.addr,!1,yf),Ut(t,n)}}function Dx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(Nt(t,n))return;xf.set(n),i.uniformMatrix4fv(this.addr,!1,xf),Ut(t,n)}}function Nx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Ux(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;i.uniform2iv(this.addr,e),Ut(t,e)}}function Fx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;i.uniform3iv(this.addr,e),Ut(t,e)}}function Ox(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;i.uniform4iv(this.addr,e),Ut(t,e)}}function Bx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function zx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;i.uniform2uiv(this.addr,e),Ut(t,e)}}function kx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;i.uniform3uiv(this.addr,e),Ut(t,e)}}function Vx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;i.uniform4uiv(this.addr,e),Ut(t,e)}}function Gx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(mf.compareFunction=Yl,r=mf):r=Df,t.setTexture2D(e||r,s)}function Hx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Uf,s)}function Wx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Ff,s)}function Xx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Nf,s)}function qx(i){switch(i){case 5126:return Ax;case 35664:return Rx;case 35665:return Cx;case 35666:return Ix;case 35674:return Px;case 35675:return Lx;case 35676:return Dx;case 5124:case 35670:return Nx;case 35667:case 35671:return Ux;case 35668:case 35672:return Fx;case 35669:case 35673:return Ox;case 5125:return Bx;case 36294:return zx;case 36295:return kx;case 36296:return Vx;case 35678:case 36198:case 36298:case 36306:case 35682:return Gx;case 35679:case 36299:case 36307:return Hx;case 35680:case 36300:case 36308:case 36293:return Wx;case 36289:case 36303:case 36311:case 36292:return Xx}}function Yx(i,e){i.uniform1fv(this.addr,e)}function Zx(i,e){let t=lr(e,this.size,2);i.uniform2fv(this.addr,t)}function Kx(i,e){let t=lr(e,this.size,3);i.uniform3fv(this.addr,t)}function $x(i,e){let t=lr(e,this.size,4);i.uniform4fv(this.addr,t)}function Jx(i,e){let t=lr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function jx(i,e){let t=lr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Qx(i,e){let t=lr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function ey(i,e){i.uniform1iv(this.addr,e)}function ty(i,e){i.uniform2iv(this.addr,e)}function ny(i,e){i.uniform3iv(this.addr,e)}function iy(i,e){i.uniform4iv(this.addr,e)}function sy(i,e){i.uniform1uiv(this.addr,e)}function ry(i,e){i.uniform2uiv(this.addr,e)}function oy(i,e){i.uniform3uiv(this.addr,e)}function ay(i,e){i.uniform4uiv(this.addr,e)}function cy(i,e,t){let n=this.cache,s=e.length,r=vc(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ut(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Df,r[o])}function ly(i,e,t){let n=this.cache,s=e.length,r=vc(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ut(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Uf,r[o])}function hy(i,e,t){let n=this.cache,s=e.length,r=vc(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ut(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Ff,r[o])}function uy(i,e,t){let n=this.cache,s=e.length,r=vc(t,s);Nt(n,r)||(i.uniform1iv(this.addr,r),Ut(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Nf,r[o])}function dy(i){switch(i){case 5126:return Yx;case 35664:return Zx;case 35665:return Kx;case 35666:return $x;case 35674:return Jx;case 35675:return jx;case 35676:return Qx;case 5124:case 35670:return ey;case 35667:case 35671:return ty;case 35668:case 35672:return ny;case 35669:case 35673:return iy;case 5125:return sy;case 36294:return ry;case 36295:return oy;case 36296:return ay;case 35678:case 36198:case 36298:case 36306:case 35682:return cy;case 35679:case 36299:case 36307:return ly;case 35680:case 36300:case 36308:case 36293:return hy;case 36289:case 36303:case 36311:case 36292:return uy}}function Mf(i,e){i.seq.push(e),i.map[e.id]=e}function fy(i,e,t){let n=i.name,s=n.length;for(ch.lastIndex=0;;){let r=ch.exec(n),o=ch.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Mf(t,l===void 0?new lh(a,i,e):new hh(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new uh(a),Mf(t,u)),t=u}}}function bf(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}function gy(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function _y(i){nt._getMatrix(Sf,nt.workingColorSpace,i);let e=`mat3( ${Sf.elements.map(t=>t.toFixed(4))} )`;switch(nt.getTransfer(i)){case Ir:return[e,"LinearTransferOETF"];case ht:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function wf(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+gy(i.getShaderSource(e),a)}else return r}function xy(i,e){let t=_y(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function yy(i,e){let t;switch(e){case Nd:t="Linear";break;case Ud:t="Reinhard";break;case Fd:t="Cineon";break;case Od:t="ACESFilmic";break;case Pa:t="AgX";break;case zd:t="Neutral";break;case Bd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function vy(){nt.getLuminanceCoefficients(xc);let i=xc.x.toFixed(4),e=xc.y.toFixed(4),t=xc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function My(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(mo).join(`
`)}function by(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Sy(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function mo(i){return i!==""}function Tf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ef(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}function dh(i){return i.replace(wy,Ey)}function Ey(i,e){let t=Je[e];if(t===void 0){let n=Ty.get(e);if(n!==void 0)t=Je[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return dh(t)}function Af(i){return i.replace(Ay,Ry)}function Ry(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Rf(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Cy(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Nl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===ba?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ni&&(e="SHADOWMAP_TYPE_VSM"),e}function Iy(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case hs:case us:e="ENVMAP_TYPE_CUBE";break;case co:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Py(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case us:e="ENVMAP_MODE_REFRACTION";break}return e}function Ly(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ia:e="ENVMAP_BLENDING_MULTIPLY";break;case Ld:e="ENVMAP_BLENDING_MIX";break;case Dd:e="ENVMAP_BLENDING_ADD";break}return e}function Dy(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Ny(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,c=Cy(t),l=Iy(t),h=Py(t),u=Ly(t),d=Dy(t),f=My(t),m=by(r),_=s.createProgram(),g,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(mo).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(mo).join(`
`),p.length>0&&(p+=`
`)):(g=[Rf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(mo).join(`
`),p=[Rf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==bi?"#define TONE_MAPPING":"",t.toneMapping!==bi?Je.tonemapping_pars_fragment:"",t.toneMapping!==bi?yy("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Je.colorspace_pars_fragment,xy("linearToOutputTexel",t.outputColorSpace),vy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(mo).join(`
`)),o=dh(o),o=Tf(o,t),o=Ef(o,t),a=dh(a),a=Tf(a,t),a=Ef(a,t),o=Af(o),a=Af(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Zl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Zl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let y=M+g+o,x=M+p+a,S=bf(s,s.VERTEX_SHADER,y),E=bf(s,s.FRAGMENT_SHADER,x);s.attachShader(_,S),s.attachShader(_,E),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(L){if(i.debug.checkShaderErrors){let z=s.getProgramInfoLog(_)||"",F=s.getShaderInfoLog(S)||"",A=s.getShaderInfoLog(E)||"",U=z.trim(),N=F.trim(),q=A.trim(),O=!0,ee=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(O=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,S,E);else{let ie=wf(s,S,"vertex"),de=wf(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+U+`
`+ie+`
`+de)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(N===""||q==="")&&(ee=!1);ee&&(L.diagnostics={runnable:O,programLog:U,vertexShader:{log:N,prefix:g},fragmentShader:{log:q,prefix:p}})}s.deleteShader(S),s.deleteShader(E),I=new cr(s,_),w=Sy(s,_)}let I;this.getUniforms=function(){return I===void 0&&C(this),I};let w;this.getAttributes=function(){return w===void 0&&C(this),w};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(_,py)),b},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=my++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=S,this.fragmentShader=E,this}function Fy(i,e,t,n,s,r,o){let a=new Gs,c=new fh,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(w){return l.add(w),w===0?"uv":`uv${w}`}function g(w,b,L,z,F){let A=z.fog,U=F.geometry,N=w.isMeshStandardMaterial?z.environment:null,q=(w.isMeshStandardMaterial?t:e).get(w.envMap||N),O=q&&q.mapping===co?q.image.height:null,ee=m[w.type];w.precision!==null&&(f=s.getMaxPrecision(w.precision),f!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",f,"instead."));let ie=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,de=ie!==void 0?ie.length:0,we=0;U.morphAttributes.position!==void 0&&(we=1),U.morphAttributes.normal!==void 0&&(we=2),U.morphAttributes.color!==void 0&&(we=3);let G,re,oe,k;if(ee){let ct=ii[ee];G=ct.vertexShader,re=ct.fragmentShader}else G=w.vertexShader,re=w.fragmentShader,c.update(w),oe=c.getVertexShaderID(w),k=c.getFragmentShaderID(w);let K=i.getRenderTarget(),ge=i.state.buffers.depth.getReversed(),Ce=F.isInstancedMesh===!0,Re=F.isBatchedMesh===!0,Ke=!!w.map,rt=!!w.matcap,D=!!q,ne=!!w.aoMap,Q=!!w.lightMap,j=!!w.bumpMap,J=!!w.normalMap,me=!!w.displacementMap,ae=!!w.emissiveMap,_e=!!w.metalnessMap,We=!!w.roughnessMap,Ge=w.anisotropy>0,R=w.clearcoat>0,v=w.dispersion>0,W=w.iridescence>0,Z=w.sheen>0,se=w.transmission>0,$=Ge&&!!w.anisotropyMap,Ne=R&&!!w.clearcoatMap,pe=R&&!!w.clearcoatNormalMap,Pe=R&&!!w.clearcoatRoughnessMap,Le=W&&!!w.iridescenceMap,ce=W&&!!w.iridescenceThicknessMap,Se=Z&&!!w.sheenColorMap,ke=Z&&!!w.sheenRoughnessMap,Ue=!!w.specularMap,Me=!!w.specularColorMap,Ze=!!w.specularIntensityMap,B=se&&!!w.transmissionMap,fe=se&&!!w.thicknessMap,xe=!!w.gradientMap,Ae=!!w.alphaMap,le=w.alphaTest>0,te=!!w.alphaHash,De=!!w.extensions,Xe=bi;w.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(Xe=i.toneMapping);let _t={shaderID:ee,shaderType:w.type,shaderName:w.name,vertexShader:G,fragmentShader:re,defines:w.defines,customVertexShaderID:oe,customFragmentShaderID:k,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:f,batching:Re,batchingColor:Re&&F._colorsTexture!==null,instancing:Ce,instancingColor:Ce&&F.instanceColor!==null,instancingMorph:Ce&&F.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:K===null?i.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:Dt,alphaToCoverage:!!w.alphaToCoverage,map:Ke,matcap:rt,envMap:D,envMapMode:D&&q.mapping,envMapCubeUVHeight:O,aoMap:ne,lightMap:Q,bumpMap:j,normalMap:J,displacementMap:d&&me,emissiveMap:ae,normalMapObjectSpace:J&&w.normalMapType===Wd,normalMapTangentSpace:J&&w.normalMapType===mc,metalnessMap:_e,roughnessMap:We,anisotropy:Ge,anisotropyMap:$,clearcoat:R,clearcoatMap:Ne,clearcoatNormalMap:pe,clearcoatRoughnessMap:Pe,dispersion:v,iridescence:W,iridescenceMap:Le,iridescenceThicknessMap:ce,sheen:Z,sheenColorMap:Se,sheenRoughnessMap:ke,specularMap:Ue,specularColorMap:Me,specularIntensityMap:Ze,transmission:se,transmissionMap:B,thicknessMap:fe,gradientMap:xe,opaque:w.transparent===!1&&w.blending===Ki&&w.alphaToCoverage===!1,alphaMap:Ae,alphaTest:le,alphaHash:te,combine:w.combine,mapUv:Ke&&_(w.map.channel),aoMapUv:ne&&_(w.aoMap.channel),lightMapUv:Q&&_(w.lightMap.channel),bumpMapUv:j&&_(w.bumpMap.channel),normalMapUv:J&&_(w.normalMap.channel),displacementMapUv:me&&_(w.displacementMap.channel),emissiveMapUv:ae&&_(w.emissiveMap.channel),metalnessMapUv:_e&&_(w.metalnessMap.channel),roughnessMapUv:We&&_(w.roughnessMap.channel),anisotropyMapUv:$&&_(w.anisotropyMap.channel),clearcoatMapUv:Ne&&_(w.clearcoatMap.channel),clearcoatNormalMapUv:pe&&_(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pe&&_(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Le&&_(w.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&_(w.iridescenceThicknessMap.channel),sheenColorMapUv:Se&&_(w.sheenColorMap.channel),sheenRoughnessMapUv:ke&&_(w.sheenRoughnessMap.channel),specularMapUv:Ue&&_(w.specularMap.channel),specularColorMapUv:Me&&_(w.specularColorMap.channel),specularIntensityMapUv:Ze&&_(w.specularIntensityMap.channel),transmissionMapUv:B&&_(w.transmissionMap.channel),thicknessMapUv:fe&&_(w.thicknessMap.channel),alphaMapUv:Ae&&_(w.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(J||Ge),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!U.attributes.uv&&(Ke||Ae),fog:!!A,useFog:w.fog===!0,fogExp2:!!A&&A.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ge,skinning:F.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:de,morphTextureStride:we,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Xe,decodeVideoTexture:Ke&&w.map.isVideoTexture===!0&&nt.getTransfer(w.map.colorSpace)===ht,decodeVideoTextureEmissive:ae&&w.emissiveMap.isVideoTexture===!0&&nt.getTransfer(w.emissiveMap.colorSpace)===ht,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===gt,flipSided:w.side===Gt,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:De&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(De&&w.extensions.multiDraw===!0||Re)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return _t.vertexUv1s=l.has(1),_t.vertexUv2s=l.has(2),_t.vertexUv3s=l.has(3),l.clear(),_t}function p(w){let b=[];if(w.shaderID?b.push(w.shaderID):(b.push(w.customVertexShaderID),b.push(w.customFragmentShaderID)),w.defines!==void 0)for(let L in w.defines)b.push(L),b.push(w.defines[L]);return w.isRawShaderMaterial===!1&&(M(b,w),y(b,w),b.push(i.outputColorSpace)),b.push(w.customProgramCacheKey),b.join()}function M(w,b){w.push(b.precision),w.push(b.outputColorSpace),w.push(b.envMapMode),w.push(b.envMapCubeUVHeight),w.push(b.mapUv),w.push(b.alphaMapUv),w.push(b.lightMapUv),w.push(b.aoMapUv),w.push(b.bumpMapUv),w.push(b.normalMapUv),w.push(b.displacementMapUv),w.push(b.emissiveMapUv),w.push(b.metalnessMapUv),w.push(b.roughnessMapUv),w.push(b.anisotropyMapUv),w.push(b.clearcoatMapUv),w.push(b.clearcoatNormalMapUv),w.push(b.clearcoatRoughnessMapUv),w.push(b.iridescenceMapUv),w.push(b.iridescenceThicknessMapUv),w.push(b.sheenColorMapUv),w.push(b.sheenRoughnessMapUv),w.push(b.specularMapUv),w.push(b.specularColorMapUv),w.push(b.specularIntensityMapUv),w.push(b.transmissionMapUv),w.push(b.thicknessMapUv),w.push(b.combine),w.push(b.fogExp2),w.push(b.sizeAttenuation),w.push(b.morphTargetsCount),w.push(b.morphAttributeCount),w.push(b.numDirLights),w.push(b.numPointLights),w.push(b.numSpotLights),w.push(b.numSpotLightMaps),w.push(b.numHemiLights),w.push(b.numRectAreaLights),w.push(b.numDirLightShadows),w.push(b.numPointLightShadows),w.push(b.numSpotLightShadows),w.push(b.numSpotLightShadowsWithMaps),w.push(b.numLightProbes),w.push(b.shadowMapType),w.push(b.toneMapping),w.push(b.numClippingPlanes),w.push(b.numClipIntersection),w.push(b.depthPacking)}function y(w,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),b.gradientMap&&a.enable(22),w.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),w.push(a.mask)}function x(w){let b=m[w.type],L;if(b){let z=ii[b];L=tf.clone(z.uniforms)}else L=w.uniforms;return L}function S(w,b){let L;for(let z=0,F=h.length;z<F;z++){let A=h[z];if(A.cacheKey===b){L=A,++L.usedTimes;break}}return L===void 0&&(L=new Ny(i,b,w,r),h.push(L)),L}function E(w){if(--w.usedTimes===0){let b=h.indexOf(w);h[b]=h[h.length-1],h.pop(),w.destroy()}}function C(w){c.remove(w)}function I(){c.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:x,acquireProgram:S,releaseProgram:E,releaseShaderCache:C,programs:h,dispose:I}}function Oy(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function By(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Cf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function If(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,d,f,m,_,g){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:_,group:g},i[e]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=_,p.group=g),e++,p}function a(u,d,f,m,_,g){let p=o(u,d,f,m,_,g);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function c(u,d,f,m,_,g){let p=o(u,d,f,m,_,g);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function l(u,d){t.length>1&&t.sort(u||By),n.length>1&&n.sort(d||Cf),s.length>1&&s.sort(d||Cf)}function h(){for(let u=e,d=i.length;u<d;u++){let f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function zy(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new If,i.set(n,[o])):s>=r.length?(o=new If,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function ky(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new Ee};break;case"SpotLight":t={position:new P,direction:new P,color:new Ee,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new Ee,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new Ee,groundColor:new Ee};break;case"RectAreaLight":t={color:new Ee,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function Vy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}function Hy(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Wy(i){let e=new ky,t=Vy(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new P);let s=new P,r=new Be,o=new Be;function a(l){let h=0,u=0,d=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let f=0,m=0,_=0,g=0,p=0,M=0,y=0,x=0,S=0,E=0,C=0;l.sort(Hy);for(let w=0,b=l.length;w<b;w++){let L=l[w],z=L.color,F=L.intensity,A=L.distance,U=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=z.r*F,u+=z.g*F,d+=z.b*F;else if(L.isLightProbe){for(let N=0;N<9;N++)n.probe[N].addScaledVector(L.sh.coefficients[N],F);C++}else if(L.isDirectionalLight){let N=e.get(L);if(N.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let q=L.shadow,O=t.get(L);O.shadowIntensity=q.intensity,O.shadowBias=q.bias,O.shadowNormalBias=q.normalBias,O.shadowRadius=q.radius,O.shadowMapSize=q.mapSize,n.directionalShadow[f]=O,n.directionalShadowMap[f]=U,n.directionalShadowMatrix[f]=L.shadow.matrix,M++}n.directional[f]=N,f++}else if(L.isSpotLight){let N=e.get(L);N.position.setFromMatrixPosition(L.matrixWorld),N.color.copy(z).multiplyScalar(F),N.distance=A,N.coneCos=Math.cos(L.angle),N.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),N.decay=L.decay,n.spot[_]=N;let q=L.shadow;if(L.map&&(n.spotLightMap[S]=L.map,S++,q.updateMatrices(L),L.castShadow&&E++),n.spotLightMatrix[_]=q.matrix,L.castShadow){let O=t.get(L);O.shadowIntensity=q.intensity,O.shadowBias=q.bias,O.shadowNormalBias=q.normalBias,O.shadowRadius=q.radius,O.shadowMapSize=q.mapSize,n.spotShadow[_]=O,n.spotShadowMap[_]=U,x++}_++}else if(L.isRectAreaLight){let N=e.get(L);N.color.copy(z).multiplyScalar(F),N.halfWidth.set(L.width*.5,0,0),N.halfHeight.set(0,L.height*.5,0),n.rectArea[g]=N,g++}else if(L.isPointLight){let N=e.get(L);if(N.color.copy(L.color).multiplyScalar(L.intensity),N.distance=L.distance,N.decay=L.decay,L.castShadow){let q=L.shadow,O=t.get(L);O.shadowIntensity=q.intensity,O.shadowBias=q.bias,O.shadowNormalBias=q.normalBias,O.shadowRadius=q.radius,O.shadowMapSize=q.mapSize,O.shadowCameraNear=q.camera.near,O.shadowCameraFar=q.camera.far,n.pointShadow[m]=O,n.pointShadowMap[m]=U,n.pointShadowMatrix[m]=L.shadow.matrix,y++}n.point[m]=N,m++}else if(L.isHemisphereLight){let N=e.get(L);N.skyColor.copy(L.color).multiplyScalar(F),N.groundColor.copy(L.groundColor).multiplyScalar(F),n.hemi[p]=N,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ve.LTC_FLOAT_1,n.rectAreaLTC2=ve.LTC_FLOAT_2):(n.rectAreaLTC1=ve.LTC_HALF_1,n.rectAreaLTC2=ve.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let I=n.hash;(I.directionalLength!==f||I.pointLength!==m||I.spotLength!==_||I.rectAreaLength!==g||I.hemiLength!==p||I.numDirectionalShadows!==M||I.numPointShadows!==y||I.numSpotShadows!==x||I.numSpotMaps!==S||I.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=x+S-E,n.spotLightMap.length=S,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=C,I.directionalLength=f,I.pointLength=m,I.spotLength=_,I.rectAreaLength=g,I.hemiLength=p,I.numDirectionalShadows=M,I.numPointShadows=y,I.numSpotShadows=x,I.numSpotMaps=S,I.numLightProbes=C,n.version=Gy++)}function c(l,h){let u=0,d=0,f=0,m=0,_=0,g=h.matrixWorldInverse;for(let p=0,M=l.length;p<M;p++){let y=l[p];if(y.isDirectionalLight){let x=n.directional[u];x.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),u++}else if(y.isSpotLight){let x=n.spot[f];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),f++}else if(y.isRectAreaLight){let x=n.rectArea[m];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(g),o.identity(),r.copy(y.matrixWorld),r.premultiply(g),o.extractRotation(r),x.halfWidth.set(y.width*.5,0,0),x.halfHeight.set(0,y.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),m++}else if(y.isPointLight){let x=n.point[d];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(g),d++}else if(y.isHemisphereLight){let x=n.hemi[_];x.direction.setFromMatrixPosition(y.matrixWorld),x.direction.transformDirection(g),_++}}}return{setup:a,setupView:c,state:n}}function Pf(i){let e=new Wy(i),t=[],n=[];function s(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function c(h){e.setupView(t,h)}let l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function Xy(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new Pf(i),e.set(s,[a])):r>=o.length?(a=new Pf(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}function Zy(i,e,t){let n=new Ys,s=new he,r=new he,o=new st,a=new fa({depthPacking:Hd}),c=new pa,l={},h=t.maxTextureSize,u={[kn]:Gt,[Gt]:kn,[gt]:gt},d=new Vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new he},radius:{value:4}},vertexShader:qy,fragmentShader:Yy}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new ot;m.setAttribute("position",new ft(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new qe(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nl;let p=this.type;this.render=function(E,C,I){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||E.length===0)return;let w=i.getRenderTarget(),b=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),z=i.state;z.setBlending(Mi),z.buffers.depth.getReversed()===!0?z.buffers.color.setClear(0,0,0,0):z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);let F=p!==ni&&this.type===ni,A=p===ni&&this.type!==ni;for(let U=0,N=E.length;U<N;U++){let q=E[U],O=q.shadow;if(O===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;s.copy(O.mapSize);let ee=O.getFrameExtents();if(s.multiply(ee),r.copy(O.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ee.x),s.x=r.x*ee.x,O.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ee.y),s.y=r.y*ee.y,O.mapSize.y=r.y)),O.map===null||F===!0||A===!0){let de=this.type!==ni?{minFilter:kt,magFilter:kt}:{};O.map!==null&&O.map.dispose(),O.map=new Kn(s.x,s.y,de),O.map.texture.name=q.name+".shadowMap",O.camera.updateProjectionMatrix()}i.setRenderTarget(O.map),i.clear();let ie=O.getViewportCount();for(let de=0;de<ie;de++){let we=O.getViewport(de);o.set(r.x*we.x,r.y*we.y,r.x*we.z,r.y*we.w),z.viewport(o),O.updateMatrices(q,de),n=O.getFrustum(),x(C,I,O.camera,q,this.type)}O.isPointLightShadow!==!0&&this.type===ni&&M(O,I),O.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(w,b,L)};function M(E,C){let I=e.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Kn(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(C,null,I,d,_,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(C,null,I,f,_,null)}function y(E,C,I,w){let b=null,L=I.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(L!==void 0)b=L;else if(b=I.isPointLight===!0?c:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let z=b.uuid,F=C.uuid,A=l[z];A===void 0&&(A={},l[z]=A);let U=A[F];U===void 0&&(U=b.clone(),A[F]=U,C.addEventListener("dispose",S)),b=U}if(b.visible=C.visible,b.wireframe=C.wireframe,w===ni?b.side=C.shadowSide!==null?C.shadowSide:C.side:b.side=C.shadowSide!==null?C.shadowSide:u[C.side],b.alphaMap=C.alphaMap,b.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,b.map=C.map,b.clipShadows=C.clipShadows,b.clippingPlanes=C.clippingPlanes,b.clipIntersection=C.clipIntersection,b.displacementMap=C.displacementMap,b.displacementScale=C.displacementScale,b.displacementBias=C.displacementBias,b.wireframeLinewidth=C.wireframeLinewidth,b.linewidth=C.linewidth,I.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let z=i.properties.get(b);z.light=I}return b}function x(E,C,I,w,b){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&b===ni)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,E.matrixWorld);let F=e.update(E),A=E.material;if(Array.isArray(A)){let U=F.groups;for(let N=0,q=U.length;N<q;N++){let O=U[N],ee=A[O.materialIndex];if(ee&&ee.visible){let ie=y(E,ee,w,b);E.onBeforeShadow(i,E,C,I,F,ie,O),i.renderBufferDirect(I,null,F,ie,E,O),E.onAfterShadow(i,E,C,I,F,ie,O)}}}else if(A.visible){let U=y(E,A,w,b);E.onBeforeShadow(i,E,C,I,F,U,null),i.renderBufferDirect(I,null,F,U,E,null),E.onAfterShadow(i,E,C,I,F,U,null)}}let z=E.children;for(let F=0,A=z.length;F<A;F++)x(z[F],C,I,w,b)}function S(E){E.target.removeEventListener("dispose",S);for(let I in l){let w=l[I],b=E.target.uuid;b in w&&(w[b].dispose(),delete w[b])}}}function $y(i,e){function t(){let B=!1,fe=new st,xe=null,Ae=new st(0,0,0,0);return{setMask:function(le){xe!==le&&!B&&(i.colorMask(le,le,le,le),xe=le)},setLocked:function(le){B=le},setClear:function(le,te,De,Xe,_t){_t===!0&&(le*=Xe,te*=Xe,De*=Xe),fe.set(le,te,De,Xe),Ae.equals(fe)===!1&&(i.clearColor(le,te,De,Xe),Ae.copy(fe))},reset:function(){B=!1,xe=null,Ae.set(-1,0,0,0)}}}function n(){let B=!1,fe=!1,xe=null,Ae=null,le=null;return{setReversed:function(te){if(fe!==te){let De=e.get("EXT_clip_control");te?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT),fe=te;let Xe=le;le=null,this.setClear(Xe)}},getReversed:function(){return fe},setTest:function(te){te?K(i.DEPTH_TEST):ge(i.DEPTH_TEST)},setMask:function(te){xe!==te&&!B&&(i.depthMask(te),xe=te)},setFunc:function(te){if(fe&&(te=Ky[te]),Ae!==te){switch(te){case Sa:i.depthFunc(i.NEVER);break;case wa:i.depthFunc(i.ALWAYS);break;case Ta:i.depthFunc(i.LESS);break;case $i:i.depthFunc(i.LEQUAL);break;case Ea:i.depthFunc(i.EQUAL);break;case Aa:i.depthFunc(i.GEQUAL);break;case Ra:i.depthFunc(i.GREATER);break;case Ca:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ae=te}},setLocked:function(te){B=te},setClear:function(te){le!==te&&(fe&&(te=1-te),i.clearDepth(te),le=te)},reset:function(){B=!1,xe=null,Ae=null,le=null,fe=!1}}}function s(){let B=!1,fe=null,xe=null,Ae=null,le=null,te=null,De=null,Xe=null,_t=null;return{setTest:function(ct){B||(ct?K(i.STENCIL_TEST):ge(i.STENCIL_TEST))},setMask:function(ct){fe!==ct&&!B&&(i.stencilMask(ct),fe=ct)},setFunc:function(ct,ai,Yn){(xe!==ct||Ae!==ai||le!==Yn)&&(i.stencilFunc(ct,ai,Yn),xe=ct,Ae=ai,le=Yn)},setOp:function(ct,ai,Yn){(te!==ct||De!==ai||Xe!==Yn)&&(i.stencilOp(ct,ai,Yn),te=ct,De=ai,Xe=Yn)},setLocked:function(ct){B=ct},setClear:function(ct){_t!==ct&&(i.clearStencil(ct),_t=ct)},reset:function(){B=!1,fe=null,xe=null,Ae=null,le=null,te=null,De=null,Xe=null,_t=null}}}let r=new t,o=new n,a=new s,c=new WeakMap,l=new WeakMap,h={},u={},d=new WeakMap,f=[],m=null,_=!1,g=null,p=null,M=null,y=null,x=null,S=null,E=null,C=new Ee(0,0,0),I=0,w=!1,b=null,L=null,z=null,F=null,A=null,U=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,q=0,O=i.getParameter(i.VERSION);O.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(O)[1]),N=q>=1):O.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),N=q>=2);let ee=null,ie={},de=i.getParameter(i.SCISSOR_BOX),we=i.getParameter(i.VIEWPORT),G=new st().fromArray(de),re=new st().fromArray(we);function oe(B,fe,xe,Ae){let le=new Uint8Array(4),te=i.createTexture();i.bindTexture(B,te),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let De=0;De<xe;De++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(fe,0,i.RGBA,1,1,Ae,0,i.RGBA,i.UNSIGNED_BYTE,le):i.texImage2D(fe+De,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,le);return te}let k={};k[i.TEXTURE_2D]=oe(i.TEXTURE_2D,i.TEXTURE_2D,1),k[i.TEXTURE_CUBE_MAP]=oe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),k[i.TEXTURE_2D_ARRAY]=oe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),k[i.TEXTURE_3D]=oe(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),K(i.DEPTH_TEST),o.setFunc($i),j(!1),J(Dl),K(i.CULL_FACE),ne(Mi);function K(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function ge(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function Ce(B,fe){return u[B]!==fe?(i.bindFramebuffer(B,fe),u[B]=fe,B===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=fe),B===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=fe),!0):!1}function Re(B,fe){let xe=f,Ae=!1;if(B){xe=d.get(fe),xe===void 0&&(xe=[],d.set(fe,xe));let le=B.textures;if(xe.length!==le.length||xe[0]!==i.COLOR_ATTACHMENT0){for(let te=0,De=le.length;te<De;te++)xe[te]=i.COLOR_ATTACHMENT0+te;xe.length=le.length,Ae=!0}}else xe[0]!==i.BACK&&(xe[0]=i.BACK,Ae=!0);Ae&&i.drawBuffers(xe)}function Ke(B){return m!==B?(i.useProgram(B),m=B,!0):!1}let rt={[Li]:i.FUNC_ADD,[md]:i.FUNC_SUBTRACT,[gd]:i.FUNC_REVERSE_SUBTRACT};rt[_d]=i.MIN,rt[xd]=i.MAX;let D={[yd]:i.ZERO,[vd]:i.ONE,[Md]:i.SRC_COLOR,[ea]:i.SRC_ALPHA,[Ad]:i.SRC_ALPHA_SATURATE,[Td]:i.DST_COLOR,[Sd]:i.DST_ALPHA,[bd]:i.ONE_MINUS_SRC_COLOR,[ta]:i.ONE_MINUS_SRC_ALPHA,[Ed]:i.ONE_MINUS_DST_COLOR,[wd]:i.ONE_MINUS_DST_ALPHA,[Rd]:i.CONSTANT_COLOR,[Cd]:i.ONE_MINUS_CONSTANT_COLOR,[Id]:i.CONSTANT_ALPHA,[Pd]:i.ONE_MINUS_CONSTANT_ALPHA};function ne(B,fe,xe,Ae,le,te,De,Xe,_t,ct){if(B===Mi){_===!0&&(ge(i.BLEND),_=!1);return}if(_===!1&&(K(i.BLEND),_=!0),B!==pd){if(B!==g||ct!==w){if((p!==Li||x!==Li)&&(i.blendEquation(i.FUNC_ADD),p=Li,x=Li),ct)switch(B){case Ki:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ul:i.blendFunc(i.ONE,i.ONE);break;case Fl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ol:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case Ki:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ul:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Fl:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ol:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}M=null,y=null,S=null,E=null,C.set(0,0,0),I=0,g=B,w=ct}return}le=le||fe,te=te||xe,De=De||Ae,(fe!==p||le!==x)&&(i.blendEquationSeparate(rt[fe],rt[le]),p=fe,x=le),(xe!==M||Ae!==y||te!==S||De!==E)&&(i.blendFuncSeparate(D[xe],D[Ae],D[te],D[De]),M=xe,y=Ae,S=te,E=De),(Xe.equals(C)===!1||_t!==I)&&(i.blendColor(Xe.r,Xe.g,Xe.b,_t),C.copy(Xe),I=_t),g=B,w=!1}function Q(B,fe){B.side===gt?ge(i.CULL_FACE):K(i.CULL_FACE);let xe=B.side===Gt;fe&&(xe=!xe),j(xe),B.blending===Ki&&B.transparent===!1?ne(Mi):ne(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),r.setMask(B.colorWrite);let Ae=B.stencilWrite;a.setTest(Ae),Ae&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),ae(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?K(i.SAMPLE_ALPHA_TO_COVERAGE):ge(i.SAMPLE_ALPHA_TO_COVERAGE)}function j(B){b!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),b=B)}function J(B){B!==dd?(K(i.CULL_FACE),B!==L&&(B===Dl?i.cullFace(i.BACK):B===fd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ge(i.CULL_FACE),L=B}function me(B){B!==z&&(N&&i.lineWidth(B),z=B)}function ae(B,fe,xe){B?(K(i.POLYGON_OFFSET_FILL),(F!==fe||A!==xe)&&(i.polygonOffset(fe,xe),F=fe,A=xe)):ge(i.POLYGON_OFFSET_FILL)}function _e(B){B?K(i.SCISSOR_TEST):ge(i.SCISSOR_TEST)}function We(B){B===void 0&&(B=i.TEXTURE0+U-1),ee!==B&&(i.activeTexture(B),ee=B)}function Ge(B,fe,xe){xe===void 0&&(ee===null?xe=i.TEXTURE0+U-1:xe=ee);let Ae=ie[xe];Ae===void 0&&(Ae={type:void 0,texture:void 0},ie[xe]=Ae),(Ae.type!==B||Ae.texture!==fe)&&(ee!==xe&&(i.activeTexture(xe),ee=xe),i.bindTexture(B,fe||k[B]),Ae.type=B,Ae.texture=fe)}function R(){let B=ie[ee];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function v(){try{i.compressedTexImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function W(){try{i.compressedTexImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Z(){try{i.texSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function se(){try{i.texSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function $(){try{i.compressedTexSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ne(){try{i.compressedTexSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function pe(){try{i.texStorage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Pe(){try{i.texStorage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Le(){try{i.texImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ce(){try{i.texImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Se(B){G.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),G.copy(B))}function ke(B){re.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),re.copy(B))}function Ue(B,fe){let xe=l.get(fe);xe===void 0&&(xe=new WeakMap,l.set(fe,xe));let Ae=xe.get(B);Ae===void 0&&(Ae=i.getUniformBlockIndex(fe,B.name),xe.set(B,Ae))}function Me(B,fe){let Ae=l.get(fe).get(B);c.get(fe)!==Ae&&(i.uniformBlockBinding(fe,Ae,B.__bindingPointIndex),c.set(fe,Ae))}function Ze(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ee=null,ie={},u={},d=new WeakMap,f=[],m=null,_=!1,g=null,p=null,M=null,y=null,x=null,S=null,E=null,C=new Ee(0,0,0),I=0,w=!1,b=null,L=null,z=null,F=null,A=null,G.set(0,0,i.canvas.width,i.canvas.height),re.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:K,disable:ge,bindFramebuffer:Ce,drawBuffers:Re,useProgram:Ke,setBlending:ne,setMaterial:Q,setFlipSided:j,setCullFace:J,setLineWidth:me,setPolygonOffset:ae,setScissorTest:_e,activeTexture:We,bindTexture:Ge,unbindTexture:R,compressedTexImage2D:v,compressedTexImage3D:W,texImage2D:Le,texImage3D:ce,updateUBOMapping:Ue,uniformBlockBinding:Me,texStorage2D:pe,texStorage3D:Pe,texSubImage2D:Z,texSubImage3D:se,compressedTexSubImage2D:$,compressedTexSubImage3D:Ne,scissor:Se,viewport:ke,reset:Ze}}function Jy(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new he,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(R,v){return f?new OffscreenCanvas(R,v):zs("canvas")}function _(R,v,W){let Z=1,se=Ge(R);if((se.width>W||se.height>W)&&(Z=W/Math.max(se.width,se.height)),Z<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let $=Math.floor(Z*se.width),Ne=Math.floor(Z*se.height);u===void 0&&(u=m($,Ne));let pe=v?m($,Ne):u;return pe.width=$,pe.height=Ne,pe.getContext("2d").drawImage(R,0,0,$,Ne),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+se.width+"x"+se.height+") to ("+$+"x"+Ne+")."),pe}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+se.width+"x"+se.height+")."),R;return R}function g(R){return R.generateMipmaps}function p(R){i.generateMipmap(R)}function M(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(R,v,W,Z,se=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let $=v;if(v===i.RED&&(W===i.FLOAT&&($=i.R32F),W===i.HALF_FLOAT&&($=i.R16F),W===i.UNSIGNED_BYTE&&($=i.R8)),v===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&($=i.R8UI),W===i.UNSIGNED_SHORT&&($=i.R16UI),W===i.UNSIGNED_INT&&($=i.R32UI),W===i.BYTE&&($=i.R8I),W===i.SHORT&&($=i.R16I),W===i.INT&&($=i.R32I)),v===i.RG&&(W===i.FLOAT&&($=i.RG32F),W===i.HALF_FLOAT&&($=i.RG16F),W===i.UNSIGNED_BYTE&&($=i.RG8)),v===i.RG_INTEGER&&(W===i.UNSIGNED_BYTE&&($=i.RG8UI),W===i.UNSIGNED_SHORT&&($=i.RG16UI),W===i.UNSIGNED_INT&&($=i.RG32UI),W===i.BYTE&&($=i.RG8I),W===i.SHORT&&($=i.RG16I),W===i.INT&&($=i.RG32I)),v===i.RGB_INTEGER&&(W===i.UNSIGNED_BYTE&&($=i.RGB8UI),W===i.UNSIGNED_SHORT&&($=i.RGB16UI),W===i.UNSIGNED_INT&&($=i.RGB32UI),W===i.BYTE&&($=i.RGB8I),W===i.SHORT&&($=i.RGB16I),W===i.INT&&($=i.RGB32I)),v===i.RGBA_INTEGER&&(W===i.UNSIGNED_BYTE&&($=i.RGBA8UI),W===i.UNSIGNED_SHORT&&($=i.RGBA16UI),W===i.UNSIGNED_INT&&($=i.RGBA32UI),W===i.BYTE&&($=i.RGBA8I),W===i.SHORT&&($=i.RGBA16I),W===i.INT&&($=i.RGBA32I)),v===i.RGB&&(W===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),W===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),v===i.RGBA){let Ne=se?Ir:nt.getTransfer(Z);W===i.FLOAT&&($=i.RGBA32F),W===i.HALF_FLOAT&&($=i.RGBA16F),W===i.UNSIGNED_BYTE&&($=Ne===ht?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function x(R,v){let W;return R?v===null||v===Oi||v===ir?W=i.DEPTH24_STENCIL8:v===qt?W=i.DEPTH32F_STENCIL8:v===nr&&(W=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Oi||v===ir?W=i.DEPTH_COMPONENT24:v===qt?W=i.DEPTH_COMPONENT32F:v===nr&&(W=i.DEPTH_COMPONENT16),W}function S(R,v){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==kt&&R.minFilter!==Mt?Math.log2(Math.max(v.width,v.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?v.mipmaps.length:1}function E(R){let v=R.target;v.removeEventListener("dispose",E),I(v),v.isVideoTexture&&h.delete(v)}function C(R){let v=R.target;v.removeEventListener("dispose",C),b(v)}function I(R){let v=n.get(R);if(v.__webglInit===void 0)return;let W=R.source,Z=d.get(W);if(Z){let se=Z[v.__cacheKey];se.usedTimes--,se.usedTimes===0&&w(R),Object.keys(Z).length===0&&d.delete(W)}n.remove(R)}function w(R){let v=n.get(R);i.deleteTexture(v.__webglTexture);let W=R.source,Z=d.get(W);delete Z[v.__cacheKey],o.memory.textures--}function b(R){let v=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(v.__webglFramebuffer[Z]))for(let se=0;se<v.__webglFramebuffer[Z].length;se++)i.deleteFramebuffer(v.__webglFramebuffer[Z][se]);else i.deleteFramebuffer(v.__webglFramebuffer[Z]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[Z])}else{if(Array.isArray(v.__webglFramebuffer))for(let Z=0;Z<v.__webglFramebuffer.length;Z++)i.deleteFramebuffer(v.__webglFramebuffer[Z]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let Z=0;Z<v.__webglColorRenderbuffer.length;Z++)v.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[Z]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let W=R.textures;for(let Z=0,se=W.length;Z<se;Z++){let $=n.get(W[Z]);$.__webglTexture&&(i.deleteTexture($.__webglTexture),o.memory.textures--),n.remove(W[Z])}n.remove(R)}let L=0;function z(){L=0}function F(){let R=L;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),L+=1,R}function A(R){let v=[];return v.push(R.wrapS),v.push(R.wrapT),v.push(R.wrapR||0),v.push(R.magFilter),v.push(R.minFilter),v.push(R.anisotropy),v.push(R.internalFormat),v.push(R.format),v.push(R.type),v.push(R.generateMipmaps),v.push(R.premultiplyAlpha),v.push(R.flipY),v.push(R.unpackAlignment),v.push(R.colorSpace),v.join()}function U(R,v){let W=n.get(R);if(R.isVideoTexture&&_e(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&W.__version!==R.version){let Z=R.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{k(W,R,v);return}}else R.isExternalTexture&&(W.__webglTexture=R.sourceTexture?R.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+v)}function N(R,v){let W=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&W.__version!==R.version){k(W,R,v);return}t.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+v)}function q(R,v){let W=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&W.__version!==R.version){k(W,R,v);return}t.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+v)}function O(R,v){let W=n.get(R);if(R.version>0&&W.__version!==R.version){K(W,R,v);return}t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+v)}let ee={[gn]:i.REPEAT,[Tn]:i.CLAMP_TO_EDGE,[Os]:i.MIRRORED_REPEAT},ie={[kt]:i.NEAREST,[Da]:i.NEAREST_MIPMAP_NEAREST,[ds]:i.NEAREST_MIPMAP_LINEAR,[Mt]:i.LINEAR,[tr]:i.LINEAR_MIPMAP_NEAREST,[ln]:i.LINEAR_MIPMAP_LINEAR},de={[Xd]:i.NEVER,[Jd]:i.ALWAYS,[qd]:i.LESS,[Yl]:i.LEQUAL,[Yd]:i.EQUAL,[$d]:i.GEQUAL,[Zd]:i.GREATER,[Kd]:i.NOTEQUAL};function we(R,v){if(v.type===qt&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Mt||v.magFilter===tr||v.magFilter===ds||v.magFilter===ln||v.minFilter===Mt||v.minFilter===tr||v.minFilter===ds||v.minFilter===ln)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,ee[v.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,ee[v.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,ee[v.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,ie[v.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,ie[v.minFilter]),v.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,de[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===kt||v.minFilter!==ds&&v.minFilter!==ln||v.type===qt&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let W=e.get("EXT_texture_filter_anisotropic");i.texParameterf(R,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function G(R,v){let W=!1;R.__webglInit===void 0&&(R.__webglInit=!0,v.addEventListener("dispose",E));let Z=v.source,se=d.get(Z);se===void 0&&(se={},d.set(Z,se));let $=A(v);if($!==R.__cacheKey){se[$]===void 0&&(se[$]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,W=!0),se[$].usedTimes++;let Ne=se[R.__cacheKey];Ne!==void 0&&(se[R.__cacheKey].usedTimes--,Ne.usedTimes===0&&w(v)),R.__cacheKey=$,R.__webglTexture=se[$].texture}return W}function re(R,v,W){return Math.floor(Math.floor(R/W)/v)}function oe(R,v,W,Z){let $=R.updateRanges;if($.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,v.width,v.height,W,Z,v.data);else{$.sort((ce,Se)=>ce.start-Se.start);let Ne=0;for(let ce=1;ce<$.length;ce++){let Se=$[Ne],ke=$[ce],Ue=Se.start+Se.count,Me=re(ke.start,v.width,4),Ze=re(Se.start,v.width,4);ke.start<=Ue+1&&Me===Ze&&re(ke.start+ke.count-1,v.width,4)===Me?Se.count=Math.max(Se.count,ke.start+ke.count-Se.start):(++Ne,$[Ne]=ke)}$.length=Ne+1;let pe=i.getParameter(i.UNPACK_ROW_LENGTH),Pe=i.getParameter(i.UNPACK_SKIP_PIXELS),Le=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,v.width);for(let ce=0,Se=$.length;ce<Se;ce++){let ke=$[ce],Ue=Math.floor(ke.start/4),Me=Math.ceil(ke.count/4),Ze=Ue%v.width,B=Math.floor(Ue/v.width),fe=Me,xe=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ze),i.pixelStorei(i.UNPACK_SKIP_ROWS,B),t.texSubImage2D(i.TEXTURE_2D,0,Ze,B,fe,xe,W,Z,v.data)}R.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,pe),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Pe),i.pixelStorei(i.UNPACK_SKIP_ROWS,Le)}}function k(R,v,W){let Z=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&(Z=i.TEXTURE_3D);let se=G(R,v),$=v.source;t.bindTexture(Z,R.__webglTexture,i.TEXTURE0+W);let Ne=n.get($);if($.version!==Ne.__version||se===!0){t.activeTexture(i.TEXTURE0+W);let pe=nt.getPrimaries(nt.workingColorSpace),Pe=v.colorSpace===Si?null:nt.getPrimaries(v.colorSpace),Le=v.colorSpace===Si||pe===Pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Le);let ce=_(v.image,!1,s.maxTextureSize);ce=We(v,ce);let Se=r.convert(v.format,v.colorSpace),ke=r.convert(v.type),Ue=y(v.internalFormat,Se,ke,v.colorSpace,v.isVideoTexture);we(Z,v);let Me,Ze=v.mipmaps,B=v.isVideoTexture!==!0,fe=Ne.__version===void 0||se===!0,xe=$.dataReady,Ae=S(v,ce);if(v.isDepthTexture)Ue=x(v.format===sr,v.type),fe&&(B?t.texStorage2D(i.TEXTURE_2D,1,Ue,ce.width,ce.height):t.texImage2D(i.TEXTURE_2D,0,Ue,ce.width,ce.height,0,Se,ke,null));else if(v.isDataTexture)if(Ze.length>0){B&&fe&&t.texStorage2D(i.TEXTURE_2D,Ae,Ue,Ze[0].width,Ze[0].height);for(let le=0,te=Ze.length;le<te;le++)Me=Ze[le],B?xe&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,Me.width,Me.height,Se,ke,Me.data):t.texImage2D(i.TEXTURE_2D,le,Ue,Me.width,Me.height,0,Se,ke,Me.data);v.generateMipmaps=!1}else B?(fe&&t.texStorage2D(i.TEXTURE_2D,Ae,Ue,ce.width,ce.height),xe&&oe(v,ce,Se,ke)):t.texImage2D(i.TEXTURE_2D,0,Ue,ce.width,ce.height,0,Se,ke,ce.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){B&&fe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ae,Ue,Ze[0].width,Ze[0].height,ce.depth);for(let le=0,te=Ze.length;le<te;le++)if(Me=Ze[le],v.format!==jt)if(Se!==null)if(B){if(xe)if(v.layerUpdates.size>0){let De=th(Me.width,Me.height,v.format,v.type);for(let Xe of v.layerUpdates){let _t=Me.data.subarray(Xe*De/Me.data.BYTES_PER_ELEMENT,(Xe+1)*De/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,Xe,Me.width,Me.height,1,Se,_t)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,0,Me.width,Me.height,ce.depth,Se,Me.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,le,Ue,Me.width,Me.height,ce.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else B?xe&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,le,0,0,0,Me.width,Me.height,ce.depth,Se,ke,Me.data):t.texImage3D(i.TEXTURE_2D_ARRAY,le,Ue,Me.width,Me.height,ce.depth,0,Se,ke,Me.data)}else{B&&fe&&t.texStorage2D(i.TEXTURE_2D,Ae,Ue,Ze[0].width,Ze[0].height);for(let le=0,te=Ze.length;le<te;le++)Me=Ze[le],v.format!==jt?Se!==null?B?xe&&t.compressedTexSubImage2D(i.TEXTURE_2D,le,0,0,Me.width,Me.height,Se,Me.data):t.compressedTexImage2D(i.TEXTURE_2D,le,Ue,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):B?xe&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,Me.width,Me.height,Se,ke,Me.data):t.texImage2D(i.TEXTURE_2D,le,Ue,Me.width,Me.height,0,Se,ke,Me.data)}else if(v.isDataArrayTexture)if(B){if(fe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ae,Ue,ce.width,ce.height,ce.depth),xe)if(v.layerUpdates.size>0){let le=th(ce.width,ce.height,v.format,v.type);for(let te of v.layerUpdates){let De=ce.data.subarray(te*le/ce.data.BYTES_PER_ELEMENT,(te+1)*le/ce.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,te,ce.width,ce.height,1,Se,ke,De)}v.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ce.width,ce.height,ce.depth,Se,ke,ce.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ue,ce.width,ce.height,ce.depth,0,Se,ke,ce.data);else if(v.isData3DTexture)B?(fe&&t.texStorage3D(i.TEXTURE_3D,Ae,Ue,ce.width,ce.height,ce.depth),xe&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ce.width,ce.height,ce.depth,Se,ke,ce.data)):t.texImage3D(i.TEXTURE_3D,0,Ue,ce.width,ce.height,ce.depth,0,Se,ke,ce.data);else if(v.isFramebufferTexture){if(fe)if(B)t.texStorage2D(i.TEXTURE_2D,Ae,Ue,ce.width,ce.height);else{let le=ce.width,te=ce.height;for(let De=0;De<Ae;De++)t.texImage2D(i.TEXTURE_2D,De,Ue,le,te,0,Se,ke,null),le>>=1,te>>=1}}else if(Ze.length>0){if(B&&fe){let le=Ge(Ze[0]);t.texStorage2D(i.TEXTURE_2D,Ae,Ue,le.width,le.height)}for(let le=0,te=Ze.length;le<te;le++)Me=Ze[le],B?xe&&t.texSubImage2D(i.TEXTURE_2D,le,0,0,Se,ke,Me):t.texImage2D(i.TEXTURE_2D,le,Ue,Se,ke,Me);v.generateMipmaps=!1}else if(B){if(fe){let le=Ge(ce);t.texStorage2D(i.TEXTURE_2D,Ae,Ue,le.width,le.height)}xe&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Se,ke,ce)}else t.texImage2D(i.TEXTURE_2D,0,Ue,Se,ke,ce);g(v)&&p(Z),Ne.__version=$.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function K(R,v,W){if(v.image.length!==6)return;let Z=G(R,v),se=v.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+W);let $=n.get(se);if(se.version!==$.__version||Z===!0){t.activeTexture(i.TEXTURE0+W);let Ne=nt.getPrimaries(nt.workingColorSpace),pe=v.colorSpace===Si?null:nt.getPrimaries(v.colorSpace),Pe=v.colorSpace===Si||Ne===pe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe);let Le=v.isCompressedTexture||v.image[0].isCompressedTexture,ce=v.image[0]&&v.image[0].isDataTexture,Se=[];for(let te=0;te<6;te++)!Le&&!ce?Se[te]=_(v.image[te],!0,s.maxCubemapSize):Se[te]=ce?v.image[te].image:v.image[te],Se[te]=We(v,Se[te]);let ke=Se[0],Ue=r.convert(v.format,v.colorSpace),Me=r.convert(v.type),Ze=y(v.internalFormat,Ue,Me,v.colorSpace),B=v.isVideoTexture!==!0,fe=$.__version===void 0||Z===!0,xe=se.dataReady,Ae=S(v,ke);we(i.TEXTURE_CUBE_MAP,v);let le;if(Le){B&&fe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Ae,Ze,ke.width,ke.height);for(let te=0;te<6;te++){le=Se[te].mipmaps;for(let De=0;De<le.length;De++){let Xe=le[De];v.format!==jt?Ue!==null?B?xe&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,De,0,0,Xe.width,Xe.height,Ue,Xe.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,De,Ze,Xe.width,Xe.height,0,Xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?xe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,De,0,0,Xe.width,Xe.height,Ue,Me,Xe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,De,Ze,Xe.width,Xe.height,0,Ue,Me,Xe.data)}}}else{if(le=v.mipmaps,B&&fe){le.length>0&&Ae++;let te=Ge(Se[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Ae,Ze,te.width,te.height)}for(let te=0;te<6;te++)if(ce){B?xe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Se[te].width,Se[te].height,Ue,Me,Se[te].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Ze,Se[te].width,Se[te].height,0,Ue,Me,Se[te].data);for(let De=0;De<le.length;De++){let _t=le[De].image[te].image;B?xe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,De+1,0,0,_t.width,_t.height,Ue,Me,_t.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,De+1,Ze,_t.width,_t.height,0,Ue,Me,_t.data)}}else{B?xe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Ue,Me,Se[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Ze,Ue,Me,Se[te]);for(let De=0;De<le.length;De++){let Xe=le[De];B?xe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,De+1,0,0,Ue,Me,Xe.image[te]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+te,De+1,Ze,Ue,Me,Xe.image[te])}}}g(v)&&p(i.TEXTURE_CUBE_MAP),$.__version=se.version,v.onUpdate&&v.onUpdate(v)}R.__version=v.version}function ge(R,v,W,Z,se,$){let Ne=r.convert(W.format,W.colorSpace),pe=r.convert(W.type),Pe=y(W.internalFormat,Ne,pe,W.colorSpace),Le=n.get(v),ce=n.get(W);if(ce.__renderTarget=v,!Le.__hasExternalTextures){let Se=Math.max(1,v.width>>$),ke=Math.max(1,v.height>>$);se===i.TEXTURE_3D||se===i.TEXTURE_2D_ARRAY?t.texImage3D(se,$,Pe,Se,ke,v.depth,0,Ne,pe,null):t.texImage2D(se,$,Pe,Se,ke,0,Ne,pe,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),ae(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,se,ce.__webglTexture,0,me(v)):(se===i.TEXTURE_2D||se>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&se<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,se,ce.__webglTexture,$),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ce(R,v,W){if(i.bindRenderbuffer(i.RENDERBUFFER,R),v.depthBuffer){let Z=v.depthTexture,se=Z&&Z.isDepthTexture?Z.type:null,$=x(v.stencilBuffer,se),Ne=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pe=me(v);ae(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pe,$,v.width,v.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,pe,$,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,$,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Ne,i.RENDERBUFFER,R)}else{let Z=v.textures;for(let se=0;se<Z.length;se++){let $=Z[se],Ne=r.convert($.format,$.colorSpace),pe=r.convert($.type),Pe=y($.internalFormat,Ne,pe,$.colorSpace),Le=me(v);W&&ae(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Le,Pe,v.width,v.height):ae(v)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Le,Pe,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,Pe,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Re(R,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Z=n.get(v.depthTexture);Z.__renderTarget=v,(!Z.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),U(v.depthTexture,0);let se=Z.__webglTexture,$=me(v);if(v.depthTexture.format===Bs)ae(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,se,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,se,0);else if(v.depthTexture.format===sr)ae(v)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,se,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,se,0);else throw new Error("Unknown depthTexture format")}function Ke(R){let v=n.get(R),W=R.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==R.depthTexture){let Z=R.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),Z){let se=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,Z.removeEventListener("dispose",se)};Z.addEventListener("dispose",se),v.__depthDisposeCallback=se}v.__boundDepthTexture=Z}if(R.depthTexture&&!v.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");let Z=R.texture.mipmaps;Z&&Z.length>0?Re(v.__webglFramebuffer[0],R):Re(v.__webglFramebuffer,R)}else if(W){v.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[Z]),v.__webglDepthbuffer[Z]===void 0)v.__webglDepthbuffer[Z]=i.createRenderbuffer(),Ce(v.__webglDepthbuffer[Z],R,!1);else{let se=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=v.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,$)}}else{let Z=R.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),Ce(v.__webglDepthbuffer,R,!1);else{let se=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,$)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function rt(R,v,W){let Z=n.get(R);v!==void 0&&ge(Z.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&Ke(R)}function D(R){let v=R.texture,W=n.get(R),Z=n.get(v);R.addEventListener("dispose",C);let se=R.textures,$=R.isWebGLCubeRenderTarget===!0,Ne=se.length>1;if(Ne||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=v.version,o.memory.textures++),$){W.__webglFramebuffer=[];for(let pe=0;pe<6;pe++)if(v.mipmaps&&v.mipmaps.length>0){W.__webglFramebuffer[pe]=[];for(let Pe=0;Pe<v.mipmaps.length;Pe++)W.__webglFramebuffer[pe][Pe]=i.createFramebuffer()}else W.__webglFramebuffer[pe]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){W.__webglFramebuffer=[];for(let pe=0;pe<v.mipmaps.length;pe++)W.__webglFramebuffer[pe]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(Ne)for(let pe=0,Pe=se.length;pe<Pe;pe++){let Le=n.get(se[pe]);Le.__webglTexture===void 0&&(Le.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&ae(R)===!1){W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let pe=0;pe<se.length;pe++){let Pe=se[pe];W.__webglColorRenderbuffer[pe]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[pe]);let Le=r.convert(Pe.format,Pe.colorSpace),ce=r.convert(Pe.type),Se=y(Pe.internalFormat,Le,ce,Pe.colorSpace,R.isXRRenderTarget===!0),ke=me(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,ke,Se,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,W.__webglColorRenderbuffer[pe])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),Ce(W.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if($){t.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),we(i.TEXTURE_CUBE_MAP,v);for(let pe=0;pe<6;pe++)if(v.mipmaps&&v.mipmaps.length>0)for(let Pe=0;Pe<v.mipmaps.length;Pe++)ge(W.__webglFramebuffer[pe][Pe],R,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,Pe);else ge(W.__webglFramebuffer[pe],R,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0);g(v)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ne){for(let pe=0,Pe=se.length;pe<Pe;pe++){let Le=se[pe],ce=n.get(Le),Se=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Se=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Se,ce.__webglTexture),we(Se,Le),ge(W.__webglFramebuffer,R,Le,i.COLOR_ATTACHMENT0+pe,Se,0),g(Le)&&p(Se)}t.unbindTexture()}else{let pe=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(pe=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(pe,Z.__webglTexture),we(pe,v),v.mipmaps&&v.mipmaps.length>0)for(let Pe=0;Pe<v.mipmaps.length;Pe++)ge(W.__webglFramebuffer[Pe],R,v,i.COLOR_ATTACHMENT0,pe,Pe);else ge(W.__webglFramebuffer,R,v,i.COLOR_ATTACHMENT0,pe,0);g(v)&&p(pe),t.unbindTexture()}R.depthBuffer&&Ke(R)}function ne(R){let v=R.textures;for(let W=0,Z=v.length;W<Z;W++){let se=v[W];if(g(se)){let $=M(R),Ne=n.get(se).__webglTexture;t.bindTexture($,Ne),p($),t.unbindTexture()}}}let Q=[],j=[];function J(R){if(R.samples>0){if(ae(R)===!1){let v=R.textures,W=R.width,Z=R.height,se=i.COLOR_BUFFER_BIT,$=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ne=n.get(R),pe=v.length>1;if(pe)for(let Le=0;Le<v.length;Le++)t.bindFramebuffer(i.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Ne.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer);let Pe=R.texture.mipmaps;Pe&&Pe.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer);for(let Le=0;Le<v.length;Le++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(se|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(se|=i.STENCIL_BUFFER_BIT)),pe){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Ne.__webglColorRenderbuffer[Le]);let ce=n.get(v[Le]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ce,0)}i.blitFramebuffer(0,0,W,Z,0,0,W,Z,se,i.NEAREST),c===!0&&(Q.length=0,j.length=0,Q.push(i.COLOR_ATTACHMENT0+Le),R.depthBuffer&&R.resolveDepthBuffer===!1&&(Q.push($),j.push($),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,j)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Q))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),pe)for(let Le=0;Le<v.length;Le++){t.bindFramebuffer(i.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.RENDERBUFFER,Ne.__webglColorRenderbuffer[Le]);let ce=n.get(v[Le]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Ne.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Le,i.TEXTURE_2D,ce,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&c){let v=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function me(R){return Math.min(s.maxSamples,R.samples)}function ae(R){let v=n.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function _e(R){let v=o.render.frame;h.get(R)!==v&&(h.set(R,v),R.update())}function We(R,v){let W=R.colorSpace,Z=R.format,se=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||W!==Dt&&W!==Si&&(nt.getTransfer(W)===ht?(Z!==jt||se!==Xn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),v}function Ge(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(l.width=R.naturalWidth||R.width,l.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(l.width=R.displayWidth,l.height=R.displayHeight):(l.width=R.width,l.height=R.height),l}this.allocateTextureUnit=F,this.resetTextureUnits=z,this.setTexture2D=U,this.setTexture2DArray=N,this.setTexture3D=q,this.setTextureCube=O,this.rebindTextures=rt,this.setupRenderTarget=D,this.updateRenderTargetMipmap=ne,this.updateMultisampleRenderTarget=J,this.setupDepthRenderbuffer=Ke,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=ae}function jy(i,e){function t(n,s=Si){let r,o=nt.getTransfer(s);if(n===Xn)return i.UNSIGNED_BYTE;if(n===Ua)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Fa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Vl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Gl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===zl)return i.BYTE;if(n===kl)return i.SHORT;if(n===nr)return i.UNSIGNED_SHORT;if(n===Na)return i.INT;if(n===Oi)return i.UNSIGNED_INT;if(n===qt)return i.FLOAT;if(n===qn)return i.HALF_FLOAT;if(n===Hl)return i.ALPHA;if(n===Wl)return i.RGB;if(n===jt)return i.RGBA;if(n===Bs)return i.DEPTH_COMPONENT;if(n===sr)return i.DEPTH_STENCIL;if(n===Oa)return i.RED;if(n===Ba)return i.RED_INTEGER;if(n===Xl)return i.RG;if(n===za)return i.RG_INTEGER;if(n===ka)return i.RGBA_INTEGER;if(n===lo||n===ho||n===uo||n===fo)if(o===ht)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===lo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ho)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===uo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===fo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===lo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ho)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===uo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===fo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Va||n===Ga||n===Ha||n===Wa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Va)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ga)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ha)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Wa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Xa||n===qa||n===Ya)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Xa||n===qa)return o===ht?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ya)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Za||n===Ka||n===$a||n===Ja||n===ja||n===Qa||n===ec||n===tc||n===nc||n===ic||n===sc||n===rc||n===oc||n===ac)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Za)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ka)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===$a)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ja)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ja)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Qa)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ec)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===tc)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===nc)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ic)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===sc)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===rc)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===oc)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ac)return o===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===cc||n===lc||n===hc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===cc)return o===ht?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===lc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===hc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===uc||n===dc||n===fc||n===pc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===uc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===dc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===fc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===pc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ir?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}function nv(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Jl(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,M,y,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,x)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),_(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?c(g,p,M,y):p.isSpriteMaterial?l(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Gt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Gt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let M=e.get(p),y=M.envMap,x=M.envMapRotation;y&&(g.envMap.value=y,ms.copy(x),ms.x*=-1,ms.y*=-1,ms.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ms.y*=-1,ms.z*=-1),g.envMapRotation.value.setFromMatrix4(tv.makeRotationFromEuler(ms)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function c(g,p,M,y){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*M,g.scale.value=y*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function l(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,M){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Gt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function _(g,p){let M=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function iv(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,y){let x=y.program;n.uniformBlockBinding(M,x)}function l(M,y){let x=s[M.id];x===void 0&&(m(M),x=h(M),s[M.id]=x,M.addEventListener("dispose",g));let S=y.program;n.updateUBOMapping(M,S);let E=e.render.frame;r[M.id]!==E&&(d(M),r[M.id]=E)}function h(M){let y=u();M.__bindingPointIndex=y;let x=i.createBuffer(),S=M.__size,E=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,S,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,x),x}function u(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){let y=s[M.id],x=M.uniforms,S=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let E=0,C=x.length;E<C;E++){let I=Array.isArray(x[E])?x[E]:[x[E]];for(let w=0,b=I.length;w<b;w++){let L=I[w];if(f(L,E,w,S)===!0){let z=L.__offset,F=Array.isArray(L.value)?L.value:[L.value],A=0;for(let U=0;U<F.length;U++){let N=F[U],q=_(N);typeof N=="number"||typeof N=="boolean"?(L.__data[0]=N,i.bufferSubData(i.UNIFORM_BUFFER,z+A,L.__data)):N.isMatrix3?(L.__data[0]=N.elements[0],L.__data[1]=N.elements[1],L.__data[2]=N.elements[2],L.__data[3]=0,L.__data[4]=N.elements[3],L.__data[5]=N.elements[4],L.__data[6]=N.elements[5],L.__data[7]=0,L.__data[8]=N.elements[6],L.__data[9]=N.elements[7],L.__data[10]=N.elements[8],L.__data[11]=0):(N.toArray(L.__data,A),A+=q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(M,y,x,S){let E=M.value,C=y+"_"+x;if(S[C]===void 0)return typeof E=="number"||typeof E=="boolean"?S[C]=E:S[C]=E.clone(),!0;{let I=S[C];if(typeof E=="number"||typeof E=="boolean"){if(I!==E)return S[C]=E,!0}else if(I.equals(E)===!1)return I.copy(E),!0}return!1}function m(M){let y=M.uniforms,x=0,S=16;for(let C=0,I=y.length;C<I;C++){let w=Array.isArray(y[C])?y[C]:[y[C]];for(let b=0,L=w.length;b<L;b++){let z=w[b],F=Array.isArray(z.value)?z.value:[z.value];for(let A=0,U=F.length;A<U;A++){let N=F[A],q=_(N),O=x%S,ee=O%q.boundary,ie=O+ee;x+=ee,ie!==0&&S-ie<q.storage&&(x+=S-ie),z.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=x,x+=q.storage}}}let E=x%S;return E>0&&(x+=S-E),M.__size=x,M.__cache={},this}function _(M){let y={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(y.boundary=4,y.storage=4):M.isVector2?(y.boundary=8,y.storage=8):M.isVector3||M.isColor?(y.boundary=16,y.storage=12):M.isVector4?(y.boundary=16,y.storage=16):M.isMatrix3?(y.boundary=48,y.storage=48):M.isMatrix4?(y.boundary=64,y.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),y}function g(M){let y=M.target;y.removeEventListener("dispose",g);let x=o.indexOf(y.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function p(){for(let M in s)i.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}var Pg,Lg,Dg,Ng,Ug,Fg,Og,Bg,zg,kg,Vg,Gg,Hg,Wg,Xg,qg,Yg,Zg,Kg,$g,Jg,jg,Qg,e0,t0,n0,i0,s0,r0,o0,a0,c0,l0,h0,u0,d0,f0,p0,m0,g0,_0,x0,y0,v0,M0,b0,S0,w0,T0,E0,A0,R0,C0,I0,P0,L0,D0,N0,U0,F0,O0,B0,z0,k0,V0,G0,H0,W0,X0,q0,Y0,Z0,K0,$0,J0,j0,Q0,e_,t_,n_,i_,s_,r_,o_,a_,c_,l_,h_,u_,d_,f_,p_,m_,g_,__,x_,y_,v_,M_,b_,S_,w_,T_,E_,A_,R_,C_,I_,P_,L_,D_,N_,U_,F_,O_,B_,z_,k_,V_,G_,H_,W_,X_,q_,Y_,Z_,K_,$_,J_,j_,Q_,ex,tx,nx,ix,sx,rx,ox,ax,cx,lx,Je,ve,ii,gc,ps,hx,ar,lf,_s,ih,hf,sh,rh,oh,ah,gs,or,uf,_x,xs,Df,mf,Nf,Uf,Ff,gf,_f,xf,yf,vf,lh,hh,uh,ch,cr,py,my,Sf,xc,wy,Ty,Ay,Uy,fh,ph,Gy,qy,Yy,Ky,Qy,ev,mh,gh,ms,tv,yc,hn=Ft(()=>{nh();nh();Pg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Lg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Dg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ng=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ug=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Fg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Og=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Bg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,zg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,kg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Vg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Gg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Hg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Wg=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Xg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,qg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Yg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Zg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Kg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$g=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Jg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,jg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Qg=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,e0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,t0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,n0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,i0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,s0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,r0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,o0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,a0="gl_FragColor = linearToOutputTexel( gl_FragColor );",c0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,l0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,h0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,u0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,d0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,f0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,p0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,m0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,g0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,_0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,x0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,y0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,v0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,M0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,b0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,S0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,w0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,T0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,E0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,A0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,R0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,C0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,I0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,P0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,L0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,D0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,N0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,U0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,F0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,O0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,B0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,z0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,k0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,V0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,G0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,H0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,W0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,X0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,q0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Y0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Z0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,K0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,$0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,J0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,j0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Q0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,e_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,t_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,n_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,i_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,s_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,r_=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,o_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,a_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,c_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,l_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,h_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,u_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,d_=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,f_=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,p_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,m_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,g_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,__=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,x_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,y_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,v_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,M_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,b_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,S_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,w_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,T_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,E_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,A_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,R_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,C_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,I_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,P_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,L_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,D_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,N_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,U_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,F_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,O_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,B_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,z_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,k_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,V_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,G_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,H_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,W_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,X_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,q_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Y_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Z_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,K_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,J_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,j_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Q_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ex=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,tx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nx=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ix=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sx=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,rx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ox=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ax=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,cx=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,lx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Je={alphahash_fragment:Pg,alphahash_pars_fragment:Lg,alphamap_fragment:Dg,alphamap_pars_fragment:Ng,alphatest_fragment:Ug,alphatest_pars_fragment:Fg,aomap_fragment:Og,aomap_pars_fragment:Bg,batching_pars_vertex:zg,batching_vertex:kg,begin_vertex:Vg,beginnormal_vertex:Gg,bsdfs:Hg,iridescence_fragment:Wg,bumpmap_pars_fragment:Xg,clipping_planes_fragment:qg,clipping_planes_pars_fragment:Yg,clipping_planes_pars_vertex:Zg,clipping_planes_vertex:Kg,color_fragment:$g,color_pars_fragment:Jg,color_pars_vertex:jg,color_vertex:Qg,common:e0,cube_uv_reflection_fragment:t0,defaultnormal_vertex:n0,displacementmap_pars_vertex:i0,displacementmap_vertex:s0,emissivemap_fragment:r0,emissivemap_pars_fragment:o0,colorspace_fragment:a0,colorspace_pars_fragment:c0,envmap_fragment:l0,envmap_common_pars_fragment:h0,envmap_pars_fragment:u0,envmap_pars_vertex:d0,envmap_physical_pars_fragment:S0,envmap_vertex:f0,fog_vertex:p0,fog_pars_vertex:m0,fog_fragment:g0,fog_pars_fragment:_0,gradientmap_pars_fragment:x0,lightmap_pars_fragment:y0,lights_lambert_fragment:v0,lights_lambert_pars_fragment:M0,lights_pars_begin:b0,lights_toon_fragment:w0,lights_toon_pars_fragment:T0,lights_phong_fragment:E0,lights_phong_pars_fragment:A0,lights_physical_fragment:R0,lights_physical_pars_fragment:C0,lights_fragment_begin:I0,lights_fragment_maps:P0,lights_fragment_end:L0,logdepthbuf_fragment:D0,logdepthbuf_pars_fragment:N0,logdepthbuf_pars_vertex:U0,logdepthbuf_vertex:F0,map_fragment:O0,map_pars_fragment:B0,map_particle_fragment:z0,map_particle_pars_fragment:k0,metalnessmap_fragment:V0,metalnessmap_pars_fragment:G0,morphinstance_vertex:H0,morphcolor_vertex:W0,morphnormal_vertex:X0,morphtarget_pars_vertex:q0,morphtarget_vertex:Y0,normal_fragment_begin:Z0,normal_fragment_maps:K0,normal_pars_fragment:$0,normal_pars_vertex:J0,normal_vertex:j0,normalmap_pars_fragment:Q0,clearcoat_normal_fragment_begin:e_,clearcoat_normal_fragment_maps:t_,clearcoat_pars_fragment:n_,iridescence_pars_fragment:i_,opaque_fragment:s_,packing:r_,premultiplied_alpha_fragment:o_,project_vertex:a_,dithering_fragment:c_,dithering_pars_fragment:l_,roughnessmap_fragment:h_,roughnessmap_pars_fragment:u_,shadowmap_pars_fragment:d_,shadowmap_pars_vertex:f_,shadowmap_vertex:p_,shadowmask_pars_fragment:m_,skinbase_vertex:g_,skinning_pars_vertex:__,skinning_vertex:x_,skinnormal_vertex:y_,specularmap_fragment:v_,specularmap_pars_fragment:M_,tonemapping_fragment:b_,tonemapping_pars_fragment:S_,transmission_fragment:w_,transmission_pars_fragment:T_,uv_pars_fragment:E_,uv_pars_vertex:A_,uv_vertex:R_,worldpos_vertex:C_,background_vert:I_,background_frag:P_,backgroundCube_vert:L_,backgroundCube_frag:D_,cube_vert:N_,cube_frag:U_,depth_vert:F_,depth_frag:O_,distanceRGBA_vert:B_,distanceRGBA_frag:z_,equirect_vert:k_,equirect_frag:V_,linedashed_vert:G_,linedashed_frag:H_,meshbasic_vert:W_,meshbasic_frag:X_,meshlambert_vert:q_,meshlambert_frag:Y_,meshmatcap_vert:Z_,meshmatcap_frag:K_,meshnormal_vert:$_,meshnormal_frag:J_,meshphong_vert:j_,meshphong_frag:Q_,meshphysical_vert:ex,meshphysical_frag:tx,meshtoon_vert:nx,meshtoon_frag:ix,points_vert:sx,points_frag:rx,shadow_vert:ox,shadow_frag:ax,sprite_vert:cx,sprite_frag:lx},ve={common:{diffuse:{value:new Ee(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new He}},envmap:{envMap:{value:null},envMapRotation:{value:new He},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new He}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new He}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new He},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new He},normalScale:{value:new he(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new He},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new He}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new He}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new He}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ee(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ee(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0},uvTransform:{value:new He}},sprite:{diffuse:{value:new Ee(16777215)},opacity:{value:1},center:{value:new he(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}}},ii={basic:{uniforms:Yt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:Je.meshbasic_vert,fragmentShader:Je.meshbasic_frag},lambert:{uniforms:Yt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ee(0)}}]),vertexShader:Je.meshlambert_vert,fragmentShader:Je.meshlambert_frag},phong:{uniforms:Yt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ee(0)},specular:{value:new Ee(1118481)},shininess:{value:30}}]),vertexShader:Je.meshphong_vert,fragmentShader:Je.meshphong_frag},standard:{uniforms:Yt([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Ee(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag},toon:{uniforms:Yt([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Ee(0)}}]),vertexShader:Je.meshtoon_vert,fragmentShader:Je.meshtoon_frag},matcap:{uniforms:Yt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:Je.meshmatcap_vert,fragmentShader:Je.meshmatcap_frag},points:{uniforms:Yt([ve.points,ve.fog]),vertexShader:Je.points_vert,fragmentShader:Je.points_frag},dashed:{uniforms:Yt([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Je.linedashed_vert,fragmentShader:Je.linedashed_frag},depth:{uniforms:Yt([ve.common,ve.displacementmap]),vertexShader:Je.depth_vert,fragmentShader:Je.depth_frag},normal:{uniforms:Yt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:Je.meshnormal_vert,fragmentShader:Je.meshnormal_frag},sprite:{uniforms:Yt([ve.sprite,ve.fog]),vertexShader:Je.sprite_vert,fragmentShader:Je.sprite_frag},background:{uniforms:{uvTransform:{value:new He},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Je.background_vert,fragmentShader:Je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new He}},vertexShader:Je.backgroundCube_vert,fragmentShader:Je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Je.cube_vert,fragmentShader:Je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Je.equirect_vert,fragmentShader:Je.equirect_frag},distanceRGBA:{uniforms:Yt([ve.common,ve.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Je.distanceRGBA_vert,fragmentShader:Je.distanceRGBA_frag},shadow:{uniforms:Yt([ve.lights,ve.fog,{color:{value:new Ee(0)},opacity:{value:1}}]),vertexShader:Je.shadow_vert,fragmentShader:Je.shadow_frag}};ii.physical={uniforms:Yt([ii.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new He},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new He},clearcoatNormalScale:{value:new he(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new He},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new He},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new He},sheen:{value:0},sheenColor:{value:new Ee(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new He},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new He},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new He},transmissionSamplerSize:{value:new he},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new He},attenuationDistance:{value:0},attenuationColor:{value:new Ee(0)},specularColor:{value:new Ee(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new He},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new He},anisotropyVector:{value:new he},anisotropyMap:{value:null},anisotropyMapTransform:{value:new He}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag};gc={r:0,b:0,g:0},ps=new rn,hx=new Be;ar=4,lf=[.125,.215,.35,.446,.526,.582],_s=20,ih=new cs,hf=new Ee,sh=null,rh=0,oh=0,ah=!1,gs=(1+Math.sqrt(5))/2,or=1/gs,uf=[new P(-gs,or,0),new P(gs,or,0),new P(-or,0,gs),new P(or,0,gs),new P(0,gs,-or),new P(0,gs,or),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)],_x=new P,xs=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=_x}=r;sh=this._renderer.getRenderTarget(),rh=this._renderer.getActiveCubeFace(),oh=this._renderer.getActiveMipmapLevel(),ah=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=pf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ff(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(sh,rh,oh),this._renderer.xr.enabled=ah,e.scissorTest=!1,_c(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===hs||e.mapping===us?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),sh=this._renderer.getRenderTarget(),rh=this._renderer.getActiveCubeFace(),oh=this._renderer.getActiveMipmapLevel(),ah=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Mt,minFilter:Mt,generateMipmaps:!1,type:qn,format:jt,colorSpace:Dt,depthBuffer:!1},s=df(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=df(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=xx(r)),this._blurMaterial=yx(r,e,t)}return s}_compileMaterial(e){let t=new qe(this._lodPlanes[0],e);this._renderer.compile(t,ih)}_sceneToCubeUV(e,t,n,s,r){let c=new Pt(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(hf),u.toneMapping=bi,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let _=new Et({name:"PMREM.Background",side:Gt,depthWrite:!1,depthTest:!1}),g=new qe(new zt,_),p=!1,M=e.background;M?M.isColor&&(_.color.copy(M),e.background=null,p=!0):(_.color.copy(hf),p=!0);for(let y=0;y<6;y++){let x=y%3;x===0?(c.up.set(0,l[y],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[y],r.y,r.z)):x===1?(c.up.set(0,0,l[y]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[y],r.z)):(c.up.set(0,l[y],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[y]));let S=this._cubeSize;_c(s,x*S,y>2?S:0,S,S),u.setRenderTarget(s),p&&u.render(g,c),u.render(e,c)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=d,e.background=M}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===hs||e.mapping===us;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=pf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ff());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new qe(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let c=this._cubeSize;_c(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,ih)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=uf[(s-r-1)%uf.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new qe(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*_s-1),_=r/m,g=isFinite(r)?1+Math.floor(h*_):_s;g>_s&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${_s}`);let p=[],M=0;for(let C=0;C<_s;++C){let I=C/_,w=Math.exp(-I*I/2);p.push(w),C===0?M+=w:C<g&&(M+=2*w)}for(let C=0;C<p.length;C++)p[C]=p[C]/M;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:y}=this;d.dTheta.value=m,d.mipInt.value=y-n;let x=this._sizeLods[s],S=3*x*(s>y-ar?s-y+ar:0),E=4*(this._cubeSize-x);_c(t,S,E,3*x,2*x),c.setRenderTarget(t),c.render(u,ih)}};Df=new Bt,mf=new Vr(1,1),Nf=new Lr,Uf=new ra,Ff=new Fr,gf=[],_f=[],xf=new Float32Array(16),yf=new Float32Array(9),vf=new Float32Array(4);lh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=qx(t.type)}},hh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=dy(t.type)}},uh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},ch=/(\w+)(\])?(\[|\.)?/g;cr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);fy(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};py=37297,my=0;Sf=new He;xc=new P;wy=/^[ \t]*#include +<([\w\d./]+)>/gm;Ty=new Map;Ay=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;Uy=0,fh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new ph(e),t.set(e,n)),n}},ph=class{constructor(e){this.id=Uy++,this.code=e,this.usedTimes=0}};Gy=0;qy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Yy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;Ky={[Sa]:wa,[Ta]:Ra,[Ea]:Ca,[$i]:Aa,[wa]:Sa,[Ra]:Ta,[Ca]:Ea,[Aa]:$i};Qy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ev=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,mh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Gr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Vn({vertexShader:Qy,fragmentShader:ev,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new qe(new Cn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},gh=class extends gi{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,m=null,_=typeof XRWebGLBinding<"u",g=new mh,p={},M=t.getContextAttributes(),y=null,x=null,S=[],E=[],C=new he,I=null,w=new Pt;w.viewport=new st;let b=new Pt;b.viewport=new st;let L=[w,b],z=new Ma,F=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let K=S[k];return K===void 0&&(K=new Hs,S[k]=K),K.getTargetRaySpace()},this.getControllerGrip=function(k){let K=S[k];return K===void 0&&(K=new Hs,S[k]=K),K.getGripSpace()},this.getHand=function(k){let K=S[k];return K===void 0&&(K=new Hs,S[k]=K),K.getHandSpace()};function U(k){let K=E.indexOf(k.inputSource);if(K===-1)return;let ge=S[K];ge!==void 0&&(ge.update(k.inputSource,k.frame,l||o),ge.dispatchEvent({type:k.type,data:k.inputSource}))}function N(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",N),s.removeEventListener("inputsourceschange",q);for(let k=0;k<S.length;k++){let K=E[k];K!==null&&(E[k]=null,S[k].disconnect(K))}F=null,A=null,g.reset();for(let k in p)delete p[k];e.setRenderTarget(y),f=null,d=null,u=null,s=null,x=null,oe.stop(),n.isPresenting=!1,e.setPixelRatio(I),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){r=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){a=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(k){l=k},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(k){if(s=k,s!==null){if(y=e.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",N),s.addEventListener("inputsourceschange",q),M.xrCompatible!==!0&&await t.makeXRCompatible(),I=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ge=null,Ce=null,Re=null;M.depth&&(Re=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ge=M.stencil?sr:Bs,Ce=M.stencil?ir:Oi);let Ke={colorFormat:t.RGBA8,depthFormat:Re,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Ke),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Kn(d.textureWidth,d.textureHeight,{format:jt,type:Xn,depthTexture:new Vr(d.textureWidth,d.textureHeight,Ce,void 0,void 0,void 0,void 0,void 0,void 0,ge),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let ge={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,ge),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new Kn(f.framebufferWidth,f.framebufferHeight,{format:jt,type:Xn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),oe.setContext(s),oe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function q(k){for(let K=0;K<k.removed.length;K++){let ge=k.removed[K],Ce=E.indexOf(ge);Ce>=0&&(E[Ce]=null,S[Ce].disconnect(ge))}for(let K=0;K<k.added.length;K++){let ge=k.added[K],Ce=E.indexOf(ge);if(Ce===-1){for(let Ke=0;Ke<S.length;Ke++)if(Ke>=E.length){E.push(ge),Ce=Ke;break}else if(E[Ke]===null){E[Ke]=ge,Ce=Ke;break}if(Ce===-1)break}let Re=S[Ce];Re&&Re.connect(ge)}}let O=new P,ee=new P;function ie(k,K,ge){O.setFromMatrixPosition(K.matrixWorld),ee.setFromMatrixPosition(ge.matrixWorld);let Ce=O.distanceTo(ee),Re=K.projectionMatrix.elements,Ke=ge.projectionMatrix.elements,rt=Re[14]/(Re[10]-1),D=Re[14]/(Re[10]+1),ne=(Re[9]+1)/Re[5],Q=(Re[9]-1)/Re[5],j=(Re[8]-1)/Re[0],J=(Ke[8]+1)/Ke[0],me=rt*j,ae=rt*J,_e=Ce/(-j+J),We=_e*-j;if(K.matrixWorld.decompose(k.position,k.quaternion,k.scale),k.translateX(We),k.translateZ(_e),k.matrixWorld.compose(k.position,k.quaternion,k.scale),k.matrixWorldInverse.copy(k.matrixWorld).invert(),Re[10]===-1)k.projectionMatrix.copy(K.projectionMatrix),k.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{let Ge=rt+_e,R=D+_e,v=me-We,W=ae+(Ce-We),Z=ne*D/R*Ge,se=Q*D/R*Ge;k.projectionMatrix.makePerspective(v,W,Z,se,Ge,R),k.projectionMatrixInverse.copy(k.projectionMatrix).invert()}}function de(k,K){K===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(K.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(s===null)return;let K=k.near,ge=k.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(ge=g.depthFar)),z.near=b.near=w.near=K,z.far=b.far=w.far=ge,(F!==z.near||A!==z.far)&&(s.updateRenderState({depthNear:z.near,depthFar:z.far}),F=z.near,A=z.far),z.layers.mask=k.layers.mask|6,w.layers.mask=z.layers.mask&3,b.layers.mask=z.layers.mask&5;let Ce=k.parent,Re=z.cameras;de(z,Ce);for(let Ke=0;Ke<Re.length;Ke++)de(Re[Ke],Ce);Re.length===2?ie(z,w,b):z.projectionMatrix.copy(w.projectionMatrix),we(k,z,Ce)};function we(k,K,ge){ge===null?k.matrix.copy(K.matrixWorld):(k.matrix.copy(ge.matrixWorld),k.matrix.invert(),k.matrix.multiply(K.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(K.projectionMatrix),k.projectionMatrixInverse.copy(K.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=Qi*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(k){c=k,d!==null&&(d.fixedFoveation=k),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=k)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(z)},this.getCameraTexture=function(k){return p[k]};let G=null;function re(k,K){if(h=K.getViewerPose(l||o),m=K,h!==null){let ge=h.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let Ce=!1;ge.length!==z.cameras.length&&(z.cameras.length=0,Ce=!0);for(let D=0;D<ge.length;D++){let ne=ge[D],Q=null;if(f!==null)Q=f.getViewport(ne);else{let J=u.getViewSubImage(d,ne);Q=J.viewport,D===0&&(e.setRenderTargetTextures(x,J.colorTexture,J.depthStencilTexture),e.setRenderTarget(x))}let j=L[D];j===void 0&&(j=new Pt,j.layers.enable(D),j.viewport=new st,L[D]=j),j.matrix.fromArray(ne.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(ne.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set(Q.x,Q.y,Q.width,Q.height),D===0&&(z.matrix.copy(j.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),Ce===!0&&z.cameras.push(j)}let Re=s.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let D=u.getDepthInformation(ge[0]);D&&D.isValid&&D.texture&&g.init(D,s.renderState)}if(Re&&Re.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let D=0;D<ge.length;D++){let ne=ge[D].camera;if(ne){let Q=p[ne];Q||(Q=new Gr,p[ne]=Q);let j=u.getCameraImage(ne);Q.sourceTexture=j}}}}for(let ge=0;ge<S.length;ge++){let Ce=E[ge],Re=S[ge];Ce!==null&&Re!==void 0&&Re.update(Ce,K,l||o)}G&&G(k,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),m=null}let oe=new Lf;oe.setAnimationLoop(re),this.setAnimationLoop=function(k){G=k},this.dispose=function(){}}},ms=new rn,tv=new Be;yc=class{constructor(e={}){let{canvas:t=jd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let m=new Uint32Array(4),_=new Int32Array(4),g=null,p=null,M=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=bi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let x=this,S=!1;this._outputColorSpace=vt;let E=0,C=0,I=null,w=-1,b=null,L=new st,z=new st,F=null,A=new Ee(0),U=0,N=t.width,q=t.height,O=1,ee=null,ie=null,de=new st(0,0,N,q),we=new st(0,0,N,q),G=!1,re=new Ys,oe=!1,k=!1,K=new Be,ge=new P,Ce=new st,Re={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ke=!1;function rt(){return I===null?O:1}let D=n;function ne(T,V){return t.getContext(T,V)}try{let T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",xe,!1),t.addEventListener("webglcontextrestored",Ae,!1),t.addEventListener("webglcontextcreationerror",le,!1),D===null){let V="webgl2";if(D=ne(V,T),D===null)throw ne(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Q,j,J,me,ae,_e,We,Ge,R,v,W,Z,se,$,Ne,pe,Pe,Le,ce,Se,ke,Ue,Me,Ze;function B(){Q=new Mx(D),Q.init(),Ue=new jy(D,Q),j=new px(D,Q,e,Ue),J=new $y(D,Q),j.reversedDepthBuffer&&d&&J.buffers.depth.setReversed(!0),me=new wx(D),ae=new Oy,_e=new Jy(D,Q,J,ae,j,Ue,me),We=new gx(x),Ge=new vx(x),R=new Ig(D),Me=new dx(D,R),v=new bx(D,R,me,Me),W=new Ex(D,v,R,me),ce=new Tx(D,j,_e),pe=new mx(ae),Z=new Fy(x,We,Ge,Q,j,Me,pe),se=new nv(x,ae),$=new zy,Ne=new Xy(Q),Le=new ux(x,We,Ge,J,W,f,c),Pe=new Zy(x,W,j),Ze=new iv(D,me,j,J),Se=new fx(D,Q,me),ke=new Sx(D,Q,me),me.programs=Z.programs,x.capabilities=j,x.extensions=Q,x.properties=ae,x.renderLists=$,x.shadowMap=Pe,x.state=J,x.info=me}B();let fe=new gh(x,D);this.xr=fe,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let T=Q.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=Q.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return O},this.setPixelRatio=function(T){T!==void 0&&(O=T,this.setSize(N,q,!1))},this.getSize=function(T){return T.set(N,q)},this.setSize=function(T,V,X=!0){if(fe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=T,q=V,t.width=Math.floor(T*O),t.height=Math.floor(V*O),X===!0&&(t.style.width=T+"px",t.style.height=V+"px"),this.setViewport(0,0,T,V)},this.getDrawingBufferSize=function(T){return T.set(N*O,q*O).floor()},this.setDrawingBufferSize=function(T,V,X){N=T,q=V,O=X,t.width=Math.floor(T*X),t.height=Math.floor(V*X),this.setViewport(0,0,T,V)},this.getCurrentViewport=function(T){return T.copy(L)},this.getViewport=function(T){return T.copy(de)},this.setViewport=function(T,V,X,Y){T.isVector4?de.set(T.x,T.y,T.z,T.w):de.set(T,V,X,Y),J.viewport(L.copy(de).multiplyScalar(O).round())},this.getScissor=function(T){return T.copy(we)},this.setScissor=function(T,V,X,Y){T.isVector4?we.set(T.x,T.y,T.z,T.w):we.set(T,V,X,Y),J.scissor(z.copy(we).multiplyScalar(O).round())},this.getScissorTest=function(){return G},this.setScissorTest=function(T){J.setScissorTest(G=T)},this.setOpaqueSort=function(T){ee=T},this.setTransparentSort=function(T){ie=T},this.getClearColor=function(T){return T.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor(...arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha(...arguments)},this.clear=function(T=!0,V=!0,X=!0){let Y=0;if(T){let H=!1;if(I!==null){let ue=I.texture.format;H=ue===ka||ue===za||ue===Ba}if(H){let ue=I.texture.type,be=ue===Xn||ue===Oi||ue===nr||ue===ir||ue===Ua||ue===Fa,Ie=Le.getClearColor(),Te=Le.getClearAlpha(),ze=Ie.r,Ve=Ie.g,Fe=Ie.b;be?(m[0]=ze,m[1]=Ve,m[2]=Fe,m[3]=Te,D.clearBufferuiv(D.COLOR,0,m)):(_[0]=ze,_[1]=Ve,_[2]=Fe,_[3]=Te,D.clearBufferiv(D.COLOR,0,_))}else Y|=D.COLOR_BUFFER_BIT}V&&(Y|=D.DEPTH_BUFFER_BIT),X&&(Y|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",xe,!1),t.removeEventListener("webglcontextrestored",Ae,!1),t.removeEventListener("webglcontextcreationerror",le,!1),Le.dispose(),$.dispose(),Ne.dispose(),ae.dispose(),We.dispose(),Ge.dispose(),W.dispose(),Me.dispose(),Ze.dispose(),Z.dispose(),fe.dispose(),fe.removeEventListener("sessionstart",Yn),fe.removeEventListener("sessionend",xu),Vi.stop()};function xe(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function Ae(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;let T=me.autoReset,V=Pe.enabled,X=Pe.autoUpdate,Y=Pe.needsUpdate,H=Pe.type;B(),me.autoReset=T,Pe.enabled=V,Pe.autoUpdate=X,Pe.needsUpdate=Y,Pe.type=H}function le(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function te(T){let V=T.target;V.removeEventListener("dispose",te),De(V)}function De(T){Xe(T),ae.remove(T)}function Xe(T){let V=ae.get(T).programs;V!==void 0&&(V.forEach(function(X){Z.releaseProgram(X)}),T.isShaderMaterial&&Z.releaseShaderCache(T))}this.renderBufferDirect=function(T,V,X,Y,H,ue){V===null&&(V=Re);let be=H.isMesh&&H.matrixWorld.determinant()<0,Ie=Yp(T,V,X,Y,H);J.setMaterial(Y,be);let Te=X.index,ze=1;if(Y.wireframe===!0){if(Te=v.getWireframeAttribute(X),Te===void 0)return;ze=2}let Ve=X.drawRange,Fe=X.attributes.position,tt=Ve.start*ze,dt=(Ve.start+Ve.count)*ze;ue!==null&&(tt=Math.max(tt,ue.start*ze),dt=Math.min(dt,(ue.start+ue.count)*ze)),Te!==null?(tt=Math.max(tt,0),dt=Math.min(dt,Te.count)):Fe!=null&&(tt=Math.max(tt,0),dt=Math.min(dt,Fe.count));let Tt=dt-tt;if(Tt<0||Tt===1/0)return;Me.setup(H,Y,Ie,X,Te);let yt,pt=Se;if(Te!==null&&(yt=R.get(Te),pt=ke,pt.setIndex(yt)),H.isMesh)Y.wireframe===!0?(J.setLineWidth(Y.wireframeLinewidth*rt()),pt.setMode(D.LINES)):pt.setMode(D.TRIANGLES);else if(H.isLine){let Oe=Y.linewidth;Oe===void 0&&(Oe=1),J.setLineWidth(Oe*rt()),H.isLineSegments?pt.setMode(D.LINES):H.isLineLoop?pt.setMode(D.LINE_LOOP):pt.setMode(D.LINE_STRIP)}else H.isPoints?pt.setMode(D.POINTS):H.isSprite&&pt.setMode(D.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)ks("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),pt.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(Q.get("WEBGL_multi_draw"))pt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let Oe=H._multiDrawStarts,bt=H._multiDrawCounts,it=H._multiDrawCount,dn=Te?R.get(Te).bytesPerElement:1,Ms=ae.get(Y).currentProgram.getUniforms();for(let fn=0;fn<it;fn++)Ms.setValue(D,"_gl_DrawID",fn),pt.render(Oe[fn]/dn,bt[fn])}else if(H.isInstancedMesh)pt.renderInstances(tt,Tt,H.count);else if(X.isInstancedBufferGeometry){let Oe=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,bt=Math.min(X.instanceCount,Oe);pt.renderInstances(tt,Tt,bt)}else pt.render(tt,Tt)};function _t(T,V,X){T.transparent===!0&&T.side===gt&&T.forceSinglePass===!1?(T.side=Gt,T.needsUpdate=!0,To(T,V,X),T.side=kn,T.needsUpdate=!0,To(T,V,X),T.side=gt):To(T,V,X)}this.compile=function(T,V,X=null){X===null&&(X=T),p=Ne.get(X),p.init(V),y.push(p),X.traverseVisible(function(H){H.isLight&&H.layers.test(V.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),T!==X&&T.traverseVisible(function(H){H.isLight&&H.layers.test(V.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),p.setupLights();let Y=new Set;return T.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let ue=H.material;if(ue)if(Array.isArray(ue))for(let be=0;be<ue.length;be++){let Ie=ue[be];_t(Ie,X,H),Y.add(Ie)}else _t(ue,X,H),Y.add(ue)}),p=y.pop(),Y},this.compileAsync=function(T,V,X=null){let Y=this.compile(T,V,X);return new Promise(H=>{function ue(){if(Y.forEach(function(be){ae.get(be).currentProgram.isReady()&&Y.delete(be)}),Y.size===0){H(T);return}setTimeout(ue,10)}Q.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let ct=null;function ai(T){ct&&ct(T)}function Yn(){Vi.stop()}function xu(){Vi.start()}let Vi=new Lf;Vi.setAnimationLoop(ai),typeof self<"u"&&Vi.setContext(self),this.setAnimationLoop=function(T){ct=T,fe.setAnimationLoop(T),T===null?Vi.stop():Vi.start()},fe.addEventListener("sessionstart",Yn),fe.addEventListener("sessionend",xu),this.render=function(T,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),fe.enabled===!0&&fe.isPresenting===!0&&(fe.cameraAutoUpdate===!0&&fe.updateCamera(V),V=fe.getCamera()),T.isScene===!0&&T.onBeforeRender(x,T,V,I),p=Ne.get(T,y.length),p.init(V),y.push(p),K.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),re.setFromProjectionMatrix(K,zn,V.reversedDepth),k=this.localClippingEnabled,oe=pe.init(this.clippingPlanes,k),g=$.get(T,M.length),g.init(),M.push(g),fe.enabled===!0&&fe.isPresenting===!0){let ue=x.xr.getDepthSensingMesh();ue!==null&&kc(ue,V,-1/0,x.sortObjects)}kc(T,V,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort(ee,ie),Ke=fe.enabled===!1||fe.isPresenting===!1||fe.hasDepthSensing()===!1,Ke&&Le.addToRenderList(g,T),this.info.render.frame++,oe===!0&&pe.beginShadows();let X=p.state.shadowsArray;Pe.render(X,T,V),oe===!0&&pe.endShadows(),this.info.autoReset===!0&&this.info.reset();let Y=g.opaque,H=g.transmissive;if(p.setupLights(),V.isArrayCamera){let ue=V.cameras;if(H.length>0)for(let be=0,Ie=ue.length;be<Ie;be++){let Te=ue[be];vu(Y,H,T,Te)}Ke&&Le.render(T);for(let be=0,Ie=ue.length;be<Ie;be++){let Te=ue[be];yu(g,T,Te,Te.viewport)}}else H.length>0&&vu(Y,H,T,V),Ke&&Le.render(T),yu(g,T,V);I!==null&&C===0&&(_e.updateMultisampleRenderTarget(I),_e.updateRenderTargetMipmap(I)),T.isScene===!0&&T.onAfterRender(x,T,V),Me.resetDefaultState(),w=-1,b=null,y.pop(),y.length>0?(p=y[y.length-1],oe===!0&&pe.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,M.pop(),M.length>0?g=M[M.length-1]:g=null};function kc(T,V,X,Y){if(T.visible===!1)return;if(T.layers.test(V.layers)){if(T.isGroup)X=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(V);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||re.intersectsSprite(T)){Y&&Ce.setFromMatrixPosition(T.matrixWorld).applyMatrix4(K);let be=W.update(T),Ie=T.material;Ie.visible&&g.push(T,be,Ie,X,Ce.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||re.intersectsObject(T))){let be=W.update(T),Ie=T.material;if(Y&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ce.copy(T.boundingSphere.center)):(be.boundingSphere===null&&be.computeBoundingSphere(),Ce.copy(be.boundingSphere.center)),Ce.applyMatrix4(T.matrixWorld).applyMatrix4(K)),Array.isArray(Ie)){let Te=be.groups;for(let ze=0,Ve=Te.length;ze<Ve;ze++){let Fe=Te[ze],tt=Ie[Fe.materialIndex];tt&&tt.visible&&g.push(T,be,tt,X,Ce.z,Fe)}}else Ie.visible&&g.push(T,be,Ie,X,Ce.z,null)}}let ue=T.children;for(let be=0,Ie=ue.length;be<Ie;be++)kc(ue[be],V,X,Y)}function yu(T,V,X,Y){let H=T.opaque,ue=T.transmissive,be=T.transparent;p.setupLightsView(X),oe===!0&&pe.setGlobalState(x.clippingPlanes,X),Y&&J.viewport(L.copy(Y)),H.length>0&&wo(H,V,X),ue.length>0&&wo(ue,V,X),be.length>0&&wo(be,V,X),J.buffers.depth.setTest(!0),J.buffers.depth.setMask(!0),J.buffers.color.setMask(!0),J.setPolygonOffset(!1)}function vu(T,V,X,Y){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Y.id]===void 0&&(p.state.transmissionRenderTarget[Y.id]=new Kn(1,1,{generateMipmaps:!0,type:Q.has("EXT_color_buffer_half_float")||Q.has("EXT_color_buffer_float")?qn:Xn,minFilter:ln,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:nt.workingColorSpace}));let ue=p.state.transmissionRenderTarget[Y.id],be=Y.viewport||L;ue.setSize(be.z*x.transmissionResolutionScale,be.w*x.transmissionResolutionScale);let Ie=x.getRenderTarget(),Te=x.getActiveCubeFace(),ze=x.getActiveMipmapLevel();x.setRenderTarget(ue),x.getClearColor(A),U=x.getClearAlpha(),U<1&&x.setClearColor(16777215,.5),x.clear(),Ke&&Le.render(X);let Ve=x.toneMapping;x.toneMapping=bi;let Fe=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),p.setupLightsView(Y),oe===!0&&pe.setGlobalState(x.clippingPlanes,Y),wo(T,X,Y),_e.updateMultisampleRenderTarget(ue),_e.updateRenderTargetMipmap(ue),Q.has("WEBGL_multisampled_render_to_texture")===!1){let tt=!1;for(let dt=0,Tt=V.length;dt<Tt;dt++){let yt=V[dt],pt=yt.object,Oe=yt.geometry,bt=yt.material,it=yt.group;if(bt.side===gt&&pt.layers.test(Y.layers)){let dn=bt.side;bt.side=Gt,bt.needsUpdate=!0,Mu(pt,X,Y,Oe,bt,it),bt.side=dn,bt.needsUpdate=!0,tt=!0}}tt===!0&&(_e.updateMultisampleRenderTarget(ue),_e.updateRenderTargetMipmap(ue))}x.setRenderTarget(Ie,Te,ze),x.setClearColor(A,U),Fe!==void 0&&(Y.viewport=Fe),x.toneMapping=Ve}function wo(T,V,X){let Y=V.isScene===!0?V.overrideMaterial:null;for(let H=0,ue=T.length;H<ue;H++){let be=T[H],Ie=be.object,Te=be.geometry,ze=be.group,Ve=be.material;Ve.allowOverride===!0&&Y!==null&&(Ve=Y),Ie.layers.test(X.layers)&&Mu(Ie,V,X,Te,Ve,ze)}}function Mu(T,V,X,Y,H,ue){T.onBeforeRender(x,V,X,Y,H,ue),T.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),H.onBeforeRender(x,V,X,Y,T,ue),H.transparent===!0&&H.side===gt&&H.forceSinglePass===!1?(H.side=Gt,H.needsUpdate=!0,x.renderBufferDirect(X,V,Y,H,T,ue),H.side=kn,H.needsUpdate=!0,x.renderBufferDirect(X,V,Y,H,T,ue),H.side=gt):x.renderBufferDirect(X,V,Y,H,T,ue),T.onAfterRender(x,V,X,Y,H,ue)}function To(T,V,X){V.isScene!==!0&&(V=Re);let Y=ae.get(T),H=p.state.lights,ue=p.state.shadowsArray,be=H.state.version,Ie=Z.getParameters(T,H.state,ue,V,X),Te=Z.getProgramCacheKey(Ie),ze=Y.programs;Y.environment=T.isMeshStandardMaterial?V.environment:null,Y.fog=V.fog,Y.envMap=(T.isMeshStandardMaterial?Ge:We).get(T.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&T.envMap===null?V.environmentRotation:T.envMapRotation,ze===void 0&&(T.addEventListener("dispose",te),ze=new Map,Y.programs=ze);let Ve=ze.get(Te);if(Ve!==void 0){if(Y.currentProgram===Ve&&Y.lightsStateVersion===be)return Su(T,Ie),Ve}else Ie.uniforms=Z.getUniforms(T),T.onBeforeCompile(Ie,x),Ve=Z.acquireProgram(Ie,Te),ze.set(Te,Ve),Y.uniforms=Ie.uniforms;let Fe=Y.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Fe.clippingPlanes=pe.uniform),Su(T,Ie),Y.needsLights=Kp(T),Y.lightsStateVersion=be,Y.needsLights&&(Fe.ambientLightColor.value=H.state.ambient,Fe.lightProbe.value=H.state.probe,Fe.directionalLights.value=H.state.directional,Fe.directionalLightShadows.value=H.state.directionalShadow,Fe.spotLights.value=H.state.spot,Fe.spotLightShadows.value=H.state.spotShadow,Fe.rectAreaLights.value=H.state.rectArea,Fe.ltc_1.value=H.state.rectAreaLTC1,Fe.ltc_2.value=H.state.rectAreaLTC2,Fe.pointLights.value=H.state.point,Fe.pointLightShadows.value=H.state.pointShadow,Fe.hemisphereLights.value=H.state.hemi,Fe.directionalShadowMap.value=H.state.directionalShadowMap,Fe.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Fe.spotShadowMap.value=H.state.spotShadowMap,Fe.spotLightMatrix.value=H.state.spotLightMatrix,Fe.spotLightMap.value=H.state.spotLightMap,Fe.pointShadowMap.value=H.state.pointShadowMap,Fe.pointShadowMatrix.value=H.state.pointShadowMatrix),Y.currentProgram=Ve,Y.uniformsList=null,Ve}function bu(T){if(T.uniformsList===null){let V=T.currentProgram.getUniforms();T.uniformsList=cr.seqWithValue(V.seq,T.uniforms)}return T.uniformsList}function Su(T,V){let X=ae.get(T);X.outputColorSpace=V.outputColorSpace,X.batching=V.batching,X.batchingColor=V.batchingColor,X.instancing=V.instancing,X.instancingColor=V.instancingColor,X.instancingMorph=V.instancingMorph,X.skinning=V.skinning,X.morphTargets=V.morphTargets,X.morphNormals=V.morphNormals,X.morphColors=V.morphColors,X.morphTargetsCount=V.morphTargetsCount,X.numClippingPlanes=V.numClippingPlanes,X.numIntersection=V.numClipIntersection,X.vertexAlphas=V.vertexAlphas,X.vertexTangents=V.vertexTangents,X.toneMapping=V.toneMapping}function Yp(T,V,X,Y,H){V.isScene!==!0&&(V=Re),_e.resetTextureUnits();let ue=V.fog,be=Y.isMeshStandardMaterial?V.environment:null,Ie=I===null?x.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:Dt,Te=(Y.isMeshStandardMaterial?Ge:We).get(Y.envMap||be),ze=Y.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Ve=!!X.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Fe=!!X.morphAttributes.position,tt=!!X.morphAttributes.normal,dt=!!X.morphAttributes.color,Tt=bi;Y.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(Tt=x.toneMapping);let yt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,pt=yt!==void 0?yt.length:0,Oe=ae.get(Y),bt=p.state.lights;if(oe===!0&&(k===!0||T!==b)){let Kt=T===b&&Y.id===w;pe.setState(Y,T,Kt)}let it=!1;Y.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==bt.state.version||Oe.outputColorSpace!==Ie||H.isBatchedMesh&&Oe.batching===!1||!H.isBatchedMesh&&Oe.batching===!0||H.isBatchedMesh&&Oe.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Oe.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Oe.instancing===!1||!H.isInstancedMesh&&Oe.instancing===!0||H.isSkinnedMesh&&Oe.skinning===!1||!H.isSkinnedMesh&&Oe.skinning===!0||H.isInstancedMesh&&Oe.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Oe.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Oe.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Oe.instancingMorph===!1&&H.morphTexture!==null||Oe.envMap!==Te||Y.fog===!0&&Oe.fog!==ue||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==pe.numPlanes||Oe.numIntersection!==pe.numIntersection)||Oe.vertexAlphas!==ze||Oe.vertexTangents!==Ve||Oe.morphTargets!==Fe||Oe.morphNormals!==tt||Oe.morphColors!==dt||Oe.toneMapping!==Tt||Oe.morphTargetsCount!==pt)&&(it=!0):(it=!0,Oe.__version=Y.version);let dn=Oe.currentProgram;it===!0&&(dn=To(Y,V,H));let Ms=!1,fn=!1,gr=!1,St=dn.getUniforms(),Mn=Oe.uniforms;if(J.useProgram(dn.program)&&(Ms=!0,fn=!0,gr=!0),Y.id!==w&&(w=Y.id,fn=!0),Ms||b!==T){J.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),St.setValue(D,"projectionMatrix",T.projectionMatrix),St.setValue(D,"viewMatrix",T.matrixWorldInverse);let tn=St.map.cameraPosition;tn!==void 0&&tn.setValue(D,ge.setFromMatrixPosition(T.matrixWorld)),j.logarithmicDepthBuffer&&St.setValue(D,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&St.setValue(D,"isOrthographic",T.isOrthographicCamera===!0),b!==T&&(b=T,fn=!0,gr=!0)}if(H.isSkinnedMesh){St.setOptional(D,H,"bindMatrix"),St.setOptional(D,H,"bindMatrixInverse");let Kt=H.skeleton;Kt&&(Kt.boneTexture===null&&Kt.computeBoneTexture(),St.setValue(D,"boneTexture",Kt.boneTexture,_e))}H.isBatchedMesh&&(St.setOptional(D,H,"batchingTexture"),St.setValue(D,"batchingTexture",H._matricesTexture,_e),St.setOptional(D,H,"batchingIdTexture"),St.setValue(D,"batchingIdTexture",H._indirectTexture,_e),St.setOptional(D,H,"batchingColorTexture"),H._colorsTexture!==null&&St.setValue(D,"batchingColorTexture",H._colorsTexture,_e));let bn=X.morphAttributes;if((bn.position!==void 0||bn.normal!==void 0||bn.color!==void 0)&&ce.update(H,X,dn),(fn||Oe.receiveShadow!==H.receiveShadow)&&(Oe.receiveShadow=H.receiveShadow,St.setValue(D,"receiveShadow",H.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(Mn.envMap.value=Te,Mn.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&V.environment!==null&&(Mn.envMapIntensity.value=V.environmentIntensity),fn&&(St.setValue(D,"toneMappingExposure",x.toneMappingExposure),Oe.needsLights&&Zp(Mn,gr),ue&&Y.fog===!0&&se.refreshFogUniforms(Mn,ue),se.refreshMaterialUniforms(Mn,Y,O,q,p.state.transmissionRenderTarget[T.id]),cr.upload(D,bu(Oe),Mn,_e)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(cr.upload(D,bu(Oe),Mn,_e),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&St.setValue(D,"center",H.center),St.setValue(D,"modelViewMatrix",H.modelViewMatrix),St.setValue(D,"normalMatrix",H.normalMatrix),St.setValue(D,"modelMatrix",H.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){let Kt=Y.uniformsGroups;for(let tn=0,Vc=Kt.length;tn<Vc;tn++){let Gi=Kt[tn];Ze.update(Gi,dn),Ze.bind(Gi,dn)}}return dn}function Zp(T,V){T.ambientLightColor.needsUpdate=V,T.lightProbe.needsUpdate=V,T.directionalLights.needsUpdate=V,T.directionalLightShadows.needsUpdate=V,T.pointLights.needsUpdate=V,T.pointLightShadows.needsUpdate=V,T.spotLights.needsUpdate=V,T.spotLightShadows.needsUpdate=V,T.rectAreaLights.needsUpdate=V,T.hemisphereLights.needsUpdate=V}function Kp(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(T,V,X){let Y=ae.get(T);Y.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),ae.get(T.texture).__webglTexture=V,ae.get(T.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:X,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,V){let X=ae.get(T);X.__webglFramebuffer=V,X.__useDefaultFramebuffer=V===void 0};let $p=D.createFramebuffer();this.setRenderTarget=function(T,V=0,X=0){I=T,E=V,C=X;let Y=!0,H=null,ue=!1,be=!1;if(T){let Te=ae.get(T);if(Te.__useDefaultFramebuffer!==void 0)J.bindFramebuffer(D.FRAMEBUFFER,null),Y=!1;else if(Te.__webglFramebuffer===void 0)_e.setupRenderTarget(T);else if(Te.__hasExternalTextures)_e.rebindTextures(T,ae.get(T.texture).__webglTexture,ae.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Fe=T.depthTexture;if(Te.__boundDepthTexture!==Fe){if(Fe!==null&&ae.has(Fe)&&(T.width!==Fe.image.width||T.height!==Fe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");_e.setupDepthRenderbuffer(T)}}let ze=T.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(be=!0);let Ve=ae.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ve[V])?H=Ve[V][X]:H=Ve[V],ue=!0):T.samples>0&&_e.useMultisampledRTT(T)===!1?H=ae.get(T).__webglMultisampledFramebuffer:Array.isArray(Ve)?H=Ve[X]:H=Ve,L.copy(T.viewport),z.copy(T.scissor),F=T.scissorTest}else L.copy(de).multiplyScalar(O).floor(),z.copy(we).multiplyScalar(O).floor(),F=G;if(X!==0&&(H=$p),J.bindFramebuffer(D.FRAMEBUFFER,H)&&Y&&J.drawBuffers(T,H),J.viewport(L),J.scissor(z),J.setScissorTest(F),ue){let Te=ae.get(T.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+V,Te.__webglTexture,X)}else if(be){let Te=V;for(let ze=0;ze<T.textures.length;ze++){let Ve=ae.get(T.textures[ze]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+ze,Ve.__webglTexture,X,Te)}}else if(T!==null&&X!==0){let Te=ae.get(T.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Te.__webglTexture,X)}w=-1},this.readRenderTargetPixels=function(T,V,X,Y,H,ue,be,Ie=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=ae.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&be!==void 0&&(Te=Te[be]),Te){J.bindFramebuffer(D.FRAMEBUFFER,Te);try{let ze=T.textures[Ie],Ve=ze.format,Fe=ze.type;if(!j.textureFormatReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!j.textureTypeReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=T.width-Y&&X>=0&&X<=T.height-H&&(T.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Ie),D.readPixels(V,X,Y,H,Ue.convert(Ve),Ue.convert(Fe),ue))}finally{let ze=I!==null?ae.get(I).__webglFramebuffer:null;J.bindFramebuffer(D.FRAMEBUFFER,ze)}}},this.readRenderTargetPixelsAsync=async function(T,V,X,Y,H,ue,be,Ie=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=ae.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&be!==void 0&&(Te=Te[be]),Te)if(V>=0&&V<=T.width-Y&&X>=0&&X<=T.height-H){J.bindFramebuffer(D.FRAMEBUFFER,Te);let ze=T.textures[Ie],Ve=ze.format,Fe=ze.type;if(!j.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!j.textureTypeReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let tt=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,tt),D.bufferData(D.PIXEL_PACK_BUFFER,ue.byteLength,D.STREAM_READ),T.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+Ie),D.readPixels(V,X,Y,H,Ue.convert(Ve),Ue.convert(Fe),0);let dt=I!==null?ae.get(I).__webglFramebuffer:null;J.bindFramebuffer(D.FRAMEBUFFER,dt);let Tt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Qd(D,Tt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,tt),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,ue),D.deleteBuffer(tt),D.deleteSync(Tt),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,V=null,X=0){let Y=Math.pow(2,-X),H=Math.floor(T.image.width*Y),ue=Math.floor(T.image.height*Y),be=V!==null?V.x:0,Ie=V!==null?V.y:0;_e.setTexture2D(T,0),D.copyTexSubImage2D(D.TEXTURE_2D,X,0,0,be,Ie,H,ue),J.unbindTexture()};let Jp=D.createFramebuffer(),jp=D.createFramebuffer();this.copyTextureToTexture=function(T,V,X=null,Y=null,H=0,ue=null){ue===null&&(H!==0?(ks("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ue=H,H=0):ue=0);let be,Ie,Te,ze,Ve,Fe,tt,dt,Tt,yt=T.isCompressedTexture?T.mipmaps[ue]:T.image;if(X!==null)be=X.max.x-X.min.x,Ie=X.max.y-X.min.y,Te=X.isBox3?X.max.z-X.min.z:1,ze=X.min.x,Ve=X.min.y,Fe=X.isBox3?X.min.z:0;else{let bn=Math.pow(2,-H);be=Math.floor(yt.width*bn),Ie=Math.floor(yt.height*bn),T.isDataArrayTexture?Te=yt.depth:T.isData3DTexture?Te=Math.floor(yt.depth*bn):Te=1,ze=0,Ve=0,Fe=0}Y!==null?(tt=Y.x,dt=Y.y,Tt=Y.z):(tt=0,dt=0,Tt=0);let pt=Ue.convert(V.format),Oe=Ue.convert(V.type),bt;V.isData3DTexture?(_e.setTexture3D(V,0),bt=D.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(_e.setTexture2DArray(V,0),bt=D.TEXTURE_2D_ARRAY):(_e.setTexture2D(V,0),bt=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,V.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,V.unpackAlignment);let it=D.getParameter(D.UNPACK_ROW_LENGTH),dn=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Ms=D.getParameter(D.UNPACK_SKIP_PIXELS),fn=D.getParameter(D.UNPACK_SKIP_ROWS),gr=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,yt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,yt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,ze),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ve),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Fe);let St=T.isDataArrayTexture||T.isData3DTexture,Mn=V.isDataArrayTexture||V.isData3DTexture;if(T.isDepthTexture){let bn=ae.get(T),Kt=ae.get(V),tn=ae.get(bn.__renderTarget),Vc=ae.get(Kt.__renderTarget);J.bindFramebuffer(D.READ_FRAMEBUFFER,tn.__webglFramebuffer),J.bindFramebuffer(D.DRAW_FRAMEBUFFER,Vc.__webglFramebuffer);for(let Gi=0;Gi<Te;Gi++)St&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,ae.get(T).__webglTexture,H,Fe+Gi),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,ae.get(V).__webglTexture,ue,Tt+Gi)),D.blitFramebuffer(ze,Ve,be,Ie,tt,dt,be,Ie,D.DEPTH_BUFFER_BIT,D.NEAREST);J.bindFramebuffer(D.READ_FRAMEBUFFER,null),J.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(H!==0||T.isRenderTargetTexture||ae.has(T)){let bn=ae.get(T),Kt=ae.get(V);J.bindFramebuffer(D.READ_FRAMEBUFFER,Jp),J.bindFramebuffer(D.DRAW_FRAMEBUFFER,jp);for(let tn=0;tn<Te;tn++)St?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,bn.__webglTexture,H,Fe+tn):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,bn.__webglTexture,H),Mn?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Kt.__webglTexture,ue,Tt+tn):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Kt.__webglTexture,ue),H!==0?D.blitFramebuffer(ze,Ve,be,Ie,tt,dt,be,Ie,D.COLOR_BUFFER_BIT,D.NEAREST):Mn?D.copyTexSubImage3D(bt,ue,tt,dt,Tt+tn,ze,Ve,be,Ie):D.copyTexSubImage2D(bt,ue,tt,dt,ze,Ve,be,Ie);J.bindFramebuffer(D.READ_FRAMEBUFFER,null),J.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Mn?T.isDataTexture||T.isData3DTexture?D.texSubImage3D(bt,ue,tt,dt,Tt,be,Ie,Te,pt,Oe,yt.data):V.isCompressedArrayTexture?D.compressedTexSubImage3D(bt,ue,tt,dt,Tt,be,Ie,Te,pt,yt.data):D.texSubImage3D(bt,ue,tt,dt,Tt,be,Ie,Te,pt,Oe,yt):T.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,ue,tt,dt,be,Ie,pt,Oe,yt.data):T.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,ue,tt,dt,yt.width,yt.height,pt,yt.data):D.texSubImage2D(D.TEXTURE_2D,ue,tt,dt,be,Ie,pt,Oe,yt);D.pixelStorei(D.UNPACK_ROW_LENGTH,it),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,dn),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ms),D.pixelStorei(D.UNPACK_SKIP_ROWS,fn),D.pixelStorei(D.UNPACK_SKIP_IMAGES,gr),ue===0&&V.generateMipmaps&&D.generateMipmap(bt),J.unbindTexture()},this.initRenderTarget=function(T){ae.get(T).__webglFramebuffer===void 0&&_e.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?_e.setTextureCube(T,0):T.isData3DTexture?_e.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?_e.setTexture2DArray(T,0):_e.setTexture2D(T,0),J.unbindTexture()},this.resetState=function(){E=0,C=0,I=null,J.reset(),Me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=nt._getDrawingBufferColorSpace(e),t.unpackColorSpace=nt._getUnpackColorSpace()}}});function Bf(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new ot,l=0;for(let h=0;h<i.length;++h){let u=i[h],d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(t){let h=0,u=[];for(let d=0;d<i.length;++d){let f=i[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=i[d].attributes.position.count}c.setIndex(u)}for(let h in r){let u=Of(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let _=0;_<o[h].length;++_)f.push(o[h][_][d]);let m=Of(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(m)}}return c}function Of(i){let e,t,n,s=-1,r=0;for(let l=0;l<i.length;++l){let h=i[l];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new ft(o,t,n),c=0;for(let l=0;l<i.length;++l){let h=i[l];if(h.isInterleavedBufferAttribute){let u=c/t;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<t;m++){let _=h.getComponent(d,m);a.setComponent(d+u,m,_)}}else o.set(h.array,c);c+=h.count*t}return s!==void 0&&(a.gpuType=s),a}function xh(i,e){if(e===ql)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===rr||e===po){let t=i.getIndex();if(t===null){let o=[],a=i.getAttribute("position");if(a!==void 0){for(let c=0;c<a.count;c++)o.push(c);i.setIndex(o),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}let n=t.count-2,s=[];if(e===rr)for(let o=1;o<=n;o++)s.push(t.getX(0)),s.push(t.getX(o)),s.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(s.push(t.getX(o)),s.push(t.getX(o+1)),s.push(t.getX(o+2))):(s.push(t.getX(o+2)),s.push(t.getX(o+1)),s.push(t.getX(o)));s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=i.clone();return r.setIndex(s),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}var yh=Ft(()=>{hn()});function sv(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function av(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new at({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:kn})),i.DefaultMaterial}function ys(i,e,t){for(let n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function si(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function cv(i,e,t){let n=!1,s=!1,r=!1;for(let l=0,h=e.length;l<h;l++){let u=e[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(s=!0),u.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);let o=[],a=[],c=[];for(let l=0,h=e.length;l<h;l++){let u=e[l];if(n){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):i.attributes.position;o.push(d)}if(s){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):i.attributes.normal;a.push(d)}if(r){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):i.attributes.color;c.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){let h=l[0],u=l[1],d=l[2];return n&&(i.morphAttributes.position=h),s&&(i.morphAttributes.normal=u),r&&(i.morphAttributes.color=d),i.morphTargetsRelative=!0,i})}function lv(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function hv(i){let e,t=i.extensions&&i.extensions[et.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+bh(t.attributes):e=i.indices+":"+bh(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+bh(i.targets[n]);return e}function bh(i){let e="",t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function Yh(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function uv(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}function fv(i,e,t){let n=e.attributes,s=new Vt;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(s.set(new P(c[0],c[1],c[2]),new P(l[0],l[1],l[2])),a.normalized){let h=Yh(hr[a.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new P,c=new P;for(let l=0,h=r.length;l<h;l++){let u=r[l];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],f=d.min,m=d.max;if(f!==void 0&&m!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(m[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(m[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(m[2]))),d.normalized){let _=Yh(hr[d.componentType]);c.multiplyScalar(_)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}i.boundingBox=s;let o=new sn;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=o}function Gf(i,e,t){let n=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(c){i.setAttribute(a,c)})}for(let o in n){let a=qh[o]||o.toLowerCase();a in i.attributes||s.push(r(n[o],a))}if(e.indices!==void 0&&!i.index){let o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});s.push(o)}return nt.workingColorSpace!==Dt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${nt.workingColorSpace}" not supported.`),si(i,e),fv(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?cv(i,e.targets,t):i})}var ur,et,Sh,wh,Th,Eh,Ah,Rh,Ch,Ih,Ph,Lh,Dh,Nh,Uh,Fh,Oh,Bh,zh,kh,Hf,go,zf,Vh,Gh,Hh,Wh,Mc,rv,Xh,Pn,hr,kf,Vf,vh,qh,Bi,ov,Mh,dv,Zh,Kh=Ft(()=>{hn();yh();ur=class extends Wn{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Eh(t)}),this.register(function(t){return new Ah(t)}),this.register(function(t){return new Fh(t)}),this.register(function(t){return new Oh(t)}),this.register(function(t){return new Bh(t)}),this.register(function(t){return new Ch(t)}),this.register(function(t){return new Ih(t)}),this.register(function(t){return new Ph(t)}),this.register(function(t){return new Lh(t)}),this.register(function(t){return new Th(t)}),this.register(function(t){return new Dh(t)}),this.register(function(t){return new Rh(t)}),this.register(function(t){return new Uh(t)}),this.register(function(t){return new Nh(t)}),this.register(function(t){return new Sh(t)}),this.register(function(t){return new zh(t)}),this.register(function(t){return new kh(t)})}load(e,t,n,s){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let l=vi.extractUrlBase(e);o=vi.resolveURL(l,this.path)}else o=vi.extractUrlBase(e);this.manager.itemStart(e);let a=function(l){s?s(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new rs(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,o,function(h){t(h),r.manager.itemEnd(e)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r,o={},a={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===Hf){try{o[et.KHR_BINARY_GLTF]=new Vh(e)}catch(u){s&&s(u);return}r=JSON.parse(o[et.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let l=new Zh(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case et.KHR_MATERIALS_UNLIT:o[u]=new wh;break;case et.KHR_DRACO_MESH_COMPRESSION:o[u]=new Gh(r,this.dracoLoader);break;case et.KHR_TEXTURE_TRANSFORM:o[u]=new Hh;break;case et.KHR_MESH_QUANTIZATION:o[u]=new Wh;break;default:d.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,s)}parseAsync(e,t){let n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}};et={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},Sh=class{constructor(e){this.parser=e,this.name=et.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,s=t.cache.get(n);if(s)return s;let r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],l,h=new Ee(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],Dt);let u=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new Fi(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new cn(h),l.distance=u;break;case"spot":l=new oo(h),l.distance=u,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),si(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),s=Promise.resolve(l),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(t.cache,a,c)})}},wh=class{constructor(){this.name=et.KHR_MATERIALS_UNLIT}getMaterialType(){return Et}extendParams(e,t,n){let s=[];e.color=new Ee(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Dt),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,vt))}return Promise.all(s)}},Th=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=s.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}},Eh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:on}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){let a=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new he(a,a)}return Promise.all(r)}},Ah=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_DISPERSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:on}extendMaterialParams(e,t){let s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=s.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}},Rh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:on}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}},Ch=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_SHEEN}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:on}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[];t.sheenColor=new Ee(0,0,0),t.sheenRoughness=0,t.sheen=1;let o=s.extensions[this.name];if(o.sheenColorFactor!==void 0){let a=o.sheenColorFactor;t.sheenColor.setRGB(a[0],a[1],a[2],Dt)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,vt)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}},Ih=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:on}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(r)}},Ph=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_VOLUME}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:on}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;let a=o.attenuationColor||[1,1,1];return t.attenuationColor=new Ee().setRGB(a[0],a[1],a[2],Dt),Promise.all(r)}},Lh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_IOR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:on}extendMaterialParams(e,t){let s=this.parser.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=s.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}},Dh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_SPECULAR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:on}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));let a=o.specularColorFactor||[1,1,1];return t.specularColor=new Ee().setRGB(a[0],a[1],a[2],Dt),o.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,vt)),Promise.all(r)}},Nh=class{constructor(e){this.parser=e,this.name=et.EXT_MATERIALS_BUMP}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:on}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(r)}},Uh=class{constructor(e){this.parser=e,this.name=et.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:on}extendMaterialParams(e,t){let n=this.parser,s=n.json.materials[e];if(!s.extensions||!s.extensions[this.name])return Promise.resolve();let r=[],o=s.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}},Fh=class{constructor(e){this.parser=e,this.name=et.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;let r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},Oh=class{constructor(e){this.parser=e,this.name=et.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}},Bh=class{constructor(e){this.parser=e,this.name=et.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=s.images[o.source],c=n.textureLoader;if(a.uri){let l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}},zh=class{constructor(e){this.name=et.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let c=s.byteOffset||0,l=s.byteLength||0,h=s.count,u=s.byteStride,d=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,d,s.mode,s.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(f),h,u,d,s.mode,s.filter),f})})}else return null}},kh=class{constructor(e){this.name=et.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let s=t.meshes[n.mesh];for(let l of s.primitives)if(l.mode!==Pn.TRIANGLES&&l.mode!==Pn.TRIANGLE_STRIP&&l.mode!==Pn.TRIANGLE_FAN&&l.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],c={};for(let l in o)a.push(this.parser.getDependency("accessor",o[l]).then(h=>(c[l]=h,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{let h=l.pop(),u=h.isGroup?h.children:[h],d=l[0].count,f=[];for(let m of u){let _=new Be,g=new P,p=new nn,M=new P(1,1,1),y=new Lt(m.geometry,m.material,d);for(let x=0;x<d;x++)c.TRANSLATION&&g.fromBufferAttribute(c.TRANSLATION,x),c.ROTATION&&p.fromBufferAttribute(c.ROTATION,x),c.SCALE&&M.fromBufferAttribute(c.SCALE,x),y.setMatrixAt(x,_.compose(g,p,M));for(let x in c)if(x==="_COLOR_0"){let S=c[x];y.instanceColor=new Ui(S.array,S.itemSize,S.normalized)}else x!=="TRANSLATION"&&x!=="ROTATION"&&x!=="SCALE"&&m.geometry.setAttribute(x,c[x]);Qe.prototype.copy.call(y,m),this.parser.assignFinalMaterial(y),f.push(y)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}},Hf="glTF",go=12,zf={JSON:1313821514,BIN:5130562},Vh=class{constructor(e){this.name=et.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,go),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Hf)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let s=this.header.length-go,r=new DataView(e,go),o=0;for(;o<s;){let a=r.getUint32(o,!0);o+=4;let c=r.getUint32(o,!0);if(o+=4,c===zf.JSON){let l=new Uint8Array(e,go+o,a);this.content=n.decode(l)}else if(c===zf.BIN){let l=go+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Gh=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=et.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(let h in o){let u=qh[h]||h.toLowerCase();a[u]=o[h]}for(let h in e.attributes){let u=qh[h]||h.toLowerCase();if(o[h]!==void 0){let d=n.accessors[e.attributes[h]],f=hr[d.componentType];l[u]=f.name,c[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){s.decodeDracoFile(h,function(f){for(let m in f.attributes){let _=f.attributes[m],g=c[m];g!==void 0&&(_.normalized=g)}u(f)},a,l,Dt,d)})})}},Hh=class{constructor(){this.name=et.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},Wh=class{constructor(){this.name=et.KHR_MESH_QUANTIZATION}},Mc=class extends _i{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,h=s-t,u=(n-t)/h,d=u*u,f=d*u,m=e*l,_=m-l,g=-2*f+3*d,p=f-d,M=1-g,y=p-d+u;for(let x=0;x!==a;x++){let S=o[_+x+a],E=o[_+x+c]*h,C=o[m+x+a],I=o[m+x]*h;r[x]=M*S+y*E+g*C+p*I}return r}},rv=new nn,Xh=class extends Mc{interpolate_(e,t,n,s){let r=super.interpolate_(e,t,n,s);return rv.fromArray(r).normalize().toArray(r),r}},Pn={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},hr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},kf={9728:kt,9729:Mt,9984:Da,9985:tr,9986:ds,9987:ln},Vf={33071:Tn,33648:Os,10497:gn},vh={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},qh={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Bi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},ov={CUBICSPLINE:void 0,LINEAR:ji,STEP:Ji},Mh={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};dv=new Be,Zh=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new sv,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let c=a.match(/Version\/(\d+)/);s=n&&c?parseInt(c[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&o<98?this.textureLoader=new os(this.options.manager):this.textureLoader=new ao(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new rs(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:n,userData:{}};return ys(r,a,s),si(a,s),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(let c of a.scenes)c.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){let o=t[s].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){let o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let s=n.clone(),r=(o,a)=>{let c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(let[l,h]of o.children.entries())r(h,a.children[l])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let s=e(t[n]);if(s)return s}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let s=0;s<t.length;s++){let r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[et.KHR_BINARY_GLTF].body);let s=this.options;return new Promise(function(r,o){n.load(vi.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){let t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){let o=vh[s.type],a=hr[s.componentType],c=s.normalized===!0,l=new a(s.count*o);return Promise.resolve(new ft(l,o,c))}let r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],c=vh[s.type],l=hr[s.componentType],h=l.BYTES_PER_ELEMENT,u=h*c,d=s.byteOffset||0,f=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,m=s.normalized===!0,_,g;if(f&&f!==u){let p=Math.floor(d/f),M="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+p+":"+s.count,y=t.cache.get(M);y||(_=new l(a,p*f,s.count*f/h),y=new Ws(_,f/h),t.cache.add(M,y)),g=new Xs(y,c,d%f/h,m)}else a===null?_=new l(s.count*c):_=new l(a,d,s.count*c),g=new ft(_,c,m);if(s.sparse!==void 0){let p=vh.SCALAR,M=hr[s.sparse.indices.componentType],y=s.sparse.indices.byteOffset||0,x=s.sparse.values.byteOffset||0,S=new M(o[1],y,s.sparse.count*p),E=new l(o[2],x,s.sparse.count*c);a!==null&&(g=new ft(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let C=0,I=S.length;C<I;C++){let w=S[C];if(g.setX(w,E[C*c]),c>=2&&g.setY(w,E[C*c+1]),c>=3&&g.setZ(w,E[C*c+2]),c>=4&&g.setW(w,E[C*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=m}return g})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let s=this,r=this.json,o=r.textures[e],a=r.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];let l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);let d=(r.samplers||{})[o.sampler]||{};return h.magFilter=kf[d.magFilter]||Mt,h.minFilter=kf[d.minFilter]||ln,h.wrapS=Vf[d.wrapS]||gn,h.wrapT=Vf[d.wrapT]||gn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==kt&&h.minFilter!==Mt,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){let n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let o=s.images[e],a=self.URL||self.webkitURL,c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(u){l=!0;let d=new Blob([u],{type:o.mimeType});return c=a.createObjectURL(d),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(c).then(function(u){return new Promise(function(d,f){let m=d;t.isImageBitmapLoader===!0&&(m=function(_){let g=new Bt(_);g.needsUpdate=!0,d(g)}),t.load(vi.resolveURL(u,r.path),m,void 0,f)})}).then(function(u){return l===!0&&a.revokeObjectURL(c),si(u,o),u.userData.mimeType=o.mimeType||uv(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,s){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[et.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[et.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let c=r.associations.get(o);o=r.extensions[et.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new _n,Jt.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,c=this.cache.get(a);c||(c=new Gn,Jt.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(s||r||o){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),s&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return at}loadMaterial(e){let t=this,n=this.json,s=this.extensions,r=n.materials[e],o,a={},c=r.extensions||{},l=[];if(c[et.KHR_MATERIALS_UNLIT]){let u=s[et.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),l.push(u.extendParams(a,r,t))}else{let u=r.pbrMetallicRoughness||{};if(a.color=new Ee(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],Dt),a.opacity=d[3]}u.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",u.baseColorTexture,vt)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=gt);let h=r.alphaMode||Mh.OPAQUE;if(h===Mh.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===Mh.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Et&&(l.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new he(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;a.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&o!==Et&&(l.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Et){let u=r.emissiveFactor;a.emissive=new Ee().setRGB(u[0],u[1],u[2],Dt)}return r.emissiveTexture!==void 0&&o!==Et&&l.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,vt)),Promise.all(l).then(function(){let u=new o(a);return r.name&&(u.name=r.name),si(u,r),t.associations.set(u,{materials:e}),r.extensions&&ys(s,u,r),u})}createUniqueName(e){let t=mt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,s=this.primitiveCache;function r(a){return n[et.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return Gf(c,a,t)})}let o=[];for(let a=0,c=e.length;a<c;a++){let l=e[a],h=hv(l),u=s[h];if(u)o.push(u.promise);else{let d;l.extensions&&l.extensions[et.KHR_DRACO_MESH_COMPRESSION]?d=r(l):d=Gf(new ot,l,t),s[h]={primitive:l,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,s=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){let h=o[c].material===void 0?av(this.cache):this.getDependency("material",o[c].material);a.push(h)}return a.push(t.loadGeometries(o)),Promise.all(a).then(function(c){let l=c.slice(0,c.length-1),h=c[c.length-1],u=[];for(let f=0,m=h.length;f<m;f++){let _=h[f],g=o[f],p,M=l[f];if(g.mode===Pn.TRIANGLES||g.mode===Pn.TRIANGLE_STRIP||g.mode===Pn.TRIANGLE_FAN||g.mode===void 0)p=r.isSkinnedMesh===!0?new Br(_,M):new qe(_,M),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),g.mode===Pn.TRIANGLE_STRIP?p.geometry=xh(p.geometry,po):g.mode===Pn.TRIANGLE_FAN&&(p.geometry=xh(p.geometry,rr));else if(g.mode===Pn.LINES)p=new ts(_,M);else if(g.mode===Pn.LINE_STRIP)p=new Hn(_,M);else if(g.mode===Pn.LINE_LOOP)p=new kr(_,M);else if(g.mode===Pn.POINTS)p=new Rn(_,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(p.geometry.morphAttributes).length>0&&lv(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),si(p,r),g.extensions&&ys(s,p,g),t.assignFinalMaterial(p),u.push(p)}for(let f=0,m=u.length;f<m;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&ys(s,u[0],r),u[0];let d=new ye;r.extensions&&ys(s,d,r),t.associations.set(d,{meshes:e});for(let f=0,m=u.length;f<m;f++)d.add(u[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Pt(At.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new cs(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),si(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){let r=s.pop(),o=s,a=[],c=[];for(let l=0,h=o.length;l<h;l++){let u=o[l];if(u){a.push(u);let d=new Be;r!==null&&d.fromArray(r.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new zr(a,c)})}loadAnimation(e){let t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],c=[],l=[],h=[];for(let u=0,d=s.channels.length;u<d;u++){let f=s.channels[u],m=s.samplers[f.sampler],_=f.target,g=_.node,p=s.parameters!==void 0?s.parameters[m.input]:m.input,M=s.parameters!==void 0?s.parameters[m.output]:m.output;_.node!==void 0&&(o.push(this.getDependency("node",g)),a.push(this.getDependency("accessor",p)),c.push(this.getDependency("accessor",M)),l.push(m),h.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(u){let d=u[0],f=u[1],m=u[2],_=u[3],g=u[4],p=[];for(let y=0,x=d.length;y<x;y++){let S=d[y],E=f[y],C=m[y],I=_[y],w=g[y];if(S===void 0)continue;S.updateMatrix&&S.updateMatrix();let b=n._createAnimationTracks(S,E,C,I,w);if(b)for(let L=0;L<b.length;L++)p.push(b[L])}let M=new no(r,void 0,p);return si(M,s),M})}createNodeMesh(e){let t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=s.weights.length;c<l;c++)a.morphTargetInfluences[c]=s.weights[c]}),o})}loadNode(e){let t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=s.children||[];for(let l=0,h=a.length;l<h;l++)o.push(n.getDependency("node",a[l]));let c=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){let h=l[0],u=l[1],d=l[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,dv)});for(let f=0,m=u.length;f<m;f++)h.add(u[f]);return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],c=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(l){return s._getNodeRef(s.cameraCache,r.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let h;if(r.isBone===!0?h=new qs:l.length>1?h=new ye:l.length===1?h=l[0]:h=new Qe,h!==l[0])for(let u=0,d=l.length;u<d;u++)h.add(l[u]);if(r.name&&(h.userData.name=r.name,h.name=o),si(h,r),r.extensions&&ys(n,h,r),r.matrix!==void 0){let u=new Be;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){let u=s.associations.get(h);s.associations.set(h,{...u})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],s=this,r=new ye;n.name&&(r.name=s.createUniqueName(n.name)),si(r,n),n.extensions&&ys(t,r,n);let o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(s.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let h=0,u=c.length;h<u;h++)r.add(c[h]);let l=h=>{let u=new Map;for(let[d,f]of s.associations)(d instanceof Jt||d instanceof Bt)&&u.set(d,f);return h.traverse(d=>{let f=s.associations.get(d);f!=null&&u.set(d,f)}),u};return s.associations=l(r),r})}_createAnimationTracks(e,t,n,s,r){let o=[],a=e.name?e.name:e.uuid,c=[];Bi[r.path]===Bi.weights?e.traverse(function(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}):c.push(a);let l;switch(Bi[r.path]){case Bi.weights:l=Qn;break;case Bi.rotation:l=ei;break;case Bi.translation:case Bi.scale:l=ti;break;default:switch(n.itemSize){case 1:l=Qn;break;case 2:case 3:default:l=ti;break}break}let h=s.interpolation!==void 0?ov[s.interpolation]:ji,u=this._getArrayFromAccessor(n);for(let d=0,f=c.length;d<f;d++){let m=new l(c[d]+"."+Bi[r.path],t.array,u,h);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(m),o.push(m)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=Yh(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let s=this instanceof ei?Xh:Mc;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}});function bc(i){return{skinColor:Wf[i%Wf.length],shirtColor:Xf[i%Xf.length],trouserColor:qf[i*3%qf.length],hairColor:Yf[i*7%Yf.length],longHair:i%3===1}}function Zf(i,e){i.pedestrianTime=0,i.pedestrians=e.map((t,n)=>{let s=Math.floor(n/2),r=s%2?1:-1,o=s%4<2,a=Math.floor(s/4),c=[-i.rx-14,0,i.rx+14][a%3],l=a>=3?28:0,h=o?[c,-.09,r*(i.rz+5.65+l)]:[r*(i.rx+5.65+l),-.09,c];return{look:t,center:h,street:o,start:-6.4,end:6.4,pair:s,partner:n%2,offset:s*2.37,state:"walking"}})}function Kf(i,e,t=!1){return t||(i.pedestrianTime+=e),i.pedestrians.map((n,s)=>{let r=i.pedestrianTime+n.offset,o=r%38,a=(n.partner+Math.floor(r/38))%2,c=a?-1:1,l,h,u;if(o<14)l=a?n.end-o*.42:n.start+o*.42,h=1,u=c,n.state="walking";else if(o<24)l=a?.52:-.52,h=0,u=c,n.state="conversation";else{let S=(o-24)*(n.end+.52)/14;l=a?.52-S:-.52+S,h=1,u=c,n.state="walking"}let[d,f,m]=n.center,_=h?a?.28:-.28:0;n.lateral??=_;let g=(_-n.lateral)*(1-Math.exp(-e*3));n.lateral+=Math.max(-e*.45,Math.min(e*.45,g));let p=n.street?[d+l,f,m+n.lateral]:[d+n.lateral,f,m+l];n.walkBlend??=h,n.walkBlend+=(h-n.walkBlend)*(1-Math.exp(-e*8));let M=t?0:Math.sin(i.pedestrianTime*6.3+s*.25)*.28*n.walkBlend,y=!h&&!t,x=n.street?u*Math.PI/2:u>0?0:Math.PI;return n.heading??=x,n.heading+=Math.atan2(Math.sin(x-n.heading),Math.cos(x-n.heading))*(1-Math.exp(-e*7)),{...n.look,position:p,grounded:!0,rotation:n.heading,limbs:{LegL:M,LegR:-M,ArmL:-M*.7+(y?-.4+Math.sin(o*2.4)*.12:0),ArmR:M*.7},gesture:y?.16+Math.sin(o*1.7)*.07:0}})}var Wf,Xf,qf,Yf,$h,Sc=Ft(()=>{Wf=["#bb8765","#724b36","#e0b593","#99613e","#d29b76","#513729"],Xf=["#386b7b","#a75f4d","#d3bf8b","#69775c","#8483a1","#d3d4cc","#335a64","#ad8555"],qf=["#283843","#3d4141","#65574b","#34464d","#515568"],Yf=["#291e19","#493024","#806144","#181b1d","#aaaa9d"];$h=i=>({"Person skin":"skinColor","Person shirt":"shirtColor","Person trousers":"trouserColor","Person hair":"hairColor"})[i]});function jh(i,e=!1){if(typeof document>"u")return null;if(!Jh.has(i)){let t=pv.load(`assets/textures/city/${i}.jpg`);t.wrapS=t.wrapT=gn,t.anisotropy=4,e&&(t.colorSpace=vt),Jh.set(i,t)}return Jh.get(i)}function $f(i){let e=i.name,t=/Limestone render|Warm white precast|Sage ceramic cladding|Honed grey sandstone/.test(e),n=e==="Terracotta brick";if(t||n){let s=n?"brick":"plaster";i.map=jh(`${s}-Diffuse`,!0),i.normalMap=jh(`${s}-nor_gl`),i.roughnessMap=jh(`${s}-Rough`),i.normalScale.set(n?.55:.2,n?.55:.2),i.roughness=.92,i.metalness=0}return/glazing|architectural glass/.test(e)&&(i.color.set(e==="Interior shadow glazing"?"#172026":"#34414a"),i.roughness=.16,i.metalness=.32,i.envMapIntensity=1.3),e==="City vehicle enamel"&&(i.roughness=.22,i.metalness=.72,i.envMapIntensity=1.4),i.needsUpdate=!0,i}function Jf(i){if(!/Limestone render|Terracotta brick|Sage ceramic cladding|Honed grey sandstone|Warm white precast/.test(i.material.name))return;let e=i.geometry,t=e.attributes.position,n=e.attributes.normal,s=new Float32Array(t.count*2);for(let r=0;r<t.count;r++){let o=Math.abs(n.getX(r)),a=Math.abs(n.getY(r)),c=Math.abs(n.getZ(r));a>o&&a>c?(s[r*2]=t.getX(r)/2,s[r*2+1]=t.getZ(r)/2):o>c?(s[r*2]=t.getZ(r)/2,s[r*2+1]=t.getY(r)/2):(s[r*2]=t.getX(r)/2,s[r*2+1]=t.getY(r)/2)}e.setAttribute("uv",new ft(s,2))}var Jh,pv,jf=Ft(()=>{hn();Jh=new Map,pv=new os});function Qf(i){if(!Qh.has(i)){let e=i.startsWith("site-")?"environment":"zw-upgrade";Qh.set(i,mv.loadAsync(`assets/${e}/${i}.glb`).then(t=>(t.scene.traverse(n=>{if(n.isMesh){n.castShadow=n.receiveShadow=!0,n.geometry.userData.sharedAsset=!0,Jf(n);for(let s of Array.isArray(n.material)?n.material:[n.material])s.userData.sharedAsset=!0,s.envMapIntensity=.8,$f(s)}}),_o.loaded.add(i),t.scene)).catch(t=>(_o.failed.set(i,t.message),console.warn(`ZeroWatt: original geometry retained for ${i}:`,t.message),null)))}return Qh.get(i)}function ep(i){let e=new Set;i.traverse(t=>{t.geometry&&!t.geometry.userData.sharedAsset&&!t.geometry.userData.sharedStatic&&e.add(t.geometry)}),e.forEach(t=>t.dispose())}function Qt(i,e,{scale:t,rotation:n,appearance:s,replace:r=!0}={}){return i.userData.assetRequested=e,i.userData.assetReady=Qf(e).then(o=>{if(!o||i.userData.retired)return!1;r&&(ep(i),i.clear());let a=o.clone(!0);return s&&a.traverse(c=>{if(!c.isMesh)return;let l=$h(c.material.name);l&&(c.material=c.material.clone(),c.material.userData.sharedAsset=!1,c.material.color.set(s[l])),c.name.startsWith("HairLong")&&(c.visible=!!s.longHair)}),t&&a.scale.set(...t),n&&a.rotation.set(...n),a.name=`Blender ${e}`,i.add(a),i.userData.asset=e,!0}),i}function en(i,e,t,n=[1,1,1],s){let r=new ye;return r.position.set(...t),i.add(r),Qt(r,e,{scale:n,rotation:s})}function xo(i,e,t,{lighting:n=!1,surfaceNormal:s=null}={}){let r=new ye;r.name=`Instanced Blender ${e}`,i.add(r),r.userData.assetRequested=e,r.userData.glowMaterials=[];let o=[],a=new Qe,c=new Be,l=new Be,h=new Be,u=new Be,d=0;return r.setPoses=f=>{t=f;for(let{mesh:m,offset:_,colorKey:g,wheel:p,longHair:M,limb:y}of o)f.forEach((x,S)=>{a.position.set(...x.position),a.rotation.set(0,x.rotation||0,0);let E=x.scale??1;if(Array.isArray(E)?a.scale.set(...E):a.scale.setScalar(E),x.grounded&&(a.position.y-=d*a.scale.y),a.updateMatrix(),l.copy(_),M&&!x.longHair&&l.makeScale(1e-5,1e-5,1e-5),y&&x.limbs){let C=y.startsWith("Arm"),I=y.endsWith("L")?-1:1,w=C?1.27:.89,b=I*(C?.165:.085);h.makeTranslation(b,w,0),u.makeRotationX(x.limbs[y]||0),h.multiply(u),C&&(u.makeRotationZ((x.gesture||0)*I),h.multiply(u)),u.makeTranslation(-b,-w,0),h.multiply(u),l.premultiply(h)}if(p){let C=p.endsWith("L")?-.89:.89,I=p.startsWith("F")?1.43:-1.43;h.makeTranslation(C,.345,I),u.makeRotationY(p.startsWith("F")&&x.steering||0),h.multiply(u),u.makeRotationX(x.wheelAngle||0),h.multiply(u),u.makeTranslation(-C,-.345,-I),h.multiply(u),l.premultiply(h)}c.multiplyMatrices(a.matrix,l),m.setMatrixAt(S,c),g&&x[g]&&m.setColorAt(S,new Ee(x[g]))}),m.instanceMatrix.needsUpdate=!0,m.instanceColor&&(m.instanceColor.needsUpdate=!0),m.computeBoundingSphere(),m.computeBoundingBox()},r.userData.assetReady=Qf(e).then(f=>!f||r.userData.retired?!1:(f.updateMatrixWorld(!0),d=new Vt().setFromObject(f).min.y,f.traverse(m=>{if(!m.isMesh)return;let _=m.material,g=e.startsWith("site-")&&/apartment|tower|shopfront|distant-block|skyline/.test(e)&&/Limestone render|Terracotta brick|Sage ceramic cladding/.test(_.name),p=n&&/apartment|tower|shopfront|distant-block|skyline/.test(e)&&/glazing|architectural glass/.test(_.name);(g||p||n&&!Array.isArray(_)&&/^City (glow|signal)/.test(_.name))&&(_=_.clone(),_.userData.sharedAsset=!1,p&&(_.emissive.set("#e2bf89"),_.userData.cityWindow=!0,_.userData.windowLevel=_.name==="Interior shadow glazing"?.04:_.name==="Smoked architectural glass"?.14:.3),g?(_.color.set("#ffffff"),_.normalMap||(_.normalMap=s)):r.userData.glowMaterials.push(_));let M=new Lt(m.geometry,_,t.length);M.name=m.name,M.castShadow=M.receiveShadow=!0,r.add(M),o.push({mesh:M,offset:m.matrixWorld.clone(),colorKey:$h(_.name)||(g||_.name==="City vehicle enamel"?"color":null),wheel:m.name.match(/^(FL|FR|RL|RR)_/)?.[1],longHair:m.name.startsWith("HairLong"),limb:m.name.match(/^(ArmL|ArmR|LegL|LegR)_/)?.[1]})}),r.userData.asset=e,r.setPoses(t),!0)),r}function wc(i,e=[]){let t=new Set(e),n=new Set;i.traverse(s=>{if(s.userData.retired=!0,s.isInstancedMesh&&s.dispose(),s.material)for(let r of Array.isArray(s.material)?s.material:[s.material])!t.has(r)&&!r.userData.sharedAsset&&n.add(r)}),ep(i),n.forEach(s=>{s.userData.ownedTextures?.forEach(r=>r.dispose()),s.dispose()}),i.clear(),i.userData.retired=!1}var mv,Qh,_o,dr=Ft(()=>{hn();Kh();Sc();jf();mv=new ur,Qh=new Map,_o={loaded:new Set,failed:new Map}});function tp(i){return Qt(i,"rotor")}var np=Ft(()=>{dr()});function fr(i){return new eo({color:0,emissive:16777215,emissiveIntensity:i})}var Tc,ip=Ft(()=>{hn();Tc=class extends es{constructor(){super();let e=new zt;e.deleteAttribute("uv");let t=new at({side:Gt}),n=new at,s=new cn(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new qe(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new Lt(e,n,6),a=new Qe;a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),a.updateMatrix(),o.setMatrixAt(0,a.matrix),a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),a.updateMatrix(),o.setMatrixAt(1,a.matrix),a.position.set(6.167,.857,7.803),a.rotation.set(0,.561,0),a.scale.set(3.927,6.285,3.687),a.updateMatrix(),o.setMatrixAt(2,a.matrix),a.position.set(-2.017,.018,6.124),a.rotation.set(0,.333,0),a.scale.set(2.002,4.566,2.064),a.updateMatrix(),o.setMatrixAt(3,a.matrix),a.position.set(2.291,-.756,-2.621),a.rotation.set(0,-.286,0),a.scale.set(1.546,1.552,1.496),a.updateMatrix(),o.setMatrixAt(4,a.matrix),a.position.set(-2.193,-.369,-5.547),a.rotation.set(0,.516,0),a.scale.set(3.875,3.487,2.986),a.updateMatrix(),o.setMatrixAt(5,a.matrix),this.add(o);let c=new qe(e,fr(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let l=new qe(e,fr(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);let h=new qe(e,fr(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let u=new qe(e,fr(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new qe(e,fr(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new qe(e,fr(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}}});var Ec,sp=Ft(()=>{hn();Ec=class extends io{constructor(e){super(e),this.type=qn}parse(e){let o=function(I,w){switch(I){case 1:throw new Error("THREE.HDRLoader: Read Error: "+(w||""));case 2:throw new Error("THREE.HDRLoader: Write Error: "+(w||""));case 3:throw new Error("THREE.HDRLoader: Bad File Format: "+(w||""));default:case 4:throw new Error("THREE.HDRLoader: Memory Error: "+(w||""))}},u=function(I,w,b){w=w||1024;let z=I.pos,F=-1,A=0,U="",N=String.fromCharCode.apply(null,new Uint16Array(I.subarray(z,z+128)));for(;0>(F=N.indexOf(`
`))&&A<w&&z<I.byteLength;)U+=N,A+=N.length,z+=128,N+=String.fromCharCode.apply(null,new Uint16Array(I.subarray(z,z+128)));return-1<F?(b!==!1&&(I.pos+=A+F+1),U+N.slice(0,F)):!1},d=function(I){let w=/^#\?(\S+)/,b=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,L=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,z=/^\s*FORMAT=(\S+)\s*$/,F=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,A={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},U,N;for((I.pos>=I.byteLength||!(U=u(I)))&&o(1,"no header found"),(N=U.match(w))||o(3,"bad initial token"),A.valid|=1,A.programtype=N[1],A.string+=U+`
`;U=u(I),U!==!1;){if(A.string+=U+`
`,U.charAt(0)==="#"){A.comments+=U+`
`;continue}if((N=U.match(b))&&(A.gamma=parseFloat(N[1])),(N=U.match(L))&&(A.exposure=parseFloat(N[1])),(N=U.match(z))&&(A.valid|=2,A.format=N[1]),(N=U.match(F))&&(A.valid|=4,A.height=parseInt(N[1],10),A.width=parseInt(N[2],10)),A.valid&2&&A.valid&4)break}return A.valid&2||o(3,"missing format specifier"),A.valid&4||o(3,"missing image size specifier"),A},f=function(I,w,b){let L=w;if(L<8||L>32767||I[0]!==2||I[1]!==2||I[2]&128)return new Uint8Array(I);L!==(I[2]<<8|I[3])&&o(3,"wrong scanline width");let z=new Uint8Array(4*w*b);z.length||o(4,"unable to allocate buffer space");let F=0,A=0,U=4*L,N=new Uint8Array(4),q=new Uint8Array(U),O=b;for(;O>0&&A<I.byteLength;){A+4>I.byteLength&&o(1),N[0]=I[A++],N[1]=I[A++],N[2]=I[A++],N[3]=I[A++],(N[0]!=2||N[1]!=2||(N[2]<<8|N[3])!=L)&&o(3,"bad rgbe scanline format");let ee=0,ie;for(;ee<U&&A<I.byteLength;){ie=I[A++];let we=ie>128;if(we&&(ie-=128),(ie===0||ee+ie>U)&&o(3,"bad scanline data"),we){let G=I[A++];for(let re=0;re<ie;re++)q[ee++]=G}else q.set(I.subarray(A,A+ie),ee),ee+=ie,A+=ie}let de=L;for(let we=0;we<de;we++){let G=0;z[F]=q[we+G],G+=L,z[F+1]=q[we+G],G+=L,z[F+2]=q[we+G],G+=L,z[F+3]=q[we+G],F+=4}O--}return z},m=function(I,w,b,L){let z=I[w+3],F=Math.pow(2,z-128)/255;b[L+0]=I[w+0]*F,b[L+1]=I[w+1]*F,b[L+2]=I[w+2]*F,b[L+3]=1},_=function(I,w,b,L){let z=I[w+3],F=Math.pow(2,z-128)/255;b[L+0]=Ni.toHalfFloat(Math.min(I[w+0]*F,65504)),b[L+1]=Ni.toHalfFloat(Math.min(I[w+1]*F,65504)),b[L+2]=Ni.toHalfFloat(Math.min(I[w+2]*F,65504)),b[L+3]=Ni.toHalfFloat(1)},g=new Uint8Array(e);g.pos=0;let p=d(g),M=p.width,y=p.height,x=f(g.subarray(g.pos),M,y),S,E,C;switch(this.type){case qt:C=x.length/4;let I=new Float32Array(C*4);for(let b=0;b<C;b++)m(x,b*4,I,b*4);S=I,E=qt;break;case qn:C=x.length/4;let w=new Uint16Array(C*4);for(let b=0;b<C;b++)_(x,b*4,w,b*4);S=w,E=qn;break;default:throw new Error("THREE.HDRLoader: Unsupported type: "+this.type)}return{width:M,height:y,data:S,header:p.string,gamma:p.gamma,exposure:p.exposure,type:E}}setDataType(e){return this.type=e,this}load(e,t,n,s){function r(o,a){switch(o.type){case qt:case qn:o.colorSpace=Dt,o.minFilter=Mt,o.magFilter=Mt,o.generateMipmaps=!1,o.flipY=!0;break}t&&t(o,a)}return super.load(e,r,n,s)}}});function op(i,e){let t=new Tc,n=new xs(e),s=n.fromScene(t,.08);i.environment=s.texture,i.environmentIntensity=.45,t.dispose(),n.dispose();let r=!1;return s.addEventListener("dispose",()=>r=!0),rp??=new Ec().loadAsync("assets/textures/city/daylight.hdr"),rp.then(o=>{if(r)return;o.mapping=er;let a=new xs(e),c=a.fromEquirectangular(o);a.dispose(),i.environment=c.texture,i.userData.outdoorLighting=!0,s.addEventListener("dispose",()=>c.dispose())}).catch(o=>console.warn("Outdoor reflection map unavailable; neutral studio lighting retained.",o.message)),s}function ap(i,e){let t=new Uint8Array(i*i*4);for(let s=0;s<i;s++)for(let r=0;r<i;r++){let o=r/i*Math.PI*2,a=s/i*Math.PI*2,c=e*(Math.cos(o*4+Math.sin(a*2))+.4*Math.cos(o*11-a*7)),l=e*(Math.sin(a*5+Math.cos(o*3))+.4*Math.sin(a*9+o*6)),h=new P(-c,-l,1).normalize(),u=(s*i+r)*4;t.set([(h.x*.5+.5)*255,(h.y*.5+.5)*255,(h.z*.5+.5)*255,255],u)}let n=new An(t,i,i,jt);return n.wrapS=n.wrapT=gn,n.magFilter=Mt,n.minFilter=ln,n.generateMipmaps=!0,n.needsUpdate=!0,n}function cp(){let i=ap(128,.28);i.repeat.set(14,10);let e=new at({color:"#456f68",roughness:.21,metalness:.12,transparent:!0,opacity:.88,depthWrite:!1,side:gt,normalMap:i,normalScale:new he(.3,.3),envMapIntensity:1.15}),t={zwTime:{value:0},zwAmplitude:{value:.02},zwSize:{value:new he(20,12)}};return e.userData.waterUniforms=t,e.onBeforeCompile=n=>{Object.assign(n.uniforms,t),n.vertexShader=`uniform float zwTime; uniform float zwAmplitude; varying vec2 zwUV;
`+n.vertexShader,n.vertexShader=n.vertexShader.replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
      float wx = position.x * 1.7 + zwTime * 1.3;
      float wy = position.y * 2.1 + zwTime * .8;
      objectNormal = normalize(vec3(-1.7*cos(wx)*cos(wy)*zwAmplitude,
        2.1*sin(wx)*sin(wy)*zwAmplitude, 1.0));`),n.vertexShader=n.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
      transformed.z += sin(wx)*cos(wy)*zwAmplitude;
      zwUV = uv;`),n.fragmentShader=`varying vec2 zwUV; uniform vec2 zwSize;
`+n.fragmentShader,n.fragmentShader=n.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
      vec2 bank = min(zwUV, 1.0-zwUV)*zwSize;
      float depthTint = smoothstep(0.0, 1.4, min(bank.x, bank.y));
      diffuseColor.rgb *= mix(vec3(1.35,1.19,.89),vec3(.76,.94,1.0),depthTint);`)},e.customProgramCacheKey=()=>"zw-water-1",e}function lp(i,e,t,n,s){let r=i.userData.waterUniforms;r.zwTime.value=e,r.zwAmplitude.value=.014+.035*t+Math.min(n,20)*.0014+(s?.035:0),i.normalMap.offset.set(e*.008,e*.004),i.normalScale.setScalar(.23+t*.16)}function hp(i){let e=ap(64,.045);e.repeat.set(4,4);for(let o of["steel","white","black","wood","concrete","path","pontoon"])i[o].normalMap=e,i[o].normalScale=new he(.11,.11);i.white.color.set("#dce2dc"),i.white.roughness=.4,i.white.metalness=.22,i.black.color.set("#243b37"),i.black.roughness=.46,i.black.metalness=.45,i.steel.roughness=.34,i.steel.metalness=.78,i.concrete.color.set("#aaafa0"),i.concrete.roughness=.9,i.wood.color.set("#96744f"),i.wood.roughness=.69;let t=new Uint8Array(4096*4);for(let o=0;o<32;o++)for(let a=0;a<128;a++){let c=.82+.13*Math.sin(o*2.8+Math.sin(a*.07+o*.6))+.05*Math.sin(o*9+a*.12);t.set([232*c,219*c,195*c,255],(o*128+a)*4)}let n=new An(t,128,32);n.colorSpace=vt,n.wrapS=n.wrapT=gn,n.repeat.set(3,2),n.needsUpdate=!0,i.wood.map=n,i.wood.userData.ownedTextures=[n];let s=new Uint8Array(4096*4);for(let o=0;o<64;o++)for(let a=0;a<64;a++){let c=(a-31.5)/31.5,l=(o-31.5)/31.5,h=Math.atan2(l,c),u=.78+.1*Math.sin(h*3)+.055*Math.cos(h*7),d=255*(1-At.smoothstep(Math.hypot(c,l),u-.16,u));s.set([d,d,d,255],(o*64+a)*4)}let r=new An(s,64,64);return r.magFilter=Mt,r.needsUpdate=!0,i.puddle.alphaMap=r,i.puddle.opacity=.48,i.puddle.depthWrite=!1,i.puddle.color.set("#6d837c"),i.puddle.roughness=.13,i.puddle.metalness=.12,i.puddle.userData.ownedTextures=[r],i.shellGlass.opacity=.075,i.shellGlass.color.set("#c3d4cf"),e}function up(i){i.shellGlass.opacity=.045,i.shellGlass.color.set("#c4d5d9"),i.win.color.set("#a6bdc7"),i.win.opacity=.22,i.win.roughness=.16,i.win.metalness=.08,i.win.envMapIntensity=.8,i.dark.color.set("#263a3b"),i.concrete.color.set("#939c94"),i.shirtA.color.set("#527580"),i.shirtB.color.set("#7b846c")}var rp,dp=Ft(()=>{hn();ip();sp()});function fp(i){let{shell:e,mats:t,roomW:n,roomD:s}=i,r=i.mat("#bebdaf",.93,0),o=i.mat("#a18a65",.75,0),a=i.mat("#d2cfc1",.92,0);a.normalMap=i.surfaceNormal||null,a.normalScale.set(.12,.12),e.getObjectByName("back-wall").material=a;for(let S of e.children)S.isMesh&&S.geometry.type==="BoxGeometry"&&Math.abs(Math.abs(S.position.x)-n/2)<.01&&S.position.y<1.05&&S.material===t.shellGlass&&(S.material=a);let c=Math.ceil(n/.8),l=Math.ceil(s/.8),h=n/c,u=s/l,d=i.mat("#bac0b8",.83,0);d.normalMap=i.surfaceNormal||null,d.normalScale.set(.1,.1);let f=new Lt(new zt(1,1,1),d,c*l),m=new Qe;f.name="Architectural floor tiles",f.receiveShadow=!0;for(let S=0;S<c*l;S++)m.position.set(-n/2+(S%c+.5)*h,.309,-s/2+(Math.floor(S/c)+.5)*u),m.scale.set(h-.018,.018,u-.018),m.updateMatrix(),f.setMatrixAt(S,m.matrix),f.setColorAt(S,new Ee().setScalar(.87+S*7%9*.013));e.add(f);for(let S of[-n/2+.75,n/2-.75])en(e,"service-wall",[S,0,-s/2+.14]);let _=new ye;_.name="Blender architectural details",e.add(_);for(let S of[-1,1])for(let E of[-1,1])en(_,"site-corner-pier",[S*n/2,.3,E*s/2]);for(let S of i.panes)en(_,"site-window-trim",[S.x,S.y,S.zc],[S.width,1,1],[0,Math.sign(S.x)*Math.PI/2,0]);for(let S of[-n/2+.32,n/2-.32])en(_,"site-downpipe",[S,0,-s/2],[1,1,1],[0,Math.PI,0]);en(_,"site-entry-canopy",[n/2-1.375,0,s/2+.025]);let g=i.mat("#7d827c",.82,.12);for(let S of[-1,1])i.box(n+.48,.035,.26,g,_,0,3.785,S*s/2),i.box(.26,.035,s+.48,g,_,S*n/2,3.785,0);for(let S=-n/2+.8;S<n/2-.1;S+=1.2)for(let E of[-1,1])i.box(.014,.05,.27,t.dark,_,S,3.785,E*s/2);i.box(n+.7,.1,s+.7,r,e,0,.02,0);for(let S of[-1,1])i.box(n,.11,.18,o,e,0,.38,S*s/2),i.box(n+.35,.14,.15,t.black,e,0,3.7,S*s/2),i.box(.15,.14,s+.35,t.black,e,S*n/2,3.7,0),i.box(.22,.18,s+.35,t.concrete,e,S*n/2,.27,0);for(let S of[-n/2+1.6,n/2-1.6]){let E=new at({color:"#f3e5c7",emissive:"#e7c68e",emissiveIntensity:.35,roughness:.45});i.box(.45,.045,.1,E,e,S,3,-s/2+.14)}let p=new Uint8Array(4096*4);for(let S=0;S<64;S++)for(let E=0;E<64;E++){let C=Math.max(Math.abs(E/31.5-1),Math.abs(S/31.5-1)),I=(1-At.smoothstep(C,.55,1))*.2;p.set([25,37,33,Math.round(I*255)],(S*64+E)*4)}let M=new An(p,64,64);M.needsUpdate=!0;let y=new Et({map:M,transparent:!0,depthWrite:!1});y.userData.ownedTextures=[M];let x=new qe(new Cn(n+2,s+2),y);x.rotation.x=-Math.PI/2,x.position.y=-.27,e.add(x)}function gv(i){return()=>(i=i*1664525+1013904223>>>0,i/4294967296)}function pp(i){let e=i.shell,t=i.mode==="air",n=t?i.roomW:i.pondL+1.5,s=t?i.roomD:i.pondW+1.5,r=t?0:i.pondZc,o=gv(427),a=i.mat("#605f45",.99,0),c=new ye;c.name="Detailed landscaped site",e.add(c);let l=i.mat("#bcb4a2",.95,0),h=i.mat("#8b928a",.88,0),u=[];for(let y of[-1,1])for(let x=-s/2;x<s/2;x+=.62)u.push([y*(n/2+1.9),-.17,r+x+.3]);let d=new Lt(new zt(.92,.1,.59),l,u.length),f=new Qe;d.name="Jointed promenade pavers",d.receiveShadow=!0,u.forEach((y,x)=>{f.position.set(...y),f.updateMatrix(),d.setMatrixAt(x,f.matrix)}),c.add(d);for(let y of[-1,1]){i.box(.13,.14,s+1,h,c,y*(n/2+1.35),-.11,r),en(c,"site-bench",[y*(n/2+2.2),-.14,r-s*.25],[1,1,1],[0,-y*Math.PI/2,0]);for(let x of[-1,1])en(c,"site-bollard",[y*(n/2+2.15),-.12,r+x*s*.38])}for(let y of[-1,1])i.box(1.25,.12,s+1,a,e,y*(n/2+1),-.19,r);let m=new ot;m.setAttribute("position",new je([-.04,0,0,.04,0,0,.025,.32,.025,0,0,-.04,0,0,.04,.025,.25,.02],3)),m.computeVertexNormals();let _=i.mat("#6e7c4f",1,0),g=i.compactGraphics?120:320,p=new Lt(m,_,g),M=new Qe;p.castShadow=!1,p.receiveShadow=!0,p.name="Instanced perimeter grasses";for(let y=0;y<g;y++){let x=y%2?1:-1;M.position.set(x*(n/2+.55+o()*1.1),-.13,r+(o()-.5)*(s+2)),M.rotation.y=o()*Math.PI,M.scale.setScalar(.5+o()*.9),M.updateMatrix(),p.setMatrixAt(y,M.matrix),p.setColorAt(y,new Ee().setHSL(.2+o()*.035,.2,.25+o()*.12))}if(p.instanceMatrix.needsUpdate=!0,e.add(p),!t){for(let y=0;y<12;y++){let x=y%2?1:-1,S=1.6+Math.floor(y/2)*(i.pondW-1)/6;en(e,"shore",[x*(i.pondL/2+.45),.65,S],[.75,.8+y%3*.15,.8])}i.siteLamps=[];for(let y of[-1,1])for(let x of[-1,1]){let S=y*(n/2+1.7),E=r+x*s*.38;i.cyl(.045,.75,i.mats.dark,e,S,.2,E),i.cyl(.1,.08,i.mats.led,e,S,.62,E);let C=new cn("#f9dfaf",0,7,2);C.position.set(S,.75,E),e.add(C),i.siteLamps.push(C)}}}var mp=Ft(()=>{hn();dr()});function gp(i){let e=(i%30+30)%30;return e<11?["green","red"]:e<14?["amber","red"]:e<15?["red","red"]:e<26?["red","green"]:e<29?["red","amber"]:["red","red"]}function _p(i){i.stops=i.paths.map(e=>{let t=[],n=!1;for(let s=-1;s<1200;s++){let r=(s/1200+1)%1,o=e.getPointAt(r),a=e.getTangentAt(r),c=Math.abs(a.x)>.98,l=Math.abs(a.z)>.98,h=c&&o.x*a.x>0&&Math.abs(o.x)>i.rx-7.2||l&&o.z*a.z>0&&Math.abs(o.z)>i.rz-7.2;s>=0&&h&&!n&&t.push({phase:r,axis:c?0:1}),n=h}return t}),i.cars.forEach(e=>{e.speed=0,e.wheelAngle=0,e.steering=0})}function xp(i,e,t,n){let s=Math.min(e,.5);for(;s>1e-8;){let r=Math.min(s,.016666666666666666);s-=r;let o=i.cars.map(a=>a.phase);i.cars.forEach((a,c)=>{let l=i.paths[a.lane],h=l.getLength(),u=h,d=h;i.cars.forEach((E,C)=>{c!==C&&a.lane===E.lane&&(u=Math.min(u,(o[C]-o[c]+1)%1*h))});for(let E of i.stops[a.lane]){let C=(E.phase-a.phase+1)%1*h;n(E.axis,a,C)||(d=Math.min(d,C))}let f=Math.max(0,Math.min(u-5.7,d-2.4)),m=Math.min(t,Math.sqrt(2*2.6*f),Math.max(0,(u-5.7)/1.1)),_=m>a.speed?1.25:2.8,g=a.speed+Math.max(-_*r,Math.min(_*r,m-a.speed)),p=Math.min(f,(a.speed+g)*.5*r);a.speed=f<.002?0:g,a.phase=(a.phase+p/h)%1,a.wheelAngle+=p/.345;let M=l.getTangentAt(a.phase),y=l.getTangentAt((a.phase+.003)%1),x=Math.atan2(M.z*y.x-M.x*y.z,M.x*y.x+M.z*y.z)/(.003*h),S=Math.max(-.5,Math.min(.5,Math.atan(2.86*x)));a.steering+=(S-a.steering)*(1-Math.exp(-r*9))})}}var yp=Ft(()=>{});function Ln(i,e,t,n){let s=new Lt(new zt(1,1,1),n,t.length),r=new Qe;return s.name=e,s.receiveShadow=!0,t.forEach(([o,a,c,l,h,u],d)=>{r.position.set(o,a,c),r.scale.set(l,h,u),r.updateMatrix(),s.setMatrixAt(d,r.matrix)}),i.add(s),s}function bp(i,e,t=!1){let n=[];for(let[r,o,a]of[[i-4,e-4,0],[-i+4,e-4,Math.PI/2],[-i+4,-e+4,Math.PI],[i-4,-e+4,Math.PI*1.5]])for(let c=0;c<=8;c++){let l=a+c*Math.PI/16;n.push(new P(r+4*Math.cos(l),0,o+4*Math.sin(l)))}return t&&n.reverse(),new Jn(n,!0,"centripetal")}function Sp(i){let e=i.mode==="air",t=e?i.roomW:i.pondL,n=e?i.roomD:i.pondW,s=e?0:i.pondZc,r=new ye;r.name="Blender neighborhood",r.position.z=s,i.shell.add(r);let o=t/2+10.3,a=n/2+10.3,c=o+xt/2,l=a+xt/2,h=[-c-28,-c,c,c+28],u=[-l-28,-l,l,l+28],d=i.city={root:r,hx:o,hz:a,rx:c,rz:l,zc:s,batches:[],cars:[],lighting:null,signalPhase:null};r.userData.parcel={width:t,depth:n,hx:o,hz:a,rx:c,rz:l};let f=i.mat("#353d40",.95,0),m=i.mat("#b4b9b6",.9,0),_=i.mat("#a6aba9",.93,0);f.normalMap=_.normalMap=i.surfaceNormal||null,f.normalScale.set(.14,.14),_.normalScale.set(.09,.09),d.roadMaterial=f;let g=i.mat("#919b95",.95,0),p=i.mat("#e1e3d6",.85,0),M=i.mat("#c7b776",.9,0);i.box(230,.08,230,i.mat("#8c9591",.98,0),r,0,-.3,0).name="Continuous city ground";let y=[],x=[],S=[],E=[],C=[],I=[],w=[],b=c+49,L=l+49;for(let G of h)y.push([G,-.215,0,xt,.06,L*2]);for(let G of u)y.push([0,-.21,G,b*2,.06,xt]);for(let G of h)for(let re=0;re<=u.length;re++){let oe=re===0?-L:u[re-1]+xt/2,k=re===u.length?L:u[re]-xt/2;for(let K of[-1,1])x.push([G+K*(xt/2+Ac/2),-.15,(oe+k)/2,Ac,.12,k-oe]),S.push([G+K*(xt/2+.08),-.09,(oe+k)/2,.16,.17,k-oe]);for(let K=oe+1;K<k-1;K+=3.3)for(let ge of[-1,1])E.push([G+ge*2.35,-.171,K,.065,.008,1.3]);for(let K of[-1,1])C.push([G+K*.13,-.17,(oe+k)/2,.035,.008,k-oe])}for(let G of u)for(let re=0;re<=h.length;re++){let oe=re===0?-b:h[re-1]+xt/2,k=re===h.length?b:h[re]-xt/2;for(let K of[-1,1])x.push([(oe+k)/2,-.15,G+K*(xt/2+Ac/2),k-oe,.12,Ac]),S.push([(oe+k)/2,-.09,G+K*(xt/2+.08),k-oe,.17,.16]);for(let K=oe+1;K<k-1;K+=3.3)for(let ge of[-1,1])E.push([K,-.166,G+ge*2.35,1.3,.008,.065]);for(let K of[-1,1])C.push([(oe+k)/2,-.165,G+K*.13,k-oe,.008,.035])}for(let G of[-c,c])for(let re of[-l,l])for(let oe of[-1,1])for(let k=-5;k<=5;k++)I.push([G+oe*(xt/2+.9),-.162,re+k*.66,1.55,.01,.32]),I.push([G+k*.66,-.161,re+oe*(xt/2+.9),.32,.01,1.55]);let z=e?1.25:1.8;for(let G=-o+z/2;G<o;G+=z)for(let re=-a+z/2;re<a;re+=z)w.push([G,-.2,re,z-.025,.08,z-.025]);Ln(r,"Connected city streets",y,f),Ln(r,"Continuous city sidewalks",x,_),Ln(r,"Intersection curb stones",S,m),Ln(r,"Street lane markings",E,p),Ln(r,"Road center lines",C,M),Ln(r,"Pedestrian zebra crossings",I,p),Ln(r,"Civic plaza paving",w,_);let F=[],A=[];for(let G of[-1,1])F.push([G*(o-.86),-.15,0,1.35,.018,2*a-1.7]),F.push([0,-.149,G*(a-.86),2*o-1.7,.018,1.35]),A.push([G*(o-1.6),-.145,0,.075,.025,2*a-1.7]),A.push([0,-.144,G*(a-1.6),2*o-1.7,.025,.075]);Ln(r,"Civic cycle promenade",F,i.mat("#92796c",.95,0)),Ln(r,"Limestone promenade edging",A,i.mat("#cec4ac",.94,0));let U=new Map,N=0,q=0,O=(G,re,oe=0,k=1,K)=>{if(/apartment|tower|shopfront|distant-block|skyline/.test(G)){let Ce=N++;K=new Ee(Mp[Ce%Mp.length]).offsetHSL((Ce%7-3)*.003,0,(Math.floor(Ce/8)%17-8)*.006).getStyle()}let ge=G==="site-pedestrian"?bc(q++):{};U.has(G)||U.set(G,[]),U.get(G).push({position:re,rotation:oe,scale:k,color:K,grounded:!G.startsWith("site-city-"),...ge})},ee=[],ie=[],de=[];for(let G of[-o+3.6,o-3.6])for(let re of[-a+3.6,a-3.6])de.push([G,-.13,re,3.5,.18,2.6]),O("tree",[G,-.05,re],0,[.92,1.1,.92]),O("site-bench",[G,-.15,re+2.1]),O("site-street-bin",[G+1.4,-.15,re+2.1]);Ln(r,"Raised civic garden beds",de,i.mat("#546947",.99,0));for(let G=0;G<3;G++)for(let re=0;re<3;re++){if(G===1&&re===1)continue;let oe=(h[G]+h[G+1])/2,k=(u[re]+u[re+1])/2,K=(h[G+1]-h[G])/2-9.5,ge=(u[re+1]-u[re])/2-9.5;ee.push([oe,-.215,k,h[G+1]-h[G]-xt-.3,.08,u[re+1]-u[re]-xt-.3]);let Ce=re===0?0:re===2?Math.PI:G===0?Math.PI/2:-Math.PI/2;for(let rt=0;rt<2;rt++)for(let D=0;D<2;D++){let ne=G*11+re*7+rt*3+D,Q=oe+(rt?K:-K),j=k+(D?ge:-ge),J=ne%7===0?"site-canyon-tower":ne%4===0?"site-shopfront":`site-apartment-${["low","mid","tall"][ne%3]}`,me=J==="site-canyon-tower"||J==="site-shopfront"?1:[1.45,2+ne%3*.12,1.45];O(J,[Q,-.16,j],Ce,me)}let Re=Math.min(5,K*2-7),Ke=Math.min(5,ge*2-7);ie.push([oe,-.11,k,Re,.13,Ke]),O("tree",[oe,-.045,k],0,[.65,1.3,.65]),O("site-bench",[oe,-.175,k+Ke/2+.7]),O("site-street-bin",[oe,-.175,k-Ke/2-.7])}Ln(r,"Paved city blocks",ee,g),Ln(r,"Residential courtyard gardens",ie,i.mat("#647b56",.98,0));for(let G=-5;G<=5;G++)for(let re of[-1,1]){let oe=G*10,k=["site-distant-block","site-skyline-glass","site-skyline-brick"][(G+6)%3];O(k,[oe,-.25,re*(l+49+G%2*7)],re<0?0:Math.PI,[1.12,.88+Math.abs(G)*7%5*.1,1.05]),O(k,[re*(c+49+G%2*6),-.25,oe],-re*Math.PI/2,[1.1,.92+Math.abs(G)*5%4*.1,1.05])}if(!i.compactGraphics)for(let G=-5;G<=5;G++)for(let re of[-1,1]){let oe=["site-skyline-brick","site-distant-block","site-skyline-glass"][(G+6)%3];O(oe,[G*13+5,-.25,re*(l+73)],0,[1.6,1.1+G*G%5*.1,1.6]),O(oe,[re*(c+73),-.25,G*13+5],Math.PI/2,[1.6,1.05+G*G%6*.08,1.6])}let we=[[],[]];for(let G of[-c,c])for(let re of[-l,l])for(let oe of[-1,1])for(let k of[-1,1]){let K=G+oe*(xt/2+.65),ge=re+k*(xt/2+.65);O("site-street-lamp",[K,-.09,ge],Math.atan2(-oe,-k)),we[oe===k?0:1].push({position:[K,-.09,ge],rotation:oe===k?k>0?Math.PI:0:oe>0?-Math.PI/2:Math.PI/2}),O("site-pedestrian",[K+oe*.75,-.09,ge+k*.65],Math.atan2(-oe,-k),.92+(oe+k+2)*.025)}for(let G of[-1,1]){let re=G*(l-xt/2-.9),oe=G*(c-xt/2-.9);for(let k=-1;k<=1;k++)O("site-street-lamp",[k*8,-.09,re],G>0?Math.PI:0),O("site-street-lamp",[oe,-.09,k*7],-G*Math.PI/2);O("site-bus-shelter",[G*4,-.1,G*(l+xt/2+1)],G<0?0:Math.PI),O("site-hydrant",[G*(c+xt/2+.8),-.08,3]),O("site-street-bin",[G*7,-.09,G*(l+xt/2+.85)]),O("site-cycle-rack",[G*(t/2+3.9),-.16,e?n/2+2:0],0);for(let k=0;k<3;k++)O("site-bicycle",[G*(t/2+3.9),-.16,(e?n/2+2:0)-.7+k*.7],G>0?0:Math.PI);for(let k=0;k<3;k++)O(k%2?"site-city-crossover":"site-city-sedan",[G*(c+3.62),-.18,(k-1)*6],G>0?0:Math.PI,1,vp[(k+(G>0?2:0))%6]),O("site-pedestrian",[G*(c+xt/2+1),-.09,(k-1)*7],G>0?-Math.PI/2:Math.PI/2);O("site-pedestrian",[G*4+.65,-.09,G*(l+xt/2+.8)],G<0?0:Math.PI),O("site-pedestrian",[G*4-.65,-.09,G*(l+xt/2+.8)],G<0?0:Math.PI)}for(let[G,re]of U){let oe=xo(r,G,re,{lighting:!0,surfaceNormal:i.surfaceNormal});d.batches.push(oe),G==="site-pedestrian"&&(d.walkers=oe,Zf(d,re)),(G.startsWith("site-apartment")||G==="site-shopfront"||G==="site-canyon-tower"||G==="site-distant-block"||G.startsWith("site-skyline"))&&(oe.userData.cityBuildings=!0)}d.signals=we.map(G=>xo(r,"site-traffic-signal",G,{lighting:!0})),d.paths=[bp(c-1.25,l-1.25),bp(c+1.25,l+1.25,!0)];for(let G=0;G<8;G++)d.cars.push({lane:G%2,phase:Math.floor(G/2)/4+G%2*.08,color:vp[G%6]});_p(d),d.traffic=xo(r,"site-city-sedan",d.cars.filter(G=>G.lane===0).map(()=>({position:[0,-.18,0]})),{lighting:!0}),d.crossovers=xo(r,"site-city-crossover",d.cars.filter(G=>G.lane===1).map(()=>({position:[0,-.18,0]})),{lighting:!0}),d.batches.push(d.traffic,d.crossovers),d.lights=[];for(let[G,re]of[[-c,l],[c,-l],[-c,-l],[c,l]]){let oe=new cn("#ffe0ae",0,13,2);oe.position.set(G,4.6,re),r.add(oe),d.lights.push(oe)}eu(i,0)}function eu(i,e){let t=i.city;if(!t||t.root.userData.retired)return;let n=gp(i.time||0);t.signalState=n;let s=i.storm?1:i.rainAmt>.1?2:3.2;i.reducedMotion||xp(t,e,s,(o,a,c)=>n[o]==="green"||n[o]==="amber"&&c<2.4+a.speed*a.speed/5.2);let r=t.cars.map(o=>{let a=t.paths[o.lane],c=a.getPointAt(o.phase%1),l=a.getTangentAt(o.phase%1);return{position:[c.x,-.18,c.z],rotation:Math.atan2(l.x,l.z),color:o.color,wheelAngle:o.wheelAngle,steering:o.steering}});t.traffic.setPoses(r.filter((o,a)=>t.cars[a].lane===0)),t.crossovers.setPoses(r.filter((o,a)=>t.cars[a].lane===1)),t.walkers.setPoses(Kf(t,e,i.reducedMotion)),t.roadMaterial.roughness=.95-.76*(i.rainAmt||0);for(let o of t.batches)for(let a of o.userData.glowMaterials)a.emissiveIntensity=i.night?a.userData.cityWindow?a.userData.windowLevel??.2:1.7:.005;t.signals.forEach((o,a)=>{for(let c of o.userData.glowMaterials){let l=c.name.endsWith(n[a]);c.userData.signalColor??=c.color.clone(),c.color.copy(c.userData.signalColor).multiplyScalar(l?1:.11),c.emissiveIntensity=l?3:.005}}),t.lights.forEach(o=>o.intensity=i.night?15:0)}var xt,Ac,vp,Mp,wp=Ft(()=>{hn();dr();yp();Sc();xt=9.6,Ac=1.65,vp=["#4c7c92","#ddd4bd","#9d4e3e","#596b55","#b4bdc0","#d6ae53"],Mp=["#8c8b80","#c4b49c","#9c7761","#777f83","#68766f","#aa8b78","#79888e","#b7b1a3"]});function _v(i){let e={time:{value:0},speed:{value:1},strength:{value:0}},t=new Et({color:Tp[i],transparent:!0,opacity:1,depthWrite:!1,toneMapped:!0,side:gt});return t.userData.trails=e,t.onBeforeCompile=n=>{n.uniforms.zwTrailTime=e.time,n.uniforms.zwTrailSpeed=e.speed,n.uniforms.zwTrailStrength=e.strength,n.vertexShader=`varying vec2 zwTrailUV;
`+n.vertexShader,n.vertexShader=n.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
      zwTrailUV=uv;`),n.fragmentShader=`varying vec2 zwTrailUV; uniform float zwTrailTime; uniform float zwTrailSpeed; uniform float zwTrailStrength;
`+n.fragmentShader,n.fragmentShader=n.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
      float phase=fract(zwTrailUV.x*3.0-zwTrailTime);
      float tail=smoothstep(.15,.70,phase)*(1.0-smoothstep(.78,.86,phase));
      float ends=smoothstep(0.0,.04,zwTrailUV.x)*(1.0-smoothstep(.93,1.0,zwTrailUV.x));
      diffuseColor.a*=zwTrailStrength*(.035+.76*tail)*ends;`)},t.customProgramCacheKey=()=>"zw-directional-trail",t}function Ep(i){if(!i.host.querySelectorAll)return;i._callouts??=[...i.host.querySelectorAll("[data-scene-anchor]")];let e=i.unitPos(0),t=i.panes.find(r=>r.x>0)||i.panes[0],n={rotor:[e.x-2,e.y+2.3,e.z],exhaust:[e.x+2.4,4.5,e.z+.3],intake:t?[t.x,t.y+.7,t.zc]:[0,1,0]},s=i._labelPoint??=new P;for(let r of i._callouts){let o=n[r.dataset.sceneAnchor];s.set(...o).project(i.camera);let a=i.view!=="bench"&&Math.abs(s.x)<.88&&Math.abs(s.y)<.76&&s.z<1;r.hidden=!a,a&&(r.style.left=`${(s.x*.5+.5)*100}%`,r.style.top=`${(-s.y*.5+.5)*100}%`)}}var tu,Tp,Rc,Ap=Ft(()=>{hn();yh();tu=At.clamp,Tp={wind:"#bbd7dc",intake:"#70cbd2",exhaust:"#e7ad76",drive:"#d7c58d"};Rc=class{constructor(e){this.owner=e,this.root=new ye,this.root.name="Model-driven ventilation paths",e.scene.add(this.root),this.key="",this.layers={},this.materials=Object.fromEntries(Object.keys(Tp).map(t=>[t,_v(t)])),this.points=[new P,new P,new P]}rebuild(){let e=this.owner,t=e.view==="bench",n=`${e.layoutKey}|${e.view}`;if(n===this.key)return;this.key=n;for(let o of Object.values(this.layers))o.geometry.dispose();this.root.clear(),this.layers={};let s={wind:[],intake:[],exhaust:[],drive:[]},r=(o,a,c=.014)=>{let l=new Jn(a.map(h=>new P(...h)),!1,"centripetal");s[o].push(new Qr(l,e.compactGraphics?24:40,c,4,!1))};if(t){let o=e.units[0].g;o.updateMatrixWorld(!0);let a=c=>o.localToWorld(new P(...c)).toArray();for(let c=0;c<4;c++)r("wind",[[-5,1.15+c*.3,-.6],[-3.7,1.3+c*.3,-.35],[-2.3,1.4+c*.3,-.1],[-.8,1.5+c*.3,0]].map(a),.012);r("drive",[[-1.05,1.55,.12],[.5,1.55,.12],[1.02,1.3,.12],[1.02,-.4,.12]].map(a),.017)}else{let o=e.roomW,a=e.roomD,c=e.compactGraphics?6:10;for(let l=0;l<c;l++){let h=-a/2-.6+l%5*(a+1.2)/4,u=4.4+Math.floor(l/5)*1.15;r("wind",[[-o/2-4,u,h],[-o*.25,u+.1,h+.16],[o*.22,u+.04,h],[o/2+4,u+.16,h-.18]],.01)}for(let l of e.panes){let h=Math.sign(l.x);for(let u of[-.24,.24])r("intake",[[l.x+h*1.4,l.y+.06,l.zc+u],[l.x,l.y,l.zc+u],[l.x-h*1.1,l.y-.25,l.zc+u*.5],[l.x-h*Math.min(o*.38,3),1.35,l.zc+.5]],.016)}for(let l=0;l<e.count;l++){let h=e.unitPos(l),u=h.x+1.02,d=h.z;for(let f of[-1,1])r("exhaust",[[u+f*1.35,1.25,d+.8],[u+f*.55,2.4,d+.35],[u,3.3,d],[u,4.25,d],[u+.75,5.15,d+.12],[u+2,5.35,d+.2]],.019);r("drive",[[h.x-1.02,h.y+1.55,d+.12],[h.x+.52,h.y+1.55,d+.12],[u,h.y+1.3,d+.12],[u,h.y-.4,d+.12]],.017)}}for(let[o,a]of Object.entries(s)){if(!a.length)continue;let c=Bf(a);a.forEach(h=>h.dispose());let l=new qe(c,this.materials[o]);l.name=`${o} directional trails`,l.frustumCulled=!1,l.renderOrder=3,this.root.add(l),this.layers[o]=l}}update(e,t){let n=this.owner;if(this.root.visible=n.flows,n.sensors?.mcuLed&&n.settings.mcu!=="none"&&(n.sensors.mcuLed.material.emissiveIntensity=t.shaft>0?1.1+.12*Math.sin(n.time*2):.6),!n.flows)return;this.rebuild();let s=Math.max(0,t.airflow)/Math.max(1,n.count),r=Math.max(0,n.settings.backgroundACH*n.settings.room),o=tu(t.wind/12,0,1),a=tu(s/500,0,1),c={wind:[t.wind>0?.22+o*.48:0,.1+Math.min(30,t.wind)*.026],intake:[r+t.airflow>0?.22+a*.5:0,.13+tu((r+s)/600,0,1)*.55],exhaust:[t.airflow>0?.3+a*.5:0,.18+a*.75],drive:[t.shaft>0?.48:0,.18+Math.min(t.outputRPM,160)/160*.7]};for(let[l,h]of Object.entries(this.layers)){let u=this.materials[l].userData.trails,[d,f]=c[l];u.speed.value+=(f-u.speed.value)*(1-Math.exp(-e*6)),u.time.value+=e*u.speed.value,u.strength.value=d,h.visible=d>0}}dispose(){Object.values(this.layers).forEach(e=>e.geometry.dispose()),Object.values(this.materials).forEach(e=>e.dispose()),this.root.removeFromParent()}}});function nu(i,e,t=!1){i._cameraPose||(i._cameraPose={angle:i.angle,elevation:i.elevation,distance:i.distance,target:i.target.clone()});let n=i._cameraPose,s=t||i.reducedMotion?1:1-Math.exp(-Math.max(0,e)*9),r=i.angle-n.angle;if(r=Math.atan2(Math.sin(r),Math.cos(r)),n.angle+=r*s,n.elevation+=(i.elevation-n.elevation)*s,n.distance+=(i.distance-n.distance)*s,n.target.lerp(i.target,s),i.view==="inside"&&i.interiorEye){i.camera.position.copy(i.interiorEye);let a=Math.cos(n.elevation);i.camera.lookAt(i.interiorEye.x-Math.sin(n.angle)*a,i.interiorEye.y-Math.sin(n.elevation),i.interiorEye.z-Math.cos(n.angle)*a);return}let o=Math.cos(n.elevation)*n.distance;i.camera.position.set(n.target.x+Math.sin(n.angle)*o,n.target.y+Math.sin(n.elevation)*n.distance,n.target.z+Math.cos(n.angle)*o),i.camera.lookAt(n.target)}function iu(i,e){let t=Math.max(1,1.25/Math.max(.4,i.camera.aspect));return i.maxDistance=Math.max(220,i.extent*3),At.clamp(e*t,4,i.maxDistance)}var Rp=Ft(()=>{hn()});var zi,Cp,xv,Ip,Pp,yv,cu,Lp,vv,Mv,bv,Sv,wv,ki,Dn,Tv,Ev,Cc,su,Av,Ic,Rt,ru,vs,Rv,Zt,yn,ou,au,Pc,Ye,Ct,lu,Dp,pr,hu=Ft(()=>{hn();np();dr();dp();mp();wp();Sc();Ap();Rp();zi=12,Cp=30,xv=8,Ip=4.9,Pp=5.6,yv=(i,e)=>Math.min(i<=8?i:8+(i-8)*.35,30,e>0?.6/e:30),cu=24,Lp=60,vv=.4,Mv=i=>{let e=Ct(i,0,Lp);return cu*Math.pow(e/Lp,vv)*lu(0,.4,e)},bv=2,Sv=.35,wv=1.6,ki=.5,Dn=6.6,Tv=6,Ev=2,Cc=.14,su=3.4,Av=3.6,Ic=2,Rt=1.2,ru=.16,vs=.95,Rv=1.55,Zt=.3,yn=3.2,ou=3.7,au=.5,Pc=20,Ye=1.02,Ct=(i,e,t)=>Math.min(t,Math.max(e,i)),lu=(i,e,t)=>{let n=Ct((t-i)/(e-i),0,1);return n*n*(3-2*n)},Dp=(i,e)=>{let t=e?i<=5?i:Math.ceil(i/2):i;return{cols:t,rows:Math.ceil(i/t)}},pr=class{constructor(e,t){this.host=e,this.mode=t,this.angle=.8,this.elevation=.42,this.distance=13,this.target=new P(0,2,0),this.view="field",this.time=0,this.count=1,this.extent=12,this.reducedMotion=matchMedia("(prefers-reduced-motion: reduce)").matches,this.rotors=[],this.rotorGroups=[],this.gears=[],this.fans=[],this.vfans=[],this.units=[],this.trees=[],this.fish=[],this.rings=[],this.rainRings=[],this.people=[],this.panes=[],this.debris=[],this.puddles=[],this.hazes=[],this.water=null,this.canyon=null,this.flows=!0,this.haze=0,this.rainAmt=0,this.storm=!1,this.night=!1,this.flashT=0,this.lightT=3,this.layoutKey="",this.roomW=6,this.roomD=6,this.pondL=9,this.pondW=5,this.sensors=null,this.boats=1,this.upb=1,this.mount="boat",this.boatGroups=[],this.boatPose=[],this.boatTheta=[],this.boatSim=[],this.lanes=[],this.laneOf=[],this.pondZc=6,this.benchBoat=null,this.compactGraphics=matchMedia("(max-width: 760px)").matches||(navigator.hardwareConcurrency||8)<5,this.renderer=new yc({antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,this.compactGraphics?1.25:1.7)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ba,this.renderer.outputColorSpace=vt,this.renderer.toneMapping=Pa,this.renderer.toneMappingExposure=.92,this.renderer.domElement.setAttribute("aria-label",t==="air"?"Interactive 3D rooftop ventilation with the wind prototype driving fans into a room":"Interactive 3D pond aerator with the wind prototype driving a paddle wheel"),this.renderer.domElement.setAttribute("role","img"),this.renderer.domElement.tabIndex=0,e.prepend(this.renderer.domElement),this.scene=new es,this.scene.background=new Ee("#839e88"),this.scene.fog=new Or("#839e88",.02),this.camera=new Pt(38,1,.1,600),this.hemi=new so("#e8f3da","#263b2c",2.4),this.scene.add(this.hemi),t==="air"&&(this.hemi.color.set("#deebf1"),this.hemi.groundColor.set("#454d43")),this.sun=new Fi("#fff1cb",3.2),this.sun.position.set(-8,14,9),this.sun.castShadow=!0,this.sun.shadow.mapSize.setScalar(this.compactGraphics?1024:2048),this.sun.shadow.bias=-15e-5,this.sun.shadow.normalBias=.018,this.sun.shadow.radius=3,this.scene.add(this.sun);let n=this.fill=new Fi("#c7dce6",.65);n.position.set(7,6,-7),this.scene.add(n),this.roomLight=new cn("#ffd89a",0,16,1.5),this.roomLight.position.set(0,2.7,0),this.scene.add(this.roomLight),this.flashLight=new cn("#e8f2ff",0,140,1.2),this.scene.add(this.flashLight),this.mats={white:this.mat("#f4f2ea",.55,.02),black:this.mat("#151819",.6,.05),steel:this.mat("#aeb6b0",.35,.75),concrete:this.mat("#8d9b87"),cream:this.mat("#ddd8bd"),wood:this.mat("#b99f78"),gold:this.mat("#c9ae75",.5,.4),cream2:this.mat("#c9b48a"),dark:this.mat("#1e3029"),trunk:this.mat("#655d42"),leaf:this.mat("#4d6945"),leaf2:this.mat("#5d7c4f"),skin:this.mat("#cfb894"),shirtA:this.mat("#6e8e80"),shirtB:this.mat("#89966a"),path:this.mat("#d5cdb0"),water:cp(),fish:this.mat("#b79b61",.6,0),fishTail:this.mat("#9d8b5a",.6,0),reed:this.mat("#5e7b3e"),cattail:this.mat("#6b4f2c"),plank:this.mat("#7e8062"),basin:this.mat("#3f5a52"),cloud:this.mat("#b4c3b3",.9,0),leafPiece:this.mat("#6f8f4a",.8,0),twig:this.mat("#4a3d2c",.8,0),glass:new at({color:"#9ac8b8",transparent:!0,opacity:.28,roughness:.12,side:gt}),win:new at({color:"#b8e0d0",transparent:!0,opacity:.34,roughness:.1,side:gt,emissive:"#000000"}),shellGlass:new at({color:"#b8d6c9",transparent:!0,opacity:.13,roughness:.2,side:gt,depthWrite:!1}),led:new at({color:"#6fe08a",emissive:"#2fbf5a",emissiveIntensity:1.2}),cross:new at({color:"#2fae63",emissive:"#12562f",emissiveIntensity:.6,roughness:.5}),pontoon:this.mat("#f1efe6",.45,.02),brake:new at({color:"#e0503f",emissive:"#6a1a10",roughness:.4}),storm:new at({color:"#f0b84a",emissive:"#6a4a10",roughness:.4}),duct:new at({color:"#f4f2ea",roughness:.4,transparent:!0,opacity:.28,side:gt,depthWrite:!1}),puddle:new at({color:"#2e4c52",roughness:.04,metalness:.5,transparent:!0,opacity:.9}),ripple:new Et({color:"#9fd6cb",transparent:!0,opacity:.6,depthWrite:!1,side:gt}),haze:new Et({color:"#fff3d2",transparent:!0,opacity:0,depthWrite:!1,side:gt,fog:!1})},this.hazeMat=this.mats.haze,this.surfaceNormal=hp(this.mats),t==="air"&&up(this.mats),this.reflectionTarget=op(this.scene,this.renderer),this.env=new ye,this.scene.add(this.env),this.shell=new ye,this.scene.add(this.shell),this.unitRoot=new ye,this.scene.add(this.unitRoot),this.fx=new ye,this.scene.add(this.fx),this.table=new ye,this.table.visible=!1,this.scene.add(this.table),this.buildStatic(),this.buildTable(),this.buildUnits(),this.buildFx(),t==="air"&&(this.ventilationVFX=new Rc(this)),this.bind(),this.resize(),this.resizeObserver=new ResizeObserver(()=>this.resize()),this.resizeObserver.observe(e),this.cameraPosition(),this.renderer.domElement.addEventListener("webglcontextlost",s=>{s.preventDefault(),e.dataset.graphics="lost"}),this.renderer.domElement.addEventListener("webglcontextrestored",()=>{delete e.dataset.graphics,this.resize()})}mat(e,t=.7,n=.08){return new at({color:e,roughness:t,metalness:n,side:gt})}mesh(e,t,n,s=0,r=0,o=0){let a=new qe(e,t);return a.position.set(s,r,o),a.castShadow=!0,a.receiveShadow=!0,n.add(a),a}box(e,t,n,s,r,o=0,a=0,c=0){return this.mesh(new zt(e,t,n),s,r,o,a,c)}cyl(e,t,n,s,r=0,o=0,a=0,c="y",l=e){let h=this.mesh(new $n(e,l,t,28),n,s,r,o,a);return c==="x"&&(h.rotation.z=Math.PI/2),c==="z"&&(h.rotation.x=Math.PI/2),h}strut(e,t,n,s,r){let o=new P(...t),a=new P(...n),c=a.clone().sub(o),l=this.cyl(s,c.length(),r,e);return l.position.copy(o.add(a).multiplyScalar(.5)),l.quaternion.setFromUnitVectors(new P(0,1,0),c.normalize()),l}sphere(e,t,n,s=0,r=0,o=0){return this.mesh(new In(e,16,12),t,n,s,r,o)}pointGeo(e){let t=new ot;return t.setAttribute("position",new ft(new Float32Array(e*3),3)),t}toothGeo(e,t,n){let s=new is,r=t*2;for(let a=0;a<r;a++){let c=a/r*Math.PI*2,l=a%2?e*.84:e,h=Math.cos(c)*l,u=Math.sin(c)*l;a?s.lineTo(h,u):s.moveTo(h,u)}s.closePath();let o=new Qs(s,{depth:n,bevelEnabled:!1,curveSegments:1});return o.translate(0,0,-n/2),o}buildStatic(){let e=this.env,t=new Cn(260,260,80,80),n=t.attributes.position;for(let f=0;f<n.count;f++){let m=n.getX(f),_=n.getY(f);n.setZ(f,.055*Math.sin(m*.31)*Math.cos(_*.24))}t.computeVertexNormals();let s=this.mesh(t,this.mat("#87918d",.98,0),e,0,-.34,0);s.rotation.x=-Math.PI/2,s.castShadow=!1,this.clouds=new ye,e.add(this.clouds);for(let f=0;f<9;f++){let m=new ye;m.position.set(-84+f*21,62+f%3*5,-85+f%2*30),this.clouds.add(m);let _=new qe(new In(1,16,12),this.mats.cloud);_.scale.set(10,1.3,4.2),m.add(_)}let r=new Float32Array(500*3);for(let f=0;f<500;f++){let m=Math.random()*Math.PI*2,_=Math.random()*Math.PI*.42,g=150;r[f*3]=Math.cos(m)*Math.cos(_)*g,r[f*3+1]=Math.sin(_)*g,r[f*3+2]=Math.sin(m)*Math.cos(_)*g}let o=new ot;o.setAttribute("position",new ft(r,3)),this.stars=new Rn(o,new _n({color:"#f2f6ea",size:1.6,sizeAttenuation:!1,transparent:!0,opacity:.85,depthWrite:!1,fog:!1})),this.stars.visible=!1,e.add(this.stars),this.moon=new qe(new In(4,20,14),new Et({color:"#e9f0d8",fog:!1})),this.moon.position.set(-70,80,-130),this.moon.visible=!1,e.add(this.moon);for(let f=0;f<6;f++){let m=new qe(new Cn(70,1.1),this.hazeMat);m.position.set(0,.5+f*.6,f%2?7:-7),e.add(m),this.hazes.push(m)}let a=new Cn(.2,.12);for(let f=0;f<36;f++){let m=new qe(a,f%3?this.mats.leafPiece:this.mats.twig);m.userData={x0:Math.random()*36,y0:.6+Math.random()*4.5,z0:(Math.random()-.5)*16,ph:Math.random()*6.28},m.visible=!1,e.add(m),this.debris.push(m)}let c=new Zs(1,28);c.rotateX(-Math.PI/2);let l=[[-10,2,1.1],[-8.5,-5,.8],[9,-6,1.3],[10.5,4.5,.9],[7,9.5,1.2],[-13,6,1],[-3,11.5,.9],[2.5,-10.5,1.1],[-12,-11,1.2],[14,-1,.8]];for(let[f,m,_]of l){let g=new qe(c,this.mats.puddle);g.position.set(f,-.27,m),g.rotation.y=f*.73,g.userData={base:_,th:.05+Math.random()*.4},g.visible=!1,e.add(g),this.puddles.push(g)}let h=new ye;h.position.set(-10.5,0,-7.5),e.add(h),this.cyl(.05,4.2,this.mats.white,h,0,2.1,0),this.sockPivot=new ye,this.sockPivot.position.set(0,4.2,0),h.add(this.sockPivot);let u=2.6,d=f=>.34-.24*f;for(let[f,m,_]of[[0,.85,"#e8762e"],[.85,1.75,"#f4f1e6"],[1.75,2.6,"#e8762e"]]){let g=new qe(new $n(d(f/u),d(m/u),m-f,18,1,!0),this.mat(_,.8,0));g.rotation.z=Math.PI/2,g.position.x=(f+m)/2,g.castShadow=!0,this.sockPivot.add(g)}this.mesh(new jn(.34,.025,6,18),this.mats.dark,this.sockPivot,0,0,0).rotation.y=Math.PI/2}buildTable(){this.box(14,.3,8,this.mats.cream2,this.table,0,-.15,1.4),this.mats.slab=new at({color:"#8d9b87",roughness:.7,transparent:!0,opacity:.42,depthWrite:!1,side:gt}),this.benchSlab=this.box(9,.25,4.2,this.mats.slab,this.table,-.5,.775,.2);for(let e=0;e<14;e++)this.box(.02,.005,8,this.mat("#b19d73"),this.table,-6.5+e,.01,1.4);this.mode==="water"&&(this.benchWater=new qe(new zt(14,1.5,9),this.mats.water.clone()),this.benchWater.position.set(0,-.75,0),this.benchWater.renderOrder=2,this.scene.add(this.benchWater),this.benchWater.visible=!1,this.benchBoat=new ye,this.benchBoat.position.set(-Ye,Cc,-1.2),this.scene.add(this.benchBoat),this.buildHull(this.benchBoat,1),this.benchBoat.visible=!1)}spiral(e,t,n,s,r){let o=new ye;o.position.set(t,n,s),e.add(o);let a=new ye;o.add(a),this.rotors.push(a),this.rotorGroups.push(o);for(let c=0;c<3;c++){let l=[],h=[];for(let m=0;m<=28;m++)for(let _=0;_<=10;_++){let g=m/28,p=_/10,M=.1+p*(.38+g*.7),y=c*Math.PI*2/3+g*2.7+p*.3;l.push((g-.5)*1.5,M*Math.cos(y),M*Math.sin(y))}for(let m=0;m<28;m++)for(let _=0;_<10;_++){let g=m*11+_;h.push(g,g+1,g+10+1,g+1,g+10+2,g+10+1)}let f=new ot;f.setAttribute("position",new je(l,3)),f.setIndex(h),f.computeVertexNormals(),this.mesh(f,r?this.mats.black:this.mats.white,a)}return this.cyl(.12,1.9,this.mats.white,a,0,0,0,"x"),this.cyl(.26,.2,this.mats.white,a,.85,0,0,"x"),r||tp(a),o}stand(e,t,n,s,r,o,a){let c=new ye;c.position.set(t,0,n),c.rotation.y=r,e.add(c);let l=new ye;c.add(l),this.box(.8,.12,.95,a,l,0,.06,0);for(let h of[-.17,.17])this.box(.1,s,.09,o,l,0,s/2+.1,h);return this.box(.1,.22,.52,o,l,0,s+.02,0),Qt(l,"bearing-frame",{scale:[1,s+.1,1]}),en(c,"bearing",[0,s+.1,0]),c}collar(e,t,n,s,r,o){this.cyl(.26,.13,o?this.mats.black:this.mats.white,e,t,n,s,r),this.cyl(.17,.17,o?this.mats.white:this.mats.black,e,t,n,s,r)}buildTeeth(){let e=au,t=Pc,n=[],s=[],r=[],o=new zt(.2,.08,.075),a=o.attributes.position,c=o.attributes.normal,l=o.index,h=new P,u=new P(1,1,1),d=.07,f=e-d,m=new Be().compose(new P(d,f,0),new nn().setFromEuler(new rn(0,0,-Math.PI/4)),u);for(let g=0;g<t;g++){let p=new Be().makeRotationX(g/t*Math.PI*2).multiply(m),M=new He().getNormalMatrix(p),y=n.length/3;for(let x=0;x<a.count;x++)h.fromBufferAttribute(a,x).applyMatrix4(p),n.push(h.x,h.y,h.z),h.fromBufferAttribute(c,x).applyMatrix3(M).normalize(),s.push(h.x,h.y,h.z);for(let x=0;x<l.count;x++)r.push(y+l.getX(x))}let _=new ot;return _.setAttribute("position",new je(n,3)),_.setAttribute("normal",new je(s,3)),_.setIndex(r),_}bevelGear(e,t,n,s,r){let o=au,a=.04*Math.SQRT2,c=.65*o,l=new ye;l.position.copy(t),l.rotation.set(n[0],n[1],n[2]),e.add(l);let h=new ye;l.add(h),this.gears.push({g:h,sign:s});let u=this.mesh(new $n(o-a-c,o-a,c,40),this.mats.white,h,c/2,0,0);u.rotation.z=-Math.PI/2,this.cyl(.13,.3,this.mats.white,h,-.15,0,0,"x");let d=this.mesh(this.teethGeo,this.mats.white,h);return d.rotation.x=r,Qt(h,"bevel",{rotation:[r,0,0]}),l}buildUnits(){this.teethGeo=this.buildTeeth(),this.toothUnit=this.toothGeo(1,20,.08),this.teethGeo.userData.sharedStatic=!0,this.toothUnit.userData.sharedStatic=!0;let e=au,t=this.mats.white,n=this.mats.black;for(let s=0;s<zi;s++){let r=new ye;this.unitRoot.add(r);let o=this.mode==="air"?Rv:bv,a={g:r};this.units.push(a),this.spiral(r,-2,o,0,!1),this.cyl(.075,1.55,t,r,-.225,o,0,"x"),this.stand(r,-.95,0,o-.1,0,t,t),this.stand(r,.1,0,o-.1,0,n,n),this.collar(r,-.77,o,0,"x",!0),this.collar(r,.28,o,0,"x",!0),a.brake=this.mesh(new jn(.2,.035,8,28),this.mats.brake,r,-.77,o,0),a.brake.rotation.y=Math.PI/2,a.brake.visible=!1,this.bevelGear(r,new P(Ye-e,o,0),[0,0,0],1,0);let c=a.airOut=new ye;r.add(c),this.bevelGear(c,new P(Ye,o-e,0),[0,0,Math.PI/2],-1,Math.PI/Pc),this.cyl(.075,1.42,t,c,Ye,.29,0),this.mesh(new $n(.45,.45,.28,32,1,!0),t,c,Ye,.14,0);let l=this.mesh(new Zs(.44,32),this.mats.dark,c,Ye,.012,0);l.rotation.x=-Math.PI/2,this.box(.9,.05,.08,t,c,Ye,.3,0),this.box(.08,.05,.9,t,c,Ye,.3,0),this.collar(c,Ye,.34,0,"y",!0),a.goldAir=new ye,a.goldAir.position.set(Ye,.62,0),c.add(a.goldAir),this.vfans.push(a.goldAir);let h=this.mesh(this.toothUnit,this.mats.gold,a.goldAir);h.rotation.x=Math.PI/2;let u=new ye;u.position.set(Ye,-.4,0),c.add(u),this.vfans.push(u),this.cyl(.12,.16,t,u,0,0,0);for(let p=0;p<6;p++){let M=new ye;M.rotation.y=p*Math.PI/3,u.add(M);let y=this.box(.62,.016,.2,t,M,.45,0,0);y.rotation.x=.4}Qt(u,"fan");let d=new ye;d.position.set(Ye,-.35,0),c.add(d),this.mesh(new $n(.88,.88,.3,40,1,!0),this.mats.duct,d);for(let p of[-.15,.15]){let M=this.mesh(new jn(.88,.03,8,40),t,d,0,p,0);M.rotation.x=Math.PI/2}this.mode==="air"&&Qt(d,"fan-shroud"),this.box(1.76,.03,.05,t,c,Ye,-.24,0),this.box(.05,.03,1.76,t,c,Ye,-.24,0),this.collar(c,Ye,-.24,0,"y",!0),a.bars=[];for(let p=0;p<10;p++){let M=(p-4.5)*.17,y=2*Math.sqrt(Math.max(.01,.88*.88-M*M)),x=this.box(y,.03,.04,this.mats.dark,c,Ye,-.5,M);x.visible=!1,a.bars.push(x)}let f=a.waterOut=new ye;r.add(f);let m=Sv;this.bevelGear(f,new P(Ye,o-e,0),[0,0,Math.PI/2],-1,Math.PI/Pc),this.cyl(.075,.5,t,f,Ye,(o-e-.3+m+e+.3)/2,0),this.collar(f,Ye,(o+m)/2+.02,0,"y",!0),this.bevelGear(f,new P(Ye,m+e,0),[0,0,-Math.PI/2],1,0),this.bevelGear(f,new P(Ye,m,e),[0,Math.PI/2,0],-1,Math.PI/Pc),this.cyl(.075,4.5,t,f,Ye,m,2.95,"z"),this.stand(f,Ye,1.75,m-.1,Math.PI/2,n,n),this.collar(f,Ye,m,1.55,"z",!0),this.stand(f,Ye,5,m-.1,Math.PI/2,t,t),this.collar(f,Ye,m,4.8,"z",!1),a.goldWater=new ye,a.goldWater.position.set(Ye,m,2.2),f.add(a.goldWater),this.fans.push(a.goldWater),this.mesh(this.toothUnit,this.mats.gold,a.goldWater);let _=new ye;_.position.set(Ye,m,su),f.add(_),this.fans.push(_);let g=wv-.22;this.cyl(.24,1.5,n,_,0,0,0,"z");for(let p of[-.62,.62])this.mesh(new jn(g,.055,8,56),n,_,0,0,p);for(let p=0;p<8;p++){let M=new ye;M.rotation.z=p*Math.PI/4,_.add(M);for(let y of[-.62,.62])this.box(.09,g-.2,.07,n,M,0,(g+.2)/2,y);this.box(.08,.62,1.4,this.mats.cream,M,0,g,0)}Qt(_,"paddle"),f.visible=!1,s===0&&this.buildSensors(r,o)}}buildSensors(e,t){let n=this.sensors={},s=new ye;s.position.set(-3.3,0,-1),e.add(s),n.mast=s,this.box(.5,.1,.5,this.mats.black,s,0,.05,0),this.cyl(.065,3.2,this.mats.steel,s,0,1.6,0);for(let p of[-.18,.18])for(let M of[-.18,.18])this.cyl(.035,.045,this.mats.steel,s,p,.12,M),this.strut(s,[p,.1,M],[0,.65,0],.025,this.mats.steel);let r=new ye;r.position.y=3.3,s.add(r),n.cup=r,this.cyl(.025,.3,this.mats.steel,r,0,-.1,0);let o=new ye;r.add(o),n.cupSpin=o;for(let p=0;p<3;p++){let M=p*Math.PI*2/3,y=this.box(.5,.02,.02,this.mats.steel,o,Math.cos(M)*.22,0,Math.sin(M)*.22);y.rotation.y=-M,this.sphere(.09,this.mats.black,o,Math.cos(M)*.45,0,Math.sin(M)*.45)}n.cupBody=this.cyl(.07,.2,this.mats.black,r,0,-.18,0),n.cupInd=this.cyl(.1,.1,this.mats.black,r,0,-.2,0);let a=new ye;a.position.y=3.3,s.add(a),n.ultra=a,this.cyl(.15,.3,this.mats.white,a,0,0,0),this.cyl(.18,.07,this.mats.black,a,0,-.13,0),this.cyl(.07,.14,this.mats.steel,a,0,.2,0),this.cyl(.34,.08,this.mats.black,a,0,.27,0);for(let[p,M]of[[.18,.18],[-.18,.18],[.18,-.18],[-.18,-.18]]){this.cyl(.035,.56,this.mats.steel,a,p,.58,M);for(let y of[.32,.84])this.cyl(.06,.065,this.mats.white,a,p,y,M)}this.cyl(.34,.08,this.mats.black,a,0,.89,0),this.cyl(.25,.035,this.mats.white,a,0,.94,0);let c=new ye;c.position.set(-.4,t+.22,0),e.add(c),n.hall=c,this.box(.14,.12,.1,this.mats.black,c),this.box(.04,.04,.04,this.mats.led,c,0,-.08,0);let l=new ye;l.position.set(Ye+.98,-.35,0),e.add(l),n.co2=l,this.box(.34,.22,.22,this.mats.black,l),this.box(.14,.08,.02,this.mats.led,l,0,0,.12);let h=new ye;h.position.set(Ye+1.2,0,5),e.add(h),n.doProbe=h,this.box(.3,.2,.2,this.mats.black,h,0,.35,0),this.cyl(.035,1.7,this.mats.black,h,0,-.55,0),this.cyl(.06,.3,this.mats.steel,h,0,-1.35,0);let u=new ye;u.position.set(-2.6,0,-1),e.add(u),n.rain=u,this.box(.42,.1,.42,this.mats.black,u,0,.05,0);for(let p of[-.14,.14])for(let M of[-.14,.14])this.cyl(.03,.045,this.mats.steel,u,p,.12,M);this.cyl(.06,3,this.mats.steel,u,0,1.5,0),this.strut(u,[-.17,.1,0],[0,.55,0],.025,this.mats.steel),this.strut(u,[.17,.1,0],[0,.55,0],.025,this.mats.steel),this.cyl(.11,.16,this.mats.white,u,0,2.96,0),this.sphere(.095,this.mats.steel,u,0,3.03,0);let d=new ye;d.position.y=3.06,d.rotation.z=.35,u.add(d),this.box(.26,.16,.2,this.mats.steel,d,0,.02,0),this.box(.46,.06,.36,this.mats.black,d,0,.11,0);let f=new ye;f.position.set(Ye-1.2,0,5),e.add(f),n.temp=f,this.box(.25,.16,.16,this.mats.black,f,0,.3,0),this.cyl(.03,1.4,this.mats.steel,f,0,-.4,0),this.sphere(.07,this.mats.black,f,0,-1.1,0);let m=new ye;m.position.set(-2.7,this.mode==="air"?1:.75,this.mode==="air"?1.4:.9),e.add(m),n.mcu=m,this.cyl(.05,1,this.mats.steel,m,0,-.55,0);let _=new ye;m.add(_),this.box(.7,.5,.35,this.mats.black,_),this.mode==="air"&&Qt(_,"controller"),n.mcuLed=this.mesh(new In(.035,12,8),this.mats.led.clone(),m,.22,.15,.195);let g=new ye;g.position.copy(m.position),e.add(g),n.enclosure=g,this.box(.9,.7,.5,this.mats.glass,g);for(let p of["cup","ultra","hall","co2","doProbe","rain","temp","mcu","enclosure"])n[p].visible=!1;n.mast.visible=!1}setHardware(e,t){let n=this.sensors;if(!n)return;let s=t.windSensor;n.cup.visible=s==="cup_hobby"||s==="cup_ind",n.ultra.visible=s==="ultra",n.mast.visible=n.cup.visible||n.ultra.visible,n.hall.visible=s==="hall",n.co2.visible=this.mode==="air"&&t.qualitySensor!=="none",n.doProbe.visible=this.mode==="water"&&t.qualitySensor!=="none",n.rain.visible=this.mode==="air"&&t.envSensor!=="none",n.temp.visible=this.mode==="water"&&t.envSensor!=="none",n.mcu.visible=t.mcu!=="none",n.enclosure.visible=t.mcu!=="none"&&t.enclosure!=="none";let r=e.items.mcu.res?e.items.mcu.res.status:"ok",o=r==="fail"?"#ff5a4d":r==="warn"?"#ffc04d":"#6fe08a";n.mcuLed.material.color.set(o),n.mcuLed.material.emissive.set(o)}unitPos(e){let t=this.count;if(this.mode==="air"){let n=Dp(t,!0),s=e%n.cols,r=Math.floor(e/n.cols);return{x:(s-(n.cols-1)/2)*Ip+.33,y:ou,z:(r-(n.rows-1)/2)*Pp-1.8}}return this.unitFrame(e)}unitFrame(e){let t=Math.floor(e/this.upb),n=e%this.upb,s=this.boatPose[t]||{x:0,z:0,ry:0,heave:0},r=ki,o=(n-(this.upb-1)/2)*Dn,a=Math.cos(s.ry),c=Math.sin(s.ry),l=s.x-r*(Ye*a+2.2*c),h=s.z-r*(-Ye*c+2.2*a);return{x:l+r*o*a,z:h-r*o*c,y:vs+Cc*r+s.heave,ry:s.ry,s:r,ox:l,oz:h,hy:vs+Cc*r+s.heave}}wheelPos(e){let t=this.unitFrame(e),n=Math.cos(t.ry),s=Math.sin(t.ry);return{x:t.x+t.s*(Ye*n+su*s),z:t.z+t.s*(-Ye*s+su*n)}}layout(e){let t=Ct(Math.round(e.units),1,zi);this.count=t;let n;if(this.mode==="air"){let o=Math.max(4,e.room/yn),a=Dp(t,!0);this.roomW=Math.max((a.cols-1)*Ip+6,Math.sqrt(o*1.6)),this.roomD=Math.max((a.rows-1)*Pp+6,o/this.roomW),this.extent=Math.max(this.roomW,this.roomD),n=["air",t,this.roomW.toFixed(2),this.roomD.toFixed(2)].join("|")}else{let o=Ct(Math.round(e.boats),1,Tv),a=Ct(Math.round(e.upb),1,Ev),c=e.mount==="anchored"?"anchored":"boat";this.boats=o,this.upb=a,this.mount=c,this.count=o*a;let l=a*Dn*ki,u=150+(Ct(e.pond,20,500)-20)*(1100/480),d=14,f=11;if(c==="anchored")d=Math.max(d,o*(l+2)+8),f=12;else{let m=(l+1.5)*(Av+1.5)*3;u=Math.max(u,o*m),f=Math.max(f,l+6)}this.pondL=Ct(Math.max(Math.sqrt(u*1.6),d),14,70),this.pondW=Ct(Math.max(u/this.pondL,f),11,34),this.extent=Math.max(this.pondL,this.pondW*1.3),n=["water",o,a,c,this.pondL.toFixed(2),this.pondW.toFixed(2)].join("|")}n!==this.layoutKey&&(this.layoutKey=n,this.buildShell());let s=Math.max(44,this.extent*.7),r=this.sun.shadow.camera;r.left=-s,r.right=s,r.top=s,r.bottom=-s,r.far=Math.max(60,s*4),r.updateProjectionMatrix(),this.sun.position.set(-s*.6,s*1.1,s*.75)}buildShell(){wc(this.shell,Object.values(this.mats)),this.trees=[],this.fish=[],this.rings=[],this.rainRings=[],this.people=[],this.panes=[],this.water=null,this.mode==="air"?this.buildRoomShell():this.buildPondShell(),this.buildTrees(),this.mode==="air"&&fp(this),pp(this),Sp(this)}buildRoomShell(){let e=this.shell,t=this.mats,n=this.roomW,s=this.roomD,r=this.count,o=(F,A,U,N,q,O)=>{let ee=this.box(F,A,U,t.shellGlass,e,N,q,O);return ee.castShadow=!1,ee};this.box(n+.6,Zt,s+.6,t.concrete,e,0,Zt/2,0),o(n,yn,.16,0,Zt+yn/2,-s/2).name="back-wall";let a=new is;a.moveTo(-n/2-.2,-s/2-.2),a.lineTo(n/2+.2,-s/2-.2),a.lineTo(n/2+.2,s/2+.2),a.lineTo(-n/2-.2,s/2+.2),a.closePath();for(let F=0;F<r;F++){let A=this.unitPos(F),U=new ns;U.absarc(A.x+Ye,-A.z,.45,0,Math.PI*2,!0),a.holes.push(U)}let c=this.mesh(new Qs(a,{depth:.2,bevelEnabled:!1,curveSegments:32}),t.shellGlass,e,0,3.5,0);c.rotation.x=-Math.PI/2,c.castShadow=!1,c.name="full-roof";for(let F of[-1,1]){this.box(n+.3,.12,.12,t.white,e,0,3.56,F*s/2),this.box(.12,.12,s+.3,t.white,e,F*n/2,3.56,0);for(let A of[-1,1])this.box(.12,yn,.12,t.white,e,F*n/2,Zt+yn/2,A*s/2)}let l=1.05,h=2.25,u=n/2-1.9,d=u+l,f=s/2;o(u+n/2,yn,.16,(-n/2+u)/2,Zt+yn/2,f).name="front-wall-left",o(n/2-d,yn,.16,(d+n/2)/2,Zt+yn/2,f).name="front-wall-right",o(l,yn-h,.16,u+l/2,Zt+h+(yn-h)/2,f);for(let F of[u,d])this.box(.08,h,.22,t.white,e,F,Zt+h/2,f);this.box(l+.08,.08,.22,t.white,e,u+l/2,Zt+h,f),this.doorPivot=new ye,this.doorPivot.name="entrance-door",this.doorPivot.position.set(u,Zt,f),e.add(this.doorPivot);let m=this.box(l-.08,h-.06,.06,t.win,this.doorPivot,l/2,h/2,0);m.castShadow=!1;for(let F of[.04,l-.04])this.box(.06,h,.08,t.wood,this.doorPivot,F,h/2,0);for(let F of[.04,h-.04])this.box(l,.08,.08,t.wood,this.doorPivot,l/2,F,0);this.sphere(.055,t.gold,this.doorPivot,l-.16,1.05,.1),this.setDoorOpen(!!this.doorOpen),this.doorPivot.rotation.y=this.doorTarget;let _=-n/2+1.35,g=new ye;g.position.x=_,e.add(g),this.box(1.5,.08,.8,t.wood,g,0,.95,0);for(let[F,A]of[[-.65,-.32],[.65,-.32],[-.65,.32],[.65,.32]])this.box(.07,.61,.07,t.dark,g,F,.62,A);this.box(.5,.32,.035,t.dark,g,-.1,1.25,-.12),Qt(g,"workspace");let p=Math.max(1,Math.floor(s/2.6)),M=1.05,y=1.5,x=M+y;for(let F of[-1,1])for(let A=0;A<p;A++){let U=s/p,N=U*.7,q=-s/2+(A+.5)*U,O=F*n/2,ee=(U-N)/2;o(.16,M-Zt,U,O,(M+Zt)/2,q),o(.16,Zt+yn-x,U,O,(x+Zt+yn)/2,q);for(let de of[-1,1])o(.16,y,ee,O,M+y/2,q+de*(N/2+ee/2)),this.box(.24,y+.12,.08,t.white,e,O,M+y/2,q+de*N/2),this.box(.24,.08,N,t.white,e,O,de<0?M:x,q);let ie=new ye;ie.name="ventilation-window",ie.position.set(O,M+y/2,q-N/2),e.add(ie),this.box(.05,y-.12,N-.12,t.win,ie,0,0,N/2);for(let de of[-1,1])this.box(.08,y,.06,t.dark,ie,0,0,de<0?.03:N-.03),this.box(.08,.06,N,t.dark,ie,0,de*(y/2-.03),N/2);this.box(.08,y,.04,t.white,ie,0,0,N/2),this.panes.push({piv:ie,sign:-F,x:O,zc:q,width:N,y:M+y/2})}let S=Math.max(2,Math.floor((n-1.4)/.85)),E=Math.ceil(Cp/S),C=-s/2+1,I=s/2-1.6,w=E>1?(I-C)/(E-1):0,b=F=>-n/2+.9+F*(n-1.8)/Math.max(1,S-1),L=Zt;for(let F=0;F<Cp;F++){let A=F%S,U=Math.floor(F/S),N=new ye;N.position.set(b(A),L,C+U*w),e.add(N),this.people.push(N);let q=new ye;N.add(q),this.box(.4,.05,.4,t.dark,q,0,.46,0),this.box(.4,.4,.05,t.dark,q,0,.72,-.2),Qt(q,"chair");let O=new ye;N.add(O),this.cyl(.15,.52,F%2?t.shirtB:t.shirtA,O,0,.76,0),this.sphere(.13,t.skin,O,0,1.13,0);for(let ee of[-.08,.08])this.cyl(.05,.42,t.dark,O,ee,.53,.2,"z"),this.cyl(.045,.44,t.dark,O,ee,.27,.41);Qt(O,"site-seated-person",{appearance:bc(F)})}let z=-s/2+.1;this.box(1.15,1.15,.03,t.white,e,-n/2+2.4,L+2.1,z),this.box(.78,.2,.04,t.cross,e,-n/2+2.4,L+2.1,z+.02),this.box(.2,.78,.04,t.cross,e,-n/2+2.4,L+2.1,z+.02);for(let F of[n/2-.55,-n/2+.5]){this.cyl(.17,.32,t.trunk,e,F,L+.16,-s/2+.6);for(let A=0;A<3;A++)this.sphere(.2-A*.03,t.leaf2,e,F+(A-1)*.08,L+.5+A*.18,-s/2+.6)}for(let F=0;F<5;F++)this.box(.04,.07,.95,t.white,e,-n/2+.12,L+.45+F*.15,-s/2+1.6);this.canyon=new ye,e.add(this.canyon);for(let F of[-1,1])this.canyonBlock(this.canyon,F*(n/2+6),0);for(let F=0;F<3;F++)this.box(1.45,.1,.34,t.concrete,e,n/2-1.375,-.1+F*.15,s/2+1.15-F*.34)}buildHull(e,t){let n=this.mats;for(let s=0;s<t;s++){let r=(s-(t-1)/2)*Dn;for(let o of[-2.15,2.15]){let a=r+Ye+o;this.cyl(.4,6.4,n.pontoon,e,a,-.46,2.2,"z"),this.sphere(.4,n.pontoon,e,a,-.46,-1),this.sphere(.4,n.pontoon,e,a,-.46,5.4)}this.box(4.9,.1,1,n.wood,e,r+Ye,-.05,5);for(let o of[-.6,1.6])this.box(4.9,.08,.14,n.black,e,r+Ye,-.18,o+.2);for(let o of[-1,1]){let a=r+Ye+o*2.15;for(let c of[.3,3.9])this.mesh(new jn(.405,.024,6,24),n.steel,e,a,-.46,c),this.box(.1,.16,.24,n.steel,e,a,-.04,c)}}this.box(t*Dn,.1,3.4,n.wood,e,0,-.05,.7);for(let s=0;s<8;s++)this.box(t*Dn,.012,.03,n.plank,e,0,.002,-.9+s*.43);this.box(t*Dn,.14,.06,n.pontoon,e,0,.08,-1);for(let s of[-1,1])for(let r of[-.66,2.03])en(e,"site-deck-cleat",[s*(t*Dn/2-.42),.015,r]);en(e,"site-lifebuoy",[t*Dn/2-.65,.025,.7])}buildPondShell(){let e=this.shell,t=this.mats,n=this.pondL,s=this.pondW,r=Rt+s/2;this.pondZc=r,this.box(n+2,ru,5.2,t.wood,e,0,ru/2,Rt-2.6);for(let m=0;m<13;m++)this.box(n+2,.01,.03,t.plank,e,0,ru+.005,Rt-5+m*.4);this.box(n,.2,s,t.basin,e,0,-.4,r),this.box(n+.5,1.38,.24,t.concrete,e,0,.39,Rt+s+.12),this.box(.24,1.38,s+.24,t.concrete,e,-n/2-.12,.39,r),this.box(.24,1.38,s+.24,t.concrete,e,n/2+.12,.39,r),this.box(n+.5,1.38,.24,t.concrete,e,0,.39,Rt-.12);let o=[];for(let m of[-1,1])for(let _=-n/2;_<n/2;_+=.75)o.push([_+.36,1.105,r+m*(s/2+.12),.71,.39]);for(let m of[-1,1])for(let _=-s/2;_<s/2;_+=.75)o.push([m*(n/2+.12),1.105,r+_+.36,.39,.71]);let a=new Lt(new zt(1,.075,1),t.path,o.length),c=new Qe;a.name="Jointed pond coping stones",a.castShadow=a.receiveShadow=!0,o.forEach(([m,_,g,p,M],y)=>{c.position.set(m,_,g),c.scale.set(p,1,M),c.updateMatrix(),a.setMatrixAt(y,c.matrix)}),e.add(a),this.water=new qe(new Cn(n,s,Math.max(16,Math.round(n*2)),Math.max(10,Math.round(s*2))),t.water),this.water.rotation.x=-Math.PI/2,this.water.position.set(0,vs,r),this.water.receiveShadow=!0,this.water.renderOrder=2,e.add(this.water),t.water.userData.waterUniforms.zwSize.value.set(n,s);for(let m=0;m<zi*3;m++){let _=new qe(new jn(.25+m%3*.35,.012,6,50),t.ripple);_.rotation.x=-Math.PI/2,_.visible=!1,e.add(_),this.rings.push(_)}for(let m=0;m<16;m++){let _=new qe(new jr(.12,.16,20),t.ripple);_.rotation.x=-Math.PI/2,_.position.set((Math.random()-.5)*n*.9,vs+.015,Rt+.3+Math.random()*(s-.6)),_.userData.seed=Math.random(),_.visible=!1,e.add(_),this.rainRings.push(_)}for(let m=0;m<xv;m++){let _=new ye,g=new qe(new In(.14,12,8),t.fish);g.scale.set(2,.55,.7),_.add(g);let p=new qe(new Hr(.16,.23,3),t.fishTail);p.rotation.z=Math.PI/2,p.position.x=-.3,_.add(p),Qt(_,"site-fish"),_.userData.home={x:-n/2+1.2+m%4*(n-2.4)/3,z:Rt+1+(Math.floor(m/4)+.5)*(s-2)/2},_.position.set(_.userData.home.x,.55,_.userData.home.z),e.add(_),this.fish.push(_)}for(let m=0;m<8;m++){let _=m%2?1:-1,g=_*(n/2+1+(m>>2)*.4),p=Rt+.8+(m>>1)%4*(s-1.6)/3,M=1+m%3*.3;this.cyl(.02,M,t.reed,e,g,-.3+M/2,p),this.cyl(.06,.25,t.cattail,e,g,-.3+M-.12,p)}let l=this.boatSim,h=this._simL,u=this._simW;this.boatGroups=[],this.boatPose=[],this.boatTheta=[],this.boatSim=[],this.lanes=[],this.laneOf=[];let d=this.upb*Dn*ki,f=this.boats>3?2:1;this.lanes=f===2?[.88,.5]:[.8];for(let m=0;m<this.boats;m++){let _=new ye;e.add(_),this.buildHull(_,this.upb),this.boatGroups.push(_);let g=m%f,p=Math.floor(m/f),M=Math.ceil((this.boats-g)/f);this.laneOf.push(g),this.boatTheta.push(p/M*Math.PI*2+g*.9),this.boatPose.push({x:0,z:r,ry:0,heave:0});let y=Math.max(1,n/2-this.boatMargin()),x=Math.max(1,s/2-this.boatMargin()),S=this.boatTheta[m],E=this.lanes[g],C={x:E*y*Math.cos(S),z:r+E*x*Math.sin(S),h:Math.atan2(-y*Math.sin(S),x*Math.cos(S))};if(l&&l.length===this.boats&&h&&u){let I=l[m];C={x:I.x*n/h,z:r+(I.z-(Rt+u/2))*s/u,h:I.h}}if(this.boatSim.push(C),this.mount==="anchored"){let I=(m-(this.boats-1)/2)*(d+2);for(let w of[-d*.3,d*.3])this.cyl(.1,1.1,t.trunk,e,I+w,1.35,Rt-.05)}}if(this._simL=n,this._simW=s,this.mount==="boat")for(let m=0;m<40;m++)this.separateBoats();this.poseBoats(0),this.canyon=new ye,e.add(this.canyon);for(let m of[-1,1])this.canyonBlock(this.canyon,m*(n/2+6.5),r);this.parkBench(e,n/2-1.2,Rt+s+1.9)}boatMargin(){return Math.max(this.upb*Dn*ki/2,Ic)+.6}boatCircles(e){let t=this.upb*Dn*ki,n=Math.max(0,t/2-Ic),s=n>.05?2:1,r=Math.cos(e.h),o=Math.sin(e.h),a=[];for(let c=0;c<s;c++){let l=s===1?0:c?n:-n;a.push({x:e.x+l*r,z:e.z-l*o})}return a}separateBoats(){let e=this.pondL,t=this.pondW,n=Rt,s=this.boatSim,r=s.length,o=Ic,a=.25;for(let c=0;c<3;c++){for(let l=0;l<r;l++)for(let h=l+1;h<r;h++){let u=this.boatCircles(s[l]),d=this.boatCircles(s[h]);for(let f of u)for(let m of d){let _=m.x-f.x,g=m.z-f.z,p=Math.hypot(_,g),M=2*o+a;if(p>=M)continue;p<1e-4&&(_=Math.cos(l*2.4+h),g=Math.sin(l*2.4+h),p=1);let y=(M-p)/2,x=_/p,S=g/p;s[l].x-=x*y,s[l].z-=S*y,s[h].x+=x*y,s[h].z+=S*y}}for(let l of s){let h=this.boatCircles(l);for(let u of h){let d=u.x-(e/2-o-.15),f=-e/2+o+.15-u.x;d>0?l.x-=d:f>0&&(l.x+=f);let m=u.z-(n+t-o-.15),_=n+o+.15-u.z;m>0?l.z-=m:_>0&&(l.z+=_)}}}}stepBoats(e,t){let n=this.pondL,s=this.pondW,r=this.pondZc,o=this.boatSim,a=this.boatMargin(),c=Math.max(1,n/2-a),l=Math.max(1,s/2-a),h=Ic,u=2*h+3.2;if(t<=0){this.separateBoats();return}for(let d=0;d<o.length;d++){let f=o[d],m=f.x,_=f.z-r,g=this.lanes[this.laneOf[d]]??.8,p=-(c/l)*_,M=l/c*m,y=Math.hypot(p,M)||1;p/=y,M/=y;let x=Math.hypot(m/c,_/l),S=-m/(c*c),E=-_/(l*l),C=Math.hypot(S,E)||1,I=Ct((x-g)*2.2,-1.2,1.2),w=p+I*S/C,b=M+I*E/C;for(let A=0;A<o.length;A++)if(A!==d)for(let U of this.boatCircles(f))for(let N of this.boatCircles(o[A])){let q=U.x-N.x,O=U.z-N.z,ee=Math.hypot(q,O);if(ee<u&&ee>1e-4){let ie=(1-ee/u)*2.4;w+=q/ee*ie,b+=O/ee*ie}}let z=Math.atan2(w,b)-f.h;z=Math.atan2(Math.sin(z),Math.cos(z));let F=1.4*e;f.h+=Ct(z,-F,F),f.x+=Math.sin(f.h)*t*e,f.z+=Math.cos(f.h)*t*e}this.separateBoats()}poseBoats(e){let t=ki,n=this.upb*Dn*t;for(let s=0;s<this.boats;s++){let r=this.boatPose[s],o=(.012+.05*this.rainAmt+(this.storm?.06:0))*1;if(r.heave=Math.sin(e*1.4+s*1.9)*o,this.mount==="anchored")r.x=(s-(this.boats-1)/2)*(n+2),r.z=Rt+3.3,r.ry=0;else{let l=this.boatSim[s];l&&(r.x=l.x,r.z=l.z,r.ry=l.h)}let a=this.boatGroups[s];if(!a)continue;let c=this.unitFrame(s*this.upb);a.position.set(c.ox,c.hy,c.oz),a.rotation.set(0,r.ry,0),a.scale.setScalar(t)}}canyonBlock(e,t,n){let s=en(e,"site-canyon-tower",[t,-.15,n]);s.name="Detailed urban canyon tower",s.userData.assetReady=s.userData.assetReady.then(r=>(r&&s.traverse(o=>{o.isMesh&&o.material.name==="Limestone render"&&(o.material=o.material.clone(),o.material.userData.sharedAsset=!1,o.material.color.set(t<0?"#b6bca9":"#c7ac94"),o.material.normalMap=this.surfaceNormal,o.material.normalScale.set(.12,.12))}),r))}parkBench(e,t,n){en(e,"site-bench",[t,-.18,n],[1,1,1],[0,Math.PI,0])}buildTrees(){let e=this.shell,t;if(this.mode==="air"){let n=this.roomW;t=[[-(n/2+2.8),2.2],[-(n/2+3.6),-2.5],[-(n/2+2.4),-.6],[n/2+2.8,2.6],[n/2+3.6,-1.8],[n/2+2.4,.2]]}else{let n=this.pondL,s=this.pondW;t=[[-(n/2+2.4),Rt+1],[-(n/2+3.6),Rt+s*.6],[n/2+2.4,Rt+s*.3],[n/2+3.6,Rt+s*.9],[-(n/2+2.2),Rt+s+2.8],[n/2+2.2,Rt+s+3.2],[-4,-6.2],[5,-6.6]]}for(let[n,s]of t){let r=new ye;r.position.set(n,-.3,s),e.add(r),this.cyl(.12,1.7,this.mats.trunk,r,0,.85,0);for(let o=0;o<3;o++){let a=this.sphere(.72-o*.12,o%2?this.mats.leaf2:this.mats.leaf,r,o===1?.3:0,1.8+o*.48,0);a.scale.y=1.25}this.trees.push(r),r.userData.cityHome=r.position.clone(),Qt(r,"tree",{scale:[1+this.trees.length%3*.14,1+this.trees.length%2*.2,1]})}}buildFx(){let e=this.fx;this.flowN=140,this.flowSeed=Array.from({length:this.flowN},()=>[Math.random(),Math.random(),Math.random()]),this.flowGeo=this.pointGeo(this.flowN),this.flow=new Rn(this.flowGeo,new _n({color:"#e9f5d6",size:.05,transparent:!0,opacity:.7,depthWrite:!1})),e.add(this.flow),this.stackN=24,this.stackSeed=Array.from({length:zi*this.stackN},()=>[Math.random(),Math.random(),Math.random()]),this.stackGeo=this.pointGeo(zi*this.stackN),this.stackPts=new Rn(this.stackGeo,new _n({color:"#d9f2c4",size:.06,transparent:!0,opacity:.8,depthWrite:!1})),e.add(this.stackPts),this.ventN=24,this.ventSeed=Array.from({length:this.ventN},()=>[Math.random(),Math.random(),Math.random()]),this.ventGeo=this.pointGeo(this.ventN),this.vent=new Rn(this.ventGeo,new _n({color:"#bfe9ff",size:.07,transparent:!0,opacity:.7,depthWrite:!1})),e.add(this.vent),this.splashN=12,this.splashGeo=this.pointGeo(zi*this.splashN),this.splash=new Rn(this.splashGeo,new _n({color:"#b9e0d6",size:.05,transparent:!0,opacity:.85,depthWrite:!1})),e.add(this.splash),this.heatN=70,this.heatSeed=Array.from({length:this.heatN},()=>[Math.random(),Math.random(),Math.random()]),this.heatGeo=this.pointGeo(this.heatN),this.heatPts=new Rn(this.heatGeo,new _n({color:"#ffe2a8",size:.09,transparent:!0,opacity:.5,depthWrite:!1})),e.add(this.heatPts),this.boltGeo=this.pointGeo(9),this.bolt=new Hn(this.boltGeo,new Gn({color:"#f4fbff",fog:!1})),this.bolt.visible=!1,e.add(this.bolt);let t=700,n=new Float32Array(t*6);for(let s=0;s<t;s++){let r=(Math.random()-.5)*34,o=Math.random()*14,a=(Math.random()-.5)*26;n.set([r,o,a,r-.12,o+.42,a],s*6)}this.rainGeo=new ot,this.rainGeo.setAttribute("position",new ft(n,3)),this.rain=new ts(this.rainGeo,new Gn({color:"#b8d1c7",transparent:!0,opacity:.5})),this.rain.visible=!1,this.env.add(this.rain)}setEnvironment(e,t){let n=this.layoutKey,s=this._framingDiameter,r=this.scenario?.environment;this.settings=t,this.scenario=e,this.storm=e.weather==="storm",this.night=e.weather==="night",this.rainAmt=Ct(t.rain,0,1),this.haze=Math.max(lu(28,46,t.ambient),e.weather==="heat"?.6:0),this.layout(t);let o=this.mode==="air";this.rotorGroups.forEach(l=>l.scale.setScalar(t.diameter)),this.units.forEach(l=>{let h=.2+.06*t.ratio;l.goldAir.scale.set(h,1,h),l.goldWater.scale.set(h,h,1)}),this.people.forEach((l,h)=>l.visible=o&&h<t.people);let a=Ct((t.backgroundACH-.2)/1.8,0,1);this.panes.forEach(l=>l.piv.rotation.y=l.sign*a*1.1);let c=Math.round(Ct(t.pressure/8,1,10));this.units.forEach(l=>l.bars.forEach((h,u)=>h.visible=o&&u<c)),this.canyon&&(this.canyon.visible=e.environment==="canyon");for(let l=0;l<this.trees.length;l++){let h=this.trees[l],u=e.environment==="canyon";h.userData.cityHome&&h.position.copy(h.userData.cityHome),h.visible=!u||(this.mode==="air"?l%3===0:Math.abs(h.position.z-this.pondZc)>4.5),u&&this.mode==="air"&&h.visible&&(h.position.z=this.roomD/2+2.1)}if(this.water){let l=this.mats.water.color,h=Ct((t.temp-10)/20,0,1);l.set("#3d6c72").lerp(new Ee("#527b68"),h).multiplyScalar(1-.15*t.oxygenDemand),this.night&&l.multiplyScalar(.55),this.storm&&l.lerp(new Ee("#3f6d64"),.4)}this.placeUnits(),this.applyView(),this.mode==="air"&&this._cameraPose&&!this.cameraUser&&(n!==this.layoutKey||s!==t.diameter||r!==e.environment)&&this.setView(this.view),this._framingDiameter=t.diameter}applyView(){let e=this.view==="bench";this.env.visible=!e,this.shell.visible=!e,this.fx.visible=!e,this.table.visible=e,this.benchSlab.visible=this.mode==="air",this.placeUnits()}placeUnits(){if(!this.settings)return;let e=this.view==="bench",t=this.mode==="air";this.units.forEach((n,s)=>{if(n.g.visible=e?s===0:s<this.count,n.g.rotation.set(0,0,0),e)t?(n.g.position.set(-.2,.9,.2),n.g.scale.setScalar(1.25)):(n.g.position.set(-Ye,Cc,-1.2),n.g.scale.setScalar(1));else if(t){let r=this.unitPos(s);n.g.position.set(r.x,r.y,r.z),n.g.scale.setScalar(1)}else{let r=this.unitFrame(s);n.g.position.set(r.x,r.y,r.z),n.g.rotation.y=r.ry,n.g.scale.setScalar(r.s)}n.airOut.visible=t,n.waterOut.visible=!t}),this.benchBoat&&(this.benchBoat.visible=e),this.benchWater&&(this.benchWater.visible=e),this.table.position.y=t?0:-1.5}setView(e){this.view=e,this.applyView(),e==="bench"?(this.mode==="air"?(this.target.set(-.5,2.05,.5),this.distance=9.6,this.angle=.75,this.elevation=.3):(this.target.set(0,.8,1.4),this.distance=11,this.angle=.95,this.elevation=.3),this.scene.background.set("#d0dcd6"),this.scene.fog.color.set("#d0dcd6")):(this.mode==="air"?this.target.set(0,2.3,-.3):this.target.set(0,.9,this.pondZc),this.distance=Ct(12+this.extent*.5,12,36),this.angle=.8,this.elevation=this.mode==="air"?.46:.42,this.mode==="air"&&this.scenario?.environment==="canyon"&&(this.angle=.25,this.elevation=.4),e==="flow"&&this.mode==="air"&&(this.target.set(0,2.1,-.4),this.angle=.67,this.elevation=.24,this.distance=Math.max(14,this.extent*1.6))),this.mode==="air"&&(this.distance=iu(this,this.distance)),this.mode==="air"&&e==="bench"&&(this.distance=Math.min(this.maxDistance,this.distance*(1+.6*Math.max(0,(this.settings?.diameter||1)-1)))),e==="city"&&(this.target.set(0,4,this.mode==="air"?0:this.pondZc),this.angle=.5,this.elevation=.72,this.distance=145,this.maxDistance=260),this.cameraUser=!1,this.host.dataset&&(this.host.dataset.sceneView=e),this.cameraPosition()}inspectPart(e){if(e==="rotor"){this.setView("bench");return}if(this.setView("flow"),e==="intake"){let t=this.panes.find(n=>n.x>0)||this.panes[0];t&&this.target.set(t.x*.55,1.9,t.zc)}else{let t=this.unitPos(0);this.target.set(t.x+1.02,3.6,t.z)}this.distance=iu(this,Math.max(11,this.extent)),this.cameraPosition()}setFlows(e){this.flows=e}setDoorOpen(e){this.doorOpen=!!e,this.doorTarget=e?-Math.PI*.58:0,this.host?.dispatchEvent?.(new CustomEvent("door-change",{detail:{open:this.doorOpen}}))}advanceDoor(e){this.doorPivot&&(this.doorPivot.rotation.y+=((this.doorTarget||0)-this.doorPivot.rotation.y)*(1-Math.exp(-Math.min(e,.1)*9)),Math.abs(this.doorPivot.rotation.y-(this.doorTarget||0))<.001&&(this.doorPivot.rotation.y=this.doorTarget||0))}pickDoor(e,t){if(this.mode!=="air"||!this.doorPivot||this.view==="bench")return!1;let n=this.renderer.domElement.getBoundingClientRect();this.scene.updateMatrixWorld(!0);let s=new ls;s.setFromCamera(new he((e-n.left)/n.width*2-1,-(t-n.top)/n.height*2+1),this.camera);let r=s.intersectObject(this.shell,!0).find(o=>{for(let a=o.object;a;a=a.parent)if(!a.visible)return!1;return!0});for(let o=r?.object;o;o=o.parent)if(o===this.doorPivot)return this.setDoorOpen(!this.doorOpen),!0;return!1}zoomBy(e){this.cameraUser=!0,this.distance=At.clamp(this.distance*e,4,this.maxDistance||40),this.cameraPosition()}orbitBy(e,t=0){this.cameraUser=!0,this.angle+=e,this.elevation=At.clamp(this.elevation+t,this.minElevation??.05,1.35),this.cameraPosition()}cameraPosition(e=!1){nu(this,0,e||!this._cameraPose)}resize(){let e=this.host.clientWidth,t=this.host.clientHeight;if(e&&t){let n=this.camera.aspect;this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.mode==="air"&&this.settings&&!this.cameraUser&&Math.abs(n-e/t)>.1&&this.setView(this.view)}}bind(){let e=this.renderer.domElement;this.pointers=new Map;let t=null,n=0,s=null,r=!1;e.addEventListener("pointerdown",o=>{this.cameraUser=!0,this.pointers.set(o.pointerId,[o.clientX,o.clientY]),e.setPointerCapture(o.pointerId),t=[o.clientX,o.clientY],n=0,this.pointers.size===1?(s=[o.clientX,o.clientY],r=!1):r=!0}),e.addEventListener("pointermove",o=>{if(this.pointers.has(o.pointerId)){if(this.pointers.set(o.pointerId,[o.clientX,o.clientY]),s&&Math.hypot(o.clientX-s[0],o.clientY-s[1])>5&&(r=!0),this.pointers.size===2){let a=[...this.pointers.values()],c=Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1]);n&&c>0&&(this.distance=At.clamp(this.distance*n/c,4,this.maxDistance||40)),n=c}else t&&(this.angle-=(o.clientX-t[0])*.007,this.elevation=At.clamp(this.elevation+(o.clientY-t[1])*.005,this.minElevation??.05,1.35));t=[o.clientX,o.clientY],this.cameraPosition()}}),e.addEventListener("pointerup",o=>{s&&!r&&this.pointers.size===1&&this.pickDoor(o.clientX,o.clientY)});for(let o of["pointerup","pointercancel","lostpointercapture"])e.addEventListener(o,a=>{this.pointers.delete(a.pointerId),t=null,n=0,s=null});e.addEventListener("wheel",o=>{o.preventDefault(),this.zoomBy(Math.exp(o.deltaY*.001))},{passive:!1}),e.addEventListener("keydown",o=>{["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","-","Home"].includes(o.key)&&(o.preventDefault(),this.cameraUser=!0,o.key==="ArrowLeft"&&(this.angle-=.12),o.key==="ArrowRight"&&(this.angle+=.12),o.key==="ArrowUp"&&(this.elevation=Math.min(1.35,this.elevation+.08)),o.key==="ArrowDown"&&(this.elevation=Math.max(this.minElevation??.05,this.elevation-.08)),o.key==="+"&&(this.distance=Math.max(4,this.distance-1)),o.key==="-"&&(this.distance=Math.min(this.maxDistance||40,this.distance+1)),o.key==="Home"&&this.setView(this.view),this.cameraPosition())})}strike(){let e=(Math.random()-.5)*34,t=(Math.random()-.5)*24,n=new Float32Array(27),s=e,r=t;for(let o=0;o<9;o++)n[o*3]=s,n[o*3+1]=24-o*3,n[o*3+2]=r,s+=(Math.random()-.5)*2.6,r+=(Math.random()-.5)*2.6;this.boltGeo.setAttribute("position",new ft(n,3)),this.boltGeo.attributes.position.needsUpdate=!0,this.flashLight.position.set(e,14,t),this.flashT=.25}applySky(e){if(this.view==="bench"){this.sun.intensity=3,this.hemi.intensity=1.8,this.fill.intensity=.65,this.sun.color.set("#fff1dd"),this.scene.environmentIntensity=.45,this.roomLight.intensity=0;return}let t=this.rainAmt,n=this.haze,s=this._sky||(this._sky=new Ee),r=this._tmp||(this._tmp=new Ee);s.set(this.night?"#162934":"#b6cbd0"),s.lerp(r.set(this.storm?"#485e64":"#8b9fa2"),t*.8),this.storm&&s.lerp(r.set("#2f4543"),.45),s.lerp(r.set("#d6c6a3"),n*.32),e>0&&s.lerp(r.set("#e4efff"),e*.6),this.scene.background.copy(s),this.scene.fog.color.copy(s),this.scene.fog.density=(this.storm?.006:this.night?.0025:.0012)+n*.001+t*.002,this.sun.intensity=this.night?.18:Math.max(.6,3.3-2.3*t-.3*n)*(this.storm?.55:1),this.sun.color.set(this.night?"#94b9da":"#fff1dd").lerp(r.set("#ffe0b3"),n*.35),this.hemi.intensity=this.night?.23:this.storm?.52:.55,this.fill.intensity=this.night?.08:.18,this.scene.environmentIntensity=this.night?.1:this.storm?.4:.8,this.mats.cloud.color.set(this.night?"#2b3c44":this.storm?"#4a5d5a":t>.3?"#7f9188":"#b4c3b3"),this.clouds.visible=!this.night,this.stars.visible=this.night,this.moon.visible=this.night,this.roomLight.intensity=this.mode==="air"?this.night?9:this.storm?3.5:2.2:0,this.siteLamps&&this.siteLamps.forEach(o=>o.intensity=this.night?3:0)}render(e,t,n){if(!this.settings||!t)return;let s=this.settings,r=this.mode==="air",o=this.view==="bench",a=n?e:0;this.time+=a;let c=this.time;nu(this,e),this.advanceDoor(e);let l=t.wind,h=this.rainAmt,u=this.haze,d=!!(t.stopped||s.brake),f=d?0:Mv(l);this.spinW===void 0&&(this.spinW=0),e>0&&(this.spinW+=(f-this.spinW)*(1-Math.exp(-e/(d?.25:.45))));let m=Math.min(this.spinW,e>0?.5/e:cu),_=m*a,g=Math.min(m,e>0?.15/e:cu)*a;this.rotors.forEach(A=>A.rotation.x+=_),this.gears.forEach(A=>A.g.rotation.x+=g*A.sign),this.fans.forEach(A=>A.rotation.z+=_/s.ratio),this.vfans.forEach(A=>A.rotation.y-=_/s.ratio),this.sensors&&this.sensors.cupSpin&&(this.sensors.cupSpin.rotation.y+=yv(l*.8,e)*a);let p=!!t.stopped;this.units.forEach((A,U)=>{let N=U<this.count&&!o&&(s.brake||p);A.brake.visible=N,N&&(A.brake.material=s.brake?this.mats.brake:this.mats.storm)});let M=Math.min(this.storm?.6:.5,l*.022);this.trees.forEach((A,U)=>{A.rotation.z=-(M+(.02+Math.min(.12,l*.008))*Math.sin(c*2.2+U*1.7)),A.rotation.x=.03*Math.sin(c*1.7+U)*(.3+l*.05)});let y=Ct((l-1)/5,0,1);this.sockPivot.rotation.z=-(1-y)*1.35+Math.sin(c*(5+l))*.05*(.3+y),this.clouds.children.forEach(A=>{A.position.x+=a*(.2+l*.12),A.position.x>115&&(A.position.x-=230)});let x=Math.round(h*700);if(this.rain.visible=x>0&&!o,this.rainGeo.setDrawRange(0,x*2),this.rain.material.opacity=.25+.35*h,x>0&&n){let A=this.rainGeo.attributes.position.array;for(let U=0;U<x*6;U+=6)if(A[U]+=e*(l*.25+1.5),A[U+1]-=e*11,A[U+3]=A[U]-.12,A[U+4]=A[U+1]+.42,A[U+1]<-.3){let N=(Math.random()-.5)*34;A[U]=N,A[U+1]=13,A[U+3]=N-.12,A[U+4]=13.42}this.rainGeo.attributes.position.needsUpdate=!0}this.puddles.forEach(A=>{let U=lu(A.userData.th,A.userData.th+.25,h);A.visible=U>.01&&!o,A.scale.setScalar(Math.max(.001,U*A.userData.base))});let S=(this.storm?20:0)+Math.round(Ct((l-8)/10,0,1)*16);this.debris.forEach((A,U)=>{if(A.visible=U<S&&!o,!A.visible)return;let N=A.userData;A.position.x=(N.x0+c*(l*.9+4))%36-18,A.position.y=N.y0+Math.sin(c*3+N.ph)*.35,A.position.z=N.z0+Math.sin(c*.7+N.ph)*.5,A.rotation.x=c*4+N.ph,A.rotation.y=c*2.5+N.ph}),this.storm&&n&&(this.lightT-=e,this.lightT<=0&&(this.strike(),this.lightT=2.5+Math.random()*4)),this.flashT=Math.max(0,this.flashT-e);let E=this.flashT>0?Math.min(1,this.flashT/.25):0;this.flashLight.intensity=E*90,this.bolt.visible=E>.05&&!o,this.applySky(E),eu(this,a),this.hazeMat.opacity=u*.07,this.hazes.forEach((A,U)=>{A.visible=u>.02&&!o,A.position.x=Math.sin(c*.4+U)*2.5,A.scale.y=1+.25*Math.sin(c*1.3+U*2)});let C=Math.round(u*70);if(this.heatPts.visible=C>0&&!o,this.heatGeo.setDrawRange(0,C),C>0){let A=this.heatGeo.attributes.position.array;for(let U=0;U<C;U++){let N=this.heatSeed[U],q=(N[0]+c*.08)%1;A[U*3]=(N[1]-.5)*26+Math.sin(c*.9+U)*.5,A[U*3+1]=.3+q*6,A[U*3+2]=(N[2]-.5)*18}this.heatGeo.attributes.position.needsUpdate=!0}let I=this.flows&&l>0&&!o&&!this.ventilationVFX;if(this.flow.visible=I,I){let A=this.flowGeo.attributes.position.array,U=r?1.2:.9;for(let N=0;N<this.flowN;N++){let q=this.flowSeed[N],O=(q[0]+c*Math.min(l,25)*.03)%1;A[N*3]=-18+O*36,A[N*3+1]=U+q[1]*(r?3.6:2.2),A[N*3+2]=(q[2]-.5)*(r?14:10)}this.flowGeo.attributes.position.needsUpdate=!0}if(!r&&!o&&this.boatGroups.length&&(this.mount==="boat"&&this.stepBoats(e,n?.5+l*.09:0),this.poseBoats(c),this.placeUnits()),!this.ventilationVFX){let A=this.stackGeo.attributes.position.array,U=Ct(t.airflow/700,.2,1),N=Zt+1.5,q=ou+1.5,O=(ou-.4-N)/(q-N);for(let de=0;de<zi*this.stackN;de++){let we=Math.floor(de/this.stackN),G=this.stackSeed[de];if(!r||we>=this.count){A[de*3+1]=-100;continue}let re=this.unitPos(we),oe=(G[0]+c*.5*U)%1,k=oe<O?1-.55*(oe/O):.3+.25*(1-(oe-O)/(1-O)),K=G[1]*Math.PI*2,ge=Math.sqrt(G[2])*k;A[de*3]=re.x+Ye+Math.cos(K)*ge,A[de*3+1]=N+oe*(q-N),A[de*3+2]=re.z+Math.sin(K)*ge}this.stackGeo.attributes.position.needsUpdate=!0,this.stackPts.visible=r&&t.airflow>0&&this.flows&&!o&&!this.ventilationVFX;let ee=Ct((s.backgroundACH-.2)/1.8,0,1),ie=r?Math.max(4,Math.round(s.backgroundACH/2*this.ventN)):0;if(this.vent.visible=ie>0&&this.flows&&!o&&!this.ventilationVFX,this.ventGeo.setDrawRange(0,ie),ie>0){let de=this.ventGeo.attributes.position.array;for(let we=0;we<this.ventN;we++){let G=this.ventSeed[we],re=this.panes[we%this.panes.length],oe=Math.sign(re.x),k=(G[0]+c*(.4+ee)*.6)%1;de[we*3]=re.x+oe*(1.2-k*2.4),de[we*3+1]=re.y+(G[1]-.5)*1.1,de[we*3+2]=re.zc+(G[2]-.5)*re.width*.7}this.ventGeo.attributes.position.needsUpdate=!0}}let w=!r&&!o;this.splash.visible=w&&t.shaft>0;let b=this.splashGeo.attributes.position.array;for(let A=0;A<zi*this.splashN;A++){let U=Math.floor(A/this.splashN),N=A%this.splashN;if(!w||U>=this.count){b[A*3+1]=-100;continue}let q=this.wheelPos(U),O=(c*1.5+N/this.splashN)%1;b[A*3]=q.x+Math.sin(N*7.3)*.5*ki*2,b[A*3+1]=vs+.02+Math.sin(O*Math.PI)*Math.min(.6,t.rpm*.01),b[A*3+2]=q.z+Math.cos(N*2.1)*.45}this.splashGeo.attributes.position.needsUpdate=!0,this.rings.forEach((A,U)=>{let N=Math.floor(U/3),q=U%3,O=w&&N<this.count&&t.shaft>0;if(A.visible=O,!O)return;let ee=this.wheelPos(N),ie=(1+(c*.3+q*.33)%1*1.6)*ki*1.3;A.position.set(ee.x,vs+.02,ee.z),A.scale.set(ie,ie,1)});let L=Math.round(h*this.rainRings.length);this.rainRings.forEach((A,U)=>{if(A.visible=w&&U<L,!A.visible)return;let N=.15+(c*.9+A.userData.seed)%1*1.1;A.scale.set(N,N,1)});let z=Math.round(1+s.oxygenDemand*7),F=t.coverage<100;this.fish.forEach((A,U)=>{if(A.visible=w&&U<z,!A.visible)return;let N=U*1.7,q=A.userData.home;A.position.x=Ct(q.x+Math.sin(c*.25+N)*1.1,-this.pondL/2+.6,this.pondL/2-.6),A.position.z=Ct(q.z+Math.cos(c*.3+N)*.8,Rt+.5,Rt+this.pondW-.5);let O=F?vs-.12:.68;A.position.y+=(O-A.position.y)*Math.min(1,e*2),A.rotation.y=Math.sin(c*.25+N)>0?Math.PI:0}),lp(this.mats.water,c,h,l,this.storm),this.ventilationVFX&&(this.ventilationVFX.update(a,t),this.camera.updateMatrixWorld(),Ep(this)),this.host.dataset.assets=_o.failed.size?"fallback":_o.loaded.size?"ready":"loading",this.host.dataset.graphics!=="lost"&&this.renderer.render(this.scene,this.camera)}}});var Np={};em(Np,{AdvancedScene:()=>pu,COMPONENTS:()=>fu});var Dc,fu,pu,Up=Ft(()=>{hn();Kh();hu();dr();Dc=Math.PI*2,fu={WindRotor:["Spiral wind rotor","Three formed spiral blades capture wind. The rotor turns on a horizontal input shaft; its reported speed is measured independently of the fan."],Frame:["Bearings & mounting frame","Two pillow blocks support the input shaft. A bridge bearing supports the common fan shaft; isolated roof feet carry the structure."],WindClutch:["W \xB7 wind freewheel","Engages when the wind input catches the common shaft. Overruns when motor assistance drives the fan faster, preventing the motor from back-driving the rotor."],InputGear:["90\xB0 bevel transmission","A pair of equal 24-tooth miter gears transfers rotation through 90 degrees at a 1:1 ratio. Input and output axes converge at the pitch apex."],Motor:["DC assist motor","A protected 24 V DC bus supplies a variable motor driver. Assistance follows the speed deficit, available electrical power and battery protection."],Belt:["Belt & pulley transmission","External tangents route a closed belt around 22:34 drive and driven pulleys. Motor RPM is 34/22 times the driven pulley RPM."],MotorClutch:["M \xB7 motor freewheel","The motor pulley engages the common shaft only while providing torque. With adequate wind, the motor and belt stop while the fan continues."],Fan:["Pitched axial exhaust fan","The vertical shaft drives seven pitched blades above the roof penetration. Air rises from the room into a sealed plenum and leaves through the rear discharge duct."],FanHousing:["Sealed shaft sleeve & plenum","A sleeve isolates the rotating shaft from extracted air. The annular plenum cover seals around it; a real side opening connects the rectangular exhaust branch."],Duct:["Exhaust duct & outdoor cowl","A continuous enclosed branch leads from the plenum to the rear roof edge. Flanged joints and a rain cap protect the outdoor discharge."],SolarArray:["180 W sun-tracking photovoltaic module","The module turns and tilts on a fixed roof rack to face the sunlight. Change the sun position to follow the tracker. Output follows irradiance, controller losses and day/night conditions."],Electrical:["Protected DC bus & battery","PV \u2192 charge controller \u2192 protected DC bus / 240 Wh battery \u2192 motor driver. Fuses and a disconnect protect the motor circuit. Low state of charge locks out assistance."],Sensors:["Dual shaft tachometers","Hall sensors monitor the input and common fan shaft separately. Relative speeds, 90/105% hysteresis and 1.5 s verification govern assistance."]},pu=class extends pr{constructor(e){super(e,"air"),this.initializeHybrid()}unitPos(){return{x:0,y:3.7,z:0}}initializeHybrid(){let e=this.host;this.renderer.domElement.setAttribute("aria-label","Advanced solar-assisted hybrid ventilation. Drag to orbit; choose a component to inspect."),this.hybridRoot=new ye,this.hybridRoot.name="Advanced hybrid ventilation",this.scene.add(this.hybridRoot),this.hybridRoot.position.y=3.7,this.parts={},this.explosion=0,this.exploded=!1,this.section=!1,this.energy=!0,this.tour=!1,this.tourTime=0,this.failed=!1,this.cameraUser=!1,this.raycaster=new ls,this.sunHour=10,this.sunDirection=new P,this.setSunPosition(this.sunHour),this.assetReady=new ur().loadAsync("assets/hybrid/hybrid-assembly.glb").then(t=>(this.assembly=t.scene,this.hybridRoot.add(this.assembly),Object.keys(fu).concat(["WindShaft","OutputGear","FanShaft","MotorPulley","FanPulley","SectionGuard","CabinetDoor","SolarYaw","SolarTilt"]).forEach(n=>{let s=this.assembly.getObjectByName(n);s&&(this.parts[n]=s,s.userData.home=s.position.clone())}),this.assembly.traverse(n=>{n.isMesh&&(n.castShadow=n.receiveShadow=!0,n.material=n.material.clone(),n.material.envMapIntensity=.85,n.material.name.includes("Brushed stainless")&&(n.material.normalMap=this.surfaceNormal))}),this.parts.OutputGear&&(this.parts.OutputGear.rotation.y=Math.PI/24),this.host.dataset.hybridAssets="ready",this.setSunPosition(this.sunHour),this.applyHybridView(),this.assembly)).catch(t=>(this.failed=!0,this.host.dataset.hybridAssets="failed",e.dispatchEvent(new CustomEvent("hybrid-error",{detail:t.message})),console.error("Hybrid assembly failed to load:",t),null)),this.bindInspection()}setEnvironment(e,t){super.setEnvironment(e,{...t,units:1,room:150,people:4,diameter:1}),this.hybridRoot&&!this.traces&&this.buildPaths(),this.applyHybridView(),this.sunDirection&&this.setSunPosition(this.sunHour),this.panes.forEach(n=>n.piv.rotation.y=n.sign*.8)}setSunPosition(e){this.sunHour=At.clamp(Number(e)||10,6,18);let t=(this.sunHour-6)/12*Math.PI;this.sunDirection.set(-Math.cos(t),Math.max(.12,Math.sin(t)*1.5),.65).normalize();let n=new P(-2.2,5,2);this.sun.target.position.copy(n),this.scene.add(this.sun.target),this.sun.position.copy(n).addScaledVector(this.sunDirection,24),this.parts?.SolarYaw&&(this.parts.SolarYaw.rotation.y=this.monsoon?0:Math.atan2(this.sunDirection.x,this.sunDirection.z)),this.parts?.SolarTilt&&(this.parts.SolarTilt.rotation.x=this.monsoon?Math.PI/18:Math.acos(this.sunDirection.y))}applyView(){super.applyView(),this.hybridRoot&&this.applyHybridView()}applyHybridView(){this.unitRoot.visible=!1,this.table.visible=!1,this.fx.visible=!1,this.env.visible=!0,this.shell.visible=!0,this.ventilationVFX&&(this.ventilationVFX.root.visible=!1),this.hybridRoof??=new at({color:"#b8b7a8",roughness:.83,normalMap:this.surfaceNormal}),this.hybridWall??=new at({color:"#d7d2bd",roughness:.91,normalMap:this.surfaceNormal}),this.hybridWall.normalScale.set(.13,.13),this.hybridRoof.normalScale.set(.16,.16),this.shell.traverse(n=>{n.isMesh&&n.material===this.mats.shellGlass&&n.name!=="full-roof"&&(n.material=this.hybridWall)});let e=this.shell.getObjectByName("full-roof");e&&(e.material=this.hybridRoof,e.material.side=gt,e.visible=!this.section,e.castShadow=!0);for(let n of["front-wall-left","front-wall-right"]){let s=this.shell.getObjectByName(n);s&&(s.material=this.hybridWall,s.visible=!this.section)}this.parts.SectionGuard&&(this.parts.SectionGuard.visible=!this.section),this.parts.CabinetDoor&&(this.parts.CabinetDoor.visible=!this.section);let t=this.parts.FanHousing;t&&t.traverse(n=>{n.isMesh&&(n.material.clippingPlanes=this.section?[new wn(new P(0,0,-1),0)]:[],n.material.clipShadows=!0)}),this.renderer.localClippingEnabled=!!this.section}setView(e){if(!this.hybridRoot){super.setView(e);return}if(this.view=e,this.applyHybridView(),this.cameraUser=!1,this.tour=!1,this.host.dataset.sceneView=e,this.minElevation=e==="inside"?-1.2:.05,this.camera.fov=e==="inside"?68:38,this.camera.updateProjectionMatrix(),e==="inside"){this.setDoorOpen(!0),this.setSection(!1),this.setExploded(!1),this.interiorEye=new P(this.doorPivot.position.x-.025,1.65,this.roomD/2-1.3),this.angle=.65,this.elevation=.05,this.distance=1,this.cameraPosition(!0);return}this.target.set(0,e==="bench"?4.65:2.6,0),this.angle=.87,this.elevation=e==="flow"?.24:.48,this.scenario?.environment==="canyon"&&(this.angle=.25,this.elevation=.4),this.distance=(e==="bench"?9:17)*Math.max(1,.95/(this.camera.aspect||1)),this.maxDistance=260,e==="city"&&(this.target.set(0,4,0),this.angle=.5,this.elevation=.72,this.distance=145),this.cameraPosition()}cameraPosition(e=!1){super.cameraPosition(e||this.view==="inside")}zoomBy(e){if(this.view!=="inside"){super.zoomBy(e);return}this.cameraUser=!0,this.interiorEye.addScaledVector(new P(-Math.sin(this.angle),0,-Math.cos(this.angle)),(1-e)*3),this.interiorEye.x=At.clamp(this.interiorEye.x,-this.roomW/2+.5,this.roomW/2-.5),this.interiorEye.z=At.clamp(this.interiorEye.z,-this.roomD/2+.5,this.roomD/2-.5),this.cameraPosition(!0)}setSection(e){this.section=e,this.applyHybridView()}setExploded(e){this.exploded=e}setEnergy(e){this.energy=e}setQuality(e){let t=e==="low"||e==="auto"&&this.compactGraphics;this.renderer.setPixelRatio(Math.min(devicePixelRatio,t?1:1.7)),this.renderer.shadowMap.enabled=!t,this.pathLayers?.forEach(n=>n.particles.count=t?6:12),this.traces&&(this.traces.visible=!t||this.flows)}inspectPart(e){e={rotor:"WindRotor",intake:"Fan",exhaust:"Duct"}[e]||e;let n=this.parts[e];if(!n)return;this.view==="inside"&&this.setView("field"),this.selected=e,this.tour=!1,this.cameraUser=!1,this.assembly.traverse(r=>{r.isMesh&&(r.material.emissiveIntensity=0)}),n.traverse(r=>{r.isMesh&&(r.material.emissive.set("#6d7945"),r.material.emissiveIntensity=.17)}),this.hybridRoot.updateMatrixWorld(!0);let s=new Vt().setFromObject(n);s.getCenter(this.target),this.distance=Math.max(4.3,s.getSize(new P).length()*1.65)*Math.max(1,.85/this.camera.aspect),e==="Electrical"&&(this.target.set(4.6,2.65,1.8),this.distance=4.8*Math.max(1,.85/this.camera.aspect)),this.angle=1,this.elevation=.36,this.cameraPosition(),this.host.dispatchEvent(new CustomEvent("hybrid-inspect",{detail:e}))}bindInspection(){let e=this.renderer.domElement,t;e.addEventListener("pointerdown",n=>{t=[n.clientX,n.clientY],this.tour=!1}),e.addEventListener("pointerup",n=>{if(!t||Math.hypot(n.clientX-t[0],n.clientY-t[1])>5||!this.assembly)return;let s=e.getBoundingClientRect();this.raycaster.setFromCamera(new he((n.clientX-s.left)/s.width*2-1,-(n.clientY-s.top)/s.height*2+1),this.camera);let r=this.raycaster.intersectObjects([this.assembly,this.shell],!0).find(c=>{for(let l=c.object;l;l=l.parent)if(!l.visible)return!1;return!0}),o=r?.object;for(;o&&o!==this.doorPivot;)o=o.parent;if(o)return;let a=r?.object;for(;a&&!fu[a.name];)a=a.parent;a&&this.inspectPart(a.name)}),e.addEventListener("wheel",()=>this.tour=!1,{passive:!0}),e.addEventListener("keydown",()=>this.tour=!1)}buildPaths(){this.traces=new ye,this.traces.name="Illustrative hybrid energy and airflow",this.scene.add(this.traces),this.pathLayers=[];let e=(u,d,f)=>{let m=new Jn(d.map(M=>new P(...M)),!1,"centripetal"),_=new ot().setFromPoints(m.getPoints(60)),g=new Hn(_,new Gn({color:f,transparent:!0,opacity:.18,depthWrite:!1}));this.traces.add(g);let p=new Lt(new In(.033,6,4),new Et({color:f,transparent:!0,opacity:.78,depthWrite:!1}),12);p.frustumCulled=!1,this.traces.add(p),this.pathLayers.push({kind:u,curve:m,line:g,particles:p,phase:0})},t=this.panes.find(u=>u.x<0)||{x:-4.47,y:1.8,zc:0};this.intakeAnchor=[t.x,t.y,t.zc];for(let u of[-.16,.16])e("intake",[[t.x-1.3,t.y,t.zc+u],[t.x,t.y,t.zc+u],[-1.5,1.5,t.zc+u],[.5,1.8,.35],[1.02,2.72,0]],"#70cbd2"),e("exhaust",[[1.02+u,2.72,0],[1.02+u,3.45,0],[1.02+u,4.02,0],[1.02+u,4.04,-.75],[1.02+u,4.04,-2.7],[1.02+u,4.04,-3.65]],"#eda866"),e("wind",[[-6,5.1+u,0],[-4.5,5.2+u,.1],[-3.1,5.25+u,.1]],"#d6e8e8");e("pv",[[-2.2,5,2],[-2.2,3.765,2.65],[4.42,3.765,2.65],[4.55,3.25,2.65],[4.51,3.05,1.8]],"#dfc57f"),e("motor",[[4.51,2.85,1.53],[4.6,2.85,1.53],[4.6,3.765,1.53],[4.15,3.765,1.3],[2.18,3.765,.92],[2.18,4.9,.92],[2.45,5.15,.7]],"#dfc57f"),this.particlePose=new Qe;let n=new at({color:"#68736e",metalness:.5,roughness:.6}),s=new ye;s.name="Fitted intake grille",this.shell.add(s);let r=t.width-.16,o=1.34,a=Math.ceil(r/.11);for(let u=0;u<=a;u++)this.box(.025,o,.018,n,s,t.x,t.y,t.zc-r/2+u*r/a);for(let u of[-1,1])this.box(.06,.045,r+.06,n,s,t.x,t.y+u*o/2,t.zc),this.box(.06,o,.045,n,s,t.x,t.y,t.zc+u*r/2);this.box(.17,1.48,1.24,this.hybridWall,this.shell,4.33,2.7,1.8).name="Cabinet structural service panel";let c=[],l=Math.atan2(.7,1.16),h=Math.acos(.12/Math.hypot(1.16,.7));for(let u=0;u<=48;u++){let d=l+h+(Dc-2*h)*u/48;c.push(new P(1.02+.34*Math.cos(d),.95,.34*Math.sin(d)))}for(let u=0;u<=48;u++){let d=l-h+2*h*u/48;c.push(new P(2.18+.22*Math.cos(d),.95,.7+.22*Math.sin(d)))}this.beltCurve=new Js;for(let u=0;u<c.length;u++)this.beltCurve.add(new $s(c[u],c[(u+1)%c.length]));this.beltMarkers=new Lt(new In(.028,6,4),new at({color:"#526357",roughness:.85}),24),this.beltMarkers.name="Synchronized belt surface",this.hybridRoot.add(this.beltMarkers),this.beltPhase=0}updateHybrid(e,t,n){if(!t)return;let s=n?e:0,r=.22,o=t.fanRPM/60*Dc*s*r,a=t.windRPM/60*Dc*s*r,c=t.motorRPM/60*Dc*s*r;for(let u of["WindRotor","WindShaft"])this.parts[u]&&(this.parts[u].rotation.x+=a);for(let u of["WindClutch","InputGear"])this.parts[u]&&(this.parts[u].rotation.x+=o);for(let u of["OutputGear","FanShaft","Fan"])this.parts[u]&&(this.parts[u].rotation.y-=o);this.parts.MotorPulley&&(this.parts.MotorPulley.rotation.y-=c);for(let u of["FanPulley","MotorClutch"])this.parts[u]&&(this.parts[u].rotation.y-=t.motorEngaged?o:0);for(let[u,d]of[["WindClutch",t.windEngaged],["MotorClutch",t.motorEngaged]])this.parts[u]?.traverse(f=>{f.isMesh&&(f.material.emissive.set(d?"#7c5b16":"#000000"),f.material.emissiveIntensity=d?.22:0)});let l=this.reducedMotion?1:1-Math.exp(-e*5);this.explosion+=((this.exploded?1:0)-this.explosion)*l;let h={WindRotor:[-.9,.1,0],WindShaft:[-.35,.1,0],WindClutch:[-.1,.45,0],InputGear:[-.15,.85,0],OutputGear:[.15,.6,0],FanShaft:[0,.25,0],Fan:[0,-.4,0],SectionGuard:[0,1.3,0],Motor:[.65,.2,.3],MotorPulley:[.65,.2,.3],Belt:[.3,.2,.15],MotorClutch:[0,.35,0],FanPulley:[0,.35,0],CabinetDoor:[.65,0,0]};for(let[u,d]of Object.entries(h)){let f=this.parts[u];f&&f.position.copy(f.userData.home).addScaledVector(new P(...d),this.explosion)}this.beltPhase=(this.beltPhase+(t.motorEngaged?o*.34/this.beltCurve.getLength():0))%1,this.beltMarkers.visible=this.explosion<.05;for(let u=0;u<24;u++)this.particlePose.position.copy(this.beltCurve.getPointAt((u/24+this.beltPhase)%1)),this.particlePose.updateMatrix(),this.beltMarkers.setMatrixAt(u,this.particlePose.matrix);this.beltMarkers.instanceMatrix.needsUpdate=!0;for(let u of this.pathLayers){let d=["pv","motor"].includes(u.kind),f=u.kind==="pv"?t.pvW:t.motorW,m=d?this.energy&&f>.1:this.flows&&(u.kind==="wind"?t.windRPM>1:t.fanRPM>2);if(u.line.visible=u.particles.visible=m&&this.explosion<.05,!m)continue;let _=d?.14+f/900:u.kind==="wind"?.12+t.windRPM/2e3:.12+t.fanRPM/1e3;u.phase=(u.phase+s*_)%1;for(let g=0;g<12;g++)this.particlePose.position.copy(u.curve.getPointAt((g/12+u.phase)%1)),this.particlePose.updateMatrix(),u.particles.setMatrixAt(g,this.particlePose.matrix);u.particles.instanceMatrix.needsUpdate=!0}if(this.tour&&!this.cameraUser&&!this.reducedMotion){this.tourTime+=e;let u=Math.floor(this.tourTime/6)%9,f=[[0,2.8,0,15.2,.85,.45],[-1.8,5.2,0,6,.5,.25],[.85,5.1,0,4.5,.9,.32],[2,4.8,.5,4.5,1,.35],[1.02,4,0,5.5,.8,.16],[0,1.7,0,11,.8,.16],[-2.2,4.3,1.8,6,.8,.55],[4.6,2.7,1.8,4.5,1.1,.15],[0,3,0,15.2,1.2,.48]][u];this.target.set(f[0],f[1],f[2]),this.distance=f[3]*Math.max(1,.85/this.camera.aspect),this.angle=f[4]+Math.sin(this.tourTime*.13)*.08,this.elevation=f[5],(u===4||u===5||u===7)&&(this.section||this.setSection(!0))}}render(e,t,n){this.skyDt=e,this.updateHybrid(e,this.hybridSample,n);let s=this.ventilationVFX;this.ventilationVFX=null;let r=this.hybridSample;super.render(e,r?{...t,wind:this.hybridWind??t.wind,shaft:r.windW,airflow:r.airflow,outputRPM:r.fanRPM}:t,n),this.ventilationVFX=s,s&&(s.root.visible=!1)}applySky(e){if(super.applySky(e),!this.hybridRoot)return;let t=!this.night&&!this.monsoon&&(this.irradiance??1e3)>0;this.scene.fog.density=this.monsoon?.005:this.night?.0025:.0012,this.night||(this.scene.background.set(this.monsoon?"#8596a7":"#a4d3f1"),this.hemi.color.set(this.monsoon?"#c9d8e5":"#dcefff"),this.hemi.groundColor.set("#77735a"),this.hemi.intensity=this.monsoon?.52:.55,this.fill.intensity=.18,this.roomLight.intensity=this.monsoon?3:1.7,this.clouds.visible=!!this.monsoon),this.sun.intensity=t?3.6*At.clamp((this.irradiance??1e3)/1e3,0,1.2):0,t&&this.sun.color.set("#fff0cf");let n=this._hybridSky??={color:this.scene.background.clone(),sun:this.sun.intensity,hemi:this.hemi.intensity,room:this.roomLight.intensity},s=this.reducedMotion?1:1-Math.exp(-(this.skyDt||.016)*2);n.color.lerp(this.scene.background,s),this.scene.background.copy(n.color),this.scene.fog.color.copy(n.color),n.sun+=(this.sun.intensity-n.sun)*s,n.hemi+=(this.hemi.intensity-n.hemi)*s,n.room+=(this.roomLight.intensity-n.room)*s,this.sun.intensity=n.sun,this.hemi.intensity=n.hemi,this.roomLight.intensity=n.room}dispose(){this.resizeObserver.disconnect(),this.renderer.dispose(),wc(this.scene),this.renderer.domElement.remove()}}});hu();var Lc=Object.freeze({wind:4.5,irradiance:1e3,soc:72,targetRPM:240,speed:1,sunHour:10,weather:"sunny",night:!1,fault:!1,control:"auto",quality:"auto",pvWatts:180,batteryWh:240,motorMaxW:95,motorEfficiency:.78,controllerEfficiency:.94,transmissionEfficiency:.84,fanRatedW:60,ratedFlow:850,assistOn:.9,assistOff:1.05,verifySeconds:1.5,lowSOC:12,recoverSOC:20,maxChargeW:75}),yo=(i,e,t)=>Math.min(t,Math.max(e,i));function uu(i={}){let e={...Lc,...i};return{soc:e.soc,fanRPM:0,windRPM:0,motorRPM:0,assist:!1,lowBattery:e.soc<=e.lowSOC,verify:0,state:"STARTING",time:0}}function du(i,e,t){let n={...Lc,...e};t=yo(Number.isFinite(t)?t:0,0,1),i.time+=t;let s=yo(n.wind,0,60),r=yo(n.targetRPM,80,500),o=n.weather==="monsoon",a=o||n.control==="wind-only",c=Math.min(360,.5*1.225*3.46*.23*s**3)*n.transmissionEfficiency,l=240*Math.cbrt(c/n.fanRatedW),h=s<.1?0:s*65,u=Math.min(h,l);i.soc<=n.lowSOC&&(i.lowBattery=!0),i.soc>=n.recoverSOC&&(i.lowBattery=!1);let d=!!n.fault||i.lowBattery,f=i.assist?u<r*n.assistOff:u<r*n.assistOn;f!==i.assist?(i.verify+=t,i.verify>=n.verifySeconds&&(i.assist=f,i.verify=0)):i.verify=0,a&&(i.assist=!1,i.verify=0);let m=n.night||o?0:n.pvWatts*yo(n.irradiance/1e3,0,1.2)*n.controllerEfficiency,_=n.fanRatedW*(r/240)**3,g=h>Math.max(i.fanRPM*.98,1)&&c>0,p=g?Math.min(c,_):0,M=m+(i.soc>n.lowSOC?120:0),y=i.assist&&!d?Math.min(n.motorMaxW,M,Math.max(0,_-p)/n.motorEfficiency):0,x=p+y*n.motorEfficiency,S=y>0?Math.min(r,240*Math.cbrt(x/n.fanRatedW)):u,E=1-Math.exp(-t/1.15);i.fanRPM+=(S-i.fanRPM)*E,i.windEngaged=g,i.motorEngaged=y>.05,i.windRPM=g?i.fanRPM:h,i.motorRPM=i.motorEngaged?i.fanRPM*(.34/.22):0;let C=y>m?-(y-m):i.soc>=99.99?0:Math.min(n.maxChargeW,(m-y)*.95);return i.soc=yo(i.soc+C*t/3600/n.batteryWh*100,0,100),i.pvW=m,i.motorW=y,i.batteryW=C,i.curtailedW=Math.max(0,m-y-Math.max(0,C)/.95),i.windW=c,i.windContribution=p,i.targetRPM=r,i.airflow=n.ratedFlow*i.fanRPM/240,i.batteryV=22.4+3.6*i.soc/100,i.belowTarget=i.fanRPM<r*.9,i.state=a?s>.1?"WIND":"IDLE":d?"PROTECTED":y>0?p>.1?"HYBRID":"ELECTRIC":u>=r*n.assistOn?"WIND":i.assist?"LIMITED":"VERIFYING",i.warning=a?"":n.fault?"Protection fault \xB7 motor inhibited":i.lowBattery?"Low battery \xB7 motor locked until 20% charge":i.state==="LIMITED"?"Insufficient electrical power \xB7 airflow below target":"",i}var Nc={WindRotor:["Spiral wind rotor","Three curved blades capture wind and drive the horizontal input shaft."],Frame:["Bearings & support frame","Pillow blocks, a vertical bridge bearing and vibration-isolated roof mounts support both axes."],WindClutch:["W \xB7 wind freewheel","Connects the wind input when it catches the common shaft; overruns during faster motor drive."],InputGear:["90\xB0 bevel gears","Equal miter gears couple the horizontal and vertical axes at a 1:1 ratio."],Motor:["DC assist motor","A PWM driver requests only the power needed and available on the protected 24 V bus."],Belt:["Belt & pulleys","The 22:34 pulley radii set motor speed to 1.545 times the common shaft speed."],MotorClutch:["M \xB7 motor freewheel","Isolates the stationary motor transmission during adequate wind."],Fan:["Pitched axial fan","A vertical shaft extracts indoor air through the roof opening into the sealed plenum."],FanHousing:["Shaft sleeve & plenum","The sealed sleeve isolates the rotating shaft from air. Section view reveals the fan and chamber."],Duct:["Exhaust duct & cowl","A connected rectangular branch carries air out past the rear roof edge."],SolarArray:["Sun-tracking photovoltaic array","A fixed roof rack supports a module that turns and tilts toward the sun. Change Sun position to see it follow the light. Estimated output follows irradiance and controller losses."],Electrical:["Battery & controller","A 240 Wh concept battery charges from surplus PV. Fuses, a disconnect and a driver protect the DC bus."],Sensors:["Shaft tachometers","Independent input and fan speeds govern assistance with hysteresis and timed verification."]},vo=(i,e,t,n,s,r,o)=>`<label class="hy-range"><span>${e}<output data-hy-out="${i}">${r} ${o}</output></span><input type="range" data-hy-param="${i}" aria-label="${e}" min="${t}" max="${n}" step="${s}" value="${r}"></label>`,ri=(i,e,t=!1)=>`<button type="button" data-hy-action="${i}" aria-pressed="${t}">${e}</button>`,Fp=(i,e=0)=>Number(i||0).toLocaleString("en-US",{maximumFractionDigits:e,minimumFractionDigits:e});function Op(i,{recompute:e,toggleFit:t,setSceneView:n}){let s=i.root,r=s.querySelector(".viewport"),o=s.querySelector(".sim-layout"),a=s.querySelector(".controls");i.ventilationMode="basic";let c=i.hybrid={p:{...Lc},sample:uu(),scene:null,loading:!1,selected:null},l=document.createElement("div");l.className="vent-mode-selector",l.setAttribute("role","group"),l.setAttribute("aria-label","Ventilation mode"),l.innerHTML='<button data-vent-mode="basic" aria-pressed="true"><i>01</i><span><strong>Basic Mode</strong><small>Wind-Driven Ventilation</small></span><b>WIND</b></button><button data-vent-mode="advanced" aria-pressed="false"><i>02</i><span><strong>Advanced Mode</strong><small>Solar-Assisted Hybrid Ventilation</small></span><b>WIND + SOLAR</b></button>',s.querySelector(".window").prepend(l);let h=document.createElement("aside");h.className="hy-controls",h.hidden=!0,h.innerHTML=`<div class="hy-eyebrow">ADVANCED SYSTEM <span>24 V DC</span></div><h2>Energy in balance.</h2><p class="hy-intro">Wind first. Assistance when needed.</p>
    <label class="hy-select">Scenario<select data-hy-select="weather"><option value="sunny">Sunny \xB7 solar + wind</option><option value="canyon">Urban canyon \xB7 sheltered wind + solar</option><option value="monsoon">Monsoon \xB7 wind only</option></select></label>
    <div class="hy-presets" role="group" aria-label="Operating demonstrations"><button data-hy-preset="wind">Adequate wind</button><button data-hy-preset="hybrid">Weak wind</button><button data-hy-preset="electric">No wind</button><button data-hy-preset="protected">Low battery</button></div>
    <div class="hy-section-label">ENVIRONMENT</div>
    ${vo("wind","Wind speed",0,20,.1,c.p.wind,"m/s")}${vo("irradiance","Solar irradiance",0,1200,10,c.p.irradiance,"W/m\xB2")}${vo("sunHour","Sun position",6,18,.25,c.p.sunHour,"h")}${vo("soc","Set battery charge",0,100,1,c.p.soc,"%")}${vo("targetRPM","Target fan speed",80,500,10,c.p.targetRPM,"RPM")}
    <label class="hy-select">Control policy<select data-hy-select="control"><option value="auto">Automatic assistance</option><option value="wind-only">Wind only \xB7 motor inhibited</option></select></label>
    <div class="hy-inline-toggles">${ri("night","Night")}${ri("fault","Inject fault")}</div>
    <div class="hy-section-label">PRESENTATION</div>
    <label class="hy-select">Animation & simulation speed<select data-hy-select="speed"><option value=".5">0.5\xD7</option><option value="1" selected>1\xD7 \xB7 real time</option><option value="2">2\xD7</option><option value="5">5\xD7</option></select></label>
    <label class="hy-select">Render quality<select data-hy-select="quality"><option value="auto">Adaptive</option><option value="high">High \xB7 soft shadows</option><option value="low">Low \xB7 reduced resolution</option></select></label>
    <div class="hy-section-label">COMPONENT INSPECTION</div>
    <label class="hy-select"><span class="sr-only">Select component</span><select data-hy-component><option value="">Choose a component\u2026</option>${Object.entries(Nc).map(([y,[x]])=>`<option value="${y}">${x}</option>`).join("")}</select></label>
    <div class="hy-inspection" aria-live="polite"><small>ENGINEERING NOTES</small><h3 data-hy-part-name>One connected system.</h3><p data-hy-part-text>Select a component in the scene or the list to focus the camera and explore its function.</p></div>
    <p class="hy-note">Concept demonstration. RPM, power and airflow are estimates, not certified performance. Flow paths are illustrative. Rotation displayed at 0.22\xD7 to reduce aliasing.</p>`,o.insertBefore(h,a);let u=document.createElement("div");u.className="hy-overlay",u.hidden=!0,u.innerHTML=`<p class="hy-asset-error" data-hy-assets role="status" hidden></p>
    <label class="hy-viewport-scenario"><span class="sr-only">Advanced scenario</span><select data-hy-select="weather" aria-label="Advanced scenario"><option value="sunny">\u2600 Sunny \xB7 solar + wind</option><option value="canyon">\u224B Urban canyon</option><option value="monsoon">\u2602 Monsoon \xB7 wind only</option></select></label>
    <div class="hy-toolbar" role="group" aria-label="Advanced scene controls">${ri("pause",i.running?"Pause":"Play",!i.running)}${ri("section","Section")}${ri("exploded","Explode")}${ri("airflow","Airflow",!0)}${ri("energy","Energy",!0)}${ri("tour","Tour")}<button data-hy-action="home">Reset camera</button><button data-hy-action="fit">\u26F6 Full screen</button></div>
    <div class="hy-room-controls" role="group" aria-label="Room access">${ri("door","Open door")}${ri("inside","Enter room")}<button data-hy-action="city">City view</button></div>`,r.append(u),r.addEventListener("hybrid-inspect",y=>f(y.detail)),r.addEventListener("door-change",()=>c.render?.());function d(y){let x=u.querySelector("[data-hy-assets]");x.textContent=y,x.hidden=!1}r.addEventListener("hybrid-error",()=>d("Assembly unavailable \xB7 check assets/hybrid or run npm run assets:hybrid"));function f(y){Nc[y]&&(c.selected=y,h.querySelector("[data-hy-component]").value=y,h.querySelector("[data-hy-part-name]").textContent=Nc[y][0],h.querySelector("[data-hy-part-text]").textContent=Nc[y][1])}async function m(y){if(y===i.ventilationMode)return;i.basicScene||(i.basicScene=i.scene),i.ventilationMode=y,s.dataset.ventilation=y,l.querySelectorAll("button").forEach(S=>S.setAttribute("aria-pressed",S.dataset.ventMode===y));let x=y==="advanced";if(a.hidden=x,h.hidden=!x,u.hidden=!x,i.basicScene?.renderer&&(i.basicScene.renderer.domElement.hidden=x),x){if(!c.scene&&!c.loading){c.loading=!0;try{let{AdvancedScene:S}=await Promise.resolve().then(()=>(Up(),Np));c.scene=new S(r),g(),c.scene.setSunPosition(c.p.sunHour),c.scene.setHardware(i.hw,i.p),c.scene.setView("field"),c.scene.setQuality(c.p.quality),c.scene.setFlows(c.airflow??!0),c.scene.setEnergy(c.energy??!0),c.scene.setSection(!!c.section),c.scene.setExploded(!!c.exploded),await c.scene.assetReady,c.scene.failed&&d("Assembly failed to load")}catch(S){d("3D unavailable \xB7 controls and energy model remain active"),console.error(S)}finally{c.loading=!1}}i.ventilationMode==="advanced"&&c.scene?(i.scene=c.scene,c.scene.renderer.domElement.hidden=!1,c.scene.resize()):c.scene&&(c.scene.renderer.domElement.hidden=!0)}else c.scene&&(c.scene.tour=!1,c.scene.renderer.domElement.hidden=!0),i.scene=i.basicScene,i.scene?.resize();c.render()}l.querySelectorAll("button").forEach(y=>y.addEventListener("click",()=>m(y.dataset.ventMode))),h.querySelectorAll("[data-hy-param]").forEach(y=>y.addEventListener("input",()=>{let x=y.dataset.hyParam;c.p[x]=Number(y.value);let S={wind:"m/s",irradiance:"W/m\xB2",soc:"%",targetRPM:"RPM"}[x];h.querySelector(`[data-hy-out="${x}"]`).textContent=x==="sunHour"?p():Fp(c.p[x],x==="wind"?1:0)+" "+S,x==="sunHour"&&c.scene?.setSunPosition(c.p.sunHour),x==="irradiance"&&c.scene&&(c.scene.irradiance=c.p.irradiance),x==="soc"&&(c.sample.soc=c.p.soc,c.sample.lowBattery=c.p.soc<=c.p.lowSOC),c.render()})),[...h.querySelectorAll("[data-hy-select]"),...u.querySelectorAll("[data-hy-select]")].forEach(y=>y.addEventListener("change",()=>{let x=y.dataset.hySelect;if(c.p[x]=x==="speed"?Number(y.value):y.value,x==="quality"&&c.scene?.setQuality(y.value),x==="weather"){if(s.querySelectorAll('[data-hy-select="weather"]').forEach(S=>S.value=c.p.weather),c.p.weather==="canyon"){c.p.wind=2.8;let S=h.querySelector('[data-hy-param="wind"]');S.value=c.p.wind,S.dispatchEvent(new Event("input"))}c.p.night=!1,h.querySelector('[data-hy-action="night"]').setAttribute("aria-pressed",!1),g(),c.tick(0,!1),c.render()}})),h.querySelector("[data-hy-component]").addEventListener("change",y=>{f(y.target.value),c.scene?.inspectPart(y.target.value)});let _={wind:{wind:6,irradiance:850,soc:72,fault:!1,night:!1},hybrid:{wind:4,irradiance:400,soc:65,fault:!1,night:!1},electric:{wind:0,irradiance:700,soc:65,fault:!1,night:!1},protected:{wind:2,irradiance:150,soc:8,fault:!1,night:!1}};h.querySelectorAll("[data-hy-preset]").forEach(y=>y.addEventListener("click",()=>{Object.assign(c.p,_[y.dataset.hyPreset],{control:"auto"}),c.sample=uu(c.p),h.querySelector('[data-hy-select="control"]').value="auto",h.querySelectorAll("[data-hy-param]").forEach(x=>{x.value=c.p[x.dataset.hyParam],x.dispatchEvent(new Event("input"))});for(let x of["night","fault"])h.querySelector(`[data-hy-action="${x}"]`).setAttribute("aria-pressed",c.p[x]);g(),c.render()}));function g(){let y=c.p.weather==="monsoon";c.scene?.setEnvironment({...i.scenario,weather:y?"rain":c.p.night?"night":"clear",environment:c.p.weather==="canyon"?"canyon":"park"},{...i.p,wind:c.p.wind,rain:y?.85:0,ambient:y?26:29}),c.scene&&(c.scene.monsoon=y,c.scene.irradiance=y?0:c.p.irradiance,c.scene.setSunPosition(c.p.sunHour));for(let x of["irradiance","sunHour"])h.querySelector(`[data-hy-param="${x}"]`).disabled=y;h.querySelector('[data-hy-select="control"]').disabled=y,h.querySelector('[data-hy-select="control"]').value=y?"wind-only":c.p.control,h.querySelector('[data-hy-out="irradiance"]').textContent=Fp(y?0:c.p.irradiance)+" W/m\xB2",h.querySelector('[data-hy-action="night"]').disabled=y,c.scene?.panes.forEach(x=>x.piv.rotation.y=x.sign*.8)}function p(){let y=Math.round(c.p.sunHour*60);return`${String(Math.floor(y/60)).padStart(2,"0")}:${String(y%60).padStart(2,"0")}`}function M(y){let x=y.dataset.hyAction;if(x==="pause"){i.running=!i.running,y.textContent=i.running?"Pause":"Play",y.setAttribute("aria-pressed",!i.running);return}if(x==="home"){c.scene&&(c.scene.tour=!1,c.scene.setView("field")),c.render();return}if(x==="city"){c.scene?.setView("city"),c.render();return}if(x==="fit"){t(i);return}if(x==="door"){c.scene&&c.scene.setDoorOpen(!c.scene.doorOpen),c.render();return}if(x==="inside"){c.scene&&(c.scene.view==="inside"&&c.scene.setDoorOpen(!0),c.scene.setView(c.scene.view==="inside"?"field":"inside")),c.render();return}let S=y.getAttribute("aria-pressed")!=="true";y.setAttribute("aria-pressed",S),x==="night"||x==="fault"?(c.p[x]=S,x==="night"&&g()):c[x]=S,x==="section"&&c.scene?.setSection(S),x==="exploded"&&c.scene?.setExploded(S),x==="airflow"&&c.scene?.setFlows(S),x==="energy"&&c.scene?.setEnergy(S),x==="tour"&&c.scene&&(S&&c.scene.view==="inside"&&c.scene.setView("field"),c.scene.tour=S,c.scene.tourTime=0,c.scene.cameraUser=!1),c.render()}return[...h.querySelectorAll("[data-hy-action]"),...u.querySelectorAll("[data-hy-action]")].forEach(y=>y.addEventListener("click",()=>M(y))),c.choose=m,c.applyEnvironment=g,c.tick=(y,x)=>{if(i.ventilationMode!=="advanced")return;let S=x?y*c.p.speed:0;S&&!c.p.night&&c.p.weather!=="monsoon"&&(c.p.sunHour=6+(c.p.sunHour-6+S*12/300)%12,h.querySelector('[data-hy-param="sunHour"]').value=c.p.sunHour,h.querySelector('[data-hy-out="sunHour"]').textContent=p(),c.scene?.setSunPosition(c.p.sunHour));let E=S;for(E||du(c.sample,c.p,0);E>1e-8;){let C=Math.min(E,.025);du(c.sample,c.p,C),E-=C}c.scene&&(c.scene.hybridSample=c.sample,c.scene.hybridWind=c.p.wind,c.scene.irradiance=c.p.weather==="monsoon"?0:c.p.irradiance)},c.render=()=>{let y=u.querySelector('[data-hy-action="tour"]');if(c.scene&&y.setAttribute("aria-pressed",c.scene.tour),c.scene&&u.querySelector('[data-hy-action="section"]').setAttribute("aria-pressed",c.scene.section),c.scene){let x=c.scene.view==="inside",S=u.querySelector('[data-hy-action="door"]'),E=u.querySelector('[data-hy-action="inside"]');S.setAttribute("aria-pressed",!!c.scene.doorOpen),S.textContent=c.scene.doorOpen?"Close door":"Open door",E.setAttribute("aria-pressed",x),E.textContent=x?"Leave room":"Enter room",u.querySelector('[data-hy-action="exploded"]').setAttribute("aria-pressed",c.scene.exploded)}},h.querySelector('[data-hy-out="sunHour"]').textContent=p(),c.render(),c}var un=window.WindModel,ut=(i,e=document)=>e.querySelector(i),Ht=(i,e=document)=>[...e.querySelectorAll(i)],bo={air:[{id:"breeze",name:"Rooftop breeze",glyph:"\u2600",weather:"clear",environment:"roof",p:{wind:4.5,profile:"steady",people:8,room:150,rain:0,ambient:32}},{id:"canyon",name:"Urban canyon",glyph:"\u224B",weather:"clear",environment:"canyon",p:{wind:2.8,profile:"lull",people:12,room:150,rain:0,ambient:34}},{id:"heat",name:"Heatwave",glyph:"\u2668",weather:"heat",environment:"roof",p:{wind:2.3,profile:"gusts",people:18,room:150,rain:0,ambient:46}},{id:"rain",name:"Monsoon",glyph:"\u2602",weather:"rain",environment:"roof",p:{wind:7,profile:"gusts",people:10,room:150,rain:.8,ambient:30}},{id:"storm",name:"Cyclone",glyph:"\u03DF",weather:"storm",environment:"roof",p:{wind:19,profile:"storm",people:8,room:150,rain:1,ambient:28}}],water:[{id:"breeze",name:"Park breeze",glyph:"\u2600",weather:"clear",environment:"park",p:{wind:4.5,profile:"steady",pond:100,temp:25,oxygenDemand:.25,rain:0,ambient:30}},{id:"lull",name:"Sheltered lull",glyph:"\u224B",weather:"clear",environment:"canyon",p:{wind:2.8,profile:"lull",pond:100,temp:28,oxygenDemand:.35,rain:0,ambient:33}},{id:"night",name:"Hot night",glyph:"\u263E",weather:"night",environment:"park",p:{wind:2.2,profile:"gusts",pond:100,temp:30,oxygenDemand:.55,rain:0,ambient:31}},{id:"rain",name:"Monsoon",glyph:"\u2602",weather:"rain",environment:"park",p:{wind:7,profile:"gusts",pond:150,temp:26,oxygenDemand:.4,rain:.8,ambient:29}},{id:"storm",name:"Storm surge",glyph:"\u03DF",weather:"storm",environment:"park",p:{wind:19,profile:"storm",pond:180,temp:27,oxygenDemand:.35,rain:1,ambient:27}}]},Oc={wind:["Wind speed",0,60,.1,"m/s"],diameter:["Rotor diameter",.3,2,.1,"m"],units:["Installed units",1,10,1,""],ratio:["Gear reduction",1,5,.5,": 1"],ambient:["Air temperature",10,55,1,"\xB0C"],rain:["Rain intensity",0,1,.1,""],room:["Room volume",30,500,10,"m\xB3"],people:["Occupants",0,30,1,""],backgroundACH:["Background ventilation",.2,2,.1,"ACH"],pressure:["Duct pressure",5,80,1,"Pa"],pond:["Pond volume",20,500,10,"m\xB3"],temp:["Water temperature",10,30,.5,"\xB0C"],oxygenDemand:["Oxygen demand",0,1,.05,"mg/L/h"]},zc={units:["ZeroWatt units on the roof",1,10],boats:["Boats on the pond",1,6],upb:["ZeroWatt units per boat",1,2]},Cv=[["boat","Pontoon boats \xB7 moving"],["anchored","Pontoon boats \xB7 moored"]],zp=[["steady","Steady wind"],["gusts","Gusts"],["lull","Repeating lull"],["storm","Storm gusts"]],kp=["windSensor","qualitySensor","envSensor","mcu","enclosure"],Iv=i=>({windSensor:un.hardware.windSensor,qualitySensor:i==="air"?un.hardware.qualityAir:un.hardware.qualityWater,envSensor:i==="air"?un.hardware.envAir:un.hardware.envWater,mcu:un.hardware.mcu,enclosure:un.hardware.enclosure}),Vp=i=>({windSensor:"Wind sensor",qualitySensor:i==="air"?"CO\u2082 sensor":"Dissolved-oxygen probe",envSensor:i==="air"?"Rain sensor":"Water-temperature probe",mcu:"Microcontroller",enclosure:"Electronics enclosure"}),Pv=i=>({windSensor:"ultra",qualitySensor:i==="air"?"ndir_duct":"do_opt",envSensor:i==="air"?"rain_opt":"ds18",mcu:"stm32",enclosure:"ip67"}),Lv=matchMedia("(prefers-reduced-motion: reduce)").matches,vn={},So="air",Bp=0,mu=0,Gp=(i,e=1)=>Number(i).toLocaleString("en-US",{minimumFractionDigits:e,maximumFractionDigits:e}),Hp=i=>i<1?i<.1?2:1:0;function Mo(i,e,t){let[n,s,r,o,a]=Oc[e],c=Hp(o);return'<label class="control" for="'+i+"-"+e+'"><span class="control-label"><span>'+n+'</span><output data-output="'+e+'">'+Gp(t[e],c)+" <small>"+a+'</small></output></span><input type="range" id="'+i+"-"+e+'" data-param="'+e+'" min="'+s+'" max="'+r+'" step="'+o+'" value="'+t[e]+'"><span class="range-limits"><span>'+s+"</span><span>"+r+" "+a+"</span></span></label>"}function gu(i,e){let[t]=zc[i];return'<div class="stepper"><span class="stepper-label">'+t+'</span><div class="stepper-ctl"><button type="button" data-dec="'+i+'" aria-label="Fewer '+t.toLowerCase()+'">\u2212</button><output data-step-out="'+i+'">'+e[i]+'</output><button type="button" data-inc="'+i+'" aria-label="More '+t.toLowerCase()+'">+</button></div></div>'}function Dv(i,e){let t=Iv(i)[e];return'<label class="dd"><span>'+Vp(i)[e]+'</span><select data-hw="'+e+'">'+t.map(n=>'<option value="'+n.id+'">'+n.name+"</option>").join("")+"</select></label>"}function Nv(i){let e=bo[i][0],t=vn[i]={mode:i,scenario:e,p:{...un.defaults,...e.p},t:0,running:!Lv,flows:!0,view:"field",doorOpen:!1,scene:null,hw:null,current:null},n=t.root=ut("#"+i+"-face"),s=i==="air";return n.innerHTML='<section class="window"><div class="scenario-strip"><div class="strip-head"><span>TEST CASE</span><span>'+(s?"Choose the weather the building roof is tested in":"Choose the weather the pond is tested in")+'</span></div><div class="scenario-list" role="group" aria-label="Environments">'+bo[i].map((r,o)=>'<button class="scenario-card '+(o===0?"selected ":"")+(o===4?"danger":"")+'" data-scenario="'+r.id+'" aria-pressed="'+(o===0)+'"><span class="scenario-glyph" aria-hidden="true">'+r.glyph+"</span><span><small>CASE 0"+(o+1)+"</small><strong>"+r.name+"</strong></span></button>").join("")+'</div></div><div class="sim-layout"><aside class="controls"><div class="control-title">INSTALLATION</div>'+(s?gu("units",t.p):'<label class="dd"><span>Mounting</span><select data-param-select="mount">'+Cv.map(([r,o])=>'<option value="'+r+'">'+o+"</option>").join("")+"</select></label>"+gu("boats",t.p)+gu("upb",t.p))+'<div class="install-total" data-total></div><div class="controls-divider"></div><div class="control-title">CONDITIONS <button class="reset" data-reset>\u21BA Reset</button></div>'+Mo(i,"wind",t.p)+'<label class="dd"><span>Wind pattern</span><select data-param-select="profile">'+zp.map(([r,o])=>'<option value="'+r+'">'+o+"</option>").join("")+"</select></label>"+Mo(i,"ambient",t.p)+Mo(i,"rain",t.p)+'<div class="controls-divider"></div><div class="control-title">THE PROTOTYPE</div>'+["diameter","ratio"].map(r=>Mo(i,r,t.p)).join("")+'<label class="switch-control" for="'+i+'-brake">Manual shaft brake<input id="'+i+'-brake" data-toggle="brake" type="checkbox"></label><div class="controls-divider"></div><div class="control-title">'+(s?"THE BUILDING":"THE POND")+"</div>"+(s?["room","people","backgroundACH","pressure"]:["pond","temp","oxygenDemand"]).map(r=>Mo(i,r,t.p)).join("")+'<div class="controls-divider"></div><div class="control-title">SENSORS &amp; MICROCONTROLLER</div>'+kp.map(r=>Dv(i,r)).join("")+'<button class="suggest" data-suggest>Pick rugged parts for this case</button><div class="hw-status" data-hwstatus></div></aside><div class="scene-area"><div class="viewport"><div class="loading">ASSEMBLING\u2026</div><div class="vp-left"><select data-scenario-select aria-label="Environment">'+bo[i].map(r=>'<option value="'+r.id+'">'+r.glyph+"  "+r.name+"</option>").join("")+'</select></div><div class="vp-tools"><button data-tool="pause" aria-pressed="'+!t.running+'" aria-label="'+(t.running?"Pause":"Play")+'">'+(t.running?"Pause":"Play")+'</button><button data-tool="flows" aria-pressed="true">Flow</button>'+(s?'<button data-tool="flow-view" aria-pressed="false" title="Inspect intake and exhaust paths inside the building">Air paths</button>':"")+'<button data-tool="view" aria-pressed="false">Close-up</button><button data-tool="fit" aria-pressed="false" title="Fit the simulation to the whole screen (Esc to exit)">\u26F6 Fit to screen</button></div>'+(s?'<div class="scene-heading"><span>BUILDING VENTILATION</span><strong>Wind in. Fresh air out.</strong></div><div class="scene-annotations" aria-label="Inspect the ventilation system"><button class="scene-callout rotor-callout" data-scene-anchor="rotor" data-inspect="rotor" title="Inspect the spiral rotor and mechanical drive"><i>01</i> Wind capture</button><button class="scene-callout intake-callout" data-scene-anchor="intake" data-inspect="intake" title="Inspect fresh air entering the room"><i>02</i> Fresh-air intake</button><button class="scene-callout exhaust-callout" data-scene-anchor="exhaust" data-inspect="exhaust" title="Inspect warm air leaving through the fan"><i>03</i> Exhaust</button></div><div class="flow-key" aria-label="Airflow visualization legend"><span><i class="intake-dot"></i>Incoming air</span><span><i class="exhaust-dot"></i>Exhaust air</span><span><i class="drive-dot"></i>Mechanical transfer</span><small>Illustrative paths \xB7 driven by live model values</small></div>':"")+'<div class="scene-caption"><span>WIND \u2192 ROTOR \u2192 TRANSMISSION \u2192 '+(s?"VENTILATION":"AERATION")+'</span><span>Drag to orbit \xB7 Scroll to zoom</span></div><div class="vp-navigation"><div class="vp-camera">'+(s?'<button data-tool="door" aria-pressed="false">Open door</button>':"")+'<button data-tool="zoom-out" aria-label="Zoom out" title="Zoom out">\u2212</button><button data-tool="zoom-in" aria-label="Zoom in" title="Zoom in">+</button><button data-tool="city">City view</button><button data-tool="home" aria-label="Reset camera">Reset view</button></div></div></div></div></div></section>',Uv(t),oi(t),t}function Uv(i){let e=i.root;ut(".viewport",e).addEventListener("door-change",t=>{if(i.ventilationMode==="advanced")return;i.doorOpen=t.detail.open;let n=ut('[data-tool="door"]',e);n&&(n.setAttribute("aria-pressed",i.doorOpen),n.textContent=i.doorOpen?"Close door":"Open door")}),Ht("[data-scenario]",e).forEach(t=>t.addEventListener("click",()=>Fc(i,t.dataset.scenario))),ut("[data-scenario-select]",e).addEventListener("change",t=>Fc(i,t.target.value)),Ht("[data-param]",e).forEach(t=>t.addEventListener("input",()=>{i.p[t.dataset.param]=Number(t.value),oi(i)})),Ht("[data-param-select]",e).forEach(t=>t.addEventListener("change",()=>{i.p[t.dataset.paramSelect]=t.value,t.dataset.paramSelect==="profile"&&(i.t=0),oi(i)})),Ht("[data-dec],[data-inc]",e).forEach(t=>t.addEventListener("click",()=>{let n=t.dataset.dec||t.dataset.inc,[,s,r]=zc[n];i.p[n]=Math.min(r,Math.max(s,Math.round(i.p[n])+(t.dataset.inc?1:-1))),oi(i)})),Ht("[data-toggle]",e).forEach(t=>t.addEventListener("change",()=>{i.p[t.dataset.toggle]=t.checked,oi(i)})),Ht("[data-hw]",e).forEach(t=>t.addEventListener("change",()=>{i.p[t.dataset.hw]=t.value,oi(i)})),ut("[data-suggest]",e).addEventListener("click",()=>{Object.assign(i.p,Pv(i.mode)),oi(i)}),ut("[data-reset]",e).addEventListener("click",()=>Fc(i,i.scenario.id)),Ht("[data-tool]",e).forEach(t=>t.addEventListener("click",()=>{let n=t.dataset.tool;n==="pause"&&(i.running=!i.running,t.setAttribute("aria-pressed",!i.running),t.textContent=i.running?"Pause":"Play",t.setAttribute("aria-label",i.running?"Pause":"Play")),n==="flows"&&(i.flows=!i.flows,i.scene?.setFlows(i.flows),t.setAttribute("aria-pressed",i.flows),ut(".viewport",e).dataset.flows=i.flows?"on":"off"),n==="view"&&mr(i,i.view==="bench"?"field":"bench"),n==="flow-view"&&mr(i,i.view==="flow"?"field":"flow"),n==="door"&&(i.doorOpen=!i.doorOpen,i.scene?.setDoorOpen(i.doorOpen),t.setAttribute("aria-pressed",i.doorOpen),t.textContent=i.doorOpen?"Close door":"Open door"),n==="zoom-out"&&i.scene?.zoomBy(1.2),n==="zoom-in"&&i.scene?.zoomBy(1/1.2),n==="home"&&mr(i,"field"),n==="city"&&mr(i,"city"),n==="fit"&&_u(i)})),Ht("[data-inspect]",e).forEach(t=>t.addEventListener("click",()=>{mr(i,t.dataset.inspect==="rotor"?"bench":"flow"),i.scene?.inspectPart(t.dataset.inspect)}))}function mr(i,e){i.view=e,i.scene?.setView(e),ut('[data-tool="view"]',i.root).setAttribute("aria-pressed",e==="bench"),ut('[data-tool="flow-view"]',i.root)?.setAttribute("aria-pressed",e==="flow");let t=ut('[data-tool="door"]',i.root);t&&(t.disabled=e==="bench");let n=ut(".viewport",i.root);n.dataset.sceneView=e}function _u(i){let e=ut(".viewport",i.root);if(document.fullscreenElement===e){document.exitFullscreen();return}if(e.classList.contains("expanded")){Uc(i,!1);return}e.requestFullscreen?e.requestFullscreen().catch(()=>Uc(i,!0)):Uc(i,!0)}function Uc(i,e){ut(".viewport",i.root).classList.toggle("expanded",e),document.body.style.overflow=e?"hidden":"",Wp(i)}function Wp(i){let e=ut(".viewport",i.root),t=document.fullscreenElement===e||e.classList.contains("expanded"),n=ut('[data-tool="fit"]',i.root);n.setAttribute("aria-pressed",t),n.textContent=t?"\u2715 Exit full screen":"\u26F6 Fit to screen";let s=ut('[data-hy-action="fit"]',i.root);s&&(s.setAttribute("aria-pressed",t),s.textContent=t?"\u2715 Exit full screen":"\u26F6 Full screen"),requestAnimationFrame(()=>i.scene?.resize()),setTimeout(()=>i.scene?.resize(),150)}document.addEventListener("fullscreenchange",()=>{for(let i in vn)Wp(vn[i])});document.addEventListener("keydown",i=>{if(i.key==="Escape")for(let e in vn)ut(".viewport",vn[e].root).classList.contains("expanded")&&Uc(vn[e],!1)});function Fc(i,e){let t={};[...kp,"units","boats","upb","mount"].forEach(n=>t[n]=i.p[n]),i.scenario=bo[i.mode].find(n=>n.id===e),i.p={...un.defaults,...i.scenario.p,...t},i.t=0,oi(i)}function oi(i){i.p._mode=i.mode,i.p._weather=i.scenario.weather,i.mode==="water"&&(i.p.units=i.p.boats*i.p.upb),i.hw=un.evaluateHardware(i.p),Ht("[data-scenario]",i.root).forEach(e=>{let t=e.dataset.scenario===i.scenario.id;e.classList.toggle("selected",t),e.setAttribute("aria-pressed",t)}),ut("[data-scenario-select]",i.root).value=i.scenario.id,Ht("[data-param]",i.root).forEach(e=>{let t=e.dataset.param,n=Hp(Oc[t][3]);e.value=i.p[t],ut('[data-output="'+t+'"]',i.root).innerHTML=Gp(i.p[t],n)+" <small>"+Oc[t][4]+"</small>"}),Ht("[data-param-select]",i.root).forEach(e=>e.value=i.p[e.dataset.paramSelect]),Ht("[data-step-out]",i.root).forEach(e=>e.textContent=Math.round(i.p[e.dataset.stepOut])),Ht("[data-dec],[data-inc]",i.root).forEach(e=>{let t=e.dataset.dec||e.dataset.inc,[,n,s]=zc[t];e.disabled=e.dataset.inc?i.p[t]>=s:i.p[t]<=n}),ut("[data-total]",i.root).textContent="TOTAL "+Math.round(i.p.units)+(Math.round(i.p.units)===1?" UNIT":" UNITS"),Ht("[data-toggle]",i.root).forEach(e=>e.checked=i.p[e.dataset.toggle]),Ht("[data-hw]",i.root).forEach(e=>e.value=i.p[e.dataset.hw]),i.scene?.setEnvironment(i.scenario,i.p),i.scene?.setHardware(i.hw,i.p),i.ventilationMode==="advanced"&&i.hybrid?.applyEnvironment(),Ov(i),Xp(i)}var Fv={ok:"OK",warn:"DEGRADED",fail:"FAILED"};function Ov(i){let e=Vp(i.mode),t=ut("[data-hwstatus]",i.root),n=i.hw,s=[["wind","windSensor"],["quality","qualitySensor"],["env","envSensor"],["mcu","mcu"]].filter(([o])=>n.items[o].res).map(([o,a])=>{let c=n.items[o].res;return'<div class="hw-row '+c.status+'"><div class="hw-row-top"><span>'+e[a]+'</span><span class="chip">'+Fv[c.status]+"</span></div></div>"}).join(""),r=n.protectionText==="ARMED"?"":n.protectionText.startsWith("NO ")?"warn":"bad";t.innerHTML='<div class="hw-head"><span>STORM PROTECTION</span><b class="'+r+'">'+n.protectionText+"</b></div>"+(s||'<div class="hw-note">Pick sensors and a microcontroller above to test their performance in each weather case.</div>')}function Xp(i){i.current=un.steady(i.p,un.liveWind(i.p,i.t),i.hw)}function Bv(i){if(i.scene||i.graphicsFailed)return;let e=ut(".viewport",i.root);try{i.scene=new pr(e,i.mode),i.scene.setEnvironment(i.scenario,i.p),i.scene.setHardware(i.hw,i.p),i.scene.setView(i.view),i.scene.setFlows(i.flows),ut(".loading",e)?.remove(),i.scene.render(0,i.current,!1)}catch(t){i.graphicsFailed=!0,ut(".loading",e)?.remove();let n=document.createElement("div");n.className="graphics-error",n.textContent="3D rendering needs WebGL 2. Enable hardware acceleration or open this page in a WebGL-capable browser. Parameters and hardware checks still work.",e.append(n),console.error("3D scene initialization:",t)}}function Bc(i){So=i;for(let e of["air","water"]){let t=ut("#"+e+"-tab"),n=e===i;t.classList.toggle("active",n),t.setAttribute("aria-selected",n),t.tabIndex=n?0:-1,vn[e].root.hidden=!n}Bv(vn[i]),vn[i].scene?.resize()}for(let i of["air","water"])Nv(i);Op(vn.air,{recompute:oi,toggleFit:_u,setSceneView:mr});Ht("[data-mode]").forEach(i=>{i.addEventListener("click",()=>Bc(i.dataset.mode)),i.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight"].includes(e.key)){e.preventDefault();let t=So==="air"?"water":"air";Bc(t),ut("#"+t+"-tab").focus()}})});var Nn=ut("#reference-dialog");ut("#reference-open").addEventListener("click",()=>Nn.showModal());ut(".dialog-close",Nn).addEventListener("click",()=>Nn.close());Nn.addEventListener("click",i=>{if(i.target===Nn){let e=Nn.getBoundingClientRect();(i.clientX<e.left||i.clientX>e.right||i.clientY<e.top||i.clientY>e.bottom)&&Nn.close()}});Nn.addEventListener("close",()=>Ht("video",Nn).forEach(i=>i.pause()));Bc("air");function qp(i){let e=Math.min(.1,(i-Bp)/1e3||0);Bp=i;let t=vn[So],n=t.running&&!document.hidden&&!Nn.open;n&&(t.t+=e),t.ventilationMode==="advanced"&&t.hybrid.tick(e,n),mu+=e,mu>.1&&(Xp(t),t.ventilationMode==="advanced"&&t.hybrid.render(),mu=0),t.current=un.steady(t.p,un.liveWind(t.p,t.t),t.hw),document.hidden||t.scene?.render(e*(t.ventilationMode==="advanced"?t.hybrid.p.speed:1),t.current,n),requestAnimationFrame(qp)}requestAnimationFrame(qp);window.ZW={mode:()=>So,state:()=>vn[So],states:vn,scenarios:bo,definitions:Oc,steppers:zc,profiles:zp,switchMode:Bc,selectScenario:Fc,toggleFit:_u,recompute:oi,dialogOpen:()=>Nn.open,closeDialog:()=>Nn.close()};})();
/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
