import n,{useState as e,useEffect as t}from"react";import*as o from"@supabase/supabase-js";import{cookies as r,headers as i}from"next/headers";import{NextResponse as s}from"next/server";import{execSync as a}from"child_process";function l({page:e,manifest:t}){return n.createElement("div",{className:"flex flex-col items-center justify-center"},n.createElement("div",{className:"flex flex-col w-full"},e?.sections?.map(((e,o)=>{const r=`${e.type}-${o}`,i=t.sections[e.type],s=i?.module.default;return s?n.createElement("section",{key:r,id:r},n.createElement(s,{...e.props})):null}))))}!function(n,e){void 0===e&&(e={});var t=e.insertAt;if(n&&"undefined"!=typeof document){var o=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css","top"===t&&o.firstChild?o.insertBefore(r,o.firstChild):o.appendChild(r),r.styleSheet?r.styleSheet.cssText=n:r.appendChild(document.createTextNode(n))}}('/*\n! tailwindcss v3.3.5 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: \'\';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user\'s configured `sans` font-family by default.\n5. Use the user\'s configured `sans` font-feature-settings by default.\n6. Use the user\'s configured `sans` font-variation-settings by default.\n*/\n\nhtml {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user\'s configured `mono` font family by default.\n2. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type=\'button\'],\n[type=\'reset\'],\n[type=\'submit\'] {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type=\'search\'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user\'s configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don\'t get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden] {\n  display: none;\n}\n\n*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n.absolute {\n  position: absolute;\n}\n.relative {\n  position: relative;\n}\n.inset-0 {\n  inset: 0px;\n}\n.z-50 {\n  z-index: 50;\n}\n.block {\n  display: block;\n}\n.flex {\n  display: flex;\n}\n.h-full {\n  height: 100%;\n}\n.w-full {\n  width: 100%;\n}\n.cursor-pointer {\n  cursor: pointer;\n}\n.flex-col {\n  flex-direction: column;\n}\n.items-center {\n  align-items: center;\n}\n.justify-center {\n  justify-content: center;\n}\n.border-2 {\n  border-width: 2px;\n}\n.border-blue-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(59 130 246 / var(--tw-border-opacity));\n}\n.bg-blue-200\\/30 {\n  background-color: rgb(191 219 254 / 0.3);\n}\n.bg-transparent {\n  background-color: transparent;\n}\n.hover\\:border-2:hover {\n  border-width: 2px;\n}\n.hover\\:border-blue-500:hover {\n  --tw-border-opacity: 1;\n  border-color: rgb(59 130 246 / var(--tw-border-opacity));\n}\n.hover\\:bg-blue-200\\/30:hover {\n  background-color: rgb(191 219 254 / 0.3);\n}\n');const c={},d={};import.meta.url;let h=null;const u=process.env.NEXT_PUBLIC_ADMIN_URL,p={type:"live"};async function f(n,e,t,o){const{schema:r,module:i}=t;let s={...e};const a=[],l=[];let c=!1;for(const n of r?.component?.properties||[]){const{name:t,type:r}=n,i=o.loaders[`@/loaders/${r}`];i&&e[t]&&(l.push(t),a.push(i.module.default(e[t])))}if(r.loader&&i.Loader){c=!0;let t={};for(const n of r.loader.properties||[]){const{name:o}=n;delete s[o],t[o]=e[o]}a.push(i.Loader(n,t))}const d=await Promise.all(a);for(let n=0;n<d.length;n++){const e=l[n],t=d[n];e?s[e]=t:c&&(s={...s,loader:t})}return s}const b=n=>({...n,sections:{...n.sections,...c},loaders:{...n.loaders,...d}}),m=(n,e)=>{n.postMessage((n=>({...p,event:"hover-section",data:n}))(e),"*")},w=(n,e)=>{n.postMessage((n=>({...p,event:"click-section",data:n}))(e),"*")},g=(n,e)=>{(function(){if(!process.env.NEXT_PUBLIC_KIWI_SUPABASE_URL)throw"kiwi supabase url must be informed";if(!process.env.NEXT_PUBLIC_KIWI_SUPABASE_ANON_KEY)throw"kiwi supabase anon key must be informed";return h||(h=o.createClient(`${process.env.NEXT_PUBLIC_KIWI_SUPABASE_URL}`,`${process.env.NEXT_PUBLIC_KIWI_SUPABASE_ANON_KEY}`,{global:{fetch:fetch.bind(globalThis)}})),h})().channel(`realtime_site_page_${n}`).on("postgres_changes",{event:"*",schema:"public",table:"pages"},(t=>{t.new?.id===n&&e(t)})).subscribe()};function y({page:o,requestInfo:r,manifest:i}){const[s,a]=e(),[l,c]=e(!1),[d,h]=e(),[u,p]=e();t((()=>{let n=!1;try{n=window.self!==window.top}catch(n){}return n&&(window.addEventListener("message",y),c(!0)),()=>{n&&window.removeEventListener("message",y)}}),[]),t((()=>(o&&(a(o),g(o.id,(n=>{const e=n.new;a(e),b(e)}))),()=>{})),[o]);const b=async n=>{for(let e=0;e<n.sections?.length;e++){const t=n.sections[e],o=i.sections[t.type];n.sections[e].props=await f(r,t.props,o,i)}},y=n=>{const e=n.data;"live"===e.type&&("hover-section"===e.event&&p(n.data.data.sectionId),"click-section"===e.event&&(h(n.data.data.sectionId),p(n.data.data.sectionId)))};return n.createElement("div",{className:"flex flex-col items-center justify-center"},n.createElement("div",{className:"flex flex-col w-full"},s?.sections?.map(((e,t)=>{const o=i.sections[e.type].module.default,r=`${e.type}-${t}`;return o?n.createElement("section",{key:r,id:r,className:"relative"},l&&n.createElement("div",{className:([d,u].includes(r)?"border-2 border-blue-500 bg-blue-200/30":"bg-transparent")+" block absolute z-50 w-full inset-0 h-full hover:border-2 hover:border-blue-500 hover:bg-blue-200/30 cursor-pointer",onMouseLeave:()=>{p(null),m(window.parent,{sectionId:null})},onMouseEnter:()=>{p(r),m(window.parent,{sectionId:r})},onClick:()=>{w(window.parent,{sectionId:r,section:e}),p(r),h(r)}}),n.createElement(o,{...e.props})):null}))))}function v(e,t,o){return async function({params:{kiwi:s}}){const a=s.join("/"),l=a.startsWith("kiwi/live"),c=b(e),d={cookies:{},headers:{}};r().getAll().forEach((({value:n,name:e})=>{d.cookies[e]=n})),i().forEach(((n,e,t)=>{d.headers[e]=n}));const h=await(async(n,e)=>{if(!u)throw"kiwi admin url must be informed";try{const t=await fetch(`${u}/api/sites/${n}/page?page=${e.replace("/kiwi/live/","")}`);return(await t.json()).page}catch(n){return null}})(e.site,a);if(!h)return null;for(let n=0;n<h.sections?.length;n++){const t=h.sections[n],o=e.sections[t.type];h.sections[n].props=await f(d,t.props,o,e)}const p={page:h,requestInfo:d,manifest:c};return l?n.createElement(t,{...p}):n.createElement(o,{...p})}}const k={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, POST, PATCH, DELETE, OPTIONS","Access-Control-Allow-Headers":"Content-Type"};function x(n){return{PATCH:async(n,{params:{kiwi:e}})=>{if("live/manifest"===e.join("/")){const n=a("npx kiwi manifest");return s.json({result:n},{headers:k})}return s.json({},{headers:k})},GET:(e,{params:{kiwi:t}})=>{if(1===t.length&&"live"===t[0]){const e=b(n);return s.json(e,{headers:k})}},POST:async(n,{params:{kiwi:e}})=>{if("live/proxy"===e.join("/")){const{method:e,url:t,headers:o,body:r}=await n.json(),i=await fetch(t,{method:e,headers:o,body:r}),a=await i.json();return s.json(a||{},{headers:k})}return s.json({},{headers:k})},OPTIONS:n=>s.json({},{headers:k})}}function E({text:e,...t}){return n.createElement("div",{dangerouslySetInnerHTML:{__html:e},...t})}export{v as CatchAll,y as CatchAllClient,l as CatchAllServer,x as LiveRoute,E as RichTextComponent};
//# sourceMappingURL=index.js.map
