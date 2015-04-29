window.onload = function(){
    var frameId = window.frameElement && window.frameElement.id || '';
    var parentDiv = frameId.replace('_iframe', '');
    var box_height = parseInt($('.box').height());
    if (box_height >= 300){
        $(window.parent.document).find('#'+parentDiv + ' .jqe-ui-jLayer-layer-body').height(box_height+65);
        $(window.parent.document).find('#'+parentDiv).height(box_height+115);
    }
    else if (box_height < 300 && box_height > 200 ){
        $(window.parent.document).find('#'+parentDiv + ' .jqe-ui-jLayer-layer-body').height(box_height+110);
        $(window.parent.document).find('#'+parentDiv).height(box_height+175);
    }
    else {
        $(window.parent.document).find('#'+parentDiv + ' .jqe-ui-jLayer-layer-body').height(box_height+150);
        $(window.parent.document).find('#'+parentDiv).height(box_height+215);
    }
    $(window.parent.document).find('#'+parentDiv).css("display", "block");
}
