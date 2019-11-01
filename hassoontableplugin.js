/**
 * 
 * @param {string} selector A CSS selector
 * @param {object} config configuration object: {drag:boolean, resize: boolean}
 * @returns void
 */
function tablePlugin(selector, config){
    function addStylesheetRules () {
      var styleEl = document.querySelector("#mytable-stylesheet");
      if(!styleEl){
          styleEl = document.createElement('style');
          styleEl.setAttribute("type", "text/css");
          styleEl.id='table-plugin-stylesheet'; 
          document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = `.th-highlight-left,
      .td-highlight-left{
          border-left:10px solid #fffa90 !important;/**/
      }
      .th-highlight-right,
      .td-highlight-right{
          border-right:10px solid #fffa90 !important;/**/
      }
      thead .has-resizer{
          position:relative !important;/**/
      }
      thead .has-resizer div.column-resizer{
        position: absolute !important;
        right: -4px !important;
        top: 0 !important;
        width: 1px;
        height: 100% !important;
        cursor: col-resize !important;
        border-left: 1px solid rgba(0, 0, 0, 0.05) !important;
        background: transparent;
        border: none !important;
        justify-content: center;
        z-index: 999;
        padding: 0 3px;
      }
      thead .has-resizer div.column-resizer::before{
        content: ' ';
        display:block;
        border-right: 5px solid transparent;
        border-top: 8px solid #000000;
        border-bottom: 0px solid transparent;
        border-left: 5px solid transparent;
        width: 1px;
        height: 0px;
        position: absolute;
        left: -2px;
        top: -9px;
        visibility:hidden;
      }
      thead .has-resizer div.column-resizer:hover::before{
        visibility:visible;
      }
      .customizable-table-drag-img{
          position:fixed !important;
          left:99999px !important;
      }
      .customizable-table thead > tr > *,
      .customizable-table tbody > tr > *{
          /*overflow: hidden !important;*/
          /*text-overflow: ellipsis !important;*/
          /*white-space:nowrap !important;*/
      }
      .customizable-table thead > tr > * > div.th-content-wrapper,
      .customizable-table tbody > tr > * > div.td-content-wrapper{
          overflow: hidden !important;/**/
          text-overflow: ellipsis !important;/**/
          white-space: nowrap !important;/**/
      }

      .customizable-table thead > tr > * > div.th-content-wrapper{
        pointer-events:none !important;/**/
      }

      .customizable-table{
        table-layout:fixed !important;/**/
      }
      .customizable-table thead > tr > * > div.th-content-wrapper *,
      .customizable-table tbody > tr > * > div.td-content-wrapper *{
          overflow: hidden !important;/**/
          text-overflow: ellipsis; !important;/**/
          white-space: nowrap !important;/**/
      }`;
    }
    /////////
    /**START Drag event handlers**/
    function dragstartHandler(event){
        console.log("dragstartHandler target = ",event.target);
        dragstartTarget = event.target;
        if(dragstartTarget.classList.contains("has-resizer")){// event.target is a treated th element ?
            dragstartTh = dragstartTarget;
            /*Start Remove old drag image element*/
            var oldImgTable = document.querySelector(".customizable-table-drag-img");
            if(oldImgTable){
                oldImgTable.parentNode.removeChild(oldImgTable);
            }
            /*END Remove old drag image element*/
        
            /**START generate drag image**/
            var currentTh = event.target;
            var targetIndex = currentTh.dataset.elementId;
            var imgTable = document.querySelector('.customizable-table').cloneNode(true);
            imgTable.classList.add("customizable-table-drag-img");
        
            var thElements = imgTable.querySelectorAll("thead > tr > *:not(:nth-child("+targetIndex+"))");
            for(var index = 0; index < thElements.length; index++){
                var thElement = thElements[index];
                thElement.parentNode.removeChild(thElement);
            }
        
            var tdElements = imgTable.querySelectorAll("tbody > tr > *:not(:nth-child("+targetIndex+"))");
            for(var index = 0; index < tdElements.length; index++){
                var tdElement = tdElements[index];
                tdElement.parentNode.removeChild(tdElement);
            }
        
            var resizableTh = imgTable.querySelector("thead > tr > *.has-resizer");
            if(!config || config.resize){
                var columnResizer = imgTable.querySelector("thead > tr > *.has-resizer > .column-resizer");
                resizableTh.removeChild(columnResizer);
            }
            imgTable.style.cssText += "width:" + currentTh.offsetWidth + 'px !important';
        
            document.body.appendChild(imgTable);
            event.dataTransfer.setData("text/plain", event.target.dataset.elementId);
            event.dataTransfer.setDragImage(imgTable,-5,-5);
            /**END generate drag image**/
            resizeMode = false;
        }
        else if(dragstartTarget.classList.contains("column-resizer")){
            event.stopPropagation();
            //console.log('drahstart screenX = ',event.screenX);
            dragstartThToResize = dragstartTarget.parentNode;
            dragstartThInitWidth = dragstartThToResize.offsetWidth;

            dragstartThToResizeNextElement = dragstartThToResize.nextElementSibling;
            if(dragstartThToResizeNextElement){
                dragstartThNextElementInitWidth = dragstartThToResizeNextElement.offsetWidth;
            }
            else{
                dragstartThNextElementInitWidth = undefined;
            }

            dragstartScreenX = event.screenX;

            /*Start Remove old drag image element*/
            var oldImgResizer = document.querySelector(".customizable-table-resize-img");
            if(oldImgResizer){
                oldImgResizer.parentNode.removeChild(oldImgResizer);
            }
            /*END Remove old drag image element*/
            
            resizeMode = true;
        }
    }
    /////////
    function dragenterHandler(event){
        if(!resizeMode){
            if(!config || config.drag){

            
            var currentTh = event.target; 
            if(currentTh.classList.contains("has-resizer")){// event.target is a treated th element ?
                //console.log("dragenterHandler currentTh: ", currentTh);
                //console.log("dragstartTh: ", dragstartTh);
                //console.log(dragstartTh === currentTh);
                //console.log("_________________");
                var currentId = currentTh.dataset.elementId;
                var dragstartId = dragstartTh.dataset.elementId;
                if(parseInt(dragstartId) < parseInt(currentId)){//insert after
                    //currentTh.style.borderRight = "10px solid #fffa90";
                    currentTh.classList.remove('th-highlight-left');
                    currentTh.classList.add('th-highlight-right');
                    var tdElements = table.querySelectorAll("tbody > tr > *:nth-child("+currentId+")");
                    for(var index = 0; index < tdElements.length; index++){
                        var tdElement = tdElements[index];
                        //tdElement.style.borderRight = "10px solid #fffa90";
                        tdElement.classList.remove('th-highlight-left');
                        tdElement.classList.add('th-highlight-right');
                        //console.log("tdElement: ", tdElement);
                    }
                }
                else if(parseInt(dragstartId) > parseInt(currentId)){//insert before
                    //currentTh.style.borderLeft = "10px solid #fffa90";
                    currentTh.classList.remove('th-highlight-right');
                    currentTh.classList.add('th-highlight-left');
                    var tdElements = table.querySelectorAll("tbody > tr > *:nth-child("+currentId+")");
                    for(var index = 0; index < tdElements.length; index++){
                        var tdElement = tdElements[index];
                        //tdElement.style.borderLeft = "10px solid #fffa90";
                        tdElement.classList.remove('th-highlight-right');
                        tdElement.classList.add('th-highlight-left');
                        //console.log("tdElement: ", tdElement);
                    }
                }
            }
            }
        }
        else{

        }
        
    }
    ////////
    function dragleaveHandler(event){
        if(!resizeMode){
            if(!config || config.drag){
                var currentTh = event.target; 
                if(currentTh.classList.contains("has-resizer")){// event.target is a treated th element ?
                    //console.log("dragleaveHandler currentTh: ", currentTh);
                    //console.log("dragstartTh: ", dragstartTh);
                    //console.log(dragstartTh === currentTh);
                    //console.log("_________________");
                    var currentId = currentTh.dataset.elementId;
                    var dragstartId = dragstartTh.dataset.elementId;
                    if(parseInt(dragstartId) < parseInt(currentId)){
                        //currentTh.style.borderRight = "";
                        currentTh.classList.remove('th-highlight-right');
                        var tdElements = table.querySelectorAll("tbody > tr > *:nth-child("+currentId+")");
                        for(var index = 0; index < tdElements.length; index++){
                            var tdElement = tdElements[index];
                            tdElement.classList.remove('th-highlight-right');
                            //console.log("tdElement: ", tdElement);
                        }
                    }
                    else if(parseInt(dragstartId) > parseInt(currentId)){
                        //currentTh.style.borderLeft = "";
                        currentTh.classList.remove('th-highlight-left');
                        var tdElements = table.querySelectorAll("tbody > tr > *:nth-child("+currentId+")");
                        for(var index = 0; index < tdElements.length; index++){
                            var tdElement = tdElements[index];
                            tdElement.classList.remove('th-highlight-left');
                            //console.log("tdElement: ", tdElement);
                        }
                    }
                }
            }
        }
        else{

        }
    }
    ////////
    function dragoverHandler(event){
        event.preventDefault();
        //console.log('dragover screenX = ',event.screenX);
        if(resizeMode){
            var currentScreenX = event.screenX;
            var xDiff = currentScreenX - dragstartScreenX;
            var newWidth = dragstartThInitWidth + xDiff;
            var newWidthNextTh;
            if(dragstartThNextElementInitWidth){
                newWidthNextTh = (dragstartThNextElementInitWidth - xDiff);
            }

            if( (newWidth >= 40) /*&& (newWidthNextTh === undefined || newWidthNextTh >= 40)*/ ){
                console.log("currentScreenX = ", currentScreenX);
                console.log("dragstartScreenX = ", dragstartScreenX);
                console.log("newWidth = ", newWidth);
                console.log("dragstartThInitWidth = ", dragstartThInitWidth);
                
                console.log("_________________");
                dragstartThToResize.style.cssText +=  'width:'+(newWidth)+"px !important";
                if(dragstartThToResize.firstElementChild){
                    dragstartThToResize.firstElementChild.style.cssText +=  'width:'+(newWidth)+"px !important";
                }
                var cellIndex = dragstartThToResize.dataset.elementId;
                var tdElements = table.querySelectorAll("tbody > tr > *:nth-child("+cellIndex+")");
                for(var index = 0; index < tdElements.length; index++){
                    var tdElement = tdElements[index];
                    tdElement.style.cssText +=  'width:'+(newWidth)+"px !important";
                    if(tdElement.firstElementChild){
                        tdElement.firstElementChild.style.cssText +=  'width:'+(newWidth)+"px !important";
                    }
                }

                /*if (newWidthNextTh >=40){ //cancelled for a later update
                    console.log("newWidthNextTh = ", newWidthNextTh);
                    dragstartThToResizeNextElement.style.cssText +=  'width:'+(newWidthNextTh)+"px !important";
                    if(dragstartThToResizeNextElement.firstElementChild){
                        dragstartThToResizeNextElement.firstElementChild.style.cssText +=  'width:'+(newWidthNextTh)+"px !important";
                    }
                    var cellIndex = dragstartThToResizeNextElement.dataset.elementId;
                    var tdElements = table.querySelectorAll("tbody > tr > *:nth-child("+cellIndex+")");
                    for(var index = 0; index < tdElements.length; index++){
                        var tdElement = tdElements[index];
                        tdElement.style.cssText +=  'width:'+(newWidthNextTh)+"px !important";
                        if(tdElement.firstElementChild){
                            tdElement.firstElementChild.style.cssText +=  'width:'+(newWidthNextTh)+"px !important";
                        }
                    }
                }*/
            }
        }

        else{ //nothing? :p

        }
    }
    ////////
    function dropHandler(event){
        if(!resizeMode){
            if(!config || config.drag){

            
        //console.log('drop target = ', event.target);
        event.preventDefault();
        var currentTh = event.target;
        var currentId = parseInt(currentTh.dataset.elementId);
        console.log("currentTh = ", currentTh);
        console.log("currentId = ", currentId);
        var dragstartId = parseInt(dragstartTh.dataset.elementId);
        if(currentTh.classList.contains("has-resizer")){// event.target is a treated th element ?
            if(dragstartId != currentId){
                
                var tableTheadRow = table.querySelector("thead > tr");
                var tableTbodyRows = table.querySelectorAll("tbody > tr");
                if( dragstartId < currentId ){ //insert after
                    //console.log("drop (After) here!");
                    currentTh.parentNode.insertBefore(dragstartTh, currentTh.nextElementSibling);
                    for(var index = 0; index < tableTbodyRows.length; index++){
                        var tableTbodyRow = tableTbodyRows[index];
                        var currentTd = tableTbodyRow.children[currentId - 1];
                        var dragstartTd = tableTbodyRow.children[dragstartId - 1];
                        currentTd.parentNode.insertBefore(dragstartTd, currentTd.nextElementSibling);
                    }
                }
                else if(dragstartId > currentId){//insert before
                    //console.log("drop (Before) here!");
                    currentTh.parentNode.insertBefore(dragstartTh, currentTh);
                    for(var index = 0; index < tableTbodyRows.length; index++){
                        var tableTbodyRow = tableTbodyRows[index];
                        var currentTd = tableTbodyRow.children[currentId - 1];
                        var dragstartTd = tableTbodyRow.children[dragstartId - 1];
                        currentTd.parentNode.insertBefore(dragstartTd, currentTd);
                    }
                }

                var thElements = table.querySelectorAll('thead > tr > *');
                for(var index = 0; index < thElements.length; index++){
                    var thElement = thElements[index];
                    thElement.dataset.elementId = (index+1);
                }
            }
            else{
                console.log("NO drop here!");
            }
            var markedCells = document.querySelectorAll('.th-highlight-right,.td-highlight-right,.th-highlight-left,.td-highlight-left');
            for(var index = 0; index < markedCells.length; index++){
                var markedCell = markedCells[index];
                markedCell.classList.remove("th-highlight-right");
                markedCell.classList.remove("td-highlight-right");
                markedCell.classList.remove("th-highlight-left");
                markedCell.classList.remove("td-highlight-left");
            }
        }   
        }
        }
        else{ //nothing? :p
            console.log("HERE :D");
        }
        resizeMode = false;
    }
    /**END Drag event handlers**/

    addStylesheetRules();
    var table;
    var dragstartTh;
    var dragstartThToResize;
    var dragstartThToResizeNextElement;
    var dragstartScreenX;
    var dragstartThInitWidth;
    var dragstartThNextElementInitWidth;
    var resizeMode = false;
    table = document.querySelector(selector);
    if (table){
        table.classList.add('customizable-table');
        var thElements = table.querySelectorAll('thead > tr > *');
        for(var index = 0; index < thElements.length; index++){
            var thElement = thElements[index];
            var columnResizer = thElement.querySelector("div.column-resizer");
            var thContentWrapper = thElement.querySelector("div.th-content-wrapper");
            thElement.dataset.elementId = (index+1);
            if(!config || config.drag){
                thElement.setAttribute("draggable", "true");
            }

            if(!thContentWrapper){//column content wrapper not set? set it!
                thContentWrapper = document.createElement("div");
                thContentWrapper.className = 'th-content-wrapper';
                while(thElement.childElementCount > 0){
                    thContentWrapper.appendChild(thElement.firstElementChild);
                }
                if(thElement.innerHTML){
                    thContentWrapper.insertAdjacentHTML("beforeend", thElement.innerHTML);
                    thElement.innerHTML = '';
                }
                
                thElement.appendChild(thContentWrapper);
            }
            var tdElements = table.querySelectorAll("tbody > tr > *:nth-child("+(index+1)+")");
            for(var index2 = 0; index2 < tdElements.length; index2++){
                var tdElement = tdElements[index2];
                var tdContentWrapper = tdElement.querySelector("div.td-content-wrapper");
                if(!tdContentWrapper){//column content wrapper not set? set it!
                    tdContentWrapper = document.createElement("div");
                    tdContentWrapper.className = 'td-content-wrapper';
                    while(tdElement.childElementCount > 0){
                        tdContentWrapper.appendChild(tdElement.firstElementChild);
                    }
                    if(tdElement.innerHTML){
                        tdContentWrapper.insertAdjacentHTML("beforeend", tdElement.innerHTML);
                        tdElement.innerHTML = '';
                    }
                    
                    tdElement.appendChild(tdContentWrapper);
                }
            }
            
            if(!columnResizer){//resizer not set? set it!
                columnResizer = document.createElement("div");
                columnResizer.className = 'column-resizer';
                columnResizer.setAttribute("draggable", "true");
                if(!config || config.resize){
                thElement.appendChild(columnResizer);
                }
                thElement.classList.add('has-resizer');
            }
            
            /*START Reset DragEvent listeners*/
            thElement.removeEventListener("dragstart", dragstartHandler);
            thElement.removeEventListener("dragenter", dragenterHandler);
            thElement.removeEventListener("dragleave", dragleaveHandler);
            thElement.removeEventListener("dragover", dragoverHandler);
            thElement.removeEventListener("drop", dropHandler);
            document.removeEventListener("dragover", dragoverHandler);
            /*END Reset DragEvent listeners*/

            thElement.addEventListener("dragstart", dragstartHandler);
            thElement.addEventListener("dragenter", dragenterHandler);
            thElement.addEventListener("dragleave", dragleaveHandler);
            thElement.addEventListener("dragover", dragoverHandler);
            thElement.addEventListener("drop", dropHandler);
            document.addEventListener("dragover", dragoverHandler);
        }   
    }
}