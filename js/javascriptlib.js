/*
 * Correct for Edge
 */
(function () {
  'use strict';
  if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement('style');
    msViewportStyle.appendChild(
      document.createTextNode(
        '@-ms-viewport{width:auto!important}'
      )
    );
    document.querySelector('head').appendChild(msViewportStyle);
  }

})();

/**
 * For compatibility, we use getElementsByClassName
 */
(function() {
    if (!document.getElementsByClassName) {
        var indexOf = [].indexOf || function(prop) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === prop) return i;
            }
            return -1;
        };
        getElementsByClassName = function(className, context) {
            var elems = document.querySelectorAll ? context.querySelectorAll("." + className) : (function() {
                var all = context.getElementsByTagName("*"),
                    elements = [],
                    i = 0;
                for (; i < all.length; i++) {
                    if (all[i].className && (" " + all[i].className + " ").indexOf(" " + className + " ") > -1 && indexOf.call(elements, all[i]) === -1) elements.push(all[i]);
                }
                return elements;
            })();
            return elems;
        };
        document.getElementsByClassName = function(className) {
            return getElementsByClassName(className, document);
        };

        if(Element) {
            Element.prototype.getElementsByClassName = function(className) {
                return getElementsByClassName(className, this);
            };
        }
    }
})();

/**
 * This is a simple function makes json objects into strings if JSON libraries are not there
 */
if(typeof(window)!='undefined' && typeof(window.JSON)=='undefined') {
    window.JSON = {
        ConvertToJSON : function (obj, isArray) {
            if (typeof(isArray)!='boolean') {
                isArray = false;
            }
            var returnstring = new StringBuilder("");

            if (Object.prototype.toString.call( obj )==="[object Array]") {
                isArray = true;
            }
            if (isArray) {
                returnstring += "[";
            }
            else {
                returnstring += "{";
            }
            for (var i in obj) {
                if (obj[i] instanceof Array) {
                    returnstring += ConvertToJSON( obj[i], true) + ",";
                }
                else if (Object.prototype.toString.call( obj[i] )==="[object Array]") {
                    returnstring += ConvertToJSON( obj[i], true) + ",";
                }
                else if (obj[i] instanceof Object) {
                    returnstring += ConvertToJSON( obj[i], false) + ",";
                }
                else if (Object.prototype.toString.call( obj[i] )==="[object Object]") {
                    returnstring += ConvertToJSON( obj[i], false) + ",";
                }
                else if (Object.prototype.toString.call( obj[i] )==="[object Date]") {
                    returnstring += '"' + i + '":"' + obj[i].toString() + '",';
                }
                else if (typeof( obj[i] )=='object') {
                    returnstring += ConvertToJSON( obj[i], false) + ",";
                }
                else if (typeof(obj[i])=='number') {
                    returnstring += '"' + i + '":' + obj[i] + ",";
                }
                else if (typeof(obj[i])=='string') {
                    var str = clone(obj[i]);
                    str = str.replace(new RegExp('\\\\', 'g'),'\\\\');
                    str = str.replace(new RegExp('\'', 'g'),'\\\'');
                    str = str.replace(new RegExp('\"', 'g'),'\\\"');
                    str = str.replace(new RegExp('\r', 'g'),'\\r');
                    str = str.replace(new RegExp('\n', 'g'),'\\n');
                    returnstring += '"' + i + '":"' + str + '",';
                }
            }
            returnstring = returnstring.substring(0, returnstring.length - 1);
            if (isArray) {
                returnstring += "]";
            }
            else {
                returnstring += "}";
            }
            return returnstring;
        },
        stringify : function(data) {
            return this.ConvertToJSON(data);
        }
    }
}


if (!String.prototype.splitWord){
    String.prototype.splitWord = function(word){
        if (typeof(word)!="string") {return [this];}
        var arr = [];
        try {
            var index = 1;
            var str = this;
            while (str.length > 0 && index >= 0) {
                index = str.indexOf(word);
                if (index >= 0){
                    arr.push(str.slice(0, index));
                    str = str.slice(index + word.length);
                }
            }
            if (str.length > 0){
                arr.push(str);
            }
        }
        catch (err){}
        return arr;
    };
}

if (!String.prototype.shorten){
    String.prototype.shorten = function(length){
        if (typeof(length)!='number'){
            length = 140;
        }
        var str = this;
        if (str.length < length || length<4){return str;}
        str = str.substring(0, length).trim();
        var split = str.split(' ');
        split.pop();
        var str2 = split.join(' ');
        if (str2.length < 1){return str + "...";}
        var lst = str2[str2.length-1];
        while (str2.length > 1 && (lst==';' || lst==','|| lst=='.' || lst=="\'" || lst=='"')){
            str2 = str2.substring(0, str2.length-1).trim();
            lst = str2[str2.length-1];
        }
        return str2 + "...";
    };
}
// Define a contains method
if (!String.prototype.contains){
    String.prototype.contains = function(word){
        return this.indexOf(word) > -1;
    };
}

// Define a startsWith method
if (!String.prototype.startsWith){
    String.prototype.startsWith = function(word){
        if (typeof(word)!="string") {return false;}
        if (word.length > this.length){return false;}
        return this.indexOf(word) == 0;
    };
}
if (!String.prototype.combineWith){
    String.prototype.combineWith = function(other, combinator){
        if (typeof (other)!="string"){return this;}
        if (typeof (combinator)!="string"){return this + other;}
        var str = this;
        if (str.endsWith(combinator) && other.startsWith(combinator)){
            str = str + other.substr(combinator.length);
        }
        else if (!str.endsWith(combinator) && !other.startsWith(combinator)){
            str = str + combinator + other;
        } else {
            str = str + other;
        }
        return str;
    };
}
// Define a startsWith method
if (!String.prototype.endsWith){
    String.prototype.endsWith = function(word){
        if (typeof(word)!="string") {return false;}
        if (word.length > this.length){return false;}
        var wl = word.length-1;
        var tl = this.length-1;
        for (var i = 0; i < word.length; i++){
            var wc = word[wl-i];
            var tc = this[tl-i];
            if (wc != tc){return false;}
        }
        return true;
    };
}

// Define a replaceAll method
if (!String.prototype.replaceAll){
    String.prototype.replaceAll = function(search, replacement) {
        return this.splitWord(search).join(replacement);
    };
}
if (!String.prototype.replaceAll){
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };
}

if (!HTMLElement.prototype.addClass){
    HTMLElement.prototype.addClass = function(name){
        if (typeof(this.className)=="undefined"){
            this.className = name;
            return;
        }
        if (this.className.toString().split(" ").indexOf(name) == -1) {
            this.className += " " + name;
        }
    };
}
if (!HTMLElement.prototype.hasClass){
    HTMLElement.prototype.hasClass = function(name){
        if (typeof(this.className)=="undefined"){
            return;
        }
        if (typeof(name)!="string"){return false;}
        return this.className.toString().split(" ").indexOf(name) >= 0;
    };
}
if (!HTMLElement.prototype.removeClass){
    HTMLElement.prototype.removeClass = function(name){
        if (typeof(this.className)=="undefined"){
            return;
        }
        this.className = this.className.toString().split(" ").filter(function(c){return c != name;}).join(" ");
    };
}
if (!HTMLElement.prototype.selectProfileImage){
    HTMLElement.prototype.selectProfileImage = function(){
        var images = document.getElementsByClassName("ProfileImage");
        for(var i = 0; i < images.length; i++){
            images[i].removeClass("selected_ProfileImage");
        }
        this.addClass("selected_ProfileImage");
    };
}
if (!HTMLElement.prototype.removeFromParent){
    HTMLElement.prototype.removeFromParent = function(){
        if (typeof(this.parentNode)  == "undefined") {return;}
        this.parentNode.removeChild(this);
    };
}
if (!HTMLElement.prototype.removeParent){
    HTMLElement.prototype.removeParent = function(){
        if (typeof(this.parentNode)  == "undefined") {return;}
        this.parentNode.removeFromParent();
    };
}

if (!HTMLElement.prototype.removeAllByClass){
    HTMLElement.prototype.removeAllByClass = function(name){
        var e = this.getElementsByClassName(name);
        var l = e.length;
        for (var i = 0; i < l; i++){
            e[i].removeFromParent();
        }
    };
}
if (!HTMLElement.prototype.getElementById){
    HTMLElement.prototype.getElementById = function(id){
        if (typeof(this.children) != "object" && typeof(this.children.length) != "number"){return null;}
        for(var i = 0; i < this.children.length; i++){
            var c = this.children[i];
            if (typeof(c.id)=="string" && c.id == id){return c;}
            if (typeof(c.children) == "object" && typeof(c.children.length) == "number"){
                var ch = c.getElementById(id);
                if (ch!=null){return ch;}
            }
        }
        return null;
    };
}
if (!HTMLElement.prototype.backgroundUrl){
    Object.defineProperties(HTMLElement.prototype, {
        "backgroundUrl" : {
            "get": function() {
                if (this == null){return null;}
                if (typeof(this.style)=="undefined"){
                    return null;
                }
                if (typeof(this.style.backgroundImage)=="undefined"){
                    return null;
                }
                var img = this.style.backgroundImage.toString();
                if (img.indexOf("url(")==0){
                    img = img.substr(5);
                    img = img.substr(0, img.length-2);
                }
                return img;
            },
            "set": function(value) {
                if (typeof(value)!="string"){return;}
                if (typeof(this.style)=="undefined"){
                    return;
                }
                if (value === null || value.trim() === ""){
                    this.style.backgroundImage = null;
                }
                if (value.toLowerCase().indexOf("url(")===0){
                    this.style.backgroundImage = value;
                    return;
                }
                this.style.backgroundImage = "url('" + value + "')";
            }
        }
    });
}

if (!HTMLElement.prototype.number){
    Object.defineProperties(HTMLElement.prototype, {
        "number" : {
            "get": function() {
                if (this == null){return NaN;}
                if (typeof(this.getAttribute)!="function"){
                    return NaN;
                }
                var number = this.getAttribute("number");
                if (number == null){return NaN;}
                try {
                    return parseInt( number+ "");
                }
                catch (e) {

                }
                return NaN;
            },
            "set": function(value) {
                if (this == null){return NaN;}
                if (typeof(this.setAttribute)!="function"){
                    return;
                }
                if (typeof(value)=="number"){
                    this.setAttribute("number",value);
                    return;
                }
                try {
                    this.setAttribute("number",parseInt(value+""));
                    return;
                }
                catch (e) {

                }
            }
        }
    });
}

if (!HTMLDocument.prototype.addScript){
    HTMLDocument.prototype.addScript = function (url, callback) {
        if (typeof(url)!="string"){return;}
        if (typeof(document.scripts)!="undefined"){
            for (var i = 0; i < document.scripts.length; i++){
                if (document.scripts[i].outerHTML.contains(url)){
                    if (typeof(callback) ==='function'){
                        callback();
                    }
                    return;
                }
            }
        }
        var script  = this.createElement('script');
        script.setAttribute("type","text/javascript");
        script.setAttribute("src", url);
        var head = this.getElementsByTagName('head')[0];
        script.onload = script.onreadystatechange = function(){
            if (!script.readyState || script.readyState === 'loaded' || script.readyState === 'complete'){
                if (typeof(callback) ==='function'){
                    callback();
                }
                script.onload = script.onreadystatechange = null;
            }
            else {
                console.log(url + " could not be loaded...");
            }
        };
        head.appendChild(script);
    };
}


if (!HTMLDocument.prototype.addStyleSheet) {
    HTMLDocument.prototype.addStyleSheet = function (url, callback) {
        if (typeof(url)!="string"){return;}
        if (typeof(document.styleSheets)!="undefined"){
            for (var i = 0; i < document.styleSheets.length; i++){
                if (document.styleSheets[i].href.contains(url)){
                    if (typeof(callback) ==='function'){
                        callback();
                    }
                    return;
                }
            }
        }
        var sheet = document.createElement('link');
        sheet.setAttribute("rel", "stylesheet");
        // sheet.setAttribute("type", "text/css");
        sheet.setAttribute("href", url);
        var head = document.getElementsByTagName('head')[0];
        sheet.onload = sheet.onreadystatechange = function () {
            if (!sheet.readyState || sheet.readyState === 'loaded' || sheet.readyState === 'complete') {
                if (typeof (callback) === 'function') {
                    callback();
                }
                sheet.onload = sheet.onreadystatechange = null;
            } else {
                console.log(url + " could not be loaded...");
            }
        };
        head.appendChild(sheet);
    };
}

/**
 * You can define a string as a string builder and it will be more memory efficient
 * @param value, the original string
 * @constructor var s = new StringBuilder(originalString);
 */
function StringBuilder(value) {
    var context = this;
    context.strings = new Array("");

    if (typeof(value)!="undefined"){
        context.strings = new Array(value);
    }

    context.append = function(value) {
        if (value) {
            this.strings.push(value);
        }
    };
    context.appendLine = function(value) {
        if (value) {
            this.strings.push(value + "\r\n");
        }
    };
    context['+='] = function(value) {
        this.append(value);
    };
    context.clear = function () {
        this.strings.length = 1;
    };
    context.toString = function () {
        return this.strings.join("");
    }
}

/**
 * Runs a function at an interval
 * @param fn, a function to run at a given time period
 * @param time, the time in milliseconds between function executions
 * @constructor var f = new Interval(function(){console.log("hi");}, 500);
 * f.start();
 * f.stop();
 */
function Interval(fn, time) {
    this.fn = fn;
    this.time = time;
    this.timer = false;
    this.start = function () {
        if (!this.isRunning()) {
            this.timer = setInterval(this.fn, this.time);
        }
    };
    this.stop = function() {
        clearInterval(this.timer);
        this.timer = false;
    };
    this.isRunning = function() {
        return this.timer !== false;
    };
}



if (typeof(backgroundImages)=="undefined"){
    var backgroundImages = {};
}
function processBackgroundImages() {
    for (var id in backgroundImages) {
        addBackgroundImageWithFade("#" + id, backgroundImages[id]);
        delete backgroundImages[id];
    }
}
function addBackgroundImageWithFade(element, image, callback) {
    $(element).addBackgroundImageWithFade(image, callback);
}


/**
 * Creates a background image that can be sized with the page
 * @param url - the url of the image
 * @param width - the width of the image
 * @param height - the height of the image
 * @param centerx - the center-x of the image
 * @param centery - the center-y of the image
 * @constructor var BGI = new BackgroundImage('/assets/classy_background.jpg',1920,1080,960,540);
 * BGI.load();
 */
function BackgroundImage(url, width, height, centerx, centery) {
    this.url = url;
    this.maskURLs = [];
    this.width = width;
    if (typeof(centerx)!='number') {
        this.centerx = width/2;
    } else {
        this.centerx = centerx;
    }
    this.height = height;
    if (typeof(centery)!='number')
    {
        this.centery = width/2;
    }
    else
    {
        this.centery = centery;
    }
    this.backgroundDivID = 'Background';

    this.load = function () {
        var bg = document.getElementById(this.backgroundDivID);
        if (document.getElementById(this.backgroundDivID)==null) {
            bg = document.createElement("div");
            bg.setAttribute("id","Background");
            $(bg).css('background-attachment', 'scroll');
            $(bg).css('background-clip', 'border-box');
            $(bg).css('background-color', 'transparent');
            $(bg).css('background-size', 'auto');
            $(bg).css('background-position', 'center top');
            $(bg).css('position', 'fixed');
            $(bg).css('left', '0px');
            $(bg).css('right', '0px');
            $(bg).css('top', '0px');
            $(bg).css('bottom', '0px');
            $(bg).css('overflow', 'hidden');
            $(bg).css('-webkit-background-clip', 'border-box');
            $(bg).css('-webkit-background-origin', 'padding-box');
            $(bg).css('-webkit-background-size', 'auto');
            $(bg).css('-webkit-border-image', 'none');
            $(bg).css('z-index', '-1');
            document.body.insertBefore(bg, document.body.firstChild);
        } else {
            while (bg.firstChild) {
                bg.removeChild(bg.firstChild);
            }
        }
        var img = document.createElement("img");
        try {
            var img = new Image();
        }
        catch (err) {}
        img.setAttribute("id","BackgroundImage");
        img.src = this.url;
        if (!img.complete) {
            img.setAttribute("style","opacity: 0;");
            img.setAttribute("onload","this.style.opacity='1';");
        }
        $(img).css("-webkit-transition-timing-function","cubic-bezier(0.25, 0.1, 0.25, 1)");
        $(img).css("transition-delay","0s");
        $(img).css("transition-duration","1s");
        $(img).css("transition-property","opacity");
        $(img).css("-webkit-transition-delay","0s");
        $(img).css("-webkit-transition-duration","1s");
        $(img).css("-webkit-transition-property","opacity");
        $(img).css("border-width","0px");
        $(img).css("z-index","-1");
        bg.appendChild(img);

        var zindex = 0;
        for (var index in this.maskURLs) {
            var md = document.createElement("div");
            md.setAttribute("id","Mask" + index);
            $(md).css('background-attachment', 'scroll');
            $(md).css('background-clip', 'border-box');
            $(md).css('background-color', 'transparent');
            $(md).css('background-size', 'auto');
            $(md).css('background-position', 'center center');
            $(md).css('background-repeat', 'repeat');
            $(md).css('position', 'fixed');
            $(md).css('left', '0px');
            $(md).css('right', '0px');
            $(md).css('top', '0px');
            $(md).css('bottom', '0px');
            $(md).css('overflow', 'hidden');
            $(md).css('-webkit-background-clip', 'border-box');
            $(md).css('-webkit-background-origin', 'padding-box');
            $(md).css('-webkit-background-size', 'auto');
            $(md).css('-webkit-border-image', 'none');
            zindex++;
            $(md).css('z-index', zindex + '');
            $(md).css('background-image', "url('"+this.maskURLs[index]+"')");
            bg.appendChild(md);
        }
        this.resize();
    };
    this.resize = function() {
        var imgNewWidth = this.width;
        var imgNewHeight = this.height;
        var bgHeight = $(window).maxMeasuredHeight();
        var bgWidth = $(window).maxMeasuredWidth();
        var curRatio = (bgHeight / bgWidth);
        var prevRatio = (this.height / this.width);
        if (curRatio > prevRatio) {
            // Taller than wide
            imgNewHeight = bgHeight;
            imgNewWidth = bgHeight * (1 / prevRatio);
        } else {
            // Wider than tall
            imgNewWidth = bgWidth;
            imgNewHeight = bgWidth * prevRatio;
        }
        var newMarginLeft = (bgWidth - imgNewWidth)*(this.centerx/this.width);
        var newMarginTop = (bgHeight - imgNewHeight)*(this.centery/this.height);
        $("#BackgroundImage").height(imgNewHeight);
        $("#BackgroundImage").width(imgNewWidth);
        $("#BackgroundImage").css('margin-left',newMarginLeft+"px");
        $("#BackgroundImage").css('margin-top',newMarginTop+"px");
    };
}


/**
 * Organizes child elements using absolute positioning to form a "Pinterest" style board
 * @returns {boolean} true if the class object is created, false if otherwise
 * @constructor var PD = new PanelDisplay();
 * PD.parentID = 'Board';
 * PD.childClass = 'Panel';
 * PD.maxWidth = 450;
 * PD.minWidth = 300;
 * PD.padSides = false;
 * PD.resize();
 */
function PanelDisplay() {
    var context = this;
    this.parentID = null;
    this.childClass = null;
    this.minWidth = 0;
    this.maxWidth = 0;
    this.margin = 5;
    this.padSides = false;
    this.animationSpeed = 0;
    this.columnDisplayClasses = {
        2: "panel-display-2-columns",
        3: "panel-display-3-columns",
        4: "panel-display-4-columns",
        5: "panel-display-5-columns",
        6: "panel-display-6-columns"
    };
    this.columnMinDisplayClasses = {
        2: "panel-display-min-2-columns",
        3: "panel-display-min-3-columns",
        4: "panel-display-min-4-columns",
        5: "panel-display-min-5-columns",
        6: "panel-display-min-6-columns"
    };

    /**
     * Checks to see if the PanelDisplay properties have been set
     * @returns {boolean}, true if PanelDisplay is ready, false if otherwise
     */
    this.isComplete = function() {
        if (typeof(this.childClass)!="string") {
            return false;
        }
        if (typeof(this.parentID)!="string") {
            return false;
        }
        if (typeof(this.animationSpeed)!="number") {
            this.animationSpeed = 0;
        }
        if (this.animationSpeed<0) {
            this.animationSpeed = 0;
        }
        if (document.getElementsByName(this.parentID)==null) {
            return false;
        }
        if (document.getElementsByClassName(this.childClass)[0]==null)
        {
            return false;
        }
        if (this.minWidth<=0) {
            return false
        }
        if (this.maxWidth<this.minWidth || this.maxWidth==0) {
            return false
        }
        if (this.margin<=0) {
            return false
        }
        return true;
    };

    this.maxHeightCalc = function(index, columns, columnHeightObject){
        var maxHeight = 0;
        for (var t = index; t< index+columns; t++) {
            if (typeof(columnHeightObject[t])=="number"){
                if (columnHeightObject[t]>maxHeight){
                    maxHeight = columnHeightObject[t];
                }
            }
        }
        return maxHeight;
    };

    /**
     * Run this function when the parent div re-sizes
     * @returns {boolean} true if successful, false if otherwise
     */
    this.resize = function(callback) {
        if (!this.isComplete()) {
            return false;
        }
        var childClass = context.childClass;
        var margin = context.margin;
        var minWidth = context.minWidth;
        var maxWidth = context.maxWidth;
        var padSides = context.padSides;
        var animationSpeed = context.animationSpeed;

        $('#' + context.parentID).css({
            'position' : 'relative'
        });
        $('.' + childClass).each(function(index, element){
            if ($(element).isNoneVisible()){}
            else {
                $(element).css({
                    'display':'block'
                });
            }
        });

        var parentWidth = $('#' + context.parentID).minMeasuredWidth();
        var childWidth = $('.' + childClass).maxMeasuredWidth();

        if (childWidth>0) {
            var columnCount = Math.floor(parentWidth/(minWidth+2*margin));
            var minColumnCount = Math.ceil(parentWidth/(maxWidth+2*margin));
            if (minColumnCount < columnCount) {
                columnCount = minColumnCount;
            }
            if (columnCount<=1) {
                columnCount = 1;
                $('.' + childClass).css({
                    'width':'100%',
                    'clear':'both',
                    'left' : '0px',
                    'position' : '',
                    'margin-bottom' : 2*margin + 'px'
                });
                $('#' + context.parentID).height('');
            }
            else {
                var calcWidth = (parentWidth-columnCount*(minWidth+2*margin)+2*margin)/columnCount + minWidth;
                if (padSides) {
                    calcWidth = (parentWidth-columnCount*(minWidth+2*margin))/columnCount + minWidth;
                }
                if (calcWidth>maxWidth) {
                    calcWidth = maxWidth;
                    margin = (parentWidth-columnCount*calcWidth)/(columnCount*2-2);
                    if (padSides) {
                        margin = (parentWidth-columnCount*calcWidth)/(columnCount*2);
                    }
                }
                var columnHeights = {};
                for (var n=1; n<=columnCount; n++) {
                    columnHeights[n] = 0;
                }
                $('.' + childClass).each(function(index, element){
                    if ($(this).isNoneVisible()) {} else {
                        var minIndex = 1;
                        var minMinIndex = 1;
                        var columns = 1;
                        var minColumns = 1;
                        if (typeof(context.columnDisplayClasses)=="object") {
                            for (var n in context.columnDisplayClasses) {
                                if ($(this).hasClass(context.columnDisplayClasses[n])){
                                    columns = parseInt(n);
                                }
                            }
                        }
                        if (typeof(context.columnMinDisplayClasses)=="object") {
                            for (var n in context.columnMinDisplayClasses) {
                                if ($(this).hasClass(context.columnMinDisplayClasses[n])){
                                    minColumns = parseInt(n);
                                }
                            }
                        }
                        if (columns>columnCount){
                            columns = columnCount;
                        }
                        var currentHeight = context.maxHeightCalc(minIndex,columns, columnHeights);
                        for (var m=1; m<=(columnCount-(columns-1)); m++) {
                            var testHeight = context.maxHeightCalc(m,columns, columnHeights);
                            if (currentHeight>testHeight) {
                                currentHeight = testHeight;
                                minIndex = m;
                            }
                        }
                        var currentMinHeight = context.maxHeightCalc(minIndex,columns, columnHeights);
                        for (var m=1; m<=(columnCount-(minColumns-1)); m++) {
                            var testHeight = context.maxHeightCalc(m,minColumns, columnHeights);
                            if (currentMinHeight>testHeight) {
                                currentMinHeight = testHeight;
                                minMinIndex = m;
                            }
                        }
                        if (currentMinHeight<currentHeight-elementHeight/columnCount){
                            currentHeight = currentMinHeight;
                            minIndex = minMinIndex;
                            columns = minColumns;
                        }
                        var left = ((minIndex-1)*(calcWidth+2*margin));
                        if (padSides) {
                            left += margin;
                        }
                        if (animationSpeed>0) {
                            $(element).stop(true,true);
                        }
                        $(element).css({
                            'margin-bottom' : '0px',
                            'clear':'',
                            'width': (calcWidth*columns + 2*margin*(columns-1)) + 'px',
                            'position' : 'absolute'
                        });

                        var elementHeight = $(element).maxMeasuredHeight();

                        if (currentHeight>0) {
                            if (animationSpeed>0) {
                                $(element).animate({
                                    'top' : currentHeight + margin + 'px',
                                    'left' : left + 'px'
                                },animationSpeed);
                            } else {
                                $(element).css({
                                    'top' : currentHeight + margin + 'px',
                                    'left' : left + 'px'
                                });
                            }
                        }
                        else {
                            if (animationSpeed>0) {
                                $(element).animate({
                                    'top' : '0px',
                                    'left' : left + 'px'
                                },animationSpeed);
                            } else {
                                $(element).css({
                                    'top' : '0px',
                                    'left' : left + 'px'
                                });
                            }
                        }
                        var colHeight = context.maxHeightCalc(minIndex,columns, columnHeights);
                        for (n = 0; n<columns; n++){
                            columnHeights[minIndex+n] = colHeight + elementHeight + margin;
                        }
                    }
                });
                var maxIndex = 1;
                for (var p=1; p<=columnCount; p++) {
                    if (columnHeights[maxIndex]<columnHeights[p]) {
                        maxIndex = p;
                    }
                }
                $('#' + context.parentID).height(columnHeights[maxIndex]+5);
            }
            if (typeof(callback)=='function'){
                callback();
            }
            return true;
        }
        return false;
    };

    /**
     * Removes the properties from the children elements
     * @returns {boolean} true if successful, false if otherwise
     */
    this.reset = function(){
        if (!this.isComplete()) {
            return false;
        }
        var childClass = this.childClass;
        $('.' + childClass).each(function(index, element){
            $(element).css({
                'display' : '',
                'clear' : '',
                'position' : '',
                'top' : '',
                'left' : '',
                'margin-bottom' : ''
            });
        });
        return true;
    };
}

/**
 * A class for making a modal
 * @constructor, var M = new Modal();
 * M.load();
 * M.hide();
 */
function Modal() {
    var context=this;
    this.contentId = null;
    this.backgroundClickCloses = true;
    this.addCloseX = true;
    this.closeCallbackToEval = '';
    this.minWidth = 480;
    this.maxWidth = 1080;
    this.ModalCSS = {
        'background-color': 'transparent',
        'box-shadow': '0 10px 25px rgba(0,0,0,.5)',
        'padding': '0px'
    };
    this.ModalDivId = 'Modal';
    this.ModalDivColor = 'rgba(250,250,250,.99)';
    this.ModalContentId = 'ModalContent';
    this.ModalBackDivId = 'ModalBack';
    this.ModalBackDivColor = 'rgba(30,30,30,0.55)';
    this.useFontAwesome = false;
    this.closeColor = '#000000';

    this.CloseHTML = function() {
        if (context.useFontAwesome==true){
            return '<span style="width: 24px; height: 24px; cursor: pointer; float: right; margin: 5px; margin-left: -24px; margin-bottom: -32px;" onclick="'+context.CloseJavaScript()+'"><i style="color: '+context.closeColor+'; font-size: 24px;" class="fa fa-times fa-3"></i></span><div style="clear: both;"></div>';
        }
        return '<img src=\'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 36.8 36.8" enable-background="new 0 0 36.8 36.8" xml:space="preserve"> <style>.fillColor{clip-rule: evenodd;fill-rule: evenodd;   fill:' + context.closeColor + ';  } </style> <polygon points="36.8,1.4 35.4,0 18.4,17 1.4,0 0,1.4 17,18.4 0,35.4 1.4,36.8 18.4,19.8 35.4,36.8 36.8,35.4 19.8,18.4" class="fillColor"/> </svg>\' style="width: 16px; height: 16px; cursor: pointer; float: right; margin: 4px; margin-left: -20px; margin-bottom:-20px;" onclick="'+context.CloseJavaScript()+'"><div style="clear: both;"></div>';
    };

    this.CloseJavaScript = function() {
        var returnString= '$(\'#'+context.contentId+'\').html($(\'#'+context.ModalContentId+'\').html()).promise().done(function(){$(\'#'+context.ModalBackDivId+'\').fadeOut(function(){$(\'#'+context.ModalBackDivId+'\').remove().promise().done(function(){';
        returnString+= context.closeCallbackToEval;
        returnString+='$(window).trigger(\'resize\');});});});';
        return returnString;
    };

    /**
     * Checks to see if the Modal properties have been set
     * @returns {boolean}, true if Modal is ready, false if otherwise
     */
    this.isComplete = function() {
        if (typeof(context.contentId)!="string") {
            return false;
        }
        if (document.getElementsByName(context.contentId)==null) {
            return false;
        }
        if (context.maxWidth==0) {
            return false
        }
        return true;
    };

    this.load = function () {
        var contentId = context.contentId;
        var ModalContentId = context.ModalContentId;
        if (document.getElementById(context.ModalDivId)==null) {
            if (document.getElementById(context.ModalBackDivId)==null) {
                var bg = document.createElement("div");
                bg.setAttribute("id",context.ModalBackDivId);
                $(bg).css('position', 'fixed');
                $(bg).css('left', '0px');
                $(bg).css('right', '0px');
                $(bg).css('top', '0px');
                $(bg).css('bottom', '0px');
                $(bg).css('overflow-x', 'visible');
                $(bg).css('overflow-y', 'auto');
                $(bg).css('-webkit-background-clip', 'border-box');
                $(bg).css('-webkit-background-origin', 'padding-box');
                $(bg).css('-webkit-background-size', 'auto');
                $(bg).css('-webkit-border-image', 'none');
                $(bg).css('z-index', '9999');
                $(bg).css('background-color', context.ModalBackDivColor);
                if (context.backgroundClickCloses==true) {
                    bg.setAttribute("onclick","if (getEventTarget(event)==this) {" + context.CloseJavaScript() + "}");
                    $(bg).css('cursor', 'pointer');
                }

                var modal = document.createElement("div");
                modal.setAttribute("id",context.ModalDivId);
                $(modal).css('display', 'block');
                $(modal).css('margin-right', 'auto');
                $(modal).css('margin-left', 'auto');
                $(modal).css('background-color', context.ModalDivColor);
                for (var v in context.ModalCSS) {
                    $(modal).css(v, context.ModalCSS[v]);
                }
                if (context.addCloseX==true) {
                    $(modal).html(context.CloseHTML());
                }

                var content = document.createElement("div");
                content.setAttribute("id",ModalContentId);
                $(content).html($("#" + contentId).html());
                $("#" + contentId).html("<div style='display: none'></div>");

                var clear = document.createElement("div");
                clear.setAttribute("style","clear: both;");

                content.appendChild(clear);
                modal.appendChild(content);
                bg.appendChild(modal);

                document.body.insertBefore(bg, document.body.firstChild);
            }
        }
        context.resize();
    };
    this.resize = function() {
        var ModalDivId = context.ModalDivId;
        var ModalBackDivId = context.ModalBackDivId;
        if (document.getElementById(ModalDivId)!=null) {
            if (document.getElementById(ModalBackDivId)!=null) {
                if ($(window).minMeasuredWidth()<context.maxWidth) {
                    $("#" + ModalDivId+":visible").width($(window).minMeasuredWidth()-60);
                } else {
                    $("#" + ModalDivId+":visible").width(context.maxWidth-30);
                }
                $("#" + ModalDivId+":visible").centerInParent();
            }
        }
    };
    this.close = function() {
        var contentId = context.contentId;
        var ModalContentId = context.ModalContentId;
        var ModalBackDivId = context.ModalBackDivId;
        $('#'+contentId).html($('#'+ModalContentId).html()).promise().done(function(){
            $('#'+ModalBackDivId).fadeOut(function(){
                $('#'+ModalContentId).remove().promise().done(function(){
                    $('#'+ModalBackDivId).remove().promise().done(function(){
                        $(window).trigger('resize');
                    });
                });
            });
        });
    };
}


function JSLib() {
    var context = this;

    Object.defineProperties(context, {
        "isJqueryLoaded" : {
            "get": function() {
                return !(typeof(jQuery) === 'undefined');
            },
            "set": function(value) {
            }
        }
    });

    context.load_jQuery = function(){
        if (context.isJqueryLoaded) {return;}
        document.addScript("vendor/jquery/jquery.min.js", function() {
            if (context.isJqueryLoaded) {
                console.log('Could not load jQuery');
            }
            else {
                console.log('Automatically loaded jQuery');
            }
        });
    };

    /**
     * Checks to see if the address passed is a valid email address
     * @param address a valid email address
     * @returns {boolean} true if an email address, false if otherwise
     */
    context.isEmailAddress = function(address) {
        // var filter= /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var filter = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (filter.test(address)) {
            return true;
        }
        return false;
    };
    context.imageFadeInOnLoad = function () {
        if (!context.isJqueryLoaded){return;}
        $('img').each(function(){
            if (!this.complete) {
                $(this).css({
                    opacity: 0
                });
                $(this).one("load", function() {
                    $(this).fadeIn().promise().done(function(){
                        $(this).css({
                            opacity: 1
                        });
                    }); //css({visibility: 'visible'        });        $(element).animate({            opacity: 1        }, 500)
                });
            } else {
                $(this).fadeIn();
            }
        });
    };


    /**
     * Gets the site url
     * @returns {string}, a string giving just the http://www.domain.com/
     */
    context.getSiteURL = function(lastSlash) {
        var locations = window.location.href.split("/");
        var returnURL = "";
        for (n=0; n<locations.length; n++) {
            if (n<2) {
                returnURL+= locations[n] + "/";
            }
            else if (n==2) {
                if (typeof(lastSlash)=='boolean') {
                    if (lastSlash) {
                        returnURL+= locations[n] + "/";
                    }
                    else {
                        returnURL+= locations[n];
                    }
                }
                else {
                    returnURL+= locations[n] + "/";
                }
            }
        }
        return returnURL;
    };

    /**
     * Gets the domain of the site url
     * @returns {string}, a string giving just the www.domain.com of http://www.domain.com/something/else/
     */
    context.getSiteDomain = function(url) {
        if (typeof(url)!='string') {
            url = window.location.href;

        }
        var locations = url.split("/");
        var returnURL = "";
        for (n=0; n<locations.length; n++) {
            if (n==2) {
                returnURL += locations[n];
            }
        }
        return returnURL;
    };

    /**
     * Gets the route of the site url
     * @returns {string}, a string giving just the something/else/of http://www.domain.com/something/else/
     */
     context.getSiteRoute = function(url) {
        if (typeof(url)!='string') {
            url = window.location.href;

        }
        var domain = context.getSiteDomain(url);
        var location = url.split(domain);
        if (location.length>1)
        {
            return location[1];
        }
        return url;
    };

    /**
     * Gets the route of the site url
     * @returns {string}, a string giving just the something/else/of http://www.domain.com/something/else/
     */
    context.getSite = function(url) {
        if (typeof(url)!='string') {
            url = window.location.href;

        }
        var domain = context.getSiteDomain(url);
        var locations = url.split(domain);
        if (locations.length>=1)
        {
            return locations[0] + domain;
        }
        return url;
    };

    context.mobileCheck = function () {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    context.mobileAndTabletCheck = function () {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    context.isMobileRes = function () {
        if(window.innerWidth <= 800 && window.innerHeight <= 600) {
            return true;
        } else {
            return false;
        }
    };

    // hide the address bar
    context.hideAddressBar = function () {
        if(!window.location.hash || window.location.hash=="") {
            if(document.height < window.outerHeight) {
                document.body.style.height = (window.outerHeight + 50) + 'px';
            }
            setTimeout( function(){ window.scrollTo(0, 1); }, 0 );
        }
    };

    context.isMobileAgent = function () {
        if (typeof(navigator)=="undefined"){return false;}
        if (typeof(navigator.userAgent)=="undefined"){return false;}
        if( navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        ){
            return true;
        }
        else {
            return false;
        }
    };

    context.getEventTarget = function (event) {
        return event.target ? event.target : ((event.currentTarget) ? event.currentTarget : event.srcElement);
    };

    /**
     * Creates a new guid
     * @returns {string} a guid in the form of 1f4c426e-a7e0-7486-e3c3-4fd89d79d5f5
     */
    context.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
        }
        return (s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()).toLowerCase();
    };

    /**
     * Fills in all classes with a text
     * @param obj, an object of some sort
     * @returns {boolean}, true if successful, false if otherwise
     */
    context.fillDataByClass = function (obj){
        // Handle null or undefined
        if (null == obj) {
            return false;
        }
        // Handle Array
        if (obj instanceof Object) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key] instanceof Array || obj[key] instanceof Object) {
                        context.fillDataByClass(obj[key]);
                    }
                    else if (obj[key]!=null) {
                        $("." + key).each(function(index, element) {
                            if (key.toString().indexOf("_url", key.toString().length - "_url".length) != -1 && $(element).is('img')) {
                                $(element).attr('src', obj[key].toString());
                            }
                            else if ( $(element).is('input:checkbox') ) {
                                $(element).prop('checked', obj[key].toString()=='true');
                            }
                            else if ($(element).is('input') || $(element).is('input:text') || element.tagName.toLowerCase() == "input" ||  $(element).prop('type') == 'select-one') {
                                $(element).val(obj[key].toString() + "");
                            }
                            else {
                                $(element).text(obj[key].toString() + "");
                            }
                        });
                    }
                }
            }
            return true;
        }
        return false;
    };

    context.fillDataById = function (obj){
        // Handle null or undefined
        if (null == obj) {
            return false;
        }
        // Handle Array
        if (obj instanceof Object) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key] instanceof Array || obj[key] instanceof Object) {
                        context.fillDataById(obj[key]);
                    }
                    else if (obj[key]!=null) {
                        $("#" + key).each(function(index, element) {
                            if (key.toString().indexOf("_url", key.toString().length - "_url".length) != -1 && $(element).is('img')) {
                                $(element).attr('src', obj[key].toString());
                            }
                            else if ( $(element).is('input:checkbox') ) {
                                $(element).prop('checked', obj[key].toString()=='true');
                            }
                            else if ($(element).is('input') || $(element).is('input:text') || element.tagName.toLowerCase() == "input" || $(element).prop('type') == 'select-one') {
                                $(element).val(obj[key].toString() + "");
                            }
                            else {
                                $(element).text(obj[key].toString() + "");
                            }
                        });
                    }
                }
            }
            return true;
        }
        return false;
    };
    /**
     * Adds the values of a class to a data array, giving that the elements of the class have a defined ID
     * @param dataArray, the object to add values to
     * @param classOfInputs, the class that contains the input
     * @returns {*} the dataArray, but with more elements
     */
    context.addValuesToDataArray = function (dataArray,classOfInputs) {
        $("." + classOfInputs).each(function(index,element) {
            if($(element).attr("id")!=null) {
                if ($(element).is('input:checkbox')) {
                    dataArray[$(element).attr("id")] = $(element).prop('checked');
                } else if ($(element).is('input') || $(element).is('textarea') || $(element).is('select')) {
                    var value = $(element).val();
                    if (value.toString().length>0) {
                        dataArray[$(element).attr("id")] = $(element).val();
                    }
                } else if ($(element).is('div')) {
                    var value = $(element).html();
                    if (value.toString().length>0) {
                        dataArray[$(element).attr("id")] = $(element).val();
                    }
                } else {
                    var value = $(element).text();
                    if (value.toString().length>0) {
                        dataArray[$(element).attr("id")] = $(element).val();
                    }
                }
            }
        });
        return dataArray;
    };

    /**
     * Gets the document from a frame
     * @param frame - an iframe object
     * @returns {*}
     */
    context.getDocFromFrame = function (frame) {
        var doc = null;
        // IE8 cascading access check
        try {
            if (frame.contentWindow) {
                doc = frame.contentWindow.document;
            }
        } catch(err) {}
        if (doc) { // successful getting content
            return doc;
        }
        try { // simply checking may throw in ie8 under ssl or mismatched protocol
            doc = frame.contentDocument ? frame.contentDocument : frame.document;
        } catch(err) {
            // last attempt
            doc = frame.document;
        }
        return doc;
    };


    /**
     * Adds the values of a class to a data array, giving that the elements of the class have a defined ID
     * @param classOfInputs - the class that contains the input
     * @returns {*} the dataArray, but with more elements
     */
    context.getValuesByClassToFormData = function (classOfInputs) {
        if (!context.isJqueryLoaded){return null;}
        var formData = null;
        try {
            formData = new FormData();
            $("." + classOfInputs).each(function(index,element) {
                if($(element).attr("id")!=null) {
                    if ($(element).is('input:file')) {
                        var fileSelect = document.getElementById($(element).attr("id"));
                        var files = fileSelect.files;
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            // Add the file to the request.
                            formData.append($(element).attr("id")+'[]', file, file.name);
                        }
                    } else if ($(element).is('input:checkbox')) {
                        formData.append($(element).attr("id"), $(element).prop('checked'));
                    } else if ($(element).is('input') || $(element).is('textarea') || $(element).is('select')) {
                        var value = $(element).val();
                        if (value.toString().length>0) {
                            formData.append($(element).attr("id"),$(element).val());
                        }
                    } else if ($(element).is('div')) {
                        var value = $(element).html();
                        if (value.toString().length>0) {
                            formData.append($(element).attr("id"),$(element).val());
                        }
                    } else {
                        var value = $(element).text();
                        if (value.toString().length>0) {
                            formData.append($(element).attr("id"),$(element).val());
                        }
                    }
                }
            });
        }catch (err){}
        return formData;
    };

    /**
     * Gets the size of an object, because you can't get the length
     * @param obj, an object
     * @returns {number}, an interger 0 or greater
     */
    context.sizeOfObject = function (obj) {
        var size = 0;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    };

    /**
     * Changes the html entities in a string into something displayable
     * @param str, a string to change
     * @returns {string} a string giving html entities spelled out
     */
    context.htmlEntities = function (str) {
        return str.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };


    /**
     * Takes the day of the week and turns it into a string
     * @param int, an integer giving the day of the week
     * @returns A string giving the day of the week
     */
    context.intDayOfWeekToWord = function (int) {
        if (typeof (int)!="number"){
            int = 0;
        }
        int = Math.abs(Math.round(int));

        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        return weekday[int % 7];
    };

    /**
     * Takes the integer of a month and gives the long word
     * @param int, an integer giving the month of the year
     * @returns A string giving the month of year
     */
    context.intMonthToWord = function(int) {
        var month = new Array(12);
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        return month[int];
    };

    /**
     * Takes the integer of a month and gives the short word
     * @param int, an integer giving the month of the year
     * @returns A string giving the month of year in short format
     */
    context.intMonthToShortWord = function (int) {
        var month = new Array(12);
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Aug";
        month[8] = "Sept";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";
        return month[int];
    };

    /**
     * Turns a date unto the way we all like
     * @param date, a string giving a date
     * @returns a string the way most like it ("2014-07-15T02:36:01Z" becomes "July 15, 2014")
     */
    context.zuluDateToNormalFormat = function (dateString) {
        var firstHalf = dateString.toString().split("T")[0];
        var secondHalf = dateString.toString().split("T")[1].replace("Z","");
        var fhs = firstHalf.split("-");
        var year = parseInt(fhs[0]);
        var month = parseInt(fhs[1]);
        var day = parseInt(fhs[2]);
        var shs = secondHalf.split(":");
        var hour = parseInt(shs[0]);
        var minute = parseInt(shs[1]);
        var second = parseInt(shs[2]);
        return intMonthToWord(month-1) + ' ' + day + ', ' + year;
    };


    context.load_jQueryEnhancements = function(){

        if (context.isJqueryLoaded) {return;}
        /**
         * Submit a form using ajax
         */
        $.fn.formSubmit = function(options) {
            var formObj = $(this);
            var formURL = formObj.attr("action");
            var formMethod = formObj.attr("method");
            if (typeof(formMethod)=='undefined' || formMethod==null){
                formMethod = 'POST';
            }
            if (typeof(window.FormData) !== 'undefined') {
                // for HTML5 browsers
                var formData = new FormData(formObj);
                $(this).find("input:file").each(function(index, element){
                    for (var ind in element.files) {
                        formData.append("files[]", element.files[ind]);
                    }
                });

                var requestOptions = {
                    url: formURL,
                    type: formMethod,
                    data: formData,
                    mimeType: "multipart/form-data",
                    contentType: false,
                    cache: false,
                    processData: false,
                    dataType: 'json'
                };
                var request = $.ajax(requestOptions);
                request.always(function(data, textStatus, xhr) {
                    var response = data;
                    if (typeof(xhr)!='undefined') {
                        if (typeof(xhr.status)!='undefined') {
                            if (typeof(xhr.responseText)!='undefined') {
                                response = xhr;
                            }
                        }
                    }
                    if (typeof(response.responseJSON)!='undefined') {
                        var text = response.responseText;
                        response= response.responseJSON;
                        response['responseText'] = text;
                    }
                    if (typeof(options)!='undefined') {
                        if (typeof(options['callback'])=='function') {
                            options['callback'](response);
                        }
                    }
                });
            } else {
                //for olden browsers
                //generate a random id
                var iframeId = 'unique' + (new Date().getTime());
                //create an empty iframe
                var iframe = $('<iframe src="javascript:false;" name="'+iframeId+'" />');
                //hide it
                iframe.hide();
                //set form target to iframe
                formObj.attr('target',iframeId);
                //Add iframe to body
                iframe.appendTo('body');
                iframe.load(function(e) {
                    var doc = JS.getDocFromFrame(iframe[0]);
                    if (typeof(options)!='undefined') {
                        if (typeof(options['callback'])!='undefined') {
                            options['callback'](doc);
                        }
                    }
                });
            }
        };

        $.fn.makeModal = function(callback) {
            // if the element has enough properties to make it a modal
            if (this.length) {
                // get the id or make one
                var id = $(this).prop("id");
                if (typeof(id)=='undefined' || id==null || id.toString().length<1) {
                    var id = guid();
                    while (document.getElementById(id)!=null) {
                        id = guid();
                    }
                    $(this).prop("id", id);
                }

                // make a new modal
                var m = new Modal();
                m.contentId = id;
                m.ModalDivId += m.contentId;
                m.ModalContentId += m.contentId;
                m.ModalBackDivId += m.contentId;
                m.load();
                $(window).resize(function(){
                    m.resize();
                });
                if (typeof(callback)=='function') {
                    callback();
                }
                return true;
            }
            return false;
        };



        /**
         * Centers an element in the window
         * @param callback -a function to run after
         * @returns {boolean} true if successful, false if otherwise
         */
        $.fn.centerInWindow = function(callback) {
            var windowHeight = $(window).minMeasuredHeight();
            var contentHeight = $(this).maxMeasuredHeight();
            var newMarginTop = (windowHeight - contentHeight)/3.5;
            if (newMarginTop>1) {
                $(this).css('margin-top',newMarginTop+"px").promise().done(function(){
                    if (typeof(callback)=="function") {
                        callback();
                        return true;
                    }
                });
            } else {
                $(this).css('margin-top','').promise().done(function(){
                    if (typeof(callback)=="function") {
                        callback();
                        return true;
                    }
                });
            }
        };

        /**
         * Centers an element in the parent
         * @param callback - a function to run after
         * @returns {boolean} true if successful, false if otherwise
         */
        $.fn.centerInParent = function(callback) {
            if (this.length) {
                var parent = $(this).parent();
                if ( typeof(parent)=='undefined' || parent==null || $(parent).prop("tagName").toString().toLowerCase()=='body') {
                    parent = window;
                }
                var windowHeight = $(parent).minMeasuredHeight();
                var contentHeight = this.maxMeasuredHeight();
                var newMarginTop = (windowHeight - contentHeight)/3.5;
                if (newMarginTop>1) {
                    $(this).css('margin-top',newMarginTop+"px").promise().done(function(){
                        if (typeof(callback)=="function") {
                            callback();
                            return true;
                        }
                    });
                } else {
                    $(this).css('margin-top','').promise().done(function(){
                        if (typeof(callback)=="function") {
                            callback();
                            return true;
                        }
                    });
                }
            }
        };


        /**
         * Get the maximum measured height of the element
         * @returns the maximum measured height of the element
         */
        $.fn.maxMeasuredHeight = function() {
            var height = $(this).height();
            var tempHeight = $(this).outerHeight();
            if (tempHeight>height) {
                height = tempHeight;
            }
            tempHeight = $(this).innerHeight();
            if (tempHeight>height) {
                height = tempHeight;
            }
            return height;
        };

        /**
         * Get the minimum measured height of the element
         * @returns the minimum measured height of the element
         */
        $.fn.minMeasuredHeight = function() {
            var height = $(this).height();
            var tempHeight = $(this).outerHeight();
            if (tempHeight<height) {
                height = tempHeight;
            }
            tempHeight = $(this).innerHeight();
            if (tempHeight<height) {
                height = tempHeight;
            }
            return height;
        };

        /**
         * Get the maximum measured width of the element
         * @returns the maximum measured width of the element
         */
        $.fn.maxMeasuredWidth = function() {
            var width = $(this).width();
            var tempWidth = $(this).outerWidth();
            if (tempWidth>width) {
                width = tempWidth;
            }
            tempWidth = $(this).innerWidth();
            if (tempWidth>width) {
                width = tempWidth;
            }
            return width;
        };

        /**
         * Get the minimum measured width of the element
         * @returns the minimum measured width of the element
         */
        $.fn.minMeasuredWidth = function() {
            var width = $(this).width();
            var tempWidth = $(this).outerWidth();
            if (tempWidth<width) {
                width = tempWidth;
            }
            tempWidth = $(this).innerWidth();
            if (tempWidth<width) {
                width = tempWidth;
            }
            return width;
        };

        /**
         * This function uses jQuery to make a removal of a result look good.
         */
        $.fn.removeResult = function(callback) {
            $(this).animate({opacity: '0'}, {
                duration: 420,
                complete: function () {
                    $(this).css('height',$(this).height()).promise().done(function(){
                        $(this).css('min-width','0').promise().done(function(){
                            $(this).css('overflow-x','hidden').promise().done(function(){
                                $(this).css('overflow-y','hidden').promise().done(function(){
                                    $(this).css('overflow','hidden').promise().done(function(){
                                        $(this).css('opacity', '0').promise().done(function(){
                                            $(this).animate({width: '0px'}, {
                                                duration: 260,
                                                complete: function () {
                                                    $(this).remove().promise().done(function(){
                                                        if (typeof(callback)=='function') {
                                                            callback();
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            });
        };

        /**
         * Makes the object the full height of the window
         * @param clip true to cut off the content, false by default to keep
         * @returns the new height
         */
        $.fn.makeWindowHeight = function(clip){
            if (typeof(clip)!='boolean'){
                clip = false;
            }
            var height = $(window).maxMeasuredHeight();
            var sh = $(this).prop('scrollHeight');

            // set the height to the scroll height
            if (!clip && sh>height) {
                height = sh;
            }

            $(this).height(height);
            return height;
        };

        /**
         * Checks that it's not hidden
         * @returns true if .hide() was ran
         */
        $.fn.isNoneVisible = function(){
            if (typeof(this)=='undefined') {
                return false;
            }
            if (typeof($(this).css('display'))=='undefined') {
                return false;
            }
            if ($(this).css('display').toString().toLowerCase() == 'none') {
                return true;
            }
            return false;
        };

        $.fn.addBackgroundImageWithFade = function(image, callback) {
            var element = this;
            $(element).css({
                visibility: 'hidden',
                opacity: 0
            });
            $('<img/>').attr('src', image).load(function() {
                $(this).remove(); // prevent memory leaks
                $(element).css('background-image', "url('"+image+"')").promise().done(function(){
                    $(element).css({
                        visibility: 'visible'
                    });
                    $(element).animate({
                        opacity: 1
                    }, 500);
                });
                if (typeof(callback)=="function") {
                    callback();
                }
            });
        };
    };
}

var JS = new JSLib();

// Add the script script!
document.addStyleSheet("vendor/fontawesome-free/css/all.min.css", function(){
    document.addStyleSheet("https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i", function(){
        document.addStyleSheet("css/sb-admin-2.css", function(){
            // Load the JS after the scripts
            document.addScript("vendor/jquery/jquery.min.js", function(){
                document.addScript("vendor/bootstrap/js/bootstrap.bundle.min.js", function(){
                    document.addScript("vendor/jquery-easing/jquery.easing.min.js", function(){
                        document.addScript("js/sb-admin-2.js", function(){
                            document.addScript("js/DSApplication.js", function(){
                                document.addScript("js/masa.js", function(){
                                    console.log("loaded masa?");
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
