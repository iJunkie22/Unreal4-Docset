var bDoIndents = false;
var level = 0;
var headerURL = "https://www.unrealengine.com/unifiedheader";
var trackingURL = "https://tracking.unrealengine.com/track.png";
if (window.location.hostname.indexOf('ci.ol.epicgames.net') != -1) {
    headerURL = "https://unrealengine-ci.ol.epicgames.net/unifiedheader";
    trackingURL = "https://tracking.unrealengine-ci.ol.epicgames.net/track.png";
}
else if (window.location.hostname.indexOf('gamedev.ol.epicgames.net') != -1) {
    headerURL = "https://unrealengine-gamedev.ol.epicgames.net/unifiedheader";
    trackingURL = "https://tracking.unrealengine-gamedev.ol.epicgames.net/track.png";
}

$(document).ready(function () {
	PageReadyBase();
});

function PageReadyBase()
{
    $(".non-localized a:first-child img:first-child + img").each(function () { $(this).css("display", "none"); });

    $("img").each(function () {
        var imgSource = $(this).attr("src");
        if ($(this).attr("src").indexOf("button") != -1 || $(this).attr("src").indexOf("icon") != -1 || $(this).attr("src").indexOf("Icon") != -1) {
            $(this).addClass("subimage");
        }
        else if ($(this).attr("src").indexOf("_ref.") != -1) {
            $(this).addClass("no_shadow");
        }

    });

    $(".class_icons img").each(function () {
        $(this).removeClass("subimage");
        var imgSource = $(this).attr("src");
        if ($(this).attr("src").indexOf("Shared/Icons/Source") != -1) {
            $(this).replaceWith("<div class=\"class_icon\">" + $(this).clone().wrap('<p>').parent().html() + "</div>");
        }
    });

    $("body").click(function () {
        $("#sidebar").hide();
    });

    $("#jumplink").click(function (e) {
        e.stopPropagation();
    });

    $("#sidebar").click(function (e) {
        e.stopPropagation();
    });

    getSelector("OS");
    getSelector("DCC");

    $(".slider").each(function(){
        var info = $(this).attr("class");
        info = info.substring(info.indexOf(" ") + 1);
        var maxVal = info.substring(0, info.indexOf(" "));
        info = info.substring(info.indexOf(" ") + 1);
        var ext = info.substring(0, info.indexOf(" "));
        info = info.substring(info.indexOf(" ") + 1);
        var id = info;
        $(this).attr({ "class": id+"_slider" });
		
		// append initial image from the hidden div
		$("p", $(this).prev()).html($("p > img:first-child", $(this).next().next()));
		
        $(this).slider({
            value: 1,
            min: 1,
            max: maxVal,
            step: 1,
            slide: function (event, ui) {
                var path = $("." + id + ">p>img").attr("src");
                path = path.replace(/\\/g, "/");
                path = path.substring(0, path.lastIndexOf("/") + 1);
                $("." + id + ">p>img").attr({ "src": path + id + "_" + ui.value + "." + ext });
            }
        });
    });

    setLayout();

    $('.lightbox a').fancybox({
        'overlayColor':"#777",
        'overlayOpacity':0.75,
        'titlePosition':"over",
        'padding': 0,
        'margin':0,
        'centerOnScroll':true
    });

    $('.expandable').each(function () {
        $(this).parent().click(function () {
            expand($(this).children('.title'));
        });
    });

    $('.expanded').each(function () {
        $(this).parent().click(function () {
            collapse($(this).children('.title'));
        });
    });

    function expand(elem) {
        $(elem).removeClass('expandable');
        $(elem).addClass('expanded');
        $(elem).parent().siblings('.content').show();
        //updateLayout();
        $(elem).parent().click(function () {
            collapse(elem);
        });
    }

    function collapse(elem) {
        $(elem).removeClass('expanded');
        $(elem).addClass('expandable');
        $(elem).parent().siblings('.content').hide();
        //updateLayout();
        $(elem).parent().click(function () {
            expand(elem);
        });
    }

    function setLayout() {
        /*$('.features').masonry({
        // options
        itemSelector: '.feature_item'
        });*/

       /* $('.topics .subs .container').masonry({
            // options
            itemSelector: 'IMG'
        });*/

        /*$('.topics .content').masonry({
        // options
        itemSelector: 'LI'
        });*/

        /*$('.topics').masonry({
            // options
            itemSelector: '.topic_item',
            columnWidth: function (containerWidth) {
                return containerWidth / 2;
            },
            isAnimated: true,
            animationOptions: {
                duration: 400
            }
        });*/
    }

    function updateLayout() {
        $('.topics .content').masonry('reload');
        $('.topics').masonry('reload');
    }


    if (bDoIndents) {
        $("#maincol").children().each(function () {
            var tag = $(this).get(0).tagName;

            if (tag == "H1") {
                level = 1;
            }
            else if (tag == "H2") {
                level = 2;
            }
            else if (tag == "H3") {
                level = 3;
                $(this).css("margin-left", "13px");
            }
            else if (tag == "H4") {
                level = 4;
                $(this).css("margin-left", "28px");
            }
            else if (tag == "H5") {
                level = 5;
                $(this).css("margin-left", "43px");
            }
            else if (tag == "H6") {
                level = 6;
                $(this).css("margin-left", "58px");
            }
            else if (level > 2) {
                $(this).css("margin-left", ((level - 2) * 15) + "px");
            }
        });
    }

    var selector = '.crumbs';

    var offset = $(selector).offset();

    var scrollNav = false;

    $(window).scroll(function () {
        if (scrollNav && offset) {
            var scroll = $(window).scrollTop();
            var position = offset.top - scroll;
            if (position < 0) {
                $(selector).css('position', 'absolute');
                $(selector).css('top', scroll + 2);
                $('#crumbs_bg').css('opacity', 0.5);
                $('#crumbs_bg').height($(selector).outerHeight() + 6);
            }
            else {
                $(selector).css('position', 'relative');
                $(selector).css('top', 2);
                $('#crumbs_bg').css('opacity', 0.0);
            }
            $(selector).width(1172);
        }
    });

    function CheckVertical(element) {
        var WindowTop = $(window).scrollTop();
        var WindowBottom = WindowTop + $(window).height();

        var ElementTop = $(element).offset().top;
        var ElementBottom = ElementTop + $(element).outerHeight();

        return ((WindowTop < ElementTop) && (WindowBottom > ElementBottom));
    }

    function CheckHorizontal(element) {
        var WindowLeft = $(window).scrollLeft();
        var WindowRight = WindowLeft + $(window).width();

        var ElementLeft = $(element).offset().left;
        var ElementRight = ElementLeft + $(element).outerWidth();

        return ((WindowLeft < ElementTop) && (WindowRight > ElementBottom));
    }

    function PositionElement(selector, offset, width, height, padding) {
        var top;
        var left;

        if ($(window).scrollLeft() + $(window).width() - (offset.left + width + padding) < $(selector).outerWidth()) {
            left = $(window).scrollLeft() + $(window).width() - $(selector).outerWidth();
            if (left < 0) {
                left = 0;
            }

        }
        else {
            left = offset.left + width + padding;
        }
        $(selector).css('left', left);

        if ($(window).width() - offset.left + width + padding < $(selector).outerWidth()) {
            top = offset.top + height + padding;
        }
        else {
            top = offset.top;
        }
        $(selector).css('top', top);

        if (!CheckVertical(selector)) {
            top = offset.top - $(selector).outerHeight() - padding;
        }
        $(selector).css('top', top);
    }

    //$('.infolink').each(function () {
    //    $(this).mouseover(function () {
    //        var offset = $(this).offset();
    //        var selector = '#' + $(this).attr('id') + 'info';
    //        PositionElement(selector, offset, $(this).width(), $(this).height(), 12);
    //    });
    //});

    //$('.infolink').each(function () {
    //    $(this).mouseout(function () {
    //        var selector = '#' + $(this).attr('id') + 'info';
    //        $(selector).css('left', -9999);
    //        $(selector).css('top', -9999);
    //    });
    //});
}

function sectionOnClick(heading, id)
{
	if($('#' + id).is(':visible'))
	{
		$('#' + id).hide();
		$(heading).removeClass('expanded');
		$(heading).addClass('expandable');
	}
	else
	{
		$('#' + id).show();
		$(heading).removeClass('expandable');
		$(heading).addClass('expanded');
	}
}

function hierarchyOnClick(id)
{
	var button = document.getElementById(id + '_button');
	var contents = document.getElementById(id);
	if(contents.className == "hierarchy-table-collapsed")
	{
		button.className="hierarchy-button-expanded";
		contents.className = "hierarchy-table";
	}
	else
	{
		button.className="hierarchy-button-collapsed";
		contents.className = "hierarchy-table-collapsed";
	}
}

function toggleAnimImage(exp)
{
    var still = document.getElementById(exp + "_still");
    var anim = document.getElementById(exp + "_anim");

    if(anim.style.display == "none")
    {
        still.style.display = "none";
        anim.style.display = "block";
    }
    else
    {
        still.style.display = "block";
        anim.style.display = "none";
    }
}

function ToggleTab(newOS) {
    if (newOS == "windows") {
        $('.tab.windows').addClass("active_tab");
        $('.tab.mac').removeClass("active_tab");
        $('.tab.linux').removeClass("active_tab");
        setTimeout(function () { $('.tab_content.windows').addClass("active_tab_content").hide().delay(1).show(); }, 1);
        //$('.tab_content.windows').hide().delay(1).show().addClass("active_tab_content");
        $('.tab_content.mac').hide().removeClass("active_tab_content");
        $('.tab_content.linux').hide().removeClass("active_tab_content");
    }
    else if (newOS == "mac") {
        $('.tab.mac').addClass("active_tab");
        $('.tab.windows').removeClass("active_tab");
        $('.tab.linux').removeClass("active_tab");
        setTimeout(function () { $('.tab_content.mac').addClass("active_tab_content").hide().delay(1).show(); }, 1);
        //$('.tab_content.mac').hide().delay(1).show().addClass("active_tab_content");
        $('.tab_content.windows').hide().removeClass("active_tab_content");
        $('.tab_content.linux').hide().removeClass("active_tab_content");
    }
    else if (newOS == "linux") {
        $('.tab.linux').addClass("active_tab");
        $('.tab.mac').removeClass("active_tab");
        $('.tab.windows').removeClass("active_tab");
        $('.tab_content.linux').hide().delay(1).show().addClass("active_tab_content");
        $('.tab_content.mac').hide().removeClass("active_tab_content");
        $('.tab_content.windows').hide().removeClass("active_tab_content");
    }
}

function ToggleButton(category, newButton) {
    $('.button').each(function () {
        if ($(this).hasClass(category) && $(this).hasClass(newButton)) {
            $(this).addClass("active_button");
        }
        else if ($(this).hasClass(category)) {
            $(this).removeClass("active_button");
        }
    });
    $('.button_content').each(function () {
        if ($(this).hasClass(category) && $(this).hasClass(newButton)) {
            setTimeout(function () { $('.button_content.' + newButton).addClass("active_button_content").hide().delay(1).show(); }, 1);
        }
        else if ($(this).hasClass(category)) {
            $(this).hide().removeClass("active_button_content");
        }
    });
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

var defaultSelectors = { "DCC": "maya", "OS": "windows" };

function setSelector(category, newSelector) {
    eraseCookie("doc_" + category + "_Selector");
    createCookie("doc_" + category + "_Selector", newSelector, 30);
    ToggleButton(category, newSelector);
}

function getSelector(category) {
    var selector = readCookie("doc_" + category + "_Selector");
    ToggleButton(category, selector == null ? defaultSelectors[category] : selector);
}