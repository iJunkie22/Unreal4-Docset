//jQuery extension to check if an object matching a selector exists in the page.
$.fn.exists = function () {
    return this.length !== 0;
}

//Attach the handler function to the window's popstate event.
//This handler executes when the back button is pressed to reload the page data.
$(window).on("popstate", function (e) {
    var location = history.location || document.location;
    LoadPage(location.href);
});

var lang = "";
var preventDefault = true;

//function called on first page load to 
$(document).ready(function () {
    //Determine the language used on this page.
    var href = document.location.href;

    if (href.indexOf("CHN") > -1) {
        lang = "CHN";
    } else if (href.indexOf("JPN") > -1) {
        lang = "JPN";
    } else if (href.indexOf("INT") > -1) {
        lang = "INT";
    } else if (href.indexOf("KOR") > -1) {
        lang = "KOR";
    }

    //load the content of the navPanel
    $("#navPanel").load('/latest/' + lang + '/navTree.html', LoadNavTreeCallback);

    var ms_ie = false;
    var ua = window.navigator.userAgent;
    ms_ie = ~ua.indexOf('MSIE');
    if (ms_ie) {
        if (isIE() < 10) {
            //alert("We've detected that you're using an earlier than current version of Internet Explorer. For the best experience we recommend you update to the most recent version.");
        }
    }
});

function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

$(window).resize(function () {
    updateSiderbarHeight();
});

function updateSiderbarHeight() {
    if (typeof window.innerHeight != 'undefined') {
        navHeight = window.innerHeight - 65;
    }
    else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientHeight != 'undefined' && document.documentElement.clientHeight != 0) {
        navHeight = document.documentElement.clientHeight - 65;
    }
    else {
        navHeight = document.getElementsByTagName('body')[0].clientHeight - 65;
    }
    $('.menu_scroll').css('height', navHeight);
    $('#navPanel').css('height', navHeight);
}

//Callback function called after the nav tree div is populated.
function LoadNavTreeCallback() {
    //Attach our collapsibleList handlers to the list.
    CollapsibleLists.applyTo(document.getElementById('NavPanelList'), false, function () {
        CollapsibleLists.Toggle(document.getElementById('NavPanelList').getElementsByTagName('li')[0]);
    });

    //attach our new navPanel link handlers to override the standard link behaviour
    $("#navPanel").on("click", "a", NavBarLinkOnClick);
    $("#pagedefault").on("click", "a[href]:not([href*='#']):not(.localized_links a):not(.lightbox a)", PageLinkOnClick);
    $('ul').on("click", function (e) { e.stopPropagation; });

    //locate, style and scroll to the current link
    var href = document.location.href;
    if (href.indexOf(document.domain) > -1 || href.indexOf(':') === -1) {
        if (href.indexOf('#') > -1)
            href = href.substring(href.indexOf(document.domain) + document.domain.length, href.indexOf('#'));
        else {
            href = href.substring(href.indexOf(document.domain) + document.domain.length, href.length);
        }

        $(".selectedLink").attr("id", "");
        $(".selectedLink").removeClass("selectedLink");

        //update page title
        $('title').html('Unreal Engine | ' + $('h1').html());

        //ga('set', {
        //    location: document.location.href,
        //    title: $('h1').html()
        //});

        //ga('send', 'pageview');

        if (href.lastIndexOf('/') == href.length - 1) {
            href += "index.html";
        }
        var links = $("#navPanel a[href^='" + href + "']")
        if (links.length != 0) {
            var link = links.first();
            link.addClass("selectedLink");
            link.attr('id', 'currentLink');
            link.parents('li').each(function () {
                CollapsibleLists.Open($(this).get(0));
            });
            var scrollBarTop = $("#navPanel").offset().top;
            var currentLinkTop = $("#currentLink").offset().top;
            var scrollBarPosition = $("#navPanel").scrollTop();

            $("#navPanel").animate({ scrollTop: currentLinkTop - scrollBarTop - 50 + scrollBarPosition }, 1000);
        }

        updateSiderbarHeight();
    }
}

function NavBarLinkOnClick(event) {
    //don't load the link in the page normally
    if (preventDefault)
        event.preventDefault();
    else
        return true;

    //get the href
    var href = $(this).attr("href");

    //check if this is an external link
    var regExp = new RegExp("//" + location.host + "($|/)");
    if (href.substring(0, 4) === "http" ? !regExp.test(href) : false) {
        //if it is trigger the normal click event and return
        preventDefault = false;
        $(event.target).trigger("click");
        return;
    }

    //push the location onto the history stack
    history.pushState({}, '', href);

    //load the new page content
    LoadPage(href, event, false);

    $(window).scrollTop(0);
}

function PageLinkOnClick(event) {
    //don't load the link in the page normally
    if (preventDefault)
        event.preventDefault();
    else
        return true;

    //get the href
    var href = $(this).attr("href");

    //check if this is an external link
    var regExp = new RegExp("//" + location.host + "($|/)");
    if (href.substring(0, 4) === "http" ? !regExp.test(href) : false) {
        //if it is trigger the normal click event and return
        preventDefault = false;
        $(event.target).trigger("click");
        return;
    }

    //push the location onto the history stack
    history.pushState({}, '', href);

    //load the new page content
    LoadPage(href, event, true);

    $(window).scrollTop(0);
}

//This function replaces the text
function LoadPage(href, e, scrollTo) {
    var location = document.location.href;
    $("#pagedefault").load(location + " #pagedefault>*", function (responseText, textStatus, req) {
        //check for errors in loading
        if (textStatus == "error") {
            //handle 404
            if (req.status == 404) {
                $("#pagedefault").load("/latest/" + lang + "/404.html");
                return;
            }
            else if (req.status == 0) {
                preventDefault = false;
                $(e.target).trigger("click");
                return;
            }
        }

        //once the load is complete push the new link to the top of history stack
        //and attach our new click handlers.
        $('#jumplink').click(function (event) {
            event.stopPropagation();
            $('#sidebar').show();
        });
        $('#sidebar').hide();

        //check to see if this is a internal page link, if it is, trim the link so we can
        //find it in the navBar
        var stringStartIndex = location.indexOf(document.domain) + document.domain.length;

        //locate style and scroll to the current link
        if ((location.indexOf('#') > -1) && (location.indexOf(document.domain) > -1))
            location = location.substring(stringStartIndex, location.indexOf('#'));
        else if (location.indexOf(document.domain) > -1) {
            location = location.substring(stringStartIndex, location.length);
        }

        //remove styles from previous links.
        $(".selectedLink").attr("id", "");
        $(".selectedLink").removeClass("selectedLink");

        //update page title
        $('title').html('Unreal Engine | ' + $('h1').html());

        ga('set', {
            location: document.location.href,
            title: $('title').html()
        });

        ga('send', 'pageview');

        //find and style the new selected link
        var links = $("#navPanel a[href*='" + location + "']")

        if (links.length != 0) {
            var link = links.first();
            link.addClass("selectedLink");

            //expand the current link's div and all parent divs.
            link.attr('id', 'currentLink');
            link.parents('li').each(function () {
                CollapsibleLists.Open($(this).get(0));
            });
            CollapsibleLists.Open(link.closest('li').get(0));

            //scroll the link for the current page into view.
            var scrollBarTop = $("#navPanel").offset().top;
            var currentLinkTop = $("#currentLink").offset().top;
            var scrollBarPosition = $("#navPanel").scrollTop();

            if (scrollTo == true) {
                $("#navPanel").animate({ scrollTop: currentLinkTop - scrollBarTop - 50 + scrollBarPosition }, 500);
            }
        }

        PageReadyBase();
        PageReady();
        updateSiderbarHeight();
    });
}
