// ==UserScript==
// @name         GitHub beta tree fix
// @version      0.1
// @description  Make the GitHub beta file tree resizable
// @author       bepa01
// @match        https://github.com/*/pull/*/files
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create the draggable part
    var styleElem = document.head.appendChild(document.createElement("style"));
    styleElem.innerHTML = `
        .Layout-sidebar>div::after { 
            content: ''; 
            position: absolute; 
            left: calc(100% - 10px); 
            top: 0; width: 10px; 
            height: 100%; 
            cursor: ew-resize;
        }
    `;

    // Cache element references
    var layout = document.querySelector('.Layout');
    var target = document.querySelector(".Layout-sidebar>div");

    // Reload saved width, if any
    var savedWidth = localStorage.getItem("sidebar-width");
    if(!!savedWidth) {
        layout.style.setProperty('--Layout-sidebar-width', savedWidth + "px");
    }

    // Handle dragging events
    var startingMousePosition;
    var width = parseInt(window.getComputedStyle(layout).getPropertyValue("--Layout-sidebar-width").slice(0, -2));

    function resize(mouseEvent){
        var dx = mouseEvent.x - startingMousePosition;
        startingMousePosition = mouseEvent.x;
        width += dx;
        layout.style.setProperty('--Layout-sidebar-width', width + "px");
    }

    target.addEventListener("mousedown", function(mouseEvent){
        startingMousePosition = mouseEvent.x;
        document.addEventListener("mousemove", resize, false);
    }, false);

    document.addEventListener("mouseup", function(){
        document.removeEventListener("mousemove", resize, false);
        localStorage.setItem("sidebar-width", width);
    }, false);
})();